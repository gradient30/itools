import { ToolLayout } from "@/components/ToolLayout";
import { Regex, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface PatternItem {
  pattern: string;
  description: string;
  example?: string;
}

interface PatternSection {
  title: string;
  items: PatternItem[];
}

const regexPatterns: PatternSection[] = [
  {
    title: "字符类",
    items: [
      { pattern: ".", description: "匹配除换行符外的任意字符", example: "a.c 匹配 abc, adc" },
      { pattern: "\\d", description: "匹配数字 [0-9]", example: "\\d+ 匹配 123" },
      { pattern: "\\D", description: "匹配非数字", example: "\\D+ 匹配 abc" },
      { pattern: "\\w", description: "匹配单词字符 [a-zA-Z0-9_]", example: "\\w+ 匹配 hello_123" },
      { pattern: "\\W", description: "匹配非单词字符", example: "\\W 匹配 !" },
      { pattern: "\\s", description: "匹配空白字符（空格、制表符等）", example: "a\\sb 匹配 a b" },
      { pattern: "\\S", description: "匹配非空白字符", example: "\\S+ 匹配 hello" },
      { pattern: "[abc]", description: "匹配方括号内任意字符", example: "[aeiou] 匹配元音" },
      { pattern: "[^abc]", description: "匹配不在方括号内的字符", example: "[^0-9] 匹配非数字" },
      { pattern: "[a-z]", description: "匹配范围内的字符", example: "[A-Za-z] 匹配字母" },
    ],
  },
  {
    title: "量词",
    items: [
      { pattern: "*", description: "匹配0次或多次", example: "ab*c 匹配 ac, abc, abbc" },
      { pattern: "+", description: "匹配1次或多次", example: "ab+c 匹配 abc, abbc" },
      { pattern: "?", description: "匹配0次或1次", example: "colou?r 匹配 color, colour" },
      { pattern: "{n}", description: "精确匹配n次", example: "a{3} 匹配 aaa" },
      { pattern: "{n,}", description: "匹配至少n次", example: "a{2,} 匹配 aa, aaa" },
      { pattern: "{n,m}", description: "匹配n到m次", example: "a{2,4} 匹配 aa, aaa, aaaa" },
      { pattern: "*?", description: "非贪婪匹配0次或多次", example: "a.*?b 最短匹配" },
      { pattern: "+?", description: "非贪婪匹配1次或多次", example: "a.+?b 最短匹配" },
    ],
  },
  {
    title: "边界",
    items: [
      { pattern: "^", description: "匹配字符串开头", example: "^hello 匹配以hello开头" },
      { pattern: "$", description: "匹配字符串结尾", example: "world$ 匹配以world结尾" },
      { pattern: "\\b", description: "匹配单词边界", example: "\\bword\\b 匹配独立单词" },
      { pattern: "\\B", description: "匹配非单词边界", example: "\\Bword 匹配非开头的word" },
    ],
  },
  {
    title: "分组与引用",
    items: [
      { pattern: "(abc)", description: "捕获组", example: "(\\d+)-(\\d+) 捕获两组数字" },
      { pattern: "(?:abc)", description: "非捕获组", example: "(?:https?://)?" },
      { pattern: "\\1", description: "反向引用第1个捕获组", example: "(\\w+)\\s\\1 匹配重复单词" },
      { pattern: "(?<name>abc)", description: "命名捕获组", example: "(?<year>\\d{4})" },
    ],
  },
  {
    title: "断言",
    items: [
      { pattern: "(?=abc)", description: "正向先行断言", example: "\\d(?=px) 匹配后跟px的数字" },
      { pattern: "(?!abc)", description: "负向先行断言", example: "\\d(?!px) 匹配不跟px的数字" },
      { pattern: "(?<=abc)", description: "正向后行断言", example: "(?<=\\$)\\d+ 匹配$后的数字" },
      { pattern: "(?<!abc)", description: "负向后行断言", example: "(?<!\\$)\\d+ 匹配非$后的数字" },
    ],
  },
  {
    title: "修饰符",
    items: [
      { pattern: "i", description: "忽略大小写", example: "/hello/i 匹配 Hello, HELLO" },
      { pattern: "g", description: "全局匹配", example: "/a/g 匹配所有a" },
      { pattern: "m", description: "多行模式", example: "^在每行开头匹配" },
      { pattern: "s", description: "点号匹配换行", example: ".也匹配\\n" },
    ],
  },
  {
    title: "常用正则表达式",
    items: [
      { pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", description: "邮箱验证" },
      { pattern: "^1[3-9]\\d{9}$", description: "中国手机号" },
      { pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "日期格式 YYYY-MM-DD" },
      { pattern: "^https?://[\\w.-]+(?:/[\\w./-]*)?$", description: "URL验证" },
      { pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$", description: "强密码（至少8位，包含大小写和数字）" },
      { pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$", description: "十六进制颜色" },
      { pattern: "^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$", description: "IPv4地址" },
    ],
  },
];

function PatternCard({ pattern, description, example }: PatternItem) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pattern);
    setCopied(true);
    toast({ title: "已复制", description: pattern });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50 group">
      <div className="flex-1 min-w-0">
        <code className="text-sm font-mono text-primary break-all">{pattern}</code>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        {example && (
          <p className="text-xs text-muted-foreground/70 mt-1 italic">例: {example}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default function RegexReference() {
  return (
    <ToolLayout
      title="正则表达式参考"
      description="正则表达式语法速查手册"
      icon={Regex}
    >
      <div className="space-y-8">
        {regexPatterns.map((section) => (
          <div key={section.title}>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {section.title}
            </h3>
            <div className="grid gap-2">
              {section.items.map((item) => (
                <PatternCard key={item.pattern} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
