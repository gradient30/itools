import * as React from "react";
import { Upload, File, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Progress } from "./progress";

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  accept?: string;
  maxSize?: number;
  isProcessing?: boolean;
  progress?: number;
  progressText?: string;
  disabled?: boolean;
  className?: string;
}

export function FileDropzone({
  file,
  onFileSelect,
  onFileClear,
  accept,
  maxSize = 100 * 1024 * 1024,
  isProcessing = false,
  progress = 0,
  progressText,
  disabled = false,
  className,
}: FileDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatMaxSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(0) + "MB";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isProcessing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && !isProcessing) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onFileSelect(droppedFile);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isProcessing}
      />

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/30",
            (disabled || isProcessing) && "opacity-50 cursor-not-allowed"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
              isDragging ? "bg-primary/10" : "bg-muted/50"
            )}
          >
            <Upload
              className={cn(
                "h-5 w-5 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              点击或拖拽文件到此处
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              最大 {formatMaxSize(maxSize)}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center gap-4 p-4 rounded-xl border transition-colors",
            "bg-card/60 border-border/50 hover:border-border"
          )}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <File className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onFileClear();
            }}
            disabled={isProcessing}
            className="shrink-0 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isProcessing && (
        <div className="space-y-2 px-1">
          <Progress value={progress} className="h-1.5" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>{progressText || `处理中... ${Math.round(progress)}%`}</span>
          </div>
        </div>
      )}
    </div>
  );
}
