# 前端项目部署指南

本文档提供两种免费的静态网站部署方案：**GitHub Pages** 和 **Cloudflare Pages**。

---

## 方案对比

| 特性 | GitHub Pages | Cloudflare Pages |
|------|-------------|------------------|
| 域名 | `username.github.io/repo` | `project.pages.dev` |
| 自定义域名 | ✅ 支持 | ✅ 支持 |
| HTTPS | ✅ 自动 | ✅ 自动 |
| 全球 CDN | ❌ 有限 | ✅ 全球边缘网络 |
| 构建速度 | 一般 | 较快 |
| 国内访问 | ⚠️ 可能受限 | ⚠️ pages.dev 可能受限 |
| 适用场景 | 个人/开源项目 | 需要更好性能的项目 |

---

## 方案一：GitHub Pages

### 1. 工作流文件

将以下文件放置在 `.github/workflows/deploy-pages.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          # ⚠️ 修改为你的仓库名
          VITE_BASE_URL: /your-repo-name/

      - name: Setup Pages
        uses: actions/configure-pages@v4
        with:
          enablement: true

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2. Vite 配置

确保 `vite.config.ts` 支持动态 base 路径：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 3. 配置步骤

#### 步骤 1：修改仓库名

编辑 `.github/workflows/deploy-pages.yml`，将 `VITE_BASE_URL` 改为你的仓库名：

```yaml
env:
  VITE_BASE_URL: /your-repo-name/  # ← 改成你的仓库名
```

#### 步骤 2：启用 GitHub Pages

1. 进入 GitHub 仓库 → **Settings**
2. 左侧菜单选择 **Pages**
3. **Source** 选择 **GitHub Actions**

![GitHub Pages Settings](https://docs.github.com/assets/cb-settings-pages.png)

#### 步骤 3：触发部署

推送代码到 `main` 或 `master` 分支，自动触发部署。

#### 步骤 4：访问网站

部署完成后访问：`https://username.github.io/repo-name/`

### 4. 常见问题

| 问题 | 解决方案 |
|------|---------|
| 页面空白 | 检查 `VITE_BASE_URL` 是否正确配置 |
| 404 错误 | 确认 Pages Source 设置为 GitHub Actions |
| 样式丢失 | 确认 vite.config.ts 中 base 配置正确 |

---

## 方案二：Cloudflare Pages

### 1. 工作流文件

将以下文件放置在 `.github/workflows/deploy-cloudflare.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          # Cloudflare Pages 不需要子路径
          VITE_BASE_URL: /

      - name: Verify Cloudflare secrets present
        run: |
          if [ -z "${{ secrets.CLOUDFLARE_API_TOKEN }}" ]; then
            echo "Missing GitHub secret: CLOUDFLARE_API_TOKEN";
            exit 1;
          fi
          if [ -z "${{ secrets.CLOUDFLARE_ACCOUNT_ID }}" ]; then
            echo "Missing GitHub secret: CLOUDFLARE_ACCOUNT_ID";
            exit 1;
          fi
          echo "Cloudflare secrets detected."

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          # ⚠️ 修改为你的项目名
          command: pages deploy dist --project-name=your-project-name
```

### 2. 获取 Cloudflare 凭证

#### 获取 API Token

1. 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 点击 **Continue to summary** → **Create Token**
5. 复制生成的 Token（只显示一次！）

```
┌─────────────────────────────────────────────────────────┐
│  API Tokens                                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Edit Cloudflare Workers                         │   │
│  │ ┌───────────────────────────────────────────┐   │   │
│  │ │ awX4qhezxxxxxxxxxxxxxxxxxxxxxxxxxx        │ ← │   │  复制这个
│  │ └───────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 获取 Account ID

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击左侧 **Workers & Pages**
3. 在右侧边栏找到 **Account ID**

```
┌────────────────────────────────────┬──────────────────────┐
│  Workers & Pages                   │  Account details     │
│                                    │                      │
│  ┌──────────────────────────┐      │  Account ID          │
│  │ 你的项目列表...          │      │  ┌────────────────┐  │
│  └──────────────────────────┘      │  │ abc123def456   │← │  复制这个
│                                    │  └────────────────┘  │
└────────────────────────────────────┴──────────────────────┘
```

### 3. 配置 GitHub Secrets

1. 进入 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加以下两个 Secret：

| Name | Secret（值） |
|------|-------------|
| `CLOUDFLARE_API_TOKEN` | 从 Cloudflare 复制的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | 从 Cloudflare 复制的 Account ID |

```
┌─────────────────────────────────────────────────────────┐
│  New secret                                             │
│                                                         │
│  Name *                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ CLOUDFLARE_API_TOKEN                            │   │  ← 变量名
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Secret *                                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ awX4qhezxxxxxxxxxxxxxxxxxxxxxxxxxx              │   │  ← 从 Cloudflare 复制的值
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Add secret]                                           │
└─────────────────────────────────────────────────────────┘
```

### 4. 创建 Cloudflare Pages 项目

首次部署前需要在 Cloudflare 创建项目：

1. 访问 [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. 点击 **Create a project** → **Direct Upload**
3. 输入项目名称（与 workflow 中 `--project-name` 一致）
4. 上传任意文件完成创建（后续由 GitHub Actions 自动部署）

### 5. 配置步骤清单

```
□ 1. 获取 Cloudflare API Token
□ 2. 获取 Cloudflare Account ID  
□ 3. 在 GitHub 添加 CLOUDFLARE_API_TOKEN Secret
□ 4. 在 GitHub 添加 CLOUDFLARE_ACCOUNT_ID Secret
□ 5. 修改 workflow 中的 --project-name
□ 6. 在 Cloudflare 创建 Pages 项目
□ 7. 推送代码触发部署
```

### 6. 访问网站

部署完成后访问：`https://your-project-name.pages.dev`

### 7. 常见问题

| 问题 | 解决方案 |
|------|---------|
| 部署失败：Missing secret | 检查 GitHub Secrets 是否正确配置 |
| 项目不存在 | 先在 Cloudflare 创建 Pages 项目 |
| 国内无法访问 | 绑定自定义域名可能改善 |

---

## 自定义域名配置

### GitHub Pages 自定义域名

1. 仓库 Settings → Pages → Custom domain
2. 输入你的域名
3. 在 DNS 添加 CNAME 记录指向 `username.github.io`

### Cloudflare Pages 自定义域名

1. Cloudflare Dashboard → Pages → 你的项目
2. Custom domains → Add custom domain
3. 如果域名已在 Cloudflare，DNS 自动配置

---

## 快速复用模板

### 复制到新项目

1. 复制 `.github/workflows/` 目录到新项目
2. 修改配置：
   - **GitHub Pages**: 修改 `VITE_BASE_URL`
   - **Cloudflare**: 修改 `--project-name`，配置 Secrets

### 同时使用两种方案

两个 workflow 可以同时存在，分别部署到不同平台，实现多镜像站点。

---

## 文件结构

```
.github/
└── workflows/
    ├── deploy-pages.yml      # GitHub Pages 部署
    └── deploy-cloudflare.yml # Cloudflare Pages 部署
```

---

## 相关链接

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
