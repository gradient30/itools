import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Star
} from "lucide-react";
import { useState } from "react";

// 黑盒测试技术
const blackBoxTechniques = [
  {
    id: "equivalence",
    name: "等价类划分",
    icon: Layers,
    description: "将输入数据划分为若干等价类，从每个类中选取代表性数据进行测试",
    principles: [
      "有效等价类：符合程序规格说明的合理输入",
      "无效等价类：不符合规格说明的异常输入",
      "每个等价类中的数据对发现错误的能力相同",
      "减少测试用例数量，同时保证测试覆盖率"
    ],
    gameExamples: [
      {
        scenario: "游戏角色等级系统",
        validClasses: [
          { class: "1-10级（新手期）", testValue: "5", description: "新手保护机制验证" },
          { class: "11-50级（成长期）", testValue: "30", description: "常规功能可用性" },
          { class: "51-99级（进阶期）", testValue: "75", description: "高级功能解锁验证" },
          { class: "100级（满级）", testValue: "100", description: "满级特权验证" }
        ],
        invalidClasses: [
          { class: "负数等级", testValue: "-1", description: "应提示等级无效" },
          { class: "超过最大等级", testValue: "101", description: "应限制最大等级" },
          { class: "非数字输入", testValue: "abc", description: "应提示格式错误" },
          { class: "小数等级", testValue: "50.5", description: "应取整或提示错误" }
        ]
      },
      {
        scenario: "充值金额验证",
        validClasses: [
          { class: "最小充值额（6元）", testValue: "6", description: "最低门槛验证" },
          { class: "常规充值（6-648元）", testValue: "98", description: "正常充值流程" },
          { class: "大额充值（648元）", testValue: "648", description: "大额支付验证" }
        ],
        invalidClasses: [
          { class: "低于最小金额", testValue: "1", description: "应提示金额不足" },
          { class: "负数金额", testValue: "-100", description: "应拒绝交易" },
          { class: "超大金额", testValue: "99999", description: "应触发风控" }
        ]
      },
      {
        scenario: "用户名注册",
        validClasses: [
          { class: "纯字母（4-16位）", testValue: "GamePlayer", description: "正常注册" },
          { class: "字母+数字组合", testValue: "Player2024", description: "正常注册" },
          { class: "含中文昵称", testValue: "游戏玩家01", description: "中文支持验证" }
        ],
        invalidClasses: [
          { class: "过短（<4位）", testValue: "abc", description: "提示长度不足" },
          { class: "过长（>16位）", testValue: "abcdefghijklmnopqrst", description: "提示超出限制" },
          { class: "含特殊字符", testValue: "Player@#$", description: "提示含非法字符" },
          { class: "敏感词", testValue: "admin", description: "提示不可用" }
        ]
      }
    ],
    checklist: [
      "识别所有输入参数并确定其有效范围",
      "为每个参数划分有效和无效等价类",
      "确保每个等价类至少有一个测试用例覆盖",
      "组合多参数等价类进行交叉验证",
      "记录等价类划分依据和测试结果"
    ]
  },
  {
    id: "boundary",
    name: "边界值分析",
    icon: Target,
    description: "专注于测试输入范围的边界点，包括边界值本身及其临近值",
    principles: [
      "最小值 - 1（刚好低于边界）",
      "最小值（边界值）",
      "最小值 + 1（刚好高于边界）",
      "最大值 - 1（刚好低于边界）",
      "最大值（边界值）",
      "最大值 + 1（刚好超过边界）"
    ],
    gameExamples: [
      {
        scenario: "背包容量系统",
        boundaries: [
          { point: "0格", testValues: ["0", "-1", "1"], expected: "0格时显示空背包，-1无效，1格正常显示" },
          { point: "100格（默认上限）", testValues: ["99", "100", "101"], expected: "99和100正常，101提示背包已满" },
          { point: "200格（VIP上限）", testValues: ["199", "200", "201"], expected: "VIP用户可达200，超出应提示扩容" }
        ]
      },
      {
        scenario: "战斗伤害计算",
        boundaries: [
          { point: "最小伤害（1点）", testValues: ["0", "1", "2"], expected: "最低保底1点伤害" },
          { point: "暴击上限（999%）", testValues: ["998%", "999%", "1000%"], expected: "暴击率应封顶999%" },
          { point: "生命值归零", testValues: ["-1", "0", "1"], expected: "0时死亡，负数应显示为0" }
        ]
      },
      {
        scenario: "倒计时系统",
        boundaries: [
          { point: "活动开始（0秒）", testValues: ["-1秒", "0秒", "1秒"], expected: "0秒时活动开启，负数显示已开始" },
          { point: "活动结束", testValues: ["剩1秒", "0秒", "超时1秒"], expected: "0秒时关闭入口，超时不可进入" }
        ]
      },
      {
        scenario: "抽卡保底机制",
        boundaries: [
          { point: "小保底（80抽）", testValues: ["79抽", "80抽", "81抽"], expected: "80抽必出4星" },
          { point: "大保底（180抽）", testValues: ["179抽", "180抽", "181抽"], expected: "180抽必出UP角色" }
        ]
      }
    ],
    checklist: [
      "识别所有数值型输入的边界范围",
      "设计边界值测试用例（min-1, min, min+1, max-1, max, max+1）",
      "验证边界处的业务逻辑正确性",
      "检查边界值的UI显示是否正确",
      "测试多参数边界值的组合情况"
    ]
  },
  {
    id: "decision-table",
    name: "判定表法",
    icon: Table,
    description: "通过表格形式分析多条件组合下的不同处理动作",
    principles: [
      "列出所有条件（输入）和动作（输出）",
      "计算条件组合数：2^n（n为条件数）",
      "简化表格：合并相同动作的规则",
      "确保覆盖所有可能的条件组合"
    ],
    gameExamples: [
      {
        scenario: "副本进入条件判断",
        conditions: ["等级达标", "体力充足", "前置副本完成", "队伍人数满足"],
        rules: [
          { conditions: ["Y", "Y", "Y", "Y"], action: "允许进入副本", priority: "正常" },
          { conditions: ["N", "-", "-", "-"], action: "提示等级不足", priority: "高" },
          { conditions: ["Y", "N", "-", "-"], action: "提示体力不足，引导购买", priority: "高" },
          { conditions: ["Y", "Y", "N", "-"], action: "提示需完成前置副本", priority: "中" },
          { conditions: ["Y", "Y", "Y", "N"], action: "提示队伍人数不足", priority: "中" }
        ]
      },
      {
        scenario: "装备强化系统",
        conditions: ["材料足够", "金币足够", "强化等级未满", "保护道具使用"],
        rules: [
          { conditions: ["Y", "Y", "Y", "Y"], action: "强化成功，失败不降级", priority: "正常" },
          { conditions: ["Y", "Y", "Y", "N"], action: "强化成功/失败可能降级", priority: "正常" },
          { conditions: ["N", "-", "-", "-"], action: "提示材料不足", priority: "高" },
          { conditions: ["Y", "N", "-", "-"], action: "提示金币不足", priority: "高" },
          { conditions: ["Y", "Y", "N", "-"], action: "提示已达最高等级", priority: "中" }
        ]
      },
      {
        scenario: "好友添加逻辑",
        conditions: ["对方存在", "非黑名单", "好友位未满", "对方接受"],
        rules: [
          { conditions: ["Y", "Y", "Y", "Y"], action: "添加成功", priority: "正常" },
          { conditions: ["N", "-", "-", "-"], action: "提示用户不存在", priority: "高" },
          { conditions: ["Y", "N", "-", "-"], action: "提示对方在黑名单中", priority: "高" },
          { conditions: ["Y", "Y", "N", "-"], action: "提示好友已满", priority: "中" },
          { conditions: ["Y", "Y", "Y", "N"], action: "等待对方同意/提示被拒绝", priority: "中" }
        ]
      }
    ],
    checklist: [
      "识别所有影响结果的条件变量",
      "列出所有可能的动作/输出结果",
      "绘制完整的判定表",
      "合并冗余规则简化表格",
      "为每条规则设计测试用例",
      "验证条件优先级处理正确"
    ]
  },
  {
    id: "cause-effect",
    name: "因果图法",
    icon: GitBranch,
    description: "分析输入条件（因）与输出结果（果）之间的逻辑关系",
    principles: [
      "恒等：若原因出现，则结果出现",
      "非：若原因出现，则结果不出现",
      "或：多个原因中任一出现，结果出现",
      "与：多个原因同时出现，结果才出现"
    ],
    gameExamples: [
      {
        scenario: "VIP特权激活",
        causes: [
          { id: "C1", name: "充值满100元" },
          { id: "C2", name: "活动期间注册" },
          { id: "C3", name: "邀请码激活" }
        ],
        effects: [
          { id: "E1", name: "获得VIP1资格" },
          { id: "E2", name: "赠送限定礼包" }
        ],
        relations: [
          { type: "OR", causes: ["C1", "C2", "C3"], effect: "E1", description: "满足任一条件即可获得VIP1" },
          { type: "AND", causes: ["C2", "C3"], effect: "E2", description: "活动期间+邀请码才送限定礼包" }
        ]
      },
      {
        scenario: "成就解锁系统",
        causes: [
          { id: "C1", name: "击败Boss" },
          { id: "C2", name: "限时内完成" },
          { id: "C3", name: "无队友阵亡" }
        ],
        effects: [
          { id: "E1", name: "普通成就" },
          { id: "E2", name: "限时成就" },
          { id: "E3", name: "完美成就" }
        ],
        relations: [
          { type: "恒等", causes: ["C1"], effect: "E1", description: "击败Boss获得普通成就" },
          { type: "AND", causes: ["C1", "C2"], effect: "E2", description: "限时击败获得限时成就" },
          { type: "AND", causes: ["C1", "C2", "C3"], effect: "E3", description: "完美通关获得完美成就" }
        ]
      }
    ],
    checklist: [
      "提取所有输入条件（原因）",
      "识别所有输出结果（结果）",
      "分析因果之间的逻辑关系",
      "绘制因果图并标注约束",
      "将因果图转化为判定表",
      "设计覆盖所有因果路径的用例"
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

const GameTestingReference = () => {
  const [expandedTechnique, setExpandedTechnique] = useState<string | null>(null);
  const [expandedCharter, setExpandedCharter] = useState<string | null>(null);

  return (
    <ToolLayout
      title="游戏测试技术文档"
      description="SaaS游戏平台与应用测试方法论，包含黑盒测试技术、探索式测试、风险测试及行业最佳实践"
      icon={Gamepad2}
    >
      <Tabs defaultValue="blackbox" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="blackbox" className="text-xs md:text-sm">黑盒测试技术</TabsTrigger>
          <TabsTrigger value="exploratory" className="text-xs md:text-sm">探索式测试</TabsTrigger>
          <TabsTrigger value="risk" className="text-xs md:text-sm">风险测试</TabsTrigger>
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
