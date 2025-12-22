import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Download, ImageIcon, ImageDown } from "lucide-react";

const ImageCompressTool = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState([80]);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }

    setFileName(file.name);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setOriginalImage(result);
      compressImage(result, quality[0]);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (imageData: string, qualityValue: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const compressed = canvas.toDataURL("image/jpeg", qualityValue / 100);
      setCompressedImage(compressed);

      // Calculate compressed size
      const base64Length = compressed.split(",")[1]?.length || 0;
      const compressedBytes = (base64Length * 3) / 4;
      setCompressedSize(compressedBytes);
    };
    img.src = imageData;
  };

  const handleQualityChange = (value: number[]) => {
    setQuality(value);
    if (originalImage) {
      compressImage(originalImage, value[0]);
    }
  };

  const downloadImage = () => {
    if (!compressedImage) return;

    const link = document.createElement("a");
    link.download = `compressed_${fileName.replace(/\.[^/.]+$/, "")}.jpg`;
    link.href = compressedImage;
    link.click();
    toast.success("图片已下载");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const compressionRatio = originalSize
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1)
    : 0;

  return (
    <Layout>
      <ToolLayout
        title="图片压缩"
        description="压缩图片文件大小，支持调整质量参数"
        icon={ImageDown}
      >
        <div className="space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">上传图片</CardTitle>
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

          {originalImage && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">压缩质量</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>质量: {quality[0]}%</Label>
                    </div>
                    <Slider
                      value={quality}
                      onValueChange={handleQualityChange}
                      min={10}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-muted-foreground">原始大小</div>
                      <div className="font-medium">{formatSize(originalSize)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-muted-foreground">压缩后</div>
                      <div className="font-medium">{formatSize(compressedSize)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-muted-foreground">压缩率</div>
                      <div className="font-medium text-primary">{compressionRatio}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      原图
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full rounded-lg border"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      压缩后
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {compressedImage && (
                      <img
                        src={compressedImage}
                        alt="Compressed"
                        className="w-full rounded-lg border"
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              <Button onClick={downloadImage} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                下载压缩图片
              </Button>
            </>
          )}
        </div>
      </ToolLayout>
    </Layout>
  );
};

export default ImageCompressTool;
