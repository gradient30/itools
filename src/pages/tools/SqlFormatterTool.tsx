import { useState } from "react";
import { Database, Copy, Sparkles, Upload, X } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineNumberEditor } from "@/components/LineNumberEditor";
import { useFileUpload } from "@/hooks/use-file-upload";
import { toast } from "sonner";

export default function SqlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const uploader = useFileUpload({ multiple: false });

  const formatSQL = () => {
    if (!input.trim()) {
      toast.error("请输入要格式化的SQL语句");
      return;
    }

    try {
      // Basic SQL formatting
      let formatted = input
        // Keywords to uppercase
        .replace(/\b(select|from|where|and|or|insert|into|values|update|set|delete|create|table|alter|drop|index|join|left|right|inner|outer|on|group|by|order|having|limit|offset|union|all|distinct|as|in|not|null|is|like|between|case|when|then|else|end)\b/gi,
          (match) => match.toUpperCase())
        // Add newlines before major keywords
        .replace(/\b(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|LIMIT|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|ON|SET|VALUES)\b/g,
          "\n$1")
        // Clean up multiple spaces
        .replace(/  +/g, " ")
        // Trim each line
        .split("\n")
        .map(line => line.trim())
        .filter(line => line)
        .join("\n");

      // Add indentation
      const lines = formatted.split("\n");
      formatted = lines.map(line => {
        const upperLine = line.toUpperCase();
        if (upperLine.startsWith("SELECT") || upperLine.startsWith("FROM") ||
          upperLine.startsWith("WHERE") || upperLine.startsWith("ORDER") ||
          upperLine.startsWith("GROUP") || upperLine.startsWith("HAVING")) {
          return line;
        }
        if (upperLine.startsWith("AND") || upperLine.startsWith("OR") ||
          upperLine.startsWith("ON") || upperLine.startsWith("SET")) {
          return "  " + line;
        }
        return line;
      }).join("\n");

      setOutput(formatted);
      toast.success("SQL格式化成功");
    } catch {
      toast.error("SQL格式化失败");
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

  const exampleSQL = "select id, name, email from users where status = 'active' and created_at > '2024-01-01' order by created_at desc limit 10";

  return (
    <ToolLayout
      title="SQL美化"
      description="SQL语句格式化与美化，支持左右对比和直接拖拽文件"
      icon={Database}
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
                  输入源SQL
                </CardTitle>
                <div className="flex items-center gap-1">
                  <input
                    type="file"
                    accept=".sql,.txt"
                    ref={uploader.fileInputRef}
                    className="hidden"
                    onChange={uploader.createChangeHandler((files) => setInput(files[0].content))}
                  />
                  <Button variant="ghost" size="sm" onClick={uploader.triggerDialog} className="h-6 px-2 text-xs">
                    <Upload className="h-3 w-3 mr-1" />上传
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setInput(exampleSQL)} className="h-6 px-2 text-xs text-muted-foreground">
                    示例SQL
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
              placeholder='将未格式化的SQL语句粘贴或拖拽文件到这里...'
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
                <CardTitle className="text-base font-semibold">格式化结果</CardTitle>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Button onClick={formatSQL} disabled={!input.trim()} className="h-8 px-3 text-xs gap-1.5" size="sm">
                  <Sparkles className="h-3 w-3" />格式化SQL
                </Button>
                <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output} className="h-8 px-3 text-xs">
                  <Copy className="h-3 w-3 mr-1" />复制结果
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 p-0 px-6 pb-6 mt-1">
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
