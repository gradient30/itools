import { useRef, useMemo, useCallback, forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface LineNumberEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
  highlightLines?: number[];
  errorLine?: number;
  className?: string;
  status?: "default" | "error" | "warning" | "success";
}

export const LineNumberEditor = forwardRef<HTMLTextAreaElement, LineNumberEditorProps>(
  ({
    value,
    onChange,
    placeholder,
    readOnly = false,
    minHeight = 400,
    highlightLines = [],
    errorLine,
    className,
    status = "default"
  }, ref) => {
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLTextAreaElement>(null);

    // 合并ref
    const setRef = useCallback((node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    const lineNumbers = useMemo(() => {
      const lines = value.split("\n");
      return Array.from({ length: Math.max(lines.length, 1) }, (_, i) => i + 1);
    }, [value]);

    const handleScroll = useCallback(() => {
      if (innerRef.current && lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = innerRef.current.scrollTop;
      }
    }, []);

    const getStatusStyles = () => {
      switch (status) {
        case "error":
          return {
            border: "border-red-500",
            lineBg: "bg-red-500/10",
            lineBorder: "border-red-500/30",
            textBg: "bg-red-500/5"
          };
        case "warning":
          return {
            border: "border-amber-500",
            lineBg: "bg-amber-500/10",
            lineBorder: "border-amber-500/30",
            textBg: "bg-amber-500/5"
          };
        case "success":
          return {
            border: "border-green-500",
            lineBg: "bg-green-500/10",
            lineBorder: "border-green-500/30",
            textBg: "bg-green-500/5"
          };
        default:
          return {
            border: "border-input",
            lineBg: "bg-muted/30",
            lineBorder: "border-input",
            textBg: "bg-background"
          };
      }
    };

    const styles = getStatusStyles();

    return (
      <div
        className={cn(
          "relative flex rounded-md border bg-background overflow-hidden transition-colors",
          styles.border,
          className
        )}
      >
        {/* 行号区域 */}
        <div
          ref={lineNumbersRef}
          className={cn(
            "flex-none w-12 py-3 pr-2 text-right font-mono text-xs select-none overflow-hidden border-r",
            styles.lineBg,
            styles.lineBorder
          )}
          style={{ height: minHeight }}
        >
          <div className="flex flex-col">
            {lineNumbers.map((num) => (
              <span
                key={num}
                className={cn(
                  "leading-5 transition-colors",
                  errorLine === num || highlightLines.includes(num)
                    ? "text-red-500 font-bold bg-red-500/20 -mr-2 pr-2 rounded-l"
                    : "text-muted-foreground"
                )}
              >
                {num}
              </span>
            ))}
          </div>
        </div>

        {/* 文本输入区域 */}
        <Textarea
          ref={setRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            "flex-1 min-h-[400px] py-3 px-3 font-mono text-sm resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            styles.textBg
          )}
          style={{ lineHeight: "1.25rem", minHeight }}
        />
      </div>
    );
  }
);

LineNumberEditor.displayName = "LineNumberEditor";
