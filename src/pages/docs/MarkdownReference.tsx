import { ToolLayout } from "@/components/ToolLayout";
import { FileText, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface MarkdownItem {
  syntax: string;
  description: string;
  rendered?: string;
}

interface MarkdownSection {
  title: string;
  items: MarkdownItem[];
}

const markdownSyntax: MarkdownSection[] = [
  {
    title: "标题",
    items: [
      { syntax: "# 标题1", description: "一级标题" },
      { syntax: "## 标题2", description: "二级标题" },
      { syntax: "### 标题3", description: "三级标题" },
      { syntax: "#### 标题4", description: "四级标题" },
      { syntax: "##### 标题5", description: "五级标题" },
      { syntax: "###### 标题6", description: "六级标题" },
    ],
  },
  {
    title: "文本格式",
    items: [
      { syntax: "**粗体文本**", description: "粗体" },
      { syntax: "*斜体文本*", description: "斜体" },
      { syntax: "***粗斜体***", description: "粗斜体" },
      { syntax: "~~删除线~~", description: "删除线" },
      { syntax: "`行内代码`", description: "行内代码" },
      { syntax: "> 引用文本", description: "引用块" },
    ],
  },
  {
    title: "列表",
    items: [
      { syntax: "- 项目1\n- 项目2\n- 项目3", description: "无序列表（也可用 * 或 +）" },
      { syntax: "1. 第一项\n2. 第二项\n3. 第三项", description: "有序列表" },
      { syntax: "- [ ] 未完成任务\n- [x] 已完成任务", description: "任务列表" },
    ],
  },
  {
    title: "链接与图片",
    items: [
      { syntax: "[链接文本](https://example.com)", description: "超链接" },
      { syntax: "[链接文本](https://example.com \"标题\")", description: "带标题的链接" },
      { syntax: "![替代文本](image.png)", description: "图片" },
      { syntax: "[![图片链接](image.png)](https://example.com)", description: "可点击的图片链接" },
    ],
  },
  {
    title: "代码块",
    items: [
      { syntax: "```javascript\nconst hello = 'world';\n```", description: "带语法高亮的代码块" },
      { syntax: "```\n普通代码块\n```", description: "普通代码块" },
      { syntax: "    四个空格缩进", description: "缩进代码块" },
    ],
  },
  {
    title: "表格",
    items: [
      {
        syntax: "| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| A1  | B1  | C1  |\n| A2  | B2  | C2  |",
        description: "基本表格",
      },
      {
        syntax: "| 左对齐 | 居中 | 右对齐 |\n|:-------|:----:|-------:|\n| 内容   | 内容 | 内容   |",
        description: "对齐方式",
      },
    ],
  },
  {
    title: "分隔线",
    items: [
      { syntax: "---", description: "水平分隔线" },
      { syntax: "***", description: "水平分隔线" },
      { syntax: "___", description: "水平分隔线" },
    ],
  },
  {
    title: "转义字符",
    items: [
      { syntax: "\\*星号\\*", description: "转义特殊字符，显示 *星号*" },
      { syntax: "\\`反引号\\`", description: "转义反引号" },
      { syntax: "\\# 井号", description: "转义井号" },
    ],
  },
  {
    title: "扩展语法（部分平台支持）",
    items: [
      { syntax: "脚注文本[^1]\n\n[^1]: 脚注内容", description: "脚注" },
      { syntax: "术语\n: 定义内容", description: "定义列表" },
      { syntax: "==高亮文本==", description: "高亮标记" },
      { syntax: "H~2~O", description: "下标" },
      { syntax: "X^2^", description: "上标" },
    ],
  },
];

function SyntaxCard({ syntax, description }: MarkdownItem) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(syntax);
    setCopied(true);
    toast({ title: "已复制", description: "语法已复制到剪贴板" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50 group">
      <div className="flex-1 min-w-0">
        <pre className="text-sm font-mono text-primary whitespace-pre-wrap break-all">{syntax}</pre>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default function MarkdownReference() {
  return (
    <ToolLayout
      title="Markdown语法"
      description="Markdown语法速查手册"
      icon={FileText}
    >
      <div className="space-y-8">
        {markdownSyntax.map((section) => (
          <div key={section.title}>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {section.title}
            </h3>
            <div className="grid gap-2">
              {section.items.map((item, index) => (
                <SyntaxCard key={index} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
