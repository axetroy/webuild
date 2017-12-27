/**
 * Created by axetroy on 2017/7/2.
 */
const path = require('path');
const fs = require('fs-extra');
const postcss = require('postcss');
const precss = require('precss');
const cssnano = require('cssnano');
const Builder = require('./Builder');
const CONFIG = require('./config');

class CssBuilder extends Builder {
  constructor() {
    super();
  }
  async compile() {
    const files = Object.keys(this.files);

    try {
      while (files.length) {
        let file = files.shift();
        const relativeFilePath = path.relative(CONFIG.paths.src, file);
        const distFilePath = path
          .join(CONFIG.paths.dist, relativeFilePath)
          .replace(/\.scss$/, '.wxss')
          .replace(/\.less$/, '.wxss')
          .replace(/\.sass$/, '.wxss')
          .replace(/\.css$/, '.wxss');

        await fs.ensureFile(distFilePath);

        const result = await postcss(
          [precss].concat(
            // 生产环境下压缩css
            CONFIG.isProduction ? [cssnano({ preset: 'default' })] : []
          )
        ).process(await fs.readFile(file, 'utf8'), {
          from: file,
          to: distFilePath
        });

        await fs.writeFile(distFilePath, result.css, 'utf8');
      }
    } catch (err) {
      console.error(`Compile css error:`);
      console.error(err);
    }
  }
}

module.exports = new CssBuilder();
