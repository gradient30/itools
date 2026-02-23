import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Bug,
    ShieldAlert,
    ChevronDown,
    CheckCircle2,
    Terminal,
    Activity,
    Layers,
    ArrowRight,
    MonitorPlay,
    Zap,
    Bot,
    Globe,
    Database,
    Search,
    Crosshair,
    Gauge,
    Network
} from "lucide-react";

// 2024-2026 前端/UI 自动化测试核心工具
const uiAutomationTools = [
    {
        name: "Playwright",
        badge: "行业新标准",
        icon: MonitorPlay,
        description: "由微软维护的跨浏览器端到端测试工具。目前已取代大量传统 Selenium/Cypress 份额。",
        features: [
            "天生支持多标签页、多域名和 iframes",
            "自动等待机制 (Auto-wait) 极其健壮，告别死等",
            "同时支持 WebKit, Chromium 和 Firefox 引擎",
            "强大的代码生成器 (Codegen) 以及 Trace Viewer 分析时光机",
            "与 CI 流水线极佳的集成体验"
        ],
        idealFor: "现代 Web 应用的全链路 E2E 测试、视觉回归"
    },
    {
        name: "Cypress",
        badge: "前端最爱",
        icon: LayoutDashboardIcon, // Fallback to layers
        description: "专为现代 Web 构建的下一代前端测试工具，直接在浏览器中运行，调试体验极佳。",
        features: [
            "时间漫游 (Time Travel) 调试，清晰明了",
            "网络层拦截及 Mock 数据极其方便",
            "与应用代码同生命周期，实时重载"
        ],
        idealFor: "需要强 Mock 的前端单页应用测试"
    },
    {
        name: "Maestro",
        badge: "移动端黑马",
        icon: Smartphone, // Assuming generic smartphone if icon not available, replacing with Terminal
        description: "定义移动端测试的全新方式。用简单的 YAML 编写容错极强的测试用例。",
        features: [
            "极简的 YAML 描述性语法，降低编写门槛",
            "出色的自动重试与等待机制，对抗移动端 UI 的不稳定",
            "支持 iOS 和 Android 甚至 React Native / Flutter",
            "无需到处查找元素嵌套层次，直观点击屏幕文字与组件"
        ],
        idealFor: "移动端/跨平台 App 快速搭建自动化防资损网"
    }
];

// API 与接口测试平台
const apiTestingTools = [
    {
        name: "Apidog (Apifox)",
        badge: "一站式全能",
        icon: Database,
        description: "API 文档、API 调试、API Mock、API 自动化测试一体化协作平台。",
        features: [
            "完全兼容 Postman、Swagger (OpenAPI) 格式",
            "强大的 Mock 引擎，可根据数据模型自动生成规则数据",
            "可视化用例编排与断言，降低脚本编写成本",
            "本地/云端 CI 批量运行支持"
        ],
        idealFor: "追求前后端研发协同和一站式接口治理的团队"
    },
    {
        name: "Bruno / Hoppscotch",
        badge: "轻量开源",
        icon: Terminal,
        description: "后 Postman 时代崛起的开源本地化/云端 API 请求构建器。",
        features: [
            "Bruno 倡导纯文本存储集合，与 Git 版本控制完美集成",
            "无需强制登录云同步，保护企业内部数据安全",
            "极致的启动速度和最小化的系统资源占用"
        ],
        idealFor: "独立开发者、注重安全的小型微服务团队"
    },
    {
        name: "Pact",
        badge: "契约测试",
        icon: Crosshair,
        description: "消费者驱动的契约测试工具，解决微服务架构中的联调噩梦。",
        features: [
            "消费者定义对提供者的期望结构",
            "提供者在构建阶段验证自身是否满足契约",
            "极大减少缓慢庞大的微服务联调集成测试"
        ],
        idealFor: "超大型微服务架构体系，复杂微前端网关场景"
    }
];

// 性能与压力压测
const performanceTools = [
    {
        name: "k6",
        badge: "开发现代化配置",
        icon: Gauge,
        description: "Grafana 维护的现代负载测试工具，极受开发人员欢迎的现代化压测利器。",
        features: [
            "使用标准 JavaScript 编写压测脚本，复用性强",
            "Go 语言底层，单机并发能力远超 JMeter/LoadRunner",
            "无缝对接 Grafana、Datadog 等监控数据面板",
            "面向 CI/CD 友好的命令行结构，支持检查阈值"
        ],
        idealFor: "左移性能测试、云原生架构、API并发验证"
    },
    {
        name: "Locust",
        badge: "Python生态",
        icon: Activity,
        description: "基于 Python 的分布式并发负载测试工具，灵活性极高。",
        features: [
            "完全基于 Python 代码描述压测场景，适合复杂业务逻辑",
            "极好扩展的分布式结构设计，轻松搭建主从压测集群",
            "轻巧直观的 Web UI 面板查看实时瓶颈"
        ],
        idealFor: "Python 技术栈为主的团队、需要复杂请求前置数据处理的压力场景"
    }
];

// 前沿体系：AI 与混沌工程
const edgeTools = [
    {
        name: "AI 辅助测试 (CodiumAI / Copilot)",
        badge: "智能生产力",
        icon: Bot,
        description: "通过 LLM 理解上下文，自动化补充或生成测试用例。",
        features: [
            "分析业务代码边界提取潜在用例场景（包含正常与防御情况）",
            "针对已实现函数一键生成完整的 JEST、Pytest 单元测试代码套件",
            "解释历史遗留复杂代码逻辑辅助构建测试用例"
        ],
        idealFor: "急速提升单元/集成测试覆盖率，解放重复测试编排体力活"
    },
    {
        name: "Chaos Mesh / Gremlin",
        badge: "混沌工程",
        icon: Network,
        description: "故意向系统中注入网络延迟、宕机、高磁盘使用率，以此检验系统的自愈与高可用容错。",
        features: [
            "基于 Kubernetes 环境的网络、Pod、文件系统级故障注入",
            "可视化编排一次破坏与恢复的实验",
            "在安全沙箱内常态化演练突发故障"
        ],
        idealFor: "服务上云后，大规模金融级别基础容灾排演"
    }
];

// QA 战略体系建设
const qaStrategies = [
    {
        title: "测试左移 (Shift-Left Testing) 全面实践",
        icon: ArrowRight,
        points: [
            "**需求与设计评审**：QA 在需求立项初期介入，通过澄清疑问发现最初的逻辑矛盾。",
            "**代码审查 (Code Review)**：QA 可视化参与 CR，着重验证底层分支异常和异常拦截策略。",
            "**TDD / BDD**：测试驱动开发，研发在编码之前先行确认验收标准。",
            "**尽早的自动化**：甚至可以在 UI 未完成前，对已出炉接口进行 E2E API 测试串联。"
        ]
    },
    {
        title: "全链路持续测试 (Continuous Testing)",
        icon: Layers,
        points: [
            "**构建阻断机制**：任何破坏现有基线（Unit, API, E2E失败）的提交禁止合入 Main 分支。",
            "**测试分层金字塔**：70% 单元测试（瞬时），20% 服务端集成/契约测试（分钟级），10% Web E2E 测试（较慢，覆盖核心黄金流程）。",
            "**Mock 服务器治理**：隔离外部系统的不可控依赖，保持内聚流水线的 100% 幂等执行稳定度。"
        ]
    }
];

type LayerIconProps = React.ComponentProps<typeof Layers>;

function LayoutDashboardIcon(props: LayerIconProps) {
    return <Layers {...props} />;
}
function Smartphone(props: LayerIconProps) {
    return <Terminal {...props} />;
}

export default function SoftwareTestingReference() {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        uiAutomation: true,
        apiTools: true,
        perfTools: false,
        edgeTools: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <ToolLayout
            title="现代软件测试工具与架构"
            description="2024-2026 前沿 DevOps 时代的质量保障全景指南与高效率工具汇编"
            icon={Bug}
        >
            <Card className="mb-6 border-primary/20">
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-base">关联实战文档</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                需要版本级执行方案时，可直接使用“版本测试与管理方案”进行日常计划、门禁与复盘落地。
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm">
                                <Link to="/docs/version-testing-management">查看版本测试与管理方案</Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                                <Link to="/docs/game-rnd-lifecycle">查看游戏研发全生命周期</Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 主要内容区 */}
                <div className="lg:col-span-3 space-y-6">

                    {/* 策略理念模块 - 无限轮播式信息展现概念 */}
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader className="pb-3 border-b border-primary/10">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-primary" />
                                现代 QA 工程化保障体系
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {qaStrategies.map((strategy, index) => (
                                <div key={index} className="space-y-2 bg-background/50 p-4 rounded-lg border border-border/50">
                                    <div className="font-semibold flex items-center gap-2 text-foreground">
                                        <strategy.icon className="h-4 w-4 text-primary" />
                                        {strategy.title}
                                    </div>
                                    <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside ml-1">
                                        {strategy.points.map((point, idx) => {
                                            const parts = point.split('**');
                                            if (parts.length >= 3) {
                                                return (
                                                    <li key={idx}>
                                                        <strong className="text-foreground">{parts[1]}</strong>
                                                        <span>{parts[2]}</span>
                                                    </li>
                                                );
                                            }
                                            return <li key={idx}>{point}</li>;
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="tools" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="tools">全域工具推荐名录</TabsTrigger>
                            <TabsTrigger value="mindset">防劣化防线导则</TabsTrigger>
                        </TabsList>

                        <TabsContent value="tools" className="space-y-4">
                            <Collapsible open={openSections.uiAutomation} onOpenChange={() => toggleSection("uiAutomation")}>
                                <CollapsibleTrigger asChild>
                                    <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                                        <CardHeader className="py-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <MonitorPlay className="h-5 w-5 text-primary" />
                                                    Web / 移动端 UI 自动化
                                                </CardTitle>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.uiAutomation ? "rotate-180" : ""}`} />
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2 space-y-3">
                                    {uiAutomationTools.map((tool, idx) => (
                                        <Card key={idx} className="border-l-4 border-l-primary/60">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <tool.icon className="h-5 w-5 text-muted-foreground" />
                                                        <h3 className="font-bold text-base">{tool.name}</h3>
                                                        <Badge variant="secondary" className="text-xs">{tool.badge}</Badge>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                                                <div className="bg-muted/30 p-3 rounded-md border border-border/50 mb-3">
                                                    <ul className="space-y-1 text-sm list-disc list-inside">
                                                        {tool.features.map((feature, fIdx) => <li key={fIdx}>{feature}</li>)}
                                                    </ul>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2 py-1.5 rounded w-fit">
                                                    <Crosshair className="h-3 w-3" />
                                                    <span>最佳实践：{tool.idealFor}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>

                            <Collapsible open={openSections.apiTools} onOpenChange={() => toggleSection("apiTools")}>
                                <CollapsibleTrigger asChild>
                                    <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                                        <CardHeader className="py-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <Database className="h-5 w-5 text-amber-500" />
                                                    API 测试与契约管理
                                                </CardTitle>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.apiTools ? "rotate-180" : ""}`} />
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2 space-y-3">
                                    {apiTestingTools.map((tool, idx) => (
                                        <Card key={idx} className="border-l-4 border-l-amber-500/60">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <tool.icon className="h-5 w-5 text-muted-foreground" />
                                                        <h3 className="font-bold text-base">{tool.name}</h3>
                                                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/30 bg-amber-500/10">
                                                            {tool.badge}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                                                <div className="bg-muted/30 p-3 rounded-md border border-border/50 mb-3">
                                                    <ul className="space-y-1 text-sm list-disc list-inside">
                                                        {tool.features.map((feature, fIdx) => <li key={fIdx}>{feature}</li>)}
                                                    </ul>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-500/10 px-2 py-1.5 rounded w-fit border border-amber-500/20">
                                                    <Crosshair className="h-3 w-3" />
                                                    <span>适用：{tool.idealFor}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>

                            <Collapsible open={openSections.perfTools} onOpenChange={() => toggleSection("perfTools")}>
                                <CollapsibleTrigger asChild>
                                    <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                                        <CardHeader className="py-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <Gauge className="h-5 w-5 text-rose-500" />
                                                    性能与负载发压器
                                                </CardTitle>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.perfTools ? "rotate-180" : ""}`} />
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2 space-y-3">
                                    {performanceTools.map((tool, idx) => (
                                        <Card key={idx} className="border-l-4 border-l-rose-500/60">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-bold text-base">{tool.name}</h3>
                                                    <Badge variant="outline" className="text-xs text-rose-600 border-rose-500/30 bg-rose-500/10">
                                                        {tool.badge}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">{tool.description}</p>
                                                <ul className="space-y-1 text-sm list-disc list-inside mb-3 ml-2 text-foreground/80">
                                                    {tool.features.map((feature, fIdx) => <li key={fIdx}>{feature}</li>)}
                                                </ul>
                                                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-500/10 px-2 py-1.5 rounded w-fit border border-rose-500/20">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>适用场景：{tool.idealFor}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>

                            <Collapsible open={openSections.edgeTools} onOpenChange={() => toggleSection("edgeTools")}>
                                <CollapsibleTrigger asChild>
                                    <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                                        <CardHeader className="py-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <Bot className="h-5 w-5 text-indigo-500" />
                                                    AI 生成辅助与混沌测试
                                                </CardTitle>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.edgeTools ? "rotate-180" : ""}`} />
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {edgeTools.map((tool, idx) => (
                                        <Card key={idx} className="h-full border-indigo-500/20 shadow-none bg-indigo-500/5">
                                            <CardContent className="p-4 flex flex-col h-full">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <tool.icon className="h-4 w-4 text-indigo-500" />
                                                    <h3 className="font-bold text-base text-indigo-600 dark:text-indigo-400">{tool.name}</h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3 flex-1">{tool.description}</p>
                                                <ul className="space-y-1 text-xs list-disc list-inside mb-3 text-foreground/70">
                                                    {tool.features.slice(0, 2).map((feature, fIdx) => <li key={fIdx} className="truncate">{feature}</li>)}
                                                </ul>
                                                <Badge variant="outline" className="w-fit text-xs border-indigo-500/30 text-indigo-600">
                                                    {tool.badge}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        </TabsContent>

                        <TabsContent value="mindset" className="space-y-4">
                            <Card>
                                <CardContent className="p-6 text-sm text-muted-foreground space-y-4">
                                    <h3 className="text-lg font-bold text-foreground mb-2">防线构建导则纲要</h3>
                                    <div className="p-4 bg-muted/30 rounded border border-border">
                                        <strong className="text-foreground block mb-2 font-mono">1. The Test Pyramid (坚守金字塔模型)</strong>
                                        <p>拒绝冰淇淋蛋筒式的反模式模型。保持大量、快速、无外部依赖的单元与组件级测试（Unit Testing Component Testing），只留少量核心的业务端到端 (E2E) 测试进行串联。过多的 UI 层测试会导致极高的脆弱性和重构成本。</p>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded border border-border">
                                        <strong className="text-foreground block mb-2 font-mono">2. Automate Everything (但需评估 ROI)</strong>
                                        <p>核心回测链路全自动化，但无需追求强扭的 100% 自动化率。涉及复杂图像肉眼校验、一次性多变的活动系统等模块边缘场景，探索式黑盒手工测试的人工心智敏锐度反而远优于昂贵的自动化脚本维护投入。</p>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded border border-border">
                                        <strong className="text-foreground block mb-2 font-mono">3. Environment Parity (环境等价与清理)</strong>
                                        <p>测试运行环境 (Staging) 必须与生产环境 (Production) 保持高度架构一致。且必须贯彻执行自动化测试数据的 "起手清理" 机制 (Teardown)。利用 Docker 动态启动一次性测试数据库或采用 MSW 控制 API 抹平环境差异。</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* 侧边信息栏 */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="bg-muted/50 pb-4">
                            <CardTitle className="text-base">行业金句背诵</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4 text-sm">
                            <blockquote className="border-l-2 border-primary pl-3 italic text-muted-foreground">
                                <span className="text-foreground font-medium block not-italic mb-1">“Quality is not an act, it is a habit.”</span>
                                质量并非偶发行为，而是一种习惯。
                            </blockquote>
                            <blockquote className="border-l-2 border-primary pl-3 italic text-muted-foreground">
                                <span className="text-foreground font-medium block not-italic mb-1">“If you don't like testing your product, most likely your customers won't like to test it either.”</span>
                                如果你不想花心力打磨测试你的产品，那么用户同样也会讨厌去当你的试错小白鼠。
                            </blockquote>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="bg-muted/50 pb-4">
                            <CardTitle className="text-base">推荐必读图书/体系</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 text-sm space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="font-medium">Google 软件测试之道</span>
                            </div>
                            <p className="text-xs text-muted-foreground ml-6 shadow-sm border p-2 rounded">
                                了解 SET, SWE, TE 的兵种划分与大规模基建思想。
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span className="font-medium">SRE Google 运维解密</span>
                            </div>
                            <p className="text-xs text-muted-foreground ml-6 shadow-sm border p-2 rounded">
                                测试不止于上线前。上线后的 SLI、SLA 与可观测性监控同样是测试的生命线拓扑延伸。
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ToolLayout>
    );
}
