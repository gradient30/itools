import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Layers } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { toolCategories } from "@/data/tools";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, navigate]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover-glow rounded-lg px-2 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary tech-glow-sm">
            <Layers className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            万能工具箱
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {toolCategories.map((category) => (
                <NavigationMenuItem key={category.id}>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-secondary/50">
                    <category.icon className="mr-2 h-4 w-4 text-primary" />
                    {category.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {category.tools.map((tool) => (
                        <li key={tool.path}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={tool.path}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                                "hover:bg-secondary hover:text-accent-foreground focus:bg-secondary focus:text-accent-foreground",
                                "metal-border"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <tool.icon className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium leading-none">{tool.name}</span>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {tool.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link 
            to="/about" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            关于
          </Link>
        </div>

        {/* Search & Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="hidden sm:flex relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索工具..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] pl-9 bg-secondary/50 border-border/50 focus:border-primary"
            />
          </form>
          
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="container px-4 py-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索工具..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 bg-secondary/50"
              />
            </form>
            <div className="space-y-4">
              {toolCategories.map((category) => (
                <div key={category.id}>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <category.icon className="h-4 w-4 text-primary" />
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-secondary metal-border"
                      >
                        <tool.icon className="h-4 w-4 text-primary" />
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
