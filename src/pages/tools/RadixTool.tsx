import { useState } from "react";
import { Binary, Copy, ArrowRightLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function RadixTool() {
  const { toast } = useToast();
  const [binary, setBinary] = useState("");
  const [octal, setOctal] = useState("");
  const [decimal, setDecimal] = useState("");
  const [hex, setHex] = useState("");

  const convert = (value: string, fromBase: number) => {
    try {
      if (!value.trim()) {
        setBinary("");
        setOctal("");
        setDecimal("");
        setHex("");
        return;
      }

      const num = parseInt(value, fromBase);
      if (isNaN(num)) {
        toast({ title: "转换失败", description: "请输入有效的数值", variant: "destructive" });
        return;
      }

      setBinary(num.toString(2));
      setOctal(num.toString(8));
      setDecimal(num.toString(10));
      setHex(num.toString(16).toUpperCase());
    } catch {
      toast({ title: "转换失败", description: "转换出错", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制", description: `${label}已复制到剪贴板` });
  };

  const radixInputs = [
    { label: "二进制 (Base 2)", value: binary, setValue: setBinary, base: 2, placeholder: "1010" },
    { label: "八进制 (Base 8)", value: octal, setValue: setOctal, base: 8, placeholder: "12" },
    { label: "十进制 (Base 10)", value: decimal, setValue: setDecimal, base: 10, placeholder: "10" },
    { label: "十六进制 (Base 16)", value: hex, setValue: setHex, base: 16, placeholder: "A" },
  ];

  return (
    <Layout>
      <ToolLayout
        title="进制转换"
        description="二进制、八进制、十进制、十六进制互转"
        icon={Binary}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <ArrowRightLeft className="h-5 w-5" />
            <span>输入任意进制数值，自动转换其他进制</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {radixInputs.map(({ label, value, setValue, base, placeholder }) => (
              <div key={base} className="space-y-2 p-4 rounded-lg bg-secondary/30 border border-border/50">
                <Label className="text-sm font-medium">{label}</Label>
                <div className="flex gap-2">
                  <Input
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      convert(e.target.value, base);
                    }}
                    placeholder={placeholder}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(value, label)}
                    disabled={!value}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Examples */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <h3 className="text-sm font-semibold mb-3">快速示例</h3>
            <div className="flex flex-wrap gap-2">
              {[255, 128, 64, 32, 16, 8].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDecimal(num.toString());
                    convert(num.toString(), 10);
                  }}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ToolLayout>
    </Layout>
  );
}
