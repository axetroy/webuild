/**
 * Created by axetroy on 2017/7/2.
 */
const fs = require("fs-extra");
const path = require("path");
const imagemin = require("imagemin");
const Builder = require("../Builder");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const imageminWebp = require("imagemin-webp");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminSvgo = require("imagemin-svgo");
const CONFIG = require("../config")();

class ImageBuilder extends Builder {
  constructor() {
    super();
    this.name = "image";
  }

  /**
   * 构建单独一个文件
   * @param absFilePath
   * @returns {Promise.<void>}
   */
  async one(absFilePath) {
    const ext = path.extname(absFilePath);
    const relativeFilePath = path.relative(CONFIG.paths.src, absFilePath);
    const distFilePath = path.join(CONFIG.paths.dist, relativeFilePath); // 最终输出路径

    const plugins = [];
    switch (ext) {
      case ".jpg":
      case ".jpeg":
        plugins.push(imageminJpegtran());
        break;
      case ".mozjpeg":
        plugins.push(imageminMozjpeg());
        break;
      case ".svg":
        plugins.push(
          imageminSvgo({
            plugins: [{ removeViewBox: false }]
          })
        );
        break;
      case ".png":
        plugins.push(imageminPngquant({ quality: "65-80" }));
        break;
      case ".webp":
        plugins.push(imageminWebp({ quality: 50 }));
        break;
      case ".gif":
        plugins.push(imageminGifsicle());
        break;
    }

    try {
      await imagemin([absFilePath], path.dirname(distFilePath), { plugins });
    } catch (err) {
      // await fs.copy(absFilePath, distFilePath, { overwrite: true });
    }
  }
}

module.exports = ImageBuilder;
