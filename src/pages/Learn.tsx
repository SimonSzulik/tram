import { useState } from "react";
import { BookOpen, Compass, Library, Boxes, GraduationCap } from "lucide-react";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import {
  Prose,
  Callout,
  CodeSample,
  LiveTokens,
  AstTree,
  TryInWorkspace,
  GlossaryTerm,
} from "@/components/learn";
import { WikiExplorer } from "@/components/manual/WikiExplorer";
import { TOKEN_GROUPS, PRECEDENCE } from "@/content/tripla/tokens";
import { GRAMMAR, NONTERMINALS } from "@/content/tripla/grammar";
import { EXAMPLES } from "@/content/tripla/examples";

type Part = "guide" | "reference" | "wiki";

const TABS: { id: Part; label: string; icon: typeof Compass }[] = [
  { id: "guide", label: "Guide", icon: Compass },
  { id: "reference", label: "Reference", icon: Library },
  { id: "wiki", label: "Construct Wiki", icon: Boxes },
];

/* ------------------------------------------------------------------ Guide */

const Guide = () => (
  <div className="space-y-2">
    <Prose>
      <h2>What is TRIPLA?</h2>
      <p>
        <strong>TRIPLA</strong> (Trierer Programmiersprache) is a small teaching language from the University
        of Trier. It is <strong>expression-oriented</strong>: there are no statements — every construct,
        including <code>if</code>, <code>while</code> and assignment, is an expression that produces a value.
        Programs compile to the{" "}
        <GlossaryTerm term="TRAM" german="Trierer Abstrakte Maschine">
          A stack-based abstract machine that runs compiled TRIPLA code.
        </GlossaryTerm>
        , which you can run step by step in the Workspace.
      </p>

      <h3>Your first program</h3>
      <p>
        A TRIPLA program is usually a <code>let</code> that defines functions, followed by <code>in</code> and
        an expression that uses them:
      </p>
    </Prose>

    <CodeSample code={`let square(x) { x * x } in square(10)`} title="first.tripla" />

    <Prose>
      <p>
        Read it as: “define <code>square</code>, then compute <code>square(10)</code>.” The value of the whole
        program is the value of the expression after <code>in</code> — here, <strong>100</strong>.
      </p>
    </Prose>

    <TryInWorkspace code={`let square(x) { x * x } in square(10)`} label="Run your first program" />

    <Prose>
      <h3>The mental model</h3>
      <ul>
        <li>
          <strong>Everything returns a value.</strong> Even a loop or an assignment can sit where a number is
          expected.
        </li>
        <li>
          <strong>Functions live in <code>let … in</code>.</strong> They can be recursive, defined side by
          side, and nested inside one another.
        </li>
        <li>
          <strong>Values are integers.</strong> Booleans (<code>true</code>, <code>false</code>, comparisons)
          exist for conditions and behave like 1 and 0.
        </li>
      </ul>

      <h3>See the front end at work</h3>
      <p>
        Before code runs, TRIPLA is <em>scanned</em> into tokens and <em>parsed</em> into a tree. Edit the
        snippet below to watch both happen live — the same lexer and parser the compiler uses.
      </p>
    </Prose>

    <h4 className="mb-1 mt-6 text-sm font-semibold text-foreground">Tokens (lexer output)</h4>
    <LiveTokens initial={`let square(x) { x * x } in square(10)`} />

    <h4 className="mb-1 mt-6 text-sm font-semibold text-foreground">Abstract syntax tree (parser output)</h4>
    <AstTree initial={`let square(x) { x * x } in square(10)`} />

    <Callout variant="tip" title="Want the theory?">
      <p>
        The{" "}
        <a href="/compiler" className="font-medium text-primary hover:underline">
          Compiler Book
        </a>{" "}
        explains <em>how</em> scanning, parsing and code generation work. This manual is your quick reference
        for the language itself.
      </p>
    </Callout>

    <Prose>
      <h3>Worked examples</h3>
      <p>Six complete programs, from a one-liner to nested functions with side effects:</p>
    </Prose>

    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {EXAMPLES.map((ex) => (
        <div key={ex.id} className="flex flex-col rounded-xl border border-border bg-card/60 p-4">
          <h4 className="font-display font-semibold text-foreground">{ex.title}</h4>
          <p className="mt-0.5 text-sm text-muted-foreground">{ex.blurb}</p>
          <CodeSample code={ex.code} lang="tripla" className="my-3 flex-1" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Result <span className="font-mono font-bold text-foreground">{ex.result}</span>
            </span>
            <TryInWorkspace code={ex.code} label="Try it" />
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {ex.concepts.map((c) => (
              <span key={c} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* -------------------------------------------------------------- Reference */

const Reference = () => (
  <div className="space-y-10">
    {/* Tokens */}
    <section>
      <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Tokens</h2>
      <p className="mb-4 text-muted-foreground">
        The lexer turns characters into these tokens; whitespace and comments are discarded.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {TOKEN_GROUPS.map((g) => (
          <div key={g.title} className="overflow-hidden rounded-xl border border-border">
            <div className="border-b border-border bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground">
              {g.title}
            </div>
            <table className="w-full text-sm">
              <tbody>
                {g.rows.map((r, i) => (
                  <tr key={i} className={i % 2 ? "bg-muted/20" : ""}>
                    <td className="whitespace-nowrap px-4 py-1.5 font-mono text-xs font-semibold text-primary">
                      {r.token}
                    </td>
                    <td className="whitespace-nowrap px-4 py-1.5 font-mono text-xs text-foreground">
                      {r.lexeme}
                    </td>
                    <td className="px-4 py-1.5 text-xs text-muted-foreground">{r.note}</td>
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
      <p className="mb-4 text-muted-foreground">
        TRIPLA's grammar has five nonterminals. The start symbol is <code className="font-mono">E</code>.
      </p>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {NONTERMINALS.map((n) => (
          <div key={n.symbol} className="rounded-lg border border-border bg-card/60 px-3 py-2 text-sm">
            <span className="font-mono font-bold text-primary">{n.symbol}</span>{" "}
            <span className="text-muted-foreground">— {n.name}</span>
          </div>
        ))}
      </div>

      <div className="editor-panel overflow-x-auto p-5 custom-scrollbar">
        <div className="code-font space-y-4 text-sm">
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
      <p className="mb-4 text-muted-foreground">
        From lowest to highest binding — operators higher in the table bind tighter. So{" "}
        <code className="font-mono">2 + 3 * 4</code> is <strong>14</strong>, not 20.
      </p>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="px-4 py-2 font-semibold">Level</th>
              <th className="px-4 py-2 font-semibold">Operators</th>
              <th className="px-4 py-2 font-semibold">Binding</th>
            </tr>
          </thead>
          <tbody>
            {PRECEDENCE.map((p, i) => (
              <tr key={p.level} className={i % 2 ? "bg-muted/20" : ""}>
                <td className="px-4 py-1.5 font-mono text-muted-foreground">{p.level}</td>
                <td className="px-4 py-1.5 font-mono text-foreground">{p.ops}</td>
                <td className="px-4 py-1.5 text-muted-foreground">{p.assoc}</td>
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
          <GlossaryTerm term="lexical scope" german="statische Bindung">
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
          is implemented with <strong>static links</strong> — the machine climbs <code>d</code> frames to reach
          the right variable (see Compiler Book, Chapters 8–9).
        </p>
      </Prose>
      <CodeSample
        title="Inner function using the outer parameter"
        code={`let outer(x) {
  let inner(y) { x + y }
  in inner(10)
} in outer(5)`}
      />
      <TryInWorkspace code={`let outer(x) { let inner(y) { x + y } in inner(10) } in outer(5)`} />
    </section>

    {/* Semantics */}
    <section>
      <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Semantics in brief</h2>
      <Prose>
        <p>
          <strong>Semantics</strong> is the meaning behind the syntax. Two complementary styles describe it:
        </p>
        <ul>
          <li>
            <strong>Big-step</strong> — relates an expression directly to the value it evaluates to, in an
            environment ρ that maps names to values.
          </li>
          <li>
            <strong>Small-step</strong> — describes one reduction at a time; this is what the TRAM actually
            does, one instruction per step.
          </li>
        </ul>
        <p>
          An <strong>environment</strong> records the current bindings. Evaluating{" "}
          <code>let f(x) {"{"} x + 1 {"}"} in f(5)</code> binds <code>x</code> to 5 in a fresh environment for
          the call, then evaluates the body to 6.
        </p>
      </Prose>
      <Callout variant="lecture" title="Go deeper">
        <p>
          Formal semantics is covered in UAP08–09. The Compiler Book's Semantics chapter (Chapter 7) will walk
          through the evaluation rules with interactive derivations.
        </p>
      </Callout>
    </section>
  </div>
);

/* --------------------------------------------------------------- Wiki tab */

const Wiki = () => (
  <div>
    <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Construct wiki</h2>
    <p className="mb-5 text-muted-foreground">
      Every TRIPLA construct in one place. Search or filter, then expand an entry for its syntax, an example,
      how it compiles to TRAM, and a button to run it.
    </p>
    <WikiExplorer />
  </div>
);

/* -------------------------------------------------------------- Page shell */

const Learn = () => {
  const [part, setPart] = useState<Part>("guide");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-b from-muted/40 to-transparent">
        <div className="mx-auto max-w-5xl px-4 py-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />
            The TRIPLA Manual
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold text-foreground">Learn TRIPLA</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            An interactive guide, a complete language reference, and a searchable wiki of every construct —
            with everything runnable in the Workspace.
          </p>
        </div>
      </div>

      {/* Sticky sub-nav */}
      <div className="sticky top-16 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-1 px-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = part === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setPart(t.id)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
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
      <main className="mx-auto max-w-5xl px-4 py-10">
        {part === "guide" && <Guide />}
        {part === "reference" && <Reference />}
        {part === "wiki" && <Wiki />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 text-sm text-muted-foreground">
          <GraduationCap className="h-5 w-5 shrink-0 text-primary" />
          <p>
            TRIPLA and TRAM are from <em>Übersetzung und Analyse von Programmen</em>, Prof. Dr. Stephan Diehl,
            Universität Trier.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Learn;
