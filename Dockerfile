# 构建阶段
FROM node:20-alpine AS builder

# 安装pnpm
RUN npm install -g pnpm

WORKDIR /app

# 配置pnpm使用国内镜像源
RUN echo 'registry=https://registry.npmmirror.com' > .npmrc

# 复制 package 文件
COPY package*.json ./

# 使用pnpm安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 构建项目
RUN pnpm run build

# 生产阶段
FROM nginx:stable-alpine

# 复制构建产物到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]