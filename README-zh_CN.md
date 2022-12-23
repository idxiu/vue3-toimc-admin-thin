# vue-toimc-admin 管理后台项目

中文 | [English](./README.md)

<div align="center"> <a href="https://github.com/toimc-team/vue3-toimc-admin"> <img alt="Toimc Logo" width="360" height="100" src="https://toimc-online.obs.cn-east-3.myhuaweicloud.com/logo.png"> </a> <br> <br>
</div>

> 基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目
>
> 丰富的基础组件与业务功能组件，工作效率提升 100%

[![license](https://img.shields.io/github/license/toimc-team/vue3-toimc-admin.svg)](LICENSE) ![GitHub package.json version](https://img.shields.io/github/package-json/v/toimc-team/vue3-toimc-admin) ![Github issues](https://img.shields.io/github/issues/toimc-team/vue3-toimc-admin) ![](https://img.shields.io/badge/Vue-%5E3.2.37-brightgreen) ![element-plus](https://img.shields.io/badge/element--plus-2.x-orange) ![vite](https://img.shields.io/badge/vite-%5E3.0.0-yellowgreen)

Hello，小伙伴们，我们是 toimc 开源项目团队，本文我们将简单介绍下现阶段我们开源项目的规划，帮助大家来了解我们的开源计划，了解我们团队。

国内镜像站：[https://gitee.com/toimc-team/vue3-toimc-admin](https://gitee.com/toimc-team/vue3-toimc-admin)

## 起源

2022 年 2 月 7 日，Vue 3 成为了新的默认版本。

市面上也出现了很多基于 Vue 3 开发的优秀的中后台解决方案，如 NaiveAdmin、vue-vben-admin、vue-admin-better 等，但是在这些解决方案相关的生态、跨端方案、安全方案等有所欠缺，于是我们便想打造一款拥有良好生态的企业级跨端前后台解决方案。

## 项目开发

版本要求：

- Node LTS 14+
- pnpm 6.x+/yarn/npm

安装依赖：

```
# 推荐
pnpm i

# 或者
yarn install

# 或者
npm install
```

运行项目：

```
npm run dev
```

打包：

```
npm run build
```

## 项目目录

```bash
.
├── LICENSE
├── README.md
├── auto-imports.d.ts
├── build                # 构建相关脚本
├── commitlint.config.js # commit提交lint
├── components.d.ts
├── index.html
├── jsconfig.json
├── mock                 # mock数据
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js    # postcss配置
├── public
├── src                  # 源码
│   ├── App.vue          # 应用程序
│   ├── assets           # 静态资源
│   ├── components       # 组件
│   ├── directive        # 指令
│   ├── env.d.ts
│   ├── layouts          # 布局
│   ├── main.ts
│   ├── plugins          # 插件
│   ├── router           # 路由
│   ├── settings         # 设置
│   ├── store            # 全局状态管理存储
│   ├── utils            # 工具
│   └── views            # 视图
├── stylelint.config.js  # stylelint配置
├── tsconfig.json
├── tsconfig.node.json
├── types
├── vite.config.ts
└── tailwind.config.ts
```

## 背景及说明

### 产品优势

- 开源版本免费商用
- 采用最新的技术栈 vue3+typescript+vite
- 完整的社区生态
- 基于 RBAC 及 JWT 鉴权机制
- 企业级前端安全解决方案
- 多主题、多种布局灵活切换
- 快速迭代

### 进展

当前阶段它包含登录、布局、菜单路由以及常用基础组件：

同时，也在建设我们开源项目的文档站，希望能打造一个优秀的项目文档，能让使用我们开源项目的同学们，开箱即用。

整个开源团队已组成，包含产品、开发、运营共 8 人的小伙伴，每天小伙伴们都在愉快的讨论技术。

计划进展：[Github issues label: Plan](https://github.com/toimc-team/vue3-toimc-admin/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3Aplan)

### 未来规划

在当前阶段完成后，我们还将继续丰富我们的基础组件，增加高可用的业务组件，单元测试方案以及前端安全解决方案。我们还将围绕开源项目开展运营，以推广我们的开源项目，同时围绕开源项目建设技术社区、知识付费、积分体系等，来为参与我们开源项目，使用我们开源项目的小伙伴提供技术交流分享、内容变现的平台。

- [] [Nestjs 后端](https://github.com/toimc-team/nestjs-toimc-admin)
- [] Electron destop APP
- [] 插件商店和组件商店
- [] 分销模块

## 如何加入

人才需求：

- 前端：Vue,React,Nodejs
- 后端：java,go,python,C++/C
- 测试
- 运营：文案、抖音、社群

## 如何贡献

- 加入微信群
- 了解对标项目
  - Vben: https://vvbin.cn/next/#/dashboard/analysis
  - Vue-admin: https://vue-admin-beautiful.com/admin-plus/
  - arco: https://react-pro.arco.design/dashboard/monitor
  - Naive: https://naive-ui-admin.vercel.app/#/dashboard/console
- 看看 issues 中是否有计划与讨论：
  - 计划：[enhancement](https://github.com/toimc-team/vue3-toimc-admin/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
  - 讨论：[discussion](https://github.com/toimc-team/vue3-toimc-admin/issues?q=is%3Aissue+is%3Aopen+label%3Adiscussion)
- （非必须）自己创建 issues，并加入计划
- 下载项目，coding，测试~~
- PR：[在这里](https://github.com/toimc-team/vue3-toimc-admin/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc)

- 等待审核，合并~~

## 项目赞助

如果你认为这个项目对你有帮助，你可以帮作者买一杯咖啡，以示支持!

<img src="https://toimc-online.obs.cn-east-3.myhuaweicloud.com/vue-toimc-admin/payme.jpg" alt="payme" style="zoom:30%;" />

Paypal：[https://paypal.me/toimc](https://paypal.me/toimc)

## 更新日志

日志参见：[CHANGELOG](./CHANGELOG.md)。
