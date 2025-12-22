import { ToolLayout } from "@/components/ToolLayout";
import { GitBranch, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface CommandItem {
  command: string;
  description: string;
}

interface CommandSection {
  title: string;
  commands: CommandItem[];
}

const gitCommands: CommandSection[] = [
  {
    title: "仓库初始化",
    commands: [
      { command: "git init", description: "初始化新仓库" },
      { command: "git clone <url>", description: "克隆远程仓库" },
      { command: "git clone --depth 1 <url>", description: "浅克隆（只获取最近一次提交）" },
    ],
  },
  {
    title: "基本操作",
    commands: [
      { command: "git status", description: "查看工作区状态" },
      { command: "git add <file>", description: "添加文件到暂存区" },
      { command: "git add .", description: "添加所有更改到暂存区" },
      { command: "git commit -m '<message>'", description: "提交更改" },
      { command: "git commit --amend", description: "修改最近一次提交" },
    ],
  },
  {
    title: "分支操作",
    commands: [
      { command: "git branch", description: "查看本地分支" },
      { command: "git branch -a", description: "查看所有分支（包括远程）" },
      { command: "git branch <name>", description: "创建新分支" },
      { command: "git checkout <branch>", description: "切换分支" },
      { command: "git checkout -b <branch>", description: "创建并切换分支" },
      { command: "git branch -d <branch>", description: "删除本地分支" },
      { command: "git merge <branch>", description: "合并分支" },
      { command: "git rebase <branch>", description: "变基操作" },
    ],
  },
  {
    title: "远程操作",
    commands: [
      { command: "git remote -v", description: "查看远程仓库" },
      { command: "git remote add origin <url>", description: "添加远程仓库" },
      { command: "git fetch", description: "获取远程更新" },
      { command: "git pull", description: "拉取并合并远程更改" },
      { command: "git push", description: "推送到远程" },
      { command: "git push -u origin <branch>", description: "推送并设置上游分支" },
      { command: "git push --force", description: "强制推送（谨慎使用）" },
    ],
  },
  {
    title: "查看历史",
    commands: [
      { command: "git log", description: "查看提交历史" },
      { command: "git log --oneline", description: "简洁历史视图" },
      { command: "git log --graph", description: "图形化显示分支历史" },
      { command: "git diff", description: "查看未暂存的更改" },
      { command: "git diff --staged", description: "查看已暂存的更改" },
      { command: "git show <commit>", description: "查看某次提交的详情" },
    ],
  },
  {
    title: "撤销操作",
    commands: [
      { command: "git checkout -- <file>", description: "撤销工作区文件修改" },
      { command: "git reset HEAD <file>", description: "取消暂存" },
      { command: "git reset --soft HEAD^", description: "撤销提交，保留更改在暂存区" },
      { command: "git reset --hard HEAD^", description: "撤销提交，丢弃所有更改" },
      { command: "git revert <commit>", description: "创建新提交来撤销指定提交" },
    ],
  },
  {
    title: "暂存操作",
    commands: [
      { command: "git stash", description: "暂存当前更改" },
      { command: "git stash list", description: "查看暂存列表" },
      { command: "git stash pop", description: "恢复并删除最近暂存" },
      { command: "git stash apply", description: "恢复最近暂存（不删除）" },
      { command: "git stash drop", description: "删除最近暂存" },
    ],
  },
  {
    title: "标签操作",
    commands: [
      { command: "git tag", description: "查看标签" },
      { command: "git tag <name>", description: "创建轻量标签" },
      { command: "git tag -a <name> -m '<message>'", description: "创建附注标签" },
      { command: "git push origin <tag>", description: "推送标签到远程" },
      { command: "git push origin --tags", description: "推送所有标签" },
    ],
  },
];

function CommandCard({ command, description }: CommandItem) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    toast({ title: "已复制", description: command });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50 group">
      <div className="flex-1 min-w-0">
        <code className="text-sm font-mono text-primary break-all">{command}</code>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default function GitReference() {
  return (
    <ToolLayout
      title="Git命令速查"
      description="常用Git命令参考手册"
      icon={GitBranch}
    >
      <div className="space-y-8">
        {gitCommands.map((section) => (
          <div key={section.title}>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {section.title}
            </h3>
            <div className="grid gap-2">
              {section.commands.map((cmd) => (
                <CommandCard key={cmd.command} {...cmd} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
