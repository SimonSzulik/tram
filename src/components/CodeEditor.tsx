import { useState } from "react";
import { FileCode } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
}

export const CodeEditor = ({ value, onChange, title = "Tripla Code" }: CodeEditorProps) => {
  const lines = value.split("\n");

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
      <div className="flex-1 overflow-hidden bg-editor rounded-b-xl">
        <div className="flex h-full">
          {/* Line Numbers */}
          <div className="flex-shrink-0 py-4 pl-4 pr-2 select-none bg-editor-highlight/30">
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

          {/* Code Input */}
          <div className="flex-1 relative overflow-auto custom-scrollbar">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 w-full h-full py-4 px-2 font-mono text-sm text-editor-foreground bg-transparent resize-none focus:outline-none leading-6 caret-execution"
              spellCheck={false}
              placeholder="// Write your Tripla code here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
