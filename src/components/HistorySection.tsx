import { History, Trash2 } from "lucide-react";
import { ToolCard } from "./ToolCard";
import { Button } from "./ui/button";
import { allTools } from "@/data/tools";
import type { HistoryItem } from "@/hooks/use-history";

interface HistorySectionProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  isFavorite: (path: string) => boolean;
  onToggleFavorite: (path: string) => void;
}

export function HistorySection({ 
  history, 
  onClearHistory, 
  isFavorite, 
  onToggleFavorite 
}: HistorySectionProps) {
  const historyTools = history
    .map((item) => allTools.find((tool) => tool.path === item.path))
    .filter(Boolean);

  if (historyTools.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
            <History className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">最近使用</h2>
            <p className="text-sm text-muted-foreground">
              {historyTools.length} 个最近使用的工具
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearHistory}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          清除历史
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {historyTools.map((tool) => (
          <ToolCard
            key={tool!.path}
            name={tool!.name}
            description={tool!.description}
            icon={tool!.icon}
            path={tool!.path}
            isFavorite={isFavorite(tool!.path)}
            onToggleFavorite={() => onToggleFavorite(tool!.path)}
          />
        ))}
      </div>
    </div>
  );
}
