import { useState } from "react";
import { ShieldCheck, Copy, Hash, Key, RefreshCw, Lightbulb } from "lucide-react";
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
import { hmac, pbkdf2, generateSalt } from "@/lib/crypto-utils";
import { FileHasher } from "@/components/FileHasher";

type Mode = "sha" | "hmac" | "pbkdf2";
type ShaType = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

const EXAMPLES = {
  sha: {
    input: "Hello, World!",
    expected256: "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f",
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

async function sha(message: string, algorithm: ShaType): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function ShaTool() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<ShaType, string>>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
  });
  const [activeTab, setActiveTab] = useState<ShaType>("SHA-256");
  const [uppercase, setUppercase] = useState(false);
  const [mode, setMode] = useState<Mode>("sha");

  // HMAC options
  const [hmacKey, setHmacKey] = useState("");
  const [hmacAlgo, setHmacAlgo] = useState<ShaType>("SHA-256");
  const [hmacResult, setHmacResult] = useState("");

  // PBKDF2 options
  const [salt, setSalt] = useState("");
  const [iterations, setIterations] = useState(100000);
  const [keyLength, setKeyLength] = useState(32);
  const [pbkdf2Algo, setPbkdf2Algo] = useState<ShaType>("SHA-256");
  const [pbkdf2Result, setPbkdf2Result] = useState("");

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
      setResults({ "SHA-1": "", "SHA-256": "", "SHA-384": "", "SHA-512": "" });
      setHmacResult("");
      setPbkdf2Result("");
      return;
    }

    try {
      switch (mode) {
        case "sha":
          const algorithms: ShaType[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
          const newResults: Record<ShaType, string> = { "SHA-1": "", "SHA-256": "", "SHA-384": "", "SHA-512": "" };
          for (const algo of algorithms) {
            newResults[algo] = await sha(input, algo);
          }
          setResults(newResults);
          break;

        case "hmac":
          if (!hmacKey) {
            toast({ title: "请输入密钥", description: "HMAC 需要提供密钥", variant: "destructive" });
            return;
          }
          const hmacHash = await hmac(input, hmacKey, hmacAlgo);
          setHmacResult(uppercase ? hmacHash.toUpperCase() : hmacHash);
          break;

        case "pbkdf2":
          if (!salt) {
            toast({ title: "请输入盐值", description: "PBKDF2 需要提供盐值", variant: "destructive" });
            return;
          }
          const derivedKey = await pbkdf2({
            password: input,
            salt,
            iterations,
            keyLength,
            hash: pbkdf2Algo,
          });
          setPbkdf2Result(uppercase ? derivedKey.toUpperCase() : derivedKey);
          break;
      }
    } catch (e) {
      toast({ title: "计算失败", description: "处理时发生错误", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    const result = uppercase ? text.toUpperCase() : text;
    navigator.clipboard.writeText(result);
    toast({ title: "已复制", description: `${label}已复制到剪贴板` });
  };

  const formatResult = (hash: string) => (uppercase ? hash.toUpperCase() : hash);

  const handleGenerateSalt = () => {
    setSalt(generateSalt(16));
  };

  const clearAll = () => {
    setInput("");
    setResults({ "SHA-1": "", "SHA-256": "", "SHA-384": "", "SHA-512": "" });
    setHmacKey("");
    setHmacResult("");
    setSalt("");
    setPbkdf2Result("");
  };

  const loadExample = () => {
    switch (mode) {
      case "sha":
        setInput(EXAMPLES.sha.input);
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
    setResults({ "SHA-1": "", "SHA-256": "", "SHA-384": "", "SHA-512": "" });
    setHmacResult("");
    setPbkdf2Result("");
    toast({ title: "已加载示例" });
  };

  return (
    <ToolLayout
      title="SHA加密"
      description="SHA哈希、HMAC-SHA、PBKDF2密钥派生"
      icon={ShieldCheck}
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <Tabs value={mode} onValueChange={(v) => { setMode(v as Mode); }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sha">SHA 哈希</TabsTrigger>
            <TabsTrigger value="hmac">HMAC-SHA</TabsTrigger>
            <TabsTrigger value="pbkdf2">PBKDF2</TabsTrigger>
          </TabsList>

          <TabsContent value="hmac" className="mt-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Key className="h-4 w-4" />
                HMAC-SHA 密钥哈希
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label>哈希算法</Label>
                  <Select value={hmacAlgo} onValueChange={(v) => setHmacAlgo(v as ShaType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHA-1">SHA-1</SelectItem>
                      <SelectItem value="SHA-256">SHA-256</SelectItem>
                      <SelectItem value="SHA-384">SHA-384</SelectItem>
                      <SelectItem value="SHA-512">SHA-512</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  <Label>哈希算法</Label>
                  <Select value={pbkdf2Algo} onValueChange={(v) => setPbkdf2Algo(v as ShaType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHA-1">SHA-1</SelectItem>
                      <SelectItem value="SHA-256">SHA-256</SelectItem>
                      <SelectItem value="SHA-384">SHA-384</SelectItem>
                      <SelectItem value="SHA-512">SHA-512</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>迭代次数</Label>
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
                  <Label>密钥长度 (字节)</Label>
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

          <TabsContent value="sha" className="mt-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground">
                SHA (Secure Hash Algorithm) 系列哈希算法。SHA-256 及以上版本被认为是安全的。
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

        {/* Options */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-border"
            />
            大写输出
          </label>
          <Button onClick={calculate} className="gap-2">
            <Hash className="h-4 w-4" />
            {mode === "pbkdf2" ? "派生密钥" : "计算哈希"}
          </Button>
          <Button onClick={clearAll} variant="ghost" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            清空
          </Button>
        </div>

        {/* SHA Results */}
        {mode === "sha" && (
          <>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ShaType)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="SHA-1">SHA-1</TabsTrigger>
                <TabsTrigger value="SHA-256">SHA-256</TabsTrigger>
                <TabsTrigger value="SHA-384">SHA-384</TabsTrigger>
                <TabsTrigger value="SHA-512">SHA-512</TabsTrigger>
              </TabsList>

              {(["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as ShaType[]).map((algo) => (
                <TabsContent key={algo} value={algo} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">{algo} ({algo === "SHA-1" ? 40 : algo === "SHA-256" ? 64 : algo === "SHA-384" ? 96 : 128} 字符)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results[algo], algo)}
                      disabled={!results[algo]}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      复制
                    </Button>
                  </div>
                  <Input
                    value={formatResult(results[algo])}
                    readOnly
                    placeholder={`${algo}哈希值将显示在这里`}
                    className="font-mono text-sm bg-muted/30"
                  />
                </TabsContent>
              ))}
            </Tabs>

            {/* All Results */}
            {results["SHA-256"] && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-3">
                <Label className="text-sm font-semibold block">所有哈希值</Label>
                {(["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as ShaType[]).map((algo) => (
                  <div key={algo} className="flex items-center gap-2">
                    <span className="w-20 text-sm text-muted-foreground shrink-0">{algo}:</span>
                    <code className="flex-1 text-xs font-mono break-all bg-background/50 p-2 rounded">
                      {formatResult(results[algo])}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => copyToClipboard(results[algo], algo)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* HMAC Result */}
        {mode === "hmac" && hmacResult && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">HMAC-{hmacAlgo}</Label>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(hmacResult, `HMAC-${hmacAlgo}`)}>
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
            </div>
            <Textarea
              value={hmacResult}
              readOnly
              className="font-mono text-sm bg-muted/30 min-h-[80px]"
            />
          </div>
        )}

        {/* PBKDF2 Result */}
        {mode === "pbkdf2" && pbkdf2Result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">PBKDF2 派生密钥 ({keyLength * 2}位十六进制)</Label>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(pbkdf2Result, "PBKDF2")}>
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
            </div>
            <Textarea
              value={pbkdf2Result}
              readOnly
              className="font-mono text-sm bg-muted/30 min-h-[80px]"
            />
          </div>
        )}

        {/* Info */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground space-y-2">
          {mode === "sha" && (
            <p>SHA (Secure Hash Algorithm) 是一系列密码散列函数。SHA-256及以上版本被认为是安全的，SHA-1已不推荐用于安全敏感场景。</p>
          )}
          {mode === "hmac" && (
            <>
              <p><strong>HMAC-SHA</strong> 是带密钥的哈希消息认证码。</p>
              <ul className="list-disc list-inside ml-2">
                <li>用于验证消息的完整性和真实性</li>
                <li>比简单哈希更安全，可防止篡改</li>
                <li>广泛用于 API 签名、JWT 等</li>
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
          algorithms={["SHA-1", "SHA-256", "SHA-384", "SHA-512"]}
        />

        {fileHashResult && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">文件哈希结果</Label>
              <span className="text-xs text-muted-foreground">{fileHashResult.fileName}</span>
            </div>
            {Object.entries(fileHashResult.hashes).map(([algo, hash]) => (
              <div key={algo} className="flex items-center gap-2">
                <span className="w-20 text-sm text-muted-foreground shrink-0">{algo}:</span>
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
