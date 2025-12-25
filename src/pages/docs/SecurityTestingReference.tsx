import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle, Bug, Lock, Globe, Database, Code, Terminal } from "lucide-react";

const SecurityTestingReference = () => {
  const owaspTop10 = [
    {
      id: "A01",
      name: "访问控制失效",
      description: "用户可以访问未授权的功能或数据",
      severity: "critical",
      tests: [
        "水平越权测试 - 访问其他用户数据",
        "垂直越权测试 - 访问管理员功能",
        "IDOR测试 - 不安全的直接对象引用",
        "目录遍历 - ../../etc/passwd",
      ],
    },
    {
      id: "A02",
      name: "加密机制失效",
      description: "敏感数据未加密存储或传输",
      severity: "critical",
      tests: [
        "HTTPS配置检查",
        "敏感数据加密验证",
        "密码哈希算法检查",
        "API密钥暴露扫描",
      ],
    },
    {
      id: "A03",
      name: "注入攻击",
      description: "通过输入恶意数据执行非预期命令",
      severity: "critical",
      tests: [
        "SQL注入 - ' OR '1'='1",
        "XSS攻击 - <script>alert(1)</script>",
        "命令注入 - ; ls -la",
        "LDAP注入测试",
      ],
    },
    {
      id: "A04",
      name: "不安全设计",
      description: "设计阶段的安全缺陷",
      severity: "high",
      tests: [
        "业务逻辑漏洞测试",
        "威胁建模验证",
        "安全需求审查",
      ],
    },
    {
      id: "A05",
      name: "安全配置错误",
      description: "不安全的默认配置",
      severity: "high",
      tests: [
        "默认凭据检查",
        "错误信息泄露",
        "目录列表暴露",
        "不必要的服务/端口",
      ],
    },
    {
      id: "A06",
      name: "过时组件",
      description: "使用含有已知漏洞的组件",
      severity: "medium",
      tests: [
        "npm audit",
        "依赖版本检查",
        "CVE漏洞扫描",
      ],
    },
    {
      id: "A07",
      name: "身份验证失效",
      description: "身份验证和会话管理实现不当",
      severity: "critical",
      tests: [
        "弱密码策略测试",
        "暴力破解防护",
        "会话固定攻击",
        "会话超时验证",
      ],
    },
    {
      id: "A08",
      name: "软件和数据完整性失效",
      description: "未验证软件更新和数据完整性",
      severity: "high",
      tests: [
        "CI/CD管道安全",
        "依赖完整性验证",
        "反序列化攻击",
      ],
    },
    {
      id: "A09",
      name: "日志和监控失效",
      description: "缺乏有效的日志记录和监控",
      severity: "medium",
      tests: [
        "安全事件日志检查",
        "告警机制验证",
        "日志注入测试",
      ],
    },
    {
      id: "A10",
      name: "服务端请求伪造",
      description: "SSRF - 利用服务端发起恶意请求",
      severity: "high",
      tests: [
        "内网探测测试",
        "云元数据访问",
        "协议走私测试",
      ],
    },
  ];

  const injectionPayloads = [
    { type: "SQL注入", payloads: ["' OR '1'='1", "' OR '1'='1' --", "1; DROP TABLE users--", "' UNION SELECT NULL--"] },
    { type: "XSS", payloads: ["<script>alert('XSS')</script>", "<img src=x onerror=alert(1)>", "<svg onload=alert(1)>", "javascript:alert(1)"] },
    { type: "命令注入", payloads: ["; ls -la", "| cat /etc/passwd", "&& whoami", "`id`"] },
    { type: "路径遍历", payloads: ["../../../etc/passwd", "....//....//etc/passwd", "%2e%2e%2f", "..\\..\\..\\"] },
  ];

  const securityHeaders = [
    { header: "X-Frame-Options", value: "SAMEORIGIN", description: "防止点击劫持" },
    { header: "X-Content-Type-Options", value: "nosniff", description: "防止MIME类型嗅探" },
    { header: "X-XSS-Protection", value: "1; mode=block", description: "浏览器XSS过滤" },
    { header: "Strict-Transport-Security", value: "max-age=31536000", description: "强制HTTPS" },
    { header: "Content-Security-Policy", value: "default-src 'self'", description: "内容安全策略" },
    { header: "Referrer-Policy", value: "strict-origin-when-cross-origin", description: "控制Referer信息" },
  ];

  const tools = [
    { name: "OWASP ZAP", description: "Web漏洞扫描器", command: "docker run -t owasp/zap2docker-stable zap-baseline.py -t https://target.com" },
    { name: "Nikto", description: "Web服务器扫描", command: "nikto -h https://target.com" },
    { name: "SQLMap", description: "SQL注入检测", command: "sqlmap -u 'url?id=1' --dbs" },
    { name: "Nmap", description: "端口/服务扫描", command: "nmap -sV -sC target.com" },
    { name: "Nuclei", description: "漏洞模板扫描", command: "nuclei -u target.com -t cves/" },
    { name: "npm audit", description: "依赖漏洞检查", command: "npm audit --audit-level=high" },
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="owasp" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            OWASP Top 10
          </TabsTrigger>
          <TabsTrigger value="payloads" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            测试Payload
          </TabsTrigger>
          <TabsTrigger value="headers" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            安全响应头
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            安全工具
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
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
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
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {test}
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
                      <Code className="h-4 w-4 text-primary" />
                      {category.type}
                    </h3>
                    <div className="grid gap-2">
                      {category.payloads.map((payload, i) => (
                        <code
                          key={i}
                          className="block p-2 bg-muted rounded text-sm font-mono text-foreground break-all"
                        >
                          {payload}
                        </code>
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
              <h3 className="font-semibold text-foreground mb-3">Nginx 配置示例</h3>
              <pre className="p-4 bg-muted rounded text-sm font-mono text-foreground overflow-x-auto">
{`add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self';" always;
add_header Strict-Transport-Security "max-age=31536000" always;`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <Card key={tool.name} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground">{tool.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                  <pre className="p-3 bg-muted rounded text-xs font-mono text-foreground overflow-x-auto">
                    {tool.command}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default SecurityTestingReference;
