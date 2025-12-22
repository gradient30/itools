import { useState } from "react";
import { GitCompare, Trash2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

  // Simple line-by-line diff using LCS concept
  const m = lines1.length;
  const n = lines2.length;
  
  // Create LCS table
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

  // Backtrack to find diff
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

  // Reverse to get correct order
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

  const stats = {
    added: diffResult.filter((d) => d.type === "added").length,
    removed: diffResult.filter((d) => d.type === "removed").length,
    unchanged: diffResult.filter((d) => d.type === "unchanged").length,
  };

  return (
    <Layout>
      <ToolLayout
        title="文本比较"
        description="对比两段文本的差异"
        icon={GitCompare}
      >
        <div className="space-y-6">
          {/* Input Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">原文本</Label>
              <Textarea
                value={text1}
                onChange={(e) => {
                  setText1(e.target.value);
                  setCompared(false);
                }}
                placeholder="输入原始文本..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold">新文本</Label>
              <Textarea
                value={text2}
                onChange={(e) => {
                  setText2(e.target.value);
                  setCompared(false);
                }}
                placeholder="输入要对比的文本..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </div>

          {/* Actions */}
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

          {/* Stats */}
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

          {/* Diff Result */}
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
                        className={`px-4 py-1 flex gap-4 ${
                          line.type === "added"
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

          {/* Info */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">
            <p>基于行的文本差异比较，使用最长公共子序列(LCS)算法。绿色表示新增行，红色表示删除行。</p>
          </div>
        </div>
      </ToolLayout>
    </Layout>
  );
}
