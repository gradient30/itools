import { Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

export default function PageLoader() {
    return (
        <Layout>
            <div className="min-h-screen">
                <div className="fixed inset-0 -z-10 tech-grid opacity-30" />
                <div className="container max-w-5xl px-4 py-6 lg:py-8 flex flex-col items-center justify-center min-h-[50vh]">
                    <div
                        className={cn(
                            "flex flex-col items-center justify-center p-8 gap-4",
                            "rounded-2xl border bg-card/50 backdrop-blur-sm",
                            "border-border/50 shadow-sm min-w-[280px]"
                        )}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <Loader2 className="h-10 w-10 text-primary animate-spin relative z-10" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium animate-pulse">
                            加载核心组件...
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
