import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineNumberEditor } from "@/components/LineNumberEditor";
import { Paintbrush, Copy, Wand2, Minimize2, Upload, X } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { toast } from "sonner";

export default function CssFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const uploader = useFileUpload({ multiple: false });

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
      toast.error("请输入要格式化的CSS代码");
      return;
    }

    try {
      const formatted = formatCSS(input);
      setOutput(formatted);
      toast.success("CSS格式化成功");
    } catch {
      toast.error("CSS格式化失败");
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      toast.error("请输入要压缩的CSS代码");
      return;
    }

    try {
      const minified = formatCSS(input, true);
      setOutput(minified);
      toast.success("CSS压缩成功");
    } catch {
      toast.error("CSS压缩失败");
    }
  };

  const handleCopy = () => {
    if (!output) {
      toast.error("没有内容可复制");
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success("处理结果已复制到剪贴板");
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  const exampleCSS = `.container{display:flex;justify-content:center;align-items:center;}.button{background-color:#007bff;color:white;padding:10px 20px;border:none;border-radius:4px;}`;

  return (
    <ToolLayout
      title="CSS格式化"
      description="CSS代码格式化、美化与压缩，支持左右对比和直接拖拽文件"
      icon={Paintbrush}
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
                  输入源CSS
                </CardTitle>
                <div className="flex items-center gap-1">
                  <input
                    type="file"
                    accept=".css,.txt"
                    ref={uploader.fileInputRef}
                    className="hidden"
                    onChange={uploader.createChangeHandler((files) => setInput(files[0].content))}
                  />
                  <Button variant="ghost" size="sm" onClick={uploader.triggerDialog} className="h-6 px-2 text-xs">
                    <Upload className="h-3 w-3 mr-1" />上传
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setInput(exampleCSS)} className="h-6 px-2 text-xs text-muted-foreground">
                    示例CSS
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
              placeholder='将未格式化的CSS代码粘贴或拖拽文件到这里...'
              status="default"
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
                <Button onClick={handleFormat} disabled={!input.trim()} className="h-7 px-3 text-xs gap-1.5" size="sm">
                  <Wand2 className="h-3 w-3" />格式化
                </Button>
                <Button onClick={handleMinify} disabled={!input.trim()} variant="outline" className="h-7 px-3 text-xs gap-1.5 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" size="sm">
                  <Minimize2 className="h-3 w-3" />压缩
                </Button>
              </div>
            </div>
            <div className="flex justify-end mt-2 pt-2 border-t">
              <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output} className="h-8 px-3 text-xs">
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
