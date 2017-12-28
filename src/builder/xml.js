/**
 * Created by axetroy on 2017/7/2.
 */

const path = require('path');
const fs = require('fs-extra');
const pd = require('pretty-data').pd;
const Builder = require('../Builder');
const CONFIG = require('../config');

class XmlBuilder extends Builder {
  constructor() {
    super();
    this.name = 'xml';
  }
  async one(absFilePath) {
    let fileContent = await fs.readFile(absFilePath, 'utf8');

    // 生产环境下，对xml文件进行压缩
    if (CONFIG.isProduction) {
      fileContent = pd.xmlmin(fileContent, true);
    }

    const relativeFilePath = path.relative(CONFIG.paths.src, absFilePath);
    const distFilePath = path
      .join(CONFIG.paths.dist, relativeFilePath)
      .replace(/\.w?xml$/, '.wxml');

    await fs.ensureFile(distFilePath);
    await fs.writeFile(distFilePath, fileContent, 'utf8');
  }
  async all() {
    const files = Object.keys(this.files);
    while (files.length) {
      const file = files.shift();
      this.one(file);
    }
  }
}

module.exports = XmlBuilder;