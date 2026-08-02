import { useState } from "react";
import { FileCode, Binary, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHASES, type Phase } from "@/content/concepts";
import { CodeSample } from "@/components/learn";

const PhaseChip = ({
  phase,
  index,
  active,
  onClick,
}: {
  phase: Phase;
  index: number;
  active: boolean;
  onClick: () => void;
}) => {
  const Icon = phase.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex h-full min-h-[88px] w-full flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-all",
        active
          ? "border-primary bg-primary/10 shadow-md"
          : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40"
      )}
    >
      <span className="absolute left-2 top-1.5 font-mono text-[10px] text-muted-foreground">{index + 1}</span>
      <Icon className={cn("h-6 w-6", phase.accent)} />
      <span className="text-xs font-semibold leading-tight text-foreground">{phase.title}</span>
      <span className="text-[10px] leading-tight text-muted-foreground">{phase.subtitle}</span>
    </button>
  );
};

/**
 * Interactive compilation pipeline. A responsive grid (never a horizontal
 * scrollbar): one row on wide screens, wrapping cleanly on narrow ones. Click a
 * stage to reveal what it does, an analogy, a tiny example and its key points.
 */
export const PhaseExplorer = () => {
  const [selected, setSelected] = useState<string | null>("scanner");
  const phase = PHASES.find((p) => p.id === selected) ?? null;

  return (
    <div>
      {/* Endpoints legend */}
      <div className="mb-2 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1">
          <FileCode className="h-3.5 w-3.5" /> Source code
        </span>
        <ArrowRight className="h-3.5 w-3.5" />
        <span>
          <strong className="font-semibold text-primary">front end</strong> then{" "}
          <strong className="font-semibold text-emerald-500">back end</strong>
        </span>
        <ArrowRight className="h-3.5 w-3.5" />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1">
          <Binary className="h-3.5 w-3.5" /> Target code
        </span>
      </div>

      {/* Stage grid — fits without scrolling, wraps on small screens */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {PHASES.map((p, i) => (
          <PhaseChip
            key={p.id}
            phase={p}
            index={i}
            active={selected === p.id}
            onClick={() => setSelected(p.id)}
          />
        ))}
      </div>

      <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
        <ChevronDown className="h-3 w-3" />
        Click any stage to see what it does.
      </p>

      {/* Detail card */}
      {phase && (
        <div key={phase.id} className="mt-3 animate-fade-in rounded-xl border border-border bg-card/60 p-5">
          <div className="flex items-center gap-3">
            <phase.icon className={cn("h-6 w-6", phase.accent)} />
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">{phase.title}</h3>
              <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
            </div>
          </div>

          <p className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-sm italic text-foreground/90">
            💡 {phase.analogy}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{phase.description}</p>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">In</p>
              <CodeSample code={phase.example.input} lang="text" copy={false} className="my-0" />
              <p className="mb-1 mt-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Out</p>
              <CodeSample code={phase.example.output} lang="text" copy={false} className="my-0" />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                What it does
              </p>
              <ul className="space-y-1">
                {phase.keyPoints.map((k, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/90">
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", phase.accent.replace("text-", "bg-"))} />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
