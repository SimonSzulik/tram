import { Play, StepForward, StepBack, RotateCcw, Zap, Pause, FastForward, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompilerControlsProps {
  onCompile: () => void;
  onStep: () => void;
  onStepBack: () => void;
  onRun: () => void;
  onRunToEnd: () => void;
  onReset: () => void;
  isCompiled: boolean;
  isRunning: boolean;
  isHalted: boolean;
  canStep: boolean;
  canStepBack: boolean;
  result: number | null;
  warning: string | null;
}

export const CompilerControls = ({
  onCompile,
  onStep,
  onStepBack,
  onRun,
  onRunToEnd,
  onReset,
  isCompiled,
  isRunning,
  isHalted,
  canStep,
  canStepBack,
  result,
  warning,
}: CompilerControlsProps) => {
  const finished = isCompiled && isHalted;

  return (
    <div className="flex items-center gap-2 p-4 bg-card border-t border-border">
      {/* Primary Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onCompile}
          variant="default"
          size="lg"
          className="gap-2"
        >
          <Zap className="h-4 w-4" />
          Compile
        </Button>

        <Button
          onClick={onStepBack}
          variant="outline"
          size="lg"
          disabled={!isCompiled || !canStepBack}
          className="gap-2"
        >
          <StepBack className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={onStep}
          variant="outline"
          size="lg"
          disabled={!isCompiled || !canStep}
          className="gap-2"
        >
          <StepForward className="h-4 w-4" />
          Step
        </Button>

        <Button
          onClick={onRun}
          variant="outline"
          size="lg"
          disabled={!isCompiled || isHalted}
          className="gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run All
            </>
          )}
        </Button>

        <Button
          onClick={onRunToEnd}
          variant="outline"
          size="lg"
          disabled={!isCompiled || isHalted}
          className="gap-2"
          title="Skip the animation and jump straight to the final state"
        >
          <FastForward className="h-4 w-4" />
          Run to End
        </Button>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-border mx-2" />

      {/* Reset */}
      <Button
        onClick={onReset}
        variant="ghost"
        size="lg"
        className="gap-2 text-muted-foreground hover:text-destructive"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>

      {/* Status */}
      <div className="ml-auto flex items-center gap-3">
        {warning && (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{warning}</span>
          </div>
        )}

        {finished && result !== null ? (
          <div className="flex items-center gap-2 rounded-md border border-stack-push/40 bg-stack-push/10 px-3 py-1.5">
            <Check className="h-4 w-4 text-stack-push" />
            <span className="text-sm font-medium text-foreground">
              Result: <span className="font-mono font-bold tabular-nums">{result}</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                !isCompiled
                  ? "bg-muted-foreground"
                  : isRunning
                  ? "bg-execution animate-pulse"
                  : finished
                  ? "bg-stack-push"
                  : "bg-primary"
              )}
            />
            <span className="text-sm text-muted-foreground">
              {!isCompiled
                ? "Ready to compile"
                : isRunning
                ? "Executing…"
                : finished
                ? "Finished"
                : "Compiled"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
