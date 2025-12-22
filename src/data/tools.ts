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
  LucideIcon,
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
    ],
  },
  {
    id: "text",
    name: "文本工具",
    description: "文本处理与分析",
    icon: Type,
    tools: [],
  },
  {
    id: "documentation",
    name: "文档参考",
    description: "常用文档速查",
    icon: BookOpen,
    tools: [],
  },
];

// Flatten all tools for easy access
export const allTools = toolCategories.flatMap((category) => category.tools);
