import { useState, useRef } from "react";
import { Upload, File, X, Lock, Unlock, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  bufferToBase64,
  base64ToBuffer,
  generateRandomBytes,
} from "@/lib/crypto-utils";

export function FileEncryptor() {
  const { toast } = useToast();
  const encryptInputRef = useRef<HTMLInputElement>(null);
  const decryptInputRef = useRef<HTMLInputElement>(null);

  // Encrypt state
  const [encryptFile, setEncryptFile] = useState<File | null>(null);
  const [encryptPassword, setEncryptPassword] = useState("");
  const [encryptedBlob, setEncryptedBlob] = useState<Blob | null>(null);

  // Decrypt state
  const [decryptFile, setDecryptFile] = useState<File | null>(null);
  const [decryptPassword, setDecryptPassword] = useState("");
  const [decryptedBlob, setDecryptedBlob] = useState<Blob | null>(null);
  const [originalFileName, setOriginalFileName] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
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
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const handleEncrypt = async () => {
    if (!encryptFile || !encryptPassword) {
      toast({ title: "请选择文件并输入密码", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const fileBuffer = await encryptFile.arrayBuffer();
      setProgress(20);

      // Generate salt and IV
      const salt = generateRandomBytes(16);
      const iv = generateRandomBytes(12);
      setProgress(30);

      // Derive key
      const key = await deriveKey(encryptPassword, salt);
      setProgress(50);

      // Encrypt file data
      const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv as BufferSource },
        key,
        fileBuffer
      );
      setProgress(80);

      // Store original filename
      const fileNameBytes = new TextEncoder().encode(encryptFile.name);
      const fileNameLength = new Uint8Array([fileNameBytes.length]);

      // Combine: salt(16) + iv(12) + fileNameLength(1) + fileName + encrypted data
      const combined = new Uint8Array(
        16 + 12 + 1 + fileNameBytes.length + encryptedData.byteLength
      );
      let offset = 0;
      combined.set(salt, offset); offset += 16;
      combined.set(iv, offset); offset += 12;
      combined.set(fileNameLength, offset); offset += 1;
      combined.set(fileNameBytes, offset); offset += fileNameBytes.length;
      combined.set(new Uint8Array(encryptedData), offset);

      setEncryptedBlob(new Blob([combined], { type: "application/octet-stream" }));
      setProgress(100);
      toast({ title: "加密成功" });
    } catch (error) {
      toast({ title: "加密失败", description: "处理文件时发生错误", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDecrypt = async () => {
    if (!decryptFile || !decryptPassword) {
      toast({ title: "请选择文件并输入密码", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const fileBuffer = await decryptFile.arrayBuffer();
      const data = new Uint8Array(fileBuffer);
      setProgress(20);

      // Extract components
      let offset = 0;
      const salt = data.slice(offset, offset + 16); offset += 16;
      const iv = data.slice(offset, offset + 12); offset += 12;
      const fileNameLength = data[offset]; offset += 1;
      const fileNameBytes = data.slice(offset, offset + fileNameLength); offset += fileNameLength;
      const encryptedData = data.slice(offset);

      const fileName = new TextDecoder().decode(fileNameBytes);
      setOriginalFileName(fileName);
      setProgress(30);

      // Derive key
      const key = await deriveKey(decryptPassword, salt);
      setProgress(50);

      // Decrypt
      const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv as BufferSource },
        key,
        encryptedData as BufferSource
      );
      setProgress(90);

      setDecryptedBlob(new Blob([decryptedData]));
      setProgress(100);
      toast({ title: "解密成功" });
    } catch (error) {
      toast({ title: "解密失败", description: "密码错误或文件已损坏", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearEncrypt = () => {
    setEncryptFile(null);
    setEncryptPassword("");
    setEncryptedBlob(null);
    if (encryptInputRef.current) encryptInputRef.current.value = "";
  };

  const clearDecrypt = () => {
    setDecryptFile(null);
    setDecryptPassword("");
    setDecryptedBlob(null);
    setOriginalFileName("");
    if (decryptInputRef.current) decryptInputRef.current.value = "";
  };

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Lock className="h-4 w-4" />
        文件加密/解密
      </div>

      <Tabs defaultValue="encrypt" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt">
            <Lock className="h-4 w-4 mr-1" />
            加密文件
          </TabsTrigger>
          <TabsTrigger value="decrypt">
            <Unlock className="h-4 w-4 mr-1" />
            解密文件
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-3 mt-3">
          <Input
            ref={encryptInputRef}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 50 * 1024 * 1024) {
                  toast({ title: "文件过大", description: "加密文件不能超过50MB", variant: "destructive" });
                  return;
                }
                setEncryptFile(file);
                setEncryptedBlob(null);
              }
            }}
            className="hidden"
          />

          {!encryptFile ? (
            <Button
              variant="outline"
              className="w-full h-16 border-dashed"
              onClick={() => encryptInputRef.current?.click()}
            >
              <Upload className="h-5 w-5 mr-2" />
              选择要加密的文件 (最大50MB)
            </Button>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
              <File className="h-6 w-6 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{encryptFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(encryptFile.size)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={clearEncrypt} disabled={isProcessing}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-1">
            <Label>加密密码</Label>
            <Input
              type="password"
              value={encryptPassword}
              onChange={(e) => setEncryptPassword(e.target.value)}
              placeholder="输入加密密码..."
            />
          </div>

          {isProcessing && (
            <Progress value={progress} className="h-2" />
          )}

          <Button
            onClick={handleEncrypt}
            disabled={!encryptFile || !encryptPassword || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            加密文件
          </Button>

          {encryptedBlob && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => downloadBlob(encryptedBlob, `${encryptFile?.name}.encrypted`)}
            >
              <Download className="h-4 w-4 mr-2" />
              下载加密文件
            </Button>
          )}
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-3 mt-3">
          <Input
            ref={decryptInputRef}
            type="file"
            accept=".encrypted"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setDecryptFile(file);
                setDecryptedBlob(null);
                setOriginalFileName("");
              }
            }}
            className="hidden"
          />

          {!decryptFile ? (
            <Button
              variant="outline"
              className="w-full h-16 border-dashed"
              onClick={() => decryptInputRef.current?.click()}
            >
              <Upload className="h-5 w-5 mr-2" />
              选择要解密的 .encrypted 文件
            </Button>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
              <File className="h-6 w-6 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{decryptFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(decryptFile.size)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={clearDecrypt} disabled={isProcessing}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-1">
            <Label>解密密码</Label>
            <Input
              type="password"
              value={decryptPassword}
              onChange={(e) => setDecryptPassword(e.target.value)}
              placeholder="输入解密密码..."
            />
          </div>

          {isProcessing && (
            <Progress value={progress} className="h-2" />
          )}

          <Button
            onClick={handleDecrypt}
            disabled={!decryptFile || !decryptPassword || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Unlock className="h-4 w-4 mr-2" />
            )}
            解密文件
          </Button>

          {decryptedBlob && originalFileName && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => downloadBlob(decryptedBlob, originalFileName)}
            >
              <Download className="h-4 w-4 mr-2" />
              下载解密文件 ({originalFileName})
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
