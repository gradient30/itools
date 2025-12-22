import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { KeyRound, Copy, RefreshCw, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PasswordGeneratorTool = () => {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("");

  const generatePassword = useCallback(() => {
    let chars = "";
    const uppercaseChars = excludeAmbiguous ? "ABCDEFGHJKMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = excludeAmbiguous ? "abcdefghjkmnpqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz";
    const numberChars = excludeAmbiguous ? "23456789" : "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (uppercase) chars += uppercaseChars;
    if (lowercase) chars += lowercaseChars;
    if (numbers) chars += numberChars;
    if (symbols) chars += symbolChars;

    if (!chars) {
      toast({
        title: "错误",
        description: "请至少选择一种字符类型",
        variant: "destructive",
      });
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols, excludeAmbiguous]);

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    toast({ title: "已复制到剪贴板" });
  };

  const getStrength = (): { label: string; color: string; percentage: number } => {
    if (!password) return { label: "无", color: "bg-muted", percentage: 0 };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { label: "弱", color: "bg-red-500", percentage: 25 };
    if (score <= 4) return { label: "中等", color: "bg-yellow-500", percentage: 50 };
    if (score <= 5) return { label: "强", color: "bg-blue-500", percentage: 75 };
    return { label: "非常强", color: "bg-green-500", percentage: 100 };
  };

  const strength = getStrength();

  return (
    <ToolLayout
      title="密码生成器"
      description="生成安全的随机密码"
      icon={KeyRound}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>密码长度: {length}</Label>
              <Slider
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                min={4}
                max={64}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase" className="flex items-center gap-2">
                  大写字母 (A-Z)
                </Label>
                <Switch
                  id="uppercase"
                  checked={uppercase}
                  onCheckedChange={setUppercase}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase" className="flex items-center gap-2">
                  小写字母 (a-z)
                </Label>
                <Switch
                  id="lowercase"
                  checked={lowercase}
                  onCheckedChange={setLowercase}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="numbers" className="flex items-center gap-2">
                  数字 (0-9)
                </Label>
                <Switch
                  id="numbers"
                  checked={numbers}
                  onCheckedChange={setNumbers}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="symbols" className="flex items-center gap-2">
                  特殊符号 (!@#$%...)
                </Label>
                <Switch
                  id="symbols"
                  checked={symbols}
                  onCheckedChange={setSymbols}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="excludeAmbiguous" className="flex items-center gap-2">
                  排除易混淆字符 (0O1lI)
                </Label>
                <Switch
                  id="excludeAmbiguous"
                  checked={excludeAmbiguous}
                  onCheckedChange={setExcludeAmbiguous}
                />
              </div>
            </div>

            <Button onClick={generatePassword} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              生成密码
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">生成结果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={password}
                  readOnly
                  placeholder="点击生成按钮创建密码"
                  className="font-mono text-lg"
                />
                <Button variant="outline" onClick={handleCopy} disabled={!password}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {password && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>密码强度</span>
                    <span className="font-medium">{strength.label}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${strength.color}`}
                      style={{ width: `${strength.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>密码特征</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      {/[A-Z]/.test(password) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>包含大写字母</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/[a-z]/.test(password) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>包含小写字母</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/[0-9]/.test(password) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>包含数字</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/[^a-zA-Z0-9]/.test(password) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>包含符号</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default PasswordGeneratorTool;
