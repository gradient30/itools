import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Globe, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CommandItem {
  command: string;
  description: string;
}

interface CommandSection {
  title: string;
  commands: CommandItem[];
}

const curlCommands: CommandSection[] = [
  {
    title: "基础请求",
    commands: [
      { command: "curl https://example.com", description: "发送GET请求" },
      { command: "curl -o output.html https://example.com", description: "下载并保存到文件" },
      { command: "curl -O https://example.com/file.zip", description: "下载并保留原文件名" },
      { command: "curl -L https://example.com", description: "跟随重定向" },
      { command: "curl -I https://example.com", description: "只获取响应头" },
      { command: "curl -v https://example.com", description: "显示详细请求信息" },
      { command: "curl -s https://example.com", description: "静默模式" },
    ]
  },
  {
    title: "HTTP 方法",
    commands: [
      { command: "curl -X GET https://api.example.com/users", description: "GET 请求" },
      { command: "curl -X POST https://api.example.com/users", description: "POST 请求" },
      { command: "curl -X PUT https://api.example.com/users/1", description: "PUT 请求" },
      { command: "curl -X PATCH https://api.example.com/users/1", description: "PATCH 请求" },
      { command: "curl -X DELETE https://api.example.com/users/1", description: "DELETE 请求" },
    ]
  },
  {
    title: "请求头",
    commands: [
      { command: "curl -H 'Content-Type: application/json' url", description: "设置Content-Type" },
      { command: "curl -H 'Authorization: Bearer token' url", description: "Bearer Token认证" },
      { command: "curl -H 'Accept: application/json' url", description: "设置Accept头" },
      { command: "curl -H 'X-Custom-Header: value' url", description: "自定义请求头" },
      { command: "curl -A 'Mozilla/5.0' url", description: "设置User-Agent" },
      { command: "curl -e 'https://referer.com' url", description: "设置Referer" },
    ]
  },
  {
    title: "发送数据",
    commands: [
      { command: "curl -d 'key=value' url", description: "发送表单数据" },
      { command: "curl -d '{\"name\":\"John\"}' -H 'Content-Type: application/json' url", description: "发送JSON数据" },
      { command: "curl --data-urlencode 'msg=Hello World' url", description: "URL编码数据" },
      { command: "curl -d @data.json url", description: "从文件读取数据" },
      { command: "curl -F 'file=@photo.jpg' url", description: "上传文件" },
      { command: "curl -F 'file=@photo.jpg' -F 'name=photo' url", description: "文件与字段同时上传" },
    ]
  },
  {
    title: "认证方式",
    commands: [
      { command: "curl -u username:password url", description: "Basic认证" },
      { command: "curl -u username url", description: "Basic认证(提示输入密码)" },
      { command: "curl -H 'Authorization: Bearer token' url", description: "Bearer Token" },
      { command: "curl -H 'X-API-Key: your-api-key' url", description: "API Key认证" },
      { command: "curl --digest -u user:pass url", description: "Digest认证" },
      { command: "curl --ntlm -u user:pass url", description: "NTLM认证" },
    ]
  },
  {
    title: "Cookie 处理",
    commands: [
      { command: "curl -b 'session=abc123' url", description: "发送Cookie" },
      { command: "curl -b cookies.txt url", description: "从文件读取Cookie" },
      { command: "curl -c cookies.txt url", description: "保存Cookie到文件" },
      { command: "curl -b cookies.txt -c cookies.txt url", description: "读取并更新Cookie" },
    ]
  },
  {
    title: "SSL/TLS",
    commands: [
      { command: "curl -k https://example.com", description: "忽略SSL证书验证" },
      { command: "curl --cacert ca.crt https://example.com", description: "指定CA证书" },
      { command: "curl --cert client.crt --key client.key url", description: "客户端证书认证" },
      { command: "curl --tlsv1.2 https://example.com", description: "指定TLS版本" },
    ]
  },
  {
    title: "代理与超时",
    commands: [
      { command: "curl -x http://proxy:8080 url", description: "使用HTTP代理" },
      { command: "curl -x socks5://proxy:1080 url", description: "使用SOCKS5代理" },
      { command: "curl --connect-timeout 10 url", description: "连接超时(秒)" },
      { command: "curl -m 30 url", description: "最大执行时间(秒)" },
      { command: "curl --retry 3 url", description: "失败重试次数" },
      { command: "curl --limit-rate 100k url", description: "限制下载速度" },
    ]
  },
  {
    title: "常用组合",
    commands: [
      { command: "curl -s url | jq .", description: "格式化JSON响应" },
      { command: "curl -w '%{http_code}' -s -o /dev/null url", description: "只获取状态码" },
      { command: "curl -w '%{time_total}' -s -o /dev/null url", description: "获取响应时间" },
      { command: "curl -X POST -H 'Content-Type: application/json' -d '{\"key\":\"value\"}' url", description: "完整POST JSON请求" },
    ]
  },
];

function CommandCard({ command, description }: CommandItem) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
      <div className="flex-1 min-w-0">
        <code className="text-sm font-mono text-primary break-all">{command}</code>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <button
        onClick={handleCopy}
        className="ml-3 p-2 rounded-md hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

export default function CurlReference() {
  return (
    <ToolLayout
      title="CURL 命令指南"
      description="CURL HTTP 请求命令速查表"
      icon={Globe}
    >
      <div className="space-y-8">
        {curlCommands.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-foreground mb-4">{section.title}</h2>
            <div className="space-y-2">
              {section.commands.map((cmd) => (
                <CommandCard key={cmd.command} {...cmd} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
