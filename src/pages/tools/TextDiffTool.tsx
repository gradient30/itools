import { useState } from "react";
import { GitCompare, Trash2, Upload } from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFileUpload, FileData } from "@/hooks/use-file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DiffLine {
  type: "unchanged" | "added" | "removed";
  text: string;
  lineNum1?: number;
  lineNum2?: number;
}

function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");
  const result: DiffLine[] = [];

  const m = lines1.length;
  const n = lines2.length;

  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = m;
  let j = n;
  const stack: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      stack.push({ type: "unchanged", text: lines1[i - 1], lineNum1: i, lineNum2: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "added", text: lines2[j - 1], lineNum2: j });
      j--;
    } else if (i > 0) {
      stack.push({ type: "removed", text: lines1[i - 1], lineNum1: i });
      i--;
    }
  }

  while (stack.length > 0) {
    result.push(stack.pop()!);
  }

  return result;
}

export default function TextDiffTool() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);
  const [compared, setCompared] = useState(false);

  const compare = () => {
    const diff = computeDiff(text1, text2);
    setDiffResult(diff);
    setCompared(true);
  };

  const clear = () => {
    setText1("");
    setText2("");
    setDiffResult([]);
    setCompared(false);
  };

  const multiUploader = useFileUpload({ multiple: true });
  const leftUploader = useFileUpload({ multiple: false });
  const rightUploader = useFileUpload({ multiple: false });

  const handleMultiFiles = (files: FileData[]) => {
    if (files.length >= 1) {
      setText1(files[0].content);
      setCompared(false);
    }
    if (files.length >= 2) {
      setText2(files[1].content);
      setCompared(false);
    }
  };

  const stats = {
    added: diffResult.filter((d) => d.type === "added").length,
    removed: diffResult.filter((d) => d.type === "removed").length,
    unchanged: diffResult.filter((d) => d.type === "unchanged").length,
  };

  return (
    <ToolLayout
      title="文本比较"
      description="对比两段文本的差异"
      icon={GitCompare}
    >
      <div className="space-y-6">
        <div className="flex justify-end gap-2">
          <input
            type="file"
            multiple
            accept={multiUploader.accept}
            ref={multiUploader.fileInputRef}
            className="hidden"
            onChange={multiUploader.createChangeHandler(handleMultiFiles)}
          />
          <Button variant="outline" onClick={multiUploader.triggerDialog} className="gap-2">
            <Upload className="h-4 w-4" />
            上传本地文件 (支持同时多选)
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            {...leftUploader.createDropHandler((files) => { setText1(files[0].content); setCompared(false); })}
            className="border-2 border-dashed border-transparent hover:border-primary/50 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">原文本</CardTitle>
                <input
                  type="file"
                  accept={leftUploader.accept}
                  ref={leftUploader.fileInputRef}
                  className="hidden"
                  onChange={leftUploader.createChangeHandler((files) => { setText1(files[0].content); setCompared(false); })}
                />
                <Button variant="ghost" size="sm" onClick={leftUploader.triggerDialog} className="h-6 px-2 text-xs">
                  <Upload className="h-3 w-3 mr-1" />浏览
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text1}
                onChange={(e) => {
                  setText1(e.target.value);
                  setCompared(false);
                }}
                placeholder="输入原始文本，或将文件拖拽到此区域..."
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card
            {...rightUploader.createDropHandler((files) => { setText2(files[0].content); setCompared(false); })}
            className="border-2 border-dashed border-transparent hover:border-primary/50 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">新文本</CardTitle>
                <input
                  type="file"
                  accept={rightUploader.accept}
                  ref={rightUploader.fileInputRef}
                  className="hidden"
                  onChange={rightUploader.createChangeHandler((files) => { setText2(files[0].content); setCompared(false); })}
                />
                <Button variant="ghost" size="sm" onClick={rightUploader.triggerDialog} className="h-6 px-2 text-xs">
                  <Upload className="h-3 w-3 mr-1" />浏览
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text2}
                onChange={(e) => {
                  setText2(e.target.value);
                  setCompared(false);
                }}
                placeholder="输入要对比的文本，或将文件拖拽到此区域..."
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={compare} className="gap-2">
            <GitCompare className="h-4 w-4" />
            开始比较
          </Button>
          <Button onClick={clear} variant="outline" className="gap-2">
            <Trash2 className="h-4 w-4" />
            清空
          </Button>
        </div>

        {compared && (
          <div className="flex justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-green-500/20 border border-green-500"></span>
              新增 {stats.added} 行
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-500/20 border border-red-500"></span>
              删除 {stats.removed} 行
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-muted border border-border"></span>
              未变 {stats.unchanged} 行
            </span>
          </div>
        )}

        {compared && (
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 text-sm font-semibold border-b border-border/50">
              比较结果
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {diffResult.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  两段文本相同，无差异
                </div>
              ) : (
                <div className="font-mono text-sm">
                  {diffResult.map((line, index) => (
                    <div
                      key={index}
                      className={`px-4 py-1 flex gap-4 ${line.type === "added"
                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                        : line.type === "removed"
                          ? "bg-red-500/10 text-red-700 dark:text-red-400"
                          : ""
                        }`}
                    >
                      <span className="w-8 text-muted-foreground text-right shrink-0">
                        {line.lineNum1 || ""}
                      </span>
                      <span className="w-8 text-muted-foreground text-right shrink-0">
                        {line.lineNum2 || ""}
                      </span>
                      <span className="w-4 shrink-0">
                        {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap break-all">
                        {line.text || " "}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
          <p>基于行的文本差异比较，使用最长公共子序列(LCS)算法。绿色表示新增行，红色表示删除行。</p>
        </div>
      </div>
    </ToolLayout>
  );
}
