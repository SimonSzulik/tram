import { Info, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "tip" | "warning";

const VARIANTS: Record<
  CalloutVariant,
  { icon: typeof Info; label: string; wrap: string; iconColor: string }
> = {
  info: {
    icon: Info,
    label: "Note",
    wrap: "border-primary/30 bg-primary/5",
    iconColor: "text-primary",
  },
  tip: {
    icon: Lightbulb,
    label: "Tip",
    wrap: "border-stack-push/30 bg-stack-push/5",
    iconColor: "text-stack-push",
  },
  warning: {
    icon: AlertTriangle,
    label: "Watch out",
    wrap: "border-amber-500/30 bg-amber-500/5",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
};

/**
 * Boxed aside for progressive disclosure — keeps secondary detail out of the
 * main reading flow while staying glanceable.
 */
export const Callout = ({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const v = VARIANTS[variant];
  const Icon = v.icon;
  return (
    <div className={cn("my-4 flex gap-3 rounded-lg border p-4", v.wrap, className)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", v.iconColor)} />
      <div className="min-w-0 text-sm text-foreground/90">
        <p className={cn("mb-1 font-semibold", v.iconColor)}>{title ?? v.label}</p>
        <div className="space-y-2 leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs">
          {children}
        </div>
      </div>
    </div>
  );
};
