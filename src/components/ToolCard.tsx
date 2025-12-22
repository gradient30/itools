import { Link } from "react-router-dom";
import { LucideIcon, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { HighlightText } from "./HighlightText";

interface ToolCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  className?: string;
  searchQuery?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ToolCard({ 
  name, 
  description, 
  icon: Icon, 
  path, 
  className, 
  searchQuery = "",
  isFavorite = false,
  onToggleFavorite
}: ToolCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.();
  };

  return (
    <Link
      to={path}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl p-5",
        "bg-card/80 backdrop-blur-sm",
        "border border-border/50",
        "hover-glow transition-all duration-300",
        "hover:border-primary/50 hover:bg-card",
        "metal-border brushed-metal",
        className
      )}
    >
      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-3 right-3 p-1.5 rounded-md transition-all duration-200",
            "hover:bg-muted/50",
            isFavorite 
              ? "text-yellow-500" 
              : "text-muted-foreground/50 hover:text-muted-foreground"
          )}
          aria-label={isFavorite ? "取消收藏" : "添加收藏"}
        >
          <Star 
            className={cn("h-4 w-4", isFavorite && "fill-yellow-500")} 
          />
        </button>
      )}

      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          <HighlightText text={name} highlight={searchQuery} />
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          <HighlightText text={description} highlight={searchQuery} />
        </p>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      </div>
    </Link>
  );
}
