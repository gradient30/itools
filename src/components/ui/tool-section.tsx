import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolSectionProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "accent" | "glass";
}

export function ToolSection({
  title,
  description,
  icon: Icon,
  children,
  className,
  variant = "default",
}: ToolSectionProps) {
  const variantStyles = {
    default: "bg-card/60 border-border/50",
    muted: "bg-muted/30 border-border/30",
    accent: "bg-primary/5 border-primary/20",
    glass: "bg-background/40 backdrop-blur-md border-border/40",
  };

  return (
    <section
      className={cn(
        "rounded-xl border p-5 transition-all duration-200",
        variantStyles[variant],
        className
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon className="h-4 w-4 text-primary" />}
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

interface ToolGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ToolGrid({ children, cols = 2, className }: ToolGridProps) {
  const colStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", colStyles[cols], className)}>
      {children}
    </div>
  );
}

interface ResultDisplayProps {
  label: string;
  value: string;
  subLabel?: string;
  onCopy?: () => void;
  className?: string;
  mono?: boolean;
}

export function ResultDisplay({
  label,
  value,
  subLabel,
  onCopy,
  className,
  mono = true,
}: ResultDisplayProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {subLabel && (
          <span className="text-xs text-muted-foreground">{subLabel}</span>
        )}
      </div>
      <div
        className={cn(
          "relative group rounded-lg border border-border/50 bg-muted/20 p-3 transition-colors",
          "hover:border-border hover:bg-muted/30"
        )}
      >
        <div
          className={cn(
            "text-sm break-all leading-relaxed text-foreground/90",
            mono && "font-mono"
          )}
        >
          {value}
        </div>
        {onCopy && (
          <button
            onClick={onCopy}
            className={cn(
              "absolute top-2 right-2 p-1.5 rounded-md",
              "bg-background/80 border border-border/50",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

interface ActionBarProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right" | "between";
}

export function ActionBar({ children, className, align = "center" }: ActionBarProps) {
  const alignStyles = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 py-4",
        alignStyles[align],
        className
      )}
    >
      {children}
    </div>
  );
}

interface InfoBoxProps {
  children: React.ReactNode;
  variant?: "info" | "warning" | "success" | "tip";
  className?: string;
}

export function InfoBox({ children, variant = "info", className }: InfoBoxProps) {
  const variantStyles = {
    info: "bg-muted/40 border-border/50 text-muted-foreground",
    warning: "bg-destructive/5 border-destructive/20 text-destructive/80",
    success: "bg-primary/5 border-primary/20 text-primary/80",
    tip: "bg-accent/10 border-accent/20 text-foreground/80",
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-sm leading-relaxed",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
