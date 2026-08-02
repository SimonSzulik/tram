import { useRef, useCallback } from "react";
import { FileCode, Workflow, Upload } from "lucide-react";
import { SyntaxHighlighter } from "./SyntaxHighlighter";
import { EXAMPLES } from "@/content/tripla/examples";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  onViewCfg?: () => void;
  /** Called when an example or uploaded file replaces the editor contents. */
  onLoadCode?: (code: string) => void;
}

export const CodeEditor = ({
  value,
  onChange,
  title = "Tripla Code",
  onViewCfg,
  onLoadCode,
}: CodeEditorProps) => {
  const lines = value.split("\n");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextareaScroll = useCallback(() => {
    if (textareaRef.current && containerRef.current) {
      containerRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleContainerScroll = useCallback(() => {
    if (textareaRef.current && containerRef.current) {
      textareaRef.current.scrollTop = containerRef.current.scrollTop;
    }
  }, []);

  const loadCode = (next: string) => {
    if (onLoadCode) onLoadCode(next);
    else onChange(next);
  };

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    const example = EXAMPLES.find((ex) => ex.id === id);
    if (example) loadCode(example.code);
    e.target.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Refuse oversized uploads — editor is for small teaching programs.
    if (file.size > 64 * 1024) {
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") loadCode(reader.result.slice(0, 64_000));
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="panel-card flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <FileCode className="h-4 w-4 shrink-0 text-primary" />
        <span className="shrink-0 font-medium text-sm text-foreground">{title}</span>
        <select
          aria-label="Load example"
          defaultValue=""
          onChange={handleExampleChange}
          className="h-7 min-w-0 max-w-[9.5rem] rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="" disabled>
            Examples…
          </option>
          {EXAMPLES.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.title}
            </option>
          ))}
        </select>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,text/plain"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload a .txt file into the editor"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload
        </button>

        {onViewCfg && (
          <button
            type="button"
            onClick={onViewCfg}
            title="Visualize the control-flow graph of this program"
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Workflow className="h-3.5 w-3.5" />
            View CFG
          </button>
        )}
      </div>

      {/* Editor Area */}
      <div
        ref={containerRef}
        onScroll={handleContainerScroll}
        className="flex-1 overflow-y-auto custom-scrollbar bg-editor rounded-b-xl"
      >
        <div className="flex min-h-full">
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

          <div className="flex-1 relative min-h-full">
            <div
              className="py-4 px-2 font-mono text-sm leading-6 whitespace-pre-wrap break-words pointer-events-none"
              aria-hidden="true"
            >
              <SyntaxHighlighter code={value} />
            </div>

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
