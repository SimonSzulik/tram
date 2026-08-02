import { FileCode, ScanLine, ListTree, CheckCircle2, Cpu, Play, ArrowRight } from "lucide-react";
import { AnimatedFigure } from "@/components/learn";

const STAGES = [
  { icon: FileCode, label: "Source", sub: "TRIPLA text", tone: "text-slate-500" },
  { icon: ScanLine, label: "Scanner", sub: "→ tokens", tone: "text-syntax-keyword" },
  { icon: ListTree, label: "Parser", sub: "→ AST", tone: "text-primary" },
  { icon: CheckCircle2, label: "Semantics", sub: "meaning", tone: "text-cyan-500" },
  { icon: Cpu, label: "Code Gen", sub: "→ TRAM", tone: "text-syntax-number" },
  { icon: Play, label: "TRAM", sub: "runs it", tone: "text-stack-push" },
];

/** The compilation pipeline as a row of stages, revealed with a GSAP stagger. */
export const PipelineDiagram = ({ caption }: { caption?: React.ReactNode }) => (
  <AnimatedFigure caption={caption}>
    <div className="flex min-w-max items-stretch gap-1">
      {STAGES.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex items-center gap-1">
            <div
              data-reveal
              className="flex w-24 flex-col items-center gap-1 rounded-lg border border-border bg-card px-2 py-3 text-center"
            >
              <Icon className={`h-6 w-6 ${s.tone}`} />
              <span className="text-xs font-semibold text-foreground">{s.label}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{s.sub}</span>
            </div>
            {i < STAGES.length - 1 && (
              <ArrowRight data-reveal className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
          </div>
        );
      })}
    </div>
  </AnimatedFigure>
);
