import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, FileText, Eye, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

// 专业测试用例模板数据 - 更详细的行业标准模板
export const testCaseTemplates = {
  functional: {
    name: "功能测试用例",
    description: "覆盖游戏核心功能的标准测试用例模板",
    columns: ["用例ID", "模块", "子模块", "用例标题", "优先级", "前置条件", "测试步骤", "预期结果", "测试数据", "备注"],
    rows: [
      ["TC_LOGIN_001", "账号系统", "登录", "正确账号密码登录成功", "P0", "1. 已注册有效账号\n2. 网络正常", "1. 启动游戏客户端\n2. 输入账号: test001\n3. 输入密码: Test@123\n4. 点击登录按钮", "1. 显示登录加载\n2. 3秒内进入游戏主界面\n3. 显示角色信息正确", "账号: test001\n密码: Test@123", "冒烟测试必测项"],
      ["TC_LOGIN_002", "账号系统", "登录", "密码错误登录失败", "P0", "1. 已注册有效账号\n2. 网络正常", "1. 输入正确账号\n2. 输入错误密码: wrong123\n3. 点击登录", "1. 提示\"密码错误\"\n2. 保留账号输入\n3. 清空密码框\n4. 记录错误次数", "错误密码: wrong123", "验证5次锁定机制"],
      ["TC_LOGIN_003", "账号系统", "登录", "账号被封禁无法登录", "P1", "账号处于封禁状态", "1. 输入被封禁账号\n2. 输入正确密码\n3. 点击登录", "1. 弹窗提示封禁原因\n2. 显示封禁时间\n3. 提供申诉入口", "封禁账号: ban_test", ""],
      ["TC_PAY_001", "充值系统", "首充", "首次充值6元流程", "P0", "1. 新注册账号\n2. 未进行过充值", "1. 点击充值入口\n2. 选择6元档位\n3. 确认支付方式\n4. 完成支付\n5. 返回游戏", "1. 支付成功页面\n2. 钻石到账: 60个\n3. 首充奖励发放\n4. 首充标识消失", "充值金额: 6元", "重点验证掉单情况"],
      ["TC_PAY_002", "充值系统", "充值", "支付中断后重试", "P0", "已登录账号", "1. 发起充值请求\n2. 支付页面取消支付\n3. 返回游戏\n4. 再次点击充值", "1. 取消支付无扣费\n2. 订单状态正确\n3. 可正常重新发起支付", "", "验证订单状态同步"],
      ["TC_BAG_001", "背包系统", "道具", "使用消耗品道具", "P1", "背包中有经验药水x5", "1. 打开背包\n2. 选中经验药水\n3. 点击使用\n4. 确认使用1个", "1. 道具数量-1\n2. 经验值+1000\n3. 播放使用特效\n4. 显示获得提示", "道具ID: 10001", "验证数量边界"],
      ["TC_BATTLE_001", "战斗系统", "技能", "释放主动技能", "P0", "1. 进入战斗场景\n2. 技能CD结束", "1. 选择目标敌人\n2. 点击技能1按钮\n3. 等待技能释放完成", "1. 技能特效播放\n2. 伤害数字显示\n3. 目标血量减少\n4. 技能进入CD", "", "验证连点表现"],
      ["TC_BATTLE_002", "战斗系统", "伤害", "暴击伤害计算", "P1", "角色暴击率100%设置", "1. 进入测试战斗\n2. 释放普攻\n3. 记录伤害数值", "1. 显示暴击标识\n2. 伤害 = 基础伤害 × 暴击倍率\n3. 数值精确到整数", "暴击率: 100%\n暴击伤害: 150%", ""],
      ["TC_SOCIAL_001", "社交系统", "好友", "添加好友成功", "P2", "1. 双方在线\n2. 好友位未满", "1. 输入对方ID\n2. 点击添加好友\n3. 对方同意申请", "1. 双方好友列表更新\n2. 系统消息通知\n3. 可进行好友互动", "目标ID: friend_001", ""],
      ["TC_GUIDE_001", "新手引导", "主线", "完整新手引导流程", "P0", "新建角色首次进入", "1. 跟随引导完成教学关卡\n2. 领取新手奖励\n3. 完成首充引导\n4. 进入主界面", "1. 引导流程无中断\n2. 所有奖励正确发放\n3. 引导完成标记正确\n4. 主界面功能解锁", "", "全流程时长验证"],
    ]
  },
  equivalence: {
    name: "等价类测试用例",
    description: "基于等价类划分法的系统化测试用例",
    columns: ["用例ID", "测试场景", "参数名称", "等价类类型", "等价类描述", "测试值", "预期结果", "实际结果", "优先级"],
    rows: [
      ["TC_EQ_001", "角色创建", "角色名称", "有效等价类", "纯中文（2-6字）", "游戏玩家", "创建成功", "", "P1"],
      ["TC_EQ_002", "角色创建", "角色名称", "有效等价类", "中英混合", "Player玩家", "创建成功", "", "P1"],
      ["TC_EQ_003", "角色创建", "角色名称", "有效等价类", "纯英文（4-12位）", "GamePlayer", "创建成功", "", "P1"],
      ["TC_EQ_004", "角色创建", "角色名称", "无效等价类", "长度不足（<2字）", "我", "提示长度不足", "", "P2"],
      ["TC_EQ_005", "角色创建", "角色名称", "无效等价类", "长度超限（>12位）", "这是一个超长的角色名字", "提示超出限制", "", "P2"],
      ["TC_EQ_006", "角色创建", "角色名称", "无效等价类", "含特殊字符", "玩家@#$", "提示含非法字符", "", "P2"],
      ["TC_EQ_007", "角色创建", "角色名称", "无效等价类", "敏感词", "admin管理", "提示名称不可用", "", "P1"],
      ["TC_EQ_008", "角色创建", "角色名称", "无效等价类", "空白字符", "   ", "提示请输入名称", "", "P2"],
      ["TC_EQ_009", "充值金额", "金额", "有效等价类", "最小档位", "6", "充值成功，到账60钻", "", "P0"],
      ["TC_EQ_010", "充值金额", "金额", "有效等价类", "常规档位", "30", "充值成功，到账300钻", "", "P0"],
      ["TC_EQ_011", "充值金额", "金额", "有效等价类", "大额档位", "648", "充值成功，到账6480钻+赠送", "", "P0"],
      ["TC_EQ_012", "充值金额", "金额", "无效等价类", "负数金额", "-1", "拒绝交易", "", "P1"],
      ["TC_EQ_013", "充值金额", "金额", "无效等价类", "非标准金额", "7", "提示选择有效档位", "", "P2"],
      ["TC_EQ_014", "战斗等级", "等级", "有效等价类", "新手期（1-10级）", "5", "新手保护，减伤50%", "", "P1"],
      ["TC_EQ_015", "战斗等级", "等级", "有效等价类", "成长期（11-50级）", "30", "正常战斗机制", "", "P1"],
      ["TC_EQ_016", "战斗等级", "等级", "有效等价类", "满级（100级）", "100", "开放全部功能", "", "P1"],
    ]
  },
  boundary: {
    name: "边界值测试用例",
    description: "针对数值边界的精确测试用例",
    columns: ["用例ID", "测试场景", "参数名称", "边界类型", "最小值", "最大值", "测试值", "预期结果", "实际结果", "优先级"],
    rows: [
      ["TC_BV_001", "背包容量", "格数", "min-1", "0", "100", "-1", "拒绝设置，提示无效", "", "P1"],
      ["TC_BV_002", "背包容量", "格数", "min", "0", "100", "0", "显示空背包提示", "", "P1"],
      ["TC_BV_003", "背包容量", "格数", "min+1", "0", "100", "1", "正常显示1格", "", "P1"],
      ["TC_BV_004", "背包容量", "格数", "max-1", "0", "100", "99", "正常使用，可添加1件", "", "P1"],
      ["TC_BV_005", "背包容量", "格数", "max", "0", "100", "100", "背包已满提示", "", "P1"],
      ["TC_BV_006", "背包容量", "格数", "max+1", "0", "100", "101", "拒绝添加，引导扩容", "", "P1"],
      ["TC_BV_007", "战斗伤害", "伤害值", "min", "1", "999999", "0", "保底伤害为1", "", "P0"],
      ["TC_BV_008", "战斗伤害", "伤害值", "max", "1", "999999", "999999", "正常显示，不溢出", "", "P0"],
      ["TC_BV_009", "战斗伤害", "伤害值", "max+1", "1", "999999", "1000000", "截断为999999", "", "P1"],
      ["TC_BV_010", "抽卡保底", "抽数", "小保底边界", "1", "80", "79", "未触发保底", "", "P0"],
      ["TC_BV_011", "抽卡保底", "抽数", "小保底触发", "1", "80", "80", "必出4星", "", "P0"],
      ["TC_BV_012", "抽卡保底", "抽数", "大保底边界", "1", "180", "179", "未触发大保底", "", "P0"],
      ["TC_BV_013", "抽卡保底", "抽数", "大保底触发", "1", "180", "180", "必出UP5星", "", "P0"],
      ["TC_BV_014", "活动时间", "秒数", "开始边界", "0", "∞", "-1", "显示未开始", "", "P1"],
      ["TC_BV_015", "活动时间", "秒数", "开始时刻", "0", "∞", "0", "活动入口开启", "", "P1"],
      ["TC_BV_016", "活动时间", "秒数", "结束时刻", "0", "∞", "结束时刻", "活动入口关闭", "", "P1"],
    ]
  },
  exploratory: {
    name: "探索式测试记录",
    description: "探索式测试会话记录和问题追踪",
    columns: ["记录ID", "探索章程", "测试时长", "测试目标", "测试场景", "操作步骤", "发现问题", "问题级别", "复现率", "截图/录屏", "备注"],
    rows: [
      ["ET_001", "新手引导探索", "60min", "引导完整性", "全程引导", "按引导步骤操作", "", "", "", "", "重点观察卡点"],
      ["ET_002", "新手引导探索", "30min", "中断恢复", "中途退出", "引导中强制关闭APP", "", "", "", "", "验证断点续接"],
      ["ET_003", "新手引导探索", "20min", "快速跳过", "跳过引导", "快速点击跳过所有", "", "", "", "", "验证状态一致性"],
      ["ET_004", "战斗系统探索", "90min", "技能连招", "极限操作", "快速切换技能释放", "", "", "", "", "关注帧率和卡顿"],
      ["ET_005", "战斗系统探索", "60min", "边界伤害", "极限DPS", "最大化伤害输出", "", "", "", "", "验证数值溢出"],
      ["ET_006", "网络异常探索", "45min", "弱网表现", "3G网络", "2G/3G环境操作", "", "", "", "", "关注超时处理"],
      ["ET_007", "网络异常探索", "30min", "断网恢复", "断网重连", "战斗中断开网络", "", "", "", "", "验证数据同步"],
      ["ET_008", "付费流程探索", "60min", "支付异常", "取消支付", "发起支付后取消", "", "", "", "", "验证订单状态"],
      ["ET_009", "付费流程探索", "30min", "重复支付", "连续点击", "快速多次点击支付", "", "", "", "", "防重复提交"],
      ["ET_010", "性能探索", "120min", "长时间运行", "挂机测试", "4小时持续运行", "", "", "", "", "监控内存泄漏"],
    ]
  },
  riskBased: {
    name: "风险评估测试",
    description: "基于业务风险等级的测试覆盖策略",
    columns: ["模块名称", "功能点", "风险等级", "风险类型", "风险原因", "影响范围", "测试策略", "测试频率", "自动化", "负责人"],
    rows: [
      ["充值系统", "支付下单", "P0", "资金风险", "直接涉及用户资金", "全部付费用户", "100%覆盖+自动化", "每日", "是", ""],
      ["充值系统", "订单状态同步", "P0", "资金风险", "掉单导致资金损失", "付费用户", "关键路径100%", "每日", "是", ""],
      ["充值系统", "到账延迟", "P1", "体验风险", "影响付费体验", "付费用户", "核心场景覆盖", "每次发版", "是", ""],
      ["账号系统", "登录认证", "P0", "安全风险", "账号安全基础", "全部用户", "100%覆盖", "每日", "是", ""],
      ["账号系统", "数据存储", "P0", "数据风险", "用户资产关联", "全部用户", "多轮验证", "每次发版", "部分", ""],
      ["战斗核心", "伤害计算", "P1", "体验风险", "核心玩法体验", "活跃用户", "核心场景100%", "每次发版", "是", ""],
      ["战斗核心", "技能释放", "P1", "体验风险", "操作流畅性", "活跃用户", "主要场景覆盖", "每次发版", "部分", ""],
      ["抽卡系统", "概率验证", "P0", "合规风险", "概率公示法规", "付费用户", "统计验证", "每次发版", "是", ""],
      ["抽卡系统", "保底机制", "P1", "体验风险", "付费转化关键", "付费用户", "边界值100%", "每次发版", "是", ""],
      ["排行榜", "排名计算", "P1", "公平风险", "竞技公平性", "竞技用户", "逻辑验证", "每次发版", "是", ""],
      ["任务系统", "任务触发", "P2", "体验风险", "引导和留存", "新用户", "主要路径覆盖", "版本回归", "部分", ""],
      ["社交系统", "好友互动", "P2", "体验风险", "社交功能", "社交用户", "主要场景覆盖", "版本回归", "否", ""],
    ]
  },
  acceptance: {
    name: "版本验收清单",
    description: "版本发布前的系统化验收检查清单",
    columns: ["验收类别", "验收项", "验收标准", "是否必须", "验收方法", "验收结果", "问题描述", "验收人", "日期"],
    rows: [
      ["功能验收", "核心玩法", "主线战斗流程完整无阻断", "是", "全流程测试", "", "", "", ""],
      ["功能验收", "新手引导", "引导流程100%可完成", "是", "新号验证", "", "", "", ""],
      ["功能验收", "充值支付", "所有支付渠道正常", "是", "真实支付测试", "", "", "", ""],
      ["功能验收", "数据存储", "用户数据正确保存同步", "是", "存取验证", "", "", "", ""],
      ["性能验收", "启动时间", "冷启动≤8秒，热启动≤3秒", "是", "性能工具测量", "", "", "", ""],
      ["性能验收", "战斗帧率", "核心战斗≥30FPS", "是", "帧率监控", "", "", "", ""],
      ["性能验收", "内存占用", "运行内存≤1.5GB", "是", "内存监控", "", "", "", ""],
      ["性能验收", "包体大小", "符合预期大小±5%", "是", "包体检查", "", "", "", ""],
      ["兼容性验收", "主流机型", "TOP20机型兼容", "是", "真机测试", "", "", "", ""],
      ["兼容性验收", "系统版本", "Android8+/iOS12+", "是", "多版本测试", "", "", "", ""],
      ["兼容性验收", "分辨率", "主流分辨率适配", "是", "UI检查", "", "", "", ""],
      ["安全验收", "传输加密", "敏感数据加密传输", "是", "抓包验证", "", "", "", ""],
      ["安全验收", "本地存储", "敏感数据不明文存储", "是", "文件检查", "", "", "", ""],
      ["数据验收", "埋点上报", "关键埋点数据正确", "是", "数据核验", "", "", "", ""],
      ["数据验收", "版本号", "版本号正确标识", "是", "版本检查", "", "", "", ""],
    ]
  },
  compatibility: {
    name: "兼容性测试矩阵",
    description: "多设备多系统兼容性测试覆盖",
    columns: ["设备型号", "系统版本", "分辨率", "RAM", "测试项", "启动", "登录", "战斗", "充值", "UI适配", "问题描述"],
    rows: [
      ["iPhone 15 Pro", "iOS 17.0", "2556×1179", "8GB", "全量", "", "", "", "", "", ""],
      ["iPhone 13", "iOS 16.0", "2532×1170", "4GB", "全量", "", "", "", "", "", ""],
      ["iPhone SE 3", "iOS 15.0", "1334×750", "4GB", "全量", "", "", "", "", "", ""],
      ["华为 Mate 60 Pro", "HarmonyOS 4.0", "2720×1260", "12GB", "全量", "", "", "", "", "", ""],
      ["小米 14", "Android 14", "2670×1200", "12GB", "全量", "", "", "", "", "", ""],
      ["OPPO Find X6", "Android 13", "2780×1264", "12GB", "全量", "", "", "", "", "", ""],
      ["vivo X90", "Android 13", "2800×1260", "8GB", "全量", "", "", "", "", "", ""],
      ["三星 S23", "Android 13", "2340×1080", "8GB", "全量", "", "", "", "", "", ""],
      ["红米 Note 12", "Android 12", "2400×1080", "6GB", "核心", "", "", "", "", "", ""],
      ["荣耀 90", "Android 12", "2664×1200", "8GB", "核心", "", "", "", "", "", ""],
    ]
  },
  performance: {
    name: "性能测试用例",
    description: "游戏性能基准测试和压力测试用例",
    columns: ["用例ID", "测试类型", "测试场景", "测试指标", "基准值", "预警值", "测试方法", "测试时长", "实测值", "结果"],
    rows: [
      ["PERF_001", "启动性能", "冷启动", "启动时间", "≤5s", ">8s", "秒表计时", "5次取平均", "", ""],
      ["PERF_002", "启动性能", "热启动", "启动时间", "≤2s", ">3s", "秒表计时", "5次取平均", "", ""],
      ["PERF_003", "帧率", "主城场景", "FPS", "≥30", "<25", "帧率工具", "5分钟", "", ""],
      ["PERF_004", "帧率", "战斗场景", "FPS", "≥30", "<25", "帧率工具", "10分钟", "", ""],
      ["PERF_005", "帧率", "多人战斗", "FPS", "≥25", "<20", "帧率工具", "10分钟", "", ""],
      ["PERF_006", "内存", "启动后", "内存占用", "≤800MB", ">1GB", "内存监控", "即时", "", ""],
      ["PERF_007", "内存", "战斗中", "内存占用", "≤1.2GB", ">1.5GB", "内存监控", "10分钟", "", ""],
      ["PERF_008", "内存", "长时运行", "内存增长", "≤50MB/h", ">100MB/h", "内存监控", "4小时", "", ""],
      ["PERF_009", "CPU", "待机状态", "CPU占用", "≤10%", ">20%", "CPU监控", "10分钟", "", ""],
      ["PERF_010", "CPU", "战斗状态", "CPU占用", "≤60%", ">80%", "CPU监控", "10分钟", "", ""],
      ["PERF_011", "网络", "正常操作", "流量消耗", "≤1MB/min", ">3MB/min", "流量监控", "30分钟", "", ""],
      ["PERF_012", "电量", "正常游戏", "耗电速度", "≤15%/h", ">25%/h", "电量监控", "1小时", "", ""],
    ]
  },
  bugReport: {
    name: "缺陷报告模板",
    description: "标准化的缺陷报告和跟踪模板",
    columns: ["缺陷ID", "模块", "标题", "严重程度", "优先级", "复现步骤", "预期结果", "实际结果", "环境信息", "附件", "状态"],
    rows: [
      ["BUG_001", "", "[模块名]简洁描述问题现象", "致命/严重/一般/轻微", "P0/P1/P2/P3", "1. 步骤1\n2. 步骤2\n3. 步骤3", "期望的正确行为", "实际发生的错误行为", "设备: \n系统: \n版本: \n账号: ", "截图/录屏链接", "新建"],
      ["BUG_002", "充值", "首充6元支付成功但钻石未到账", "严重", "P0", "1. 新账号首次充值\n2. 选择6元档位\n3. 微信支付成功\n4. 返回游戏查看", "钻石增加60个，首充奖励发放", "钻石数量无变化，首充奖励未发放", "设备: iPhone13\n系统: iOS16\n版本: 1.2.3\n账号: test123", "pay_bug.mp4", "处理中"],
      ["BUG_003", "战斗", "释放技能时概率闪退", "严重", "P0", "1. 进入副本战斗\n2. 连续释放技能1和技能2\n3. 多次操作", "技能正常释放", "约30%概率闪退", "设备: 小米14\n系统: Android14\n版本: 1.2.3", "crash_log.txt", "修复中"],
      ["BUG_004", "UI", "竖屏模式下排行榜按钮被刘海遮挡", "一般", "P2", "1. iPhone14 Pro机型\n2. 竖屏进入排行榜界面", "按钮完整显示可点击", "按钮部分被刘海遮挡", "设备: iPhone14Pro\n系统: iOS17", "ui_bug.png", "新建"],
    ]
  }
};

type TemplateKey = keyof typeof testCaseTemplates;

interface TestCaseExporterProps {
  showPreview?: boolean;
}

export function TestCaseExporter({ showPreview = true }: TestCaseExporterProps) {
  const [exporting, setExporting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateKey>("functional");

  const exportToExcel = (templateKey: TemplateKey | "all") => {
    setExporting(true);
    try {
      const workbook = XLSX.utils.book_new();

      if (templateKey === "all") {
        Object.entries(testCaseTemplates).forEach(([key, template]) => {
          const wsData = [template.columns, ...template.rows];
          const worksheet = XLSX.utils.aoa_to_sheet(wsData);
          worksheet["!cols"] = template.columns.map((col) => ({
            wch: Math.max(col.length * 2, 12)
          }));
          XLSX.utils.book_append_sheet(workbook, worksheet, template.name.slice(0, 31));
        });
      } else {
        const template = testCaseTemplates[templateKey];
        const wsData = [template.columns, ...template.rows];
        const worksheet = XLSX.utils.aoa_to_sheet(wsData);
        worksheet["!cols"] = template.columns.map((col) => ({
          wch: Math.max(col.length * 2, 12)
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
        md += `> ${template.description}\n\n`;
        md += `| ${template.columns.join(" | ")} |\n`;
        md += `| ${template.columns.map(() => "---").join(" | ")} |\n`;
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
        markdown = "# 游戏测试用例模板集\n\n";
        markdown += `> 导出时间：${new Date().toLocaleString()}\n\n`;
        markdown += "---\n\n";
        Object.values(testCaseTemplates).forEach(template => {
          markdown += generateTableMd(template);
        });
      } else {
        const template = testCaseTemplates[templateKey];
        markdown = `# ${template.name}\n\n`;
        markdown += `> ${template.description}\n\n`;
        markdown += `> 导出时间：${new Date().toLocaleString()}\n\n`;
        markdown += generateTableMd(template);
      }

      markdown += "\n---\n\n## 使用说明\n\n";
      markdown += "1. **用例ID规范**: TC_模块缩写_序号（如 TC_LOGIN_001）\n";
      markdown += "2. **优先级定义**: P0-阻塞发版 P1-严重影响 P2-一般问题 P3-轻微问题\n";
      markdown += "3. **测试步骤**: 步骤要具体可执行，包含测试数据\n";
      markdown += "4. **预期结果**: 描述具体可验证的结果状态\n";
      markdown += "5. **持续更新**: 根据项目实际情况补充和完善用例\n";

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

  const templateList = Object.entries(testCaseTemplates) as [TemplateKey, typeof testCaseTemplates[TemplateKey]][];

  return (
    <div className="flex flex-wrap gap-2">
      {/* 预览按钮 */}
      {showPreview && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              模板预览
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                测试用例模板预览
              </DialogTitle>
            </DialogHeader>
            <Tabs value={previewTemplate} onValueChange={(v) => setPreviewTemplate(v as TemplateKey)} className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
                {templateList.map(([key, template]) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {template.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {templateList.map(([key, template]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">共 {template.rows.length} 条示例</Badge>
                      <Badge variant="secondary">{template.columns.length} 个字段</Badge>
                    </div>
                  </div>
                  <ScrollArea className="h-[400px] rounded border">
                    <div className="p-2">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-muted">
                          <tr>
                            {template.columns.map((col, i) => (
                              <th key={i} className="p-2 text-left font-medium border-b whitespace-nowrap">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {template.rows.map((row, i) => (
                            <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                              {row.map((cell, j) => (
                                <td key={j} className="p-2 max-w-[200px]">
                                  <div className="whitespace-pre-wrap break-words text-muted-foreground">
                                    {cell || <span className="text-muted-foreground/50">-</span>}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button size="sm" variant="outline" onClick={() => exportToExcel(key)}>
                      <FileSpreadsheet className="h-4 w-4 mr-1" />
                      导出Excel
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportToMarkdown(key)}>
                      <FileText className="h-4 w-4 mr-1" />
                      导出Markdown
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Excel导出 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={exporting}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => exportToExcel("all")}>
            <Download className="h-4 w-4 mr-2" />
            全部模板
          </DropdownMenuItem>
          {templateList.map(([key, template]) => (
            <DropdownMenuItem key={key} onClick={() => exportToExcel(key)}>
              {template.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Markdown导出 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={exporting}>
            <FileText className="h-4 w-4 mr-2" />
            Markdown
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => exportToMarkdown("all")}>
            <Download className="h-4 w-4 mr-2" />
            全部模板
          </DropdownMenuItem>
          {templateList.map(([key, template]) => (
            <DropdownMenuItem key={key} onClick={() => exportToMarkdown(key)}>
              {template.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
