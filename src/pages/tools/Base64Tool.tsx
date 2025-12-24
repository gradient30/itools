import { useState } from "react";
import { KeyRound, Copy, ArrowDown, ArrowUp } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Base64Tool() {
  const { toast } = useToast();
  const [decoded, setDecoded] = useState("");
  const [encoded, setEncoded] = useState("");

  const encode = () => {
    try {
      // Handle Unicode properly
      const utf8Bytes = new TextEncoder().encode(decoded);
      const binaryString = Array.from(utf8Bytes)
        .map((byte) => String.fromCharCode(byte))
        .join("");
      setEncoded(btoa(binaryString));
    } catch (e) {
      toast({ title: "编码失败", description: "请检查输入内容", variant: "destructive" });
    }
  };

  const decode = () => {
    try {
      const binaryString = atob(encoded);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      setDecoded(new TextDecoder().decode(bytes));
    } catch (e) {
      toast({ title: "解码失败", description: "请检查Base64编码是否正确", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制", description: `${label}已复制到剪贴板` });
  };

  return (
    <ToolLayout
      title="Base64编解码"
      description="Base64编码与解码"
      icon={KeyRound}
    >
        <div className="space-y-6">
          {/* Decoded Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">原文</Label>
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
              placeholder="输入要编码的文本..."
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
              <Label className="text-base font-semibold">Base64编码</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(encoded, "Base64编码")}
                disabled={!encoded}
              >
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
            </div>
            <Textarea
              value={encoded}
              onChange={(e) => setEncoded(e.target.value)}
              placeholder="Base64编码结果..."
              className="min-h-[120px] font-mono bg-muted/30"
            />
          </div>

          {/* Info */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
            <p>Base64是一种基于64个可打印字符来表示二进制数据的编码方式，常用于在URL、Cookie、网页中传输少量二进制数据。</p>
          </div>
      </div>
    </ToolLayout>
  );
}
