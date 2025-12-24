import { useState } from "react";
import { KeyRound, Copy, ArrowDown, ArrowUp, Lock, Unlock, RefreshCw, Lightbulb } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { aesGcmEncrypt, aesGcmDecrypt } from "@/lib/crypto-utils";

type Mode = "base64" | "aes";

const EXAMPLES = {
  base64: {
    decoded: "Hello, World! 这是Base64编码测试。",
    encoded: "SGVsbG8sIFdvcmxkISDov5nmmK9CYXNlNjTnvJbnoIHmtYvor5XjgII=",
  },
  aes: {
    decoded: "这是一段需要加密的敏感信息",
    password: "MySecretKey123",
  },
};

export default function Base64Tool() {
  const { toast } = useToast();
  const [decoded, setDecoded] = useState("");
  const [encoded, setEncoded] = useState("");
  const [mode, setMode] = useState<Mode>("base64");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const encode = async () => {
    if (!decoded) {
      toast({ title: "请输入内容", description: "请先输入要编码的文本", variant: "destructive" });
      return;
    }

    try {
      if (mode === "aes") {
        if (!password) {
          toast({ title: "请输入密钥", description: "AES加密需要提供密钥", variant: "destructive" });
          return;
        }
        const encrypted = await aesGcmEncrypt(decoded, password);
        setEncoded(encrypted);
        toast({ title: "加密成功", description: "已使用 AES-GCM 加密" });
      } else {
        // Handle Unicode properly
        const utf8Bytes = new TextEncoder().encode(decoded);
        const binaryString = Array.from(utf8Bytes)
          .map((byte) => String.fromCharCode(byte))
          .join("");
        setEncoded(btoa(binaryString));
      }
    } catch (e) {
      toast({ title: "编码失败", description: "请检查输入内容", variant: "destructive" });
    }
  };

  const decode = async () => {
    if (!encoded) {
      toast({ title: "请输入内容", description: "请先输入要解码的文本", variant: "destructive" });
      return;
    }

    try {
      if (mode === "aes") {
        if (!password) {
          toast({ title: "请输入密钥", description: "AES解密需要提供密钥", variant: "destructive" });
          return;
        }
        const decrypted = await aesGcmDecrypt(encoded, password);
        setDecoded(decrypted);
        toast({ title: "解密成功", description: "已使用 AES-GCM 解密" });
      } else {
        const binaryString = atob(encoded);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        setDecoded(new TextDecoder().decode(bytes));
      }
    } catch (e) {
      const msg = mode === "aes" ? "密钥错误或数据已损坏" : "请检查Base64编码是否正确";
      toast({ title: "解码失败", description: msg, variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制", description: `${label}已复制到剪贴板` });
  };

  const clearAll = () => {
    setDecoded("");
    setEncoded("");
    setPassword("");
  };

  const loadExample = () => {
    if (mode === "base64") {
      setDecoded(EXAMPLES.base64.decoded);
      setEncoded(EXAMPLES.base64.encoded);
    } else {
      setDecoded(EXAMPLES.aes.decoded);
      setPassword(EXAMPLES.aes.password);
      setEncoded("");
    }
    toast({ title: "已加载示例" });
  };

  return (
    <ToolLayout
      title="Base64编解码"
      description="Base64编码与AES-GCM加密"
      icon={KeyRound}
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="base64" className="gap-2">
              <KeyRound className="h-4 w-4" />
              Base64 编解码
            </TabsTrigger>
            <TabsTrigger value="aes" className="gap-2">
              <Lock className="h-4 w-4" />
              AES-GCM 加密
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aes" className="mt-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Lock className="h-4 w-4" />
                AES-GCM 加密模式
              </div>
              <p className="text-sm text-muted-foreground">
                使用 AES-256-GCM 对称加密算法，结合 PBKDF2 密钥派生，提供安全的加密保护。
              </p>
              <div className="space-y-2">
                <Label htmlFor="password">密钥 (必填)</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入加密/解密密钥..."
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "隐藏密钥" : "显示密钥"}
                  >
                    {showPassword ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="base64" className="mt-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground">
                标准 Base64 编码，将二进制数据转换为可打印的 ASCII 字符。
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Decoded Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">原文</Label>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={loadExample}>
                <Lightbulb className="h-4 w-4 mr-1" />
                示例
              </Button>
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
            placeholder="输入要编码/加密的文本..."
            className="min-h-[120px] font-mono"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={encode} className="gap-2">
            <ArrowDown className="h-4 w-4" />
            {mode === "aes" ? "加密" : "编码"}
          </Button>
          <Button onClick={decode} variant="outline" className="gap-2">
            <ArrowUp className="h-4 w-4" />
            {mode === "aes" ? "解密" : "解码"}
          </Button>
          <Button onClick={clearAll} variant="ghost" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            清空
          </Button>
        </div>

        {/* Encoded Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">
              {mode === "aes" ? "密文 (Base64)" : "Base64编码"}
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(encoded, mode === "aes" ? "密文" : "Base64编码")}
              disabled={!encoded}
            >
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
            </div>
          </div>
          <Textarea
            value={encoded}
            onChange={(e) => setEncoded(e.target.value)}
            placeholder={mode === "aes" ? "加密结果..." : "Base64编码结果..."}
            className="min-h-[120px] font-mono bg-muted/30"
          />
        </div>

        {/* Info */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground space-y-2">
          {mode === "aes" ? (
            <>
              <p><strong>AES-GCM</strong> 是现代对称加密标准，提供加密和认证。</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>使用 <strong>PBKDF2</strong> 从密钥派生加密密钥 (100,000 次迭代)</li>
                <li>自动生成随机 <strong>盐值</strong> (Salt) 和 <strong>初始化向量</strong> (IV)</li>
                <li>密文包含 Salt + IV + 加密数据，完全自包含</li>
              </ul>
            </>
          ) : (
            <p>Base64是一种基于64个可打印字符来表示二进制数据的编码方式，常用于在URL、Cookie、网页中传输少量二进制数据。</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
