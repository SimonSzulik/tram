import { Construction, Check, Sparkles } from "lucide-react";
import { Prose } from "@/components/learn";

/**
 * Rendered body for chapters that are planned but not yet fully written. Keeps
 * the table of contents complete and the learning arc visible, while being
 * honest that the prose is still coming.
 */
export const ChapterOutline = ({
  intro,
  keyPoints,
  planned,
}: {
  intro: React.ReactNode;
  keyPoints: string[];
  planned?: string[];
}) => (
  <div>
    <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2 text-sm text-amber-700 dark:text-amber-400">
      <Construction className="h-4 w-4" />
      Outline chapter — the full write-up is on the way. Here's what it will cover.
    </div>

    <Prose>{intro}</Prose>

    <h3 className="mb-3 mt-8 font-display text-lg font-semibold">What this chapter will teach</h3>
    <ul className="space-y-2">
      {keyPoints.map((p, i) => (
        <li key={i} className="flex gap-2 text-sm text-foreground/90">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{p}</span>
        </li>
      ))}
    </ul>

    {planned && planned.length > 0 && (
      <>
        <h3 className="mb-3 mt-8 font-display text-lg font-semibold">Planned interactive elements</h3>
        <ul className="space-y-2">
          {planned.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);
