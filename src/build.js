/**
 * Created by axetroy on 2017/7/2.
 */

process.on('SIGINT', () => {
  console.log(new Error(`Exist sigint`));
  process.exit(1);
});

const path = require('path');
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');

const JsBuilder = require('./build-js');
const XmlBuilder = require('./build-xml');
const CssBuilder = require('./build-css');
const FileBuilder = require('./build-file');

const { query } = require('./utils');
const CONFIG = require('./config');

/**
 * load up unload a file
 * @param file
 * @param action
 */
function handlerFile(file, action) {
  const f = path.parse(file);

  switch (f.ext) {
    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx':
      JsBuilder[action](file);
      break;
    case '.css':
    case '.scss':
    case '.less':
    case '.sass':
    case '.wxss':
      CssBuilder[action](file);
      break;
    case '.xml':
    case '.wxml':
      XmlBuilder[action](file);
      break;
    case '.json':
      FileBuilder[action](file);
      break;
    case '.yaml':
    case '.yml':
      FileBuilder[action](file);
      break;
    case '.pmg':
    case '.jpg':
    case '.gif':
      FileBuilder[action](file);
      break;
    default:
      if (f.ext) {
        FileBuilder[action](file);
      }
  }
}

/**
 * load a file
 * @param file
 */
function loadFile(file) {
  return handlerFile(file, 'load');
}

/**
 * unload a file
 * @param file
 */
function unloadFile(file) {
  return handlerFile(file, 'unload');
}

/**
 * compile a file
 * @param absFilePath
 */
const compile = debounce(function compile(absFilePath) {
  const pathInfo = path.parse(absFilePath);
  switch (pathInfo.ext) {
    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx':
      JsBuilder.compile();
      break;
    case '.css':
    case '.scss':
    case '.less':
    case '.sass':
    case '.wxss':
      CssBuilder.compile();
      break;
    case '.xml':
    case '.wxml':
      XmlBuilder.compile();
      break;
    case '.json':
      FileBuilder.compile();
      break;
    case '.yaml':
    case '.yml':
      FileBuilder.compile();
      break;
    case '.pmg':
    case '.jpg':
    case '.gif':
      FileBuilder.compile();
      break;
    default:
      FileBuilder.compile();
  }
}, 1000);

/**
 * run build task
 * @type {Function}
 */
async function build() {
  const files = await query(path.join(CONFIG.paths.src, '**', '*'), {});

  // 加载所有文件
  while (files.length) {
    const absFilePath = files.shift();
    loadFile(absFilePath);
  }

  // 真正的编译操作
  await Promise.all([
    JsBuilder.compile(),
    XmlBuilder.compile(),
    CssBuilder.compile(),
    FileBuilder.compile()
  ]);
}

async function dev() {
  await build();
  // One-liner for current directory, ignores .dotfiles
  chokidar
    .watch('src', { ignored: /((^|[\/\\])\..)|___jb_tmp___/ })
    .on('add', filePath => {
      console.info(`[ADD]: ${filePath}`);
      const absFilePath = path.join(process.cwd(), filePath);
      // load this new file
      loadFile(absFilePath);
      // recompile
      compile(absFilePath);
    })
    .on('change', filePath => {
      console.info(`[CHANGE]: ${filePath}`);
      const absFilePath = path.join(process.cwd(), filePath);
      // recompile
      compile(absFilePath);
    })
    .on('unlink', filePath => {
      console.info(`[DELETE]: ${filePath}`);
      const absFilePath = path.join(process.cwd(), filePath);
      // unload this file
      unloadFile(absFilePath);
      // recompile
      compile(absFilePath);
    });
}

module.exports = {
  build,
  dev
};
