import { useState } from "react";
import { FileText, Copy, Eye, Code } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Simple Markdown to HTML converter
function markdownToHtml(md: string): string {
  let html = md;

  // Escape HTML entities first
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Code blocks (```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Horizontal rules
  html = html.replace(/^(---|\*\*\*|___)$/gm, "<hr />");

  // Unordered lists
  html = html.replace(/^[\*\-]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

  // Paragraphs
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, "<p>$1</p>");

  // Clean up extra paragraph tags around block elements
  html = html.replace(/<p>(<h[1-6]>)/g, "$1");
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");
  html = html.replace(/<p>(<ul>)/g, "$1");
  html = html.replace(/(<\/ul>)<\/p>/g, "$1");
  html = html.replace(/<p>(<blockquote>)/g, "$1");
  html = html.replace(/(<\/blockquote>)<\/p>/g, "$1");
  html = html.replace(/<p>(<pre>)/g, "$1");
  html = html.replace(/(<\/pre>)<\/p>/g, "$1");
  html = html.replace(/<p>(<hr \/>)/g, "$1");
  html = html.replace(/(<hr \/>)<\/p>/g, "$1");

  // Remove empty paragraphs
  html = html.replace(/<p><\/p>/g, "");

  return html.trim();
}

const sampleMarkdown = `# 标题一

这是一段普通文本，包含 **粗体** 和 *斜体* 以及 \`行内代码\`。

## 标题二

- 无序列表项 1
- 无序列表项 2
- 无序列表项 3

### 标题三

1. 有序列表项 1
2. 有序列表项 2

> 这是一段引用文本

[链接文字](https://example.com)

---

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
`;

export default function MarkdownTool() {
  const { toast } = useToast();
  const [markdown, setMarkdown] = useState("");
  const [activeTab, setActiveTab] = useState("preview");

  const html = markdownToHtml(markdown);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制", description: `${label}已复制到剪贴板` });
  };

  const loadSample = () => {
    setMarkdown(sampleMarkdown);
  };

  return (
    <Layout>
      <ToolLayout
        title="Markdown转HTML"
        description="将Markdown文本转换为HTML"
        icon={FileText}
      >
        <div className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Markdown 输入</Label>
              <Button variant="ghost" size="sm" onClick={loadSample}>
                加载示例
              </Button>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="在此输入Markdown文本..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* Output */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="h-4 w-4" />
                  预览
                </TabsTrigger>
                <TabsTrigger value="html" className="gap-2">
                  <Code className="h-4 w-4" />
                  HTML
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(html, "HTML")}
                disabled={!html}
              >
                <Copy className="h-4 w-4 mr-1" />
                复制HTML
              </Button>
            </div>

            <TabsContent value="preview" className="mt-4">
              <div
                className="p-4 rounded-lg bg-card border border-border/50 min-h-[200px] prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
                style={{
                  // Basic styling for preview
                }}
              />
              <style>{`
                .prose h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
                .prose h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
                .prose h3 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; }
                .prose p { margin: 0.5em 0; }
                .prose ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
                .prose li { margin: 0.25em 0; }
                .prose blockquote { border-left: 3px solid hsl(var(--primary)); padding-left: 1em; margin: 0.5em 0; color: hsl(var(--muted-foreground)); }
                .prose code { background: hsl(var(--muted)); padding: 0.2em 0.4em; border-radius: 0.25em; font-size: 0.9em; }
                .prose pre { background: hsl(var(--muted)); padding: 1em; border-radius: 0.5em; overflow-x: auto; }
                .prose pre code { background: none; padding: 0; }
                .prose hr { border: none; border-top: 1px solid hsl(var(--border)); margin: 1em 0; }
                .prose a { color: hsl(var(--primary)); text-decoration: underline; }
                .prose strong { font-weight: bold; }
                .prose em { font-style: italic; }
                .prose del { text-decoration: line-through; }
              `}</style>
            </TabsContent>

            <TabsContent value="html" className="mt-4">
              <Textarea
                value={html}
                readOnly
                placeholder="HTML输出将显示在这里"
                className="min-h-[200px] font-mono text-sm bg-muted/30"
              />
            </TabsContent>
          </Tabs>

          {/* Syntax Reference */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <Label className="text-sm font-semibold mb-3 block">Markdown 语法速查</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><code># 标题</code> → 标题</div>
              <div><code>**粗体**</code> → <strong>粗体</strong></div>
              <div><code>*斜体*</code> → <em>斜体</em></div>
              <div><code>`代码`</code> → <code>代码</code></div>
              <div><code>[链接](url)</code> → 链接</div>
              <div><code>- 列表</code> → 列表</div>
              <div><code>&gt; 引用</code> → 引用</div>
              <div><code>---</code> → 分割线</div>
            </div>
          </div>
        </div>
      </ToolLayout>
    </Layout>
  );
}
