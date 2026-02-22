import { useState } from "react";
import { Code, Copy, Sparkles, Wand2, Upload, X, Maximize2, Minimize2 } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineNumberEditor } from "@/components/LineNumberEditor";
import { useFileUpload } from "@/hooks/use-file-upload";
import { toast } from "sonner";

export default function HtmlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const uploader = useFileUpload({ multiple: false });

  const formatHTML = () => {
    if (!input.trim()) {
      toast.error("请输入要格式化的HTML代码");
      return;
    }

    try {
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
      toast.success("HTML格式化成功");
    } catch {
      toast.error("HTML格式化失败");
    }
  };

  const minifyHTML = () => {
    if (!input.trim()) {
      toast.error("请输入要压缩的HTML代码");
      return;
    }

    try {
      const minified = input
        .replace(/\s+/g, " ")
        .replace(/>\s+</g, "><")
        .trim();

      setOutput(minified);
      toast.success("HTML压缩成功");
    } catch {
      toast.error("HTML压缩失败");
    }
  };

  const copyToClipboard = () => {
    if (!output) {
      toast.error("没有内容可复制");
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success("格式化结果已复制到剪贴板");
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  const exampleHTML = '<div class="container"><h1>Hello World</h1><p>This is a paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul></div>';

  return (
    <ToolLayout
      title="HTML格式化"
      description="HTML代码格式化、美化与压缩，支持左右对比和直接拖拽文件"
      icon={Code}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto min-h-[600px]">
        {/* Left Input Section */}
        <Card
          {...uploader.createDropHandler((files) => setInput(files[0].content))}
          className="border-2 border-dashed border-transparent hover:border-primary/50 transition-colors flex flex-col"
        >
          <CardHeader className="pb-3 shrink-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  输入源HTML
                </CardTitle>
                <div className="flex items-center gap-1">
                  <input
                    type="file"
                    accept=".html,.txt,.vue"
                    ref={uploader.fileInputRef}
                    className="hidden"
                    onChange={uploader.createChangeHandler((files) => setInput(files[0].content))}
                  />
                  <Button variant="ghost" size="sm" onClick={uploader.triggerDialog} className="h-6 px-2 text-xs">
                    <Upload className="h-3 w-3 mr-1" />上传
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setInput(exampleHTML)} className="h-6 px-2 text-xs text-muted-foreground">
                    示例HTML
                  </Button>
                  {input && (
                    <Button variant="ghost" size="sm" onClick={clear} className="h-6 px-2 text-xs text-muted-foreground">
                      <X className="h-3 w-3 mr-1" />清空
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 p-0 px-6 pb-6">
            <LineNumberEditor
              value={input}
              onChange={setInput}
              placeholder='将未格式化的HTML代码粘贴或拖拽文件到这里...'
              status={input.trim() ? "default" : "default"}
              minHeight={400}
            />
          </CardContent>
        </Card>

        {/* Right Output Section */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">处理结果</CardTitle>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-end">
                <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
                  <Label className="text-[11px] whitespace-nowrap px-1">缩进</Label>
                  <select
                    value={indentSize}
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    className="h-6 rounded border-none bg-transparent text-xs w-16"
                  >
                    <option value={2}>2空格</option>
                    <option value={4}>4空格</option>
                  </select>
                </div>

                <Button onClick={formatHTML} disabled={!input.trim()} className="h-7 px-3 text-xs gap-1.5" size="sm">
                  <Sparkles className="h-3 w-3" />格式化
                </Button>
                <Button onClick={minifyHTML} disabled={!input.trim()} variant="outline" className="h-7 px-3 text-xs gap-1.5 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" size="sm">
                  <Minimize2 className="h-3 w-3" />压缩
                </Button>
              </div>
            </div>
            <div className="flex justify-end mt-2 pt-2 border-t">
              <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output} className="h-8 px-3 text-xs">
                <Copy className="h-3 w-3 mr-1" />复制结果
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 p-0 px-6 pb-6">
            <LineNumberEditor
              value={output}
              onChange={() => { }}
              placeholder="结果将显示在这里..."
              readOnly
              status="default"
              minHeight={400}
            />
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
