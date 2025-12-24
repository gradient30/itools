import { useState, useMemo } from "react";
import { Regex, Copy, Check, X } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Match {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTesterTool() {
  const { toast } = useToast();
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });

  const flagString = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");

  const { isValid, matches, error } = useMemo(() => {
    if (!pattern) {
      return { isValid: true, matches: [], error: null };
    }

    try {
      const regex = new RegExp(pattern, flagString);
      const matchList: Match[] = [];
      
      if (flags.g) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          matchList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matchList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      return { isValid: true, matches: matchList, error: null };
    } catch (e) {
      return { isValid: false, matches: [], error: (e as Error).message };
    }
  }, [pattern, testString, flagString, flags.g]);

  const highlightedText = useMemo(() => {
    if (!pattern || !isValid || matches.length === 0) {
      return testString;
    }

    try {
      const regex = new RegExp(pattern, flagString);
      return testString.replace(regex, (match) => `【${match}】`);
    } catch {
      return testString;
    }
  }, [pattern, testString, flagString, isValid, matches.length]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制", description: "正则表达式已复制到剪贴板" });
  };

  const presetPatterns = [
    { name: "邮箱", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
    { name: "手机号", pattern: "1[3-9]\\d{9}" },
    { name: "URL", pattern: "https?://[\\w\\-._~:/?#[\\]@!$&'()*+,;=]+" },
    { name: "IP地址", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}" },
    { name: "日期", pattern: "\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}" },
    { name: "中文", pattern: "[\\u4e00-\\u9fa5]+" },
  ];

  return (
    <ToolLayout
      title="正则表达式测试"
      description="在线正则表达式测试与匹配"
      icon={Regex}
    >
        <div className="space-y-6">
          {/* Pattern Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">正则表达式</Label>
              <div className="flex items-center gap-2">
                {pattern && (
                  isValid ? (
                    <span className="flex items-center gap-1 text-sm text-green-500">
                      <Check className="h-4 w-4" /> 有效
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-destructive">
                      <X className="h-4 w-4" /> 无效
                    </span>
                  )
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(pattern)}
                  disabled={!pattern}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  复制
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center text-muted-foreground font-mono">/</span>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="输入正则表达式..."
                className="font-mono flex-1"
              />
              <span className="flex items-center text-muted-foreground font-mono">/{flagString}</span>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="flag-g"
                checked={flags.g}
                onCheckedChange={(checked) => setFlags({ ...flags, g: !!checked })}
              />
              <Label htmlFor="flag-g" className="text-sm">全局匹配 (g)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="flag-i"
                checked={flags.i}
                onCheckedChange={(checked) => setFlags({ ...flags, i: !!checked })}
              />
              <Label htmlFor="flag-i" className="text-sm">忽略大小写 (i)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="flag-m"
                checked={flags.m}
                onCheckedChange={(checked) => setFlags({ ...flags, m: !!checked })}
              />
              <Label htmlFor="flag-m" className="text-sm">多行模式 (m)</Label>
            </div>
          </div>

          {/* Test String */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">测试文本</Label>
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="输入要测试的文本..."
              className="min-h-[120px] font-mono"
            />
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Highlighted Text */}
            <div className="p-4 rounded-lg bg-card border border-border/50 space-y-2">
              <Label className="text-sm font-semibold">匹配高亮</Label>
              <div className="min-h-[100px] p-3 rounded bg-muted/30 font-mono text-sm whitespace-pre-wrap break-all">
                {highlightedText || <span className="text-muted-foreground">匹配结果将在此显示...</span>}
              </div>
            </div>

            {/* Match List */}
            <div className="p-4 rounded-lg bg-card border border-border/50 space-y-2">
              <Label className="text-sm font-semibold">
                匹配结果 ({matches.length} 个)
              </Label>
              <div className="min-h-[100px] max-h-[200px] overflow-y-auto space-y-1">
                {matches.length > 0 ? (
                  matches.map((m, i) => (
                    <div key={i} className="p-2 rounded bg-muted/30 font-mono text-sm">
                      <span className="text-primary">{m.match}</span>
                      <span className="text-muted-foreground ml-2">位置: {m.index}</span>
                      {m.groups.length > 0 && (
                        <span className="text-muted-foreground ml-2">
                          分组: [{m.groups.join(", ")}]
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">无匹配</span>
                )}
              </div>
            </div>
          </div>

          {/* Preset Patterns */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <Label className="text-sm font-semibold mb-3 block">常用正则</Label>
            <div className="flex flex-wrap gap-2">
              {presetPatterns.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => setPattern(preset.pattern)}
                  className="text-xs"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
      </div>
    </ToolLayout>
  );
}
