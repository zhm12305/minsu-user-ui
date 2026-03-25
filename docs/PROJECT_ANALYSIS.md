# 项目完整分析

## 1. 项目定位

该仓库是“悦享民宿”用户端前端项目，基于 RuoYi-Vue 模板做了民宿业务化改造。  
它既包含面向普通用户的前台页面，也保留了 RuoYi 体系下的权限、系统管理、监控和工作流扩展能力。

从代码结构看，这不是纯展示型官网，而是一个：

- 支持登录鉴权的业务系统
- 具备动态菜单和角色权限的单页应用
- 依赖独立后端和数据库的前后端分离项目

## 2. 技术栈

### 核心框架

- Vue 2.6.14
- Vue Router 3.4.9
- Vuex 3.6.0
- Vue CLI 4.4.6

### UI 与交互

- Element UI 2.15.14
- VXE Table 3.8.x
- Ant Design Vue 1.7.x
- animate.css（通过 CDN 引入）

### 数据与网络

- Axios 0.28.1
- js-cookie
- jsencrypt

### 富文本、图形与可视化

- WangEditor 5
- Quill
- ECharts 5
- DataV
- BPMN.js
- bpmn-js-properties-panel
- vue-bpmn

### 工程化

- Babel
- ESLint
- Sass / SCSS
- Compression Webpack Plugin
- svg-sprite-loader

## 3. 目录结构

```text
minsu-user-ui/
├─ bin/                 批处理脚本，负责安装、运行、打包
├─ build/               预览构建产物的 Node 脚本
├─ public/              静态资源、小游戏、BPMN 静态文件
├─ src/
│  ├─ api/              按业务域拆分的接口封装
│  ├─ assets/           图片、视频、样式、svg 图标
│  ├─ components/       通用组件、编辑器、上传、BPMN 组件等
│  ├─ directive/        自定义指令
│  ├─ layout/           后台布局
│  ├─ plugins/          模态框、下载、缓存、权限插件
│  ├─ router/           静态路由入口
│  ├─ store/            Vuex 状态管理
│  ├─ utils/            请求封装、权限、字典、工具方法
│  └─ views/            页面视图
├─ .env.*               环境变量
├─ vue.config.js        Vue CLI / webpack 配置
└─ package.json         依赖与脚本
```

## 4. 运行机制

### 4.1 启动方式

- `npm run dev`：开发环境
- `npm run build:prod`：生产构建
- `npm run build:stage`：预发构建
- `npm run preview`：构建后本地预览

### 4.2 开发代理

`vue.config.js` 中配置了：

- `VUE_APP_BASE_API -> http://localhost:8080`
- `/queryProjectForTest -> http://10.48.254.155/default/`

这意味着本地开发默认需要一个运行在 `8080` 的后端服务。

### 4.3 登录与权限

登录流程：

1. 调用 `/login`
2. 返回 token 后写入本地
3. 访问受保护页面时调用 `/getInfo`
4. 再调用 `/getRouters`
5. 前端通过 `router.addRoutes` 动态注入菜单

权限控制关键点：

- Token 存储：`src/utils/auth.js`
- 请求拦截：`src/utils/request.js`
- 路由守卫：`src/permission.js`
- 动态路由生成：`src/store/modules/permission.js`

## 5. 用户侧功能拆解

## 5.1 登录与注册

页面：

- `src/views/login.vue`
- `src/views/register.vue`

能力：

- 用户名密码登录
- 图形验证码
- 记住密码
- 用户注册

接口：

- `/login`
- `/register`
- `/captchaImage`
- `/getInfo`
- `/logout`

## 5.2 首页

页面：

- `src/views/HomePage/home.vue`

能力：

- 首页轮播景点推荐
- 首页民宿推荐
- 推荐卡片动效展示
- 点击民宿打开预订弹窗

接口：

- `/huacai/spots/list`
- `/huacai/homestay/list`

## 5.3 特色景点

页面：

- `src/views/HomePage/scenicSpots.vue`

能力：

- 景点卡片列表
- 景点详情弹窗
- 展示景点开放时间
- 展示景点附近民宿
- 从景点详情联动进入民宿详情

接口：

- `/huacai/spots/selectSptosOrTagList`
- `/huacai/homestay/selectHomestayBySpotsId/{spotsId}`

## 5.4 民宿列表与详情

页面：

- `src/views/HomePage/homestay.vue`
- `src/views/components/RoomReservation/index.vue`

能力：

- 民宿列表展示
- 按价格升序/降序排序
- 查看民宿详情
- 查看设施服务
- 查看用户评价
- 选择入住和退房日期
- 自动计算总价
- 提交预订

接口：

- `/huacai/homestay/selectHomestayOrTagsList`
- `/huacai/homestay/{id}`
- `/huacai/evaluate/selectEvaluateByHomestayId/{id}`
- `/huacai/orders`

## 5.5 订单中心

页面：

- `src/views/HomePage/booking.vue`

能力：

- 我的订单列表
- 按民宿名称搜索
- 查看订单状态
- 待支付订单付款
- 已完成订单评价

接口：

- `/huacai/orders/list`
- `/huacai/orders/payOrder/{orderId}`
- `/huacai/evaluate`

## 5.6 账户充值

页面：

- `src/views/HomePage/recharge.vue`

能力：

- 查看余额
- 固定金额充值
- 自定义金额充值
- 充值结果反馈

接口：

- `/system/user/{userId}`
- `/huacai/homestay/updateUserAmount/{amount}`

注：充值接口命名挂在 `homestay` 域下，说明当前后端业务接口边界还有进一步整理空间。

## 5.7 休闲娱乐

页面：

- `src/views/HomePage/games.vue`

能力：

- 通过 iframe 嵌入本地静态小游戏
- 当前内置游戏包括超级马里奥、贪吃蛇、俄罗斯方块、记忆游戏

静态资源目录：

- `public/Mario_game/`
- `public/games/snake/`
- `public/games/tetris/`
- `public/games/memory/`

## 5.8 个人中心

页面：

- `src/views/system/user/profile/index.vue`

能力：

- 个人信息查看/维护
- 头像上传
- 密码修改

接口：

- `/system/user/profile`
- `/system/user/profile/updatePwd`
- `/system/user/profile/avatar`

## 6. 后台与平台扩展模块

虽然用户侧路由只显式挂载了首页相关页面，但仓库中已经包含以下后台模块前端代码和 API：

- 系统管理：用户、角色、岗位、部门、菜单、字典、通知
- 监控：在线用户、登录日志、操作日志、任务调度、缓存、服务信息
- 工作流：流程定义、任务处理、审批历史、流程图高亮
- BPMN 设计器：流程绘制、节点属性配置、XML 查看

这些模块是否在最终界面出现，取决于后端 `/getRouters` 返回菜单。

## 7. 配置分析

### 7.1 `package.json`

- 项目名：`huacai`
- 版本：`3.8.7`
- 许可证：`MIT`
- 最低声明环境：`node >= 8.9`、`npm >= 3`

### 7.2 `vue.config.js`

- `publicPath` 为 `/`
- 构建输出目录为 `dist`
- 静态资源目录为 `static`
- 生产环境关闭 source map
- 启用 gzip 压缩产物
- 对 `src/assets/icons` 使用 svg-sprite-loader
- 非开发环境开启 splitChunks 和 runtime chunk 优化

### 7.3 路由模式

项目使用 `history` 模式，因此部署时必须配置服务端回退：

```nginx
try_files $uri $uri/ /index.html;
```

## 8. 数据库结论

可以明确确认的是：

- 本仓库依赖数据库
- 数据库结构不在当前前端仓库内
- 前端只能通过接口命名与字段使用推断数据库实体

详见 [DATABASE.md](DATABASE.md)。

## 9. 适合上传 GitHub 的补充项

本次已补充：

- 根目录 `README.md`
- `LICENSE`
- `.env.example`
- `docs/PROJECT_ANALYSIS.md`
- `docs/DATABASE.md`
- `docs/DEPLOYMENT.md`
- `docs/GITHUB_PREP.md`

建议你在实际发布时再补：

- 首页截图
- 在线预览地址
- 后端仓库地址
- 数据库 SQL 仓库或导出说明
