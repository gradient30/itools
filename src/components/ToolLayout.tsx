import { useEffect } from "react";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/hooks/use-history";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, icon: Icon, children }: ToolLayoutProps) {
  const location = useLocation();
  const { addToHistory } = useHistory();

  useEffect(() => {
    addToHistory(location.pathname);
  }, [location.pathname, addToHistory]);

  return (
    <div className="container px-4 py-8">
      {/* Back Button */}
      <Link to="/">
        <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Button>
      </Link>

      {/* Tool Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary tech-glow">
          <Icon className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Tool Content */}
      <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 metal-border">
        {children}
      </div>
    </div>
  );
}
