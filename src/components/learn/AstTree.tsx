import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Lexer } from "@/lib/tripla/lexer";
import { Parser } from "@/lib/tripla/parser";
import type { ASTNode } from "@/lib/tripla/ast";
import { cn } from "@/lib/utils";

// Give each node a short display label and its labelled children.
function describe(node: ASTNode): { title: string; badge?: string; children: { edge?: string; node: ASTNode }[] } {
  switch (node.type) {
    case "LET":
      return {
        title: "let … in",
        children: [
          ...node.decls.map((d) => ({ edge: "decl", node: d as ASTNode })),
          { edge: "body", node: node.body },
        ],
      };
    case "DECL":
      return {
        title: `${node.name}(${node.params.map((p) => p.name).join(", ")})`,
        badge: "DECL",
        children: [{ edge: "body", node: node.body }],
      };
    case "CALL":
      return {
        title: `${node.name}(…)`,
        badge: "CALL",
        children: node.args.map((a, i) => ({ edge: `arg ${i + 1}`, node: a })),
      };
    case "BINOP":
      return {
        title: node.op,
        badge: "BINOP",
        children: [
          { edge: "lhs", node: node.lhs },
          { edge: "rhs", node: node.rhs },
        ],
      };
    case "IF":
      return {
        title: "if",
        badge: "IF",
        children: [
          { edge: "cond", node: node.cond },
          { edge: "then", node: node.thenBranch },
          { edge: "else", node: node.elseBranch },
        ],
      };
    case "WHILE":
      return {
        title: "while",
        badge: "WHILE",
        children: [
          { edge: "cond", node: node.cond },
          { edge: "body", node: node.body },
        ],
      };
    case "ASSIGN":
      return {
        title: `${node.var.name} =`,
        badge: "ASSIGN",
        children: [{ edge: "value", node: node.expr }],
      };
    case "SEQ":
      return {
        title: "; (sequence)",
        badge: "SEQ",
        children: [
          { edge: "first", node: node.first },
          { edge: "then", node: node.second },
        ],
      };
    case "VAR":
      return { title: node.name, badge: "VAR", children: [] };
    case "CONST":
      return { title: String(node.value), badge: "CONST", children: [] };
    case "BOOL":
      return { title: String(node.value), badge: "BOOL", children: [] };
  }
}

const NodeView = ({ node, edge }: { node: ASTNode; edge?: string }) => {
  const { title, badge, children } = describe(node);
  return (
    <div className="relative">
      <div className="flex items-center gap-2 py-1">
        {edge && (
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {edge}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2 py-1 font-mono text-xs">
          {badge && <span className="font-bold text-primary">{badge}</span>}
          <span className="text-foreground">{title}</span>
        </span>
      </div>
      {children.length > 0 && (
        <div className="ml-3 border-l border-dashed border-border pl-4">
          {children.map((c, i) => (
            <NodeView key={i} node={c.node} edge={c.edge} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Illustrative AST viewer built on the real TRIPLA Parser. Editable snippet in,
 * abstract syntax tree out.
 */
export const AstTree = ({
  initial = "let sq(x) { x * x } in sq(5)",
  editable = true,
}: {
  initial?: string;
  editable?: boolean;
}) => {
  const [code, setCode] = useState(initial);

  const { ast, error } = useMemo(() => {
    try {
      const tokens = new Lexer(code).tokenize();
      return { ast: new Parser(tokens).parse(), error: null as string | null };
    } catch (e) {
      return { ast: null, error: e instanceof Error ? e.message : "Parse failed" };
    }
  }, [code]);

  return (
    <div className="my-6 rounded-xl border border-border bg-card/60 p-4">
      {editable && (
        <>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Source
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={2}
            className="code-font mb-4 w-full resize-y rounded-md border border-border bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </>
      )}

      {error ? (
        <div className={cn("flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive")}>
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : (
        ast && (
          <div className="overflow-x-auto custom-scrollbar">
            <NodeView node={ast} />
          </div>
        )
      )}
    </div>
  );
};
