import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkedStep {
  label: string;
  content: React.ReactNode;
}

/**
 * A scaffolded input → transformation(s) → output box. Each step is numbered so
 * learners can follow a derivation one move at a time.
 */
export const WorkedExample = ({
  title,
  steps,
  className,
}: {
  title?: string;
  steps: WorkedStep[];
  className?: string;
}) => (
  <div className={cn("my-6 rounded-xl border border-border bg-card/60 p-5", className)}>
    {title && (
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <ArrowRight className="h-4 w-4 text-primary" />
        {title}
      </div>
    )}
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{step.label}</p>
            <div className="mt-1 text-sm text-muted-foreground">{step.content}</div>
          </div>
        </li>
      ))}
    </ol>
  </div>
);
