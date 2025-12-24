import { useEffect, useMemo } from "react";
import { Home, LucideIcon, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "@/hooks/use-history";
import { toolCategories } from "@/data/tools";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

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

  // 根据当前路径找到对应的分类
  const category = useMemo(() => {
    return toolCategories.find((cat) =>
      cat.tools.some((tool) => tool.path === location.pathname)
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Subtle Background Pattern */}
        <div className="fixed inset-0 -z-10 tech-grid opacity-30" />
        
        <div className="container max-w-5xl px-4 py-6 lg:py-8">
          {/* Breadcrumb Navigation - Simplified */}
          <nav className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>首页</span>
                </Link>
              </li>
              {category && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  <li>
                    <span className="text-muted-foreground">{category.name}</span>
                  </li>
                </>
              )}
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              <li>
                <span className="text-foreground font-medium">{title}</span>
              </li>
            </ol>
          </nav>

          {/* Tool Header - Enhanced */}
          <header className="mb-8">
            <div className="flex items-start gap-4">
              <div 
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  "bg-gradient-to-br from-primary to-primary/80",
                  "shadow-lg shadow-primary/20"
                )}
              >
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-foreground tracking-tight lg:text-2xl">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed lg:text-base">
                  {description}
                </p>
              </div>
            </div>
          </header>

          {/* Tool Content - Clean Container */}
          <main 
            className={cn(
              "rounded-2xl border bg-card/70 backdrop-blur-sm",
              "border-border/50 shadow-sm",
              "p-5 lg:p-6"
            )}
          >
            <div className="space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
