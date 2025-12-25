import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Monitor, 
  Lock, 
  Eye, 
  Server, 
  CheckCircle,
  ArrowLeft,
  Layers,
  Cpu,
  HardDrive
} from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Layers className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">关于万能工具箱</h1>
              <p className="text-muted-foreground">了解我们的工具如何保护您的数据安全</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* 本地运行原理 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                本地运行原理
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                万能工具箱采用纯前端技术构建，所有工具都在您的浏览器中直接运行，无需依赖远程服务器进行数据处理。
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Cpu className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">浏览器端处理</h4>
                    <p className="text-sm text-muted-foreground">
                      所有的编码、解码、加密、格式化等操作都使用 JavaScript/WebAssembly 在浏览器中完成
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <HardDrive className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">本地存储</h4>
                    <p className="text-sm text-muted-foreground">
                      收藏夹和使用历史仅存储在浏览器的 localStorage 中，不会同步到任何服务器
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  技术实现
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 使用 React + TypeScript 构建的单页应用 (SPA)</li>
                  <li>• 所有加密算法使用 Web Crypto API 原生实现</li>
                  <li>• 文件处理使用 File API，数据不离开浏览器</li>
                  <li>• 无需安装任何插件或软件</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 数据安全性 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                数据安全性
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                我们深知数据安全的重要性，因此在设计之初就将"零数据上传"作为核心原则。
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">零数据传输</h4>
                    <p className="text-sm text-muted-foreground">
                      您输入的所有数据（包括密码、密钥、敏感文本等）都不会通过网络传输到任何服务器。
                      所有处理都在您的设备上完成。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Eye className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">无数据收集</h4>
                    <p className="text-sm text-muted-foreground">
                      我们不收集、不存储、不分析您的任何使用数据。没有用户追踪，没有数据分析，
                      没有第三方数据共享。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">离线可用</h4>
                    <p className="text-sm text-muted-foreground">
                      页面加载完成后，即使断开网络连接，大部分工具仍可正常使用，
                      这进一步证明了数据处理完全在本地进行。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 内部专用说明 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                内部专用说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                万能工具箱专为内部团队打造，提供日常开发和运维所需的各类实用工具。
                由于所有数据都在本地处理，您可以放心地处理敏感的内部数据，
                无需担心数据泄露风险。
              </p>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>适合处理内部配置文件</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>安全处理 API 密钥和令牌</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>可用于加密敏感数据</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>无需担心数据合规问题</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 常见问题 */}
          <Card>
            <CardHeader>
              <CardTitle>常见问题</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Q: 使用这些工具需要联网吗？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 首次访问需要联网加载页面资源，加载完成后大部分工具可离线使用。
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Q: 我的数据会被保存在服务器上吗？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 不会。所有数据仅在您的浏览器中临时处理，关闭页面后数据即被清除。
                  收藏夹等设置仅存储在浏览器本地。
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Q: 可以在内网环境中部署吗？</h4>
                <p className="text-sm text-muted-foreground">
                  A: 可以。作为纯前端应用，可以轻松部署到任何静态文件服务器，
                  实现完全内网隔离的使用环境。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
