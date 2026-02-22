import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompare, ArrowRight, Plus, Minus, Equal, Upload, AlertCircle, Wand2, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { useFileUpload, FileData } from "@/hooks/use-file-upload";
import { LineNumberEditor } from "@/components/LineNumberEditor";
import { validateJson } from "@/utils/json-utils";
import { Badge } from "@/components/ui/badge";

interface DiffResult {
  type: "added" | "removed" | "unchanged";
  path: string;
  oldValue?: unknown;
  newValue?: unknown;
}

const JsonDiffTool = () => {
  const [leftJson, setLeftJson] = useState("");
  const [rightJson, setRightJson] = useState("");
  const [diffResults, setDiffResults] = useState<DiffResult[]>([]);

  // Validations
  const leftValidation = useMemo(() => validateJson(leftJson), [leftJson]);
  const rightValidation = useMemo(() => validateJson(rightJson), [rightJson]);

  // Multi file upload
  const multiUploader = useFileUpload({ multiple: true });
  const leftUploader = useFileUpload({ multiple: false });
  const rightUploader = useFileUpload({ multiple: false });

  const handleMultiFiles = (files: FileData[]) => {
    if (files.length >= 1) setLeftJson(files[0].content);
    if (files.length >= 2) setRightJson(files[1].content);
  };

  const getStatus = (input: string, validation: ReturnType<typeof validateJson>) => {
    if (!input.trim()) return "default";
    if (!validation.isValid) return validation.isSuccessfullyFixed ? "warning" : "error";
    return "success";
  };

  const compareObjects = (
    obj1: unknown,
    obj2: unknown,
    path: string = ""
  ): DiffResult[] => {
    const results: DiffResult[] = [];

    if (typeof obj1 !== typeof obj2) {
      results.push({ type: "removed", path: path || "root", oldValue: obj1 });
      results.push({ type: "added", path: path || "root", newValue: obj2 });
      return results;
    }

    if (obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        if (obj1 !== null)
          results.push({ type: "removed", path: path || "root", oldValue: obj1 });
        if (obj2 !== null)
          results.push({ type: "added", path: path || "root", newValue: obj2 });
      } else {
        results.push({ type: "unchanged", path: path || "root", oldValue: obj1 });
      }
      return results;
    }

    if (typeof obj1 !== "object") {
      if (obj1 !== obj2) {
        results.push({ type: "removed", path: path || "root", oldValue: obj1 });
        results.push({ type: "added", path: path || "root", newValue: obj2 });
      } else {
        results.push({ type: "unchanged", path: path || "root", oldValue: obj1 });
      }
      return results;
    }

    const o1 = obj1 as Record<string, unknown>;
    const o2 = obj2 as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(o1), ...Object.keys(o2)]);

    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;
      if (!(key in o1)) {
        results.push({ type: "added", path: newPath, newValue: o2[key] });
      } else if (!(key in o2)) {
        results.push({ type: "removed", path: newPath, oldValue: o1[key] });
      } else {
        results.push(...compareObjects(o1[key], o2[key], newPath));
      }
    }

    return results;
  };

  const handleCompare = () => {
    if (!leftJson.trim() || !rightJson.trim()) {
      toast.error("请输入两个JSON进行对比");
      return;
    }

    const source1 = leftValidation.isSuccessfullyFixed && leftValidation.correctedJson
      ? leftValidation.correctedJson : leftJson;
    const source2 = rightValidation.isSuccessfullyFixed && rightValidation.correctedJson
      ? rightValidation.correctedJson : rightJson;

    try {
      const left = JSON.parse(source1);
      const right = JSON.parse(source2);
      const results = compareObjects(left, right);
      setDiffResults(results);
      toast.success(`对比完成，发现 ${results.filter((r) => r.type !== "unchanged").length} 处差异`);
    } catch {
      toast.error("JSON解析错误，请确保两个输入都是有效的JSON");
    }
  };

  const formatValue = (value: unknown): string => {
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const leftStatus = getStatus(leftJson, leftValidation);
  const rightStatus = getStatus(rightJson, rightValidation);

  return (
    <ToolLayout
      title="JSON Diff对比"
      description="对比两个JSON对象的差异，支持拖拽文件和错误自动纠正"
      icon={GitCompare}
    >
      <div className="space-y-6">
        <div className="flex justify-end gap-2">
          <input
            type="file"
            multiple
            accept={multiUploader.accept}
            ref={multiUploader.fileInputRef}
            className="hidden"
            onChange={multiUploader.createChangeHandler(handleMultiFiles)}
          />
          <Button variant="outline" onClick={multiUploader.triggerDialog} className="gap-2">
            <Upload className="h-4 w-4" />
            上传本地文件 (支持同时多选)
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left JSON */}
          <Card
            {...leftUploader.createDropHandler((files) => setLeftJson(files[0].content))}
            className="border-2 border-dashed border-transparent hover:border-primary/50 transition-colors flex flex-col"
          >
            <CardHeader className="pb-3 shrink-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    原始JSON
                    {leftJson.trim() && (
                      <>
                        {leftStatus === "success" && (
                          <Badge variant="default" className="h-5 px-1 bg-green-500/20 text-green-600 border-green-500/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" />有效
                          </Badge>
                        )}
                        {leftStatus === "warning" && (
                          <Badge variant="secondary" className="h-5 px-1 bg-amber-500/20 text-amber-600 border-amber-500/30">
                            <Wand2 className="h-3 w-3 mr-1" />可修复
                          </Badge>
                        )}
                        {leftStatus === "error" && (
                          <Badge variant="destructive" className="h-5 px-1">
                            <AlertCircle className="h-3 w-3 mr-1" />错误
                          </Badge>
                        )}
                      </>
                    )}
                  </CardTitle>
                  <div className="flex gap-1 items-center">
                    <input
                      type="file"
                      accept={leftUploader.accept}
                      ref={leftUploader.fileInputRef}
                      className="hidden"
                      onChange={leftUploader.createChangeHandler((files) => setLeftJson(files[0].content))}
                    />
                    <Button variant="ghost" size="sm" onClick={leftUploader.triggerDialog} className="h-6 px-2 text-xs">
                      <Upload className="h-3 w-3 mr-1" />浏览
                    </Button>
                    {leftJson && (
                      <Button variant="ghost" size="sm" onClick={() => setLeftJson("")} className="h-6 px-2 text-xs text-muted-foreground">
                        <X className="h-3 w-3 mr-1" />清空
                      </Button>
                    )}
                  </div>
                </div>

                {/* Left Fix Actions / Error Display */}
                {!leftValidation.isValid && leftValidation.isSuccessfullyFixed && leftValidation.fixes.length > 0 && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <Wand2 className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-amber-600 font-medium">检测到可修复的问题：</p>
                        <ul className="mt-1 space-y-0.5 text-amber-600/80 list-disc list-inside">
                          {leftValidation.fixes.map((fix, i) => <li key={i}>{fix}</li>)}
                        </ul>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setLeftJson(leftValidation.correctedJson!); toast.success("已修复左侧JSON"); }} className="h-6 text-xs text-amber-600 border-amber-200 hover:bg-amber-100">
                      应用修复
                    </Button>
                  </div>
                )}
                {!leftValidation.isValid && !leftValidation.isSuccessfullyFixed && leftValidation.error && (
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">第 {leftValidation.error.line} 行，第 {leftValidation.error.column} 列错误</p>
                        <p className="opacity-80 mt-1">{leftValidation.error.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 p-0 px-6 pb-6 w-full max-w-full overflow-hidden">
              <LineNumberEditor
                value={leftJson}
                onChange={setLeftJson}
                placeholder="输入第一个JSON，或将文件拖拽到此区域..."
                errorLine={leftValidation.error?.line}
                status={leftStatus}
                minHeight={300}
              />
            </CardContent>
          </Card>

          {/* Right JSON */}
          <Card
            {...rightUploader.createDropHandler((files) => setRightJson(files[0].content))}
            className="border-2 border-dashed border-transparent hover:border-primary/50 transition-colors flex flex-col"
          >
            <CardHeader className="pb-3 shrink-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    对比JSON
                    {rightJson.trim() && (
                      <>
                        {rightStatus === "success" && (
                          <Badge variant="default" className="h-5 px-1 bg-green-500/20 text-green-600 border-green-500/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" />有效
                          </Badge>
                        )}
                        {rightStatus === "warning" && (
                          <Badge variant="secondary" className="h-5 px-1 bg-amber-500/20 text-amber-600 border-amber-500/30">
                            <Wand2 className="h-3 w-3 mr-1" />可修复
                          </Badge>
                        )}
                        {rightStatus === "error" && (
                          <Badge variant="destructive" className="h-5 px-1">
                            <AlertCircle className="h-3 w-3 mr-1" />错误
                          </Badge>
                        )}
                      </>
                    )}
                  </CardTitle>
                  <div className="flex gap-1 items-center">
                    <input
                      type="file"
                      accept={rightUploader.accept}
                      ref={rightUploader.fileInputRef}
                      className="hidden"
                      onChange={rightUploader.createChangeHandler((files) => setRightJson(files[0].content))}
                    />
                    <Button variant="ghost" size="sm" onClick={rightUploader.triggerDialog} className="h-6 px-2 text-xs">
                      <Upload className="h-3 w-3 mr-1" />浏览
                    </Button>
                    {rightJson && (
                      <Button variant="ghost" size="sm" onClick={() => setRightJson("")} className="h-6 px-2 text-xs text-muted-foreground">
                        <X className="h-3 w-3 mr-1" />清空
                      </Button>
                    )}
                  </div>
                </div>

                {/* Right Fix Actions / Error Display */}
                {!rightValidation.isValid && rightValidation.isSuccessfullyFixed && rightValidation.fixes.length > 0 && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <Wand2 className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-amber-600 font-medium">检测到可修复的问题：</p>
                        <ul className="mt-1 space-y-0.5 text-amber-600/80 list-disc list-inside">
                          {rightValidation.fixes.map((fix, i) => <li key={i}>{fix}</li>)}
                        </ul>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setRightJson(rightValidation.correctedJson!); toast.success("已修复右侧JSON"); }} className="h-6 text-xs text-amber-600 border-amber-200 hover:bg-amber-100">
                      应用修复
                    </Button>
                  </div>
                )}
                {!rightValidation.isValid && !rightValidation.isSuccessfullyFixed && rightValidation.error && (
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">第 {rightValidation.error.line} 行，第 {rightValidation.error.column} 列错误</p>
                        <p className="opacity-80 mt-1">{rightValidation.error.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 p-0 px-6 pb-6 w-full max-w-full overflow-hidden">
              <LineNumberEditor
                value={rightJson}
                onChange={setRightJson}
                placeholder="输入第二个JSON，或将文件拖拽到此区域..."
                errorLine={rightValidation.error?.line}
                status={rightStatus}
                minHeight={300}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleCompare} size="lg">
            <ArrowRight className="mr-2 h-4 w-4" />
            开始对比
          </Button>
        </div>

        {diffResults.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">对比结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {diffResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md font-mono text-sm ${result.type === "added"
                        ? "bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400"
                        : result.type === "removed"
                          ? "bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400"
                          : "bg-muted/50"
                      }`}
                  >
                    <div className="flex items-start gap-2">
                      {result.type === "added" && (
                        <Plus className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      )}
                      {result.type === "removed" && (
                        <Minus className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      )}
                      {result.type === "unchanged" && (
                        <Equal className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold">{result.path}:</span>
                        <span className="ml-2 break-all">
                          {result.type === "removed" || result.type === "unchanged"
                            ? formatValue(result.oldValue)
                            : formatValue(result.newValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default JsonDiffTool;
