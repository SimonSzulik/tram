import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

/**
 * Inline term with an on-demand definition (progressive disclosure). Optionally
 * shows the German lecture term so students can map back to the slides.
 */
export const GlossaryTerm = ({
  term,
  german,
  children,
}: {
  term: string;
  german?: string;
  children: React.ReactNode;
}) => (
  <HoverCard openDelay={120} closeDelay={80}>
    <HoverCardTrigger asChild>
      <span className="cursor-help font-medium text-primary decoration-dotted underline underline-offset-4">
        {term}
      </span>
    </HoverCardTrigger>
    <HoverCardContent className="w-72 text-sm">
      <p className="font-semibold">
        {term}
        {german && <span className="ml-1 font-normal text-muted-foreground">· {german}</span>}
      </p>
      <p className="mt-1 text-muted-foreground">{children}</p>
    </HoverCardContent>
  </HoverCard>
);
