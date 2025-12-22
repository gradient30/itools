import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paintbrush, Copy, Wand2, Minimize2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CssFormatterTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const formatCSS = (css: string, minify: boolean = false): string => {
    if (minify) {
      return css
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*{\s*/g, "{")
        .replace(/\s*}\s*/g, "}")
        .replace(/\s*:\s*/g, ":")
        .replace(/\s*;\s*/g, ";")
        .replace(/;}/g, "}")
        .trim();
    }

    let formatted = "";
    let indentLevel = 0;
    const indent = "  ";

    const cleanCss = css
      .replace(/\/\*[\s\S]*?\*\//g, (match) => `/*COMMENT${match}COMMENT*/`)
      .replace(/\s+/g, " ")
      .trim();

    let i = 0;
    while (i < cleanCss.length) {
      const char = cleanCss[i];

      if (cleanCss.slice(i, i + 9) === "/*COMMENT") {
        const endIndex = cleanCss.indexOf("COMMENT*/", i);
        if (endIndex !== -1) {
          const comment = cleanCss.slice(i + 9, endIndex);
          formatted += comment + "\n" + indent.repeat(indentLevel);
          i = endIndex + 9;
          continue;
        }
      }

      if (char === "{") {
        formatted = formatted.trimEnd() + " {\n";
        indentLevel++;
        formatted += indent.repeat(indentLevel);
        i++;
        while (i < cleanCss.length && cleanCss[i] === " ") i++;
        continue;
      }

      if (char === "}") {
        indentLevel = Math.max(0, indentLevel - 1);
        formatted = formatted.trimEnd() + "\n" + indent.repeat(indentLevel) + "}\n";
        if (indentLevel > 0) {
          formatted += indent.repeat(indentLevel);
        } else {
          formatted += "\n";
        }
        i++;
        while (i < cleanCss.length && cleanCss[i] === " ") i++;
        continue;
      }

      if (char === ";") {
        formatted += ";\n" + indent.repeat(indentLevel);
        i++;
        while (i < cleanCss.length && cleanCss[i] === " ") i++;
        continue;
      }

      if (char === ":") {
        formatted = formatted.trimEnd() + ": ";
        i++;
        while (i < cleanCss.length && cleanCss[i] === " ") i++;
        continue;
      }

      formatted += char;
      i++;
    }

    return formatted
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .replace(/{\s*\n\s*\n/g, "{\n")
      .trim();
  };

  const handleFormat = () => {
    if (!input.trim()) {
      toast({
        title: "错误",
        description: "请输入CSS代码",
        variant: "destructive",
      });
      return;
    }

    try {
      const formatted = formatCSS(input);
      setOutput(formatted);
      toast({ title: "格式化成功" });
    } catch {
      toast({
        title: "格式化失败",
        description: "CSS代码格式可能有误",
        variant: "destructive",
      });
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      toast({
        title: "错误",
        description: "请输入CSS代码",
        variant: "destructive",
      });
      return;
    }

    const minified = formatCSS(input, true);
    setOutput(minified);
    toast({ title: "压缩成功" });
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast({ title: "已复制到剪贴板" });
  };

  return (
    <ToolLayout
      title="CSS格式化"
      description="CSS代码格式化与压缩"
      icon={Paintbrush}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">输入CSS</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={`.container{display:flex;justify-content:center;align-items:center;}.button{background-color:#007bff;color:white;padding:10px 20px;border:none;border-radius:4px;}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={handleFormat}>
            <Wand2 className="mr-2 h-4 w-4" />
            格式化
          </Button>
          <Button onClick={handleMinify} variant="secondary">
            <Minimize2 className="mr-2 h-4 w-4" />
            压缩
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">输出结果</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              placeholder="处理结果将显示在这里..."
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CssFormatterTool;
