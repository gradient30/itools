import { LucideIcon } from "lucide-react";
import { ToolCard } from "./ToolCard";

interface Tool {
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

interface CategorySectionProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tools: Tool[];
  searchQuery?: string;
  isFavorite?: (path: string) => boolean;
  onToggleFavorite?: (path: string) => void;
}

export function CategorySection({ 
  id, 
  name, 
  description, 
  icon: Icon, 
  tools, 
  searchQuery = "",
  isFavorite,
  onToggleFavorite
}: CategorySectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary tech-glow-sm">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{name}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool.path}
            name={tool.name}
            description={tool.description}
            icon={tool.icon}
            path={tool.path}
            searchQuery={searchQuery}
            isFavorite={isFavorite?.(tool.path)}
            onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(tool.path) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
