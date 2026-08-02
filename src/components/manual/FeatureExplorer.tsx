import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeSample, GlossaryTerm } from "@/components/learn";
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
    <div className="flex h-full min-h-[22rem] flex-col rounded-xl border border-border bg-card/60 p-5 sm:min-h-[26rem] sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">{feature.label}</h3>
          <p className="text-sm text-muted-foreground">{feature.tagline}</p>
        </div>
      </div>

      <div className="mt-4 max-w-3xl space-y-2 text-[15px] leading-relaxed text-muted-foreground">
        {feature.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <CodeSample code={feature.example} lang="tripla" className="my-0 mt-0" />
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
    <div className="flex min-h-[calc(100vh-11rem)] flex-col">
      <section className="mb-2 shrink-0">
        <h2 className="font-display text-xl font-bold text-foreground">What is TRIPLA?</h2>
        <p className="mt-1 max-w-none text-sm leading-snug text-muted-foreground">
          <strong className="text-foreground">TRIPLA</strong> is a small,{" "}
          <strong className="text-foreground">expression-oriented</strong> language — every construct (
          <code className="font-mono text-sm">if</code>, <code className="font-mono text-sm">while</code>,
          assignment) yields a value. Functions live in <code className="font-mono text-sm">let … in</code>,
          values are integers, and programs run on the{" "}
          <GlossaryTerm term="TRAM">
            A stack-based abstract machine that executes compiled TRIPLA code.
          </GlossaryTerm>
          .
        </p>
      </section>

      {/* Quick-jump labels */}
      <div className="mb-2 flex shrink-0 flex-wrap gap-1.5">
        {FEATURES.map((f, i) => {
          const ChipIcon = f.icon;
          const active = i === current;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
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

      {/* Slideable cards — grow to fill remaining viewport */}
      <Carousel setApi={setApi} opts={{ align: "start" }} className="flex min-h-0 flex-1 flex-col">
        <CarouselContent className="-ml-0 h-full">
          {FEATURES.map((f) => (
            <CarouselItem key={f.id} className="pl-0">
              <FeatureCard feature={f} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Arrows + position dots */}
      <div className="mt-3 flex shrink-0 items-center justify-center gap-3 pb-1">
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
