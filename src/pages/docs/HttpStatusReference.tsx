import { ToolLayout } from "@/components/ToolLayout";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCode {
  code: number;
  name: string;
  description: string;
}

interface StatusCategory {
  range: string;
  title: string;
  color: string;
  codes: StatusCode[];
}

const httpStatusCodes: StatusCategory[] = [
  {
    range: "1xx",
    title: "信息响应",
    color: "text-blue-500",
    codes: [
      { code: 100, name: "Continue", description: "继续。客户端应继续其请求" },
      { code: 101, name: "Switching Protocols", description: "切换协议。服务器根据客户端请求切换协议" },
      { code: 102, name: "Processing", description: "处理中。服务器已收到并正在处理请求" },
    ],
  },
  {
    range: "2xx",
    title: "成功响应",
    color: "text-green-500",
    codes: [
      { code: 200, name: "OK", description: "请求成功。一般用于GET与POST请求" },
      { code: 201, name: "Created", description: "已创建。成功请求并创建了新的资源" },
      { code: 202, name: "Accepted", description: "已接受。已接受请求，但尚未处理" },
      { code: 204, name: "No Content", description: "无内容。服务器成功处理，但未返回内容" },
      { code: 206, name: "Partial Content", description: "部分内容。服务器成功处理了部分GET请求" },
    ],
  },
  {
    range: "3xx",
    title: "重定向",
    color: "text-yellow-500",
    codes: [
      { code: 301, name: "Moved Permanently", description: "永久移动。请求的资源已被永久移动到新URI" },
      { code: 302, name: "Found", description: "临时移动。资源临时被移动到另一个URI" },
      { code: 303, name: "See Other", description: "查看其他位置。使用GET请求查看" },
      { code: 304, name: "Not Modified", description: "未修改。资源未修改，可使用缓存" },
      { code: 307, name: "Temporary Redirect", description: "临时重定向。使用相同方法重定向" },
      { code: 308, name: "Permanent Redirect", description: "永久重定向。使用相同方法重定向" },
    ],
  },
  {
    range: "4xx",
    title: "客户端错误",
    color: "text-orange-500",
    codes: [
      { code: 400, name: "Bad Request", description: "错误请求。服务器无法理解请求语法" },
      { code: 401, name: "Unauthorized", description: "未授权。请求要求身份验证" },
      { code: 403, name: "Forbidden", description: "禁止。服务器拒绝请求" },
      { code: 404, name: "Not Found", description: "未找到。服务器找不到请求的资源" },
      { code: 405, name: "Method Not Allowed", description: "方法不允许。禁用请求中指定的方法" },
      { code: 408, name: "Request Timeout", description: "请求超时。服务器等待请求超时" },
      { code: 409, name: "Conflict", description: "冲突。请求与服务器当前状态冲突" },
      { code: 410, name: "Gone", description: "已删除。资源已被永久删除" },
      { code: 413, name: "Payload Too Large", description: "负载过大。请求实体过大" },
      { code: 414, name: "URI Too Long", description: "URI过长。请求的URI过长" },
      { code: 415, name: "Unsupported Media Type", description: "不支持的媒体类型" },
      { code: 422, name: "Unprocessable Entity", description: "无法处理的实体。请求格式正确但语义错误" },
      { code: 429, name: "Too Many Requests", description: "请求过多。用户发送了太多请求" },
    ],
  },
  {
    range: "5xx",
    title: "服务器错误",
    color: "text-red-500",
    codes: [
      { code: 500, name: "Internal Server Error", description: "服务器内部错误。无法完成请求" },
      { code: 501, name: "Not Implemented", description: "未实现。服务器不支持请求的功能" },
      { code: 502, name: "Bad Gateway", description: "错误网关。上游服务器返回无效响应" },
      { code: 503, name: "Service Unavailable", description: "服务不可用。服务器暂时过载或维护" },
      { code: 504, name: "Gateway Timeout", description: "网关超时。上游服务器未及时响应" },
      { code: 505, name: "HTTP Version Not Supported", description: "HTTP版本不受支持" },
    ],
  },
];

export default function HttpStatusReference() {
  return (
    <ToolLayout
      title="HTTP状态码"
      description="HTTP响应状态码完整参考"
      icon={Globe}
    >
      <div className="space-y-8">
        {httpStatusCodes.map((category) => (
          <div key={category.range}>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className={cn("font-mono text-xl", category.color)}>{category.range}</span>
              <span>{category.title}</span>
            </h3>
            <div className="grid gap-2">
              {category.codes.map((status) => (
                <div
                  key={status.code}
                  className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50 border border-border/50"
                >
                  <span className={cn("font-mono font-bold text-lg w-12", category.color)}>
                    {status.code}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{status.name}</p>
                    <p className="text-sm text-muted-foreground">{status.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
