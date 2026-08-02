import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeSample, TryInWorkspace } from "@/components/learn";
import { WIKI, WIKI_CATEGORIES, type WikiCategory } from "@/content/tripla/wiki";

const WikiCard = ({ entry }: { entry: (typeof WIKI)[number] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-foreground">{entry.name}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              {entry.category}
            </span>
          </div>
          <code className="mt-1 block font-mono text-xs text-primary">{entry.syntax}</code>
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="mt-3 animate-fade-in border-t border-border pt-3">
          <p className="text-sm text-muted-foreground">{entry.description}</p>

          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Example</p>
          <CodeSample code={entry.example} lang="tripla" className="my-2" />

          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            How it compiles to TRAM
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{entry.compilesTo}</p>

          <div className="mt-3">
            <TryInWorkspace code={entry.example} />
          </div>
        </div>
      )}
    </div>
  );
};

/** Searchable, filterable index of every TRIPLA construct. */
export const WikiExplorer = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<WikiCategory | "All">("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WIKI.filter((e) => {
      if (category !== "All" && e.category !== category) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.syntax.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search constructs — e.g. while, assignment, &&…"
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Category filter */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(["All", ...WIKI_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              category === c
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-5 space-y-3">
        {results.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No constructs match your search.</p>
        ) : (
          results.map((e) => <WikiCard key={e.id} entry={e} />)
        )}
      </div>
    </div>
  );
};
