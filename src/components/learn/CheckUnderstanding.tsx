import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight self-check: a question with a reveal-on-click answer. Encourages
 * retrieval practice without the overhead of a graded quiz.
 */
export const CheckUnderstanding = ({
  question,
  answer,
  className,
}: {
  question: React.ReactNode;
  answer: React.ReactNode;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("my-6 rounded-xl border border-primary/20 bg-primary/5 p-5", className)}>
      <div className="flex gap-3">
        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Check your understanding</p>
          <div className="mt-1 text-sm text-foreground/90">{question}</div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
            {open ? "Hide answer" : "Show answer"}
          </button>
          {open && (
            <div className="mt-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground animate-fade-in">
              {answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
