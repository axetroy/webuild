/**
 * Created by axetroy on 2017/7/2.
 */
const path = require('path');
const webpack = require('webpack');
const fs = require('fs-extra');
const babel = require('babel-core');
const utils = require('../utils');
const Builder = require('../Builder');

const CONFIG = require('../config');

// 输出文件
const BUNDLE_FILENAME = 'm.js';
// 缓存文件
const TEMP_FILENAME = 'temp.js';

class Module {
  constructor() {
    this.id = 0;
    this.modules = [];
  }

  /*
  * 加载js文件
  * */
  load(filePath) {
    filePath = path.normalize(filePath);
    // 避免重复添加模块
    if (this.modules.findIndex(module => module.path === filePath) >= 0) {
      return;
    }
    this.modules.push({ path: filePath, id: this.id });
    this.id++;
  }

  /**
   * 卸载js文件
   * */
  unload(filePath) {
    const index = this.modules.findIndex(v => v.path === filePath);
    if (index >= 0) {
      this.modules.splice(index, 1);
    }
  }

  // 获取字段的id, 返回数字
  getFileId(filePath) {
    const m = this.modules.find(
      m => utils.unixify(m.path) === utils.unixify(filePath)
    );
    if (!m) return null;
    return m.id;
  }

  // 获取当前整合的内容
  get content() {
    const templates = this.modules.map(file => {
      return `
  /**
  Generate By Webpack Module
  file: ${file.path}
  id: ${file.id}
  **/
  webpackModule[${file.id}] = () => require("${utils.unixify(
        path.relative(CONFIG.paths.temp, file.path)
      )}");`;
    });

    return `// Generate By Webpack Module
module.exports = function(moduleId) {
  const webpackModule = {};
  ${templates.join('\n')}

  return webpackModule[moduleId] ? webpackModule[moduleId]() : {};
};`;
  }

  /**
   * 将js文件打包成1个文件
   * @param outputFile
   * @param plugins
   * @returns {Promise}
   */
  async pack(outputFile, plugins = []) {
    const inputFile = path.join(CONFIG.paths.temp, TEMP_FILENAME);

    // 创建缓存文件作为webpack的入口文件
    await fs.ensureFile(inputFile);
    await fs.writeFile(inputFile, this.content, 'utf8');

    const outputPathInfo = path.parse(outputFile);

    const WEBPACK_CONFIG = {
      entry: inputFile,
      output: {
        path: outputPathInfo.dir,
        filename: outputPathInfo.name + outputPathInfo.ext,
        library: 'g',
        libraryTarget: 'commonjs2'
      },
      resolve: {
        modules: ['node_modules'],
        extensions: ['.coffee', '.js', '.ts']
      },
      module: {
        loaders: [
          {
            test: /\.(jsx|js)?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader'
          }
        ]
      },
      plugins: plugins.filter(v => v)
    };

    // 使用webpack打包缓存文件
    await new Promise((resolve, reject) => {
      webpack(WEBPACK_CONFIG, function(err, stdout) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    await this.transform(outputFile, outputFile);
  }

  /**
   * transform the code the es5
   * @param inputFile
   * @param outputFile
   * @returns {Promise.<void>}
   */
  async transform(inputFile, outputFile) {
    await fs.ensureFile(inputFile);
    const result = await new Promise((resolve, reject) => {
      babel.transformFile(
        inputFile,
        {
          env: process.env,
          presets: ['env'].concat(CONFIG.isProduction ? ['minify'] : [])
        },
        function(err, result) {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
    await fs.ensureFile(outputFile);
    await fs.writeFile(
      outputFile,
      `// wrapper start
;(function(){


${result.code}


// wrapper end
})();`
    );
  }
}

const webpackModule = new Module();

// 生成js文件相对于main.js的路径，要require这个main.js
function getRelative(file) {
  return utils
    .unixify(path.relative(file, path.join(CONFIG.paths.dist, BUNDLE_FILENAME)))
    .replace(/^\.\.\//, './')
    .replace(/^\/?\.+\/?/, './');
}

class JsBuilder extends Builder {
  constructor() {
    super();
  }

  /**
   * 加载js文件
   * @param filePath 绝对路径
   */
  load(filePath) {
    super.load(filePath);
    webpackModule.load(filePath);
  }

  /**
   * 卸载js文件
   * @param filePath 绝对路径
   */
  unload(filePath) {
    super.load(filePath);
    webpackModule.unload(filePath);
  }

  /**
   * 编译这些js文件
   * @returns {Promise.<void>}
   */
  async compile() {
    try {
      // 把各文件移动到build目录下
      const files = [].concat(Object.keys(this.files));

      await webpackModule.pack(
        path.join(CONFIG.paths.dist, BUNDLE_FILENAME),
        [
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
          })
        ].concat(CONFIG.isProduction ? [] : [])
      );

      while (files.length) {
        const absSourceFilePath = files.shift();
        const relativeSourceFilePath = path.relative(
          CONFIG.paths.src,
          absSourceFilePath
        );
        const absDistFilePath = path.join(
          CONFIG.paths.dist,
          relativeSourceFilePath
        );

        // 获取该文件对应的id
        const id = webpackModule.getFileId(absSourceFilePath);

        // 确保输出文件存在
        await fs.ensureFile(absDistFilePath);

        // 引用主体包
        const requireFile = path.normalize(
          getRelative(absDistFilePath).replace(/\.js$/, '')
        );

        // 写入文件
        await fs.writeFile(
          absDistFilePath,
          `require("${utils.unixify(requireFile)}")(${id});`,
          'utf8'
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new JsBuilder();
