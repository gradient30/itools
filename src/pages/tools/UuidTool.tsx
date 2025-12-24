import { useState } from "react";
import { Fingerprint, Copy, RefreshCw } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function UuidTool() {
  const { toast } = useToast();
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [format, setFormat] = useState<"standard" | "noDash" | "uppercase">("standard");

  const generateUUID = (): string => {
    // UUID v4 generation
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const formatUUID = (uuid: string): string => {
    switch (format) {
      case "noDash":
        return uuid.replace(/-/g, "");
      case "uppercase":
        return uuid.toUpperCase();
      default:
        return uuid;
    }
  };

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => formatUUID(generateUUID()));
    setUuids(newUuids);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    toast({ title: "已复制", description: `${uuids.length}个UUID已复制到剪贴板` });
  };

  const copySingle = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    toast({ title: "已复制", description: "UUID已复制到剪贴板" });
  };

  return (
    <ToolLayout
      title="UUID生成"
      description="生成UUID v4通用唯一识别码"
      icon={Fingerprint}
    >
        <div className="space-y-6">
          {/* Options */}
          <div className="flex flex-wrap items-center justify-center gap-4">
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
            <div className="flex items-center gap-2">
              <Label className="text-sm">格式:</Label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as typeof format)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="standard">标准格式</option>
                <option value="noDash">无横线</option>
                <option value="uppercase">大写</option>
              </select>
            </div>
            <Button onClick={generate} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              生成
            </Button>
          </div>

          {/* Results */}
          {uuids.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">生成结果 ({uuids.length})</Label>
                <Button variant="ghost" size="sm" onClick={copyAll}>
                  <Copy className="h-4 w-4 mr-1" />
                  全部复制
                </Button>
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-2 p-4 rounded-lg bg-secondary/30 border border-border/50">
                {uuids.map((uuid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2 rounded bg-background/50 font-mono text-sm group"
                  >
                    <span className="break-all">{uuid}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      onClick={() => copySingle(uuid)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
            <p>UUID v4 是基于随机数生成的通用唯一识别码，具有极低的碰撞概率，广泛用于数据库主键、会话ID等场景。</p>
          </div>
      </div>
    </ToolLayout>
  );
}
