import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload, Copy, Download, ImageIcon, Image as ImageLucide } from "lucide-react";

const Base64ImageTool = () => {
  const [base64, setBase64] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBase64(result);
      setImagePreview(result);
      toast.success("图片已转换为Base64");
    };
    reader.readAsDataURL(file);
  };

  const handleBase64ToImage = () => {
    if (!base64.trim()) {
      toast.error("请输入Base64字符串");
      return;
    }

    try {
      let imageData = base64.trim();
      
      // Add data URL prefix if not present
      if (!imageData.startsWith("data:image")) {
        imageData = `data:image/png;base64,${imageData}`;
      }

      // Validate by creating an image
      const img = new Image();
      img.onload = () => {
        setImagePreview(imageData);
        toast.success("Base64已转换为图片");
      };
      img.onerror = () => {
        toast.error("无效的Base64图片数据");
      };
      img.src = imageData;
    } catch (error) {
      toast.error("转换失败，请检查Base64格式");
    }
  };

  const copyToClipboard = () => {
    if (!base64) {
      toast.error("没有可复制的内容");
      return;
    }
    navigator.clipboard.writeText(base64);
    toast.success("已复制到剪贴板");
  };

  const downloadImage = () => {
    if (!imagePreview) {
      toast.error("没有可下载的图片");
      return;
    }

    const link = document.createElement("a");
    link.download = fileName || "image.png";
    link.href = imagePreview;
    link.click();
    toast.success("图片已下载");
  };

  const clearAll = () => {
    setBase64("");
    setImagePreview(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <ToolLayout
        title="Base64图片转换"
        description="图片与Base64编码互相转换"
        icon={ImageLucide}
      >
        <Tabs defaultValue="imageToBase64" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="imageToBase64">图片转Base64</TabsTrigger>
            <TabsTrigger value="base64ToImage">Base64转图片</TabsTrigger>
          </TabsList>

          <TabsContent value="imageToBase64" className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageToBase64}
              accept="image/*"
              className="hidden"
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">选择图片</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-24 border-dashed"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6" />
                    <span>点击选择图片</span>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {imagePreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    预览
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg border"
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Base64结果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={base64}
                  readOnly
                  placeholder="Base64编码将显示在这里..."
                  className="min-h-[200px] font-mono text-xs"
                />
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    复制
                  </Button>
                  <Button onClick={clearAll} variant="outline" className="flex-1">
                    清空
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="base64ToImage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">输入Base64</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={base64}
                  onChange={(e) => setBase64(e.target.value)}
                  placeholder="粘贴Base64编码..."
                  className="min-h-[200px] font-mono text-xs"
                />
                <div className="flex gap-2">
                  <Button onClick={handleBase64ToImage} className="flex-1">
                    转换为图片
                  </Button>
                  <Button onClick={clearAll} variant="outline" className="flex-1">
                    清空
                  </Button>
                </div>
              </CardContent>
            </Card>

            {imagePreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    图片预览
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg border"
                  />
                  <Button onClick={downloadImage} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    下载图片
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </ToolLayout>
    </Layout>
  );
};

export default Base64ImageTool;
