import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ToolLayout } from "@/components/ToolLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bug,
  CheckCircle2,
  ChevronDown,
  Clock,
  Database,
  FileText,
  Filter,
  Gamepad2,
  Globe,
  Layers,
  MonitorPlay,
  Network,
  Shield,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

type TabKey =
  | "overview"
  | "closed-loop"
  | "scenario"
  | "gate"
  | "tools"
  | "onboarding"
  | "organization"
  | "appendix";

type SceneTag = "游戏" | "App" | "通用";

type TeamStage = "初创" | "成长" | "大型";

type ToolGroup =
  | "UI/E2E自动化"
  | "移动端自动化"
  | "API/契约测试"
  | "性能与稳定性"
  | "安全测试"
  | "兼容性与真机云测"
  | "可观测性与发布监控"
  | "缺陷管理与测试协同"
  | "测试数据与Mock"
  | "AI辅助测试与质量工程";

interface QuickStartCard {
  install: string;
  minimalCase: string;
  ci: string;
  pitfalls: string;
  acceptance: string;
}

interface ToolItem {
  name: string;
  group: ToolGroup;
  sceneTags: SceneTag[];
  scenario: string;
  coreFeatures: string[];
  businessValue: string;
  teamStage: TeamStage;
  quickStart: QuickStartCard;
  officialDoc: string;
  repo?: string;
}

interface VersionType {
  type: string;
  cadence: string;
  objective: string;
  testFocus: string;
}

interface TestingLayer {
  layer: string;
  target: string;
  entry: string;
  exit: string;
}

interface RiskRow {
  level: "P0" | "P1" | "P2";
  assetRisk: string;
  stabilityRisk: string;
  experienceRisk: string;
  complianceRisk: string;
}

interface QualitySignal {
  metric: string;
  definition: string;
  target: string;
}

interface StageRow {
  stage: string;
  owner: string;
  action: string;
  output: string;
}

interface ScenarioRow {
  dimension: string;
  game: string;
  app: string;
  baseline: string;
}

interface GateRow {
  gate: string;
  mustPass: string[];
  blockers: string[];
}

interface GroupGuide {
  selectionBasis: string;
  alternatives: string;
  recommendation: string;
}

interface RaciRow {
  process: string;
  r: string;
  a: string;
  c: string;
  i: string;
}

interface KpiRow {
  metric: string;
  target: string;
  cadence: string;
  riskSignal: string;
}

interface AppendixTemplate {
  title: string;
  items: string[];
}

interface GlossaryRow {
  term: string;
  definition: string;
}

interface SourceRow {
  title: string;
  url: string;
  note: string;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: "overview", label: "管理总览" },
  { key: "closed-loop", label: "日常闭环" },
  { key: "scenario", label: "游戏 vs App" },
  { key: "gate", label: "质量门禁" },
  { key: "tools", label: "Top 30工具" },
  { key: "onboarding", label: "5步上手卡" },
  { key: "organization", label: "组织落地" },
  { key: "appendix", label: "附录" },
];

const versionTypes: VersionType[] = [
  { type: "日常迭代", cadence: "1-2周", objective: "持续交付小范围价值", testFocus: "冒烟 + 功能回归 + 自动化门禁" },
  { type: "大版本", cadence: "4-12周", objective: "能力升级与架构变更", testFocus: "全量回归 + 性能/安全/兼容专项" },
  { type: "活动版本", cadence: "固定档期", objective: "峰值流量与转化", testFocus: "活动链路、支付到账、容量与灰度策略" },
  { type: "紧急修复", cadence: "小时级", objective: "快速止损", testFocus: "影响面回归 + 回滚演练 + 线上监控" },
];

const testingLayers: TestingLayer[] = [
  { layer: "冒烟", target: "核心链路可用性", entry: "构建可安装/可部署", exit: "关键路径100%通过" },
  { layer: "功能回归", target: "变更影响面", entry: "需求冻结 + 用例就绪", exit: "P0/P1清零" },
  { layer: "专项测试", target: "性能/安全/兼容/弱网", entry: "环境与数据完备", exit: "专项指标达标" },
  { layer: "灰度验证", target: "真实流量风险", entry: "Go/No-Go通过", exit: "核心指标稳定后放量" },
];

const riskRows: RiskRow[] = [
  { level: "P0", assetRisk: "资损/支付异常", stabilityRisk: "崩溃/不可用", experienceRisk: "核心流程中断", complianceRisk: "违规收集或传输" },
  { level: "P1", assetRisk: "到账延迟", stabilityRisk: "高错误率", experienceRisk: "显著卡顿或失败", complianceRisk: "策略配置缺失" },
  { level: "P2", assetRisk: "边缘口径偏差", stabilityRisk: "低频异常", experienceRisk: "非核心体验问题", complianceRisk: "低风险整改项" },
];

const qualitySignals: QualitySignal[] = [
  { metric: "逃逸率", definition: "上线后暴露的高优先级缺陷占比", target: "P0/P1 <= 2%" },
  { metric: "回归时长", definition: "从提测到回归完成耗时", target: "季度下降 >= 15%" },
  { metric: "阻断缺陷", definition: "触发门禁的缺陷数量", target: "随版本波动可解释" },
  { metric: "MTTR", definition: "线上事件平均修复时长", target: "<= 60分钟" },
  { metric: "回滚率", definition: "版本发布后触发回滚比例", target: "<= 3%" },
];

const lifecycleStages: StageRow[] = [
  { stage: "计划", owner: "QA Owner + 产品", action: "定义范围、风险等级、测试策略", output: "版本测试计划 + 风险矩阵" },
  { stage: "执行", owner: "模块QA", action: "执行冒烟、回归、专项并跟踪缺陷", output: "测试日报 + 缺陷看板" },
  { stage: "门禁", owner: "版本委员会", action: "基于门禁规则做Go/No-Go决策", output: "门禁评审记录" },
  { stage: "发布", owner: "运维 + 开发 + QA", action: "灰度放量、监控告警、应急值守", output: "发布Runbook执行记录" },
  { stage: "复盘", owner: "全团队", action: "复盘逃逸缺陷与流程缺口", output: "CAPA清单 + 资产库更新" },
];

const dailyRituals: StageRow[] = [
  { stage: "每日风险同步", owner: "QA Owner", action: "更新版本风险温度和阻断项", output: "风险温度板" },
  { stage: "每日缺陷分诊", owner: "开发TL + QA", action: "按P0/P1/P2定SLA与责任人", output: "缺陷SLA追踪" },
  { stage: "每日构建巡检", owner: "测试开发", action: "核对自动化通过率和失败原因", output: "构建健康报告" },
  { stage: "T-1预发布演练", owner: "版本Owner", action: "演练回滚和告警链路", output: "预发布检查单" },
];

const scenarioRows: ScenarioRow[] = [
  { dimension: "业务核心", game: "数值/经济系统、活动链路、支付到账", app: "交易/转化漏斗、流程一致性", baseline: "核心路径建立阻断级监控" },
  { dimension: "技术侧重点", game: "弱网战斗、帧率、发热、外挂风控", app: "权限生命周期、多端兼容、埋点链路", baseline: "变更前后对比基线" },
  { dimension: "发布策略", game: "分区灰度 + 活动避峰", app: "渠道分批 + 开关控流", baseline: "统一回滚与值班机制" },
  { dimension: "合规约束", game: "未成年保护、交易合规", app: "隐私授权、数据最小化", baseline: "合规项作为上线门禁" },
];

const gateRows: GateRow[] = [
  {
    gate: "提测门",
    mustPass: ["需求冻结并有验收口径", "冒烟集可执行", "核心埋点与日志可追踪"],
    blockers: ["需求反复变更无审批", "核心链路无用例", "测试环境不可复现"],
  },
  {
    gate: "预发布门",
    mustPass: ["P0/P1清零", "专项测试完成", "回滚脚本可执行"],
    blockers: ["支付/登录仍有高风险", "性能指标越阈值", "告警规则未生效"],
  },
  {
    gate: "上线门",
    mustPass: ["Go/No-Go评审通过", "灰度计划明确", "值班矩阵和沟通通道就绪"],
    blockers: ["无放量计划", "无法快速熔断", "关键角色缺位"],
  },
  {
    gate: "复盘门",
    mustPass: ["24小时内复盘初稿", "72小时内CAPA结案", "模板资产更新"],
    blockers: ["只记录现象不追根因", "无责任到人", "同类问题重复出现"],
  },
];

const rollbackRunbook = [
  "触发阈值：崩溃率、支付成功率、接口错误率连续5-10分钟异常。",
  "止血顺序：冻结放量 -> 功能降级 -> 开关回退 -> 配置回退 -> 版本回滚。",
  "沟通机制：20分钟内同步技术、业务、客服；每30分钟刷新处置状态。",
  "复盘要求：24小时内提交CAPA，明确防复发动作与完成期限。",
];

const toolGroups: ToolGroup[] = [
  "UI/E2E自动化",
  "移动端自动化",
  "API/契约测试",
  "性能与稳定性",
  "安全测试",
  "兼容性与真机云测",
  "可观测性与发布监控",
  "缺陷管理与测试协同",
  "测试数据与Mock",
  "AI辅助测试与质量工程",
];

const groupGuides: Record<ToolGroup, GroupGuide> = {
  "UI/E2E自动化": {
    selectionBasis: "关注社区活跃、跨浏览器能力、CI稳定性。",
    alternatives: "国际主流：Playwright/Cypress；国内替代：Airtest（图像识别方向）。",
    recommendation: "优先1主1备，主框架承载回归，备框架应对特殊场景。",
  },
  "移动端自动化": {
    selectionBasis: "关注真机覆盖、脚本稳定性、平台兼容。",
    alternatives: "国际主流：Appium/Detox；国内常用：Airtest。",
    recommendation: "先覆盖登录-支付-更新三条金路径，再扩展场景。",
  },
  "API/契约测试": {
    selectionBasis: "关注文档一致性、CLI集成、契约治理能力。",
    alternatives: "国际主流：Postman/Pact；国内常用：Apifox。",
    recommendation: "接口调试平台与契约工具各选1个，避免重复投入。",
  },
  "性能与稳定性": {
    selectionBasis: "关注压测并发能力、脚本可维护性、结果可观测性。",
    alternatives: "国际主流：k6/Locust；传统企业：JMeter。",
    recommendation: "将阈值门禁化，不做只出报告不阻断的压测。",
  },
  "安全测试": {
    selectionBasis: "关注漏洞覆盖深度、自动化能力、手工验证能力。",
    alternatives: "国际主流：ZAP/Burp；开源补充：mitmproxy。",
    recommendation: "基线扫描自动化 + 高危漏洞手工复核。",
  },
  "兼容性与真机云测": {
    selectionBasis: "关注设备覆盖、并发执行能力、调试证据完整度。",
    alternatives: "国际主流：BrowserStack/Firebase/AWS Device Farm。",
    recommendation: "按用户设备分布建矩阵，先Top机型后长尾。",
  },
  "可观测性与发布监控": {
    selectionBasis: "关注错误聚合、链路追踪、告警联动能力。",
    alternatives: "国际主流：Sentry/Datadog；开源主流：Grafana生态。",
    recommendation: "发布监控口径与测试门禁指标统一。",
  },
  "缺陷管理与测试协同": {
    selectionBasis: "关注流程可配置、追溯能力、报表能力。",
    alternatives: "国际主流：Jira/TestRail；Jira生态：Xray。",
    recommendation: "需求-用例-缺陷必须形成可追溯链路。",
  },
  "测试数据与Mock": {
    selectionBasis: "关注数据生成效率、环境隔离、调试成本。",
    alternatives: "国际主流：WireMock/MSW；轻量替代：Mockoon。",
    recommendation: "先解决不可控依赖，再做大规模自动化。",
  },
  "AI辅助测试与质量工程": {
    selectionBasis: "关注代码上下文理解、可控性、企业合规。",
    alternatives: "国际主流：Copilot/Qodo/mabl。",
    recommendation: "先在单元与回归脚本生成试点，逐步扩面。",
  },
};

const q = (
  install: string,
  minimalCase: string,
  ci: string,
  pitfalls: string,
  acceptance: string,
): QuickStartCard => ({ install, minimalCase, ci, pitfalls, acceptance });

const toolItems: ToolItem[] = [
  {
    name: "Playwright",
    group: "UI/E2E自动化",
    sceneTags: ["通用", "App"],
    scenario: "Web/H5核心流程回归与发布前冒烟",
    coreFeatures: ["多浏览器支持", "自动等待", "Trace Viewer"],
    businessValue: "将人工回归压缩到分钟级并可追溯失败证据",
    teamStage: "成长",
    quickStart: q("安装并初始化官方项目", "实现登录-下单最小链路", "在PR流水线执行smoke", "避免脆弱选择器和硬等待", "核心流程通过率>=95%"),
    officialDoc: "https://playwright.dev/docs/intro",
    repo: "https://github.com/microsoft/playwright",
  },
  {
    name: "Cypress",
    group: "UI/E2E自动化",
    sceneTags: ["通用"],
    scenario: "前端SPA快速回归与Mock驱动测试",
    coreFeatures: ["时间旅行调试", "网络拦截", "开发体验友好"],
    businessValue: "缩短前端提交反馈周期",
    teamStage: "初创",
    quickStart: q("安装Cypress并初始化", "跑通登录-提交最小流", "接入CI并行执行", "过度依赖真实后端会导致不稳定", "关键冒烟用例全部稳定"),
    officialDoc: "https://docs.cypress.io/app/get-started/why-cypress",
    repo: "https://github.com/cypress-io/cypress",
  },
  {
    name: "Selenium WebDriver",
    group: "UI/E2E自动化",
    sceneTags: ["通用"],
    scenario: "跨语言团队统一UI自动化基座",
    coreFeatures: ["W3C标准", "Grid并行", "生态成熟"],
    businessValue: "兼容历史资产，降低迁移成本",
    teamStage: "大型",
    quickStart: q("安装客户端与驱动", "构建页面对象最小案例", "接入Grid并发执行", "驱动版本不一致会导致不稳定", "关键链路全浏览器通过"),
    officialDoc: "https://www.selenium.dev/documentation/webdriver/",
    repo: "https://github.com/SeleniumHQ/selenium",
  },
  {
    name: "Appium",
    group: "移动端自动化",
    sceneTags: ["游戏", "App"],
    scenario: "iOS/Android跨平台自动化回归",
    coreFeatures: ["跨平台", "驱动插件化", "语言生态广"],
    businessValue: "建立统一移动端自动化能力",
    teamStage: "成长",
    quickStart: q("安装Server与驱动", "实现启动-登录最小流", "设备云或真机接入CI", "元素定位策略不统一会高频失败", "主流程脚本稳定运行7天"),
    officialDoc: "https://appium.io/docs/en/latest/",
    repo: "https://github.com/appium/appium",
  },
  {
    name: "Maestro",
    group: "移动端自动化",
    sceneTags: ["App", "通用"],
    scenario: "YAML编排移动端业务流程",
    coreFeatures: ["上手快", "自动重试", "可读性高"],
    businessValue: "业务QA也可快速产出自动化用例",
    teamStage: "初创",
    quickStart: q("安装CLI并连接设备", "写launchApp/tapOn最小流", "将flow纳入CI", "步骤过长不拆分会难维护", "关键业务流每次构建可执行"),
    officialDoc: "https://docs.maestro.dev/",
    repo: "https://github.com/mobile-dev-inc/maestro",
  },
  {
    name: "Detox",
    group: "移动端自动化",
    sceneTags: ["App"],
    scenario: "React Native端到端稳定性测试",
    coreFeatures: ["灰盒同步", "Jest生态", "RN适配"],
    businessValue: "降低RN自动化波动和维护成本",
    teamStage: "成长",
    quickStart: q("完成Detox环境配置", "编写登录最小用例", "接入RN流水线", "testID缺失会导致高维护成本", "主流程回归稳定通过"),
    officialDoc: "https://wix.github.io/Detox/docs/introduction/getting-started/",
    repo: "https://github.com/wix/Detox",
  },
  {
    name: "Postman",
    group: "API/契约测试",
    sceneTags: ["通用"],
    scenario: "接口调试、文档同步、冒烟集合维护",
    coreFeatures: ["Collection", "环境变量", "团队协作"],
    businessValue: "减少联调沟通与重复验证成本",
    teamStage: "初创",
    quickStart: q("导入OpenAPI并建立环境", "编写关键接口断言", "通过CLI接入CI", "环境变量污染会导致误报", "核心接口集合通过率>=98%"),
    officialDoc: "https://learning.postman.com/docs/getting-started/overview/",
    repo: "https://github.com/postmanlabs/newman",
  },
  {
    name: "Apifox",
    group: "API/契约测试",
    sceneTags: ["通用"],
    scenario: "设计-调试-Mock-自动化一体化",
    coreFeatures: ["同源文档", "Mock支持", "自动化编排"],
    businessValue: "提升前后端并行效率",
    teamStage: "成长",
    quickStart: q("创建项目并导入接口", "先做登录/支付最小链路", "接入CI批量执行", "文档与实现不同步会失真", "接口定义与实现误差持续下降"),
    officialDoc: "https://docs.apifox.com/",
  },
  {
    name: "Pact",
    group: "API/契约测试",
    sceneTags: ["通用"],
    scenario: "消费者驱动契约，降低跨服务破坏性变更",
    coreFeatures: ["CDC模式", "Broker", "契约可追溯"],
    businessValue: "提前拦截联调期兼容问题",
    teamStage: "大型",
    quickStart: q("消费者侧先生成契约", "验证关键字段和状态码", "在提供者CI校验契约", "契约未版本化会难追踪", "契约验证失败即阻断发布"),
    officialDoc: "https://docs.pact.io/",
    repo: "https://github.com/pact-foundation/pact-js",
  },
  {
    name: "k6",
    group: "性能与稳定性",
    sceneTags: ["通用"],
    scenario: "接口压测与性能门禁",
    coreFeatures: ["JS脚本化", "阈值断言", "CI友好"],
    businessValue: "把性能测试纳入迭代节奏",
    teamStage: "成长",
    quickStart: q("安装k6", "写最小并发脚本", "在CI中跑阈值校验", "只测平均值会掩盖尾延迟", "P95和错误率均达标"),
    officialDoc: "https://grafana.com/docs/k6/latest/get-started/",
    repo: "https://github.com/grafana/k6",
  },
  {
    name: "Apache JMeter",
    group: "性能与稳定性",
    sceneTags: ["通用"],
    scenario: "多协议压测与历史资产复用",
    coreFeatures: ["插件生态", "GUI+CLI", "企业常用"],
    businessValue: "降低传统团队迁移风险",
    teamStage: "大型",
    quickStart: q("安装JMeter", "录制最小压测脚本", "切换非GUI接入CI", "监听器过多会影响压测真实性", "压测报告可复现并达标"),
    officialDoc: "https://jmeter.apache.org/usermanual/get-started.html",
    repo: "https://github.com/apache/jmeter",
  },
  {
    name: "Locust",
    group: "性能与稳定性",
    sceneTags: ["通用"],
    scenario: "复杂用户行为模型压测",
    coreFeatures: ["Python灵活", "分布式", "可视化"],
    businessValue: "更贴近真实业务流量模型",
    teamStage: "成长",
    quickStart: q("安装Locust", "编写最小用户行为脚本", "主从模式接入CI", "场景建模不真实会误判容量", "容量预测误差可控"),
    officialDoc: "https://docs.locust.io/en/stable/quickstart.html",
    repo: "https://github.com/locustio/locust",
  },
  {
    name: "OWASP ZAP",
    group: "安全测试",
    sceneTags: ["通用"],
    scenario: "基线安全扫描与左移安全",
    coreFeatures: ["开源", "自动扫描", "CI插件"],
    businessValue: "及早发现常见安全风险",
    teamStage: "成长",
    quickStart: q("安装ZAP并配置代理", "执行被动扫描最小任务", "在CI定时扫描", "未限定Scope会误扫", "高危漏洞必须清零"),
    officialDoc: "https://www.zaproxy.org/docs/",
    repo: "https://github.com/zaproxy/zaproxy",
  },
  {
    name: "Burp Suite",
    group: "安全测试",
    sceneTags: ["通用"],
    scenario: "Web/API深度漏洞验证",
    coreFeatures: ["代理重放", "主动扫描", "手工验证强"],
    businessValue: "提升高危漏洞发现深度",
    teamStage: "大型",
    quickStart: q("配置浏览器代理", "完成认证流程最小抓包", "将扫描报告接入缺陷系统", "误报不复核会造成噪音", "高危漏洞复测通过"),
    officialDoc: "https://portswigger.net/burp/documentation",
  },
  {
    name: "mitmproxy",
    group: "安全测试",
    sceneTags: ["游戏", "App", "通用"],
    scenario: "流量分析、篡改与故障注入",
    coreFeatures: ["脚本扩展", "CLI/WEB", "协议调试"],
    businessValue: "快速定位网络和协议问题",
    teamStage: "成长",
    quickStart: q("安装并配置证书", "抓取关键接口最小流", "在CI中执行脚本化回放", "证书配置错误会导致数据失真", "核心链路可稳定重放"),
    officialDoc: "https://docs.mitmproxy.org/stable/overview/installation/",
    repo: "https://github.com/mitmproxy/mitmproxy",
  },
  {
    name: "BrowserStack App Automate",
    group: "兼容性与真机云测",
    sceneTags: ["游戏", "App"],
    scenario: "大规模真机并行回归",
    coreFeatures: ["设备覆盖广", "并行执行", "调试证据完整"],
    businessValue: "减少自建机房成本",
    teamStage: "成长",
    quickStart: q("开通账号并接入凭据", "上传包并跑首个机型矩阵", "在CI按机型分层执行", "矩阵过大不分层会拖慢反馈", "Top机型回归通过率达标"),
    officialDoc: "https://www.browserstack.com/docs/app-automate/appium/overview",
  },
  {
    name: "Firebase Test Lab",
    group: "兼容性与真机云测",
    sceneTags: ["游戏", "App"],
    scenario: "Android/iOS设备矩阵和游戏循环测试",
    coreFeatures: ["设备矩阵", "Game Loop", "GCP集成"],
    businessValue: "批量兼容验证效率高",
    teamStage: "成长",
    quickStart: q("配置项目与测试包", "先覆盖Top机型最小集", "通过gcloud接入CI", "忽略区域差异会漏掉问题", "关键机型和系统全通过"),
    officialDoc: "https://firebase.google.com/docs/test-lab/android/get-started",
  },
  {
    name: "AWS Device Farm",
    group: "兼容性与真机云测",
    sceneTags: ["App", "通用"],
    scenario: "AWS生态下的真机测试与自动化执行",
    coreFeatures: ["与AWS集成", "设备池", "批量任务"],
    businessValue: "云原生团队可快速落地兼容测试",
    teamStage: "大型",
    quickStart: q("创建Device Farm项目", "上传应用和测试包", "接入流水线触发任务", "设备池配置粗糙会浪费成本", "设备矩阵结果稳定可复现"),
    officialDoc: "https://docs.aws.amazon.com/devicefarm/latest/APIReference/Welcome.html",
  },
  {
    name: "Sentry",
    group: "可观测性与发布监控",
    sceneTags: ["游戏", "App", "通用"],
    scenario: "线上错误聚合、发布关联与性能追踪",
    coreFeatures: ["Issue聚合", "Release关联", "告警联动"],
    businessValue: "缩短线上故障定位时间",
    teamStage: "成长",
    quickStart: q("接入SDK并配置release", "生成首个错误事件", "接入告警渠道和工单", "环境标签不规范会难追踪", "MTTR持续下降"),
    officialDoc: "https://docs.sentry.io/",
    repo: "https://github.com/getsentry/sentry",
  },
  {
    name: "Grafana",
    group: "可观测性与发布监控",
    sceneTags: ["通用"],
    scenario: "发布窗口核心指标大盘",
    coreFeatures: ["多数据源", "灵活可视化", "告警规则"],
    businessValue: "测试指标与线上指标统一观察",
    teamStage: "成长",
    quickStart: q("接入数据源", "搭建发布大盘最小版", "接入告警与值班", "指标口径不一致会误判", "门禁指标实时可观测"),
    officialDoc: "https://grafana.com/docs/grafana/latest/getting-started/",
    repo: "https://github.com/grafana/grafana",
  },
  {
    name: "Datadog APM",
    group: "可观测性与发布监控",
    sceneTags: ["通用"],
    scenario: "分布式链路追踪与服务性能监控",
    coreFeatures: ["APM+Logs+Metrics", "服务拓扑", "企业级告警"],
    businessValue: "复杂微服务下快速定位根因",
    teamStage: "大型",
    quickStart: q("安装Agent并启用APM", "接入关键服务最小链路", "将异常链路接入发布门禁", "采样策略不当会丢关键证据", "关键服务SLO稳定"),
    officialDoc: "https://docs.datadoghq.com/tracing/",
  },
  {
    name: "Jira",
    group: "缺陷管理与测试协同",
    sceneTags: ["通用"],
    scenario: "需求-任务-缺陷一体管理",
    coreFeatures: ["工作流可配", "看板", "自动化规则"],
    businessValue: "统一跨团队协作语义",
    teamStage: "成长",
    quickStart: q("创建项目和Issue类型", "定义缺陷流转最小流程", "接入自动化结果回传", "状态定义混乱会导致失真", "缺陷链路可追溯"),
    officialDoc: "https://www.atlassian.com/software/jira",
  },
  {
    name: "TestRail",
    group: "缺陷管理与测试协同",
    sceneTags: ["通用"],
    scenario: "用例资产化与测试执行管理",
    coreFeatures: ["测试计划", "覆盖率统计", "报告"],
    businessValue: "沉淀可复用测试资产",
    teamStage: "成长",
    quickStart: q("创建项目和里程碑", "导入核心用例最小集", "接入自动化结果", "字段规范不统一会难复用", "版本覆盖率可量化"),
    officialDoc: "https://support.testrail.com/hc/en-us/articles/41981504478100-Getting-Started-Page",
  },
  {
    name: "Xray",
    group: "缺陷管理与测试协同",
    sceneTags: ["通用"],
    scenario: "Jira生态下需求-用例-缺陷追溯",
    coreFeatures: ["Jira深度集成", "可追溯矩阵", "测试执行管理"],
    businessValue: "减少多系统切换成本",
    teamStage: "大型",
    quickStart: q("在Jira中启用Xray", "建立需求到用例映射", "自动化结果接入Jira流水线", "追溯字段缺失会导致审计失败", "Traceability报告可审计"),
    officialDoc: "https://www.getxray.app/",
  },
  {
    name: "WireMock",
    group: "测试数据与Mock",
    sceneTags: ["通用"],
    scenario: "服务虚拟化与契约模拟",
    coreFeatures: ["HTTP Stub", "录制回放", "可编排"],
    businessValue: "隔离外部依赖，提升回归稳定性",
    teamStage: "成长",
    quickStart: q("启动WireMock服务", "定义首个stub最小案例", "在CI中按环境切换mock", "stub过期不维护会误导测试", "回归稳定性明显提升"),
    officialDoc: "https://wiremock.org/docs/",
    repo: "https://github.com/wiremock/wiremock",
  },
  {
    name: "Mockoon",
    group: "测试数据与Mock",
    sceneTags: ["通用"],
    scenario: "本地快速Mock和联调替身",
    coreFeatures: ["图形化", "轻量", "数据模板"],
    businessValue: "降低前后端并行门槛",
    teamStage: "初创",
    quickStart: q("安装并创建mock环境", "生成登录接口最小响应", "将mock地址注入测试环境", "mock规则不版本化会漂移", "联调阻塞显著下降"),
    officialDoc: "https://mockoon.com/docs/latest/",
    repo: "https://github.com/mockoon/mockoon",
  },
  {
    name: "MSW",
    group: "测试数据与Mock",
    sceneTags: ["App", "通用"],
    scenario: "前端/Node请求拦截与Mock",
    coreFeatures: ["Service Worker拦截", "测试友好", "前端集成轻量"],
    businessValue: "提升前端回归可控性",
    teamStage: "成长",
    quickStart: q("安装MSW", "定义最小请求拦截", "在测试流水线注入mock handler", "mock与真实契约偏离会失真", "前端用例稳定通过"),
    officialDoc: "https://mswjs.io/docs/",
    repo: "https://github.com/mswjs/msw",
  },
  {
    name: "GitHub Copilot",
    group: "AI辅助测试与质量工程",
    sceneTags: ["通用"],
    scenario: "辅助生成测试代码与断言",
    coreFeatures: ["上下文补全", "多语言支持", "IDE集成"],
    businessValue: "提高测试代码编写效率",
    teamStage: "初创",
    quickStart: q("开通并安装插件", "让Copilot生成最小测试", "在CI中执行并审查", "直接接受生成结果会引入幻觉", "生成代码审查通过率提升"),
    officialDoc: "https://docs.github.com/en/copilot",
  },
  {
    name: "Qodo (CodiumAI)",
    group: "AI辅助测试与质量工程",
    sceneTags: ["通用"],
    scenario: "基于代码上下文生成测试建议",
    coreFeatures: ["测试建议", "风险提示", "PR辅助"],
    businessValue: "提升边界场景覆盖率",
    teamStage: "成长",
    quickStart: q("安装Qodo插件", "为关键函数生成最小测试", "纳入PR检查流程", "忽略业务约束会产生无效用例", "关键模块覆盖率可见提升"),
    officialDoc: "https://docs.qodo.ai/",
  },
  {
    name: "mabl",
    group: "AI辅助测试与质量工程",
    sceneTags: ["App", "通用"],
    scenario: "低代码智能回归与质量分析",
    coreFeatures: ["智能定位", "低代码", "报告聚合"],
    businessValue: "降低自动化门槛并加快落地",
    teamStage: "大型",
    quickStart: q("创建workspace并录制场景", "定义最小业务流程", "连接CI执行回归", "无分层策略会导致执行冗长", "回归反馈时长显著缩短"),
    officialDoc: "https://help.mabl.com/",
  },
];

const raciRows: RaciRow[] = [
  { process: "需求评审与风险分级", r: "QA Owner", a: "研发负责人", c: "产品、架构、运维", i: "运营、客服" },
  { process: "测试计划与用例评审", r: "模块QA", a: "QA Owner", c: "开发TL、产品", i: "项目经理" },
  { process: "缺陷分诊与修复跟踪", r: "开发TL", a: "研发负责人", c: "QA Owner", i: "产品、运营" },
  { process: "Go/No-Go决策", r: "版本Owner", a: "研发负责人", c: "QA Owner、运维、产品", i: "业务线管理层" },
  { process: "发布与回滚执行", r: "运维负责人", a: "版本Owner", c: "QA、开发", i: "客服、运营" },
];

const kpiRows: KpiRow[] = [
  { metric: "P0/P1逃逸率", target: "<= 2%", cadence: "按版本", riskSignal: "连续两版超标需要流程升级" },
  { metric: "自动化门禁通过率", target: ">= 95%", cadence: "每日", riskSignal: "低于阈值需排查flaky与环境" },
  { metric: "回归周期", target: "季度下降>=15%", cadence: "季度", riskSignal: "周期不降说明自动化瓶颈" },
  { metric: "MTTR", target: "<= 60分钟", cadence: "按事件", riskSignal: "超时说明监控或应急机制不足" },
  { metric: "回滚率", target: "<= 3%", cadence: "按版本", riskSignal: "回滚率升高需重检门禁口径" },
];

const cadenceRows = [
  "T-14：冻结范围、风险建模、测试计划评审",
  "T-7：冒烟与回归集冻结、专项计划确认",
  "T-2：预发布门评审与回滚演练",
  "T+0：灰度放量与实时监控",
  "T+1~T+3：复盘与CAPA落地",
];

const levelRows = [
  { level: "初级", focus: "执行标准化", actions: ["按模板写缺陷", "维护冒烟清单", "掌握边界值/等价类"] },
  { level: "中级", focus: "模块质量Owner", actions: ["输出风险矩阵", "建设模块门禁", "主导联调定界"] },
  { level: "高级", focus: "版本质量运营", actions: ["主导Go/No-Go", "建立专项体系", "驱动效率指标改进"] },
  { level: "专家", focus: "组织级质量平台", actions: ["统一质量口径", "建设审计体系", "推动AI质效工程化"] },
];

const appendixTemplates: AppendixTemplate[] = [
  {
    title: "模板库",
    items: [
      "版本测试计划模板（范围、风险、资源、节奏）",
      "缺陷单模板（现象/步骤/期望/实际/日志）",
      "发布Runbook模板（灰度策略/回滚脚本/沟通链路）",
    ],
  },
  {
    title: "检查清单",
    items: [
      "提测门检查清单：用例、环境、埋点、日志",
      "上线门检查清单：门禁结论、值班表、告警规则",
      "复盘门检查清单：根因、改进项、责任与期限",
    ],
  },
  {
    title: "测试场景回归点",
    items: [
      "路由与导航：入口、互链、返回链路",
      "内容渲染：Tabs、表格滚动、折叠卡、移动端换行",
      "信息一致性：30工具字段完整、游戏/App口径一致",
    ],
  },
];

const glossaryRows: GlossaryRow[] = [
  { term: "Go/No-Go", definition: "上线前门禁决策机制，未达标直接No-Go" },
  { term: "SLA", definition: "缺陷响应与修复时限承诺" },
  { term: "MTTR", definition: "平均修复时长，用于衡量线上故障恢复效率" },
  { term: "CAPA", definition: "纠正与预防措施，用于复盘闭环" },
  { term: "Escape Rate", definition: "测试阶段漏出的线上缺陷比例" },
];

const sourceRows: SourceRow[] = [
  { title: "Playwright Docs", url: "https://playwright.dev/docs/intro", note: "官方文档与升级日志" },
  { title: "Appium Docs", url: "https://appium.io/docs/en/latest/", note: "移动自动化官方文档" },
  { title: "Postman Learning Center", url: "https://learning.postman.com/docs/getting-started/overview/", note: "接口工具官方学习入口" },
  { title: "k6 Docs", url: "https://grafana.com/docs/k6/latest/get-started/", note: "压测框架官方文档" },
  { title: "OWASP ZAP Docs", url: "https://www.zaproxy.org/docs/", note: "安全测试工具官方文档" },
  { title: "BrowserStack Docs", url: "https://www.browserstack.com/docs/app-automate/appium/overview", note: "真机云测官方文档" },
  { title: "Sentry Docs", url: "https://docs.sentry.io/", note: "发布监控与错误追踪" },
  { title: "Jira Product", url: "https://www.atlassian.com/software/jira", note: "缺陷协同官方产品页" },
  { title: "WireMock Docs", url: "https://wiremock.org/docs/", note: "Mock与服务虚拟化" },
  { title: "GitHub Copilot Docs", url: "https://docs.github.com/en/copilot", note: "AI辅助测试编码" },
];

const sceneFilters: Array<"全部" | SceneTag> = ["全部", "游戏", "App", "通用"];
const groupFilters: Array<"全部" | ToolGroup> = ["全部", ...toolGroups];

function levelBadge(level: RiskRow["level"]): "default" | "destructive" | "secondary" | "outline" {
  if (level === "P0") return "destructive";
  if (level === "P1") return "default";
  return "secondary";
}

export default function VersionTestingManagementReference() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [groupFilter, setGroupFilter] = useState<"全部" | ToolGroup>("全部");
  const [sceneFilter, setSceneFilter] = useState<"全部" | SceneTag>("全部");
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const filteredTools = useMemo(() => {
    return toolItems.filter((tool) => {
      const byGroup = groupFilter === "全部" || tool.group === groupFilter;
      const byScene = sceneFilter === "全部" || tool.sceneTags.includes(sceneFilter);
      return byGroup && byScene;
    });
  }, [groupFilter, sceneFilter]);

  const groupedTools = useMemo(() => {
    return toolGroups
      .map((group) => ({ group, tools: filteredTools.filter((tool) => tool.group === group) }))
      .filter((item) => item.tools.length > 0);
  }, [filteredTools]);

  const toggleCard = (key: string) => {
    setOpenCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ToolLayout
      title="版本测试与管理实战手册（游戏 & App）"
      description="严格对齐企业版本管理：方法论、门禁、Top 30工具、5步上手卡、组织落地与附录模板"
      icon={ShieldAlert}
    >
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                专题定位与时效边界
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                适用对象：测试负责人、QA工程师、测试开发、项目经理、版本Owner。按发布日期有效：2026-02-23。
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">游戏 + App双场景</Badge>
                <Badge variant="outline">Top 30工具</Badge>
                <Badge variant="outline">每工具5步上手卡</Badge>
                <Badge variant="outline">可执行模板附录</Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to="/docs/game-rnd-lifecycle">研发全生命周期</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/docs/game-testing">游戏测试技术库</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/docs/software-testing">软件测试工具体系</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            章节锚点目录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4">
            {tabs.map((tab) => (
              <a
                key={tab.key}
                href={`#${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className="rounded-md border border-border/60 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              >
                {tab.label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)} className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-muted/50 p-1 lg:grid-cols-8">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="text-xs md:text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div id="overview" className="sr-only" />
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="h-5 w-5 text-primary" />
                版本测试管理体系总览
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                必须覆盖：版本分层、测试分层、风险分级、门禁机制、质量信号。
              </p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">版本分层</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">版本类型</th>
                      <th className="p-2 text-left">节奏</th>
                      <th className="p-2 text-left">目标</th>
                      <th className="p-2 text-left">测试重点</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versionTypes.map((row) => (
                      <tr key={row.type} className="border-b last:border-0">
                        <td className="p-2 font-medium">{row.type}</td>
                        <td className="p-2 text-muted-foreground">{row.cadence}</td>
                        <td className="p-2 text-muted-foreground">{row.objective}</td>
                        <td className="p-2 text-muted-foreground">{row.testFocus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">测试分层</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <table className="w-full min-w-[620px] text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">层级</th>
                        <th className="p-2 text-left">目标</th>
                        <th className="p-2 text-left">入口</th>
                        <th className="p-2 text-left">出口</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testingLayers.map((row) => (
                        <tr key={row.layer} className="border-b last:border-0">
                          <td className="p-2 font-medium">{row.layer}</td>
                          <td className="p-2 text-muted-foreground">{row.target}</td>
                          <td className="p-2 text-muted-foreground">{row.entry}</td>
                          <td className="p-2 text-muted-foreground">{row.exit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">风险分级（资损/稳定/体验/合规）</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <table className="w-full min-w-[620px] text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">级别</th>
                        <th className="p-2 text-left">资损</th>
                        <th className="p-2 text-left">稳定</th>
                        <th className="p-2 text-left">体验</th>
                        <th className="p-2 text-left">合规</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskRows.map((row) => (
                        <tr key={row.level} className="border-b last:border-0">
                          <td className="p-2"><Badge variant={levelBadge(row.level)}>{row.level}</Badge></td>
                          <td className="p-2 text-muted-foreground">{row.assetRisk}</td>
                          <td className="p-2 text-muted-foreground">{row.stabilityRisk}</td>
                          <td className="p-2 text-muted-foreground">{row.experienceRisk}</td>
                          <td className="p-2 text-muted-foreground">{row.complianceRisk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">质量信号（版本健康仪表盘）</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              {qualitySignals.map((item) => (
                <div key={item.metric} className="rounded-md border border-border/60 p-3">
                  <p className="font-medium text-foreground">{item.metric}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.definition}</p>
                  <Badge variant="outline" className="mt-2 text-xs">目标：{item.target}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closed-loop" className="space-y-6">
          <div id="closed-loop" className="sr-only" />
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                日常版本测试闭环（需求到发布到复盘）
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {lifecycleStages.map((stage) => (
              <Card key={stage.stage}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{stage.stage}</CardTitle>
                  <p className="text-xs text-muted-foreground">Owner: {stage.owner}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>{stage.action}</p>
                  <p className="rounded-md border border-border/60 bg-muted/30 p-2 text-xs">输出：{stage.output}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">日常版本节奏模板</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {dailyRituals.map((item) => (
                  <div key={item.stage} className="rounded-md border border-border/60 p-3">
                    <p className="font-medium text-foreground">{item.stage}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.owner}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.action}</p>
                    <Badge variant="outline" className="mt-2 text-xs">输出：{item.output}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenario" className="space-y-6">
          <div id="scenario" className="sr-only" />
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gamepad2 className="h-5 w-5 text-primary" />
                游戏与App差异化测试策略
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="w-full">
                <table className="w-full min-w-[980px] text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">维度</th>
                      <th className="p-2 text-left">游戏</th>
                      <th className="p-2 text-left">App</th>
                      <th className="p-2 text-left">共同基线</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioRows.map((row) => (
                      <tr key={row.dimension} className="border-b last:border-0">
                        <td className="p-2 font-medium">{row.dimension}</td>
                        <td className="p-2 text-muted-foreground">{row.game}</td>
                        <td className="p-2 text-muted-foreground">{row.app}</td>
                        <td className="p-2 text-muted-foreground">{row.baseline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gate" className="space-y-6">
          <div id="gate" className="sr-only" />
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                质量门禁（Go/No-Go）与风险分级
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {gateRows.map((row) => (
              <Card key={row.gate}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {row.gate}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">必须通过</p>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      {row.mustPass.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <ArrowRight className="mt-1 h-3.5 w-3.5 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-md border border-red-500/30 bg-red-500/5 p-2">
                    <p className="font-medium text-foreground">阻断条件</p>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      {row.blockers.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                回滚Runbook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {rollbackRunbook.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tools" className="space-y-6">
          <div id="tools" className="sr-only" />
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 text-primary" />
                Top 30 工具/产品清单（按测试域分组）
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                已收录 {toolItems.length} 款工具，支持“按域筛选 + 场景筛选 + 分组表格 + 详情折叠卡”。
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  {groupFilters.map((item) => (
                    <Button
                      key={item}
                      size="sm"
                      variant={groupFilter === item ? "default" : "outline"}
                      onClick={() => setGroupFilter(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <div className="flex flex-wrap gap-2">
                    {sceneFilters.map((item) => (
                      <Button
                        key={item}
                        size="sm"
                        variant={sceneFilter === item ? "default" : "outline"}
                        onClick={() => setSceneFilter(item)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {groupedTools.map(({ group, tools }) => (
            <Card key={group}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  {group}
                </CardTitle>
                <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">选型依据：</span>{groupGuides[group].selectionBasis}</p>
                  <p><span className="font-medium text-foreground">替代关系：</span>{groupGuides[group].alternatives}</p>
                  <p><span className="font-medium text-foreground">选型建议：</span>{groupGuides[group].recommendation}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="w-full">
                  <table className="w-full min-w-[980px] text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">工具</th>
                        <th className="p-2 text-left">场景标签</th>
                        <th className="p-2 text-left">适用团队阶段</th>
                        <th className="p-2 text-left">业务价值</th>
                        <th className="p-2 text-left">资料</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tools.map((tool) => (
                        <tr key={`${group}-${tool.name}`} className="border-b last:border-0">
                          <td className="p-2 font-medium">{tool.name}</td>
                          <td className="p-2">
                            <div className="flex flex-wrap gap-1">
                              {tool.sceneTags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-2 text-muted-foreground">{tool.teamStage}</td>
                          <td className="p-2 text-muted-foreground">{tool.businessValue}</td>
                          <td className="p-2">
                            <a href={tool.officialDoc} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">官方文档</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>

                <div className="grid gap-3 md:grid-cols-2">
                  {tools.map((tool) => {
                    const key = `${group}-${tool.name}`;
                    return (
                      <Collapsible key={key} open={!!openCards[key]} onOpenChange={() => toggleCard(key)}>
                        <Card className="border-border/50">
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer pb-2 hover:bg-muted/30">
                              <div className="flex items-center justify-between gap-2">
                                <CardTitle className="text-base">{tool.name}</CardTitle>
                                <ChevronDown className={`h-4 w-4 transition-transform ${openCards[key] ? "rotate-180" : ""}`} />
                              </div>
                              <p className="text-sm text-muted-foreground">{tool.scenario}</p>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                              <p className="font-medium text-foreground">核心特点</p>
                              <ul className="space-y-1">
                                {tool.coreFeatures.map((feature) => (
                                  <li key={feature} className="flex items-start gap-2">
                                    <ArrowRight className="mt-1 h-3.5 w-3.5 text-primary" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                              {tool.repo ? (
                                <p className="text-xs">
                                  <span className="font-medium text-foreground">GitHub：</span>
                                  <a href={tool.repo} target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">{tool.repo}</a>
                                </p>
                              ) : null}
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <div id="onboarding" className="sr-only" />
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" />
                每工具 5 步上手卡（安装/最小用例/CI集成/常见坑/验收标准）
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {toolItems.map((tool) => (
              <Card key={`qs-${tool.name}`} className="border-border/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{tool.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">{tool.teamStage}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{tool.group}</p>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">1. 安装：</span>{tool.quickStart.install}</p>
                  <p><span className="font-medium text-foreground">2. 最小用例：</span>{tool.quickStart.minimalCase}</p>
                  <p><span className="font-medium text-foreground">3. CI集成：</span>{tool.quickStart.ci}</p>
                  <p><span className="font-medium text-foreground">4. 常见坑：</span>{tool.quickStart.pitfalls}</p>
                  <p><span className="font-medium text-foreground">5. 验收标准：</span>{tool.quickStart.acceptance}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="organization" className="space-y-6">
          <div id="organization" className="sr-only" />
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                组织落地方案（角色分工、指标、节奏）
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                RACI协作矩阵
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <table className="w-full min-w-[820px] text-sm">
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

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  质量指标
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">指标</th>
                        <th className="p-2 text-left">目标</th>
                        <th className="p-2 text-left">统计节奏</th>
                        <th className="p-2 text-left">风险信号</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpiRows.map((row) => (
                        <tr key={row.metric} className="border-b last:border-0">
                          <td className="p-2 font-medium">{row.metric}</td>
                          <td className="p-2 text-muted-foreground">{row.target}</td>
                          <td className="p-2 text-muted-foreground">{row.cadence}</td>
                          <td className="p-2 text-muted-foreground">{row.riskSignal}</td>
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
                  发布节奏模板
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {cadenceRows.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {levelRows.map((row) => (
              <Card key={row.level}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    {row.level}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>{row.focus}</p>
                  <ul className="space-y-1">
                    {row.actions.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <ArrowRight className="mt-1 h-3.5 w-3.5 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appendix" className="space-y-6">
          <div id="appendix" className="sr-only" />
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                附录（模板、检查清单、术语口径）
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                资料核验策略：官方文档 + 官方GitHub近12个月活跃情况 + 社区实践资料。页面内容按发布日期有效。
              </p>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {appendixTemplates.map((block) => (
              <Card key={block.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{block.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {block.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <ArrowRight className="mt-1 h-3.5 w-3.5 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">术语口径</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">术语</th>
                      <th className="p-2 text-left">定义</th>
                    </tr>
                  </thead>
                  <tbody>
                    {glossaryRows.map((row) => (
                      <tr key={row.term} className="border-b last:border-0">
                        <td className="p-2 font-medium">{row.term}</td>
                        <td className="p-2 text-muted-foreground">{row.definition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">参考来源（可验证摘要）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {sourceRows.map((row) => (
                <div key={row.url} className="rounded-md border border-border/60 p-3">
                  <a href={row.url} target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
                    {row.title}
                  </a>
                  <p className="mt-1 text-muted-foreground">{row.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                文档分享版摘要（内部宣讲可直接复用）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. 版本管理必须从“提测门、预发布门、上线门、复盘门”四道门禁落地。</p>
              <p>2. 游戏与App共享方法论，但风险重点不同，必须做差异化策略。</p>
              <p>3. 工具选型遵循“1主1备”，避免平台堆叠，强调门禁化与可观测。</p>
              <p>4. 每个工具均以“安装-最小用例-CI-常见坑-验收标准”统一推进。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
