import {
  ArrowLeftRight,
  FileCode,
  Sparkles,
  Lock,
  Type,
  BookOpen,
  Clock,
  Binary,
  Link,
  FileJson,
  Database,
  Code,
  Fingerprint,
  Shuffle,
  KeyRound,
  Hash,
  Palette,
  Regex,
  GitCompare,
  CaseSensitive,
  FileJson2,
  ShieldCheck,
  BarChart3,
  FileText,
  Timer,
  LucideIcon,
  Paintbrush,
  QrCode,
  ImageDown,
  Image,
  Key,
  Blend,
  GitBranch,
  Globe,
} from "lucide-react";

export interface Tool {
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: "conversion",
    name: "转换工具",
    description: "各种格式和数据转换",
    icon: ArrowLeftRight,
    tools: [
      {
        name: "时间戳转换",
        description: "Unix时间戳与日期时间互相转换",
        icon: Clock,
        path: "/tools/timestamp",
      },
      {
        name: "进制转换",
        description: "二进制、八进制、十进制、十六进制互转",
        icon: Binary,
        path: "/tools/radix",
      },
      {
        name: "URL编解码",
        description: "URL参数编码与解码",
        icon: Link,
        path: "/tools/url-codec",
      },
      {
        name: "JSON转换",
        description: "JSON转YAML/XML/CSV/TypeScript",
        icon: FileJson2,
        path: "/tools/json-converter",
      },
      {
        name: "JSON Diff对比",
        description: "对比两个JSON对象的差异",
        icon: GitCompare,
        path: "/tools/json-diff",
      },
      {
        name: "图片压缩",
        description: "压缩图片文件大小",
        icon: ImageDown,
        path: "/tools/image-compress",
      },
      {
        name: "Base64图片转换",
        description: "图片与Base64编码互转",
        icon: Image,
        path: "/tools/base64-image",
      },
      {
        name: "JWT解析",
        description: "解析JWT Token查看内容",
        icon: Key,
        path: "/tools/jwt",
      },
    ],
  },
  {
    id: "formatting",
    name: "格式化工具",
    description: "代码美化与格式化",
    icon: FileCode,
    tools: [
      {
        name: "JSON格式化",
        description: "JSON格式化、压缩、校验",
        icon: FileJson,
        path: "/tools/json-formatter",
      },
      {
        name: "SQL美化",
        description: "SQL语句格式化与美化",
        icon: Database,
        path: "/tools/sql-formatter",
      },
      {
        name: "HTML格式化",
        description: "HTML代码格式化与美化",
        icon: Code,
        path: "/tools/html-formatter",
      },
      {
        name: "CSS格式化",
        description: "CSS代码格式化与压缩",
        icon: Paintbrush,
        path: "/tools/css-formatter",
      },
    ],
  },
  {
    id: "generation",
    name: "生成工具",
    description: "各种数据和代码生成",
    icon: Sparkles,
    tools: [
      {
        name: "UUID生成",
        description: "生成多种版本的UUID",
        icon: Fingerprint,
        path: "/tools/uuid",
      },
      {
        name: "随机字符串",
        description: "自定义长度和字符集的随机字符串",
        icon: Shuffle,
        path: "/tools/random-string",
      },
      {
        name: "颜色选择器",
        description: "颜色格式转换与选择",
        icon: Palette,
        path: "/tools/color-picker",
      },
      {
        name: "Cron表达式生成",
        description: "生成和解析Cron定时任务表达式",
        icon: Timer,
        path: "/tools/cron",
      },
      {
        name: "二维码生成",
        description: "生成自定义二维码",
        icon: QrCode,
        path: "/tools/qrcode",
      },
      {
        name: "密码生成器",
        description: "生成安全的随机密码",
        icon: KeyRound,
        path: "/tools/password-generator",
      },
      {
        name: "颜色渐变生成器",
        description: "创建CSS渐变效果",
        icon: Blend,
        path: "/tools/gradient",
      },
    ],
  },
  {
    id: "encryption",
    name: "加密工具",
    description: "编码加密与解密",
    icon: Lock,
    tools: [
      {
        name: "Base64编解码",
        description: "Base64编码与解码",
        icon: KeyRound,
        path: "/tools/base64",
      },
      {
        name: "MD5加密",
        description: "计算文本的MD5哈希值",
        icon: Hash,
        path: "/tools/md5",
      },
      {
        name: "SHA加密",
        description: "计算文本的SHA哈希值",
        icon: ShieldCheck,
        path: "/tools/sha",
      },
    ],
  },
  {
    id: "text",
    name: "文本工具",
    description: "文本处理与分析",
    icon: Type,
    tools: [
      {
        name: "大小写转换",
        description: "文本大小写格式转换",
        icon: CaseSensitive,
        path: "/tools/case-converter",
      },
      {
        name: "文本比较",
        description: "对比两段文本的差异",
        icon: GitCompare,
        path: "/tools/text-diff",
      },
      {
        name: "正则表达式测试",
        description: "在线正则表达式测试与匹配",
        icon: Regex,
        path: "/tools/regex-tester",
      },
      {
        name: "文本统计",
        description: "统计文本字符、单词、行数等信息",
        icon: BarChart3,
        path: "/tools/text-stats",
      },
      {
        name: "Markdown转HTML",
        description: "将Markdown文本转换为HTML",
        icon: FileText,
        path: "/tools/markdown",
      },
    ],
  },
  {
    id: "documentation",
    name: "文档参考",
    description: "常用文档速查",
    icon: BookOpen,
    tools: [
      {
        name: "Git命令速查",
        description: "常用Git命令参考手册",
        icon: GitBranch,
        path: "/docs/git",
      },
      {
        name: "HTTP状态码",
        description: "HTTP响应状态码完整参考",
        icon: Globe,
        path: "/docs/http-status",
      },
      {
        name: "正则表达式参考",
        description: "正则表达式语法速查手册",
        icon: Regex,
        path: "/docs/regex",
      },
      {
        name: "Markdown语法",
        description: "Markdown语法速查手册",
        icon: FileText,
        path: "/docs/markdown",
      },
      {
        name: "SQL常用命令",
        description: "SQL数据库操作命令速查表",
        icon: Database,
        path: "/docs/sql",
      },
      {
        name: "Linux常用命令",
        description: "Linux系统操作命令速查表",
        icon: Code,
        path: "/docs/linux",
      },
      {
        name: "CURL命令指南",
        description: "CURL HTTP请求命令速查表",
        icon: Globe,
        path: "/docs/curl",
      },
      {
        name: "ASCII码表",
        description: "ASCII字符编码速查表",
        icon: Binary,
        path: "/docs/ascii",
      },
      {
        name: "颜色名称参考",
        description: "CSS/HTML标准颜色名称速查表",
        icon: Palette,
        path: "/docs/colors",
      },
      {
        name: "常用端口号",
        description: "网络服务常用端口速查表",
        icon: Globe,
        path: "/docs/ports",
      },
    ],
  },
];

// Flatten all tools for easy access
export const allTools = toolCategories.flatMap((category) => category.tools);
