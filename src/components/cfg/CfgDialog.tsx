import { useMemo } from "react";
import { AlertTriangle, Workflow } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lexer } from "@/lib/tripla/lexer";
import { Parser } from "@/lib/tripla/parser";
import { buildCfg, type CfgGraph } from "@/lib/tripla/cfg";
import { CfgGraph as CfgGraphView } from "./CfgGraph";

interface Built {
  graph: CfgGraph | null;
  error: string | null;
}

const errorMessage = (e: unknown): string => {
  // A deeply nested expression exhausts the recursive AST walk before it can
  // produce a graph — say so instead of leaking "Maximum call stack size".
  if (e instanceof RangeError) return "The program nests too deeply to graph.";
  return e instanceof Error ? e.message : "Could not parse the program.";
};

export const CfgDialog = ({
  open,
  onOpenChange,
  code,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
}) => {
  const { graph, error }: Built = useMemo(() => {
    if (!open) return { graph: null, error: null };
    try {
      const ast = new Parser(new Lexer(code).tokenize()).parse();
      return { graph: buildCfg(ast), error: null };
    } catch (e) {
      return { graph: null, error: errorMessage(e) };
    }
  }, [open, code]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] w-[95vw] max-w-none flex-col gap-3 p-4 sm:p-6">
        <DialogHeader className="flex-row items-center justify-between space-y-0 pr-8">
          <DialogTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Control Flow Graph
          </DialogTitle>
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
      </DialogContent>
    </Dialog>
  );
};
