import { useState, useEffect } from "react";
import { Palette, Copy } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPickerTool() {
  const { toast } = useToast();
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

  useEffect(() => {
    const rgbVal = hexToRgb(hex);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  }, [hex]);

  const handleHexChange = (value: string) => {
    if (!value.startsWith("#")) {
      value = "#" + value;
    }
    setHex(value);
  };

  const handleRgbChange = (channel: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [channel]: Math.min(255, Math.max(0, value)) };
    setRgb(newRgb);
    const newHex = `#${newRgb.r.toString(16).padStart(2, "0")}${newRgb.g.toString(16).padStart(2, "0")}${newRgb.b.toString(16).padStart(2, "0")}`;
    setHex(newHex.toUpperCase());
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "已复制", description: `${label}已复制到剪贴板` });
  };

  const hexValue = hex.toUpperCase();
  const rgbValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslValue = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <Layout>
      <ToolLayout
        title="颜色选择器"
        description="颜色格式转换与选择"
        icon={Palette}
      >
        <div className="space-y-6">
          {/* Color Preview */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-full h-32 rounded-xl border border-border/50 shadow-lg"
              style={{ backgroundColor: hex }}
            />
            <Input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
          </div>

          {/* Color Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* HEX */}
            <div className="p-4 rounded-lg bg-card border border-border/50 space-y-2">
              <Label className="text-sm font-semibold">HEX</Label>
              <div className="flex gap-2">
                <Input
                  value={hexValue}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="font-mono"
                  maxLength={7}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(hexValue, "HEX")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* RGB */}
            <div className="p-4 rounded-lg bg-card border border-border/50 space-y-2">
              <Label className="text-sm font-semibold">RGB</Label>
              <div className="flex gap-2">
                <Input
                  value={rgbValue}
                  readOnly
                  className="font-mono flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(rgbValue, "RGB")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <Label className="text-xs text-muted-foreground">R</Label>
                  <Input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb.r}
                    onChange={(e) => handleRgbChange("r", parseInt(e.target.value) || 0)}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">G</Label>
                  <Input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb.g}
                    onChange={(e) => handleRgbChange("g", parseInt(e.target.value) || 0)}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">B</Label>
                  <Input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb.b}
                    onChange={(e) => handleRgbChange("b", parseInt(e.target.value) || 0)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* HSL */}
            <div className="p-4 rounded-lg bg-card border border-border/50 space-y-2">
              <Label className="text-sm font-semibold">HSL</Label>
              <div className="flex gap-2">
                <Input
                  value={hslValue}
                  readOnly
                  className="font-mono flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(hslValue, "HSL")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                <div>H: {hsl.h}°</div>
                <div>S: {hsl.s}%</div>
                <div>L: {hsl.l}%</div>
              </div>
            </div>
          </div>

          {/* Preset Colors */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <Label className="text-sm font-semibold mb-3 block">常用颜色</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "#EF4444", "#F97316", "#EAB308", "#22C55E", "#10B981",
                "#14B8A6", "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
                "#8B5CF6", "#A855F7", "#D946EF", "#EC4899", "#F43F5E",
              ].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-md border border-border/50 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => setHex(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </ToolLayout>
    </Layout>
  );
}
