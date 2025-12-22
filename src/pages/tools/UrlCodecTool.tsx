import { useState } from "react";
import { Link as LinkIcon, Copy, ArrowDown, ArrowUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function UrlCodecTool() {
  const { toast } = useToast();
  const [decoded, setDecoded] = useState("");
  const [encoded, setEncoded] = useState("");

  const encode = () => {
    try {
      setEncoded(encodeURIComponent(decoded));
    } catch {
      toast({ title: "编码失败", description: "请检查输入内容", variant: "destructive" });
    }
  };

  const decode = () => {
    try {
      setDecoded(decodeURIComponent(encoded));
    } catch {
      toast({ title: "解码失败", description: "请检查输入内容", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制", description: `${label}已复制到剪贴板` });
  };

  return (
    <Layout>
      <ToolLayout
        title="URL编解码"
        description="URL参数编码与解码"
        icon={LinkIcon}
      >
        <div className="space-y-6">
          {/* Decoded Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">原文 (解码后)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(decoded, "原文")}
                disabled={!decoded}
              >
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
            </div>
            <Textarea
              value={decoded}
              onChange={(e) => setDecoded(e.target.value)}
              placeholder="输入要编码的文本，例如：你好世界 test=123&name=张三"
              className="min-h-[120px] font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={encode} className="gap-2">
              <ArrowDown className="h-4 w-4" />
              编码
            </Button>
            <Button onClick={decode} variant="outline" className="gap-2">
              <ArrowUp className="h-4 w-4" />
              解码
            </Button>
          </div>

          {/* Encoded Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">编码后</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(encoded, "编码结果")}
                disabled={!encoded}
              >
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
            </div>
            <Textarea
              value={encoded}
              onChange={(e) => setEncoded(e.target.value)}
              placeholder="编码结果将显示在这里"
              className="min-h-[120px] font-mono bg-muted/30"
            />
          </div>

          {/* Examples */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <h3 className="text-sm font-semibold mb-3">常见编码对照</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><code className="text-primary">空格</code> → <code>%20</code></div>
              <div><code className="text-primary">&</code> → <code>%26</code></div>
              <div><code className="text-primary">=</code> → <code>%3D</code></div>
              <div><code className="text-primary">?</code> → <code>%3F</code></div>
            </div>
          </div>
        </div>
      </ToolLayout>
    </Layout>
  );
}
