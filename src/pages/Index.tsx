import { useState, useMemo } from "react";
import { Wrench, Zap, Shield, Sparkles } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { history, clearHistory } = useHistory();

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
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo Icon */}
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary tech-glow animate-pulse-glow">
                <Wrench className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              程序员工具箱
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              在线开发者工具集合，包含转换、格式化、生成、加密等实用工具
              <br />
              无需安装，即开即用，助力高效开发
            </p>

            {/* Search Box */}
            <div className="mb-8">
              <SearchBox 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="搜索工具名称或描述..." 
              />
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 metal-border text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span>在线运行</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 metal-border text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>数据安全</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 metal-border text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>完全免费</span>
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
