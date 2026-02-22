import { useState, useEffect, useMemo } from "react";
import { FileJson2, Copy, Upload, X, AlertCircle, Wand2, CheckCircle2 } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFileUpload } from "@/hooks/use-file-upload";
import { LineNumberEditor } from "@/components/LineNumberEditor";
import { validateJson } from "@/utils/json-utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type ConversionType = "json-to-yaml" | "json-to-xml" | "json-to-csv" | "json-to-ts";

function jsonToYaml(obj: unknown, indent = 0): string {
  const spaces = "  ".repeat(indent);

  if (obj === null) return "null";
  if (typeof obj === "boolean" || typeof obj === "number") return String(obj);
  if (typeof obj === "string") return obj.includes("\n") ? `|\n${spaces}  ${obj.split("\n").join(`\n${spaces}  `)}` : obj;

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => `${spaces}- ${jsonToYaml(item, indent + 1).trimStart()}`).join("\n");
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries
      .map(([key, value]) => {
        const valueStr = jsonToYaml(value, indent + 1);
        if (typeof value === "object" && value !== null && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)) {
          return `${spaces}${key}:\n${valueStr}`;
        }
        return `${spaces}${key}: ${valueStr}`;
      })
      .join("\n");
  }

  return String(obj);
}

function jsonToXml(obj: unknown, rootName = "root", indent = 0): string {
  const spaces = "  ".repeat(indent);

  if (obj === null || obj === undefined) return `${spaces}<${rootName}/>`;
  if (typeof obj !== "object") return `${spaces}<${rootName}>${obj}</${rootName}>`;

  if (Array.isArray(obj)) {
    return obj.map((item) => jsonToXml(item, "item", indent)).join("\n");
  }

  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) return `${spaces}<${rootName}/>`;

  const children = entries
    .map(([key, value]) => jsonToXml(value, key, indent + 1))
    .join("\n");

  return `${spaces}<${rootName}>\n${children}\n${spaces}</${rootName}>`;
}

function jsonToCsv(arr: unknown[]): string {
  if (!Array.isArray(arr) || arr.length === 0) return "";

  const firstItem = arr[0];
  if (typeof firstItem !== "object" || firstItem === null) {
    return arr.join("\n");
  }

  const headers = Object.keys(firstItem as Record<string, unknown>);
  const rows = arr.map((item) => {
    const obj = item as Record<string, unknown>;
    return headers.map((h) => {
      const val = obj[h];
      const str = val === null || val === undefined ? "" : String(val);
      return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

function jsonToTypeScript(obj: unknown, name = "Root"): string {
  if (obj === null) return "type " + name + " = null;";
  if (typeof obj === "boolean") return "type " + name + " = boolean;";
  if (typeof obj === "number") return "type " + name + " = number;";
  if (typeof obj === "string") return "type " + name + " = string;";

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "type " + name + " = unknown[];";
    const itemType = typeof obj[0] === "object" && obj[0] !== null ? "Item" : typeof obj[0];
    const itemDef = typeof obj[0] === "object" && obj[0] !== null ? jsonToTypeScript(obj[0], "Item") + "\n\n" : "";
    return itemDef + "type " + name + " = " + (typeof obj[0] === "object" && obj[0] !== null ? "Item" : itemType) + "[];";
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "type " + name + " = Record<string, never>;";

    const props = entries.map(([key, value]) => {
      let type: string;
      if (value === null) type = "null";
      else if (Array.isArray(value)) type = value.length > 0 ? typeof value[0] + "[]" : "unknown[]";
      else type = typeof value;
      return `  ${key}: ${type};`;
    }).join("\n");

    return `interface ${name} {\n${props}\n}`;
  }

  return "type " + name + " = unknown;";
}

export default function JsonConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<ConversionType>("json-to-yaml");
  const [error, setError] = useState("");

  const uploader = useFileUpload({ multiple: false });
  const validation = useMemo(() => validateJson(input), [input]);

  const getStatus = () => {
    if (!input.trim()) return "default";
    if (!validation.isValid) return validation.isSuccessfullyFixed ? "warning" : "error";
    return "success";
  };

  const convert = (type: ConversionType = activeTab, currentInput: string = input) => {
    setError("");
    if (!currentInput.trim()) {
      setOutput("");
      return;
    }

    const sourceToConvert = validation.isSuccessfullyFixed && validation.correctedJson
      ? validation.correctedJson : currentInput;

    try {
      const json = JSON.parse(sourceToConvert);
      let result = "";

      switch (type) {
        case "json-to-yaml":
          result = jsonToYaml(json);
          break;
        case "json-to-xml":
          result = '<?xml version="1.0" encoding="UTF-8"?>\n' + jsonToXml(json);
          break;
        case "json-to-csv":
          if (!Array.isArray(json)) {
            setError("CSV转换需要JSON数组格式");
            return;
          }
          result = jsonToCsv(json);
          break;
        case "json-to-ts":
          result = jsonToTypeScript(json);
          break;
      }

      setOutput(result);
    } catch (e) {
      setError("JSON解析失败，请检查输入格式。");
    }
  };

  useEffect(() => {
    if (input.trim()) {
      convert(activeTab, input);
    } else {
      setOutput("");
      setError("");
    }
  }, [input, activeTab, validation]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as ConversionType);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("转换结果已复制到剪贴板");
  };

  const sampleJson = `{
  "name": "张三",
  "age": 28,
  "skills": ["JavaScript", "TypeScript", "React"],
  "address": {
    "city": "北京",
    "country": "中国"
  }
}`;

  const sampleArray = `[
  {"id": 1, "name": "产品A", "price": 99.9},
  {"id": 2, "name": "产品B", "price": 199.9},
  {"id": 3, "name": "产品C", "price": 299.9}
]`;

  const status = getStatus();

  return (
    <ToolLayout
      title="JSON转换"
      description="JSON转YAML/XML/CSV/TypeScript，支持拖拽和自动修复"
      icon={FileJson2}
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
                  输入JSON
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
                <div className="flex gap-1 items-center">
                  <input
                    type="file"
                    accept=".json,.txt"
                    ref={uploader.fileInputRef}
                    className="hidden"
                    onChange={uploader.createChangeHandler((files) => setInput(files[0].content))}
                  />
                  <Button variant="ghost" size="sm" onClick={uploader.triggerDialog} className="h-6 px-2 text-xs">
                    <Upload className="h-3 w-3 mr-1" />上传
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={() => setInput(sampleJson)}
                  >
                    对象示例
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={() => setInput(sampleArray)}
                  >
                    数组示例
                  </Button>
                  {input && (
                    <Button variant="ghost" size="sm" onClick={() => setInput("")} className="h-6 px-2 text-xs text-muted-foreground">
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
                  <Button variant="outline" size="sm" onClick={() => { setInput(validation.correctedJson!); toast.success("已应用修复"); }} className="h-6 text-xs text-amber-600 border-amber-200 hover:bg-amber-100">
                    应用修复
                  </Button>
                </div>
              )}
              {!validation.isValid && !validation.isSuccessfullyFixed && validation.error && (
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">第 {validation.error.line} 行，第 {validation.error.column} 列错误</p>
                      <p className="opacity-80 mt-1">{validation.error.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 p-0 px-6 pb-6 w-full max-w-full overflow-hidden">
            <LineNumberEditor
              value={input}
              onChange={setInput}
              placeholder="输入JSON，支持将文件直接拖拽到此区域..."
              errorLine={validation.error?.line}
              status={status}
              minHeight={400}
            />
          </CardContent>
        </Card>

        {/* Right Output Section */}
        <Card className="flex flex-col border-none shadow-none bg-transparent">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col flex-1 h-full">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <TabsList className="h-9">
                <TabsTrigger value="json-to-yaml" className="text-xs">YAML</TabsTrigger>
                <TabsTrigger value="json-to-xml" className="text-xs">XML</TabsTrigger>
                <TabsTrigger value="json-to-csv" className="text-xs">CSV</TabsTrigger>
                <TabsTrigger value="json-to-ts" className="text-xs">TypeScript</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output} className="h-9 px-3 text-xs bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">
                  <Copy className="h-4 w-4 mr-1.5" />复制当前结果
                </Button>
              </div>
            </div>

            <Card className="flex-1 flex flex-col mt-0 border">
              <CardContent className="flex-1 p-0 pt-6 px-6 pb-6 relative min-h-[400px]">
                {error ? (
                  <div className="absolute inset-0 m-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center text-sm font-medium">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                ) : (
                  <LineNumberEditor
                    value={output}
                    onChange={() => { }}
                    placeholder={`在此处查看转换后的 ${activeTab.split("-").pop()?.toUpperCase()} \n...\n...`}
                    readOnly
                    status="default"
                    minHeight={400}
                  />
                )}
              </CardContent>
            </Card>
          </Tabs>
        </Card>
      </div>
    </ToolLayout>
  );
}
