import { useState } from "react";
import { Shield, Copy, RefreshCw, Lock, Unlock } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  bufferToBase64,
  base64ToBuffer,
  bufferToHex,
  hexToBuffer,
  generateRandomBytes,
} from "@/lib/crypto-utils";

type AesMode = "GCM" | "CBC" | "CTR";
type KeySize = 128 | 192 | 256;
type OutputFormat = "base64" | "hex";

export default function AesTool() {
  const { toast } = useToast();

  // Common state
  const [mode, setMode] = useState<AesMode>("GCM");
  const [keySize, setKeySize] = useState<KeySize>(256);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("base64");

  // Encryption state
  const [plaintext, setPlaintext] = useState("");
  const [encPassword, setEncPassword] = useState("");
  const [encryptedResult, setEncryptedResult] = useState("");

  // Decryption state
  const [ciphertext, setCiphertext] = useState("");
  const [decPassword, setDecPassword] = useState("");
  const [decryptedResult, setDecryptedResult] = useState("");

  // Raw key mode
  const [useRawKey, setUseRawKey] = useState(false);
  const [rawKey, setRawKey] = useState("");
  const [rawIv, setRawIv] = useState("");

  const generateKey = () => {
    const keyBytes = generateRandomBytes(keySize / 8);
    setRawKey(bufferToHex(keyBytes.buffer as ArrayBuffer));
  };

  const generateIv = () => {
    const ivLength = mode === "GCM" ? 12 : 16;
    const ivBytes = generateRandomBytes(ivLength);
    setRawIv(bufferToHex(ivBytes.buffer as ArrayBuffer));
  };

  const deriveKeyFromPassword = async (
    password: string,
    salt: Uint8Array
  ): Promise<CryptoKey> => {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt as BufferSource,
        iterations: 100000,
        hash: "SHA-256",
      },
      passwordKey,
      { name: `AES-${mode}`, length: keySize },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const importRawKey = async (keyHex: string): Promise<CryptoKey> => {
    const keyBuffer = hexToBuffer(keyHex);
    return crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: `AES-${mode}` },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const encrypt = async () => {
    if (!plaintext) {
      toast({ title: "请输入要加密的文本", variant: "destructive" });
      return;
    }

    if (useRawKey) {
      if (!rawKey) {
        toast({ title: "请输入密钥", variant: "destructive" });
        return;
      }
      if (!rawIv) {
        toast({ title: "请输入IV", variant: "destructive" });
        return;
      }
    } else if (!encPassword) {
      toast({ title: "请输入密码", variant: "destructive" });
      return;
    }

    try {
      const encoder = new TextEncoder();
      let key: CryptoKey;
      let iv: Uint8Array;
      let salt: Uint8Array | null = null;

      if (useRawKey) {
        key = await importRawKey(rawKey);
        iv = new Uint8Array(hexToBuffer(rawIv));
      } else {
        salt = generateRandomBytes(16);
        key = await deriveKeyFromPassword(encPassword, salt);
        iv = generateRandomBytes(mode === "GCM" ? 12 : 16);
      }

      let algorithm: AesGcmParams | AesCbcParams | AesCtrParams;
      if (mode === "GCM") {
        algorithm = { name: "AES-GCM", iv: iv as BufferSource };
      } else if (mode === "CBC") {
        algorithm = { name: "AES-CBC", iv: iv as BufferSource };
      } else {
        algorithm = {
          name: "AES-CTR",
          counter: iv as BufferSource,
          length: 64,
        };
      }

      const ciphertext = await crypto.subtle.encrypt(
        algorithm,
        key,
        encoder.encode(plaintext)
      );

      let combined: Uint8Array;
      if (useRawKey) {
        combined = new Uint8Array(ciphertext);
      } else {
        combined = new Uint8Array(
          salt!.length + iv.length + ciphertext.byteLength
        );
        combined.set(salt!, 0);
        combined.set(iv, salt!.length);
        combined.set(new Uint8Array(ciphertext), salt!.length + iv.length);
      }

      if (outputFormat === "base64") {
        setEncryptedResult(bufferToBase64(combined.buffer as ArrayBuffer));
      } else {
        setEncryptedResult(bufferToHex(combined.buffer as ArrayBuffer));
      }

      toast({ title: "加密成功" });
    } catch (error) {
      toast({
        title: "加密失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    }
  };

  const decrypt = async () => {
    if (!ciphertext) {
      toast({ title: "请输入要解密的密文", variant: "destructive" });
      return;
    }

    if (useRawKey) {
      if (!rawKey) {
        toast({ title: "请输入密钥", variant: "destructive" });
        return;
      }
      if (!rawIv) {
        toast({ title: "请输入IV", variant: "destructive" });
        return;
      }
    } else if (!decPassword) {
      toast({ title: "请输入密码", variant: "destructive" });
      return;
    }

    try {
      let combined: Uint8Array;
      if (outputFormat === "base64") {
        combined = new Uint8Array(base64ToBuffer(ciphertext));
      } else {
        combined = new Uint8Array(hexToBuffer(ciphertext));
      }

      let key: CryptoKey;
      let iv: Uint8Array;
      let encryptedData: Uint8Array;

      if (useRawKey) {
        key = await importRawKey(rawKey);
        iv = new Uint8Array(hexToBuffer(rawIv));
        encryptedData = combined;
      } else {
        const ivLength = mode === "GCM" ? 12 : 16;
        const salt = combined.slice(0, 16);
        iv = combined.slice(16, 16 + ivLength);
        encryptedData = combined.slice(16 + ivLength);
        key = await deriveKeyFromPassword(decPassword, salt);
      }

      let algorithm: AesGcmParams | AesCbcParams | AesCtrParams;
      if (mode === "GCM") {
        algorithm = { name: "AES-GCM", iv: iv as BufferSource };
      } else if (mode === "CBC") {
        algorithm = { name: "AES-CBC", iv: iv as BufferSource };
      } else {
        algorithm = {
          name: "AES-CTR",
          counter: iv as BufferSource,
          length: 64,
        };
      }

      const decrypted = await crypto.subtle.decrypt(
        algorithm,
        key,
        encryptedData as BufferSource
      );

      setDecryptedResult(new TextDecoder().decode(decrypted));
      toast({ title: "解密成功" });
    } catch (error) {
      toast({
        title: "解密失败",
        description: "密码错误或密文损坏",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制到剪贴板" });
  };

  return (
    <ToolLayout
      title="AES加密"
      description="AES对称加密工具，支持GCM、CBC、CTR等模式"
      icon={Shield}
    >
      <div className="space-y-6">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>加密模式</Label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as AesMode)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GCM">GCM (推荐)</SelectItem>
                <SelectItem value="CBC">CBC</SelectItem>
                <SelectItem value="CTR">CTR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>密钥长度</Label>
            <Select
              value={keySize.toString()}
              onValueChange={(v) => setKeySize(parseInt(v) as KeySize)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">128位</SelectItem>
                <SelectItem value="192">192位</SelectItem>
                <SelectItem value="256">256位</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>输出格式</Label>
            <Select
              value={outputFormat}
              onValueChange={(v) => setOutputFormat(v as OutputFormat)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="base64">Base64</SelectItem>
                <SelectItem value="hex">十六进制</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>密钥模式</Label>
            <Select
              value={useRawKey ? "raw" : "password"}
              onValueChange={(v) => setUseRawKey(v === "raw")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="password">密码派生</SelectItem>
                <SelectItem value="raw">原始密钥</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Raw key inputs */}
        {useRawKey && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label>密钥 (十六进制)</Label>
              <div className="flex gap-2">
                <Input
                  value={rawKey}
                  onChange={(e) => setRawKey(e.target.value)}
                  placeholder={`${keySize / 8} 字节十六进制密钥`}
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={generateKey}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>IV (十六进制)</Label>
              <div className="flex gap-2">
                <Input
                  value={rawIv}
                  onChange={(e) => setRawIv(e.target.value)}
                  placeholder={`${mode === "GCM" ? 12 : 16} 字节十六进制IV`}
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon" onClick={generateIv}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="encrypt" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encrypt" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              加密
            </TabsTrigger>
            <TabsTrigger value="decrypt" className="flex items-center gap-2">
              <Unlock className="h-4 w-4" />
              解密
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encrypt" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>明文</Label>
              <Textarea
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="输入要加密的文本..."
                rows={5}
              />
            </div>

            {!useRawKey && (
              <div className="space-y-2">
                <Label>密码</Label>
                <Input
                  type="password"
                  value={encPassword}
                  onChange={(e) => setEncPassword(e.target.value)}
                  placeholder="输入加密密码..."
                />
              </div>
            )}

            <Button onClick={encrypt} className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              加密
            </Button>

            {encryptedResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>加密结果</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(encryptedResult)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </Button>
                </div>
                <Textarea
                  value={encryptedResult}
                  readOnly
                  rows={5}
                  className="font-mono text-sm"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="decrypt" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>密文</Label>
              <Textarea
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                placeholder="输入要解密的密文..."
                rows={5}
                className="font-mono text-sm"
              />
            </div>

            {!useRawKey && (
              <div className="space-y-2">
                <Label>密码</Label>
                <Input
                  type="password"
                  value={decPassword}
                  onChange={(e) => setDecPassword(e.target.value)}
                  placeholder="输入解密密码..."
                />
              </div>
            )}

            <Button onClick={decrypt} className="w-full">
              <Unlock className="h-4 w-4 mr-2" />
              解密
            </Button>

            {decryptedResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>解密结果</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(decryptedResult)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </Button>
                </div>
                <Textarea value={decryptedResult} readOnly rows={5} />
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Mode descriptions */}
        <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-2">
          <h4 className="font-medium">加密模式说明</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>
              <strong>GCM (推荐)</strong>: 提供加密和认证，能检测数据篡改，是现代首选模式
            </li>
            <li>
              <strong>CBC</strong>: 经典分组加密模式，需要填充，不提供认证
            </li>
            <li>
              <strong>CTR</strong>: 计数器模式，将块密码转为流密码，不需要填充
            </li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
