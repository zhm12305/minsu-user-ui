# 部署与运行说明

## 1. 本地开发

### 环境要求

`package.json` 中声明：

- Node.js `>= 8.9`
- npm `>= 3.0.0`

更稳妥的实际建议：

- Node.js 14 或 16 LTS
- npm 6+

说明：这一条是结合 Vue CLI 4 和现有依赖做出的工程建议，不是仓库内明文限制。

### 安装依赖

```bash
npm install
```

或使用批处理：

```bat
bin\package.bat
```

### 启动

```bash
npm run dev
```

开发环境特点：

- 启动即自动打开浏览器
- 默认端口 `80`
- API 前缀为 `/dev-api`
- `/dev-api` 会代理到 `http://localhost:8080`

因此，后端服务默认需要先运行在本机 `8080` 端口。

## 2. 构建

### 生产构建

```bash
npm run build:prod
```

### 预发布构建

```bash
npm run build:stage
```

### 预览构建结果

```bash
npm run preview
```

构建完成后输出目录为：

```text
dist/
```

## 3. 部署模式

这个前端适合以下任一部署模式：

- Nginx 静态站点
- Apache 静态站点
- Docker + Nginx
- 对象存储静态网站托管
- CDN 回源静态目录

## 4. Nginx 部署示例

### 4.1 前端静态资源

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/minsu-user-ui/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 7d;
        access_log off;
    }
}
```

### 4.2 如果生产环境继续走相对 API 前缀

如果你把 `VUE_APP_BASE_API` 改成类似 `/prod-api`，可以在 Nginx 中反向代理：

```nginx
location /prod-api/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 5. 当前仓库部署注意点

### 5.1 Router 是 `history` 模式

这一点最重要。  
如果不做回退刷新，直接访问 `/index/homestay`、`/login` 等路径会返回 404。

必须配置：

```nginx
try_files $uri $uri/ /index.html;
```

### 5.2 生产接口地址

当前生产环境文件里已经配置了绝对接口地址。  
上传 GitHub 前你需要确认：

- 这个域名是否允许公开展示
- 是否要改成示例值
- 是否要通过网关代理统一转发

### 5.3 登录依赖后端

没有后端时，以下能力都无法工作：

- 登录
- 注册
- 获取菜单
- 获取民宿数据
- 提交订单
- 支付
- 评价
- 余额充值

因此这个前端不能单独作为完整可运行演示系统。

## 6. Docker 思路

本仓库没有自带 Dockerfile，但可以按以下思路部署：

1. 用 Node 镜像构建 `dist`
2. 用 Nginx 镜像托管 `dist`
3. 在 Nginx 中加入 `history` 回退配置

示例思路：

```dockerfile
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

说明：如果后续你需要，我可以再继续补完整的 `Dockerfile` 和 `nginx.conf`。
