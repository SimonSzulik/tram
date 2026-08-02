import { useMemo, useState } from "react";
import { AlertTriangle, Workflow } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Lexer } from "@/lib/tripla/lexer";
import { Parser } from "@/lib/tripla/parser";
import { buildCfg, toCompact, type CfgGraph } from "@/lib/tripla/cfg";
import { CfgGraph as CfgGraphView } from "./CfgGraph";

type Mode = "compact" | "faithful";

interface Built {
  graph: CfgGraph | null;
  error: string | null;
}

export const CfgDialog = ({
  open,
  onOpenChange,
  code,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
}) => {
  const [mode, setMode] = useState<Mode>("compact");

  const { graph, error }: Built = useMemo(() => {
    if (!open) return { graph: null, error: null };
    try {
      const ast = new Parser(new Lexer(code).tokenize()).parse();
      const faithful = buildCfg(ast);
      return { graph: mode === "compact" ? toCompact(faithful) : faithful, error: null };
    } catch (e) {
      return { graph: null, error: e instanceof Error ? e.message : "Could not parse the program." };
    }
  }, [open, code, mode]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] w-[95vw] max-w-none flex-col gap-3 p-4 sm:p-6">
        <DialogHeader className="flex-row items-center justify-between space-y-0 pr-8">
          <DialogTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Control Flow Graph
          </DialogTitle>

          {/* Compact ⇄ Faithful toggle */}
          <div className="flex rounded-lg border border-border p-0.5">
            {(["compact", "faithful"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1">
          {error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
              <div>
                <p className="font-semibold text-foreground">Can't build the graph</p>
                <p className="mt-1 max-w-md font-mono text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : graph && graph.nodes.length > 0 ? (
            <CfgGraphView graph={graph} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Nothing to show.
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {mode === "compact"
            ? "Compact view — expression chains collapsed to statements, conditions folded into decisions."
            : "Faithful view — every sub-expression is its own node, exactly as the CFG is built."}{" "}
          Diamonds branch <span className="font-semibold text-stack-push">T</span>rue /{" "}
          <span className="font-semibold text-destructive">F</span>alse; dashed edges are loop back-edges.
        </p>
      </DialogContent>
    </Dialog>
  );
};
