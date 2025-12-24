import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Palette, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ColorItem {
  name: string;
  hex: string;
}

interface ColorSection {
  title: string;
  colors: ColorItem[];
}

const colorData: ColorSection[] = [
  {
    title: "基础颜色",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Red", hex: "#FF0000" },
      { name: "Green", hex: "#00FF00" },
      { name: "Blue", hex: "#0000FF" },
      { name: "Yellow", hex: "#FFFF00" },
      { name: "Cyan", hex: "#00FFFF" },
      { name: "Magenta", hex: "#FF00FF" },
    ]
  },
  {
    title: "红色系",
    colors: [
      { name: "IndianRed", hex: "#CD5C5C" },
      { name: "LightCoral", hex: "#F08080" },
      { name: "Salmon", hex: "#FA8072" },
      { name: "DarkSalmon", hex: "#E9967A" },
      { name: "Crimson", hex: "#DC143C" },
      { name: "FireBrick", hex: "#B22222" },
      { name: "DarkRed", hex: "#8B0000" },
      { name: "Tomato", hex: "#FF6347" },
      { name: "Coral", hex: "#FF7F50" },
      { name: "OrangeRed", hex: "#FF4500" },
    ]
  },
  {
    title: "橙色系",
    colors: [
      { name: "Orange", hex: "#FFA500" },
      { name: "DarkOrange", hex: "#FF8C00" },
      { name: "Gold", hex: "#FFD700" },
      { name: "Goldenrod", hex: "#DAA520" },
      { name: "DarkGoldenrod", hex: "#B8860B" },
      { name: "Peru", hex: "#CD853F" },
      { name: "Chocolate", hex: "#D2691E" },
      { name: "SaddleBrown", hex: "#8B4513" },
      { name: "Sienna", hex: "#A0522D" },
      { name: "Brown", hex: "#A52A2A" },
    ]
  },
  {
    title: "黄色系",
    colors: [
      { name: "Yellow", hex: "#FFFF00" },
      { name: "LightYellow", hex: "#FFFFE0" },
      { name: "LemonChiffon", hex: "#FFFACD" },
      { name: "PapayaWhip", hex: "#FFEFD5" },
      { name: "Moccasin", hex: "#FFE4B5" },
      { name: "PeachPuff", hex: "#FFDAB9" },
      { name: "Khaki", hex: "#F0E68C" },
      { name: "DarkKhaki", hex: "#BDB76B" },
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Cornsilk", hex: "#FFF8DC" },
    ]
  },
  {
    title: "绿色系",
    colors: [
      { name: "Green", hex: "#008000" },
      { name: "Lime", hex: "#00FF00" },
      { name: "LimeGreen", hex: "#32CD32" },
      { name: "LawnGreen", hex: "#7CFC00" },
      { name: "Chartreuse", hex: "#7FFF00" },
      { name: "GreenYellow", hex: "#ADFF2F" },
      { name: "SpringGreen", hex: "#00FF7F" },
      { name: "MediumSpringGreen", hex: "#00FA9A" },
      { name: "LightGreen", hex: "#90EE90" },
      { name: "PaleGreen", hex: "#98FB98" },
      { name: "DarkSeaGreen", hex: "#8FBC8F" },
      { name: "MediumSeaGreen", hex: "#3CB371" },
      { name: "SeaGreen", hex: "#2E8B57" },
      { name: "ForestGreen", hex: "#228B22" },
      { name: "DarkGreen", hex: "#006400" },
      { name: "Olive", hex: "#808000" },
      { name: "OliveDrab", hex: "#6B8E23" },
      { name: "DarkOliveGreen", hex: "#556B2F" },
    ]
  },
  {
    title: "蓝色系",
    colors: [
      { name: "Blue", hex: "#0000FF" },
      { name: "Navy", hex: "#000080" },
      { name: "DarkBlue", hex: "#00008B" },
      { name: "MediumBlue", hex: "#0000CD" },
      { name: "RoyalBlue", hex: "#4169E1" },
      { name: "SteelBlue", hex: "#4682B4" },
      { name: "DodgerBlue", hex: "#1E90FF" },
      { name: "DeepSkyBlue", hex: "#00BFFF" },
      { name: "CornflowerBlue", hex: "#6495ED" },
      { name: "SkyBlue", hex: "#87CEEB" },
      { name: "LightSkyBlue", hex: "#87CEFA" },
      { name: "LightBlue", hex: "#ADD8E6" },
      { name: "PowderBlue", hex: "#B0E0E6" },
      { name: "CadetBlue", hex: "#5F9EA0" },
      { name: "DarkCyan", hex: "#008B8B" },
      { name: "Teal", hex: "#008080" },
    ]
  },
  {
    title: "紫色系",
    colors: [
      { name: "Purple", hex: "#800080" },
      { name: "Indigo", hex: "#4B0082" },
      { name: "DarkMagenta", hex: "#8B008B" },
      { name: "DarkViolet", hex: "#9400D3" },
      { name: "DarkOrchid", hex: "#9932CC" },
      { name: "MediumOrchid", hex: "#BA55D3" },
      { name: "BlueViolet", hex: "#8A2BE2" },
      { name: "MediumPurple", hex: "#9370DB" },
      { name: "MediumSlateBlue", hex: "#7B68EE" },
      { name: "SlateBlue", hex: "#6A5ACD" },
      { name: "DarkSlateBlue", hex: "#483D8B" },
      { name: "Orchid", hex: "#DA70D6" },
      { name: "Violet", hex: "#EE82EE" },
      { name: "Plum", hex: "#DDA0DD" },
      { name: "Thistle", hex: "#D8BFD8" },
      { name: "Lavender", hex: "#E6E6FA" },
    ]
  },
  {
    title: "粉色系",
    colors: [
      { name: "Pink", hex: "#FFC0CB" },
      { name: "LightPink", hex: "#FFB6C1" },
      { name: "HotPink", hex: "#FF69B4" },
      { name: "DeepPink", hex: "#FF1493" },
      { name: "MediumVioletRed", hex: "#C71585" },
      { name: "PaleVioletRed", hex: "#DB7093" },
      { name: "LavenderBlush", hex: "#FFF0F5" },
      { name: "MistyRose", hex: "#FFE4E1" },
    ]
  },
  {
    title: "灰色系",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Snow", hex: "#FFFAFA" },
      { name: "Honeydew", hex: "#F0FFF0" },
      { name: "MintCream", hex: "#F5FFFA" },
      { name: "Azure", hex: "#F0FFFF" },
      { name: "AliceBlue", hex: "#F0F8FF" },
      { name: "GhostWhite", hex: "#F8F8FF" },
      { name: "WhiteSmoke", hex: "#F5F5F5" },
      { name: "Gainsboro", hex: "#DCDCDC" },
      { name: "LightGray", hex: "#D3D3D3" },
      { name: "Silver", hex: "#C0C0C0" },
      { name: "DarkGray", hex: "#A9A9A9" },
      { name: "Gray", hex: "#808080" },
      { name: "DimGray", hex: "#696969" },
      { name: "LightSlateGray", hex: "#778899" },
      { name: "SlateGray", hex: "#708090" },
      { name: "DarkSlateGray", hex: "#2F4F4F" },
      { name: "Black", hex: "#000000" },
    ]
  },
];

function ColorCard({ name, hex }: ColorItem) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    toast.success(`已复制 ${hex}`);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate if text should be light or dark based on background
  const isLightColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  const textColor = isLightColor(hex) ? "#000000" : "#FFFFFF";

  return (
    <div
      onClick={handleCopy}
      className="group cursor-pointer rounded-lg overflow-hidden border border-border/50 hover:border-border transition-colors"
    >
      <div 
        className="h-16 flex items-center justify-center relative"
        style={{ backgroundColor: hex }}
      >
        <span className="font-mono text-sm font-medium" style={{ color: textColor }}>
          {hex}
        </span>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? (
            <Check className="h-4 w-4" style={{ color: textColor }} />
          ) : (
            <Copy className="h-4 w-4" style={{ color: textColor }} />
          )}
        </div>
      </div>
      <div className="p-2 bg-card text-center">
        <span className="text-xs text-muted-foreground">{name}</span>
      </div>
    </div>
  );
}

export default function ColorsReference() {
  return (
    <ToolLayout
      title="颜色名称参考"
      description="CSS/HTML 标准颜色名称速查表"
      icon={Palette}
    >
      <div className="space-y-8">
        {colorData.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-foreground mb-4">{section.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {section.colors.map((color) => (
                <ColorCard key={color.name} {...color} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
