import { Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="panel-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <Cpu className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm text-foreground">{title}</span>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {instructions.length} instructions
        </span>
      </div>

      {/* Instructions List */}
      <div className="flex-1 overflow-auto custom-scrollbar p-2">
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
                <span
                  className={cn(
                    "flex-1",
                    currentLine === idx ? "text-foreground font-semibold" : "text-foreground/80"
                  )}
                >
                  {instruction.code}
                </span>

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
