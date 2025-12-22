import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompare, ArrowRight, Plus, Minus, Equal } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DiffResult {
  type: "added" | "removed" | "unchanged";
  path: string;
  oldValue?: unknown;
  newValue?: unknown;
}

const JsonDiffTool = () => {
  const [leftJson, setLeftJson] = useState("");
  const [rightJson, setRightJson] = useState("");
  const [diffResults, setDiffResults] = useState<DiffResult[]>([]);

  const compareObjects = (
    obj1: unknown,
    obj2: unknown,
    path: string = ""
  ): DiffResult[] => {
    const results: DiffResult[] = [];

    if (typeof obj1 !== typeof obj2) {
      results.push({ type: "removed", path: path || "root", oldValue: obj1 });
      results.push({ type: "added", path: path || "root", newValue: obj2 });
      return results;
    }

    if (obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        if (obj1 !== null)
          results.push({ type: "removed", path: path || "root", oldValue: obj1 });
        if (obj2 !== null)
          results.push({ type: "added", path: path || "root", newValue: obj2 });
      } else {
        results.push({ type: "unchanged", path: path || "root", oldValue: obj1 });
      }
      return results;
    }

    if (typeof obj1 !== "object") {
      if (obj1 !== obj2) {
        results.push({ type: "removed", path: path || "root", oldValue: obj1 });
        results.push({ type: "added", path: path || "root", newValue: obj2 });
      } else {
        results.push({ type: "unchanged", path: path || "root", oldValue: obj1 });
      }
      return results;
    }

    const o1 = obj1 as Record<string, unknown>;
    const o2 = obj2 as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(o1), ...Object.keys(o2)]);

    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;
      if (!(key in o1)) {
        results.push({ type: "added", path: newPath, newValue: o2[key] });
      } else if (!(key in o2)) {
        results.push({ type: "removed", path: newPath, oldValue: o1[key] });
      } else {
        results.push(...compareObjects(o1[key], o2[key], newPath));
      }
    }

    return results;
  };

  const handleCompare = () => {
    if (!leftJson.trim() || !rightJson.trim()) {
      toast({
        title: "错误",
        description: "请输入两个JSON进行对比",
        variant: "destructive",
      });
      return;
    }

    try {
      const left = JSON.parse(leftJson);
      const right = JSON.parse(rightJson);
      const results = compareObjects(left, right);
      setDiffResults(results);
      toast({
        title: "对比完成",
        description: `发现 ${results.filter((r) => r.type !== "unchanged").length} 处差异`,
      });
    } catch {
      toast({
        title: "JSON解析错误",
        description: "请确保两个输入都是有效的JSON",
        variant: "destructive",
      });
    }
  };

  const formatValue = (value: unknown): string => {
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <ToolLayout
      title="JSON Diff对比"
      description="对比两个JSON对象的差异"
      icon={GitCompare}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">原始JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="输入第一个JSON..."
                value={leftJson}
                onChange={(e) => setLeftJson(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">对比JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="输入第二个JSON..."
                value={rightJson}
                onChange={(e) => setRightJson(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleCompare} size="lg">
            <ArrowRight className="mr-2 h-4 w-4" />
            开始对比
          </Button>
        </div>

        {diffResults.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">对比结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {diffResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md font-mono text-sm ${
                      result.type === "added"
                        ? "bg-green-500/10 border border-green-500/20"
                        : result.type === "removed"
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {result.type === "added" && (
                        <Plus className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      )}
                      {result.type === "removed" && (
                        <Minus className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      )}
                      {result.type === "unchanged" && (
                        <Equal className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold">{result.path}:</span>
                        <span className="ml-2 break-all">
                          {result.type === "removed" || result.type === "unchanged"
                            ? formatValue(result.oldValue)
                            : formatValue(result.newValue)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default JsonDiffTool;
