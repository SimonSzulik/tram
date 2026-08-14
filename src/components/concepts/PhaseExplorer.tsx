import { useEffect, useState, Fragment } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHASES, type Phase } from "@/content/concepts";
import { CodeSample } from "@/components/learn";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Accent → bullet color. Written out so Tailwind's scanner actually emits these
// classes (a `text-` → `bg-` string replace produces names it never sees).
const DOT_CLASS: Record<string, string> = {
  "text-sky-500": "bg-sky-500",
  "text-primary": "bg-primary",
  "text-violet-500": "bg-violet-500",
  "text-cyan-500": "bg-cyan-500",
  "text-amber-500": "bg-amber-500",
  "text-emerald-500": "bg-emerald-500",
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>
);

const PhaseCard = ({ phase }: { phase: Phase }) => {
  const Icon = phase.icon;
  const isFrontend = phase.side === "frontend";
  const dot = DOT_CLASS[phase.accent] ?? "bg-muted-foreground";

  return (
    <div className="relative flex h-full min-h-[19rem] flex-col rounded-2xl border border-border bg-card/60 p-5 sm:p-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Analogy"
            className="absolute right-4 top-4 rounded-md p-1.5 text-amber-500 transition-colors hover:bg-amber-500/10 hover:text-amber-400"
          >
            <Lightbulb className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs text-sm italic">
          {phase.analogy}
        </TooltipContent>
      </Tooltip>

      <div className="flex items-start gap-3 pr-8">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted", phase.accent)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-bold text-foreground">{phase.title}</h3>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                isFrontend ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-500"
              )}
            >
              {isFrontend ? "Front end" : "Back end"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
        </div>
      </div>

      <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">{phase.description}</p>

      {/* Two balanced columns that absorb the leftover height instead of leaving
          one dead gap: the checklist fills the left, the worked example the right. */}
      <div className="mt-5 grid flex-1 gap-4 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
        <div className="flex min-w-0 flex-col">
          <SectionLabel>What it does</SectionLabel>
          <ul className="grid flex-1 content-start gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-1">
            {phase.keyPoints.map((k, i) => (
              <li key={i} className="flex gap-2 text-sm leading-snug text-foreground/90">
                <span className={cn("mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-w-0 flex-col rounded-xl border border-border/70 bg-muted/25 p-3 sm:p-4">
          <SectionLabel>Example</SectionLabel>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
            <CodeSample code={phase.example.input} lang="text" copy={false} className="my-0" />
            <div className="flex items-center gap-1.5 py-0.5 pl-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              <ArrowDown className={cn("h-3.5 w-3.5", phase.accent)} />
              becomes
            </div>
            <CodeSample code={phase.example.output} lang="text" copy={false} className="my-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Swipeable compilation pipeline. Jump via stage chips, swipe/drag the card,
 * or use arrows and dots — same interaction model as FeatureExplorer.
 */
export const PhaseExplorer = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setCurrent(api.selectedScrollSnap());
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <div>
      {/* Stage flow with FE/BE marks and arrows */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {PHASES.map((p, i) => {
          const Icon = p.icon;
          const active = i === current;
          const isFrontend = p.side === "frontend";
          const showSideBreak = i > 0 && PHASES[i - 1].side !== p.side;

          return (
            <Fragment key={p.id}>
              {i > 0 && !showSideBreak && (
                <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/50 sm:block" />
              )}
              {showSideBreak && (
                <>
                  <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/50 sm:block" />
                  <span className="mx-0.5 hidden h-6 w-px bg-border sm:block" aria-hidden />
                  <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/50 sm:block" />
                </>
              )}
              <button
                type="button"
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-all sm:text-sm",
                  isFrontend
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-emerald-500 bg-emerald-500/10 text-emerald-500",
                  active
                    ? "shadow-md ring-2 ring-offset-1 ring-offset-background " +
                        (isFrontend ? "ring-primary" : "ring-emerald-500")
                    : "opacity-80 hover:opacity-100"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{p.title}</span>
              </button>
            </Fragment>
          );
        })}
      </div>

      <div className="mb-3 flex justify-center gap-4 text-xs text-muted-foreground">
        <span>
          <strong className="font-semibold text-primary">Front end</strong> — understands the source
        </span>
        <span>
          <strong className="font-semibold text-emerald-500">Back end</strong> — produces the target
        </span>
      </div>

      <Carousel setApi={setApi} opts={{ align: "start" }}>
        <CarouselContent className="-ml-0">
          {PHASES.map((p) => (
            <CarouselItem key={p.id} className="pl-0">
              <PhaseCard phase={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous stage"
          disabled={!canPrev}
          onClick={() => api?.scrollPrev()}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors",
            canPrev
              ? "text-foreground hover:bg-muted"
              : "cursor-not-allowed text-muted-foreground/40"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {PHASES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Go to ${p.title}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next stage"
          disabled={!canNext}
          onClick={() => api?.scrollNext()}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors",
            canNext
              ? "text-foreground hover:bg-muted"
              : "cursor-not-allowed text-muted-foreground/40"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
