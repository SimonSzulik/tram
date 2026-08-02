import { useRef, useCallback } from "react";
import { FileCode, Workflow } from "lucide-react";
import { SyntaxHighlighter } from "./SyntaxHighlighter";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  onViewCfg?: () => void;
}

export const CodeEditor = ({ value, onChange, title = "Tripla Code", onViewCfg }: CodeEditorProps) => {
  const lines = value.split("\n");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    <div className="panel-card flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <FileCode className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm text-foreground">{title}</span>
        <div className="ml-auto flex items-center gap-3">
          {onViewCfg && (
            <button
              type="button"
              onClick={onViewCfg}
              title="Visualize the control-flow graph of this program"
              className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <Workflow className="h-3.5 w-3.5" />
              View CFG
            </button>
          )}
          <span className="text-xs text-muted-foreground font-mono">{lines.length} lines</span>
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={containerRef}
        onScroll={handleContainerScroll}
        className="flex-1 overflow-y-auto custom-scrollbar bg-editor rounded-b-xl"
      >
        <div className="flex min-h-full">
          {/* Line Numbers */}
          <div className="flex-shrink-0 py-4 pl-4 pr-2 select-none bg-editor-highlight/30">
            {lines.map((_, idx) => (
              <div
                key={idx}
                className="font-mono text-sm text-editor-line leading-6 text-right pr-2"
                style={{ minWidth: "2.5rem" }}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Code Area with syntax highlighting overlay */}
          <div className="flex-1 relative min-h-full">
            {/* Syntax highlighted layer (drives layout height) */}
            <div
              className="py-4 px-2 font-mono text-sm leading-6 whitespace-pre-wrap break-words pointer-events-none"
              aria-hidden="true"
            >
              <SyntaxHighlighter code={value} />
            </div>

            {/* Actual textarea (transparent text, captures input) */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onScroll={handleTextareaScroll}
              className="absolute inset-0 w-full h-full py-4 px-2 font-mono text-sm leading-6 whitespace-pre-wrap break-words text-transparent bg-transparent resize-none focus:outline-none caret-execution overflow-hidden"
              spellCheck={false}
              placeholder=""
              style={{ caretColor: "hsl(var(--execution-current))" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
