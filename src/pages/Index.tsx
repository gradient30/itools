import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layers, Zap, Shield, Sparkles, Megaphone, Calendar, User, FileText, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CategorySection } from "@/components/CategorySection";
import { SearchBox } from "@/components/SearchBox";
import { ToolCard } from "@/components/ToolCard";
import { FavoritesSection } from "@/components/FavoritesSection";
import { HistorySection } from "@/components/HistorySection";
import { toolCategories, allTools } from "@/data/tools";
import { useFavorites } from "@/hooks/use-favorites";
import { useHistory } from "@/hooks/use-history";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const AnnouncementDialog = () => {
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 animate-fade-in"
        >
          <Megaphone className="h-4 w-4 text-primary" />
          <span className="text-sm">系统公告</span>
          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">New</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Megaphone className="h-5 w-5 text-primary" />
            系统公告
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 公告元信息 */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>发布人：系统</span>
            </div>
          </div>
          
          <Separator />
          
          {/* 公告正文 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground">更新内容</h4>
            </div>
            
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <Badge variant="default" className="mt-0.5 shrink-0">新增</Badge>
                <div>
                  <p className="font-medium text-foreground">文档参考 - 安全测试参考</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    新增安全测试参考文档，包含 OWASP Top 10 详细攻击示例、漏洞代码与安全代码对比、测试 Payload、安全响应头配置、安全工具集合及检查清单等内容。
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* 底部提示 */}
          <p className="text-xs text-muted-foreground text-center">
            感谢使用万能工具箱，如有问题或建议请反馈
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { history, clearHistory } = useHistory();

  // Sync search query from URL params
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  // Filter categories that have tools
  const categoriesWithTools = toolCategories.filter((cat) => cat.tools.length > 0);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase();
    return allTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const hasSearchResults = filteredTools !== null;
  const noResults = hasSearchResults && filteredTools.length === 0;

  return (
    <Layout>
      {/* Hero Section - Compact */}
      <section className="relative py-8 md:py-12 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="container px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Compact Header with Icon */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Layers className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                万能工具箱
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-muted-foreground mb-5 max-w-xl mx-auto">
              在线开发者工具集合，包含转换、格式化、生成、加密等实用工具
            </p>

            {/* Search Box */}
            <div className="mb-4 max-w-lg mx-auto">
              <SearchBox 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="搜索工具名称或描述..." 
              />
            </div>

            {/* Feature Pills - Inline with Announcement */}
            <div className="flex flex-wrap justify-center gap-2 items-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 border border-border/50 text-xs">
                <Zap className="h-3 w-3 text-primary" />
                <span>本地运行</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 border border-border/50 text-xs">
                <Shield className="h-3 w-3 text-primary" />
                <span>数据安全</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 border border-border/50 text-xs">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>内部专用</span>
              </div>
              <AnnouncementDialog />
            </div>
          </div>
        </div>
      </section>

      {/* Search Results or Tools Categories */}
      <section className="pb-16">
        <div className="container px-4 space-y-12">
          {hasSearchResults ? (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  搜索结果
                </h2>
                <span className="text-muted-foreground">
                  ({filteredTools.length} 个工具)
                </span>
              </div>
              {noResults ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    没有找到匹配的工具，请尝试其他关键词
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredTools.map((tool) => (
                    <ToolCard
                      key={tool.path}
                      name={tool.name}
                      description={tool.description}
                      icon={tool.icon}
                      path={tool.path}
                      searchQuery={searchQuery}
                      isFavorite={isFavorite(tool.path)}
                      onToggleFavorite={() => toggleFavorite(tool.path)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* History Section */}
              <HistorySection 
                history={history}
                onClearHistory={clearHistory}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />

              {/* Favorites Section */}
              <FavoritesSection 
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
              
              {/* All Categories */}
              {categoriesWithTools.map((category) => (
                <CategorySection
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  description={category.description}
                  icon={category.icon}
                  tools={category.tools}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
