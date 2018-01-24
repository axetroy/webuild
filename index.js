require("@axetroy/graceful")();
const path = require("path");
const program = require("caporal");
const pkg = require("./package.json");
const app = require("./src/app");
const CONFIG = require("./src/config")();

const p = program.version(pkg.version).description(pkg.description);

p
  .command("dev")
  .option("--src <dir>", "Src dir", program.STRING, "src")
  .option("--output <dir>", "Output dir", program.STRING, "dist")
  .description("以开发模式运行")
  .action(function(argv, options) {
    process.env.NODE_ENV = "development";
    CONFIG.isProduction = false;
    CONFIG.paths.cwd = process.cwd();
    CONFIG.paths.src = path.join(CONFIG.paths.cwd, options.src);
    CONFIG.paths.dist = path.join(CONFIG.paths.cwd, options.output);
    app.dev().catch(err => {
      console.error(err);
    });
  });

p
  .command("build")
  .option("--src <dir>", "Src dir", program.STRING, "src")
  .option("--output <dir>", "Output dir", program.STRING, "dist")
  .description("构建生产模式")
  .action(function(argv, options) {
    process.env.NODE_ENV = "production";
    CONFIG.isProduction = true;
    CONFIG.paths.cwd = process.cwd();
    CONFIG.paths.src = path.join(CONFIG.paths.cwd, options.src);
    CONFIG.paths.dist = path.join(CONFIG.paths.cwd, options.output);

    app
      .build()
      .then(() => {
        console.log("build success!");
      })
      .catch(function(err) {
        console.error(err);
      });
  });

module.exports = p;
