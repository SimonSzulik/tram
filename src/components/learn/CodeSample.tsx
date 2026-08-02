import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { SyntaxHighlighter } from "@/components/SyntaxHighlighter";
import { INSTRUCTION_INFO, mnemonicOf } from "@/lib/tripla/instructionInfo";

type Lang = "tripla" | "tram" | "text";

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs text-editor-line-number transition-colors hover:bg-black/50 hover:text-editor-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-stack-push" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

/**
 * Read-only code block. TRIPLA snippets are syntax-highlighted; TRAM machine code
 * gets its mnemonics tinted. Shows an instant copy-to-clipboard button by default.
 */
export const CodeSample = ({
  code,
  lang = "tripla",
  className,
  title,
  copy = true,
}: {
  code: string;
  lang?: Lang;
  className?: string;
  title?: string;
  copy?: boolean;
}) => (
  <div className={cn("editor-panel relative my-4 overflow-hidden text-sm", className)}>
    {title && (
      <div className="border-b border-white/10 bg-black/20 px-4 py-1.5 pr-20 font-mono text-xs text-editor-line-number">
        {title}
      </div>
    )}
    {copy && <CopyButton code={code} />}
    <pre className="code-font overflow-x-auto p-4 leading-relaxed custom-scrollbar">
      {lang === "tripla" ? (
        <code className="whitespace-pre-wrap">
          <SyntaxHighlighter code={code} />
        </code>
      ) : lang === "tram" ? (
        <code>{renderTram(code)}</code>
      ) : (
        <code className="text-editor-foreground">{code}</code>
      )}
    </pre>
  </div>
);

function renderTram(code: string) {
  return code.split("\n").map((line, i) => {
    const mnem = mnemonicOf(line);
    const known = !!INSTRUCTION_INFO[mnem];
    const [, rest] = known ? [mnem, line.slice(line.indexOf(mnem) + mnem.length)] : ["", line];
    return (
      <div key={i}>
        {known ? (
          <>
            <span className="font-semibold text-syntax-keyword">{mnem}</span>
            <span className="text-syntax-number">{rest}</span>
          </>
        ) : (
          <span className="text-editor-foreground">{line || " "}</span>
        )}
      </div>
    );
  });
}
