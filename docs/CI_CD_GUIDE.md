# CI/CD 部署指南

本项目支持 GitHub Actions 和 GitLab CI/CD 两种自动化构建部署方式。

## GitHub Actions

### 功能特性

- 自动构建 Docker 镜像
- 推送镜像到 GitHub Container Registry (ghcr.io)
- 支持多种标签策略（分支名、版本号、commit SHA）
- 使用 Docker 层缓存加速构建

### 触发条件

| 事件 | 分支/标签 | 动作 |
|------|-----------|------|
| Push | main/master | 构建并推送镜像 |
| Push | v* 标签 | 构建并推送带版本号的镜像 |
| Pull Request | main/master | 仅构建，不推送 |

### 镜像标签规则

- `ghcr.io/用户名/仓库名:main` - 主分支最新
- `ghcr.io/用户名/仓库名:v1.0.0` - 版本标签
- `ghcr.io/用户名/仓库名:sha-abc123` - Commit SHA

### 使用方法

1. **无需额外配置**，GitHub Actions 自动使用 `GITHUB_TOKEN`

2. **拉取镜像**：
   ```bash
   docker pull ghcr.io/你的用户名/devtools:latest
   ```

3. **发布新版本**：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

---

## GitLab CI/CD

### 功能特性

- 自动构建 Docker 镜像
- 推送镜像到 GitLab Container Registry
- 支持手动部署到生产环境
- SSH 远程部署

### 流水线阶段

```
build → deploy (手动触发)
```

### 必需的 CI/CD 变量

在 GitLab 项目的 **Settings → CI/CD → Variables** 中配置：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `SSH_PRIVATE_KEY` | 服务器 SSH 私钥 | -----BEGIN RSA PRIVATE KEY----- ... |
| `SSH_KNOWN_HOSTS` | 服务器 known_hosts | 使用 `ssh-keyscan your-server.com` 获取 |
| `DEPLOY_USER` | 服务器登录用户名 | deploy |
| `DEPLOY_HOST` | 服务器地址 | 192.168.1.100 |
| `DEPLOY_PATH` | 项目部署路径 | /opt/devtools |

### 配置步骤

1. **生成 SSH 密钥对**（如果没有）：
   ```bash
   ssh-keygen -t rsa -b 4096 -C "gitlab-ci"
   ```

2. **将公钥添加到服务器**：
   ```bash
   ssh-copy-id -i ~/.ssh/id_rsa.pub deploy@your-server.com
   ```

3. **获取 known_hosts**：
   ```bash
   ssh-keyscan your-server.com
   ```

4. **在服务器上准备部署目录**：
   ```bash
   mkdir -p /opt/devtools
   cd /opt/devtools
   
   # 创建 docker-compose.yml
   cat > docker-compose.yml << 'EOF'
   version: '3.8'
   services:
     devtools:
       image: registry.gitlab.com/你的用户名/devtools:latest
       container_name: devtools-app
       ports:
         - "8080:80"
       restart: unless-stopped
   EOF
   ```

5. **配置 CI/CD 变量** 并推送代码触发流水线

---

## 自定义配置

### 修改部署端口

编辑 `docker-compose.yml`：
```yaml
ports:
  - "3000:80"  # 改为你想要的端口
```

### 添加环境变量

GitHub Actions (`docker-build.yml`)：
```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    build-args: |
      VITE_API_URL=https://api.example.com
```

GitLab CI (`.gitlab-ci.yml`)：
```yaml
build:
  script:
    - docker build --build-arg VITE_API_URL=$API_URL -t $IMAGE_TAG .
```

### 使用 Docker Hub

GitHub Actions - 修改 `docker-build.yml`：
```yaml
env:
  REGISTRY: docker.io
  IMAGE_NAME: 你的Docker用户名/devtools

# 登录部分改为：
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

---

## 常见问题

### Q: 构建失败提示权限不足？

GitHub Actions 需要在仓库 Settings → Actions → General 中启用：
- "Read and write permissions"
- "Allow GitHub Actions to create and approve pull requests"

### Q: GitLab 部署超时？

检查 SSH 连接和防火墙设置：
```bash
ssh -vvv deploy@your-server.com
```

### Q: 如何查看构建日志？

- GitHub: 点击 Actions 标签页
- GitLab: 点击 CI/CD → Pipelines

---

## 安全建议

1. **定期轮换密钥**：建议每 90 天更换一次 SSH 密钥和访问令牌
2. **最小权限原则**：部署用户仅授予必要权限
3. **使用 Protected 分支**：保护 main/master 分支
4. **审查第三方 Actions**：使用官方或经过验证的 Actions
