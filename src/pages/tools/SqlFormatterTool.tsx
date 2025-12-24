import { useState } from "react";
import { Database, Copy, Sparkles } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SqlFormatterTool() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const formatSQL = () => {
    if (!input.trim()) {
      toast({ title: "请输入SQL", description: "请先输入要格式化的SQL语句", variant: "destructive" });
      return;
    }

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
    let indentLevel = 0;
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
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "已复制", description: "格式化结果已复制到剪贴板" });
  };

  const exampleSQL = "select id, name, email from users where status = 'active' and created_at > '2024-01-01' order by created_at desc limit 10";

  return (
    <ToolLayout
      title="SQL格式化"
      description="SQL代码格式化与美化"
      icon={Database}
    >
        <div className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">输入SQL</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput(exampleSQL)}
              >
                加载示例
              </Button>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入SQL语句..."
              className="min-h-[150px] font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <Button onClick={formatSQL} className="gap-2">
              <Sparkles className="h-4 w-4" />
              格式化SQL
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
  );
}
