import { Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { INSTRUCTION_INFO, mnemonicOf, describeConcrete } from "@/lib/tripla/instructionInfo";

interface Instruction {
  address: number;
  code: string;
  label?: string;
}

interface MachineCodeViewProps {
  instructions: Instruction[];
  currentLine: number;
  title?: string;
}

export const MachineCodeView = ({
  instructions,
  currentLine,
  title = "Tram Machine Code",
}: MachineCodeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll to current instruction and center it
  useEffect(() => {
    if (currentLine >= 0 && currentLine < instructions.length && containerRef.current) {
      const currentItem = itemRefs.current[currentLine];
      if (currentItem) {
        const container = containerRef.current;
        const containerHeight = container.clientHeight;
        const itemTop = currentItem.offsetTop;
        const itemHeight = currentItem.clientHeight;
        
        // Calculate scroll position to center the current item
        const scrollTarget = itemTop - (containerHeight / 2) + (itemHeight / 2);
        
        container.scrollTo({
          top: Math.max(0, scrollTarget),
          behavior: 'smooth'
        });
      }
    }
  }, [currentLine, instructions.length]);

  return (
    <div className="panel-card flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Cpu className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm text-foreground">{title}</span>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {instructions.length} instructions
        </span>
      </div>

      {/* Instructions List */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-2"
      >
        {instructions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Cpu className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">No machine code yet</p>
            <p className="text-xs mt-1">Compile your Tripla code to see Tram instructions</p>
          </div>
        ) : (
          <div className="space-y-1">
            {instructions.map((instruction, idx) => (
              <div
                key={idx}
                ref={(el) => { itemRefs.current[idx] = el; }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-sm transition-all duration-300",
                  currentLine === idx
                    ? "bg-execution-bg border-l-4 border-execution animate-pulse-glow"
                    : "hover:bg-muted/50"
                )}
              >
                {/* Address */}
                <span className="w-8 text-right text-xs text-muted-foreground">
                  {String(instruction.address).padStart(3, "0")}
                </span>

                {/* Label */}
                {instruction.label && (
                  <span className="text-xs text-primary font-semibold min-w-[60px]">
                    {instruction.label}:
                  </span>
                )}

                {/* Instruction */}
                {(() => {
                  const info = INSTRUCTION_INFO[mnemonicOf(instruction.code)];
                  const codeSpan = (
                    <span
                      className={cn(
                        "flex-1 cursor-help decoration-dotted underline-offset-4 hover:underline",
                        currentLine === idx ? "text-foreground font-semibold" : "text-foreground/80"
                      )}
                    >
                      {instruction.code}
                    </span>
                  );
                  if (!info) return codeSpan;
                  const concrete = describeConcrete(instruction.code);
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>{codeSpan}</TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        {/* Actual instruction line */}
                        <p className="font-mono text-xs font-semibold text-primary">
                          {instruction.code}
                          <span className="ml-1 text-muted-foreground">
                            ({info.args ? `${info.name} ${info.args}` : info.name})
                          </span>
                        </p>
                        {/* Value-specific description for this line */}
                        {concrete && <p className="mt-1 text-xs font-medium">{concrete}</p>}
                        {/* Generic definition */}
                        <p className={cn("text-xs", concrete ? "mt-1 text-muted-foreground" : "mt-1")}>
                          {concrete ? <span className="italic">General: </span> : null}
                          {info.summary}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })()}

                {/* Current indicator */}
                {currentLine === idx && (
                  <span className="text-xs font-medium text-execution">▶ executing</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
