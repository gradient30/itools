import { useState, useMemo, useCallback } from "react";
import { FileJson, Copy, CheckCircle2, AlertCircle, Wand2, Maximize2, Minimize2, X, Upload, ArrowRight } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LineNumberEditor } from "@/components/LineNumberEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useFileUpload } from "@/hooks/use-file-upload";
import { toast } from "sonner";
import { validateJson } from "@/utils/json-utils";



export default function JsonFormatterTool() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const uploader = useFileUpload({ multiple: false });

  const validation = useMemo(() => validateJson(input), [input]);

  const getStatus = () => {
    if (!input.trim()) return "default";
    if (!validation.isValid) return validation.isSuccessfullyFixed ? "warning" : "error";
    return "success";
  };

  const format = useCallback(() => {
    const sourceToFormat = validation.isSuccessfullyFixed && validation.correctedJson
      ? validation.correctedJson : input;

    if (!sourceToFormat.trim()) {
      toast.error("请输入JSON");
      return;
    }

    try {
      const parsed = JSON.parse(sourceToFormat);
      setOutput(JSON.stringify(parsed, null, indentSize));
      toast.success("格式化成功");
    } catch {
      toast.error("JSON格式错误，格式化失败");
    }
  }, [input, validation, indentSize]);

  const minify = useCallback(() => {
    const sourceToFormat = validation.isSuccessfullyFixed && validation.correctedJson
      ? validation.correctedJson : input;

    if (!sourceToFormat.trim()) {
      toast.error("请输入JSON");
      return;
    }

    try {
      const parsed = JSON.parse(sourceToFormat);
      setOutput(JSON.stringify(parsed));
      toast.success("压缩成功");
    } catch {
      toast.error("JSON格式错误，压缩失败");
    }
  }, [input, validation]);

  const applyFix = useCallback(() => {
    if (validation.correctedJson) {
      setInput(validation.correctedJson);
      toast.success("JSON格式错误已自动纠正");
    }
  }, [validation.correctedJson]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(output);
    toast.success("结果已复制到剪贴板");
  }, [output]);

  const sendToBase64 = () => {
    if (!output) {
      toast.error("没有内容可发送");
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success("跳转至Base64编码工具...");
    setTimeout(() => {
      navigate('/tools/base64');
    }, 1000);
  };

  const status = getStatus();

  return (
    <ToolLayout
      title="JSON格式化"
      description="JSON格式化、压缩、校验与自动修复，支持左右对比和拖拽文件"
      icon={FileJson}
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
                  输入源JSON
                  {input.trim() && (
                    <>
                      {status === "success" && (
                        <Badge variant="default" className="h-5 px-1 bg-green-500/20 text-green-600 border-green-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />有效
                        </Badge>
                      )}
                      {status === "warning" && (
                        <Badge variant="secondary" className="h-5 px-1 bg-amber-500/20 text-amber-600 border-amber-500/30">
                          <Wand2 className="h-3 w-3 mr-1" />可修复
                        </Badge>
                      )}
                      {status === "error" && (
                        <Badge variant="destructive" className="h-5 px-1">
                          <AlertCircle className="h-3 w-3 mr-1" />错误
                        </Badge>
                      )}
                    </>
                  )}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <input
                    type="file"
                    accept={uploader.accept}
                    ref={uploader.fileInputRef}
                    className="hidden"
                    onChange={uploader.createChangeHandler((files) => setInput(files[0].content))}
                  />
                  <Button variant="ghost" size="sm" onClick={uploader.triggerDialog} className="h-6 px-2 text-xs">
                    <Upload className="h-3 w-3 mr-1" />上传
                  </Button>
                  {input && (
                    <Button variant="ghost" size="sm" onClick={() => { setInput(""); setOutput(""); }} className="h-6 px-2 text-xs xl:flex text-muted-foreground">
                      <X className="h-3 w-3 mr-1" />清空
                    </Button>
                  )}
                </div>
              </div>

              {/* Fix Actions / Error Display */}
              {!validation.isValid && validation.isSuccessfullyFixed && validation.fixes.length > 0 && (
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <Wand2 className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-amber-600 font-medium">检测到可修复的问题：</p>
                      <ul className="mt-1 space-y-0.5 text-amber-600/80 list-disc list-inside">
                        {validation.fixes.map((fix, i) => <li key={i}>{fix}</li>)}
                      </ul>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={applyFix} className="h-6 text-xs text-amber-600 border-amber-200 hover:bg-amber-100">
                    应用修复
                  </Button>
                </div>
              )}
              {!validation.isValid && !validation.isSuccessfullyFixed && validation.error && (
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">
                        第 {validation.error.line} 行，第 {validation.error.column} 列错误
                      </p>
                      <p className="opacity-80 mt-1">{validation.error.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 p-0 px-6 pb-6">
            <LineNumberEditor
              value={input}
              onChange={setInput}
              placeholder='将未格式化的JSON粘贴或拖拽文件到这里...'
              errorLine={validation.error?.line}
              status={status}
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

                <Button onClick={format} disabled={!input.trim()} className="h-7 px-3 text-xs gap-1.5" size="sm">
                  <Maximize2 className="h-3 w-3" />格式化
                </Button>
                <Button onClick={minify} disabled={!input.trim()} variant="outline" className="h-7 px-3 text-xs gap-1.5 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" size="sm">
                  <Minimize2 className="h-3 w-3" />压缩
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-1 mt-2 border-t pt-2">
              <Button variant="ghost" size="sm" onClick={sendToBase64} disabled={!output} className="h-6 px-2 text-xs text-primary">
                <ArrowRight className="h-3 w-3 mr-1" />送至 Base64
              </Button>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output} className="h-6 px-2 text-xs">
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
