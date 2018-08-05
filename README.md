## 零配置, 无侵入式的小程序开发工具

[![Build Status](https://travis-ci.org/axetroy/webuild.svg?branch=master)](https://travis-ci.org/axetroy/webuild)
[![Dependency](https://david-dm.org/axetroy/webuild.svg)](https://david-dm.org/axetroy/webuild)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)
![Node](https://img.shields.io/badge/node-%3E=6.0-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/%40axetroy%2Fwebuild.svg)](https://badge.fury.io/js/%40axetroy%2Fwebuild)
![License](https://img.shields.io/badge/license-Apache-green.svg)

工欲善其事, 必先利其器

特性:

* [x] 支持微信/支付宝小程序
* [x] 零配置, 你所需要的, 都已经有了
* [x] 无入侵. 兼容原生开发方式. 不用更改一行代码.
* [x] 支持引入 NPM 模块
* [x] 支持 ES2015, ES2016, ES2017...
* [x] 强力压缩 JS, 极大节省包体积.
* [x] 支持图片压缩, jpg/jpeg/mozjpeg/png/gif/webp/svg
* [x] WXSS/WXML/JSON 压缩
* [x] 支持使用css/sass/less代替wxss，xml代替wxml
* [ ] 基于 AST 压缩 WXSS/WXML(把 className 替换成 1 个字符)
* [x] 支持环境变量``process.env``, 默认有``NODE_ENV``.　也可以自定义变量``WEBUILD_XX``

**该项目为开发工具, 不是小程序框架**.

安装

```bash
npm install @axetroy/webuild -g
```

## 快速开始

```bash
webuild init my-mini-app
cd my-mini-app
npm start
```

## 如何使用

假设你的小程序项目目录

```
.
├── app.css
├── app.js
├── app.json
└── pages
    ├── detail
    │   ├── index.css
    │   ├── index.js
    │   └── index.xml
    └── index
        ├── index.css
        ├── index.js
        └── index.xml
```

创建一个src目录，并且把小程序项目源码放在src目录下， 并且运行

```bash
# 运行命令, 监听文件变化并打包编译
webuild dev

# 发布项目
webuild build
```

源码 src 已被编译至 dist 目录.

打开微信/支付宝开发者工具, 加载 dist 目录即可

> 需要关闭 ``ES6转ES5``　选项

## 命令行

```bash
$ webuild --help

   webuild 0.3.5 - 零配置无侵入式的微信小程序开发工具
     
   USAGE

     webuild <command> [options]

   COMMANDS

     init <name>         初始化一个新项目                   
     dev                 以开发模式运行                     
     build               构建生产模式                       
     help <command>      Display help for a specific command

   GLOBAL OPTIONS

     -h, --help         Display help                                      
     -V, --version      Display version                                   
     --no-color         Disable colors                                    
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages
```

## Example

* [Official](https://github.com/axetroy/webuild/tree/master/examples/official): 官方小程序组件
* [CNode](https://github.com/axetroy/webuild/tree/master/examples/cnode): 试验下的 CNode 社区
* [Icehome](https://github.com/axetroy/webuild/tree/master/examples/icehome): 冰冰家纯手工店小程序

## Contributing

[Contributing Guide](https://github.com/axetroy/webuild/blob/master/CONTRIBUTING.md)

如果你觉得项目不错，不要吝啬你的 star.

长期造轮子，欢迎 follow.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroy/webuild/commits?author=axetroy) [🐛](https://github.com/axetroy/webuild/issues?q=author%3Aaxetroy) 🎨 |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |


<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Faxetroy%2Fwebuild.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Faxetroy%2Fwebuild?ref=badge_large)
