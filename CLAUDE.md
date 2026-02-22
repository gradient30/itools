# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **万能工具箱** (Universal Toolbox) - a React 18 + TypeScript + Vite single-page application providing client-side developer tools. All tools run locally in the browser with no data sent to servers.

The UI is in Chinese and uses shadcn/ui components with Tailwind CSS and a dark-first theme.

## Common Commands

```bash
# Start development server (port 8080)
npm run dev

# Production build (outputs to dist/)
npm run build

# Development build
npm run build:dev

# ESLint check
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Tool Registration System

Tools are defined in two places:

1. **`src/data/tools.ts`** - Tool metadata (name, description, icon, path) organized by category
2. **`src/App.tsx`** - Route definitions mapping paths to components

When adding a new tool:
1. Add the tool to the appropriate category in `src/data/tools.ts`
2. Import and add the route in `src/App.tsx`
3. Create the tool component in `src/pages/tools/` (or `src/pages/docs/` for reference pages)

### Layout System

- **`src/components/layout/Layout.tsx`** - Main layout with Header/Footer
- **`src/components/ToolLayout.tsx`** - Wrapper for tool pages including breadcrumb navigation and history tracking

Tool pages should use `ToolLayout`:

```tsx
import { ToolLayout } from "@/components/ToolLayout";
import { SomeIcon } from "lucide-react";

export default function MyTool() {
  return (
    <ToolLayout
      title="工具名称"
      description="工具描述"
      icon={SomeIcon}
    >
      {/* Tool content */}
    </ToolLayout>
  );
}
```

### UI Components

Uses shadcn/ui components in `src/components/ui/`. Common imports:
- `Button`, `Input`, `Label` - Form elements
- `Card`, `CardContent`, `CardHeader` - Content containers
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` - Tab interfaces
- `Dialog`, `DialogContent` - Modals
- `toast` from `src/hooks/use-toast` - Notifications

### State Management

- **Favorites**: `src/hooks/use-favorites.ts` - Persists to localStorage
- **History**: `src/hooks/use-history.ts` - Recently used tools, persisted to localStorage
- **Theme**: `next-themes` with `ThemeProvider` in App.tsx, default is dark mode

### Announcement System

Configured in `src/data/announcements.ts`:
- Add new announcements to the `announcements` array
- Latest announcement shown first (array order matters)
- Supports types: "new", "fix", "optimize", "remove", "notice"
- Read status tracked in localStorage by announcement ID
- Contact info (QQ, email) configured in `contactConfig`

## Deployment

The app supports multiple deployment targets:

### GitHub Pages
- Set `VITE_BASE_URL` env var to repository name (e.g., `/my-repo/`)
- Workflow: `.github/workflows/deploy-pages.yml`

### Cloudflare Pages
- Set `VITE_BASE_URL=/`
- Requires secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Workflow: `.github/workflows/deploy-cloudflare.yml`

### Docker
- Multi-stage build with Nginx
- `docker-compose up -d` to run locally

## Key Configuration

- **Vite**: `vite.config.ts` - Base URL from `VITE_BASE_URL` env var
- **TypeScript**: Relaxed settings (`noImplicitAny: false`, `strictNullChecks: false`)
- **Path alias**: `@/` maps to `./src/`
- **Tailwind**: `tailwind.config.ts` with custom CSS variables for theming

## Adding a New Tool - Checklist

1. Create component in `src/pages/tools/MyTool.tsx`
2. Add tool to `src/data/tools.ts` in appropriate category
3. Add route in `src/App.tsx`
4. Use `ToolLayout` wrapper for consistent UI
5. Import icons from `lucide-react`
6. Use `useToast()` for copy/success notifications
7. Keep processing client-side (no API calls for data processing)
