import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Lexer } from "@/lib/tripla/lexer";
import { Token, TokenType } from "@/lib/tripla/tokens";
import { cn } from "@/lib/utils";

type Category = "keyword" | "literal" | "operator" | "punct" | "id";

const CATEGORY: Partial<Record<TokenType, Category>> = {
  [TokenType.LET]: "keyword",
  [TokenType.IN]: "keyword",
  [TokenType.WHILE]: "keyword",
  [TokenType.DO]: "keyword",
  [TokenType.IF]: "keyword",
  [TokenType.THEN]: "keyword",
  [TokenType.ELSE]: "keyword",
  [TokenType.TRUE]: "literal",
  [TokenType.FALSE]: "literal",
  [TokenType.CONST]: "literal",
  [TokenType.ID]: "id",
  [TokenType.ADD]: "operator",
  [TokenType.SUB]: "operator",
  [TokenType.MUL]: "operator",
  [TokenType.DIV]: "operator",
  [TokenType.GT]: "operator",
  [TokenType.LT]: "operator",
  [TokenType.GTE]: "operator",
  [TokenType.LTE]: "operator",
  [TokenType.AND]: "operator",
  [TokenType.OR]: "operator",
  [TokenType.EQ]: "operator",
  [TokenType.NEQ]: "operator",
  [TokenType.ASSIGN]: "operator",
  [TokenType.LB]: "punct",
  [TokenType.RB]: "punct",
  [TokenType.LP]: "punct",
  [TokenType.RP]: "punct",
  [TokenType.COMMA]: "punct",
  [TokenType.SEMICOLON]: "punct",
};

const CHIP: Record<Category, string> = {
  keyword: "border-syntax-keyword/40 bg-syntax-keyword/10 text-syntax-keyword",
  literal: "border-syntax-number/40 bg-syntax-number/10 text-syntax-number",
  operator: "border-syntax-operator/40 bg-syntax-operator/10 text-syntax-operator",
  punct: "border-border bg-muted text-muted-foreground",
  id: "border-primary/40 bg-primary/10 text-primary",
};

interface Result {
  tokens: Token[];
  error: string | null;
}

/**
 * Illustrative live lexer: reuses the real TRIPLA Lexer to show the token stream
 * for an editable snippet. Read-only teaching aid — running code happens in /.
 */
export const LiveTokens = ({ initial = "let sq(x) { x * x } in sq(5)" }: { initial?: string }) => {
  const [code, setCode] = useState(initial);

  const { tokens, error }: Result = useMemo(() => {
    try {
      const all = new Lexer(code).tokenize().filter((t) => t.type !== TokenType.EOF);
      return { tokens: all, error: null };
    } catch (e) {
      return { tokens: [], error: e instanceof Error ? e.message : "Lexing failed" };
    }
  }, [code]);

  return (
    <div className="my-6 rounded-xl border border-border bg-card/60 p-4">
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Source
      </label>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        rows={2}
        className="code-font w-full resize-y rounded-md border border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="mb-2 mt-4 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span>Tokens</span>
        {!error && <span className="font-mono normal-case">{tokens.length} tokens</span>}
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {tokens.map((t, i) => {
            const cat = CATEGORY[t.type] ?? "id";
            return (
              <span
                key={i}
                className={cn(
                  "inline-flex items-baseline gap-1 rounded-md border px-2 py-1 font-mono text-xs",
                  CHIP[cat]
                )}
                title={`${t.type} @ line ${t.line}`}
              >
                <span className="font-semibold">{String(t.value)}</span>
                <span className="opacity-60">{t.type}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
