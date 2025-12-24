import { useState } from "react";
import { Shuffle, Copy, RefreshCw } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function RandomStringTool() {
  const { toast } = useToast();
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });

  const charSets = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  const generate = () => {
    let chars = "";
    if (options.lowercase) chars += charSets.lowercase;
    if (options.uppercase) chars += charSets.uppercase;
    if (options.numbers) chars += charSets.numbers;
    if (options.symbols) chars += charSets.symbols;

    if (!chars) {
      toast({ title: "请选择字符集", description: "至少选择一种字符类型", variant: "destructive" });
      return;
    }

    const newResults = Array.from({ length: count }, () => {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    });

    setResults(newResults);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.join("\n"));
    toast({ title: "已复制", description: `${results.length}个字符串已复制到剪贴板` });
  };

  const copySingle = (str: string) => {
    navigator.clipboard.writeText(str);
    toast({ title: "已复制", description: "字符串已复制到剪贴板" });
  };

  return (
    <ToolLayout
      title="随机字符串"
      description="自定义长度和字符集的随机字符串生成器"
      icon={Shuffle}
    >
        <div className="space-y-6">
          {/* Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
              <h3 className="font-semibold">基本设置</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">长度:</Label>
                  <Input
                    type="number"
                    min={1}
                    max={256}
                    value={length}
                    onChange={(e) => setLength(Math.min(256, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">数量:</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={count}
                    onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
              <h3 className="font-semibold">字符集</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "lowercase", label: "小写字母 (a-z)" },
                  { key: "uppercase", label: "大写字母 (A-Z)" },
                  { key: "numbers", label: "数字 (0-9)" },
                  { key: "symbols", label: "特殊字符 (!@#...)" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={key}
                      checked={options[key as keyof typeof options]}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, [key]: checked })
                      }
                    />
                    <Label htmlFor={key} className="text-sm cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button onClick={generate} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              生成
            </Button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">生成结果 ({results.length})</Label>
                <Button variant="ghost" size="sm" onClick={copyAll}>
                  <Copy className="h-4 w-4 mr-1" />
                  全部复制
                </Button>
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-2 p-4 rounded-lg bg-secondary/30 border border-border/50">
                {results.map((str, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2 rounded bg-background/50 font-mono text-sm group"
                  >
                    <span className="break-all">{str}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() => copySingle(str)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </ToolLayout>
  );
}
