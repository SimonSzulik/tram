import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHAPTERS, PARTS, adjacentChapters, type Chapter } from "@/content/book";

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
};

const TableOfContents = ({ currentId }: { currentId: string }) => (
  <nav className="space-y-6">
    {PARTS.map((part) => {
      const chapters = CHAPTERS.filter((c) => c.part === part.id);
      return (
        <div key={part.id}>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {part.title}
          </p>
          <ul className="space-y-0.5">
            {chapters.map((c) => {
              const active = c.id === currentId;
              return (
                <li key={c.id}>
                  <Link
                    to={`/compiler/${c.id}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="w-4 shrink-0 text-right font-mono text-xs opacity-60">{c.number}</span>
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    {c.status === "outline" && (
                      <span className="shrink-0 rounded bg-muted px-1 py-0.5 text-[9px] uppercase text-muted-foreground">
                        soon
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      );
    })}
  </nav>
);

export const BookLayout = ({ chapter }: { chapter: Chapter }) => {
  const progress = useScrollProgress();
  const { prev, next } = adjacentChapters(chapter.id);
  const Content = chapter.Content;

  // Scroll to top when switching chapters.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapter.id]);

  return (
    <div className="relative">
      {/* Reading progress bar */}
      <div className="sticky top-0 z-30 h-1 bg-transparent">
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2 custom-scrollbar">
            <Link
              to="/compiler"
              className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              Compiler Book
            </Link>
            <TableOfContents currentId={chapter.id} />
          </div>
        </aside>

        {/* Chapter body */}
        <article className="min-w-0">
          {/* Chapter header */}
          <header className="mb-8 border-b border-border pb-6">
            <div className="mb-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-mono">Chapter {chapter.number}</span>
              {chapter.lectureRef && (
                <>
                  <span className="text-border">·</span>
                  <span>{chapter.lectureRef}</span>
                </>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">{chapter.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{chapter.summary}</p>

            <div className="mt-5 rounded-lg border border-border bg-muted/30 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Target className="h-4 w-4 text-primary" />
                By the end you'll be able to
              </p>
              <ul className="space-y-1.5">
                {chapter.objectives.map((o, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </header>

          <Content />

          {/* Prev / next */}
          <nav className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
            {prev ? (
              <Link
                to={`/compiler/${prev.id}`}
                className="group flex flex-col rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft className="h-3 w-3" /> Previous
                </span>
                <span className="mt-1 font-medium text-foreground group-hover:text-primary">
                  {prev.number}. {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/compiler/${next.id}`}
                className="group flex flex-col rounded-lg border border-border p-4 text-right transition-colors hover:border-primary/40 hover:bg-muted/40 sm:col-start-2"
              >
                <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  Next <ArrowRight className="h-3 w-3" />
                </span>
                <span className="mt-1 font-medium text-foreground group-hover:text-primary">
                  {next.number}. {next.title}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  );
};
