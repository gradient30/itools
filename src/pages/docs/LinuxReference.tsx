import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Terminal, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CommandItem {
  command: string;
  description: string;
}

interface CommandSection {
  title: string;
  commands: CommandItem[];
}

const linuxCommands: CommandSection[] = [
  {
    title: "文件与目录操作",
    commands: [
      { command: "ls -la", description: "列出所有文件（包括隐藏文件）详细信息" },
      { command: "cd /path/to/dir", description: "切换目录" },
      { command: "pwd", description: "显示当前工作目录" },
      { command: "mkdir -p dir1/dir2", description: "递归创建目录" },
      { command: "rm -rf dir", description: "强制递归删除目录" },
      { command: "cp -r source dest", description: "递归复制文件/目录" },
      { command: "mv source dest", description: "移动或重命名文件" },
      { command: "touch filename", description: "创建空文件或更新时间戳" },
      { command: "ln -s target link", description: "创建符号链接" },
      { command: "find /path -name 'pattern'", description: "查找文件" },
    ]
  },
  {
    title: "文件查看与编辑",
    commands: [
      { command: "cat filename", description: "显示文件内容" },
      { command: "less filename", description: "分页查看文件" },
      { command: "head -n 10 filename", description: "显示文件前10行" },
      { command: "tail -f filename", description: "实时追踪文件末尾" },
      { command: "grep 'pattern' filename", description: "在文件中搜索模式" },
      { command: "grep -r 'pattern' dir/", description: "递归搜索目录" },
      { command: "sed -i 's/old/new/g' file", description: "替换文件中的文本" },
      { command: "awk '{print $1}' filename", description: "打印第一列" },
      { command: "wc -l filename", description: "统计文件行数" },
      { command: "diff file1 file2", description: "比较两个文件差异" },
    ]
  },
  {
    title: "权限管理",
    commands: [
      { command: "chmod 755 filename", description: "设置文件权限" },
      { command: "chmod +x script.sh", description: "添加执行权限" },
      { command: "chown user:group filename", description: "更改文件所有者" },
      { command: "chown -R user:group dir/", description: "递归更改目录所有者" },
      { command: "sudo command", description: "以管理员权限执行命令" },
      { command: "su - username", description: "切换用户" },
    ]
  },
  {
    title: "进程管理",
    commands: [
      { command: "ps aux", description: "显示所有进程" },
      { command: "ps aux | grep process", description: "查找特定进程" },
      { command: "top", description: "实时显示进程信息" },
      { command: "htop", description: "交互式进程查看器" },
      { command: "kill PID", description: "终止进程" },
      { command: "kill -9 PID", description: "强制终止进程" },
      { command: "killall process_name", description: "终止所有同名进程" },
      { command: "nohup command &", description: "后台运行命令" },
      { command: "jobs", description: "显示后台任务" },
      { command: "fg %1", description: "将后台任务调到前台" },
    ]
  },
  {
    title: "网络命令",
    commands: [
      { command: "ping hostname", description: "测试网络连通性" },
      { command: "curl -I url", description: "获取HTTP头信息" },
      { command: "wget url", description: "下载文件" },
      { command: "netstat -tulpn", description: "显示网络连接和端口" },
      { command: "ss -tulpn", description: "显示socket统计信息" },
      { command: "ifconfig", description: "显示网络接口配置" },
      { command: "ip addr", description: "显示IP地址" },
      { command: "ssh user@host", description: "SSH远程连接" },
      { command: "scp file user@host:/path", description: "安全复制文件到远程" },
      { command: "rsync -avz src dest", description: "同步文件" },
    ]
  },
  {
    title: "系统信息",
    commands: [
      { command: "uname -a", description: "显示系统信息" },
      { command: "df -h", description: "显示磁盘使用情况" },
      { command: "du -sh dir/", description: "显示目录大小" },
      { command: "free -h", description: "显示内存使用情况" },
      { command: "uptime", description: "显示系统运行时间" },
      { command: "whoami", description: "显示当前用户" },
      { command: "date", description: "显示当前日期时间" },
      { command: "cal", description: "显示日历" },
      { command: "history", description: "显示命令历史" },
      { command: "which command", description: "显示命令路径" },
    ]
  },
  {
    title: "压缩与解压",
    commands: [
      { command: "tar -czvf archive.tar.gz dir/", description: "创建gzip压缩包" },
      { command: "tar -xzvf archive.tar.gz", description: "解压gzip压缩包" },
      { command: "tar -cjvf archive.tar.bz2 dir/", description: "创建bzip2压缩包" },
      { command: "zip -r archive.zip dir/", description: "创建zip压缩包" },
      { command: "unzip archive.zip", description: "解压zip文件" },
      { command: "gzip filename", description: "压缩文件" },
      { command: "gunzip filename.gz", description: "解压gzip文件" },
    ]
  },
  {
    title: "包管理 (Debian/Ubuntu)",
    commands: [
      { command: "apt update", description: "更新包列表" },
      { command: "apt upgrade", description: "升级所有包" },
      { command: "apt install package", description: "安装包" },
      { command: "apt remove package", description: "卸载包" },
      { command: "apt search keyword", description: "搜索包" },
      { command: "dpkg -i package.deb", description: "安装deb包" },
    ]
  },
];

function CommandCard({ command, description }: CommandItem) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
      <div className="flex-1 min-w-0">
        <code className="text-sm font-mono text-primary break-all">{command}</code>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <button
        onClick={handleCopy}
        className="ml-3 p-2 rounded-md hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

export default function LinuxReference() {
  return (
    <ToolLayout
      title="Linux 常用命令"
      description="Linux 系统操作命令速查表"
      icon={Terminal}
    >
      <div className="space-y-8">
        {linuxCommands.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-foreground mb-4">{section.title}</h2>
            <div className="space-y-2">
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
