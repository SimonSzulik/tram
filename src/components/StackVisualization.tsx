import { Layers, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StackItem {
  value: string | number;
  isNew?: boolean;
  isRemoving?: boolean;
}

interface StackVisualizationProps {
  stack: StackItem[];
  title?: string;
}

export const StackVisualization = ({
  stack,
  title = "Runtime Stack",
}: StackVisualizationProps) => {
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

      {/* Stack Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-1.5 text-xs">
          <ArrowUp className="h-3 w-3 text-stack-push" />
          <span className="text-muted-foreground">Push</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <ArrowDown className="h-3 w-3 text-stack-pop" />
          <span className="text-muted-foreground">Pop</span>
        </div>
      </div>

      {/* Stack Visualization */}
      <div className="flex-1 overflow-auto custom-scrollbar p-4 flex flex-col-reverse">
        {stack.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Layers className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Stack is empty</p>
            <p className="text-xs mt-1">Execute instructions to see stack operations</p>
          </div>
        ) : (
          <div className="space-y-2">
            {stack.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "stack-item flex items-center justify-between font-mono text-sm",
                  item.isNew && "animate-stack-push border-l-4 border-stack-push",
                  item.isRemoving && "animate-stack-pop border-l-4 border-stack-pop"
                )}
              >
                <span className="text-xs text-muted-foreground">
                  [{stack.length - 1 - idx}]
                </span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
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
