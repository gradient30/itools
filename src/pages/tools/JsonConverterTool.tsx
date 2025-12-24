import { useState } from "react";
import { FileJson2, Copy, ArrowRightLeft } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<ConversionType>("json-to-yaml");
  const [error, setError] = useState("");

  const convert = (type: ConversionType) => {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      const json = JSON.parse(input);
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
      setError("JSON解析失败: " + (e as Error).message);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as ConversionType);
    convert(value as ConversionType);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "已复制", description: "转换结果已复制到剪贴板" });
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

  return (
    <ToolLayout
      title="JSON转换"
      description="JSON转YAML/XML/CSV/TypeScript"
      icon={FileJson2}
    >
        <div className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">输入JSON</Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInput(sampleJson);
                    setError("");
                  }}
                >
                  示例对象
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInput(sampleArray);
                    setError("");
                  }}
                >
                  示例数组
                </Button>
              </div>
            </div>
            <Textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              placeholder='输入JSON，例如：{"name": "value"}'
              className="min-h-[150px] font-mono text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Convert Button */}
          <div className="flex justify-center">
            <Button onClick={() => convert(activeTab)} className="gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              转换
            </Button>
          </div>

          {/* Output Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="json-to-yaml">YAML</TabsTrigger>
              <TabsTrigger value="json-to-xml">XML</TabsTrigger>
              <TabsTrigger value="json-to-csv">CSV</TabsTrigger>
              <TabsTrigger value="json-to-ts">TypeScript</TabsTrigger>
            </TabsList>

            {(["json-to-yaml", "json-to-xml", "json-to-csv", "json-to-ts"] as ConversionType[]).map((type) => (
              <TabsContent key={type} value={type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    {type === "json-to-yaml" && "YAML"}
                    {type === "json-to-xml" && "XML"}
                    {type === "json-to-csv" && "CSV"}
                    {type === "json-to-ts" && "TypeScript"}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    disabled={!output}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </Button>
                </div>
                <Textarea
                  value={output}
                  readOnly
                  placeholder="转换结果将显示在这里"
                  className="min-h-[200px] font-mono text-sm bg-muted/30"
                />
              </TabsContent>
            ))}
          </Tabs>

          {/* Info */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
            <p>
              <strong>提示：</strong> CSV转换需要输入JSON数组格式。其他格式支持对象和数组。
            </p>
          </div>
      </div>
    </ToolLayout>
  );
}
