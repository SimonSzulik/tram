import { cn } from "@/lib/utils";

/**
 * Readable body-text wrapper. Uses @tailwindcss/typography with the app's
 * design tokens so learning prose is comfortable in light and dark mode.
 */
export const Prose = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "prose prose-slate max-w-none dark:prose-invert",
      "prose-headings:font-display prose-headings:scroll-mt-24",
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      "prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
      "prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5",
      "prose-strong:text-foreground prose-li:my-1",
      className
    )}
  >
    {children}
  </div>
);
