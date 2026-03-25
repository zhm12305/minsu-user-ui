# 上传 GitHub 前检查清单

## 1. 本次已经补充完成的内容

- `README.md`
- `LICENSE`
- `.env.example`
- `docs/PROJECT_ANALYSIS.md`
- `docs/DATABASE.md`
- `docs/DEPLOYMENT.md`
- `.gitignore` 中允许提交 `package-lock.json`

## 2. 你上传前建议再确认的事项

### 必查

- 确认 `.env.development`、`.env.staging`、`.env.production` 中没有密钥、口令、私有网关参数
- 确认 `node_modules/` 不会被提交
- 确认 `dist/` 不会被提交
- 把 `package-lock.json` 一并纳入版本控制
- 检查是否存在测试账号、默认密码、内部地址等敏感信息

### 推荐

- 在 GitHub 仓库 About 中填写简介
- 添加 Topics，例如：`vue2`、`element-ui`、`homestay`、`ruoyi`、`bpmn`
- 上传 2 到 4 张页面截图
- 如果有后端仓库，在 README 中互相链接
- 如果有在线演示地址，在 README 中补充

## 3. GitHub 仓库建议信息

### 仓库名称建议

- `yuexiang-homestay-user-ui`
- `minsu-user-ui`

### 仓库简介建议

> 悦享民宿用户端前端项目，基于 Vue 2、Element UI 与 RuoYi-Vue 改造，支持景点浏览、民宿预订、订单管理、评价、充值和工作流扩展。

### Topics 建议

- `vue2`
- `vue-cli`
- `element-ui`
- `axios`
- `homestay`
- `booking-system`
- `ruoyi`
- `bpmn`

## 4. 首次提交建议

推荐按下面顺序提交：

1. 基础源码
2. 文档与许可证
3. 截图资源
4. 部署示例

## 5. 如果你要公开开源，最好再补

- 后端仓库地址
- 数据库 SQL
- 演示账号说明
- 部署架构图
- 版本发布记录
- 变更日志 `CHANGELOG.md`

## 6. 当前仓库的一个现实边界

这个仓库只能完整说明前端。  
真正让别人“拉下来就能跑完整业务”的关键仍然是：

- 后端服务
- 数据库
- 初始化数据
- 接口权限配置

如果你后续愿意，我可以继续把 GitHub 首页再补成“面向开源访客”的版本，比如加入截图区、架构图、FAQ 和后端联动说明。
