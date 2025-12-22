import { useState } from "react";
import { ShieldCheck, Copy, Hash } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type ShaType = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

async function sha(message: string, algorithm: ShaType): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function ShaTool() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<ShaType, string>>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
  });
  const [activeTab, setActiveTab] = useState<ShaType>("SHA-256");
  const [uppercase, setUppercase] = useState(false);

  const calculate = async () => {
    if (!input) {
      setResults({ "SHA-1": "", "SHA-256": "", "SHA-384": "", "SHA-512": "" });
      return;
    }

    const algorithms: ShaType[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
    const newResults: Record<ShaType, string> = { "SHA-1": "", "SHA-256": "", "SHA-384": "", "SHA-512": "" };

    for (const algo of algorithms) {
      newResults[algo] = await sha(input, algo);
    }

    setResults(newResults);
  };

  const copyToClipboard = (text: string, label: string) => {
    const result = uppercase ? text.toUpperCase() : text;
    navigator.clipboard.writeText(result);
    toast({ title: "已复制", description: `${label}已复制到剪贴板` });
  };

  const formatResult = (hash: string) => (uppercase ? hash.toUpperCase() : hash);

  return (
    <Layout>
      <ToolLayout
        title="SHA加密"
        description="计算文本的SHA哈希值"
        icon={ShieldCheck}
      >
        <div className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">输入文本</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入要计算SHA哈希的文本..."
              className="min-h-[120px] font-mono"
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded border-border"
              />
              大写输出
            </label>
            <Button onClick={calculate} className="gap-2">
              <Hash className="h-4 w-4" />
              计算SHA
            </Button>
          </div>

          {/* Results */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ShaType)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="SHA-1">SHA-1</TabsTrigger>
              <TabsTrigger value="SHA-256">SHA-256</TabsTrigger>
              <TabsTrigger value="SHA-384">SHA-384</TabsTrigger>
              <TabsTrigger value="SHA-512">SHA-512</TabsTrigger>
            </TabsList>

            {(["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as ShaType[]).map((algo) => (
              <TabsContent key={algo} value={algo} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">{algo} ({algo === "SHA-1" ? 40 : algo === "SHA-256" ? 64 : algo === "SHA-384" ? 96 : 128} 字符)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(results[algo], algo)}
                    disabled={!results[algo]}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </Button>
                </div>
                <Input
                  value={formatResult(results[algo])}
                  readOnly
                  placeholder={`${algo}哈希值将显示在这里`}
                  className="font-mono text-sm bg-muted/30"
                />
              </TabsContent>
            ))}
          </Tabs>

          {/* All Results */}
          {results["SHA-256"] && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-3">
              <Label className="text-sm font-semibold block">所有哈希值</Label>
              {(["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as ShaType[]).map((algo) => (
                <div key={algo} className="flex items-center gap-2">
                  <span className="w-20 text-sm text-muted-foreground shrink-0">{algo}:</span>
                  <code className="flex-1 text-xs font-mono break-all bg-background/50 p-2 rounded">
                    {formatResult(results[algo])}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => copyToClipboard(results[algo], algo)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Info */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
            <p>SHA(Secure Hash Algorithm)是一系列密码散列函数。SHA-256及以上版本被认为是安全的，SHA-1已不推荐用于安全敏感场景。</p>
          </div>
        </div>
      </ToolLayout>
    </Layout>
  );
}
