const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const { query } = require('./utils');
const CONFIG = require('./config');

class App {
  constructor() {
    this.builder = {};
  }

  /**
   * 查找Builder
   * @param file
   * @returns {*}
   */
  findBuilder(file) {
    const f = path.parse(file);

    let builder = null;

    switch (f.ext) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        builder = 'js';
        break;
      case '.css':
      case '.scss':
      case '.less':
      case '.sass':
      case '.wxss':
        builder = 'css';
        break;
      case '.xml':
      case '.wxml':
        builder = 'xml';
        break;
      case '.json':
        builder = 'file';
        break;
      case '.yaml':
      case '.yml':
        builder = 'file';
        break;
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.mozjpeg':
      case '.gif':
      case '.svg':
      case '.webp':
        builder = 'image';
        break;
      default:
        if (f.ext) {
          builder = 'file';
        }
    }

    return this.builder[builder];
  }

  /**
   * 注册Builder
   * @param Builder
   * @returns {App}
   */
  register(Builder) {
    const builder = new Builder();
    this.builder[builder.name] = builder;
    return this;
  }

  /**
   * 派发事件
   * @param absFilePath
   * @param event {load/unload}
   */
  dispatch(absFilePath, event) {
    const builder = this.findBuilder(absFilePath);
    if (builder) {
      builder[event](absFilePath);
    }
  }

  /**
   * 单独编译一个文件
   * @param absFilePath
   * @returns {Promise.<void>}
   */
  async compile(absFilePath) {
    const builder = this.findBuilder(absFilePath);
    if (builder) {
      await builder.one(absFilePath);
    }
  }

  /**
   * 构建项目
   * @returns {Promise.<void>}
   */
  async build() {
    const files = await query(path.join(CONFIG.paths.src, '**', '*'), {});

    // 加载所有文件
    while (files.length) {
      const absFilePath = files.shift();
      this.dispatch(absFilePath, 'load');
    }

    const builders = Object.keys(this.builder);

    await Promise.all(builders.map(builder => this.builder[builder].all()));
  }

  /**
   * 开发项目
   * @returns {Promise.<void>}
   */
  async dev() {
    await this.build(); // build one first

    const r = path.relative(process.cwd(), CONFIG.paths.src);

    chokidar
      .watch(r, {
        ignored: /((^|[\/\\])\..)|(___jb_tmp___$)|(log$)/
      })
      .on('add', filePath => {
        console.info(`[ADD]: ${filePath}`);
        const absFilePath = path.join(process.cwd(), filePath);
        const stat = fs.statSync(absFilePath);
        if (stat.isFile()) {
          // load this new file
          this.dispatch(absFilePath, 'load');
        }
      })
      .on('change', filePath => {
        console.info(`[CHANGE]: ${filePath}`);
        const absFilePath = path.join(process.cwd(), filePath);
        const stat = fs.statSync(absFilePath);
        if (stat.isFile()) {
          // recompile
          this.compile(absFilePath).catch(err => {
            console.error(err);
          });
        }
      })
      .on('unlink', filePath => {
        console.info(`[DELETE]: ${filePath}`);
        const absFilePath = path.join(process.cwd(), filePath);
        // unload this file
        this.dispatch(absFilePath, 'unload');
      });
  }
}

const app = new App();

app
  .register(require('./builder/js'))
  .register(require('./builder/css'))
  .register(require('./builder/xml'))
  .register(require('./builder/file'))
  .register(require('./builder/image'));

module.exports = app;
