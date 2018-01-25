require("@axetroy/graceful")();
const path = require("path");
const program = require("caporal");
const pkg = require("./package.json");
const CONFIG = require("./src/config")();

// 可用的编译类型
const availableTypes = {
  wechat: 1,
  alipay: 1
};

const p = program
  .version(pkg.version)
  .description(pkg.description)
  .option("--src <dir>", "源码目录", program.STRING, "src")
  .option("--output <dir>", "输出目录", program.STRING, "dist")
  .option(
    "--type <type>",
    "微信(wechat)/支付宝(alipay)",
    program.STRING,
    "wechat"
  );

p
  .command("dev")
  .description("以开发模式运行")
  .action(function(argv, options) {
    process.env.NODE_ENV = "development";
    CONFIG.isProduction = false;
    CONFIG.type = options.type;
    CONFIG.paths.cwd = process.cwd();
    CONFIG.paths.src = path.join(CONFIG.paths.cwd, options.src);
    CONFIG.paths.dist = path.join(CONFIG.paths.cwd, options.output);

    if (!availableTypes[CONFIG.type]) {
      throw new Error(`Invalid compiler ${CONFIG.type}`);
    }

    const app = require("./src/app");

    app.dev().catch(err => {
      console.error(err);
    });
  });

p
  .command("build")
  .description("构建生产模式")
  .action(function(argv, options) {
    process.env.NODE_ENV = "production";
    CONFIG.isProduction = true;
    CONFIG.type = options.type;
    CONFIG.paths.cwd = process.cwd();
    CONFIG.paths.src = path.join(CONFIG.paths.cwd, options.src);
    CONFIG.paths.dist = path.join(CONFIG.paths.cwd, options.output);

    if (!availableTypes[CONFIG.type]) {
      throw new Error(`Invalid compiler ${CONFIG.type}`);
    }

    const app = require("./src/app");

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
