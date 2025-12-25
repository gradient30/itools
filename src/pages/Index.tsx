import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layers, Zap, Shield, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CategorySection } from "@/components/CategorySection";
import { SearchBox } from "@/components/SearchBox";
import { ToolCard } from "@/components/ToolCard";
import { FavoritesSection } from "@/components/FavoritesSection";
import { HistorySection } from "@/components/HistorySection";
import { toolCategories, allTools } from "@/data/tools";
import { useFavorites } from "@/hooks/use-favorites";
import { useHistory } from "@/hooks/use-history";

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

            {/* Feature Pills - Inline */}
            <div className="flex flex-wrap justify-center gap-2">
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
