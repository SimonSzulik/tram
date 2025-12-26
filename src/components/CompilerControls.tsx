import { Play, StepForward, StepBack, RotateCcw, Zap, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompilerControlsProps {
  onCompile: () => void;
  onStep: () => void;
  onStepBack: () => void;
  onRun: () => void;
  onReset: () => void;
  isCompiled: boolean;
  isRunning: boolean;
  canStep: boolean;
  canStepBack: boolean;
}

export const CompilerControls = ({
  onCompile,
  onStep,
  onStepBack,
  onRun,
  onReset,
  isCompiled,
  isRunning,
  canStep,
  canStepBack,
}: CompilerControlsProps) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-card border-t border-border">
      {/* Primary Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onCompile}
          variant="default"
          size="lg"
          className="gap-2 shadow-md hover:shadow-glow transition-shadow"
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
          disabled={!isCompiled}
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
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isCompiled
                ? isRunning
                  ? "bg-execution animate-pulse"
                  : "bg-stack-push"
                : "bg-muted-foreground"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {!isCompiled
              ? "Ready to compile"
              : isRunning
              ? "Executing..."
              : "Compiled"}
          </span>
        </div>
      </div>
    </div>
  );
};
