import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Copy, Plus, Trash2, RotateCcw, Blend } from "lucide-react";

interface ColorStop {
  color: string;
  position: number;
}

const GradientTool = () => {
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: "#667eea", position: 0 },
    { color: "#764ba2", position: 100 },
  ]);
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState([90]);

  const generateGradientCSS = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      return `linear-gradient(${angle[0]}deg, ${stopsString})`;
    }
    return `radial-gradient(circle, ${stopsString})`;
  };

  const addColorStop = () => {
    if (colorStops.length >= 5) {
      toast.error("最多支持5个颜色节点");
      return;
    }
    setColorStops([...colorStops, { color: "#ffffff", position: 50 }]);
  };

  const removeColorStop = (index: number) => {
    if (colorStops.length <= 2) {
      toast.error("至少需要2个颜色节点");
      return;
    }
    setColorStops(colorStops.filter((_, i) => i !== index));
  };

  const updateColorStop = (index: number, field: "color" | "position", value: string | number) => {
    const newStops = [...colorStops];
    if (field === "color") {
      newStops[index].color = value as string;
    } else {
      newStops[index].position = value as number;
    }
    setColorStops(newStops);
  };

  const copyCSS = () => {
    const css = `background: ${generateGradientCSS()};`;
    navigator.clipboard.writeText(css);
    toast.success("CSS已复制到剪贴板");
  };

  const copyTailwind = () => {
    // Generate Tailwind-compatible gradient class suggestion
    const tailwind = `bg-gradient-to-r from-[${colorStops[0].color}] to-[${colorStops[colorStops.length - 1].color}]`;
    navigator.clipboard.writeText(tailwind);
    toast.success("Tailwind类已复制到剪贴板");
  };

  const resetToDefault = () => {
    setColorStops([
      { color: "#667eea", position: 0 },
      { color: "#764ba2", position: 100 },
    ]);
    setAngle([90]);
    setGradientType("linear");
  };

  const presets = [
    { name: "日落", colors: [{ color: "#ff512f", position: 0 }, { color: "#f09819", position: 100 }] },
    { name: "海洋", colors: [{ color: "#2193b0", position: 0 }, { color: "#6dd5ed", position: 100 }] },
    { name: "紫雾", colors: [{ color: "#654ea3", position: 0 }, { color: "#eaafc8", position: 100 }] },
    { name: "森林", colors: [{ color: "#134e5e", position: 0 }, { color: "#71b280", position: 100 }] },
    { name: "极光", colors: [{ color: "#00c6ff", position: 0 }, { color: "#0072ff", position: 50 }, { color: "#7c3aed", position: 100 }] },
    { name: "火焰", colors: [{ color: "#f12711", position: 0 }, { color: "#f5af19", position: 100 }] },
  ];

  return (
    <ToolLayout
      title="颜色渐变生成器"
      description="创建CSS渐变效果，支持多色节点和预设"
      icon={Blend}
    >
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="w-full h-48 rounded-lg border"
                style={{ background: generateGradientCSS() }}
              />
            </CardContent>
          </Card>

          {/* Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">预设</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setColorStops(preset.colors)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg border hover:border-primary transition-colors"
                  >
                    <div
                      className="w-full h-8 rounded"
                      style={{
                        background: `linear-gradient(90deg, ${preset.colors.map((c) => `${c.color} ${c.position}%`).join(", ")})`,
                      }}
                    />
                    <span className="text-xs">{preset.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>渐变类型</Label>
                  <Select value={gradientType} onValueChange={(v) => setGradientType(v as "linear" | "radial")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">线性渐变</SelectItem>
                      <SelectItem value="radial">径向渐变</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {gradientType === "linear" && (
                  <div className="space-y-2">
                    <Label>角度: {angle[0]}°</Label>
                    <Slider
                      value={angle}
                      onValueChange={setAngle}
                      min={0}
                      max={360}
                      step={1}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Color Stops */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>颜色节点</span>
                <Button size="sm" variant="outline" onClick={addColorStop}>
                  <Plus className="h-4 w-4 mr-1" />
                  添加
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {colorStops.map((stop, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateColorStop(index, "color", e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={stop.color}
                    onChange={(e) => updateColorStop(index, "color", e.target.value)}
                    className="flex-1 font-mono"
                    placeholder="#000000"
                  />
                  <div className="flex items-center gap-2 w-32">
                    <Slider
                      value={[stop.position]}
                      onValueChange={(v) => updateColorStop(index, "position", v[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-10">{stop.position}%</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeColorStop(index)}
                    disabled={colorStops.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">输出</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">
                background: {generateGradientCSS()};
              </div>
              <div className="flex gap-2">
                <Button onClick={copyCSS} className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  复制CSS
                </Button>
                <Button onClick={copyTailwind} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  复制Tailwind
                </Button>
                <Button onClick={resetToDefault} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
    </ToolLayout>
  );
};

export default GradientTool;
