import { Star } from "lucide-react";
import { ToolCard } from "./ToolCard";
import { allTools } from "@/data/tools";

interface FavoritesSectionProps {
  favorites: string[];
  onToggleFavorite: (path: string) => void;
  isFavorite: (path: string) => boolean;
}

export function FavoritesSection({ favorites, onToggleFavorite, isFavorite }: FavoritesSectionProps) {
  const favoriteTools = allTools.filter((tool) => favorites.includes(tool.path));

  if (favoriteTools.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20 border border-yellow-500/30">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">我的收藏</h2>
          <p className="text-sm text-muted-foreground">
            {favoriteTools.length} 个常用工具
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favoriteTools.map((tool) => (
          <ToolCard
            key={tool.path}
            name={tool.name}
            description={tool.description}
            icon={tool.icon}
            path={tool.path}
            isFavorite={isFavorite(tool.path)}
            onToggleFavorite={() => onToggleFavorite(tool.path)}
          />
        ))}
      </div>
    </div>
  );
}
