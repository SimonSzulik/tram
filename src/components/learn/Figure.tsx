import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Captioned diagram container with consistent framing. */
export const Figure = ({
  caption,
  children,
  className,
}: {
  caption?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <figure className={cn("my-6", className)}>
    <div className="overflow-x-auto rounded-xl border border-border bg-card/60 p-5 custom-scrollbar">
      {children}
    </div>
    {caption && (
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>
    )}
  </figure>
);

/**
 * Figure whose direct children fade/slide in when scrolled into view.
 * Honors prefers-reduced-motion via gsap.matchMedia.
 */
export const AnimatedFigure = ({
  caption,
  children,
  className,
  stagger = 0.12,
}: {
  caption?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) => {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
          if (!targets.length) return;
          if (ctx.conditions?.reduce) {
            gsap.set(targets, { opacity: 1, y: 0 });
            return;
          }
          gsap.from(targets, {
            opacity: 0,
            y: 16,
            duration: 0.5,
            ease: "power2.out",
            stagger,
            scrollTrigger: { trigger: scope.current, start: "top 80%" },
          });
        }
      );
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <figure className={cn("my-6", className)}>
      <div
        ref={scope}
        className="overflow-x-auto rounded-xl border border-border bg-card/60 p-5 custom-scrollbar"
      >
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
};
