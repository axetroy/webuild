const path = require('path');
const fs = require('fs-extra');
const pd = require('pretty-data').pd;
const CONFIG = require('./config');

class Builder {
  constructor() {
    this.files = {};
    this.name = 'builder';
  }

  /**
   * 清空文件
   */
  clear() {
    this.files = {};
  }

  /**
   * 加载文件
   * @param filePath  文件的绝对路径
   */
  load(filePath) {
    this.files[filePath] = 1;
  }

  /**
   * 卸载文件
   * @param filePath 文件的绝对路径
   */
  unload(filePath) {
    this.files[filePath] = null;
    delete this.files[filePath];
  }

  /**
   * 构建单独一个文件
   * @param absFilePath
   * @returns {Promise.<void>}
   */
  async build(absFilePath) {
    const relativeFilePath = path.relative(CONFIG.paths.src, absFilePath);
    // 最终输出路径
    const distFilePath = path.join(CONFIG.paths.dist, relativeFilePath);
    fs.ensureFile(distFilePath).then(() => {
      fs.createReadStream(absFilePath).pipe(fs.createWriteStream(distFilePath));
    });
  }

  /**
   * compile
   * 默认的compile只会复制文件
   * @returns {Promise.<void>}
   */
  async compile() {
    const files = Object.keys(this.files);
    while (files.length) {
      let file = files.shift();
      this.build(file);
    }
  }
}

module.exports = Builder;
