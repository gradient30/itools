import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  className?: string;
}

export function ToolCard({ name, description, icon: Icon, path, className }: ToolCardProps) {
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
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      </div>
    </Link>
  );
}
