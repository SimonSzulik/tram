import { cn } from "@/lib/utils";
import { SyntaxHighlighter } from "@/components/SyntaxHighlighter";
import { INSTRUCTION_INFO, mnemonicOf } from "@/lib/tripla/instructionInfo";

type Lang = "tripla" | "tram" | "text";

/**
 * Read-only code block used throughout the learning pages. TRIPLA snippets are
 * syntax-highlighted with the same highlighter as the editor; TRAM machine code
 * gets its mnemonics tinted.
 */
export const CodeSample = ({
  code,
  lang = "tripla",
  className,
  title,
}: {
  code: string;
  lang?: Lang;
  className?: string;
  title?: string;
}) => (
  <div
    className={cn(
      "editor-panel my-4 overflow-hidden text-sm",
      className
    )}
  >
    {title && (
      <div className="border-b border-white/10 bg-black/20 px-4 py-1.5 font-mono text-xs text-editor-line-number">
        {title}
      </div>
    )}
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
          <span className="text-editor-foreground">{line || " "}</span>
        )}
      </div>
    );
  });
}
