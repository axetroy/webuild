/**
 * Created by axetroy on 2017/7/2.
 */
const path = require("path");
const { promisify } = require("util");
const _webpack = promisify(require("webpack"));
const fs = require("fs-extra");
const babel = require("@babel/core");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const utils = require("../utils");
const Builder = require("../Builder");

const CONFIG = require("../config")();
const paths = CONFIG.paths;

async function webpack(webpackConfig) {
  const stats = await _webpack(webpackConfig);
  const msg = stats.toString({ color: true });
  console.log(msg);
  return stats;
}

const SYNTAX_PLUGINS = [
  require("@babel/plugin-proposal-class-properties"),
  [
    require("@babel/plugin-proposal-decorators"),
    {
      legacy: true
    }
  ],
  require("@babel/plugin-proposal-do-expressions"),
  require("@babel/plugin-proposal-export-default-from"),
  require("@babel/plugin-proposal-export-namespace-from"),
  require("@babel/plugin-proposal-function-bind"),
  require("@babel/plugin-proposal-function-sent"),
  require("@babel/plugin-proposal-logical-assignment-operators"),
  require("@babel/plugin-proposal-nullish-coalescing-operator"),
  require("@babel/plugin-proposal-numeric-separator"),
  require("@babel/plugin-proposal-optional-chaining"),
  [
    require("@babel/plugin-proposal-pipeline-operator"),
    {
      proposal: "minimal"
    }
  ],
  require("@babel/plugin-proposal-throw-expressions")
];

const BABEL_OPTIONS = {
  presets: [require("@babel/preset-flow"), require("@babel/preset-env")],
  plugins: [
    require("@babel/plugin-transform-strict-mode"),
    ...SYNTAX_PLUGINS,
    [
      require("@babel/plugin-transform-runtime"),
      {
        corejs: false,
        helpers: false,
        regenerator: true,
        useESModules: false
      }
    ]
  ]
};

const WEBPACK_CONFIG = {
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          plugins: SYNTAX_PLUGINS
        }
      }
    ]
  },
  resolveLoader: {
    modules: [
      paths.node_modules,
      "node_modules",
      path.join(process.cwd(), "node_modules")
    ],
    extensions: [".js", ".jsx", ".json"],
    mainFields: ["loader", "main"]
  },
  node: {
    global: false,
    process: false
  },
  mode: CONFIG.isProduction ? "production" : "none"
};

// 输出文件
const BUNDLE_FILENAME = "m.js";
// 缓存文件
const TEMP_FILENAME = "temp.js";

class Module {
  constructor() {
    this.id = 0;
    this.modules = [];
    this.env = (() => {
      const env = {};
      for (let key in process.env) {
        if (process.env.hasOwnProperty(key)) {
          if (/WEBUILD_\w+/.test(key)) {
            env[key] = process.env[key];
          }
        }
      }
      env.NODE_ENV = env.NODE_ENV || "development";
      return env;
    })();
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
    return `// Generate By Webpack Module
module.exports = function(moduleId) {
  const webpackModule = {
    ${this.modules
      .map((file, i) => {
        const modulePath = utils.unixify(path.relative(CONFIG.paths.temp, file.path))
        return `
    "${file.id}": () => require("${modulePath}")`;
      })
      .join(",")}
  };
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

    // 使用webpack打包缓存文件
    await webpack({
      entry: inputFile,
      output: {
        path: path.dirname(outputFile),
        filename: path.basename(outputFile),
        library: "g",
        libraryTarget: "commonjs2"
      },
      plugins: plugins.filter(v => v),
      ...WEBPACK_CONFIG
    });

    // 代码转化为ES5
    await this.transform(outputFile, outputFile);

    // 这里再打包一次，把runtime给打包进来
    await webpack({
      entry: outputFile,
      output: {
        path: path.dirname(outputFile),
        filename: path.basename(outputFile),
        library: "g",
        libraryTarget: "commonjs2"
      },
      plugins: plugins.filter(v => v),
      ...WEBPACK_CONFIG
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
    const result = await promisify(babel.transformFile)(
      inputFile,
      BABEL_OPTIONS
    );
    await fs.ensureFile(outputFile);

    await fs.writeFile(
      outputFile,
      `/* Generate By webuild */      
/* Source Code start */
;!(function(process){
  ${result.code}
}).call(this, ${JSON.stringify({ env: this.env })});
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

      await webpackModule.pack(absBundleFilePath, [
        CONFIG.isProduction
          ? new UglifyJsPlugin({
              sourceMap: false,
              uglifyOptions: {
                ecma: 5,
                compress: {
                  drop_console: true
                }
              }
            })
          : void 0
      ]);

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
