import { useState } from "react";
import { Clock, Copy, RefreshCw } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function TimestampTool() {
  const { toast } = useToast();
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 19));
  const [milliseconds, setMilliseconds] = useState(Date.now().toString());

  const timestampToDate = () => {
    try {
      const ts = parseInt(timestamp);
      const date = new Date(ts * 1000);
      setDateTime(date.toISOString().slice(0, 19));
      setMilliseconds((ts * 1000).toString());
    } catch {
      toast({ title: "转换失败", description: "请输入有效的时间戳", variant: "destructive" });
    }
  };

  const dateToTimestamp = () => {
    try {
      const date = new Date(dateTime);
      const ts = Math.floor(date.getTime() / 1000);
      setTimestamp(ts.toString());
      setMilliseconds(date.getTime().toString());
    } catch {
      toast({ title: "转换失败", description: "请输入有效的日期时间", variant: "destructive" });
    }
  };

  const getCurrentTime = () => {
    const now = Date.now();
    setTimestamp(Math.floor(now / 1000).toString());
    setDateTime(new Date(now).toISOString().slice(0, 19));
    setMilliseconds(now.toString());
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制", description: `${label}已复制到剪贴板` });
  };

  return (
    <Layout>
      <ToolLayout
        title="时间戳转换"
        description="Unix时间戳与日期时间互相转换"
        icon={Clock}
      >
        <div className="space-y-6">
          {/* Current Time Button */}
          <div className="flex justify-center">
            <Button onClick={getCurrentTime} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              获取当前时间
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Timestamp Section */}
            <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
              <Label className="text-base font-semibold">Unix时间戳 (秒)</Label>
              <div className="flex gap-2">
                <Input
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="输入时间戳"
                  className="font-mono"
                />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(timestamp, "时间戳")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={timestampToDate} className="w-full">
                转换为日期 →
              </Button>

              <div className="pt-2">
                <Label className="text-sm text-muted-foreground">毫秒时间戳</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={milliseconds} readOnly className="font-mono bg-muted/50" />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(milliseconds, "毫秒时间戳")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* DateTime Section */}
            <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
              <Label className="text-base font-semibold">日期时间</Label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="font-mono"
                />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(dateTime, "日期时间")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={dateToTimestamp} className="w-full">
                ← 转换为时间戳
              </Button>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ISO 8601:</span>
                  <code className="text-foreground">{new Date(parseInt(milliseconds) || 0).toISOString()}</code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">本地时间:</span>
                  <code className="text-foreground">{new Date(parseInt(milliseconds) || 0).toLocaleString("zh-CN")}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ToolLayout>
    </Layout>
  );
}
