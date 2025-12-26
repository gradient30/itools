import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

// 测试用例模板数据
const testCaseTemplates = {
  functional: {
    name: "功能测试用例",
    columns: ["用例ID", "模块", "用例标题", "前置条件", "测试步骤", "预期结果", "优先级", "测试类型"],
    rows: [
      ["TC_FUNC_001", "登录模块", "验证正确账号密码登录", "已注册账号", "1. 输入正确账号\n2. 输入正确密码\n3. 点击登录", "登录成功，跳转主界面", "P0", "功能"],
      ["TC_FUNC_002", "登录模块", "验证错误密码登录", "已注册账号", "1. 输入正确账号\n2. 输入错误密码\n3. 点击登录", "提示密码错误，登录失败", "P0", "功能"],
      ["TC_FUNC_003", "充值模块", "验证首次充值流程", "已登录账号，未充值", "1. 点击充值入口\n2. 选择充值金额6元\n3. 完成支付", "充值成功，到账对应钻石，首充奖励发放", "P0", "功能"],
      ["TC_FUNC_004", "背包模块", "验证道具使用", "背包有可用道具", "1. 打开背包\n2. 选择道具\n3. 点击使用", "道具效果生效，道具数量减少", "P1", "功能"],
      ["TC_FUNC_005", "战斗模块", "验证技能释放", "进入战斗场景", "1. 点击技能按钮\n2. 选择目标\n3. 释放技能", "技能特效播放，伤害正确计算", "P0", "功能"],
    ]
  },
  equivalence: {
    name: "等价类测试用例",
    columns: ["用例ID", "测试场景", "等价类类型", "等价类描述", "测试值", "预期结果", "优先级"],
    rows: [
      ["TC_EQ_001", "角色等级", "有效等价类", "新手期（1-10级）", "5", "正常显示等级，新手保护机制生效", "P1"],
      ["TC_EQ_002", "角色等级", "有效等价类", "成长期（11-50级）", "30", "正常显示等级，开放更多功能", "P1"],
      ["TC_EQ_003", "角色等级", "有效等价类", "进阶期（51-99级）", "75", "正常显示等级，高级副本开放", "P1"],
      ["TC_EQ_004", "角色等级", "有效等价类", "满级（100级）", "100", "显示满级标识，解锁所有功能", "P1"],
      ["TC_EQ_005", "角色等级", "无效等价类", "负数等级", "-1", "提示等级无效，拒绝设置", "P2"],
      ["TC_EQ_006", "角色等级", "无效等价类", "超过最大等级", "101", "限制为最大等级100", "P2"],
      ["TC_EQ_007", "充值金额", "有效等价类", "最小充值额", "6", "充值成功，到账对应钻石", "P0"],
      ["TC_EQ_008", "充值金额", "无效等价类", "低于最小金额", "1", "提示金额不足", "P1"],
    ]
  },
  boundary: {
    name: "边界值测试用例",
    columns: ["用例ID", "测试场景", "边界类型", "边界描述", "测试值", "预期结果", "优先级"],
    rows: [
      ["TC_BV_001", "背包容量", "最小值-1", "背包格数下限", "-1", "提示无效，不允许设置", "P1"],
      ["TC_BV_002", "背包容量", "最小值", "背包0格", "0", "显示空背包提示", "P1"],
      ["TC_BV_003", "背包容量", "最小值+1", "背包1格", "1", "正常显示1个格子", "P1"],
      ["TC_BV_004", "背包容量", "最大值-1", "背包99格", "99", "正常显示，可添加道具", "P1"],
      ["TC_BV_005", "背包容量", "最大值", "背包100格（上限）", "100", "正常显示，提示已满", "P1"],
      ["TC_BV_006", "背包容量", "最大值+1", "超过上限", "101", "提示背包已满，无法扩展", "P1"],
      ["TC_BV_007", "战斗伤害", "最小值", "最低伤害保底", "1", "至少造成1点伤害", "P0"],
      ["TC_BV_008", "抽卡保底", "边界值", "小保底80抽", "80", "第80抽必出4星角色", "P0"],
    ]
  },
  exploratory: {
    name: "探索式测试记录",
    columns: ["记录ID", "探索章程", "测试时长", "测试目标", "测试场景", "发现问题", "风险评估", "备注"],
    rows: [
      ["ET_001", "新手引导探索", "60分钟", "引导流程完整性", "全程跟随引导完成", "", "", ""],
      ["ET_002", "新手引导探索", "60分钟", "中断恢复", "中途退出游戏再进入", "", "", ""],
      ["ET_003", "核心战斗探索", "90分钟", "技能连招", "快速切换技能释放", "", "", ""],
      ["ET_004", "网络异常探索", "45分钟", "弱网环境", "3G/4G/WiFi快速切换", "", "", ""],
      ["ET_005", "付费流程探索", "60分钟", "支付异常", "支付取消后重试", "", "", ""],
    ]
  },
  riskBased: {
    name: "风险评估测试",
    columns: ["模块名称", "风险等级", "风险原因", "测试策略", "测试频率", "负责人", "状态"],
    rows: [
      ["充值系统", "P0", "直接涉及资金安全", "100%覆盖 + 自动化回归", "每次发版必测", "", ""],
      ["账号系统", "P0", "用户资产关联", "100%覆盖 + 多轮验证", "每次发版必测", "", ""],
      ["战斗核心", "P1", "游戏核心体验", "核心场景100%覆盖", "每次发版必测", "", ""],
      ["抽卡系统", "P1", "付费转化关键", "核心场景100%覆盖", "每次发版必测", "", ""],
      ["排行榜", "P1", "竞技公平性", "核心场景覆盖", "每次发版必测", "", ""],
      ["任务系统", "P2", "引导和留存", "主要场景覆盖", "版本回归时测试", "", ""],
      ["成就系统", "P2", "长期激励", "主要场景覆盖", "版本回归时测试", "", ""],
      ["设置功能", "P3", "辅助功能", "有时间时覆盖", "大版本时关注", "", ""],
    ]
  },
  acceptance: {
    name: "版本验收清单",
    columns: ["验收类别", "验收项", "是否必须", "验收结果", "问题描述", "验收人", "日期"],
    rows: [
      ["功能验收", "核心玩法功能完整可用", "是", "", "", "", ""],
      ["功能验收", "新手引导流程无阻断", "是", "", "", "", ""],
      ["功能验收", "充值和购买流程正常", "是", "", "", "", ""],
      ["性能验收", "启动时间 ≤ 5秒", "是", "", "", "", ""],
      ["性能验收", "战斗帧率 ≥ 30FPS", "是", "", "", "", ""],
      ["兼容性验收", "主流机型TOP20覆盖", "是", "", "", "", ""],
      ["兼容性验收", "Android 8.0+ 支持", "是", "", "", "", ""],
      ["安全验收", "无明显外挂漏洞", "是", "", "", "", ""],
      ["安全验收", "协议加密传输", "是", "", "", "", ""],
      ["数据验收", "埋点数据上报正确", "是", "", "", "", ""],
    ]
  }
};

type TemplateKey = keyof typeof testCaseTemplates;

export function TestCaseExporter() {
  const [exporting, setExporting] = useState(false);

  const exportToExcel = (templateKey: TemplateKey | "all") => {
    setExporting(true);
    try {
      const workbook = XLSX.utils.book_new();

      if (templateKey === "all") {
        // 导出所有模板到一个Excel文件
        Object.entries(testCaseTemplates).forEach(([key, template]) => {
          const wsData = [template.columns, ...template.rows];
          const worksheet = XLSX.utils.aoa_to_sheet(wsData);
          
          // 设置列宽
          worksheet["!cols"] = template.columns.map((col) => ({
            wch: Math.max(col.length * 2, 15)
          }));
          
          XLSX.utils.book_append_sheet(workbook, worksheet, template.name.slice(0, 31));
        });
      } else {
        const template = testCaseTemplates[templateKey];
        const wsData = [template.columns, ...template.rows];
        const worksheet = XLSX.utils.aoa_to_sheet(wsData);
        
        worksheet["!cols"] = template.columns.map((col) => ({
          wch: Math.max(col.length * 2, 15)
        }));
        
        XLSX.utils.book_append_sheet(workbook, worksheet, template.name.slice(0, 31));
      }

      const fileName = templateKey === "all" 
        ? `游戏测试用例模板_全部_${new Date().toISOString().split('T')[0]}.xlsx`
        : `游戏测试用例_${testCaseTemplates[templateKey].name}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      XLSX.writeFile(workbook, fileName);
      toast.success("Excel导出成功");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("导出失败，请重试");
    } finally {
      setExporting(false);
    }
  };

  const exportToMarkdown = (templateKey: TemplateKey | "all") => {
    setExporting(true);
    try {
      let markdown = "";

      const generateTableMd = (template: typeof testCaseTemplates[TemplateKey]) => {
        let md = `## ${template.name}\n\n`;
        
        // 表头
        md += `| ${template.columns.join(" | ")} |\n`;
        md += `| ${template.columns.map(() => "---").join(" | ")} |\n`;
        
        // 数据行
        template.rows.forEach(row => {
          const escapedRow = row.map(cell => 
            String(cell).replace(/\n/g, "<br>").replace(/\|/g, "\\|")
          );
          md += `| ${escapedRow.join(" | ")} |\n`;
        });
        
        md += "\n";
        return md;
      };

      if (templateKey === "all") {
        markdown = "# 游戏测试用例模板\n\n";
        markdown += `> 导出时间：${new Date().toLocaleString()}\n\n`;
        markdown += "---\n\n";
        
        Object.values(testCaseTemplates).forEach(template => {
          markdown += generateTableMd(template);
        });
      } else {
        const template = testCaseTemplates[templateKey];
        markdown = `# ${template.name}\n\n`;
        markdown += `> 导出时间：${new Date().toLocaleString()}\n\n`;
        markdown += generateTableMd(template);
      }

      // 添加使用说明
      markdown += "\n---\n\n## 使用说明\n\n";
      markdown += "1. 根据实际项目需求修改模板内容\n";
      markdown += "2. 用例ID建议保持唯一性，格式：TC_模块缩写_序号\n";
      markdown += "3. 优先级说明：P0-致命 P1-严重 P2-一般 P3-轻微\n";
      markdown += "4. 预期结果要具体明确，便于验证\n";

      const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      const fileName = templateKey === "all"
        ? `游戏测试用例模板_全部_${new Date().toISOString().split('T')[0]}.md`
        : `游戏测试用例_${testCaseTemplates[templateKey].name}_${new Date().toISOString().split('T')[0]}.md`;
      
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Markdown导出成功");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("导出失败，请重试");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={exporting}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            导出Excel
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => exportToExcel("all")}>
            <Download className="h-4 w-4 mr-2" />
            全部模板
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToExcel("functional")}>
            功能测试用例
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToExcel("equivalence")}>
            等价类测试用例
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToExcel("boundary")}>
            边界值测试用例
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToExcel("exploratory")}>
            探索式测试记录
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToExcel("riskBased")}>
            风险评估测试
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToExcel("acceptance")}>
            版本验收清单
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={exporting}>
            <FileText className="h-4 w-4 mr-2" />
            导出Markdown
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => exportToMarkdown("all")}>
            <Download className="h-4 w-4 mr-2" />
            全部模板
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToMarkdown("functional")}>
            功能测试用例
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToMarkdown("equivalence")}>
            等价类测试用例
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToMarkdown("boundary")}>
            边界值测试用例
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToMarkdown("exploratory")}>
            探索式测试记录
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToMarkdown("riskBased")}>
            风险评估测试
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportToMarkdown("acceptance")}>
            版本验收清单
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
