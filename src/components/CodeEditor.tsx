import { useRef, useCallback } from "react";
import { FileCode } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
}

export const CodeEditor = ({ value, onChange, title = "Tripla Code" }: CodeEditorProps) => {
  const lines = value.split("\n");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync textarea scroll with the container
  const handleTextareaScroll = useCallback(() => {
    if (textareaRef.current && containerRef.current) {
      containerRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Sync container scroll with textarea
  const handleContainerScroll = useCallback(() => {
    if (textareaRef.current && containerRef.current) {
      textareaRef.current.scrollTop = containerRef.current.scrollTop;
    }
  }, []);

  return (
    <div className="panel-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <FileCode className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm text-foreground">{title}</span>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {lines.length} lines
        </span>
      </div>

      {/* Editor Area */}
      <div 
        ref={containerRef}
        onScroll={handleContainerScroll}
        className="flex-1 min-h-0 max-h-[520px] overflow-y-auto custom-scrollbar bg-editor rounded-b-xl"
      >
        <div className="flex min-h-full">
          {/* Line Numbers */}
          <div className="flex-shrink-0 py-4 pl-4 pr-2 select-none bg-editor-highlight/30 sticky left-0">
            {lines.map((_, idx) => (
              <div
                key={idx}
                className="font-mono text-xs text-editor-line leading-6 text-right pr-2"
                style={{ minWidth: "2.5rem" }}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Code Mirror (for sizing) + Textarea overlay */}
          <div className="flex-1 relative">
            {/* Invisible mirror to set correct height */}
            <div 
              ref={mirrorRef}
              className="py-4 px-2 font-mono text-sm leading-6 whitespace-pre-wrap break-all invisible"
              aria-hidden="true"
            >
              {value || " "}
            </div>
            
            {/* Actual textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onScroll={handleTextareaScroll}
              className="absolute inset-0 w-full h-full py-4 px-2 font-mono text-sm text-editor-foreground bg-transparent resize-none focus:outline-none leading-6 caret-execution overflow-hidden"
              spellCheck={false}
              placeholder="// Write your Tripla code here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
