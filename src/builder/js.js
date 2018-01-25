/**
 * Created by axetroy on 2017/7/2.
 */
const path = require("path");
const { promisify } = require("util");
const webpack = promisify(require("webpack"));
const fs = require("fs-extra");
const babel = require("babel-core");
const utils = require("../utils");
const Builder = require("../Builder");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const CONFIG = require("../config")();

// 输出文件
const BUNDLE_FILENAME = "m.js";
// 缓存文件
const TEMP_FILENAME = "temp.js";

class Module {
  constructor() {
    this.id = 0;
    this.modules = [];
    this.runtime = ""; // webuild runtime code
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
  ${templates.join("\n")}

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
    await fs.writeFile(inputFile, this.content, "utf8");

    const outputPathInfo = path.parse(outputFile);

    // 使用webpack打包缓存文件
    await webpack({
      entry: inputFile,
      output: {
        path: outputPathInfo.dir,
        filename: outputPathInfo.name + outputPathInfo.ext,
        library: "g",
        libraryTarget: "commonjs2"
      },
      resolve: {
        modules: ["node_modules"],
        extensions: [".coffee", ".js", ".ts"]
      },
      module: {
        loaders: [
          {
            test: /\.(jsx|js)?$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel-loader"
          }
        ]
      },
      plugins: plugins.filter(v => v)
    });

    // 代码转化为ES5
    await this.transform(outputFile, outputFile);

    // 再一次打包
    await webpack({
      entry: outputFile,
      output: {
        path: outputPathInfo.dir,
        filename: outputPathInfo.name + outputPathInfo.ext,
        library: "g",
        libraryTarget: "commonjs2"
      },
      resolve: {
        modules: ["node_modules"],
        extensions: [".coffee", ".js", ".ts"]
      },
      module: {
        loaders: [
          {
            test: /\.(jsx|js)?$/,
            exclude: /(node_modules|bower_components)/,
            loader: "babel-loader"
          }
        ]
      },
      plugins: plugins
        .filter(v => v)
        // 生产环境下压缩
        .concat(
          CONFIG.isProduction
            ? [
                new UglifyJSPlugin({
                  uglifyOptions: {
                    ecma: 5,
                    compress: {
                      drop_console: true,
                      drop_debugger: true
                    }
                  }
                })
              ]
            : []
        )
    });
  }

  /**
   * transform the code the es5
   * @param inputFile
   * @param outputFile
   * @returns {Promise.<void>}
   */
  async transform(inputFile, outputFile) {
    await fs.ensureFile(inputFile);
    const result = await promisify(babel.transformFile)(inputFile, {
      env: {
        production: {
          presets: ["minify"]
        }
      },
      presets: ["flow", "env", "stage-1", "stage-2", "stage-3"],
      plugins: [
        [
          "transform-runtime",
          {
            helpers: false,
            polyfill: false,
            regenerator: true,
            moduleName: "babel-runtime"
          }
        ]
      ]
    });
    await fs.ensureFile(outputFile);

    // 如果没有编译过运行时代码，那么编译一次
    if (!this.runtime) {
      const globalFile = path.join(__dirname, "..", "runtime", "global.js");
      const runtime = await babel.transform(
        await fs.readFile(globalFile, "utf8"),
        {
          presets: ["env"]
        }
      );
      this.runtime = runtime.code;
    }

    await fs.writeFile(
      outputFile,
      ` /* Generate By webuild */
      
/* webuild runtime start */
${this.runtime}
/* webuild runtime end */
      
/* Source Code start */
;(function(global){
${result.code}
})(getGlobal());
/* Source Code end */
`
    );
  }
}

const webpackModule = new Module();

class JsBuilder extends Builder {
  constructor() {
    super();
    this.name = "js";
  }

  /**
   * 加载js文件
   * @param filePath 绝对路径
   */
  load(filePath) {
    webpackModule.load(filePath);
    this.files[filePath] = 1;
    // super.load(filePath); // it will trigger this.one() javascript compiler
  }

  /**
   * 卸载js文件
   * @param filePath 绝对路径
   */
  unload(filePath) {
    webpackModule.unload(filePath);
    super.unload(filePath);
  }

  one(absFilePath) {
    return this.all();
  }

  /**
   * 编译这些js文件
   * @returns {Promise.<void>}
   */
  async all() {
    try {
      // 把各文件移动到build目录下
      const files = [].concat(Object.keys(this.files));

      const absBundleFilePath = path.join(CONFIG.paths.dist, BUNDLE_FILENAME);

      await webpackModule.pack(
        absBundleFilePath,
        [
          new webpack.DefinePlugin({
            "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
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

        // 写入文件
        await fs.writeFile(
          absDistFilePath,
          `require("${utils.unixify(
            utils.resolveRequire(absDistFilePath, absBundleFilePath)
          )}")(${id});`,
          "utf8"
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = JsBuilder;
