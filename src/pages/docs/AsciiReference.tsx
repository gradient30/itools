import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Binary, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface AsciiItem {
  dec: number;
  hex: string;
  char: string;
  description: string;
}

interface AsciiSection {
  title: string;
  items: AsciiItem[];
}

const asciiData: AsciiSection[] = [
  {
    title: "控制字符 (0-31)",
    items: [
      { dec: 0, hex: "00", char: "NUL", description: "空字符" },
      { dec: 1, hex: "01", char: "SOH", description: "标题开始" },
      { dec: 2, hex: "02", char: "STX", description: "正文开始" },
      { dec: 3, hex: "03", char: "ETX", description: "正文结束" },
      { dec: 4, hex: "04", char: "EOT", description: "传输结束" },
      { dec: 5, hex: "05", char: "ENQ", description: "查询" },
      { dec: 6, hex: "06", char: "ACK", description: "确认" },
      { dec: 7, hex: "07", char: "BEL", description: "响铃" },
      { dec: 8, hex: "08", char: "BS", description: "退格" },
      { dec: 9, hex: "09", char: "HT", description: "水平制表符" },
      { dec: 10, hex: "0A", char: "LF", description: "换行" },
      { dec: 11, hex: "0B", char: "VT", description: "垂直制表符" },
      { dec: 12, hex: "0C", char: "FF", description: "换页" },
      { dec: 13, hex: "0D", char: "CR", description: "回车" },
      { dec: 14, hex: "0E", char: "SO", description: "移出" },
      { dec: 15, hex: "0F", char: "SI", description: "移入" },
      { dec: 16, hex: "10", char: "DLE", description: "数据链路转义" },
      { dec: 17, hex: "11", char: "DC1", description: "设备控制1" },
      { dec: 18, hex: "12", char: "DC2", description: "设备控制2" },
      { dec: 19, hex: "13", char: "DC3", description: "设备控制3" },
      { dec: 20, hex: "14", char: "DC4", description: "设备控制4" },
      { dec: 21, hex: "15", char: "NAK", description: "否定确认" },
      { dec: 22, hex: "16", char: "SYN", description: "同步空闲" },
      { dec: 23, hex: "17", char: "ETB", description: "传输块结束" },
      { dec: 24, hex: "18", char: "CAN", description: "取消" },
      { dec: 25, hex: "19", char: "EM", description: "介质结束" },
      { dec: 26, hex: "1A", char: "SUB", description: "替换" },
      { dec: 27, hex: "1B", char: "ESC", description: "退出" },
      { dec: 28, hex: "1C", char: "FS", description: "文件分隔符" },
      { dec: 29, hex: "1D", char: "GS", description: "组分隔符" },
      { dec: 30, hex: "1E", char: "RS", description: "记录分隔符" },
      { dec: 31, hex: "1F", char: "US", description: "单元分隔符" },
    ]
  },
  {
    title: "特殊字符 (32-47)",
    items: [
      { dec: 32, hex: "20", char: "(空格)", description: "空格" },
      { dec: 33, hex: "21", char: "!", description: "感叹号" },
      { dec: 34, hex: "22", char: "\"", description: "双引号" },
      { dec: 35, hex: "23", char: "#", description: "井号" },
      { dec: 36, hex: "24", char: "$", description: "美元符" },
      { dec: 37, hex: "25", char: "%", description: "百分号" },
      { dec: 38, hex: "26", char: "&", description: "和号" },
      { dec: 39, hex: "27", char: "'", description: "单引号" },
      { dec: 40, hex: "28", char: "(", description: "左括号" },
      { dec: 41, hex: "29", char: ")", description: "右括号" },
      { dec: 42, hex: "2A", char: "*", description: "星号" },
      { dec: 43, hex: "2B", char: "+", description: "加号" },
      { dec: 44, hex: "2C", char: ",", description: "逗号" },
      { dec: 45, hex: "2D", char: "-", description: "减号/连字符" },
      { dec: 46, hex: "2E", char: ".", description: "句点" },
      { dec: 47, hex: "2F", char: "/", description: "斜杠" },
    ]
  },
  {
    title: "数字 (48-57)",
    items: [
      { dec: 48, hex: "30", char: "0", description: "数字零" },
      { dec: 49, hex: "31", char: "1", description: "数字一" },
      { dec: 50, hex: "32", char: "2", description: "数字二" },
      { dec: 51, hex: "33", char: "3", description: "数字三" },
      { dec: 52, hex: "34", char: "4", description: "数字四" },
      { dec: 53, hex: "35", char: "5", description: "数字五" },
      { dec: 54, hex: "36", char: "6", description: "数字六" },
      { dec: 55, hex: "37", char: "7", description: "数字七" },
      { dec: 56, hex: "38", char: "8", description: "数字八" },
      { dec: 57, hex: "39", char: "9", description: "数字九" },
    ]
  },
  {
    title: "符号 (58-64)",
    items: [
      { dec: 58, hex: "3A", char: ":", description: "冒号" },
      { dec: 59, hex: "3B", char: ";", description: "分号" },
      { dec: 60, hex: "3C", char: "<", description: "小于号" },
      { dec: 61, hex: "3D", char: "=", description: "等号" },
      { dec: 62, hex: "3E", char: ">", description: "大于号" },
      { dec: 63, hex: "3F", char: "?", description: "问号" },
      { dec: 64, hex: "40", char: "@", description: "at符号" },
    ]
  },
  {
    title: "大写字母 (65-90)",
    items: Array.from({ length: 26 }, (_, i) => ({
      dec: 65 + i,
      hex: (65 + i).toString(16).toUpperCase(),
      char: String.fromCharCode(65 + i),
      description: `大写字母 ${String.fromCharCode(65 + i)}`
    }))
  },
  {
    title: "符号 (91-96)",
    items: [
      { dec: 91, hex: "5B", char: "[", description: "左方括号" },
      { dec: 92, hex: "5C", char: "\\", description: "反斜杠" },
      { dec: 93, hex: "5D", char: "]", description: "右方括号" },
      { dec: 94, hex: "5E", char: "^", description: "脱字符" },
      { dec: 95, hex: "5F", char: "_", description: "下划线" },
      { dec: 96, hex: "60", char: "`", description: "反引号" },
    ]
  },
  {
    title: "小写字母 (97-122)",
    items: Array.from({ length: 26 }, (_, i) => ({
      dec: 97 + i,
      hex: (97 + i).toString(16).toUpperCase(),
      char: String.fromCharCode(97 + i),
      description: `小写字母 ${String.fromCharCode(97 + i)}`
    }))
  },
  {
    title: "符号 (123-127)",
    items: [
      { dec: 123, hex: "7B", char: "{", description: "左花括号" },
      { dec: 124, hex: "7C", char: "|", description: "竖线" },
      { dec: 125, hex: "7D", char: "}", description: "右花括号" },
      { dec: 126, hex: "7E", char: "~", description: "波浪号" },
      { dec: 127, hex: "7F", char: "DEL", description: "删除" },
    ]
  },
];

function AsciiCard({ dec, hex, char, description }: AsciiItem) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const copyText = char.length === 1 ? char : `${dec}`;
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={handleCopy}
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-primary/10 text-primary font-mono font-bold">
        {char}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-mono text-foreground">DEC: {dec}</span>
          <span className="text-muted-foreground">|</span>
          <span className="font-mono text-foreground">HEX: 0x{hex}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

export default function AsciiReference() {
  return (
    <ToolLayout
      title="ASCII 码表"
      description="ASCII 字符编码速查表"
      icon={Binary}
    >
      <div className="space-y-8">
        {asciiData.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-foreground mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {section.items.map((item) => (
                <AsciiCard key={item.dec} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
