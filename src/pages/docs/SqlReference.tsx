import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Database, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CommandItem {
  command: string;
  description: string;
}

interface CommandSection {
  title: string;
  commands: CommandItem[];
}

const sqlCommands: CommandSection[] = [
  {
    title: "基础查询",
    commands: [
      { command: "SELECT * FROM table_name", description: "查询表中所有数据" },
      { command: "SELECT col1, col2 FROM table_name", description: "查询指定列" },
      { command: "SELECT DISTINCT column FROM table_name", description: "查询不重复的值" },
      { command: "SELECT * FROM table_name WHERE condition", description: "条件查询" },
      { command: "SELECT * FROM table_name ORDER BY column ASC|DESC", description: "排序查询" },
      { command: "SELECT * FROM table_name LIMIT n OFFSET m", description: "分页查询" },
    ]
  },
  {
    title: "数据操作",
    commands: [
      { command: "INSERT INTO table_name (col1, col2) VALUES (val1, val2)", description: "插入数据" },
      { command: "UPDATE table_name SET col1 = val1 WHERE condition", description: "更新数据" },
      { command: "DELETE FROM table_name WHERE condition", description: "删除数据" },
      { command: "TRUNCATE TABLE table_name", description: "清空表数据" },
    ]
  },
  {
    title: "表操作",
    commands: [
      { command: "CREATE TABLE table_name (col1 TYPE, col2 TYPE)", description: "创建表" },
      { command: "DROP TABLE table_name", description: "删除表" },
      { command: "ALTER TABLE table_name ADD column TYPE", description: "添加列" },
      { command: "ALTER TABLE table_name DROP COLUMN column", description: "删除列" },
      { command: "ALTER TABLE table_name RENAME TO new_name", description: "重命名表" },
    ]
  },
  {
    title: "JOIN 连接",
    commands: [
      { command: "SELECT * FROM t1 INNER JOIN t2 ON t1.id = t2.id", description: "内连接" },
      { command: "SELECT * FROM t1 LEFT JOIN t2 ON t1.id = t2.id", description: "左连接" },
      { command: "SELECT * FROM t1 RIGHT JOIN t2 ON t1.id = t2.id", description: "右连接" },
      { command: "SELECT * FROM t1 FULL OUTER JOIN t2 ON t1.id = t2.id", description: "全外连接" },
      { command: "SELECT * FROM t1 CROSS JOIN t2", description: "交叉连接" },
    ]
  },
  {
    title: "聚合函数",
    commands: [
      { command: "SELECT COUNT(*) FROM table_name", description: "统计行数" },
      { command: "SELECT SUM(column) FROM table_name", description: "求和" },
      { command: "SELECT AVG(column) FROM table_name", description: "求平均值" },
      { command: "SELECT MAX(column) FROM table_name", description: "求最大值" },
      { command: "SELECT MIN(column) FROM table_name", description: "求最小值" },
      { command: "SELECT column, COUNT(*) FROM table_name GROUP BY column", description: "分组统计" },
      { command: "SELECT column, COUNT(*) FROM t GROUP BY column HAVING COUNT(*) > n", description: "分组过滤" },
    ]
  },
  {
    title: "子查询与条件",
    commands: [
      { command: "SELECT * FROM t WHERE col IN (SELECT col FROM t2)", description: "IN 子查询" },
      { command: "SELECT * FROM t WHERE EXISTS (SELECT 1 FROM t2 WHERE ...)", description: "EXISTS 子查询" },
      { command: "SELECT * FROM t WHERE col BETWEEN val1 AND val2", description: "范围查询" },
      { command: "SELECT * FROM t WHERE col LIKE '%pattern%'", description: "模糊匹配" },
      { command: "SELECT * FROM t WHERE col IS NULL", description: "空值判断" },
      { command: "SELECT * FROM t WHERE col IN (val1, val2, val3)", description: "IN 列表" },
    ]
  },
  {
    title: "索引操作",
    commands: [
      { command: "CREATE INDEX idx_name ON table_name (column)", description: "创建索引" },
      { command: "CREATE UNIQUE INDEX idx_name ON table_name (column)", description: "创建唯一索引" },
      { command: "DROP INDEX idx_name", description: "删除索引" },
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

export default function SqlReference() {
  return (
    <ToolLayout
      title="SQL 常用命令"
      description="SQL 数据库操作命令速查表"
      icon={Database}
    >
      <div className="space-y-8">
        {sqlCommands.map((section) => (
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
