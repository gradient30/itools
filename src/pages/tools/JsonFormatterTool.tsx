import { useState } from "react";
import { FileJson, Copy, Check, AlertCircle, Minimize2, Maximize2 } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function JsonFormatterTool() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
      toast({ title: "JSON无效", description: String(e), variant: "destructive" });
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
      toast({ title: "JSON无效", description: String(e), variant: "destructive" });
    }
  };

  const validate = () => {
    try {
      JSON.parse(input);
      setIsValid(true);
      toast({ title: "验证通过", description: "JSON格式正确" });
    } catch (e) {
      setIsValid(false);
      toast({ title: "验证失败", description: String(e), variant: "destructive" });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "已复制", description: "格式化结果已复制到剪贴板" });
  };

  return (
    <ToolLayout
      title="JSON格式化"
      description="JSON格式化、压缩、校验"
      icon={FileJson}
    >
        <div className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">输入JSON</Label>
              {isValid !== null && (
                <span className={`flex items-center gap-1 text-sm ${isValid ? "text-green-500" : "text-destructive"}`}>
                  {isValid ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {isValid ? "格式正确" : "格式错误"}
                </span>
              )}
            </div>
            <Textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setIsValid(null);
              }}
              placeholder='{"name": "示例", "value": 123}'
              className="min-h-[200px] font-mono text-sm"
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
                <option value={1}>Tab</option>
              </select>
            </div>
            <Button onClick={format} className="gap-2">
              <Maximize2 className="h-4 w-4" />
              格式化
            </Button>
            <Button onClick={minify} variant="outline" className="gap-2">
              <Minimize2 className="h-4 w-4" />
              压缩
            </Button>
            <Button onClick={validate} variant="outline" className="gap-2">
              <Check className="h-4 w-4" />
              验证
            </Button>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">输出结果</Label>
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
