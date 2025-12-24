import { useState, useRef } from "react";
import { Upload, File, X, Hash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { bufferToHex } from "@/lib/crypto-utils";

interface FileHasherProps {
  onHashCalculated: (hashes: Record<string, string>, fileName: string, fileSize: number) => void;
  algorithms?: ("MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512")[];
}

// Simple MD5 implementation for files
async function md5File(buffer: ArrayBuffer): Promise<string> {
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

  const bytes = new Uint8Array(buffer);
  const bitLength = bytes.length * 8;
  const padding = new Uint8Array(((bytes.length + 8) >>> 6) * 64 + 64);
  padding.set(bytes);
  padding[bytes.length] = 0x80;

  const view = new DataView(padding.buffer as ArrayBuffer);
  view.setUint32(padding.length - 8, bitLength, true);

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

    const AA = a, BB = b, CC = c, DD = d;

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

export function FileHasher({ onHashCalculated, algorithms = ["MD5", "SHA-256"] }: FileHasherProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast({ title: "文件过大", description: "文件大小不能超过100MB", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
    }
  };

  const calculateHashes = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const hashes: Record<string, string> = {};
      const total = algorithms.length;

      for (let i = 0; i < algorithms.length; i++) {
        const algo = algorithms[i];
        setProgress(((i + 0.5) / total) * 100);

        if (algo === "MD5") {
          hashes["MD5"] = await md5File(buffer);
        } else {
          const hashBuffer = await crypto.subtle.digest(algo, buffer);
          hashes[algo] = bufferToHex(hashBuffer);
        }

        setProgress(((i + 1) / total) * 100);
      }

      onHashCalculated(hashes, selectedFile.name, selectedFile.size);
      toast({ title: "计算完成" });
    } catch (error) {
      toast({ title: "计算失败", description: "处理文件时发生错误", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
      <div className="flex items-center gap-2 text-sm font-medium">
        <File className="h-4 w-4" />
        文件哈希计算
      </div>

      <div className="space-y-3">
        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!selectedFile ? (
          <Button
            variant="outline"
            className="w-full h-20 border-dashed"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6" />
              <span>点击选择文件 (最大100MB)</span>
            </div>
          </Button>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
            <File className="h-8 w-8 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile} disabled={isProcessing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              正在计算... {Math.round(progress)}%
            </p>
          </div>
        )}

        <Button
          onClick={calculateHashes}
          disabled={!selectedFile || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              计算中...
            </>
          ) : (
            <>
              <Hash className="h-4 w-4 mr-2" />
              计算文件哈希
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
