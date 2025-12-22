import { useState } from "react";
import { CaseSensitive, Copy, ArrowDown } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab" | "constant";

const caseTypes: { type: CaseType; name: string; example: string }[] = [
  { type: "upper", name: "大写", example: "HELLO WORLD" },
  { type: "lower", name: "小写", example: "hello world" },
  { type: "title", name: "标题", example: "Hello World" },
  { type: "sentence", name: "句子", example: "Hello world" },
  { type: "camel", name: "驼峰", example: "helloWorld" },
  { type: "pascal", name: "帕斯卡", example: "HelloWorld" },
  { type: "snake", name: "下划线", example: "hello_world" },
  { type: "kebab", name: "短横线", example: "hello-world" },
  { type: "constant", name: "常量", example: "HELLO_WORLD" },
];

function toWords(text: string): string[] {
  // Split by common separators and camelCase/PascalCase
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function convertCase(text: string, type: CaseType): string {
  const words = toWords(text);
  
  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    case "sentence":
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case "camel":
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join("");
    case "pascal":
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    case "snake":
      return words.map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return words.map((w) => w.toLowerCase()).join("-");
    case "constant":
      return words.map((w) => w.toUpperCase()).join("_");
    default:
      return text;
  }
}

export default function CaseConverterTool() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [selectedType, setSelectedType] = useState<CaseType>("upper");

  const convert = (type: CaseType) => {
    setSelectedType(type);
    setOutput(convertCase(input, type));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制", description: "转换结果已复制到剪贴板" });
  };

  return (
    <Layout>
      <ToolLayout
        title="大小写转换"
        description="文本大小写格式转换"
        icon={CaseSensitive}
      >
        <div className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">输入文本</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入要转换的文本，例如：Hello World、helloWorld、hello_world"
              className="min-h-[100px] font-mono"
            />
          </div>

          {/* Conversion Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">选择转换类型</Label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {caseTypes.map((ct) => (
                <Button
                  key={ct.type}
                  variant={selectedType === ct.type ? "default" : "outline"}
                  size="sm"
                  onClick={() => convert(ct.type)}
                  className="flex flex-col h-auto py-2"
                  disabled={!input}
                >
                  <span className="font-semibold">{ct.name}</span>
                  <span className="text-xs opacity-70">{ct.example}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Convert All */}
          <div className="flex justify-center">
            <Button
              onClick={() => convert(selectedType)}
              className="gap-2"
              disabled={!input}
            >
              <ArrowDown className="h-4 w-4" />
              转换
            </Button>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">转换结果</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(output)}
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
              className="min-h-[100px] font-mono bg-muted/30"
            />
          </div>

          {/* All Conversions Preview */}
          {input && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <Label className="text-sm font-semibold mb-3 block">所有转换预览</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {caseTypes.map((ct) => (
                  <div
                    key={ct.type}
                    className="flex items-center justify-between p-2 rounded bg-background/50 cursor-pointer hover:bg-background transition-colors"
                    onClick={() => {
                      convert(ct.type);
                      copyToClipboard(convertCase(input, ct.type));
                    }}
                  >
                    <span className="text-muted-foreground">{ct.name}:</span>
                    <code className="font-mono text-foreground truncate max-w-[200px]">
                      {convertCase(input, ct.type)}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ToolLayout>
    </Layout>
  );
}
