import { useState } from "react";
import { Hash, Copy, FileText } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  
  const view = new DataView(padding.buffer);
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

  const calculate = () => {
    if (!input) {
      toast({ title: "请输入内容", description: "请先输入要加密的文本", variant: "destructive" });
      return;
    }
    const hash = md5(input);
    setResult(uppercase ? hash.toUpperCase() : hash);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({ title: "已复制", description: "MD5值已复制到剪贴板" });
  };

  return (
    <ToolLayout
      title="MD5加密"
      description="计算文本的MD5哈希值"
      icon={Hash}
    >
        <div className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">输入文本</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入要计算MD5的文本..."
              className="min-h-[150px] font-mono"
            />
          </div>

          {/* Options & Action */}
          <div className="flex items-center justify-center gap-4">
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
              计算MD5
            </Button>
          </div>

          {/* Result */}
          {result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">MD5 (32位)</Label>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  复制
                </Button>
              </div>
              <Input
                value={result}
                readOnly
                className="font-mono text-center text-lg bg-muted/30"
              />
              <div className="text-sm text-muted-foreground text-center">
                16位: {result.slice(8, 24)}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
            <p>MD5是一种广泛使用的加密散列函数，产生128位（16字节）的哈希值。注意：MD5已不推荐用于安全敏感场景。</p>
          </div>
      </div>
    </ToolLayout>
  );
}
