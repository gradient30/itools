import { useEffect, useMemo } from "react";
import { Home, LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "@/hooks/use-history";
import { toolCategories } from "@/data/tools";
import { Layout } from "@/components/layout/Layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
      <div className="container px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  首页
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="text-muted-foreground">{category.name}</span>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
    </Layout>
  );
}
