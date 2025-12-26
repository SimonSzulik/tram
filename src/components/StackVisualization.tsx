import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface MachineState {
  PC: number;
  PP: number;
  FP: number;
  TOP: number;
  stack: (number | null)[];
  halted: boolean;
}

interface StackVisualizationProps {
  machineState: MachineState;
  title?: string;
}

export const StackVisualization = ({
  machineState,
  title = "Runtime Stack",
}: StackVisualizationProps) => {
  const { PC, PP, FP, TOP, stack, halted } = machineState;

  // Get markers for each stack index
  const getMarkers = (idx: number): string[] => {
    const markers: string[] = [];
    if (idx === PP) markers.push("PP");
    if (idx === FP) markers.push("FP");
    if (idx === TOP) markers.push("TOP");
    return markers;
  };

  return (
    <div className="panel-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Layers className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm text-foreground">{title}</span>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {stack.length} items
        </span>
      </div>

      {/* Register Display */}
      <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-border/50 bg-muted/20">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">PC</span>
          <span className={cn(
            "font-mono text-sm font-bold",
            halted ? "text-destructive" : "text-primary"
          )}>
            {halted ? "—" : PC}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">PP</span>
          <span className="font-mono text-sm font-bold text-foreground">{PP}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">FP</span>
          <span className="font-mono text-sm font-bold text-foreground">{FP}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">TOP</span>
          <span className="font-mono text-sm font-bold text-foreground">{TOP}</span>
        </div>
      </div>

      {/* Stack Visualization */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4">
        {stack.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Layers className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Stack is empty</p>
            <p className="text-xs mt-1">Execute instructions to see stack operations</p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Render stack from TOP to bottom */}
            {[...stack].reverse().map((value, reversedIdx) => {
              const idx = stack.length - 1 - reversedIdx;
              const markers = getMarkers(idx);
              const isTop = idx === TOP;
              const isFP = idx === FP;
              const isPP = idx === PP;
              const hasMarker = isTop || isFP || isPP;

              return (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md font-mono text-sm transition-all border",
                    // Default: light background for unmarked items
                    !hasMarker && "bg-muted/40 border-border/30",
                    // Highlighted states for marked items
                    isTop && "border-l-4 border-l-primary bg-primary/10 border-primary/30",
                    isFP && !isTop && "border-l-4 border-l-amber-500 bg-amber-500/10 border-amber-500/30",
                    isPP && !isTop && !isFP && "border-l-4 border-l-cyan-500 bg-cyan-500/10 border-cyan-500/30"
                  )}
                >
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    [{idx}]
                  </span>
                  <span className="flex-1 font-semibold text-foreground tabular-nums">
                    {value !== null && value !== undefined ? value : 0}
                  </span>
                  {markers.length > 0 && (
                    <div className="flex gap-1">
                      {markers.map((marker) => (
                        <span
                          key={marker}
                          className={cn(
                            "px-1.5 py-0.5 text-[10px] font-bold rounded",
                            marker === "TOP" && "bg-primary/20 text-primary",
                            marker === "FP" && "bg-amber-500/20 text-amber-600 dark:text-amber-400",
                            marker === "PP" && "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400"
                          )}
                        >
                          {marker}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stack Base Indicator */}
        <div className="mt-4 pt-3 border-t-2 border-dashed border-border">
          <div className="text-center text-xs text-muted-foreground font-medium">
            ── STACK BASE ──
          </div>
        </div>
      </div>
    </div>
  );
};
