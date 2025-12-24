import { useState, useMemo } from "react";
import { BarChart3, Copy } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  sentences: number;
  chineseChars: number;
  englishWords: number;
  numbers: number;
  punctuation: number;
  bytes: number;
}

function analyzeText(text: string): TextStats {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      paragraphs: 0,
      sentences: 0,
      chineseChars: 0,
      englishWords: 0,
      numbers: 0,
      punctuation: 0,
      bytes: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  
  // Words: split by whitespace, filter empty
  const words = text.split(/\s+/).filter(Boolean).length;
  
  // Lines
  const lines = text.split("\n").length;
  
  // Paragraphs: groups of text separated by empty lines
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);
  
  // Sentences: count ., !, ? followed by space or end
  const sentences = (text.match(/[.!?。！？]+/g) || []).length;
  
  // Chinese characters
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  // English words
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  
  // Numbers
  const numbers = (text.match(/\d+/g) || []).length;
  
  // Punctuation
  const punctuation = (text.match(/[.,;:!?'"()[\]{}，。；：！？""''（）【】]/g) || []).length;
  
  // Bytes (UTF-8)
  const bytes = new TextEncoder().encode(text).length;

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    sentences,
    chineseChars,
    englishWords,
    numbers,
    punctuation,
    bytes,
  };
}

export default function TextStatsTool() {
  const { toast } = useToast();
  const [text, setText] = useState("");

  const stats = useMemo(() => analyzeText(text), [text]);

  const copyStats = () => {
    const statsText = `
字符总数: ${stats.characters}
字符(不含空格): ${stats.charactersNoSpaces}
单词数: ${stats.words}
行数: ${stats.lines}
段落数: ${stats.paragraphs}
句子数: ${stats.sentences}
中文字符: ${stats.chineseChars}
英文单词: ${stats.englishWords}
数字: ${stats.numbers}
标点符号: ${stats.punctuation}
字节数(UTF-8): ${stats.bytes}
    `.trim();
    navigator.clipboard.writeText(statsText);
    toast({ title: "已复制", description: "统计结果已复制到剪贴板" });
  };

  const statItems = [
    { label: "字符总数", value: stats.characters, color: "text-primary" },
    { label: "字符(不含空格)", value: stats.charactersNoSpaces, color: "text-primary" },
    { label: "单词数", value: stats.words, color: "text-green-500" },
    { label: "行数", value: stats.lines, color: "text-blue-500" },
    { label: "段落数", value: stats.paragraphs, color: "text-purple-500" },
    { label: "句子数", value: stats.sentences, color: "text-orange-500" },
    { label: "中文字符", value: stats.chineseChars, color: "text-red-500" },
    { label: "英文单词", value: stats.englishWords, color: "text-cyan-500" },
    { label: "数字", value: stats.numbers, color: "text-yellow-500" },
    { label: "标点符号", value: stats.punctuation, color: "text-pink-500" },
    { label: "字节数(UTF-8)", value: stats.bytes, color: "text-muted-foreground" },
  ];

  // Reading time estimation (assuming 200 Chinese chars/min or 250 English words/min)
  const readingTimeMinutes = Math.ceil((stats.chineseChars / 200) + (stats.englishWords / 250));

  return (
    <ToolLayout
      title="文本统计"
      description="统计文本字符、单词、行数等信息"
      icon={BarChart3}
    >
        <div className="space-y-6">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">输入文本</Label>
              <Button variant="ghost" size="sm" onClick={copyStats} disabled={!text}>
                <Copy className="h-4 w-4 mr-1" />
                复制统计结果
              </Button>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="在此输入或粘贴文本，实时统计字符、单词、行数等信息..."
              className="min-h-[200px] font-mono"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
              <div className="text-3xl font-bold text-primary">{stats.characters}</div>
              <div className="text-sm text-muted-foreground">字符</div>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
              <div className="text-3xl font-bold text-green-500">{stats.words}</div>
              <div className="text-sm text-muted-foreground">单词</div>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
              <div className="text-3xl font-bold text-blue-500">{stats.lines}</div>
              <div className="text-sm text-muted-foreground">行数</div>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
              <div className="text-3xl font-bold text-purple-500">{readingTimeMinutes}</div>
              <div className="text-sm text-muted-foreground">阅读时间(分钟)</div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <Label className="text-sm font-semibold mb-4 block">详细统计</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {statItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`font-semibold ${item.color}`}>{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Character Frequency (Top 10) */}
          {text && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <Label className="text-sm font-semibold mb-3 block">字符频率 (前10)</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  text
                    .replace(/\s/g, "")
                    .split("")
                    .reduce((acc, char) => {
                      acc[char] = (acc[char] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([char, count]) => (
                    <div
                      key={char}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-sm"
                    >
                      <span className="font-mono text-primary">{char}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
      </div>
    </ToolLayout>
  );
}
