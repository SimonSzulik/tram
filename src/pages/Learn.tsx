import { useState } from "react";
import { Compass, Library, Boxes } from "lucide-react";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { Prose, CodeSample, GlossaryTerm } from "@/components/learn";
import { FeatureExplorer } from "@/components/manual/FeatureExplorer";
import { WikiExplorer } from "@/components/manual/WikiExplorer";
import { TOKEN_GROUPS, PRECEDENCE } from "@/content/tripla/tokens";
import { GRAMMAR, NONTERMINALS } from "@/content/tripla/grammar";

type Part = "features" | "reference" | "wiki";

const TABS: { id: Part; label: string; icon: typeof Compass }[] = [
  { id: "features", label: "Features", icon: Compass },
  { id: "reference", label: "Reference", icon: Library },
  { id: "wiki", label: "Construct Wiki", icon: Boxes },
];

/* --------------------------------------------------------------- Features */

const Features = () => <FeatureExplorer />;

/* -------------------------------------------------------------- Reference */

const Reference = () => (
  <div className="space-y-7">
    {/* Tokens + Operator precedence */}
    <section>
      <h2 className="mb-2 text-center font-display text-2xl font-bold text-foreground">Tokens</h2>
      {/* CSS columns stack short groups in the same column to cut empty row gaps */}
      <div className="columns-1 gap-2 sm:columns-2 lg:columns-3">
        {TOKEN_GROUPS.map((g) => (
          <div
            key={g.title}
            className="mb-2 break-inside-avoid overflow-hidden rounded-lg border border-border"
          >
            <div className="border-b border-border bg-muted/40 px-2 py-0.5 text-xs font-semibold text-foreground">
              {g.title}
            </div>
            <table className="w-full text-sm">
              <tbody>
                {g.rows.map((r, i) => (
                  <tr key={i} className={i % 2 ? "bg-muted/20" : ""}>
                    <td className="whitespace-nowrap px-2 py-px font-mono text-[11px] font-semibold text-primary">
                      {r.token}
                    </td>
                    <td className="whitespace-nowrap px-2 py-px font-mono text-[11px] text-foreground">
                      {r.lexeme}
                    </td>
                    <td className="px-2 py-px text-[11px] text-muted-foreground">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <h2 className="mb-1.5 mt-4 text-center font-display text-2xl font-bold text-foreground">
        Operator precedence
      </h2>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="px-2 py-0.5 text-xs font-semibold">Level</th>
              <th className="px-2 py-0.5 text-xs font-semibold">Operators</th>
              <th className="px-2 py-0.5 text-xs font-semibold">Binding</th>
            </tr>
          </thead>
          <tbody>
            {PRECEDENCE.map((p, i) => (
              <tr key={p.level} className={i % 2 ? "bg-muted/20" : ""}>
                <td className="px-2 py-px font-mono text-[11px] text-muted-foreground">{p.level}</td>
                <td className="px-2 py-px font-mono text-[11px] text-foreground">{p.ops}</td>
                <td className="px-2 py-px text-[11px] text-muted-foreground">{p.assoc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* Grammar + Functions & scope side by side — bottoms of grammar box and last example align */}
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Grammar */}
      <section className="flex flex-col lg:col-span-3">
        <h2 className="mb-3 text-center font-display text-2xl font-bold text-foreground">
          Grammar <span className="font-normal text-muted-foreground">— 5 Nonterminals</span>
        </h2>

        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
          {NONTERMINALS.map((n) => (
            <span key={n.symbol}>
              <span className="font-mono font-bold text-primary">{n.symbol}</span>
              <span className="text-muted-foreground"> — {n.name}</span>
            </span>
          ))}
        </div>

        <div className="editor-panel flex-1 overflow-x-auto p-3 custom-scrollbar">
          <div className="code-font space-y-2.5 text-sm">
            {GRAMMAR.map((rule) => (
              <div key={rule.lhs}>
                {rule.rhs.map((alt, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="w-5 shrink-0 text-right font-bold text-primary">
                      {i === 0 ? rule.lhs : ""}
                    </span>
                    <span className="shrink-0 text-syntax-punctuation">{i === 0 ? "→" : "|"}</span>
                    <span className="min-w-0 flex-1 text-editor-foreground">{alt.symbols}</span>
                    {alt.note && (
                      <span className="ml-4 shrink-0 italic text-syntax-comment">// {alt.note}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Functions & scope — explanation → example, twice */}
      <section className="flex flex-col lg:col-span-2">
        <h2 className="mb-3 text-center font-display text-2xl font-bold text-foreground">
          Functions &amp; scope
        </h2>

        <div className="flex flex-1 flex-col gap-4">
          <div>
            <Prose className="prose-sm">
              <p>
                Functions are declared inside <code>let … in</code>. Several can be declared together and may
                call each other; a function body may contain its own <code>let</code>, creating{" "}
                <strong>nested</strong> functions with{" "}
                <GlossaryTerm term="lexical scope">
                  A name refers to the binding in the nearest enclosing scope where it was declared.
                </GlossaryTerm>
                .
              </p>
            </Prose>
            <CodeSample
              title="Mutual and nested functions"
              code={`let
  add(a, b) { a + b }
  square(x) { x * x }
in
  add(square(3), square(4))`}
              className="mb-0 mt-2"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <Prose className="prose-sm">
              <p>
                A nested function can read and write the variables of the function that encloses it. At runtime
                this is implemented with <strong>static links</strong> — the machine climbs frames to reach the
                right variable.
              </p>
            </Prose>
            <CodeSample
              title="Inner function using the outer parameter"
              code={`let outer(x) {
  let inner(y) { x + y }
  in inner(10)
} in outer(5)`}
              className="mb-0 mt-2 flex-1"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
);

/* --------------------------------------------------------------- Wiki tab */

const Wiki = () => (
  <div>
    <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Construct wiki</h2>
    <p className="mb-4 text-sm text-muted-foreground">
      Every TRIPLA construct in one place. Search or filter, then expand an entry for its syntax, an example,
      and how it compiles to TRAM.
    </p>
    <WikiExplorer />
  </div>
);

/* -------------------------------------------------------------- Page shell */

const Learn = () => {
  const [part, setPart] = useState<Part>("features");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center sm:px-6">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">The TRIPLA language</h1>
        </div>
      </div>

      {/* Sticky sub-nav */}
      <div className="sticky top-14 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = part === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setPart(t.id)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {part === "features" && <Features />}
        {part === "reference" && <Reference />}
        {part === "wiki" && <Wiki />}
      </main>
    </div>
  );
};

export default Learn;
