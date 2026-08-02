import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeSample, GlossaryTerm, Prose } from "@/components/learn";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { FEATURES, type Feature } from "@/content/tripla/features";

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon;
  return (
    <div className="flex h-full min-h-[28rem] flex-col rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground">{feature.label}</h3>
          <p className="text-sm text-muted-foreground">{feature.tagline}</p>
        </div>
      </div>

      <div className="mt-5 max-w-3xl space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        {feature.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-auto pt-5">
        <CodeSample code={feature.example} lang="tripla" className="mt-0" />
        <p className="mt-2 text-sm text-muted-foreground">
          Result <span className="font-mono font-bold text-foreground">{feature.result}</span>
        </p>
      </div>
    </div>
  );
};

/**
 * Slideable deck of TRIPLA language features. Move with the arrows, the dots, or
 * by dragging/swiping left and right.
 */
export const FeatureExplorer = () => {
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
      <section className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">What is TRIPLA?</h2>
        <Prose className="mt-2">
          <p>
            <strong>TRIPLA</strong> is a small, <strong>expression-oriented</strong> language: there are no
            statements — every construct, including <code>if</code>, <code>while</code> and assignment, is an
            expression that produces a value. Programs run on the{" "}
            <GlossaryTerm term="TRAM">
              A stack-based abstract machine that executes compiled TRIPLA code.
            </GlossaryTerm>
            , which you can drive step by step in the Workspace.
          </p>
          <ul>
            <li>
              <strong>Everything returns a value</strong> — even a loop or an assignment can sit where a number
              is expected.
            </li>
            <li>
              <strong>
                Functions live in <code>let … in</code>
              </strong>{" "}
              — they can be recursive, defined side by side, and nested.
            </li>
            <li>
              <strong>Values are integers</strong> — booleans exist for conditions and behave like 1 and 0.
            </li>
          </ul>
        </Prose>
      </section>

      {/* Quick-jump labels */}
      <div className="mb-3 flex flex-wrap gap-2">
        {FEATURES.map((f, i) => {
          const ChipIcon = f.icon;
          const active = i === current;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <ChipIcon className="h-4 w-4" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Slideable cards — full width, no side arrows eating space */}
      <Carousel setApi={setApi} opts={{ align: "start" }}>
        <CarouselContent className="-ml-0">
          {FEATURES.map((f) => (
            <CarouselItem key={f.id} className="pl-0">
              <FeatureCard feature={f} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Arrows + position dots */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous feature"
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
          {FEATURES.map((f, i) => (
            <button
              key={f.id}
              type="button"
              aria-label={`Go to ${f.label}`}
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
          aria-label="Next feature"
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
