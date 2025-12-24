import { useState } from "react";
import { Hash, Copy, FileText, Key, RefreshCw, Lightbulb } from "lucide-react";
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
import { hmacMd5, pbkdf2, generateSalt } from "@/lib/crypto-utils";
import { FileHasher } from "@/components/FileHasher";

type Mode = "md5" | "hmac" | "pbkdf2";

const EXAMPLES = {
  md5: {
    input: "Hello, World!",
    expected: "65a8e27d8879283831b664bd8b7f0ad4",
  },
  hmac: {
    input: "这是需要签名的消息",
    key: "my-secret-key",
  },
  pbkdf2: {
    input: "MyPassword123",
    salt: "random-salt-value",
  },
};

// Simple MD5 implementation
function md5(input: string): string {
  function rotateLeft(x: number, n: number): number {
    return (x << n) | (x >>> (32 - n));
  }

  function addUnsigned(x: number, y: number): number {
    const x8 = x & 0x80000000;
    const y8 = y & 0x80000000;
    const x4 = x & 0x40000000;
    const y4 = y & 0x40000000;
    const result = (x & 0x3fffffff) + (y & 0x3fffffff);
    if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8;
    if (x4 | y4) {
      if (result & 0x40000000) return result ^ 0xc0000000 ^ x8 ^ y8;
      else return result ^ 0x40000000 ^ x8 ^ y8;
    } else return result ^ x8 ^ y8;
  }

  function F(x: number, y: number, z: number): number { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number): number { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number): number { return x ^ y ^ z; }
  function I(x: number, y: number, z: number): number { return y ^ (x | ~z); }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function wordToHex(value: number): string {
    let hex = "";
    for (let i = 0; i <= 3; i++) {
      const byte = (value >>> (i * 8)) & 255;
      hex += ("0" + byte.toString(16)).slice(-2);
    }
    return hex;
  }

  // Convert string to UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  
  // Pre-processing
  const bitLength = bytes.length * 8;
  const padding = new Uint8Array(((bytes.length + 8) >>> 6) * 64 + 64);
  padding.set(bytes);
  padding[bytes.length] = 0x80;
  
  const view = new DataView(padding.buffer as ArrayBuffer);
  view.setUint32(padding.length - 8, bitLength, true);

  // Initialize
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;

  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  for (let i = 0; i < padding.length; i += 64) {
    const x: number[] = [];
    for (let j = 0; j < 16; j++) {
      x[j] = view.getUint32(i + j * 4, true);
    }

    let AA = a, BB = b, CC = c, DD = d;

    a = FF(a, b, c, d, x[0], S11, 0xd76aa478); d = FF(d, a, b, c, x[1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[2], S13, 0x242070db); b = FF(b, c, d, a, x[3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[4], S11, 0xf57c0faf); d = FF(d, a, b, c, x[5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[6], S13, 0xa8304613); b = FF(b, c, d, a, x[7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[8], S11, 0x698098d8); d = FF(d, a, b, c, x[9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[10], S13, 0xffff5bb1); b = FF(b, c, d, a, x[11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[12], S11, 0x6b901122); d = FF(d, a, b, c, x[13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[14], S13, 0xa679438e); b = FF(b, c, d, a, x[15], S14, 0x49b40821);

    a = GG(a, b, c, d, x[1], S21, 0xf61e2562); d = GG(d, a, b, c, x[6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[11], S23, 0x265e5a51); b = GG(b, c, d, a, x[0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[5], S21, 0xd62f105d); d = GG(d, a, b, c, x[10], S22, 0x2441453);
    c = GG(c, d, a, b, x[15], S23, 0xd8a1e681); b = GG(b, c, d, a, x[4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[9], S21, 0x21e1cde6); d = GG(d, a, b, c, x[14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[3], S23, 0xf4d50d87); b = GG(b, c, d, a, x[8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[13], S21, 0xa9e3e905); d = GG(d, a, b, c, x[2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[7], S23, 0x676f02d9); b = GG(b, c, d, a, x[12], S24, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[5], S31, 0xfffa3942); d = HH(d, a, b, c, x[8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[11], S33, 0x6d9d6122); b = HH(b, c, d, a, x[14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[1], S31, 0xa4beea44); d = HH(d, a, b, c, x[4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[7], S33, 0xf6bb4b60); b = HH(b, c, d, a, x[10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[13], S31, 0x289b7ec6); d = HH(d, a, b, c, x[0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[3], S33, 0xd4ef3085); b = HH(b, c, d, a, x[6], S34, 0x4881d05);
    a = HH(a, b, c, d, x[9], S31, 0xd9d4d039); d = HH(d, a, b, c, x[12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[15], S33, 0x1fa27cf8); b = HH(b, c, d, a, x[2], S34, 0xc4ac5665);

    a = II(a, b, c, d, x[0], S41, 0xf4292244); d = II(d, a, b, c, x[7], S42, 0x432aff97);
    c = II(c, d, a, b, x[14], S43, 0xab9423a7); b = II(b, c, d, a, x[5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[12], S41, 0x655b59c3); d = II(d, a, b, c, x[3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[10], S43, 0xffeff47d); b = II(b, c, d, a, x[1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[8], S41, 0x6fa87e4f); d = II(d, a, b, c, x[15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[6], S43, 0xa3014314); b = II(b, c, d, a, x[13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[4], S41, 0xf7537e82); d = II(d, a, b, c, x[11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[2], S43, 0x2ad7d2bb); b = II(b, c, d, a, x[9], S44, 0xeb86d391);

    a = addUnsigned(a, AA); b = addUnsigned(b, BB);
    c = addUnsigned(c, CC); d = addUnsigned(d, DD);
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}

export default function Md5Tool() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [uppercase, setUppercase] = useState(false);
  const [mode, setMode] = useState<Mode>("md5");
  
  // HMAC options
  const [hmacKey, setHmacKey] = useState("");
  
  // PBKDF2 options
  const [salt, setSalt] = useState("");
  const [iterations, setIterations] = useState(100000);
  const [keyLength, setKeyLength] = useState(32);

  // File hash results
  const [fileHashResult, setFileHashResult] = useState<{
    hashes: Record<string, string>;
    fileName: string;
    fileSize: number;
  } | null>(null);

  const handleFileHash = (hashes: Record<string, string>, fileName: string, fileSize: number) => {
    setFileHashResult({ hashes, fileName, fileSize });
  };

  const calculate = async () => {
    if (!input) {
      toast({ title: "请输入内容", description: "请先输入要处理的文本", variant: "destructive" });
      return;
    }

    let hash = "";
    
    try {
      switch (mode) {
        case "md5":
          hash = md5(input);
          break;
        case "hmac":
          if (!hmacKey) {
            toast({ title: "请输入密钥", description: "HMAC 需要提供密钥", variant: "destructive" });
            return;
          }
          hash = hmacMd5(input, hmacKey);
          break;
        case "pbkdf2":
          if (!salt) {
            toast({ title: "请输入盐值", description: "PBKDF2 需要提供盐值", variant: "destructive" });
            return;
          }
          hash = await pbkdf2({
            password: input,
            salt,
            iterations,
            keyLength,
            hash: "SHA-256",
          });
          break;
      }
      
      setResult(uppercase ? hash.toUpperCase() : hash);
    } catch (e) {
      toast({ title: "计算失败", description: "处理时发生错误", variant: "destructive" });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({ title: "已复制", description: "结果已复制到剪贴板" });
  };

  const handleGenerateSalt = () => {
    setSalt(generateSalt(16));
  };

  const clearAll = () => {
    setInput("");
    setResult("");
    setHmacKey("");
    setSalt("");
  };

  const loadExample = () => {
    switch (mode) {
      case "md5":
        setInput(EXAMPLES.md5.input);
        break;
      case "hmac":
        setInput(EXAMPLES.hmac.input);
        setHmacKey(EXAMPLES.hmac.key);
        break;
      case "pbkdf2":
        setInput(EXAMPLES.pbkdf2.input);
        setSalt(EXAMPLES.pbkdf2.salt);
        break;
    }
    setResult("");
    toast({ title: "已加载示例" });
  };

  return (
    <ToolLayout
      title="MD5加密"
      description="MD5哈希、HMAC-MD5、PBKDF2密钥派生"
      icon={Hash}
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <Tabs value={mode} onValueChange={(v) => { setMode(v as Mode); setResult(""); }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="md5">MD5</TabsTrigger>
            <TabsTrigger value="hmac">HMAC-MD5</TabsTrigger>
            <TabsTrigger value="pbkdf2">PBKDF2</TabsTrigger>
          </TabsList>

          <TabsContent value="hmac" className="mt-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Key className="h-4 w-4" />
                HMAC-MD5 密钥哈希
              </div>
              <div className="space-y-2">
                <Label htmlFor="hmacKey">密钥 (必填)</Label>
                <Input
                  id="hmacKey"
                  value={hmacKey}
                  onChange={(e) => setHmacKey(e.target.value)}
                  placeholder="输入HMAC密钥..."
                  className="font-mono"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pbkdf2" className="mt-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Key className="h-4 w-4" />
                PBKDF2 密钥派生
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salt">盐值 (Salt)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="salt"
                      value={salt}
                      onChange={(e) => setSalt(e.target.value)}
                      placeholder="输入盐值..."
                      className="font-mono"
                    />
                    <Button variant="outline" size="icon" onClick={handleGenerateSalt} title="生成随机盐值">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iterations">迭代次数</Label>
                  <Select value={iterations.toString()} onValueChange={(v) => setIterations(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10000">10,000</SelectItem>
                      <SelectItem value="50000">50,000</SelectItem>
                      <SelectItem value="100000">100,000</SelectItem>
                      <SelectItem value="200000">200,000</SelectItem>
                      <SelectItem value="500000">500,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyLength">密钥长度 (字节)</Label>
                  <Select value={keyLength.toString()} onValueChange={(v) => setKeyLength(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16">16 (128位)</SelectItem>
                      <SelectItem value="32">32 (256位)</SelectItem>
                      <SelectItem value="64">64 (512位)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="md5" className="mt-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground">
                标准 MD5 哈希算法，产生 128 位哈希值。<strong>注意：</strong>MD5 已不推荐用于安全敏感场景。
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">
              {mode === "pbkdf2" ? "密码" : "输入文本"}
            </Label>
            <Button variant="ghost" size="sm" onClick={loadExample}>
              <Lightbulb className="h-4 w-4 mr-1" />
              加载示例
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "pbkdf2" ? "输入要派生密钥的密码..." : "输入要计算哈希的文本..."}
            className="min-h-[120px] font-mono"
          />
        </div>

        {/* Options & Action */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded"
            />
            大写输出
          </label>
          <Button onClick={calculate} className="gap-2">
            <FileText className="h-4 w-4" />
            {mode === "pbkdf2" ? "派生密钥" : "计算哈希"}
          </Button>
          <Button onClick={clearAll} variant="ghost" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            清空
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                {mode === "md5" && "MD5 (32位)"}
                {mode === "hmac" && "HMAC-MD5"}
                {mode === "pbkdf2" && `PBKDF2 派生密钥 (${keyLength * 2}位十六进制)`}
              </Label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
            </div>
            <Textarea
              value={result}
              readOnly
              className="font-mono text-sm bg-muted/30 min-h-[80px]"
            />
            {mode === "md5" && (
              <div className="text-sm text-muted-foreground text-center">
                16位: {result.slice(8, 24)}
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground space-y-2">
          {mode === "md5" && (
            <p>MD5是一种广泛使用的加密散列函数，产生128位（16字节）的哈希值。注意：MD5已不推荐用于安全敏感场景。</p>
          )}
          {mode === "hmac" && (
            <>
              <p><strong>HMAC-MD5</strong> 是带密钥的哈希消息认证码。</p>
              <ul className="list-disc list-inside ml-2">
                <li>用于验证消息的完整性和真实性</li>
                <li>需要发送方和接收方共享相同的密钥</li>
              </ul>
            </>
          )}
          {mode === "pbkdf2" && (
            <>
              <p><strong>PBKDF2</strong> (Password-Based Key Derivation Function 2) 是密码派生函数。</p>
              <ul className="list-disc list-inside ml-2">
                <li>将密码转换为固定长度的密钥</li>
                <li>使用盐值防止彩虹表攻击</li>
                <li>迭代次数越高越安全，但也更慢</li>
                <li>推荐用于密码存储和密钥生成</li>
              </ul>
            </>
          )}
        </div>

        {/* File Hash Section */}
        <FileHasher 
          onHashCalculated={handleFileHash}
          algorithms={["MD5"]}
        />

        {fileHashResult && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">文件哈希结果</Label>
              <span className="text-xs text-muted-foreground">{fileHashResult.fileName}</span>
            </div>
            {Object.entries(fileHashResult.hashes).map(([algo, hash]) => (
              <div key={algo} className="flex items-center gap-2">
                <span className="w-16 text-sm text-muted-foreground shrink-0">{algo}:</span>
                <code className="flex-1 text-xs font-mono break-all bg-background/50 p-2 rounded">
                  {uppercase ? hash.toUpperCase() : hash}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(uppercase ? hash.toUpperCase() : hash);
                    toast({ title: "已复制" });
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
