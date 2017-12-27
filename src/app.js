const path = require('path');
const chokidar = require('chokidar');
const { query } = require('./utils');
const CONFIG = require('./config');

class App {
  constructor() {
    this.builder = {};
  }
  dispatch(file, action) {
    const f = path.parse(file);

    let builder = null;

    switch (f.ext) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        builder = this.builder['js'];
        break;
      case '.css':
      case '.scss':
      case '.less':
      case '.sass':
      case '.wxss':
        builder = this.builder['css'];
        break;
      case '.xml':
      case '.wxml':
        builder = this.builder['xml'];
        break;
      case '.json':
        builder = this.builder['file'];
        break;
      case '.yaml':
      case '.yml':
        builder = this.builder['file'];
        break;
      case '.pmg':
      case '.jpg':
      case '.gif':
        builder = this.builder['file'];
        break;
      default:
        if (f.ext) {
          builder = this.builder['file'];
        }
    }

    if (builder) {
      builder[action](file);
    }
  }
  resolveBuilder(Builder) {
    const builder = new Builder();
    this.builder[builder.name] = builder;
    return this;
  }

  /**
   * compile a file
   * @param absFilePath
   */
  async compile(absFilePath) {
    const pathInfo = path.parse(absFilePath);
    let builder = null;
    switch (pathInfo.ext) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        builder = this.builder['js'];
        break;
      case '.css':
      case '.scss':
      case '.less':
      case '.sass':
      case '.wxss':
        builder = this.builder['css'];
        break;
      case '.xml':
      case '.wxml':
        builder = this.builder['xml'];
        break;
      case '.json':
        builder = this.builder['file'];
        break;
      case '.yaml':
      case '.yml':
        builder = this.builder['file'];
        break;
      case '.pmg':
      case '.jpg':
      case '.gif':
        builder = this.builder['file'];
        break;
      default:
        builder = this.builder['file'];
    }

    if (builder) {
      await builder.compile();
    }
  }

  /**
   * build project
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

    await Promise.all(builders.map(builder => this.builder[builder].compile()));
  }
  async dev() {
    await this.build(); // build one first

    const r = path.relative(process.cwd(), CONFIG.paths.src);

    const watcher = chokidar
      .watch(r, {
        ignored: /((^|[\/\\])\..)|(___jb_tmp___$)|(log$)/
      })
      .on('add', filePath => {
        console.info(`[ADD]: ${filePath}`);
        const absFilePath = path.join(process.cwd(), filePath);
        // load this new file
        this.dispatch(absFilePath, 'load');
        // recompile
        this.compile(absFilePath);
      })
      .on('change', filePath => {
        console.info(`[CHANGE]: ${filePath}`);
        const absFilePath = path.join(process.cwd(), filePath);
        // recompile
        this.compile(absFilePath);
      })
      .on('unlink', filePath => {
        console.info(`[DELETE]: ${filePath}`);
        const absFilePath = path.join(process.cwd(), filePath);
        // unload this file
        this.dispatch(absFilePath, 'unload');
        // recompile
        this.compile(absFilePath);
      });
  }
}

const app = new App();

app
  .resolveBuilder(require('./builder/js'))
  .resolveBuilder(require('./builder/css'))
  .resolveBuilder(require('./builder/xml'))
  .resolveBuilder(require('./builder/file'));

module.exports = app;
