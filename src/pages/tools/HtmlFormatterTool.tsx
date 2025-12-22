import { useState } from "react";
import { Code, Copy, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function HtmlFormatterTool() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const formatHTML = () => {
    if (!input.trim()) {
      toast({ title: "请输入HTML", description: "请先输入要格式化的HTML代码", variant: "destructive" });
      return;
    }

    const indent = " ".repeat(indentSize);
    let formatted = "";
    let indentLevel = 0;
    
    // Normalize input
    let html = input
      .replace(/>\s+</g, "><")
      .replace(/\s+/g, " ")
      .trim();

    // Simple HTML formatter
    const selfClosingTags = ["br", "hr", "img", "input", "meta", "link", "area", "base", "col", "embed", "source", "track", "wbr"];
    
    // Split by tags while keeping them
    const tokens = html.split(/(<[^>]+>)/g).filter(Boolean);
    
    tokens.forEach((token) => {
      if (token.startsWith("</")) {
        // Closing tag
        indentLevel = Math.max(0, indentLevel - 1);
        formatted += indent.repeat(indentLevel) + token + "\n";
      } else if (token.startsWith("<")) {
        // Opening or self-closing tag
        const tagMatch = token.match(/<(\w+)/);
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : "";
        const isSelfClosing = selfClosingTags.includes(tagName) || token.endsWith("/>");
        
        formatted += indent.repeat(indentLevel) + token + "\n";
        
        if (!isSelfClosing && !token.startsWith("<!")) {
          indentLevel++;
        }
      } else {
        // Text content
        const text = token.trim();
        if (text) {
          formatted += indent.repeat(indentLevel) + text + "\n";
        }
      }
    });

    setOutput(formatted.trim());
  };

  const minifyHTML = () => {
    if (!input.trim()) {
      toast({ title: "请输入HTML", description: "请先输入要压缩的HTML代码", variant: "destructive" });
      return;
    }
    
    const minified = input
      .replace(/\s+/g, " ")
      .replace(/>\s+</g, "><")
      .trim();
    
    setOutput(minified);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "已复制", description: "结果已复制到剪贴板" });
  };

  const exampleHTML = '<div class="container"><h1>Hello World</h1><p>This is a paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul></div>';

  return (
    <Layout>
      <ToolLayout
        title="HTML格式化"
        description="HTML代码格式化与美化"
        icon={Code}
      >
        <div className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">输入HTML</Label>
              <Button variant="ghost" size="sm" onClick={() => setInput(exampleHTML)}>
                加载示例
              </Button>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入HTML代码..."
              className="min-h-[150px] font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm">缩进:</Label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value={2}>2空格</option>
                <option value={4}>4空格</option>
              </select>
            </div>
            <Button onClick={formatHTML} className="gap-2">
              <Sparkles className="h-4 w-4" />
              格式化
            </Button>
            <Button onClick={minifyHTML} variant="outline">
              压缩
            </Button>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">格式化结果</Label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output}>
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="格式化结果将显示在这里"
              className="min-h-[200px] font-mono text-sm bg-muted/30"
            />
          </div>
        </div>
      </ToolLayout>
    </Layout>
  );
}
