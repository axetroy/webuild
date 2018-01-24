/**
 * Created by axetroy on 2017/7/2.
 */

const path = require('path');
const fs = require('fs-extra');
const pd = require('pretty-data').pd;
const Builder = require('../Builder');
const CONFIG = require('../config')();

class JsonBuilder extends Builder {
  constructor() {
    super();
    this.name = 'json';
  }
  async one(absFilePath) {
    let fileContent = await fs.readFile(absFilePath, 'utf8');

    // 生产环境下，对xml文件进行压缩
    if (CONFIG.isProduction) {
      fileContent = pd.jsonmin(fileContent);
    }

    // 最终输出目录
    const distFilePath = path.join(
      CONFIG.paths.dist,
      path.relative(CONFIG.paths.src, absFilePath)
    );

    await fs.ensureFile(distFilePath);
    await fs.writeFile(distFilePath, fileContent, 'utf8');
  }
}

module.exports = JsonBuilder;
