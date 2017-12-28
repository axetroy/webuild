/**
 * Created by axetroy on 2017/7/2.
 */
const path = require('path');
const fs = require('fs-extra');
const postcss = require('postcss');
const precss = require('precss');
const cssnano = require('cssnano');
const Builder = require('../Builder');
const CONFIG = require('../config');

class CssBuilder extends Builder {
  constructor() {
    super();
    this.name = 'css';
    this.ouputExt = '.wxss';
  }

  async one(absFile) {
    const relativeFilePath = path.relative(CONFIG.paths.src, absFile);
    const distFilePath = path
      .join(CONFIG.paths.dist, relativeFilePath)
      .replace(/\.scss$/, this.ouputExt)
      .replace(/\.less$/, this.ouputExt)
      .replace(/\.sass$/, this.ouputExt)
      .replace(/\.css$/, this.ouputExt);

    await fs.ensureFile(distFilePath);

    const result = await postcss(
      [precss].concat(
        // 生产环境下压缩css
        CONFIG.isProduction ? [cssnano({ preset: 'default' })] : []
      )
    ).process(await fs.readFile(absFile, 'utf8'), {
      from: absFile,
      to: distFilePath
    });

    await fs.writeFile(distFilePath, result.css, 'utf8');
  }
  async all() {
    const files = Object.keys(this.files);
    while (files.length) {
      const file = files.shift();
      this.one(file);
    }
  }
}

module.exports = CssBuilder;
