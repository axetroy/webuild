## 舒适的小程序构建工具

[![Build Status](https://travis-ci.org/axetroy/webuild.svg?branch=master)](https://travis-ci.org/axetroy/webuild)
![License](https://img.shields.io/badge/license-Apache-green.svg)

工具欲在改善小程序的开发环境.

特性:

- [x] 零配置, 你所需要的, 都已经有了
- [x] 无入侵. 兼容原生开发方式. 不用更改一行代码.
- [x] 支持引入NPM模块
- [x] 支持ES2015, ES2016, ES2017...
- [x] 强力压缩JS, 极大节省包体积.
- [x] 支持图片压缩, jpg/jpeg/mozjpeg/png/gif/webp/svg
- [ ] 基于AST压缩WXSS/WXML

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

源码src已被编译至dist目录.

打开微信开发者工具, 加载dist目录即可

## Example

- [official](https://github.com/axetroy/webuild/tree/master/examples/official)
- [cNode](https://github.com/axetroy/webuild/tree/master/examples/cnode)

## Contributing

[Contributing Guide](https://github.com/axetroy/webuild/blob/master/CONTRIBUTING.md)

如果你觉得项目不错，不要吝啬你的star.

长期造轮子，欢迎follow.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroy/webuild/commits?author=axetroy) [🐛](https://github.com/axetroy/webuild/issues?q=author%3Aaxetroy) 🎨 |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Faxetroy%2Fwebuild.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Faxetroy%2Fwebuild?ref=badge_large)
