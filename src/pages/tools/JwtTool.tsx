import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, AlertCircle, CheckCircle, Key } from "lucide-react";

interface JwtPayload {
  [key: string]: unknown;
  exp?: number;
  iat?: number;
  nbf?: number;
}

const JwtTool = () => {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState<object | null>(null);
  const [payload, setPayload] = useState<JwtPayload | null>(null);
  const [signature, setSignature] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [expirationStatus, setExpirationStatus] = useState<"valid" | "expired" | "not-yet" | null>(null);

  useEffect(() => {
    if (!token.trim()) {
      setHeader(null);
      setPayload(null);
      setSignature("");
      setIsValid(null);
      setExpirationStatus(null);
      return;
    }

    parseJwt(token.trim());
  }, [token]);

  const parseJwt = (jwt: string) => {
    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        setIsValid(false);
        toast.error("无效的JWT格式");
        return;
      }

      const headerPart = JSON.parse(atob(parts[0]));
      const payloadPart = JSON.parse(atob(parts[1]));

      setHeader(headerPart);
      setPayload(payloadPart);
      setSignature(parts[2]);
      setIsValid(true);

      // Check expiration
      if (payloadPart.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (payloadPart.exp < now) {
          setExpirationStatus("expired");
        } else if (payloadPart.nbf && payloadPart.nbf > now) {
          setExpirationStatus("not-yet");
        } else {
          setExpirationStatus("valid");
        }
      } else {
        setExpirationStatus(null);
      }
    } catch (error) {
      setIsValid(false);
      setHeader(null);
      setPayload(null);
      setSignature("");
      setExpirationStatus(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label}已复制`);
  };

  const renderPayloadValue = (key: string, value: unknown) => {
    if ((key === "exp" || key === "iat" || key === "nbf") && typeof value === "number") {
      return (
        <div>
          <span className="font-mono">{value}</span>
          <span className="text-muted-foreground ml-2">({formatDate(value)})</span>
        </div>
      );
    }
    return <span className="font-mono">{JSON.stringify(value)}</span>;
  };

  return (
    <Layout>
      <ToolLayout
        title="JWT解析"
        description="解析和验证JWT令牌，查看Header、Payload和签名"
        icon={Key}
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>输入JWT Token</span>
                {isValid !== null && (
                  <Badge variant={isValid ? "default" : "destructive"}>
                    {isValid ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> 格式有效</>
                    ) : (
                      <><AlertCircle className="h-3 w-3 mr-1" /> 格式无效</>
                    )}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="粘贴JWT Token..."
                className="min-h-[120px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {isValid && header && payload && (
            <>
              {expirationStatus && (
                <Card className={
                  expirationStatus === "expired" ? "border-destructive" :
                  expirationStatus === "not-yet" ? "border-yellow-500" : "border-green-500"
                }>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-2">
                      {expirationStatus === "expired" ? (
                        <>
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          <span className="font-medium text-destructive">Token已过期</span>
                        </>
                      ) : expirationStatus === "not-yet" ? (
                        <>
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium text-yellow-500">Token尚未生效</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium text-green-500">Token有效</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-red-500">Header</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(JSON.stringify(header, null, 2), "Header")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    {JSON.stringify(header, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-purple-500">Payload</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(JSON.stringify(payload, null, 2), "Payload")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(payload).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start border-b pb-2 last:border-0">
                        <span className="font-medium text-muted-foreground">{key}</span>
                        <div className="text-right max-w-[60%] break-all">
                          {renderPayloadValue(key, value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-blue-500">Signature</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(signature, "Signature")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">
                    {signature}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </ToolLayout>
    </Layout>
  );
};

export default JwtTool;
