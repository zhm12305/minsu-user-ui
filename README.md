# 悦享民宿前端

悦享民宿前端是一个基于 Vue 2、Vue CLI 4 和 Element UI 的单页应用，面向民宿平台普通用户，提供景点浏览、民宿查看、在线预订、订单支付、账户充值、评价反馈和个人中心等能力。项目同时保留了 RuoYi-Vue 体系下的权限、字典、系统管理、监控和工作流扩展能力，因此它不是一个纯展示站，而是一个带完整业务与后台扩展基础的前端工程。

## 项目概览

- 前端框架：Vue 2.6、Vue Router 3、Vuex 3
- UI 组件：Element UI、VXE Table、DataV、Ant Design Vue
- 网络请求：Axios
- 编辑与可视化：WangEditor、Quill、BPMN.js、vue-bpmn、ECharts
- 工程化：Vue CLI 4、Babel、ESLint、Sass、Compression Webpack Plugin
- 部署形态：构建后生成 `dist/` 静态资源，适合部署到 Nginx、Apache、对象存储静态站点或 CDN

## 当前仓库包含的核心功能

### 用户侧业务

- 登录、注册、验证码、记住密码
- 首页推荐展示
- 特色景点列表和详情弹窗
- 民宿列表、价格排序、详情弹窗
- 房间预订，按入住/退房日期计算费用
- 我的订单、订单检索、订单支付、订单评价
- 账户余额查看与充值
- 个人中心、头像和密码维护
- 本地内置休闲小游戏入口

### 平台扩展能力

- 动态菜单与角色权限控制
- 用户、角色、部门、岗位、菜单、字典、通知等系统管理接口适配
- 在线用户、登录日志、操作日志、缓存、定时任务、服务监控等监控接口适配
- BPMN 流程定义、流程任务、审批流可视化

说明：后台菜单和部分后台页面通过 `/getRouters` 动态注入，因此最终实际可见功能还取决于后端返回的菜单和权限配置。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

如果使用仓库自带批处理脚本：

```bat
bin\package.bat
```

### 2. 启动开发环境

```bash
npm run dev
```

或：

```bat
bin\run-web.bat
```

默认行为：

- 本地开发端口为 `80`
- 前端接口前缀默认是 `/dev-api`
- Vue Dev Server 会把 `/dev-api` 代理到 `http://localhost:8080`

### 3. 构建生产包

```bash
npm run build:prod
```

或：

```bat
bin\build.bat
```

### 4. 本地预览构建结果

```bash
npm run preview
```

该命令会先构建，再通过本地静态服务在 `http://localhost:9526/` 预览 `dist/`。

## 环境变量

项目已包含 `development`、`staging`、`production` 三套环境文件。建议上传 GitHub 前保留示例并按真实环境自行替换。

| 变量名 | 作用 | 当前逻辑 |
| --- | --- | --- |
| `VUE_APP_TITLE` | 页面标题 | 用于浏览器标题和构建名称 |
| `ENV` | 环境标记 | 业务环境区分 |
| `VUE_APP_BASE_API` | 后端接口基地址 | Axios `baseURL` |
| `VUE_CLI_BABEL_TRANSPILE_MODULES` | Babel 转译控制 | 开发环境启用 |

可参考根目录的 [.env.example](.env.example)。

## 运行方式说明

项目是典型前后端分离架构：

1. 浏览器加载 Vue 单页应用。
2. 前端通过 `src/utils/request.js` 统一发送接口请求。
3. 登录成功后保存 Token。
4. 进入系统时调用 `/getInfo` 获取用户信息。
5. 再调用 `/getRouters` 获取动态菜单与业务路由。
6. 业务页面分别请求景点、民宿、订单、评价、用户余额等接口。

## 数据库说明

本仓库不包含后端工程、SQL 脚本、ORM 实体或迁移文件，因此无法直接给出“已验证”的数据库建表语句。  
从前端接口命名与字段使用情况，可以明确推断出至少存在以下业务域：

- 用户域：`sys_user`
- 民宿域：`huacai_homestay`
- 景点域：`huacai_spots`
- 订单域：`huacai_orders`
- 评价域：`huacai_evaluate`
- 商家域：`huacai_merchant`
- 标签与关联域：景点标签、民宿标签及关联表
- 系统字典域：如订单状态字典
- 工作流域：Activiti/Flowable 相关流程表

更详细说明见 [docs/DATABASE.md](docs/DATABASE.md)。

## 部署说明

部署时需要重点关注两点：

- Vue Router 使用了 `history` 模式，Web 服务器必须做回退到 `index.html`
- 生产环境接口地址需要和后端或网关实际部署地址一致

详细部署方案见 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 文档导航

- [docs/PROJECT_ANALYSIS.md](docs/PROJECT_ANALYSIS.md)：完整项目分析
- [docs/DATABASE.md](docs/DATABASE.md)：数据库与核心实体推断
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)：开发、构建、上线与 Nginx 配置
- [docs/GITHUB_PREP.md](docs/GITHUB_PREP.md)：上传 GitHub 前检查清单

## 许可证

本仓库补充为 MIT 许可证，见 [LICENSE](LICENSE)。
