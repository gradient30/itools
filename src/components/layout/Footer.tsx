import { Wrench, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Description */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Wrench className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="font-semibold text-foreground">万能工具箱</span>
              <p className="text-xs text-muted-foreground">在线开发者工具集合</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              首页
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              关于
            </Link>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-destructive fill-destructive" />
            <span>© {new Date().getFullYear()} 万能工具箱</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
