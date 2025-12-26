import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TestCaseExporter } from "@/components/TestCaseExporter";
import { 
  Gamepad2, 
  Target, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  FileText,
  Layers,
  ArrowRight,
  Smartphone,
  Monitor,
  Globe,
  Table,
  GitBranch,
  Search,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Box,
  Clock,
  DollarSign,
  Heart,
  Swords,
  Package,
  Coins,
  Gift,
  Trophy,
  Star,
  Wifi,
  WifiOff,
  Lock,
  CreditCard,
  Key,
  Bug,
  RefreshCw,
  Timer,
  Database,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Banknote,
  Receipt,
  AlertCircle,
  XCircle,
  Activity
} from "lucide-react";
import { useState } from "react";

// 黑盒测试技术 - 专业增强版
const blackBoxTechniques = [
  {
    id: "equivalence",
    name: "等价类划分",
    icon: Layers,
    description: "将输入数据划分为若干等价类，从每个类中选取代表性数据进行测试，是最基础也最重要的黑盒测试技术",
    principles: [
      "有效等价类：符合程序规格说明的合理输入数据集合",
      "无效等价类：不符合规格说明的异常/边缘输入数据集合",
      "等价类内的数据对发现同类错误的能力是等效的",
      "原则：每个等价类至少选取一个代表值进行测试",
      "组合原则：有效类可组合测试，无效类需单独测试"
    ],
    gameExamples: [
      {
        scenario: "角色名称创建系统",
        validClasses: [
          { class: "纯中文（2-6字）", testValue: "游戏玩家", description: "正常创建，存储正确" },
          { class: "纯英文（4-12位）", testValue: "GamePlayer", description: "正常创建，大小写保留" },
          { class: "中英混合", testValue: "玩家Player", description: "正常创建，混合显示" },
          { class: "含数字组合", testValue: "玩家2024", description: "正常创建，数字有效" }
        ],
        invalidClasses: [
          { class: "过短（<2字符）", testValue: "我", description: "提示：名称长度不足" },
          { class: "过长（>12字符）", testValue: "这是一个非常长的游戏角色名称", description: "提示：名称超出限制" },
          { class: "含特殊字符", testValue: "玩家@#$%", description: "提示：包含非法字符" },
          { class: "系统敏感词", testValue: "admin管理员", description: "提示：名称不可用" },
          { class: "纯空格/空白", testValue: "   ", description: "提示：请输入有效名称" },
          { class: "含emoji表情", testValue: "玩家😀", description: "根据策略：过滤或拒绝" }
        ]
      },
      {
        scenario: "充值金额验证系统",
        validClasses: [
          { class: "最小档位（6元）", testValue: "6", description: "充值成功，到账60钻石" },
          { class: "常规档位（30元）", testValue: "30", description: "充值成功，到账300+赠送30" },
          { class: "中档（98元）", testValue: "98", description: "充值成功，到账980+赠送100" },
          { class: "大额档位（648元）", testValue: "648", description: "充值成功，到账6480+赠送1000" }
        ],
        invalidClasses: [
          { class: "低于最低金额", testValue: "1", description: "提示：最低充值6元" },
          { class: "负数金额", testValue: "-100", description: "系统拒绝，订单创建失败" },
          { class: "非标准金额", testValue: "7.5", description: "提示：请选择有效档位" },
          { class: "超大金额", testValue: "100000", description: "触发风控，需人工审核" }
        ]
      },
      {
        scenario: "邮箱格式验证",
        validClasses: [
          { class: "标准邮箱格式", testValue: "user@game.com", description: "验证通过" },
          { class: "含数字用户名", testValue: "user123@game.com", description: "验证通过" },
          { class: "含点号用户名", testValue: "user.name@game.com", description: "验证通过" }
        ],
        invalidClasses: [
          { class: "缺少@符号", testValue: "usergame.com", description: "提示：邮箱格式错误" },
          { class: "缺少域名", testValue: "user@", description: "提示：邮箱格式不完整" },
          { class: "多个@符号", testValue: "user@@game.com", description: "提示：邮箱格式错误" },
          { class: "中文字符", testValue: "用户@游戏.com", description: "提示：请使用英文邮箱" }
        ]
      }
    ],
    realCases: [
      {
        title: "【真实案例】某MMO游戏角色名重复漏洞",
        description: "等价类测试发现：含不可见字符（如零宽字符U+200B）的名称被视为不同名称，但显示完全相同，导致玩家混淆和欺诈。",
        lesson: "等价类需考虑：不可见字符、全角/半角、大小写规范化等隐性等价类。"
      },
      {
        title: "【真实案例】充值系统金额校验绕过",
        description: "前端限制充值档位，但API未校验。测试人员通过接口发送非标准金额（如0.01元）成功创建订单，获得对应钻石。",
        lesson: "等价类测试必须同时覆盖前端和后端验证逻辑。"
      }
    ],
    checklist: [
      "识别所有输入参数并确定其有效取值范围",
      "为每个参数划分有效等价类和无效等价类",
      "考虑隐性等价类：编码、格式、不可见字符等",
      "确保每个等价类至少有一个用例覆盖",
      "无效等价类需单独测试，避免掩盖问题",
      "记录等价类划分依据，便于维护更新"
    ]
  },
  {
    id: "boundary",
    name: "边界值分析",
    icon: Target,
    description: "专注于测试输入范围的边界点及其临近值，是发现缺陷率最高的测试技术之一",
    principles: [
      "min - 1：刚好低于最小边界（无效值）",
      "min：最小边界值（有效值）",
      "min + 1：刚好高于最小边界（有效值）",
      "正常值：范围中间的典型值",
      "max - 1：刚好低于最大边界（有效值）",
      "max：最大边界值（有效值）",
      "max + 1：刚好超过最大边界（无效值）"
    ],
    gameExamples: [
      {
        scenario: "背包容量系统（默认100格，VIP最大200格）",
        boundaries: [
          { point: "普通下限", testValues: ["-1", "0", "1"], expected: "-1无效拒绝；0显示空背包；1正常使用" },
          { point: "普通上限", testValues: ["99", "100", "101"], expected: "99可添加；100提示满；101拒绝并引导扩容" },
          { point: "VIP上限", testValues: ["199", "200", "201"], expected: "VIP用户：199/200有效；201提示已达上限" }
        ]
      },
      {
        scenario: "战斗伤害数值系统",
        boundaries: [
          { point: "最小伤害", testValues: ["0", "1", "2"], expected: "保底至少1点伤害，0时显示miss或1" },
          { point: "暴击倍率上限", testValues: ["299%", "300%", "301%"], expected: "300%封顶，超出截断为300%" },
          { point: "单次伤害上限", testValues: ["999998", "999999", "1000000"], expected: "999999正常显示，100万截断显示99万+" },
          { point: "生命值归零", testValues: ["-100", "0", "1"], expected: "负数显示0，0时触发死亡，1时存活" }
        ]
      },
      {
        scenario: "抽卡保底机制（5星保底90抽）",
        boundaries: [
          { point: "软保底起点（74抽）", testValues: ["73", "74", "75"], expected: "74抽起概率开始提升" },
          { point: "硬保底（90抽）", testValues: ["89", "90", "91"], expected: "90抽必出5星，抽数重置" },
          { point: "大保底（180抽）", testValues: ["179", "180", "181"], expected: "180抽必出UP角色" }
        ]
      },
      {
        scenario: "活动倒计时系统",
        boundaries: [
          { point: "活动开始", testValues: ["-1秒", "0秒", "1秒"], expected: "-1显示即将开始；0时入口开启；1秒可进入" },
          { point: "活动结束", testValues: ["剩余1秒", "0秒", "-1秒"], expected: "1秒可操作；0秒关闭入口；负数显示已结束" },
          { point: "奖励领取截止", testValues: ["截止前1分钟", "截止时刻", "截止后"], expected: "前1分钟可领；截止时刻边界；截止后不可领" }
        ]
      }
    ],
    realCases: [
      {
        title: "【真实案例】抽卡保底重置异常",
        description: "第90抽必出5星，但当抽数为89时服务器重启，重启后抽数被错误重置为0，玩家损失89抽保底进度。",
        lesson: "边界值测试需结合异常场景：断网、重启、跨天等边界条件组合。"
      },
      {
        title: "【真实案例】背包满时道具丢失",
        description: "背包99/100格时领取2个道具，第一个成功，第二个因满仓被丢弃而非发送邮件。",
        lesson: "边界测试需验证连续操作场景，不仅是单次边界触发。"
      },
      {
        title: "【真实案例】伤害溢出显示为负数",
        description: "BOSS战中组合伤害超过int32最大值(21亿)，导致伤害显示为负数，结算异常。",
        lesson: "数值边界需考虑数据类型上限，特别是累计计算场景。"
      }
    ],
    checklist: [
      "识别所有数值型参数的有效边界",
      "设计标准7点边界值用例（min±1, min, 中间值, max-1, max, max+1）",
      "验证边界处的业务逻辑和UI显示",
      "考虑多维边界的组合情况",
      "测试边界值在异常场景下的表现（断网、重启）",
      "关注数值累计可能导致的溢出边界"
    ]
  },
  {
    id: "decision-table",
    name: "判定表法",
    icon: Table,
    description: "通过表格形式系统化分析多条件组合下的处理动作，确保所有逻辑分支被覆盖",
    principles: [
      "识别所有条件（输入变量）和动作（输出结果）",
      "条件组合数 = 2^n（n为布尔条件数）",
      "简化规则：合并导致相同动作的条件组合",
      "完备性：确保覆盖所有可能的条件组合",
      "优先级：当多条件满足时，明确优先处理规则"
    ],
    gameExamples: [
      {
        scenario: "副本进入资格判断",
        conditions: ["等级≥30", "体力≥20", "前置副本已通关", "队伍人数≥3"],
        rules: [
          { conditions: ["Y", "Y", "Y", "Y"], action: "允许进入副本，扣除体力", priority: "正常" },
          { conditions: ["N", "-", "-", "-"], action: "提示：等级不足，需达到30级", priority: "最高" },
          { conditions: ["Y", "N", "-", "-"], action: "提示：体力不足，引导购买或等待恢复", priority: "高" },
          { conditions: ["Y", "Y", "N", "-"], action: "提示：请先通关前置副本xxx", priority: "中" },
          { conditions: ["Y", "Y", "Y", "N"], action: "提示：队伍人数不足，至少需要3人", priority: "低" }
        ]
      },
      {
        scenario: "装备强化结果判定",
        conditions: ["强化石足够", "金币≥消耗", "当前等级<15", "使用保护符"],
        rules: [
          { conditions: ["Y", "Y", "Y", "Y"], action: "强化成功+1级，失败不降级不碎", priority: "正常" },
          { conditions: ["Y", "Y", "Y", "N"], action: "强化成功+1级，失败降1级（≤10级不降）", priority: "正常" },
          { conditions: ["Y", "Y", "N", "Y"], action: "提示：已达最高强化等级", priority: "中" },
          { conditions: ["N", "-", "-", "-"], action: "提示：强化石不足，差X个", priority: "高" },
          { conditions: ["Y", "N", "-", "-"], action: "提示：金币不足，需要XX金币", priority: "高" }
        ]
      },
      {
        scenario: "商品购买校验",
        conditions: ["货币足够", "背包有空位", "未达购买上限", "活动期间"],
        rules: [
          { conditions: ["Y", "Y", "Y", "Y"], action: "购买成功，发放道具，扣除货币", priority: "正常" },
          { conditions: ["Y", "Y", "Y", "N"], action: "提示：该商品仅活动期间售卖", priority: "高" },
          { conditions: ["Y", "Y", "N", "-"], action: "提示：已达购买上限（X/X）", priority: "中" },
          { conditions: ["Y", "N", "-", "-"], action: "提示：背包已满，请整理背包", priority: "中" },
          { conditions: ["N", "-", "-", "-"], action: "提示：XX币不足，差X个", priority: "高" }
        ]
      }
    ],
    realCases: [
      {
        title: "【真实案例】多条件优先级错误导致误引导",
        description: "玩家等级不足且体力不足时，系统只提示\"体力不足\"并引导充值，玩家充值后发现还是无法进入（因为等级不够）。",
        lesson: "判定表需明确条件优先级，优先提示最难满足或最基础的条件。"
      },
      {
        title: "【真实案例】购买校验遗漏组合",
        description: "VIP用户购买限购商品时，因同时满足\"VIP无限购\"和\"活动期间\"，系统未正确处理VIP+活动的组合逻辑。",
        lesson: "判定表需穷举所有组合，特别注意\"特权\"条件带来的额外分支。"
      }
    ],
    checklist: [
      "识别影响结果的所有条件变量",
      "列出所有可能的动作/输出结果",
      "绘制完整判定表，计算组合数量",
      "合并冗余规则简化表格",
      "明确条件优先级处理顺序",
      "为每条规则设计测试用例",
      "验证实际优先级与设计一致"
    ]
  },
  {
    id: "cause-effect",
    name: "因果图法",
    icon: GitBranch,
    description: "分析输入条件（因）与输出结果（果）之间的逻辑关系，适用于复杂业务规则的测试设计",
    principles: [
      "恒等（Identity）：若原因C出现，则结果E必然出现",
      "非（NOT）：若原因C出现，则结果E必然不出现",
      "或（OR）：多个原因中任一出现，结果E就出现",
      "与（AND）：多个原因必须同时出现，结果E才出现",
      "约束：互斥（E）、包含（I）、唯一（O）、要求（R）"
    ],
    gameExamples: [
      {
        scenario: "VIP等级升级条件",
        causes: [
          { id: "C1", name: "累计充值≥100元" },
          { id: "C2", name: "累计登录≥30天" },
          { id: "C3", name: "完成新手任务链" },
          { id: "C4", name: "购买月卡" }
        ],
        effects: [
          { id: "E1", name: "获得VIP1资格" },
          { id: "E2", name: "获得专属称号" },
          { id: "E3", name: "解锁VIP专属功能" }
        ],
        relations: [
          { type: "OR", causes: ["C1", "C4"], effect: "E1", description: "充值100元 或 购买月卡 → VIP1" },
          { type: "AND", causes: ["E1", "C2"], effect: "E2", description: "VIP1 且 登录30天 → 专属称号" },
          { type: "AND", causes: ["E1", "C3"], effect: "E3", description: "VIP1 且 完成新手任务 → 解锁VIP功能" }
        ]
      },
      {
        scenario: "成就解锁系统",
        causes: [
          { id: "C1", name: "击败最终BOSS" },
          { id: "C2", name: "10分钟内完成" },
          { id: "C3", name: "无队友阵亡" },
          { id: "C4", name: "不使用复活道具" }
        ],
        effects: [
          { id: "E1", name: "【通关者】成就" },
          { id: "E2", name: "【速通达人】成就" },
          { id: "E3", name: "【完美团队】成就" },
          { id: "E4", name: "【硬核玩家】称号" }
        ],
        relations: [
          { type: "恒等", causes: ["C1"], effect: "E1", description: "击败BOSS → 通关成就" },
          { type: "AND", causes: ["C1", "C2"], effect: "E2", description: "击败BOSS + 10分钟内 → 速通成就" },
          { type: "AND", causes: ["C1", "C3"], effect: "E3", description: "击败BOSS + 无阵亡 → 完美团队" },
          { type: "AND", causes: ["C1", "C2", "C3", "C4"], effect: "E4", description: "全条件达成 → 硬核称号" }
        ]
      },
      {
        scenario: "邮件奖励发放规则",
        causes: [
          { id: "C1", name: "完成每日登录" },
          { id: "C2", name: "完成每日任务" },
          { id: "C3", name: "本周首次登录" },
          { id: "C4", name: "VIP用户" }
        ],
        effects: [
          { id: "E1", name: "发送每日登录奖励" },
          { id: "E2", name: "发送任务完成奖励" },
          { id: "E3", name: "发送周登录礼包" },
          { id: "E4", name: "奖励翻倍" }
        ],
        relations: [
          { type: "恒等", causes: ["C1"], effect: "E1", description: "登录即发每日奖励" },
          { type: "恒等", causes: ["C2"], effect: "E2", description: "完成任务即发奖励" },
          { type: "AND", causes: ["C1", "C3"], effect: "E3", description: "登录 + 本周首次 → 周礼包" },
          { type: "AND", causes: ["C4", "任意奖励"], effect: "E4", description: "VIP用户所有奖励翻倍" }
        ]
      }
    ],
    realCases: [
      {
        title: "【真实案例】成就重复发放",
        description: "因果关系设计时，未考虑成就的\"一次性\"约束。玩家多次击败BOSS，每次都触发成就奖励发放。",
        lesson: "因果图需加入约束条件，如：唯一触发、不可重复等状态约束。"
      },
      {
        title: "【真实案例】VIP奖励叠加错误",
        description: "VIP翻倍逻辑与活动双倍叠加，导致4倍奖励。因果分析时未明确多个\"倍率\"效果的叠加规则。",
        lesson: "多个增益效果的因果关系需明确：加法叠加、乘法叠加还是取最大值。"
      }
    ],
    checklist: [
      "提取所有输入条件（原因）并编号",
      "识别所有输出结果（结果）并编号",
      "分析因果之间的逻辑关系（恒等/非/或/与）",
      "标注约束条件（互斥/包含/唯一）",
      "绘制因果图并验证完整性",
      "将因果图转化为判定表",
      "设计用例覆盖所有因果路径"
    ]
  },
  {
    id: "state-transition",
    name: "状态迁移测试",
    icon: GitBranch,
    description: "针对具有状态变化的系统，测试状态之间的转换是否正确",
    principles: [
      "识别系统的所有有效状态",
      "明确状态之间的转换条件（事件/动作）",
      "验证每个状态转换的正确性",
      "测试非法状态转换是否被正确拒绝",
      "关注状态的持久化和恢复"
    ],
    gameExamples: [
      {
        scenario: "订单状态机",
        causes: [
          { id: "S1", name: "待支付" },
          { id: "S2", name: "支付中" },
          { id: "S3", name: "支付成功" },
          { id: "S4", name: "发货中" },
          { id: "S5", name: "已完成" },
          { id: "S6", name: "已取消" }
        ],
        effects: [
          { id: "T1", name: "发起支付" },
          { id: "T2", name: "支付回调成功" },
          { id: "T3", name: "发货" },
          { id: "T4", name: "确认收货" },
          { id: "T5", name: "取消订单" },
          { id: "T6", name: "超时未支付" }
        ],
        relations: [
          { type: "转换", causes: ["S1"], effect: "S2", description: "待支付 --发起支付--> 支付中" },
          { type: "转换", causes: ["S2"], effect: "S3", description: "支付中 --支付成功--> 支付成功" },
          { type: "转换", causes: ["S3"], effect: "S4", description: "支付成功 --发货--> 发货中" },
          { type: "转换", causes: ["S4"], effect: "S5", description: "发货中 --确认--> 已完成" },
          { type: "转换", causes: ["S1"], effect: "S6", description: "待支付 --取消/超时--> 已取消" }
        ]
      },
      {
        scenario: "角色战斗状态",
        causes: [
          { id: "S1", name: "空闲状态" },
          { id: "S2", name: "战斗状态" },
          { id: "S3", name: "技能释放中" },
          { id: "S4", name: "被控制状态" },
          { id: "S5", name: "死亡状态" },
          { id: "S6", name: "无敌状态" }
        ],
        effects: [
          { id: "T1", name: "进入战斗" },
          { id: "T2", name: "释放技能" },
          { id: "T3", name: "被击中" },
          { id: "T4", name: "HP归零" },
          { id: "T5", name: "复活" }
        ],
        relations: [
          { type: "转换", causes: ["S1"], effect: "S2", description: "空闲 --受击/攻击--> 战斗" },
          { type: "转换", causes: ["S2"], effect: "S3", description: "战斗 --释放技能--> 技能释放中" },
          { type: "转换", causes: ["S2"], effect: "S4", description: "战斗 --被控制--> 控制状态" },
          { type: "非法", causes: ["S4"], effect: "S3", description: "控制状态下不可释放技能（非法转换）" },
          { type: "转换", causes: ["任意"], effect: "S5", description: "HP=0 --> 死亡" }
        ]
      }
    ],
    realCases: [
      {
        title: "【真实案例】订单状态跳跃",
        description: "支付回调延迟，用户取消订单后收到支付成功回调，订单从\"已取消\"变为\"支付成功\"，导致资金异常。",
        lesson: "状态机需定义终态（已取消、已完成）不可再转换的约束。"
      }
    ],
    checklist: [
      "绘制完整的状态迁移图",
      "识别所有有效状态和转换条件",
      "测试每个合法状态转换",
      "测试非法状态转换是否被拒绝",
      "验证状态持久化和异常恢复",
      "测试并发操作对状态的影响"
    ]
  }
];

// 探索式测试
const exploratoryTesting = {
  description: "一种强调测试人员主观能动性的测试方法，同时进行学习、设计和执行测试",
  charters: [
    {
      name: "功能探索章程",
      icon: Search,
      missions: [
        {
          title: "新手引导流程探索",
          duration: "60分钟",
          target: "新用户首次进入游戏的引导系统",
          focus: ["引导流程完整性", "跳过机制", "重复进入表现", "多设备同步"],
          scenarios: [
            "全程跟随引导完成",
            "中途退出游戏再进入",
            "快速点击跳过所有引导",
            "切换设备继续引导",
            "网络断开时的引导表现"
          ]
        },
        {
          title: "核心战斗系统探索",
          duration: "90分钟",
          target: "游戏主要战斗玩法",
          focus: ["技能连招", "伤害计算", "状态叠加", "极限操作"],
          scenarios: [
            "快速切换技能释放",
            "同时触发多个Buff/Debuff",
            "边界DPS测试（0伤害/超高伤害）",
            "战斗中断线重连",
            "多角色协同战斗"
          ]
        }
      ]
    },
    {
      name: "异常探索章程",
      icon: AlertTriangle,
      missions: [
        {
          title: "网络异常场景探索",
          duration: "45分钟",
          target: "弱网和断网环境下的游戏表现",
          focus: ["数据同步", "断点续传", "状态恢复", "错误提示"],
          scenarios: [
            "交易过程中断网",
            "副本BOSS战时网络波动",
            "排行榜刷新时断网",
            "3G/4G/5G/WiFi快速切换",
            "极高延迟（>3000ms）环境"
          ]
        },
        {
          title: "资源边界探索",
          duration: "60分钟",
          target: "系统资源极限情况",
          focus: ["内存占用", "CPU负载", "存储空间", "电量消耗"],
          scenarios: [
            "低内存设备运行",
            "存储空间不足时更新",
            "长时间挂机（4小时+）",
            "后台运行切换",
            "多应用同时运行"
          ]
        }
      ]
    },
    {
      name: "用户体验探索章程",
      icon: Users,
      missions: [
        {
          title: "付费流程体验探索",
          duration: "60分钟",
          target: "游戏内购和充值系统",
          focus: ["支付流程", "订单状态", "异常处理", "退款流程"],
          scenarios: [
            "首次充值体验",
            "连续多次小额充值",
            "支付取消后重试",
            "支付成功但道具未到账",
            "跨平台充值记录同步"
          ]
        }
      ]
    }
  ],
  sessionNotes: {
    template: [
      "探索时间：[开始时间] - [结束时间]",
      "探索目标：[具体功能模块]",
      "测试环境：[设备/系统/网络]",
      "发现问题：[问题描述]",
      "重现步骤：[操作步骤]",
      "风险评估：[影响范围和严重程度]",
      "后续建议：[需要深入测试的方向]"
    ]
  }
};

// 基于风险的测试
const riskBasedTesting = {
  description: "根据功能的风险等级和业务重要性分配测试资源",
  riskMatrix: [
    {
      level: "P0 - 致命风险",
      color: "destructive",
      criteria: "导致游戏无法运行、数据丢失、资金损失",
      examples: [
        "充值不到账或重复扣款",
        "账号数据丢失",
        "服务器崩溃",
        "安全漏洞（刷钻石/复制道具）",
        "核心玩法功能完全失效"
      ],
      testStrategy: "100%覆盖 + 自动化回归 + 多轮验证",
      frequency: "每次发版必测"
    },
    {
      level: "P1 - 严重风险",
      color: "warning",
      criteria: "核心功能异常，严重影响用户体验",
      examples: [
        "战斗系统数值异常",
        "活动奖励发放错误",
        "排行榜数据错误",
        "匹配系统失效",
        "社交功能异常"
      ],
      testStrategy: "核心场景100%覆盖 + 自动化",
      frequency: "每次发版必测"
    },
    {
      level: "P2 - 一般风险",
      color: "secondary",
      criteria: "功能有缺陷但可绕过，轻微影响体验",
      examples: [
        "UI显示错位",
        "非核心任务异常",
        "音效/动画缺失",
        "辅助功能失效",
        "部分机型适配问题"
      ],
      testStrategy: "主要场景覆盖 + 抽样验证",
      frequency: "版本回归时测试"
    },
    {
      level: "P3 - 轻微风险",
      color: "outline",
      criteria: "几乎不影响使用的小问题",
      examples: [
        "文案错别字",
        "图标细节问题",
        "非主流机型兼容",
        "极端操作下的小瑕疵"
      ],
      testStrategy: "有时间时覆盖",
      frequency: "大版本时关注"
    }
  ],
  gameModuleRisk: [
    { module: "充值系统", risk: "P0", reason: "直接涉及资金安全" },
    { module: "账号系统", risk: "P0", reason: "用户资产关联" },
    { module: "战斗核心", risk: "P1", reason: "游戏核心体验" },
    { module: "抽卡系统", risk: "P1", reason: "付费转化关键" },
    { module: "排行榜", risk: "P1", reason: "竞技公平性" },
    { module: "任务系统", risk: "P2", reason: "引导和留存" },
    { module: "成就系统", risk: "P2", reason: "长期激励" },
    { module: "设置功能", risk: "P3", reason: "辅助功能" },
    { module: "公告系统", risk: "P3", reason: "信息展示" }
  ]
};

// 游戏行业验收项
const acceptanceCriteria = {
  categories: [
    {
      name: "功能验收",
      icon: CheckCircle2,
      items: [
        { item: "核心玩法功能完整可用", must: true },
        { item: "新手引导流程无阻断", must: true },
        { item: "充值和购买流程正常", must: true },
        { item: "任务系统正常触发和完成", must: true },
        { item: "背包/仓库操作无异常", must: true },
        { item: "社交功能（好友/公会）正常", must: false },
        { item: "活动入口和奖励正确", must: true },
        { item: "跨服/匹配功能正常", must: false }
      ]
    },
    {
      name: "性能验收",
      icon: Zap,
      items: [
        { item: "启动时间 ≤ 5秒（热启动）", must: true },
        { item: "场景切换 ≤ 3秒", must: true },
        { item: "战斗帧率 ≥ 30FPS", must: true },
        { item: "内存占用 ≤ 1.5GB", must: true },
        { item: "包体大小符合预期", must: true },
        { item: "4小时游戏无明显卡顿", must: false },
        { item: "弱网环境可正常游戏", must: true }
      ]
    },
    {
      name: "兼容性验收",
      icon: Smartphone,
      items: [
        { item: "主流机型TOP20覆盖", must: true },
        { item: "Android 8.0+ 系统支持", must: true },
        { item: "iOS 12.0+ 系统支持", must: true },
        { item: "不同分辨率适配正常", must: true },
        { item: "刘海屏/挖孔屏适配", must: true },
        { item: "折叠屏适配", must: false },
        { item: "平板设备适配", must: false }
      ]
    },
    {
      name: "安全验收",
      icon: Shield,
      items: [
        { item: "无明显外挂漏洞", must: true },
        { item: "协议加密传输", must: true },
        { item: "敏感数据不落地", must: true },
        { item: "防内存修改保护", must: true },
        { item: "反调试/反注入", must: false },
        { item: "渠道包签名校验", must: true }
      ]
    },
    {
      name: "数据验收",
      icon: TrendingUp,
      items: [
        { item: "埋点数据上报正确", must: true },
        { item: "关键行为有日志记录", must: true },
        { item: "支付数据对账准确", must: true },
        { item: "在线数据统计正常", must: true },
        { item: "版本号正确标识", must: true }
      ]
    }
  ]
};

// 平台特性测试
const platformSpecificTests = {
  platforms: [
    {
      name: "Android APK",
      icon: Smartphone,
      focus: [
        "各渠道包安装与更新",
        "后台运行与唤醒",
        "存储权限与相册访问",
        "推送通知接收",
        "分享到微信/QQ",
        "安卓分屏模式"
      ],
      tools: ["ADB命令", "Android Studio", "DDMS", "Charles抓包"],
      commonIssues: [
        "机型适配问题",
        "渠道SDK接入异常",
        "64/32位兼容",
        "存储路径权限"
      ]
    },
    {
      name: "iOS IPA",
      icon: Smartphone,
      focus: [
        "App Store审核合规",
        "内购(IAP)流程",
        "TestFlight分发",
        "后台挂起与恢复",
        "推送证书配置",
        "Sign in with Apple"
      ],
      tools: ["Xcode", "Instruments", "TestFlight", "Charles抓包"],
      commonIssues: [
        "审核被拒问题",
        "证书过期",
        "IAP掉单",
        "推送失效"
      ]
    },
    {
      name: "PC客户端",
      icon: Monitor,
      focus: [
        "安装卸载流程",
        "自动更新机制",
        "窗口化/全屏切换",
        "多显示器支持",
        "键鼠操作响应",
        "手柄支持"
      ],
      tools: ["Process Monitor", "Wireshark", "Visual Studio"],
      commonIssues: [
        "DLL缺失",
        "防火墙拦截",
        "显卡驱动兼容",
        "管理员权限"
      ]
    },
    {
      name: "H5/Web",
      icon: Globe,
      focus: [
        "主流浏览器兼容",
        "微信/QQ内置浏览器",
        "触屏与PC端适配",
        "资源加载优化",
        "本地存储管理",
        "分享与社交回调"
      ],
      tools: ["Chrome DevTools", "Lighthouse", "Fiddler", "BrowserStack"],
      commonIssues: [
        "跨域问题",
        "缓存策略",
        "WebGL支持",
        "音频自动播放限制"
      ]
    }
  ]
};

// 常见游戏模块测试要点
const gameModuleTests = [
  {
    module: "登录注册",
    icon: Users,
    testPoints: [
      "第三方登录（微信/QQ/Apple/Google）",
      "游客登录与账号绑定",
      "多设备登录互踢",
      "账号封禁与申诉",
      "密码找回流程"
    ]
  },
  {
    module: "战斗系统",
    icon: Swords,
    testPoints: [
      "技能释放与CD计算",
      "伤害公式验证",
      "Buff/Debuff叠加",
      "AI行为逻辑",
      "战斗结算与奖励"
    ]
  },
  {
    module: "背包系统",
    icon: Package,
    testPoints: [
      "物品获取与消耗",
      "堆叠上限测试",
      "背包满时处理",
      "物品排序与筛选",
      "跨系统物品同步"
    ]
  },
  {
    module: "充值商城",
    icon: Coins,
    testPoints: [
      "商品价格显示",
      "购买流程完整性",
      "掉单补发机制",
      "首充/月卡逻辑",
      "限购与库存"
    ]
  },
  {
    module: "抽卡系统",
    icon: Gift,
    testPoints: [
      "概率公示核验",
      "保底机制验证",
      "十连抽逻辑",
      "卡池切换",
      "抽卡记录"
    ]
  },
  {
    module: "排行榜",
    icon: Trophy,
    testPoints: [
      "数据实时性",
      "排名计算规则",
      "榜单分段显示",
      "历史记录保留",
      "作弊检测"
    ]
  },
  {
    module: "成就系统",
    icon: Star,
    testPoints: [
      "成就触发条件",
      "进度累计正确",
      "奖励领取",
      "隐藏成就",
      "成就广播"
    ]
  },
  {
    module: "活动系统",
    icon: Clock,
    testPoints: [
      "活动开启/关闭时间",
      "奖励发放正确",
      "进度保存",
      "跨天/跨周重置",
      "活动互斥处理"
    ]
  }
];

// 专项测试 - 弱网测试
const weakNetworkTesting = {
  description: "针对移动网络不稳定场景的专项测试，确保游戏在弱网环境下的用户体验和数据安全",
  networkConditions: [
    {
      type: "2G网络 (GPRS/EDGE)",
      latency: "300-1000ms",
      bandwidth: "50-250 Kbps",
      packetLoss: "5-10%",
      scenarios: ["登录流程", "基础功能操作", "文本类消息"],
      expectedBehavior: "可使用基础功能，大量资源加载需进度提示"
    },
    {
      type: "3G网络 (HSPA)",
      latency: "100-500ms",
      bandwidth: "1-5 Mbps",
      packetLoss: "1-5%",
      scenarios: ["战斗操作", "即时通讯", "小额充值"],
      expectedBehavior: "核心功能可用，可能有轻微延迟感"
    },
    {
      type: "弱4G/信号边缘",
      latency: "50-200ms",
      bandwidth: "5-10 Mbps",
      packetLoss: "0.5-2%",
      scenarios: ["多人实时对战", "资源下载", "直播功能"],
      expectedBehavior: "大部分功能正常，偶发卡顿可接受"
    },
    {
      type: "网络抖动",
      latency: "波动大于100ms",
      bandwidth: "不稳定",
      packetLoss: "随机丢包",
      scenarios: ["竞技对战", "交易操作", "实时语音"],
      expectedBehavior: "需有重连机制和状态恢复"
    },
    {
      type: "网络切换",
      latency: "切换时延",
      bandwidth: "变化",
      packetLoss: "切换时可能中断",
      scenarios: ["WiFi↔4G切换", "跨基站切换", "地铁/电梯场景"],
      expectedBehavior: "无感知切换，或友好断线重连提示"
    }
  ],
  testScenarios: [
    {
      category: "登录认证",
      icon: Users,
      cases: [
        { scenario: "弱网登录", steps: "限速100Kbps环境下登录游戏", expected: "登录超时提示友好，支持重试，不出现ANR", priority: "P0" },
        { scenario: "登录中断网", steps: "登录过程中切换飞行模式", expected: "请求终止，提示网络异常，可重试", priority: "P0" },
        { scenario: "token续期弱网", steps: "token即将过期时限速1Mbps", expected: "续期成功或提示重新登录，不闪退", priority: "P1" },
        { scenario: "多点登录弱网", steps: "A设备弱网时B设备登录", expected: "A设备收到踢出通知（可延迟），状态正确", priority: "P1" }
      ]
    },
    {
      category: "战斗系统",
      icon: Swords,
      cases: [
        { scenario: "战斗中高延迟", steps: "PVE战斗中模拟500ms延迟", expected: "操作响应延迟但流畅，伤害计算服务端为准", priority: "P0" },
        { scenario: "战斗中断网", steps: "BOSS战关键时刻断网3秒", expected: "断线重连后战斗状态恢复，不丢失进度", priority: "P0" },
        { scenario: "PVP高丢包", steps: "实时对战中模拟10%丢包", expected: "有位置补偿，操作可能延迟但不乱序", priority: "P0" },
        { scenario: "技能释放弱网", steps: "释放技能时网络延迟500ms", expected: "技能正常释放，不出现双重消耗或无效果", priority: "P1" },
        { scenario: "战斗结算断网", steps: "胜利结算时断网", expected: "本地缓存结果，恢复后同步，奖励不丢失", priority: "P0" }
      ]
    },
    {
      category: "充值交易",
      icon: CreditCard,
      cases: [
        { scenario: "支付过程断网", steps: "点击支付后立即断网", expected: "订单创建失败提示，不扣款不发货", priority: "P0" },
        { scenario: "支付回调延迟", steps: "模拟支付成功但回调延迟60秒", expected: "轮询确认机制，最终正确到账", priority: "P0" },
        { scenario: "弱网购买道具", steps: "200Kbps环境购买道具", expected: "购买成功或失败明确提示，不重复购买", priority: "P0" },
        { scenario: "连续购买弱网", steps: "弱网快速点击购买3次", expected: "防重机制生效，只成功1次", priority: "P0" }
      ]
    },
    {
      category: "数据同步",
      icon: RefreshCw,
      cases: [
        { scenario: "背包数据弱网同步", steps: "弱网获取大量道具", expected: "分批同步，有进度展示，最终数据一致", priority: "P1" },
        { scenario: "离线数据合并", steps: "离线完成任务后恢复网络", expected: "数据正确合并，无冲突", priority: "P1" },
        { scenario: "排行榜弱网加载", steps: "500Kbps加载500人排行榜", expected: "分页加载，有骨架屏，不阻塞操作", priority: "P2" },
        { scenario: "邮件弱网领取", steps: "弱网批量领取100封邮件", expected: "逐条领取，失败可重试，不丢附件", priority: "P1" }
      ]
    }
  ],
  testTools: [
    { name: "Charles Proxy", usage: "设置Throttle模拟弱网，支持自定义带宽/延迟/丢包", platform: "iOS/Android/PC" },
    { name: "Network Link Conditioner", usage: "Apple官方弱网工具，预设多种网络环境", platform: "iOS/Mac" },
    { name: "ATC (Augmented Traffic Control)", usage: "Facebook开源，支持大规模弱网模拟", platform: "Android/Linux" },
    { name: "Fiddler", usage: "可模拟延迟和限速，适合接口级测试", platform: "Windows" },
    { name: "clumsy", usage: "Windows下模拟丢包、延迟、乱序", platform: "Windows" },
    { name: "Android Emulator", usage: "内置网络限速功能", platform: "Android" }
  ],
  checklist: [
    "所有P0场景在2G环境下验证通过",
    "核心交易流程有超时和重试机制",
    "断线重连机制验证（5秒/10秒/30秒断线）",
    "数据一致性校验（弱网操作后强网校验）",
    "客户端不因网络问题闪退或ANR",
    "友好的网络异常提示，非技术术语",
    "关键操作有本地缓存和恢复机制",
    "支付等敏感操作有防重复提交保护"
  ]
};

// 专项测试 - 安全测试
const securityTesting = {
  description: "游戏安全测试覆盖客户端安全、通信安全、服务端安全、业务逻辑安全等多个层面",
  categories: [
    {
      name: "客户端安全",
      icon: Smartphone,
      tests: [
        {
          item: "反编译防护",
          description: "检查APK/IPA是否可被轻易反编译获取源码",
          testMethod: "使用jadx/IDA Pro/Hopper反编译，检查代码混淆程度",
          riskLevel: "P0",
          realCase: "某游戏APK未加固，被反编译后修改充值金额参数，绕过支付"
        },
        {
          item: "内存数据保护",
          description: "检查内存中敏感数据（金币、生命值等）是否加密",
          testMethod: "使用GameGuardian/Cheat Engine搜索并修改内存数值",
          riskLevel: "P0",
          realCase: "MMORPG游戏内存中金币明文存储，修改后服务端未校验导致刷钱"
        },
        {
          item: "本地存档安全",
          description: "检查本地存储的游戏数据是否加密",
          testMethod: "查看SharedPreferences/SQLite/PlayerPrefs文件，尝试篡改",
          riskLevel: "P1",
          realCase: "单机游戏存档未加密，修改关卡解锁状态绕过付费"
        },
        {
          item: "二次打包检测",
          description: "检查是否能重新签名后运行",
          testMethod: "修改APK后重新签名安装，检查是否有签名校验",
          riskLevel: "P0",
          realCase: "游戏被重打包植入广告SDK，损害玩家利益"
        },
        {
          item: "调试器检测",
          description: "检查是否允许动态调试",
          testMethod: "使用Frida/Xposed hook关键函数，检查是否有反调试",
          riskLevel: "P1",
          realCase: "通过动态调试绕过游戏内购验证"
        },
        {
          item: "Root/越狱检测",
          description: "检查设备root/越狱状态检测机制",
          testMethod: "在root设备上运行，检查是否有检测和限制",
          riskLevel: "P2",
          realCase: "root设备可运行各类作弊工具"
        }
      ]
    },
    {
      name: "通信安全",
      icon: Wifi,
      tests: [
        {
          item: "协议加密",
          description: "检查客户端与服务端通信是否加密",
          testMethod: "抓包分析请求/响应数据，检查是否为明文",
          riskLevel: "P0",
          realCase: "游戏协议明文传输，中间人攻击可窃取账号"
        },
        {
          item: "证书校验",
          description: "检查HTTPS证书验证是否严格",
          testMethod: "使用自签名证书代理，检查是否信任",
          riskLevel: "P0",
          realCase: "未做证书绑定，公共WiFi下可中间人攻击"
        },
        {
          item: "协议重放防护",
          description: "检查请求是否可被重放攻击",
          testMethod: "抓取正常请求，多次重放观察是否生效",
          riskLevel: "P0",
          realCase: "道具购买请求可重放，一次付费多次获得道具"
        },
        {
          item: "协议篡改防护",
          description: "检查请求参数是否可被篡改",
          testMethod: "修改请求中的金额/数量参数，检查服务端校验",
          riskLevel: "P0",
          realCase: "修改购买数量参数为负数，反向获得金币"
        },
        {
          item: "时间戳校验",
          description: "检查请求时效性验证",
          testMethod: "修改请求时间戳或延迟发送过期请求",
          riskLevel: "P1",
          realCase: "无时间校验，录制的请求可无限重放"
        },
        {
          item: "敏感数据传输",
          description: "检查敏感信息（密码、token）传输安全",
          testMethod: "抓包查看登录、支付等敏感接口数据",
          riskLevel: "P0",
          realCase: "密码MD5传输未加盐，彩虹表可破解"
        }
      ]
    },
    {
      name: "服务端安全",
      icon: Database,
      tests: [
        {
          item: "接口鉴权",
          description: "检查API是否有权限验证",
          testMethod: "无token或错误token调用接口，检查返回",
          riskLevel: "P0",
          realCase: "管理后台接口无鉴权，可直接调用发放道具"
        },
        {
          item: "越权访问",
          description: "检查是否可访问他人数据",
          testMethod: "修改用户ID参数访问其他玩家数据",
          riskLevel: "P0",
          realCase: "修改player_id可查看/修改他人背包数据"
        },
        {
          item: "SQL注入",
          description: "检查输入参数SQL注入风险",
          testMethod: "在输入框注入SQL语句，观察报错或异常行为",
          riskLevel: "P0",
          realCase: "角色名包含SQL语句导致删库事故"
        },
        {
          item: "数值校验",
          description: "检查服务端数值边界校验",
          testMethod: "发送超大/负数/浮点数参数，检查处理",
          riskLevel: "P0",
          realCase: "购买数量传入-1，金币反加不扣道具"
        },
        {
          item: "并发安全",
          description: "检查并发请求的处理",
          testMethod: "同一操作并发请求10次，检查结果一致性",
          riskLevel: "P0",
          realCase: "奖励领取接口并发调用，领取10次奖励"
        },
        {
          item: "日志安全",
          description: "检查日志是否泄露敏感信息",
          testMethod: "查看服务端日志是否包含密码、token等",
          riskLevel: "P1",
          realCase: "错误日志打印完整支付请求含用户隐私"
        }
      ]
    },
    {
      name: "业务逻辑安全",
      icon: ShieldCheck,
      tests: [
        {
          item: "道具复制漏洞",
          description: "检查是否可通过操作复制道具",
          testMethod: "交易/邮寄过程中异常操作，检查道具数量",
          riskLevel: "P0",
          realCase: "交易时双方同时取消，道具同时存在于两人背包"
        },
        {
          item: "货币生成漏洞",
          description: "检查是否可非法生成游戏货币",
          testMethod: "检查所有货币获取途径的校验逻辑",
          riskLevel: "P0",
          realCase: "活动奖励发放与活动条件检查不同步，重复领取"
        },
        {
          item: "抽卡概率验证",
          description: "验证抽卡实际概率与公示一致",
          testMethod: "大量抽卡统计实际概率，与公示对比",
          riskLevel: "P1",
          realCase: "实际5星概率0.3%，公示0.6%，涉嫌欺诈"
        },
        {
          item: "活动时间绕过",
          description: "检查是否可绕过活动时间限制",
          testMethod: "修改设备时间或时区，尝试参与未开始/已结束活动",
          riskLevel: "P1",
          realCase: "修改时区提前进入限时活动领取奖励"
        },
        {
          item: "排行榜作弊",
          description: "检查排行榜分数是否可伪造",
          testMethod: "检查分数上报接口的校验机制",
          riskLevel: "P1",
          realCase: "直接调用接口上报超高分数，占据榜首"
        },
        {
          item: "邀请奖励滥用",
          description: "检查邀请系统的防刷机制",
          testMethod: "自己邀请自己、使用模拟器批量注册",
          riskLevel: "P1",
          realCase: "批量注册小号完成邀请任务刷奖励"
        }
      ]
    }
  ],
  penetrationTestFlow: [
    { step: 1, name: "信息收集", tasks: ["确定测试范围", "收集APK/IPA", "抓包分析协议", "识别技术栈"] },
    { step: 2, name: "客户端分析", tasks: ["反编译分析", "本地存储检查", "加固识别", "hook点定位"] },
    { step: 3, name: "协议分析", tasks: ["加密方式识别", "签名算法分析", "关键接口梳理", "参数含义推断"] },
    { step: 4, name: "漏洞挖掘", tasks: ["协议篡改测试", "重放攻击测试", "并发测试", "逻辑漏洞测试"] },
    { step: 5, name: "漏洞验证", tasks: ["构造POC", "影响评估", "复现记录", "修复建议"] },
    { step: 6, name: "报告输出", tasks: ["漏洞详情", "风险等级", "修复方案", "验证方法"] }
  ],
  commonTools: [
    { category: "抓包工具", tools: ["Charles", "Fiddler", "Wireshark", "mitmproxy"] },
    { category: "反编译工具", tools: ["jadx", "IDA Pro", "Hopper", "JEB"] },
    { category: "动态调试", tools: ["Frida", "Xposed", "Objection", "Cycript"] },
    { category: "内存修改", tools: ["GameGuardian", "Cheat Engine", "iGameGuardian"] },
    { category: "自动化工具", tools: ["Burp Suite", "SQLMap", "OWASP ZAP"] }
  ]
};

// 专项测试 - 支付测试
const paymentTesting = {
  description: "游戏支付测试是资金安全的核心保障，覆盖支付流程、异常处理、对账核验等关键环节",
  paymentChannels: [
    { channel: "Apple IAP", features: ["苹果内购", "自动续订", "恢复购买"], notes: "沙盒测试账号，注意30%分成" },
    { channel: "Google Play", features: ["Google Pay", "订阅", "促销代码"], notes: "测试信用卡，测试环境可真实支付" },
    { channel: "微信支付", features: ["APP支付", "H5支付", "小程序支付"], notes: "沙盒环境1分钱测试" },
    { channel: "支付宝", features: ["APP支付", "H5支付", "花呗"], notes: "沙盒账号测试" },
    { channel: "渠道支付", features: ["华为支付", "OPPO支付", "小米支付"], notes: "各渠道SDK单独对接测试" },
    { channel: "第三方聚合", features: ["Ping++", "易宝", "PayPal"], notes: "统一接入多渠道" }
  ],
  testScenarios: [
    {
      category: "正常支付流程",
      icon: CheckCircle2,
      cases: [
        { id: "PAY-001", scenario: "首次充值", steps: "新用户首次购买6元档位", expected: "支付成功，道具到账，首充奖励触发", priority: "P0" },
        { id: "PAY-002", scenario: "常规充值", steps: "已购用户购买30元档位", expected: "支付成功，道具数量正确", priority: "P0" },
        { id: "PAY-003", scenario: "最大额充值", steps: "购买648元档位", expected: "支付成功，赠送道具正确计算", priority: "P0" },
        { id: "PAY-004", scenario: "连续充值", steps: "30秒内购买3次不同档位", expected: "3笔订单独立处理，均正确到账", priority: "P0" },
        { id: "PAY-005", scenario: "月卡购买", steps: "购买30元月卡", expected: "立即到账首日钻石，后续每日可领", priority: "P0" },
        { id: "PAY-006", scenario: "订阅续费", steps: "自动续订周卡/月卡", expected: "到期自动扣款，权益延续", priority: "P1" }
      ]
    },
    {
      category: "支付异常处理",
      icon: AlertCircle,
      cases: [
        { id: "PAY-101", scenario: "支付取消", steps: "唤起支付后点击取消", expected: "订单关闭，可重新发起", priority: "P0" },
        { id: "PAY-102", scenario: "支付超时", steps: "唤起支付后等待超时（通常15分钟）", expected: "订单关闭，提示支付超时", priority: "P1" },
        { id: "PAY-103", scenario: "余额不足", steps: "账户余额不足时支付", expected: "支付渠道提示余额不足", priority: "P1" },
        { id: "PAY-104", scenario: "支付密码错误", steps: "故意输入错误支付密码", expected: "支付失败，订单可重试", priority: "P1" },
        { id: "PAY-105", scenario: "网络中断", steps: "点击支付后立即断网", expected: "支付失败或待确认，不重复扣款", priority: "P0" },
        { id: "PAY-106", scenario: "支付中杀进程", steps: "支付页面强制关闭APP", expected: "回来后订单状态正确，已付款则补发", priority: "P0" },
        { id: "PAY-107", scenario: "重复点击支付", steps: "快速多次点击支付按钮", expected: "只生成一笔订单，防重机制生效", priority: "P0" }
      ]
    },
    {
      category: "掉单补发",
      icon: RefreshCw,
      cases: [
        { id: "PAY-201", scenario: "回调延迟", steps: "支付成功但回调延迟5分钟", expected: "轮询机制补发，最终到账", priority: "P0" },
        { id: "PAY-202", scenario: "回调失败重试", steps: "模拟回调接口返回失败", expected: "支付渠道重试，最终成功", priority: "P0" },
        { id: "PAY-203", scenario: "手动补发", steps: "确认支付成功但未到账，触发补发", expected: "客服后台可查询并补发", priority: "P0" },
        { id: "PAY-204", scenario: "重复回调", steps: "同一订单回调推送2次", expected: "幂等处理，只发一次货", priority: "P0" },
        { id: "PAY-205", scenario: "订单状态查询", steps: "主动查询订单状态", expected: "返回准确的支付状态", priority: "P1" }
      ]
    },
    {
      category: "退款处理",
      icon: Banknote,
      cases: [
        { id: "PAY-301", scenario: "苹果退款", steps: "通过Apple申请退款", expected: "收到退款通知，扣除对应道具或负值", priority: "P0" },
        { id: "PAY-302", scenario: "Google退款", steps: "通过Google Play退款", expected: "Voided Purchase回调处理", priority: "P0" },
        { id: "PAY-303", scenario: "恶意退款", steps: "购买后使用道具再退款", expected: "道具余额变负或封号处理", priority: "P0" },
        { id: "PAY-304", scenario: "订阅取消", steps: "取消自动续订", expected: "当前周期结束后不再扣款", priority: "P1" },
        { id: "PAY-305", scenario: "恢复购买", steps: "iOS恢复购买功能", expected: "正确恢复已购非消耗品", priority: "P1" }
      ]
    },
    {
      category: "安全验证",
      icon: Shield,
      cases: [
        { id: "PAY-401", scenario: "伪造支付回调", steps: "构造虚假支付成功回调", expected: "签名验证失败，拒绝处理", priority: "P0" },
        { id: "PAY-402", scenario: "篡改金额", steps: "修改订单金额为1分", expected: "金额校验失败，拒绝发货", priority: "P0" },
        { id: "PAY-403", scenario: "订单号伪造", steps: "使用已完成的订单号重复请求", expected: "订单已处理，不重复发货", priority: "P0" },
        { id: "PAY-404", scenario: "越权购买", steps: "修改user_id参数购买", expected: "权限校验，只能为自己购买", priority: "P0" },
        { id: "PAY-405", scenario: "沙盒环境穿透", steps: "沙盒订单提交到生产环境", expected: "环境校验，沙盒订单不发货", priority: "P0" }
      ]
    },
    {
      category: "对账核验",
      icon: Receipt,
      cases: [
        { id: "PAY-501", scenario: "日对账", steps: "每日核对订单与发货记录", expected: "订单金额、数量与渠道一致", priority: "P0" },
        { id: "PAY-502", scenario: "差异订单", steps: "发现对账差异订单", expected: "有差异告警和处理流程", priority: "P0" },
        { id: "PAY-503", scenario: "渠道账单核对", steps: "与支付渠道账单核对", expected: "金额、手续费、结算额正确", priority: "P1" },
        { id: "PAY-504", scenario: "退款对账", steps: "核对退款订单和道具回收", expected: "退款订单有对应的扣除记录", priority: "P1" }
      ]
    }
  ],
  keyCheckpoints: [
    { checkpoint: "订单创建", validations: ["用户身份校验", "商品有效性", "价格一致性", "库存检查", "购买限制"], risk: "订单伪造、价格篡改" },
    { checkpoint: "支付唤起", validations: ["金额传递正确", "订单号唯一", "签名正确", "超时设置"], risk: "金额不一致、重复订单" },
    { checkpoint: "支付完成", validations: ["回调签名验证", "订单状态检查", "金额比对", "幂等处理"], risk: "伪造回调、重复发货" },
    { checkpoint: "道具发放", validations: ["用户正确", "道具正确", "数量正确", "发放记录"], risk: "发错人、发错物、发错量" },
    { checkpoint: "数据记录", validations: ["支付流水", "道具日志", "用户余额", "统计数据"], risk: "数据丢失、统计不准" }
  ],
  sandboxTestGuide: [
    { platform: "Apple", steps: ["创建沙盒测试账号", "设备登录沙盒账号", "App内购买使用沙盒账号", "沙盒账号免真实扣款"], notes: "沙盒环境速度较慢，订阅测试时间压缩" },
    { platform: "Google", steps: ["添加测试账号到Play Console", "上传APK到内部测试", "使用测试账号购买", "测试卡支付"], notes: "许可测试可测试完整流程" },
    { platform: "微信支付", steps: ["开通沙盒环境", "获取沙盒密钥", "调用沙盒接口", "固定金额测试"], notes: "仿真系统模拟支付" },
    { platform: "支付宝", steps: ["下载沙盒支付宝", "配置沙盒账号", "使用沙盒环境调用", "沙盒账号登录"], notes: "沙盒APP与正式版独立" }
  ],
  riskReminders: [
    "严禁使用真实资金测试，所有测试必须在沙盒环境进行",
    "测试账号与正式账号严格隔离",
    "支付日志保留完整，便于问题追溯",
    "回调接口必须验证签名，防止伪造",
    "订单处理必须保证幂等性，防止重复发货",
    "关键支付逻辑服务端校验，不信任客户端",
    "异常订单有告警机制，及时人工介入",
    "定期对账，发现差异立即处理"
  ]
};

const GameTestingReference = () => {
  const [expandedTechnique, setExpandedTechnique] = useState<string | null>(null);
  const [expandedCharter, setExpandedCharter] = useState<string | null>(null);

  return (
    <ToolLayout
      title="游戏测试技术文档"
      description="SaaS游戏平台与应用测试方法论，包含黑盒测试技术、探索式测试、风险测试及行业最佳实践"
      icon={Gamepad2}
    >
      {/* 导出模板区域 */}
      <Card className="border-primary/20 mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                测试用例模板导出
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                下载游戏测试用例模板，支持Excel和Markdown格式
              </p>
            </div>
            <TestCaseExporter />
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="blackbox" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="blackbox" className="text-xs md:text-sm">黑盒测试技术</TabsTrigger>
          <TabsTrigger value="exploratory" className="text-xs md:text-sm">探索式测试</TabsTrigger>
          <TabsTrigger value="risk" className="text-xs md:text-sm">风险测试</TabsTrigger>
          <TabsTrigger value="specialized" className="text-xs md:text-sm">专项测试</TabsTrigger>
          <TabsTrigger value="acceptance" className="text-xs md:text-sm">验收标准</TabsTrigger>
          <TabsTrigger value="modules" className="text-xs md:text-sm">模块测试</TabsTrigger>
        </TabsList>

        {/* 黑盒测试技术 */}
        <TabsContent value="blackbox" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Box className="h-5 w-5 text-primary" />
                黑盒测试技术
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                基于软件外部行为的测试方法，不关注内部代码实现，专注于输入输出验证
              </p>
            </CardHeader>
          </Card>

          {blackBoxTechniques.map((technique) => (
            <Collapsible
              key={technique.id}
              open={expandedTechnique === technique.id}
              onOpenChange={(open) => setExpandedTechnique(open ? technique.id : null)}
            >
              <Card className="border-border/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <technique.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{technique.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{technique.description}</p>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedTechnique === technique.id ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-0">
                    {/* 原则 */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        核心原则
                      </h4>
                      <div className="grid gap-2">
                        {technique.principles.map((principle, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{principle}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 游戏行业示例 */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4 text-primary" />
                        游戏行业示例
                      </h4>
                      
                      {technique.id === "equivalence" && technique.gameExamples && (
                        <div className="space-y-4">
                          {technique.gameExamples.map((example, idx) => (
                            <Card key={idx} className="bg-muted/30">
                              <CardContent className="pt-4">
                                <h5 className="font-medium text-sm mb-3">{example.scenario}</h5>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Badge variant="secondary" className="mb-2">有效等价类</Badge>
                                    <div className="space-y-2">
                                      {example.validClasses.map((vc, i) => (
                                        <div key={i} className="text-xs p-2 bg-background rounded border border-green-500/20">
                                          <div className="font-medium text-green-600">{vc.class}</div>
                                          <div className="text-muted-foreground">测试值: {vc.testValue}</div>
                                          <div className="text-muted-foreground">{vc.description}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <Badge variant="destructive" className="mb-2">无效等价类</Badge>
                                    <div className="space-y-2">
                                      {example.invalidClasses.map((ic, i) => (
                                        <div key={i} className="text-xs p-2 bg-background rounded border border-destructive/20">
                                          <div className="font-medium text-destructive">{ic.class}</div>
                                          <div className="text-muted-foreground">测试值: {ic.testValue}</div>
                                          <div className="text-muted-foreground">{ic.description}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {technique.id === "boundary" && technique.gameExamples && (
                        <div className="space-y-4">
                          {technique.gameExamples.map((example, idx) => (
                            <Card key={idx} className="bg-muted/30">
                              <CardContent className="pt-4">
                                <h5 className="font-medium text-sm mb-3">{example.scenario}</h5>
                                <div className="space-y-3">
                                  {example.boundaries.map((b, i) => (
                                    <div key={i} className="text-xs p-3 bg-background rounded border">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">{b.point}</Badge>
                                      </div>
                                      <div className="grid grid-cols-3 gap-2 mb-2">
                                        {b.testValues.map((v, j) => (
                                          <div key={j} className="text-center p-1.5 bg-muted rounded text-xs font-mono">{v}</div>
                                        ))}
                                      </div>
                                      <div className="text-muted-foreground">{b.expected}</div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {technique.id === "decision-table" && technique.gameExamples && (
                        <div className="space-y-4">
                          {technique.gameExamples.map((example, idx) => (
                            <Card key={idx} className="bg-muted/30">
                              <CardContent className="pt-4">
                                <h5 className="font-medium text-sm mb-3">{example.scenario}</h5>
                                <div className="mb-3">
                                  <span className="text-xs text-muted-foreground">条件：</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {example.conditions.map((c, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <ScrollArea className="w-full">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b">
                                        {example.conditions.map((c, i) => (
                                          <th key={i} className="p-2 text-left font-medium">{c}</th>
                                        ))}
                                        <th className="p-2 text-left font-medium">动作</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {example.rules.map((rule, i) => (
                                        <tr key={i} className="border-b last:border-0">
                                          {rule.conditions.map((c, j) => (
                                            <td key={j} className="p-2">
                                              <span className={c === "Y" ? "text-green-600" : c === "N" ? "text-destructive" : "text-muted-foreground"}>
                                                {c}
                                              </span>
                                            </td>
                                          ))}
                                          <td className="p-2 text-muted-foreground">{rule.action}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </ScrollArea>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {technique.id === "cause-effect" && technique.gameExamples && (
                        <div className="space-y-4">
                          {technique.gameExamples.map((example, idx) => (
                            <Card key={idx} className="bg-muted/30">
                              <CardContent className="pt-4">
                                <h5 className="font-medium text-sm mb-3">{example.scenario}</h5>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <span className="text-xs font-medium">原因（Causes）</span>
                                    <div className="space-y-1 mt-2">
                                      {example.causes.map((c) => (
                                        <div key={c.id} className="text-xs flex items-center gap-2">
                                          <Badge variant="outline" className="font-mono">{c.id}</Badge>
                                          <span className="text-muted-foreground">{c.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-xs font-medium">结果（Effects）</span>
                                    <div className="space-y-1 mt-2">
                                      {example.effects.map((e) => (
                                        <div key={e.id} className="text-xs flex items-center gap-2">
                                          <Badge variant="secondary" className="font-mono">{e.id}</Badge>
                                          <span className="text-muted-foreground">{e.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-xs font-medium">因果关系</span>
                                  <div className="space-y-2 mt-2">
                                    {example.relations.map((r, i) => (
                                      <div key={i} className="text-xs p-2 bg-background rounded border flex items-start gap-2">
                                        <Badge variant="outline">{r.type}</Badge>
                                        <span className="text-muted-foreground">{r.description}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 检查清单 */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        测试检查清单
                      </h4>
                      <div className="grid gap-2">
                        {technique.checklist.map((item, idx) => (
                          <label key={idx} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                            <input type="checkbox" className="rounded" />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </TabsContent>

        {/* 探索式测试 */}
        <TabsContent value="exploratory" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5 text-primary" />
                探索式测试 (Exploratory Testing)
              </CardTitle>
              <p className="text-sm text-muted-foreground">{exploratoryTesting.description}</p>
            </CardHeader>
          </Card>

          {exploratoryTesting.charters.map((charter) => (
            <Collapsible
              key={charter.name}
              open={expandedCharter === charter.name}
              onOpenChange={(open) => setExpandedCharter(open ? charter.name : null)}
            >
              <Card className="border-border/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <charter.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-base">{charter.name}</CardTitle>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedCharter === charter.name ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    {charter.missions.map((mission, idx) => (
                      <Card key={idx} className="bg-muted/30">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <h5 className="font-medium">{mission.title}</h5>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {mission.duration}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">目标：{mission.target}</p>
                          <div className="mb-3">
                            <span className="text-xs font-medium">关注点：</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mission.focus.map((f, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium">探索场景：</span>
                            <ul className="mt-2 space-y-1">
                              {mission.scenarios.map((s, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <ArrowRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}

          {/* 会话笔记模板 */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                探索测试会话笔记模板
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 font-mono text-xs bg-background p-3 rounded border">
                {exploratoryTesting.sessionNotes.template.map((line, idx) => (
                  <div key={idx} className="text-muted-foreground">{line}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 基于风险的测试 */}
        <TabsContent value="risk" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-primary" />
                基于风险的测试 (Risk-Based Testing)
              </CardTitle>
              <p className="text-sm text-muted-foreground">{riskBasedTesting.description}</p>
            </CardHeader>
          </Card>

          {/* 风险等级矩阵 */}
          <div className="grid gap-4">
            {riskBasedTesting.riskMatrix.map((level) => (
              <Card key={level.level} className="border-border/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={level.color as "destructive" | "secondary" | "outline" | "default"} className="text-sm">
                      {level.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{level.frequency}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{level.criteria}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-xs font-medium">典型示例：</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {level.examples.map((ex, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{ex}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">测试策略：</span>
                    <span className="text-muted-foreground ml-1">{level.testStrategy}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 游戏模块风险评估 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">游戏模块风险评估表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {riskBasedTesting.gameModuleRisk.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="font-medium text-sm">{item.module}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{item.reason}</span>
                      <Badge variant={item.risk === "P0" ? "destructive" : item.risk === "P1" ? "default" : "secondary"}>
                        {item.risk}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 验收标准 */}
        <TabsContent value="acceptance" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                游戏版本验收标准
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                版本发布前的验收检查清单，区分必须项和可选项
              </p>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {acceptanceCriteria.categories.map((category) => (
              <Card key={category.name} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <category.icon className="h-4 w-4 text-primary" />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.items.map((item, idx) => (
                      <label key={idx} className="flex items-start gap-2 text-sm cursor-pointer">
                        <input type="checkbox" className="mt-1 rounded" />
                        <span className={item.must ? "" : "text-muted-foreground"}>
                          {item.item}
                          {item.must && <span className="text-destructive ml-1">*</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 平台特性测试 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">多平台测试要点</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {platformSpecificTests.platforms.map((platform) => (
                  <Card key={platform.name} className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <platform.icon className="h-5 w-5 text-primary" />
                        <h5 className="font-medium">{platform.name}</h5>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-medium">测试重点：</span>
                          <ul className="mt-1 space-y-1">
                            {platform.focus.map((f, i) => (
                              <li key={i} className="text-xs text-muted-foreground">• {f}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-xs font-medium">常用工具：</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {platform.tools.map((t, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-destructive">常见问题：</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {platform.commonIssues.map((issue, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{issue}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 专项测试 */}
        <TabsContent value="specialized" className="space-y-6">
          {/* 弱网测试 */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <WifiOff className="h-5 w-5 text-primary" />
                弱网测试专项方案
              </CardTitle>
              <p className="text-sm text-muted-foreground">{weakNetworkTesting.description}</p>
            </CardHeader>
          </Card>

          {/* 网络条件说明 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                网络环境模拟参数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {weakNetworkTesting.networkConditions.map((condition, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{condition.type}</span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">延迟: {condition.latency}</Badge>
                        <Badge variant="outline" className="text-xs">带宽: {condition.bandwidth}</Badge>
                        <Badge variant="secondary" className="text-xs">丢包: {condition.packetLoss}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{condition.expectedBehavior}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 弱网测试场景 */}
          <div className="grid gap-4">
            {weakNetworkTesting.testScenarios.map((category) => (
              <Card key={category.category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <category.icon className="h-4 w-4 text-primary" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2 text-left font-medium">场景</th>
                          <th className="p-2 text-left font-medium">测试步骤</th>
                          <th className="p-2 text-left font-medium">预期结果</th>
                          <th className="p-2 text-left font-medium">优先级</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.cases.map((testCase, idx) => (
                          <tr key={idx} className="border-b last:border-0">
                            <td className="p-2 font-medium">{testCase.scenario}</td>
                            <td className="p-2 text-muted-foreground">{testCase.steps}</td>
                            <td className="p-2 text-muted-foreground">{testCase.expected}</td>
                            <td className="p-2">
                              <Badge variant={testCase.priority === "P0" ? "destructive" : testCase.priority === "P1" ? "default" : "secondary"}>
                                {testCase.priority}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 弱网测试工具 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">弱网模拟工具</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {weakNetworkTesting.testTools.map((tool, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30 border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{tool.name}</span>
                      <Badge variant="outline" className="text-xs">{tool.platform}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{tool.usage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 弱网测试检查清单 */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                弱网测试检查清单
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                {weakNetworkTesting.checklist.map((item, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-muted-foreground">{item}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 安全测试 */}
          <Card className="border-destructive/20 mt-8">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-destructive" />
                安全测试专项方案
              </CardTitle>
              <p className="text-sm text-muted-foreground">{securityTesting.description}</p>
            </CardHeader>
          </Card>

          {/* 安全测试分类 */}
          {securityTesting.categories.map((category) => (
            <Card key={category.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <category.icon className="h-4 w-4 text-primary" />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.tests.map((test, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/30 border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{test.item}</span>
                        <Badge variant={test.riskLevel === "P0" ? "destructive" : test.riskLevel === "P1" ? "default" : "secondary"}>
                          {test.riskLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                      <div className="grid gap-2 text-xs">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0">测试方法</Badge>
                          <span className="text-muted-foreground">{test.testMethod}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="secondary" className="shrink-0">真实案例</Badge>
                          <span className="text-destructive/80">{test.realCase}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* 渗透测试流程 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bug className="h-4 w-4 text-primary" />
                渗透测试流程
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
                {securityTesting.penetrationTestFlow.map((phase, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30 border text-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                      {phase.step}
                    </div>
                    <div className="font-medium text-sm mb-2">{phase.name}</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {phase.tasks.map((task, i) => (
                        <li key={i}>• {task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 安全测试工具 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">安全测试工具集</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
                {securityTesting.commonTools.map((group, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30 border">
                    <div className="font-medium text-sm mb-2">{group.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {group.tools.map((tool, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 支付测试 */}
          <Card className="border-yellow-500/20 mt-8">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-yellow-600" />
                支付测试专项方案
              </CardTitle>
              <p className="text-sm text-muted-foreground">{paymentTesting.description}</p>
            </CardHeader>
          </Card>

          {/* 支付渠道 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Banknote className="h-4 w-4 text-primary" />
                支付渠道覆盖
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {paymentTesting.paymentChannels.map((channel, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30 border">
                    <div className="font-medium text-sm mb-2">{channel.channel}</div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {channel.features.map((f, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{channel.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 支付测试场景 */}
          {paymentTesting.testScenarios.map((category) => (
            <Card key={category.category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <category.icon className="h-4 w-4 text-primary" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left font-medium">ID</th>
                        <th className="p-2 text-left font-medium">场景</th>
                        <th className="p-2 text-left font-medium">测试步骤</th>
                        <th className="p-2 text-left font-medium">预期结果</th>
                        <th className="p-2 text-left font-medium">优先级</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.cases.map((testCase, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="p-2 font-mono text-xs">{testCase.id}</td>
                          <td className="p-2 font-medium">{testCase.scenario}</td>
                          <td className="p-2 text-muted-foreground">{testCase.steps}</td>
                          <td className="p-2 text-muted-foreground">{testCase.expected}</td>
                          <td className="p-2">
                            <Badge variant={testCase.priority === "P0" ? "destructive" : testCase.priority === "P1" ? "default" : "secondary"}>
                              {testCase.priority}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}

          {/* 关键校验点 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                支付关键校验点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentTesting.keyCheckpoints.map((cp, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{cp.checkpoint}</span>
                      <Badge variant="destructive" className="text-xs">{cp.risk}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cp.validations.map((v, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{v}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 沙盒测试指南 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                沙盒测试环境配置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {paymentTesting.sandboxTestGuide.map((guide, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30 border">
                    <div className="font-medium text-sm mb-2">{guide.platform}</div>
                    <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1 mb-2">
                      {guide.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                    <div className="text-xs text-yellow-600 flex items-start gap-1">
                      <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                      {guide.notes}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 风险提醒 */}
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-4 w-4" />
                支付测试风险提醒
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                {paymentTesting.riskReminders.map((reminder, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{reminder}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 模块测试 */}
        <TabsContent value="modules" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gamepad2 className="h-5 w-5 text-primary" />
                游戏核心模块测试要点
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                常见游戏功能模块的测试关注点，帮助QA快速定位测试范围
              </p>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameModuleTests.map((module) => (
              <Card key={module.module} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-1.5 rounded bg-primary/10">
                      <module.icon className="h-4 w-4 text-primary" />
                    </div>
                    {module.module}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {module.testPoints.map((point, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 text-primary mt-1 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 使用说明 */}
          <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                使用说明
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong>1. 测试方法选择：</strong>根据功能特点选择合适的黑盒测试技术。数值相关用边界值，多条件组合用判定表，因果关系明显用因果图。</p>
              <p><strong>2. 探索式测试时机：</strong>适合新功能上线初期、版本回归收尾阶段，以及常规用例无法覆盖的场景。</p>
              <p><strong>3. 风险驱动优先级：</strong>资源有限时，优先测试P0/P1模块，确保核心功能和资金安全。</p>
              <p><strong>4. 验收检查使用：</strong>版本发布前逐项检查必须项(*)，确保无遗漏。可选项根据版本重点选择性验证。</p>
              <p><strong>5. 持续积累：</strong>根据项目实际情况补充具体的测试用例和检查点，形成团队专属的测试知识库。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default GameTestingReference;
