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
    {/* Tokens */}
    <section>
      <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Tokens</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        The lexer turns characters into these tokens; whitespace and comments are discarded.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {TOKEN_GROUPS.map((g) => (
          <div key={g.title} className="overflow-hidden rounded-xl border border-border">
            <div className="border-b border-border bg-muted/40 px-3 py-1.5 text-sm font-semibold text-foreground">
              {g.title}
            </div>
            <table className="w-full text-sm">
              <tbody>
                {g.rows.map((r, i) => (
                  <tr key={i} className={i % 2 ? "bg-muted/20" : ""}>
                    <td className="whitespace-nowrap px-3 py-1 font-mono text-xs font-semibold text-primary">
                      {r.token}
                    </td>
                    <td className="whitespace-nowrap px-3 py-1 font-mono text-xs text-foreground">
                      {r.lexeme}
                    </td>
                    <td className="px-3 py-1 text-xs text-muted-foreground">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>

    {/* Grammar */}
    <section>
      <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Grammar</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        TRIPLA's grammar has five nonterminals. The start symbol is <code className="font-mono">E</code>.
      </p>

      <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {NONTERMINALS.map((n) => (
          <div key={n.symbol} className="rounded-lg border border-border bg-card/60 px-3 py-1.5 text-sm">
            <span className="font-mono font-bold text-primary">{n.symbol}</span>{" "}
            <span className="text-muted-foreground">— {n.name}</span>
          </div>
        ))}
      </div>

      <div className="editor-panel overflow-x-auto p-4 custom-scrollbar">
        <div className="code-font space-y-3 text-sm">
          {GRAMMAR.map((rule) => (
            <div key={rule.lhs}>
              {rule.rhs.map((alt, i) => (
                <div key={i} className="flex flex-wrap items-baseline gap-2">
                  <span className="w-6 text-right font-bold text-primary">{i === 0 ? rule.lhs : ""}</span>
                  <span className="text-syntax-punctuation">{i === 0 ? "→" : "|"}</span>
                  <span className="text-editor-foreground">{alt.symbols}</span>
                  {alt.note && <span className="italic text-syntax-comment">// {alt.note}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Precedence */}
    <section>
      <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Operator precedence</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        From lowest to highest binding — operators higher in the table bind tighter. So{" "}
        <code className="font-mono">2 + 3 * 4</code> is <strong>14</strong>, not 20.
      </p>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="px-3 py-1.5 font-semibold">Level</th>
              <th className="px-3 py-1.5 font-semibold">Operators</th>
              <th className="px-3 py-1.5 font-semibold">Binding</th>
            </tr>
          </thead>
          <tbody>
            {PRECEDENCE.map((p, i) => (
              <tr key={p.level} className={i % 2 ? "bg-muted/20" : ""}>
                <td className="px-3 py-1 font-mono text-muted-foreground">{p.level}</td>
                <td className="px-3 py-1 font-mono text-foreground">{p.ops}</td>
                <td className="px-3 py-1 text-muted-foreground">{p.assoc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* Functions & scope */}
    <section>
      <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Functions &amp; scope</h2>
      <Prose>
        <p>
          Functions are declared inside <code>let … in</code>. Several can be declared together and may call
          each other; a function body may contain its own <code>let</code>, creating <strong>nested</strong>{" "}
          functions with{" "}
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
      />
      <Prose>
        <p>
          A nested function can read and write the variables of the function that encloses it. At runtime this
          is implemented with <strong>static links</strong> — the machine climbs frames to reach the right
          variable.
        </p>
      </Prose>
      <CodeSample
        title="Inner function using the outer parameter"
        code={`let outer(x) {
  let inner(y) { x + y }
  in inner(10)
} in outer(5)`}
      />
    </section>

    {/* Semantics */}
    <section>
      <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Semantics in brief</h2>
      <Prose>
        <p>
          <strong>Semantics</strong> is the meaning behind the syntax. An <strong>environment</strong> maps the
          names currently in scope to their values. Evaluating <code>let f(x) {"{"} x + 1 {"}"} in f(5)</code>{" "}
          binds <code>x</code> to 5 in a fresh environment for the call, then evaluates the body to 6.
        </p>
        <p>
          Because TRIPLA is expression-oriented, every construct evaluates to a value: an <code>if</code> yields
          its chosen branch, a <code>while</code> yields its loop value, and a sequence <code>a ; b</code>{" "}
          yields <code>b</code> after running <code>a</code> for its effect.
        </p>
      </Prose>
    </section>
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
      <div className="border-b border-border bg-gradient-to-b from-muted/40 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center sm:px-6">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">The TRIPLA language</h1>
        </div>
      </div>

      {/* Sticky sub-nav */}
      <div className="sticky top-16 z-30 border-b border-border bg-card/95 backdrop-blur">
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
