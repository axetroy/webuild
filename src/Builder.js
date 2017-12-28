const path = require('path');
const fs = require('fs-extra');
const CONFIG = require('./config');

class Builder {
  constructor() {
    this.files = {};
    this.name = 'default';
    this.ouputExt = '';
  }

  /**
   * 加载文件
   * @param filePath  文件的绝对路径
   */
  load(filePath) {
    this.files[filePath] = 1;
    this.one(filePath);
  }

  /**
   * 卸载文件
   * @param filePath 文件的绝对路径
   */
  unload(filePath) {
    this.files[filePath] = null;
    delete this.files[filePath];

    // 最终输出路径
    const distFilePath = path.join(
      CONFIG.paths.dist,
      path.relative(CONFIG.paths.src, filePath)
    );

    const p = path.parse(distFilePath);

    // 如果经过转换后, 后缀名发生变化
    // 则builder需要自己维护一个映射表
    if (this.ouputExt) {
      p.base =
        path
          .basename(distFilePath)
          .replace(new RegExp(path.extname(distFilePath) + '$'), '') +
        this.ouputExt;
      p.ext = this.ouputExt;
    }

    fs.remove(path.format(p)).catch(err => {
      console.error(err);
    });
  }

  /**
   * 构建单独一个文件
   * @param absFilePath
   * @returns {Promise.<void>}
   */
  async one(absFilePath) {
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
  async all() {
    const files = Object.keys(this.files);
    while (files.length) {
      const file = files.shift();
      this.one(file);
    }
  }
}

module.exports = Builder;
