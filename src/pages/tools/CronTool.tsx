import { useState, useMemo } from "react";
import { Timer, Copy, Check, X } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CronPart {
  value: string;
  label: string;
  options: { value: string; label: string }[];
}

const cronParts: CronPart[] = [
  {
    value: "minute",
    label: "分钟",
    options: [
      { value: "*", label: "每分钟" },
      { value: "0", label: "第0分钟" },
      { value: "*/5", label: "每5分钟" },
      { value: "*/10", label: "每10分钟" },
      { value: "*/15", label: "每15分钟" },
      { value: "*/30", label: "每30分钟" },
    ],
  },
  {
    value: "hour",
    label: "小时",
    options: [
      { value: "*", label: "每小时" },
      { value: "0", label: "0点" },
      { value: "*/2", label: "每2小时" },
      { value: "*/6", label: "每6小时" },
      { value: "*/12", label: "每12小时" },
      { value: "9-18", label: "工作时间(9-18)" },
    ],
  },
  {
    value: "day",
    label: "日",
    options: [
      { value: "*", label: "每天" },
      { value: "1", label: "每月1日" },
      { value: "15", label: "每月15日" },
      { value: "1,15", label: "每月1日和15日" },
      { value: "*/2", label: "每2天" },
    ],
  },
  {
    value: "month",
    label: "月",
    options: [
      { value: "*", label: "每月" },
      { value: "1", label: "一月" },
      { value: "*/3", label: "每季度" },
      { value: "1,4,7,10", label: "每季度首月" },
    ],
  },
  {
    value: "weekday",
    label: "星期",
    options: [
      { value: "*", label: "每天" },
      { value: "0", label: "周日" },
      { value: "1-5", label: "工作日(周一到周五)" },
      { value: "0,6", label: "周末" },
      { value: "1", label: "周一" },
    ],
  },
];

function parseCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    return "无效的Cron表达式 (需要5个字段)";
  }

  const [minute, hour, day, month, weekday] = parts;

  const descriptions: string[] = [];

  // Minute
  if (minute === "*") {
    descriptions.push("每分钟");
  } else if (minute.startsWith("*/")) {
    descriptions.push(`每${minute.slice(2)}分钟`);
  } else {
    descriptions.push(`在第${minute}分钟`);
  }

  // Hour
  if (hour === "*") {
    descriptions.push("每小时");
  } else if (hour.startsWith("*/")) {
    descriptions.push(`每${hour.slice(2)}小时`);
  } else if (hour.includes("-")) {
    const [start, end] = hour.split("-");
    descriptions.push(`${start}点到${end}点之间`);
  } else {
    descriptions.push(`${hour}点`);
  }

  // Day
  if (day !== "*") {
    if (day.startsWith("*/")) {
      descriptions.push(`每${day.slice(2)}天`);
    } else if (day.includes(",")) {
      descriptions.push(`每月${day}日`);
    } else {
      descriptions.push(`每月${day}日`);
    }
  }

  // Month
  if (month !== "*") {
    if (month.startsWith("*/")) {
      descriptions.push(`每${month.slice(2)}个月`);
    } else {
      const monthNames = ["", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
      descriptions.push(monthNames[parseInt(month)] || `第${month}月`);
    }
  }

  // Weekday
  if (weekday !== "*") {
    const weekdayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    if (weekday.includes("-")) {
      const [start, end] = weekday.split("-");
      descriptions.push(`${weekdayNames[parseInt(start)]}到${weekdayNames[parseInt(end)]}`);
    } else if (weekday.includes(",")) {
      const days = weekday.split(",").map((d) => weekdayNames[parseInt(d)]).join("和");
      descriptions.push(days);
    } else {
      descriptions.push(weekdayNames[parseInt(weekday)]);
    }
  }

  return descriptions.join("，");
}

function isValidCron(cron: string): boolean {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return false;
  
  const patterns = [
    /^(\*|[0-5]?\d)(-[0-5]?\d)?(\/\d+)?$|^(\*|[0-5]?\d)(,([0-5]?\d))*$/, // minute
    /^(\*|[01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/\d+)?$|^(\*|[01]?\d|2[0-3])(,([01]?\d|2[0-3]))*$/, // hour
    /^(\*|[1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01]))?(\/\d+)?$|^(\*|[1-9]|[12]\d|3[01])(,([1-9]|[12]\d|3[01]))*$/, // day
    /^(\*|[1-9]|1[0-2])(-([1-9]|1[0-2]))?(\/\d+)?$|^(\*|[1-9]|1[0-2])(,([1-9]|1[0-2]))*$/, // month
    /^(\*|[0-6])(-[0-6])?(\/\d+)?$|^(\*|[0-6])(,[0-6])*$/, // weekday
  ];

  return parts.every((part, i) => patterns[i].test(part));
}

const presets = [
  { label: "每分钟", value: "* * * * *" },
  { label: "每小时", value: "0 * * * *" },
  { label: "每天午夜", value: "0 0 * * *" },
  { label: "每天9点", value: "0 9 * * *" },
  { label: "每周一9点", value: "0 9 * * 1" },
  { label: "每月1日", value: "0 0 1 * *" },
  { label: "工作日9点", value: "0 9 * * 1-5" },
  { label: "每5分钟", value: "*/5 * * * *" },
];

export default function CronTool() {
  const { toast } = useToast();
  const [cron, setCron] = useState("0 9 * * 1-5");
  const [parts, setParts] = useState(["0", "9", "*", "*", "1-5"]);

  const isValid = useMemo(() => isValidCron(cron), [cron]);
  const description = useMemo(() => (isValid ? parseCron(cron) : "无效的Cron表达式"), [cron, isValid]);

  const updatePart = (index: number, value: string) => {
    const newParts = [...parts];
    newParts[index] = value;
    setParts(newParts);
    setCron(newParts.join(" "));
  };

  const handleCronChange = (value: string) => {
    setCron(value);
    const newParts = value.trim().split(/\s+/);
    if (newParts.length === 5) {
      setParts(newParts);
    }
  };

  const loadPreset = (value: string) => {
    handleCronChange(value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cron);
    toast({ title: "已复制", description: "Cron表达式已复制到剪贴板" });
  };

  return (
    <ToolLayout
      title="Cron表达式生成"
      description="生成和解析Cron定时任务表达式"
      icon={Timer}
    >
        <div className="space-y-6">
          {/* Cron Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Cron表达式</Label>
              <div className="flex items-center gap-2">
                {isValid ? (
                  <span className="flex items-center gap-1 text-sm text-green-500">
                    <Check className="h-4 w-4" /> 有效
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-destructive">
                    <X className="h-4 w-4" /> 无效
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  复制
                </Button>
              </div>
            </div>
            <Input
              value={cron}
              onChange={(e) => handleCronChange(e.target.value)}
              placeholder="* * * * *"
              className="font-mono text-lg text-center"
            />
          </div>

          {/* Description */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
            <p className="text-lg font-medium">{description}</p>
          </div>

          {/* Part Selectors */}
          <div className="grid grid-cols-5 gap-2">
            {cronParts.map((part, index) => (
              <div key={part.value} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{part.label}</Label>
                <Select value={parts[index]} onValueChange={(v) => updatePart(index, v)}>
                  <SelectTrigger className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {part.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Format Reference */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex justify-center gap-4 text-sm font-mono mb-4">
              <span className="text-center">
                <div className="text-primary font-bold">*</div>
                <div className="text-muted-foreground text-xs">分钟</div>
              </span>
              <span className="text-center">
                <div className="text-primary font-bold">*</div>
                <div className="text-muted-foreground text-xs">小时</div>
              </span>
              <span className="text-center">
                <div className="text-primary font-bold">*</div>
                <div className="text-muted-foreground text-xs">日</div>
              </span>
              <span className="text-center">
                <div className="text-primary font-bold">*</div>
                <div className="text-muted-foreground text-xs">月</div>
              </span>
              <span className="text-center">
                <div className="text-primary font-bold">*</div>
                <div className="text-muted-foreground text-xs">星期</div>
              </span>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              <code>*</code> 任意 | <code>*/n</code> 每n | <code>n-m</code> 范围 | <code>n,m</code> 列表
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">常用预设</Label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  onClick={() => loadPreset(preset.value)}
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
      </div>
    </ToolLayout>
  );
}
