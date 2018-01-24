## 零配置, 无侵入式的微信/支付宝小程序开发工具

[![Greenkeeper badge](https://badges.greenkeeper.io/axetroy/webuild.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/axetroy/webuild.svg?branch=master)](https://travis-ci.org/axetroy/webuild)
![License](https://img.shields.io/badge/license-Apache-green.svg)

工欲善其事, 必先利其器

特性:

* [ ] 支持微信/支付宝小程序
* [x] 零配置, 你所需要的, 都已经有了
* [x] 无入侵. 兼容原生开发方式. 不用更改一行代码.
* [x] 添加global对象，以Async后缀的方法名则返回Promise，不需要传入success，fail回调函数
* [x] 支持引入 NPM 模块
* [x] 支持 ES2015, ES2016, ES2017...
* [x] 强力压缩 JS, 极大节省包体积.
* [x] 支持图片压缩, jpg/jpeg/mozjpeg/png/gif/webp/svg
* [x] WXSS/WXML/JSON 压缩
* [x] 支持使用css/sass/less代替wxss，xml代替wxml
* [ ] 基于 AST 压缩 WXSS/WXML(把 className 替换成 1 个字符)

**该项目为开发工具, 不是小程序框架**.

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

在项目目录下运行

```bash
# 安装webuild
npm intsall @axetroy/webuild -g

# 运行命令, 监听文件变化并打包编译
webuild dev --src ./ --output ./dist

# 发布项目
webuild build --src ./ --output ./dist
```

源码 src 已被编译至 dist 目录.

打开微信开发者工具, 加载 dist 目录即可

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
