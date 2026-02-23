
import { Link } from "react-router-dom";
import { ToolLayout } from "@/components/ToolLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Gamepad2,
  GitBranch,
  Globe,
  Layers,
  Package,
  Shield,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

interface LifecycleStage {
  id: string;
  phase: string;
  owner: string;
  objective: string;
  keyDeliverable: string;
  riskGate: string;
}

interface LevelSpec {
  id: "junior" | "intermediate" | "advanced" | "expert";
  title: string;
  audience: string;
  outcomes: string[];
  methods: string[];
  deliverables: string[];
  metrics: string[];
  pitfalls: string[];
}

interface CaseWorkshop {
  id: string;
  name: string;
  type: "主案例" | "子案例";
  scope: string;
  businessGoal: string;
  riskHypotheses: string[];
  keyScenarios: string[];
  expectedArtifacts: string[];
}

interface WeeklySprintTask {
  week: number;
  stage: string;
  focus: string;
  outputs: string[];
  successSignal: string;
}

interface GateReviewCriteria {
  gate: string;
  week: string;
  focus: string;
  entryCriteria: string[];
  passCriteria: string[];
  failAction: string[];
}

const lifecycleStages: LifecycleStage[] = [
  {
    id: "S1",
    phase: "商业目标与立项约束",
    owner: "产品负责人 + 制作人",
    objective: "明确收入目标、留存目标、版本节奏与资源上限",
    keyDeliverable: "版本立项卡 + ROI 目标树",
    riskGate: "目标不可测或资源超配时禁止进入需求阶段",
  },
  {
    id: "S2",
    phase: "需求澄清与验收标准",
    owner: "产品 + 策划 + QA",
    objective: "将模糊玩法描述转为可验证的验收规则",
    keyDeliverable: "需求澄清清单 + 验收标准表",
    riskGate: "关键规则无验收口径不得排期",
  },
  {
    id: "S3",
    phase: "风险建模与测试策略",
    owner: "QA 负责人",
    objective: "按资损、活跃、口碑、稳定性设定测试优先级",
    keyDeliverable: "风险矩阵 + 测试策略图",
    riskGate: "P0 风险无缓解方案不得开发冻结",
  },
  {
    id: "S4",
    phase: "测试点提取与用例设计",
    owner: "模块 QA",
    objective: "形成覆盖核心路径与异常路径的可执行用例",
    keyDeliverable: "测试点矩阵 + 分层用例集",
    riskGate: "核心链路覆盖率不足 95% 不得提测",
  },
  {
    id: "S5",
    phase: "环境、数据与工具链准备",
    owner: "QA + 开发 + 运维",
    objective: "搭建稳定可复现的测试环境与账号资产",
    keyDeliverable: "环境校验报告 + 测试数据工单",
    riskGate: "无回放日志与埋点校验能力不得联调",
  },
  {
    id: "S6",
    phase: "执行与缺陷流转",
    owner: "QA 执行组",
    objective: "高质量执行并驱动缺陷闭环",
    keyDeliverable: "执行日报 + 缺陷看板",
    riskGate: "P0/P1 未闭环不得进入回归",
  },
  {
    id: "S7",
    phase: "回归与专项验证",
    owner: "专项负责人",
    objective: "完成弱网、性能、安全、支付与兼容专项",
    keyDeliverable: "专项报告包",
    riskGate: "资损与安全高风险项必须 0 遗留",
  },
  {
    id: "S8",
    phase: "版本准入与发布评审",
    owner: "版本 Owner",
    objective: "统一发布门禁和上线决策",
    keyDeliverable: "版本准入结论 + 发布 Runbook",
    riskGate: "未通过闸门评审不得上生产",
  },
  {
    id: "S9",
    phase: "灰度监控与应急回滚",
    owner: "运维 + QA + 开发",
    objective: "灰度验证关键指标并在异常时快速止损",
    keyDeliverable: "灰度监控面板 + 应急预案",
    riskGate: "核心指标异常超阈值触发自动回滚",
  },
  {
    id: "S10",
    phase: "复盘与知识沉淀",
    owner: "全员",
    objective: "沉淀可复用模板，修正流程和质量基线",
    keyDeliverable: "版本复盘报告 + 资产库更新",
    riskGate: "复盘未完成不得进入下一次关键活动",
  },
];
const levelSpecs: LevelSpec[] = [
  {
    id: "junior",
    title: "初级学者",
    audience: "0-1 年 QA / 校招测试 / 转岗同学",
    outcomes: [
      "能从需求文档中提取测试点并分类（功能、异常、边界）",
      "能独立编写基础用例并按优先级执行",
      "能输出结构完整、可复现的缺陷单",
    ],
    methods: [
      "以模板驱动工作：需求澄清单、测试点卡片、缺陷三段式描述",
      "采用等价类 + 边界值作为主方法",
      "每日 15 分钟站会同步风险和阻塞",
    ],
    deliverables: [
      "模块测试点矩阵（基础版）",
      "基础用例集（冒烟+主流程）",
      "缺陷复盘卡（每周至少 3 条）",
    ],
    metrics: [
      "用例执行完成率 >= 95%",
      "缺陷重开率 <= 15%",
      "漏测导致线上故障数 = 0（核心链路）",
    ],
    pitfalls: [
      "只测正常流程，不测中断与异常",
      "缺陷描述缺上下文，研发无法复现",
      "将测试点与用例混写，无法维护",
    ],
  },
  {
    id: "intermediate",
    title: "中级工程师",
    audience: "1-3 年 QA / 模块负责人",
    outcomes: [
      "能主导单模块测试策略，形成风险优先级",
      "能设计跨系统的接口联动测试方案",
      "能以数据证明质量结论并推动问题修复",
    ],
    methods: [
      "风险驱动测试：资损、活跃、社交口碑分层",
      "判定表 + 状态迁移方法处理复杂业务规则",
      "构建模块准入门禁（缺陷阈值、覆盖率阈值）",
    ],
    deliverables: [
      "模块测试策略文档",
      "联动测试清单（客户端/服务端/支付）",
      "模块准入评估报告",
    ],
    metrics: [
      "P0/P1 线上逃逸率 <= 3%",
      "评审一次通过率 >= 85%",
      "关键模块回归周期缩短 >= 20%",
    ],
    pitfalls: [
      "只输出问题，不输出修复优先级建议",
      "忽略配置变更带来的联动影响",
      "没有为灰度阶段准备监控指标",
    ],
  },
  {
    id: "advanced",
    title: "高级负责人",
    audience: "3-6 年 QA / 版本质量 Owner",
    outcomes: [
      "能跨团队统筹版本质量并主导上线评审",
      "能对性能、安全、支付做专项闭环",
      "能在时间压缩场景下给出可辩护的取舍策略",
    ],
    methods: [
      "质量闸门机制：需求门、提测门、发布门",
      "专项并行：弱网、支付幂等、防作弊、性能压测",
      "上线前 T-14/T-7/T-1 里程碑管理",
    ],
    deliverables: [
      "版本质量总控图",
      "专项测试报告包",
      "发布决策记录与风险豁免单",
    ],
    metrics: [
      "版本准点发布率 >= 95%",
      "重大回滚次数 <= 1/季度",
      "线上 MTTR（故障恢复时长） <= 30 分钟",
    ],
    pitfalls: [
      "评审只看缺陷数，不看业务影响",
      "没有制定故障演练与应急指挥链",
      "过度依赖人肉回归，缺少稳定脚本",
    ],
  },
  {
    id: "expert",
    title: "专家级",
    audience: "6 年以上 / 质量体系建设者",
    outcomes: [
      "能建立组织级质量体系与人才培养机制",
      "能设计多项目复用的模板、指标和运营流程",
      "能将质量投入与商业结果进行量化关联",
    ],
    methods: [
      "建立质量经营看板（成本、收益、风险、效率）",
      "RACI 机制固化跨部门职责边界",
      "将复盘资产化并持续升级模板库",
    ],
    deliverables: [
      "组织级 QA Playbook",
      "跨项目指标基线与季度改进计划",
      "人才梯队培养路径与认证标准",
    ],
    metrics: [
      "跨项目复用率 >= 60%",
      "质量相关返工成本下降 >= 25%",
      "核心人才留存率持续提升",
    ],
    pitfalls: [
      "流程复杂度过高，执行成本超过收益",
      "指标过多，无法形成管理动作",
      "未将业务阶段差异纳入同一体系",
    ],
  },
];

const caseWorkshops: CaseWorkshop[] = [
  {
    id: "main",
    name: "新春限时活动 + 新卡池 + 商城联动 + 支付返利",
    type: "主案例",
    scope: "覆盖需求澄清、测试设计、执行、发布、灰度、复盘全流程",
    businessGoal: "活动期 7 日内提升付费率和次留，并确保资损和舆情风险可控",
    riskHypotheses: [
      "卡池保底计数在跨天重登后可能丢失",
      "支付回调重试导致重复发货",
      "活动倒计时与服务器时间漂移导致提前关闭",
      "高峰并发下活动兑换接口超时",
    ],
    keyScenarios: [
      "跨端（Android/iOS）参与活动并领取奖励",
      "连续抽卡触发小保底与大保底",
      "支付中断、补单、退款后的道具与账务一致性",
      "灰度阶段 10% 用户流量监控与分批放量",
    ],
    expectedArtifacts: [
      "需求澄清纪要（含争议决策）",
      "测试点矩阵（功能/边界/异常/专项）",
      "准入评审结论（Go/No-Go）",
      "上线后一周复盘报告",
    ],
  },
  {
    id: "sub-1",
    name: "抽卡概率与保底机制",
    type: "子案例",
    scope: "概率配置、保底状态机、日志核对",
    businessGoal: "保证抽卡规则公开透明，避免舆情和合规投诉",
    riskHypotheses: [
      "配置误发导致概率异常",
      "保底重置逻辑与补偿逻辑冲突",
      "展示文案与真实逻辑不一致",
    ],
    keyScenarios: [
      "89/90 抽边界验证",
      "跨设备登录后保底进度一致",
      "异常断线后抽卡结果可追溯",
    ],
    expectedArtifacts: [
      "概率核对表",
      "保底边界用例集",
      "运营公告与规则核验记录",
    ],
  },
  {
    id: "sub-2",
    name: "支付到账与补单幂等链路",
    type: "子案例",
    scope: "订单创建、回调验签、发货、补单、对账",
    businessGoal: "防止重复扣费/重复发货，确保资损可追踪",
    riskHypotheses: [
      "回调重放攻击导致多次到账",
      "客户端重试触发重复订单",
      "补单任务与实时回调并发冲突",
    ],
    keyScenarios: [
      "弱网重复点击支付",
      "支付成功但回调延迟",
      "异常订单人工处理后自动对账",
    ],
    expectedArtifacts: [
      "支付状态机图",
      "幂等校验清单",
      "资损演练记录",
    ],
  },
  {
    id: "sub-3",
    name: "活动高峰并发与降级策略",
    type: "子案例",
    scope: "压测、熔断、缓存、降级开关",
    businessGoal: "高峰可用性稳定，故障可在分钟级恢复",
    riskHypotheses: [
      "瞬时并发导致数据库连接耗尽",
      "热点缓存击穿引发雪崩",
      "降级策略未同步前端展示",
    ],
    keyScenarios: [
      "活动开服前 10 分钟压测",
      "接口超时后的降级文案展示",
      "限流后核心支付链路可用性保障",
    ],
    expectedArtifacts: [
      "压测报告",
      "降级开关手册",
      "故障演练与 MTTR 记录",
    ],
  },
];

const weeklyPlan: WeeklySprintTask[] = [
  { week: 1, stage: "基础", focus: "业务目标拆解与立项约束", outputs: ["版本目标树", "范围边界清单"], successSignal: "目标均可量化，关键依赖已标注" },
  { week: 2, stage: "基础", focus: "需求澄清与验收口径", outputs: ["需求澄清单", "验收规则表"], successSignal: "争议规则闭环率 >= 90%" },
  { week: 3, stage: "基础", focus: "测试点提取与优先级", outputs: ["测试点矩阵", "风险分层图"], successSignal: "P0/P1 场景覆盖完整" },
  { week: 4, stage: "基础", focus: "基础用例落地与 G1 评审", outputs: ["冒烟用例", "主流程回归用例"], successSignal: "通过 G1 需求-用例闸门" },
  { week: 5, stage: "进阶", focus: "模块级策略与联动设计", outputs: ["模块策略文档", "联动测试计划"], successSignal: "跨系统链路定义可执行" },
  { week: 6, stage: "进阶", focus: "缺陷流转与复盘机制", outputs: ["缺陷治理看板", "周复盘卡"], successSignal: "缺陷重开率持续下降" },
  { week: 7, stage: "进阶", focus: "专项测试：弱网/兼容/性能", outputs: ["专项用例包", "专项结果报告"], successSignal: "高风险专项闭环" },
  { week: 8, stage: "进阶", focus: "支付与资损专项 + G2 评审", outputs: ["支付状态机验证", "幂等报告"], successSignal: "通过 G2 模块质量闸门" },
  { week: 9, stage: "高级", focus: "版本总控与准入机制", outputs: ["版本总控图", "准入清单"], successSignal: "发布决策依据完整" },
  { week: 10, stage: "高级", focus: "灰度放量与应急预案", outputs: ["灰度计划", "应急 Runbook"], successSignal: "异常触发链路演练通过" },
  { week: 11, stage: "专家", focus: "组织级指标体系", outputs: ["质量经营看板", "季度改进计划"], successSignal: "指标可驱动管理动作" },
  { week: 12, stage: "专家", focus: "体系沉淀与 G3 评审", outputs: ["组织 Playbook", "最终复盘报告"], successSignal: "通过 G3 版本总控闸门" },
];

const gateReviews: GateReviewCriteria[] = [
  {
    gate: "G1",
    week: "W4",
    focus: "需求-测试点-用例完整性",
    entryCriteria: ["需求冻结", "验收标准可测试", "测试点已分级"],
    passCriteria: ["主流程和异常流程用例齐全", "争议需求有决策记录", "冒烟集合可执行"],
    failAction: ["需求退回澄清", "禁止进入联调提测"],
  },
  {
    gate: "G2",
    week: "W8",
    focus: "模块质量与风险控制",
    entryCriteria: ["联动测试完成", "缺陷治理进入稳定期", "专项结果可追踪"],
    passCriteria: ["P0/P1 缺陷闭环", "支付与资损专项通过", "回归基线稳定"],
    failAction: ["锁定发布范围", "触发专项复测"],
  },
  {
    gate: "G3",
    week: "W12",
    focus: "上线总控与组织改进",
    entryCriteria: ["发布 Runbook 完整", "灰度与回滚方案可演练", "监控告警已联通"],
    passCriteria: ["准入清单全通过", "演练达标", "复盘资产化计划明确"],
    failAction: ["延期发布", "按风险等级分层回收功能"],
  },
];

const templateLibrary = [
  {
    title: "需求澄清模板",
    items: [
      "业务目标：收入、留存、活跃目标值",
      "规则定义：触发条件、边界条件、失败处理",
      "验收口径：可观测日志、埋点和数据校验方式",
      "未决事项：责任人 + 截止日期",
    ],
  },
  {
    title: "测试点矩阵模板",
    items: [
      "功能路径：主流程、支线流程、角色差异",
      "异常路径：断网、超时、重试、回滚",
      "边界路径：阈值、上限、跨天、跨端",
      "专项路径：性能、安全、支付、兼容",
    ],
  },
  {
    title: "发布准入模板",
    items: [
      "质量状态：缺陷分布与残留风险",
      "专项状态：性能/安全/资损结论",
      "运营准备：公告、补偿、客服话术",
      "应急预案：止损策略、回滚时间窗、指挥链",
    ],
  },
  {
    title: "复盘报告模板",
    items: [
      "目标达成：指标对比与偏差分析",
      "问题复盘：故障时间线与根因",
      "组织协作：流程断点与责任闭环",
      "资产沉淀：新增模板、规则、脚本",
    ],
  },
];

const raciRows = [
  {
    process: "需求评审",
    r: "产品经理",
    a: "版本 Owner",
    c: "策划/QA/研发",
    i: "运营/客服",
  },
  {
    process: "测试策略评审",
    r: "QA 负责人",
    a: "版本 Owner",
    c: "研发/运维/数据",
    i: "产品/运营",
  },
  {
    process: "支付专项与资损演练",
    r: "支付 QA",
    a: "技术负责人",
    c: "后端/风控/财务",
    i: "客服/运营",
  },
  {
    process: "发布评审",
    r: "版本 Owner",
    a: "制作人",
    c: "QA/研发/运维/运营",
    i: "管理层",
  },
  {
    process: "上线应急",
    r: "值班 SRE",
    a: "技术负责人",
    c: "QA/后端/客户端",
    i: "客服/运营/产品",
  },
];

const runbookMilestones = [
  {
    day: "T-14",
    focus: "范围冻结与专项排期",
    checks: ["需求冻结", "高风险点确认", "专项资源锁定"],
  },
  {
    day: "T-7",
    focus: "准入预审与灰度准备",
    checks: ["P0/P1 收敛", "监控阈值确认", "回滚方案演练"],
  },
  {
    day: "T-1",
    focus: "发布最终决策",
    checks: ["准入清单签字", "发布窗口确认", "客服话术就绪"],
  },
  {
    day: "T+1",
    focus: "首日复盘",
    checks: ["关键指标复核", "异常工单归档", "次日优化清单"],
  },
];

const complianceChecklist = [
  "版号与内容范围一致，未超申报边界",
  "实名认证与未成年人防沉迷规则生效",
  "付费提醒、概率公示、用户协议入口清晰",
  "敏感内容审查通过，运营素材与游戏内文案一致",
  "隐私政策与数据采集最小化原则落地",
  "充值、退款、补偿流程具备可追溯日志",
];

const kpiBoard = [
  { name: "版本准点率", target: ">= 95%", note: "按季度统计" },
  { name: "P0/P1 线上逃逸率", target: "<= 3%", note: "按版本统计" },
  { name: "首日回滚次数", target: "0 次", note: "关键活动版本" },
  { name: "故障 MTTR", target: "<= 30 分钟", note: "线上严重故障" },
  { name: "质量返工成本", target: "季度下降 >= 20%", note: "人力工时口径" },
];

const stageIcons = [
  Target,
  FileText,
  Layers,
  GitBranch,
  Package,
  Users,
  Shield,
  CheckCircle2,
  Activity,
  Trophy,
] as const;

export default function GameRnDLifecycleReference() {
  return (
    <ToolLayout
      title="游戏研发全生命周期（分层教学）"
      description="面向手游 F2P 项目的需求到上线完整实践指南：初级到专家四级能力路径 + 12 周训练营 + 企业落地模板"
      icon={Gamepad2}
    >
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                项目默认场景与教学基线
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                业务场景：手游 F2P | 合规口径：中国大陆 | 学习路径：12 周进阶营 | 评估机制：周任务 + G1/G2/G3 闸门评审
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">手游 F2P</Badge>
                <Badge variant="outline">中国大陆合规</Badge>
                <Badge variant="outline">主案例 + 3 子案例</Badge>
                <Badge variant="outline">周任务驱动</Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to="/docs/game-testing">查看游戏测试技术库</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/docs/version-testing-management">查看版本测试管理方案</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/docs/software-testing">查看现代测试工具体系</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="lifecycle" className="w-full">
        <TabsList className="grid w-full h-auto grid-cols-2 gap-1 bg-muted/50 p-1 lg:grid-cols-6">
          <TabsTrigger value="lifecycle" className="text-xs md:text-sm">生命周期地图</TabsTrigger>
          <TabsTrigger value="levels" className="text-xs md:text-sm">分层能力路径</TabsTrigger>
          <TabsTrigger value="workshop" className="text-xs md:text-sm">实战案例工坊</TabsTrigger>
          <TabsTrigger value="bootcamp" className="text-xs md:text-sm">12周训练营</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs md:text-sm">模板与交付件</TabsTrigger>
          <TabsTrigger value="enterprise" className="text-xs md:text-sm">企业落地手册</TabsTrigger>
        </TabsList>

        <TabsContent value="lifecycle" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="h-5 w-5 text-primary" />
                10 阶段全生命周期流程
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                该流程用于把需求分析、测试设计、执行、发布与复盘串成一条可管理、可审计、可复用的质量链路。
              </p>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {lifecycleStages.map((stage, index) => {
              const Icon = stageIcons[index] ?? Layers;
              return (
                <Card key={stage.id} className="border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{stage.id} {stage.phase}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">Owner: {stage.owner}</p>
                        </div>
                      </div>
                      <Badge variant="outline">Gate</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="text-muted-foreground">
                      <span className="font-medium text-foreground">目标：</span>{stage.objective}
                    </div>
                    <div className="text-muted-foreground">
                      <span className="font-medium text-foreground">核心交付：</span>{stage.keyDeliverable}
                    </div>
                    <div className="rounded-md border border-yellow-500/30 bg-yellow-500/5 p-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">风控闸门：</span>{stage.riskGate}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                阶段输入输出矩阵（执行顺序）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">阶段</th>
                      <th className="p-2 text-left">主要输入</th>
                      <th className="p-2 text-left">主要输出</th>
                      <th className="p-2 text-left">下一阶段触发条件</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">S1-S2</td>
                      <td className="p-2 text-muted-foreground">立项目标、版本预算、活动计划</td>
                      <td className="p-2 text-muted-foreground">澄清后的需求与验收标准</td>
                      <td className="p-2 text-muted-foreground">规则争议闭环，验收口径可测</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">S3-S5</td>
                      <td className="p-2 text-muted-foreground">验收标准、模块清单、历史缺陷</td>
                      <td className="p-2 text-muted-foreground">风险矩阵、用例集、环境就绪报告</td>
                      <td className="p-2 text-muted-foreground">核心链路覆盖达标并可执行</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">S6-S7</td>
                      <td className="p-2 text-muted-foreground">执行计划、提测包、构建产物</td>
                      <td className="p-2 text-muted-foreground">缺陷闭环、专项报告（支付/性能/安全）</td>
                      <td className="p-2 text-muted-foreground">P0/P1 闭环，专项高风险清零</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">S8-S10</td>
                      <td className="p-2 text-muted-foreground">准入清单、灰度策略、上线窗口</td>
                      <td className="p-2 text-muted-foreground">发布结论、监控结果、复盘资产</td>
                      <td className="p-2 text-muted-foreground">改进项进入下周期并跟踪</td>
                    </tr>
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="levels" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                初级到专家四级能力模型
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                每一层都固定为：目标结果、工作方法、交付物、量化指标、常见误区，便于教学和绩效评估一致化。
              </p>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {levelSpecs.map((level) => (
              <Card key={level.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-base">{level.title}</CardTitle>
                    <Badge variant="secondary">{level.audience}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-md border bg-muted/20 p-3">
                      <div className="mb-2 text-sm font-semibold">能力结果</div>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {level.outcomes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-md border bg-muted/20 p-3">
                      <div className="mb-2 text-sm font-semibold">工作方法</div>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {level.methods.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ArrowRight className="mt-1 h-3.5 w-3.5 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-md border p-3">
                      <div className="mb-2 text-sm font-semibold">标准交付物</div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {level.deliverables.map((item, idx) => (
                          <li key={idx}>- {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-md border p-3">
                      <div className="mb-2 text-sm font-semibold">达标指标</div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {level.metrics.map((item, idx) => (
                          <li key={idx}>- {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                      <div className="mb-2 text-sm font-semibold text-destructive">常见误区</div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {level.pitfalls.map((item, idx) => (
                          <li key={idx}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workshop" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gamepad2 className="h-5 w-5 text-primary" />
                实战案例工坊（1 主 + 3 子）
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                所有案例均按真实企业流程执行：先业务目标，再风险假设，再测试设计，再上线验证与复盘。
              </p>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {caseWorkshops.map((item) => (
              <Card key={item.id} className={item.type === "主案例" ? "border-primary/30" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.type === "主案例" ? "default" : "outline"}>{item.type}</Badge>
                      <Badge variant="secondary">{item.scope}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">业务目标：{item.businessGoal}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-md border p-3">
                      <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        风险假设
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {item.riskHypotheses.map((risk, idx) => (
                          <li key={idx}>- {risk}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                        <Target className="h-4 w-4 text-primary" />
                        核心测试场景
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {item.keyScenarios.map((scenario, idx) => (
                          <li key={idx}>- {scenario}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-md border p-3">
                      <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                        <FileText className="h-4 w-4 text-primary" />
                        预期产物
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {item.expectedArtifacts.map((artifact, idx) => (
                          <li key={idx}>- {artifact}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                主案例关键验收场景（建议作为课程实操评分主线）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <table className="w-full min-w-[840px] text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">场景编号</th>
                      <th className="p-2 text-left">场景说明</th>
                      <th className="p-2 text-left">验证重点</th>
                      <th className="p-2 text-left">判定标准</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-xs">MC-01</td>
                      <td className="p-2">活动开启 30 分钟内充值返利链路</td>
                      <td className="p-2 text-muted-foreground">订单状态、到账时延、返利比例</td>
                      <td className="p-2 text-muted-foreground">到账成功率 99.9%，返利一致性 100%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-xs">MC-02</td>
                      <td className="p-2">89/90 抽保底边界 + 跨端登录</td>
                      <td className="p-2 text-muted-foreground">保底计数、抽卡结果、日志追溯</td>
                      <td className="p-2 text-muted-foreground">边界结果符合规则，无状态丢失</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-xs">MC-03</td>
                      <td className="p-2">弱网重试 + 支付回调延迟</td>
                      <td className="p-2 text-muted-foreground">幂等校验、补单流程、用户提示</td>
                      <td className="p-2 text-muted-foreground">不重复扣费，不重复发货，提示友好</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono text-xs">MC-04</td>
                      <td className="p-2">灰度 10%-30%-100% 分批放量</td>
                      <td className="p-2 text-muted-foreground">核心 KPI、异常告警、回滚触发</td>
                      <td className="p-2 text-muted-foreground">指标稳定且无阻断性事故</td>
                    </tr>
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bootcamp" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                12 周进阶训练营（周任务 + 阶段闸门）
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                每周必须有可审查交付件，避免只学理论不做落地。第 4/8/12 周执行 G1/G2/G3 闸门评审。
              </p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">周任务节奏表</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <table className="w-full min-w-[980px] text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Week</th>
                      <th className="p-2 text-left">阶段</th>
                      <th className="p-2 text-left">训练焦点</th>
                      <th className="p-2 text-left">交付件</th>
                      <th className="p-2 text-left">达标信号</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyPlan.map((task) => (
                      <tr key={task.week} className="border-b last:border-0">
                        <td className="p-2 font-medium">W{task.week}</td>
                        <td className="p-2">{task.stage}</td>
                        <td className="p-2 text-muted-foreground">{task.focus}</td>
                        <td className="p-2 text-muted-foreground">{task.outputs.join(" / ")}</td>
                        <td className="p-2 text-muted-foreground">{task.successSignal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {gateReviews.map((gate) => (
              <Card key={gate.gate}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{gate.gate} 闸门评审</span>
                    <Badge variant="outline">{gate.week}</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">焦点：{gate.focus}</p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium">入场条件</div>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      {gate.entryCriteria.map((item, idx) => (
                        <li key={idx}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">通过标准</div>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      {gate.passCriteria.map((item, idx) => (
                        <li key={idx}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2">
                    <div className="font-medium text-destructive">未通过处理</div>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      {gate.failAction.map((item, idx) => (
                        <li key={idx}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                模板与交付件库（可直接复用）
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                强制使用统一模板可以显著降低协作沟通成本。模板本身即是质量体系的标准化接口。
              </p>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {templateLibrary.map((template) => (
              <Card key={template.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{template.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {template.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ArrowRight className="mt-1 h-3.5 w-3.5 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                模板使用建议
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. 初级同学先按模板填满，再讨论优化，避免一开始追求“高级写法”。</p>
              <p>2. 中高级同学负责模板迭代，把真实线上事故沉淀进字段和检查项。</p>
              <p>3. 需要专项测试细化时，直接补充到 <Link to="/docs/game-testing" className="text-primary underline-offset-4 hover:underline">游戏测试技术库</Link> 并在版本计划中引用。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enterprise" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                企业落地运行手册（中国大陆）
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                本节聚焦真实企业协作、上线节奏和合规约束，用于把教学方案变成团队日常执行机制。
              </p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                RACI 协作矩阵
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">流程</th>
                      <th className="p-2 text-left">R</th>
                      <th className="p-2 text-left">A</th>
                      <th className="p-2 text-left">C</th>
                      <th className="p-2 text-left">I</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raciRows.map((row) => (
                      <tr key={row.process} className="border-b last:border-0">
                        <td className="p-2 font-medium">{row.process}</td>
                        <td className="p-2 text-muted-foreground">{row.r}</td>
                        <td className="p-2 text-muted-foreground">{row.a}</td>
                        <td className="p-2 text-muted-foreground">{row.c}</td>
                        <td className="p-2 text-muted-foreground">{row.i}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                发布 Runbook 里程碑
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {runbookMilestones.map((milestone) => (
                  <div key={milestone.day} className="rounded-md border p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold text-sm">{milestone.day}</span>
                      <Badge variant="outline">里程碑</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{milestone.focus}</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {milestone.checks.map((check, idx) => (
                        <li key={idx}>- {check}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  合规检查清单（中国大陆）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {complianceChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  质量经营 KPI 看板
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {kpiBoard.map((kpi) => (
                    <div key={kpi.name} className="rounded-md border p-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{kpi.name}</span>
                        <Badge variant="secondary">目标 {kpi.target}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">统计口径：{kpi.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                常见组织级反模式
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
              <p>- 只追求发版速度，不维护准入门禁，最终导致频繁回滚。</p>
              <p>- 质量评估只看缺陷数量，不看资损、舆情和用户体验影响。</p>
              <p>- 复盘只开会不沉淀，重复问题在下一版本再次出现。</p>
              <p>- 质量责任全压 QA，未建立产品、研发、运营共担机制。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
