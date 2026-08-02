import { Layers, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { REGISTER_INFO } from "@/lib/tripla/instructionInfo";

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
  result?: number | null;
}

const Register = ({
  name,
  value,
  className,
}: {
  name: keyof typeof REGISTER_INFO;
  value: string | number;
  className?: string;
}) => {
  const info = REGISTER_INFO[name];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex cursor-help flex-col items-center">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground decoration-dotted underline-offset-2 hover:underline">
            {name}
          </span>
          <span className={cn("font-mono text-sm font-bold", className)}>{value}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-xs font-semibold text-primary">
          {info.name} — {info.full}
        </p>
        <p className="mt-1 text-xs">{info.summary}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const StackVisualization = ({
  machineState,
  title = "Runtime Stack",
  result = null,
}: StackVisualizationProps) => {
  const { PP, FP, TOP, stack, halted } = machineState;

  // Get markers for each stack index
  const getMarkers = (idx: number): string[] => {
    const markers: string[] = [];
    if (idx === PP) markers.push("PP");
    if (idx === FP) markers.push("FP");
    if (idx === TOP) markers.push("TOP");
    return markers;
  };

  return (
    <div className="panel-card flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Layers className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm text-foreground">{title}</span>
        {halted && result !== null && (
          <span className="ml-auto flex items-center gap-1.5 rounded-md border border-stack-push/40 bg-stack-push/10 px-2 py-0.5">
            <Check className="h-3.5 w-3.5 text-stack-push" />
            <span className="text-xs font-medium text-foreground">
              Result <span className="font-mono font-bold tabular-nums">{result}</span>
            </span>
          </span>
        )}
      </div>

      {/* Register Display */}
      <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-border/50 bg-muted/20">
        <Register
          name="PC"
          value={machineState.halted ? "—" : machineState.PC}
          className={machineState.halted ? "text-destructive" : "text-primary"}
        />
        <Register name="PP" value={PP} className="text-foreground" />
        <Register name="FP" value={FP} className="text-foreground" />
        <Register name="TOP" value={TOP} className="text-foreground" />
      </div>

      {/* Stack Visualization */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
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
