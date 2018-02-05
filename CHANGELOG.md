<a name="0.3.8"></a>
## [0.3.8](https://github.com/axetroy/webuild/compare/v0.3.7...v0.3.8) (2018-02-05)


### Bug Fixes

* fix missing error ([aee3a8c](https://github.com/axetroy/webuild/commit/aee3a8c))
* fix npm script didn't run correct in windows ([91e19c0](https://github.com/axetroy/webuild/commit/91e19c0))
* fix this.env have not been init before used ([c43823f](https://github.com/axetroy/webuild/commit/c43823f))



<a name="0.3.7"></a>
## [0.3.7](https://github.com/axetroy/webuild/compare/v0.3.6...v0.3.7) (2018-02-04)


### Features

* remove graceful.js ([8e538ee](https://github.com/axetroy/webuild/commit/8e538ee))



<a name="0.3.6"></a>
## [0.3.6](https://github.com/axetroy/webuild/compare/v0.3.5...v0.3.6) (2018-02-04)


### Features

* add init command ([ed06863](https://github.com/axetroy/webuild/commit/ed06863))



<a name="0.3.5"></a>
## [0.3.5](https://github.com/axetroy/webuild/compare/v0.3.4...v0.3.5) (2018-02-03)


### Bug Fixes

* fix resolve loader ([080949c](https://github.com/axetroy/webuild/commit/080949c))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/axetroy/webuild/compare/v0.3.3...v0.3.4) (2018-02-02)


### Features

* 移除global对象，打印构建包的信息，并修复部分bug ([cc48f70](https://github.com/axetroy/webuild/commit/cc48f70))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/axetroy/webuild/compare/v0.3.2...v0.3.3) (2018-02-02)


### Bug Fixes

* load js file with babel-loader ([d515689](https://github.com/axetroy/webuild/commit/d515689))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/axetroy/webuild/compare/v0.3.1...v0.3.2) (2018-02-02)


### Features

* 支持更多特性，修复一些bugs ([c68159c](https://github.com/axetroy/webuild/commit/c68159c))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/axetroy/webuild/compare/v0.3.0...v0.3.1) (2018-02-02)


### Bug Fixes

* **package:** update babel-preset-minify to version 0.3.0 ([0c31d3b](https://github.com/axetroy/webuild/commit/0c31d3b))
* fix missing babel-runtime ([98c53b2](https://github.com/axetroy/webuild/commit/98c53b2))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/axetroy/webuild/compare/v0.2.1...v0.3.0) (2018-01-25)


### Bug Fixes

* 修复runtime的一些问题 ([95625be](https://github.com/axetroy/webuild/commit/95625be))


### Features

* support runtime ([6eae591](https://github.com/axetroy/webuild/commit/6eae591))
* 修复process全局变量不正确的问题，支持自定义环境变量 ([75640ae](https://github.com/axetroy/webuild/commit/75640ae))
* 全局变量支持支付宝小程序 ([1a02bf9](https://github.com/axetroy/webuild/commit/1a02bf9))
* 支持支付宝小程序 ([74f1f1a](https://github.com/axetroy/webuild/commit/74f1f1a))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/axetroy/webuild/compare/v0.2.0...v0.2.1) (2018-01-24)


### Bug Fixes

* fix global object ([0b4db9c](https://github.com/axetroy/webuild/commit/0b4db9c))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/axetroy/webuild/compare/v0.1.0...v0.2.0) (2018-01-24)


### Features

* add global object and promisify all method ([e263bbd](https://github.com/axetroy/webuild/commit/e263bbd))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/axetroy/webuild/compare/v0.0.2...v0.1.0) (2018-01-24)


### Bug Fixes

* **package:** update chokidar to version 2.0.0 ([368e531](https://github.com/axetroy/webuild/commit/368e531))
* **package:** update precss to version 3.0.0 ([290a8b1](https://github.com/axetroy/webuild/commit/290a8b1))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/axetroy/webuild/compare/470e977...v0.0.2) (2017-12-28)


### Bug Fixes

* 使用uglify-js确保生产环境下压缩js ([f191a13](https://github.com/axetroy/webuild/commit/f191a13))
* 修复javascript打包器, 在文件很多的情况下, 很耗时很久的问题 ([bf066a5](https://github.com/axetroy/webuild/commit/bf066a5))
* 修复能有正确打包regeneratorRuntime的问题 ([470e977](https://github.com/axetroy/webuild/commit/470e977))


### Features

* support flow ([4a186b1](https://github.com/axetroy/webuild/commit/4a186b1))
* 增加json builder, 支持压缩json ([112c814](https://github.com/axetroy/webuild/commit/112c814))
* 支持删除文件后, 编译的目录也跟着删除 ([c1f6424](https://github.com/axetroy/webuild/commit/c1f6424))
* 支持多种格式的图片压缩 ([d5f71a7](https://github.com/axetroy/webuild/commit/d5f71a7))



