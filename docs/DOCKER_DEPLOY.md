# Docker 部署指南

本文档详细说明如何使用 Docker 部署开发者工具箱。

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+ (可选)
- 至少 512MB 可用内存
- 至少 1GB 磁盘空间

## 快速开始

### 方式一：使用 Docker Compose（推荐）

```bash
# 1. 克隆项目
git clone <仓库地址>
cd <项目目录>

# 2. 构建并启动
docker-compose up -d

# 3. 访问应用
# 打开浏览器访问 http://localhost:8080
```

### 方式二：使用 Docker 命令

```bash
# 1. 构建镜像
docker build -t devtools-app .

# 2. 运行容器
docker run -d \
  --name devtools-app \
  -p 8080:80 \
  --restart unless-stopped \
  devtools-app

# 3. 访问应用
# 打开浏览器访问 http://localhost:8080
```

## 常用命令

### 查看日志

```bash
# Docker Compose
docker-compose logs -f

# Docker
docker logs -f devtools-app
```

### 停止服务

```bash
# Docker Compose
docker-compose down

# Docker
docker stop devtools-app
docker rm devtools-app
```

### 重新构建

```bash
# Docker Compose
docker-compose up -d --build

# Docker
docker build -t devtools-app .
docker stop devtools-app
docker rm devtools-app
docker run -d --name devtools-app -p 8080:80 --restart unless-stopped devtools-app
```

### 健康检查

```bash
curl http://localhost:8080/health
```

## 生产环境配置

### 修改端口

编辑 `docker-compose.yml`：

```yaml
ports:
  - "80:80"  # 将 8080 改为 80
```

或使用 Docker 命令：

```bash
docker run -d -p 80:80 --name devtools-app devtools-app
```

### 配置 HTTPS（使用反向代理）

推荐使用 Nginx 或 Traefik 作为反向代理处理 HTTPS。

#### Nginx 反向代理示例

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 资源限制

编辑 `docker-compose.yml` 添加资源限制：

```yaml
services:
  devtools:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 256M
        reservations:
          cpus: '0.25'
          memory: 128M
```

## 多架构支持

构建多架构镜像（支持 amd64 和 arm64）：

```bash
# 创建 builder
docker buildx create --name mybuilder --use

# 构建并推送多架构镜像
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t your-registry/devtools-app:latest \
  --push .
```

## 故障排除

### 容器无法启动

```bash
# 查看容器状态
docker ps -a

# 查看详细日志
docker logs devtools-app
```

### 端口被占用

```bash
# 查看端口占用
lsof -i :8080

# 修改为其他端口
docker run -d -p 9090:80 --name devtools-app devtools-app
```

### 构建失败

```bash
# 清理 Docker 缓存
docker system prune -a

# 重新构建（不使用缓存）
docker build --no-cache -t devtools-app .
```

## 备份与恢复

由于本应用是纯前端应用，所有数据存储在浏览器本地，无需备份应用数据。

如需备份镜像：

```bash
# 导出镜像
docker save devtools-app > devtools-app.tar

# 导入镜像
docker load < devtools-app.tar
```

## 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建并部署
docker-compose up -d --build
```

## 安全建议

1. **定期更新基础镜像** - 使用最新的 Node.js 和 Nginx 镜像
2. **限制容器权限** - 不要使用 `--privileged` 模式
3. **网络隔离** - 在生产环境使用独立网络
4. **日志管理** - 配置日志轮转避免磁盘占满

## 支持

如遇问题，请联系系统管理员或提交 Issue。
