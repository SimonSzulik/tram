import { ArrowRight, BookOpen, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { PhaseExplorer } from "@/components/concepts/PhaseExplorer";
import { PHASES, GLOSSARY } from "@/content/concepts";
import { Prose, Callout, AnimatedFigure, GlossaryTerm } from "@/components/learn";
import { cn } from "@/lib/utils";

const CompilerVsInterpreter = () => (
  <AnimatedFigure caption="Two ways to run a program. Most real systems mix both.">
    <div className="grid gap-3 sm:grid-cols-2">
      <div data-reveal className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h4 className="font-display font-semibold text-foreground">Compiler</h4>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Translates the <em>whole</em> program ahead of time into another language, which you run later.
        </p>
        <p className="mt-2.5 rounded-md bg-muted/50 p-2 text-xs italic text-foreground/80">
          Like a translator who renders an entire book, then hands you the finished translation.
        </p>
      </div>
      <div data-reveal className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-emerald-500" />
          <h4 className="font-display font-semibold text-foreground">Interpreter</h4>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Walks the program and carries out its effects <em>directly</em>, without producing a separate output
          program.
        </p>
        <p className="mt-2.5 rounded-md bg-muted/50 p-2 text-xs italic text-foreground/80">
          Like a live interpreter translating a conversation sentence by sentence, as it happens.
        </p>
      </div>
    </div>
    <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
      This split is also why a compiler reports{" "}
      <GlossaryTerm term="compile-time errors">
        Problems a compiler can find before the program runs — misspelled tokens, grammar mistakes, undeclared
        names, type mismatches. They're caught by scanning, parsing and semantic analysis.
      </GlossaryTerm>{" "}
      before you ever run the program, while an interpreter often only hits a{" "}
      <GlossaryTerm term="run-time error">
        A problem that only surfaces while the program executes — like a bad input or a logic mistake that just
        happens to go wrong for certain values. No compile-time phase can see these.
      </GlossaryTerm>{" "}
      once execution reaches the offending line.
    </p>
  </AnimatedFigure>
);

const PhaseCard = ({ phase }: { phase: (typeof PHASES)[number] }) => {
  const Icon = phase.icon;
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted", phase.accent)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">{phase.title}</h3>
          <p className="text-xs text-muted-foreground">{phase.subtitle}</p>
        </div>
      </div>
      <p className="mt-2.5 text-sm italic text-foreground/80">💡 {phase.analogy}</p>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{phase.description}</p>
    </div>
  );
};

const Compiler = () => {
  const frontend = PHASES.filter((p) => p.side === "frontend");
  const backend = PHASES.filter((p) => p.side === "backend");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <div className="animate-fade-in text-center">
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            How a compiler works
          </h1>
        </div>

        {/* What is a compiler */}
        <section className="mt-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">What is a compiler?</h2>
            <Prose className="mt-3 text-center prose-p:mx-auto prose-p:max-w-2xl prose-p:text-center prose-p:text-[15px] prose-p:leading-relaxed">
              <p>
                A <strong>compiler</strong> is a program that translates code written in one language — the{" "}
                <em>source</em> — into an equivalent program in another language, the <em>target</em>. The
                target might be machine code for a processor, bytecode for a virtual machine, or even another
                high-level language. The one rule: the translation must do exactly what the original said.
              </p>
              <p>
                It sounds like one big leap, but compilers do it as an <strong>assembly line</strong>: a
                sequence of small, well-defined stages, each taking the program a little closer to something a
                machine can run. Understanding those stages is the whole idea.
              </p>
            </Prose>
          </div>

          <div className="mt-6">
            <CompilerVsInterpreter />
          </div>
        </section>

        {/* Interactive pipeline */}
        <section className="mt-8">
          <h2 className="font-display text-2xl font-bold text-foreground">The compilation pipeline</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Source code flows left to right through these stages. Click any stage to explore it.
          </p>
          <PhaseExplorer />
        </section>

        {/* Front end / back end explained */}
        <section className="mt-8">
          <h2 className="font-display text-2xl font-bold text-foreground">Front end &amp; back end</h2>
          <p className="mb-4 mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Compilers are split in two. The <strong>front end</strong> understands the source language; the{" "}
            <strong>back end</strong> produces target code. Between them sits an internal representation, which
            lets one front end serve many targets.
          </p>

          <h3 className="mb-2.5 mt-4 font-display text-lg font-semibold text-primary">
            Front end — understanding the source
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {frontend.map((p) => (
              <PhaseCard key={p.id} phase={p} />
            ))}
          </div>

          <div className="my-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-full bg-muted px-3 py-1 font-mono text-xs">internal representation</span>
            <ArrowRight className="h-4 w-4" />
          </div>

          <h3 className="mb-2.5 font-display text-lg font-semibold text-emerald-500">
            Back end — producing the target
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {backend.map((p) => (
              <PhaseCard key={p.id} phase={p} />
            ))}
          </div>
        </section>

        <div className="mt-6">
          <Callout variant="tip" title="Why so many stages?">
            <p>
              Separating concerns keeps each part simple and reusable. The front end wrestles with messy source
              syntax and hands the back end a clean tree; the back end worries only about producing good target
              code. Swap the back end and the same front end can target a different machine.
            </p>
          </Callout>
        </div>

        {/* Glossary */}
        <section className="mt-8">
          <h2 className="font-display text-2xl font-bold text-foreground">Key concepts</h2>
          <p className="mb-3 mt-1 text-sm text-muted-foreground">
            The vocabulary that shows up in every compiler.
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {GLOSSARY.map((g) => (
              <div key={g.term} className="rounded-lg border border-border bg-card/60 px-3.5 py-3">
                <p className="font-display font-semibold text-foreground">{g.term}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{g.definition}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Compiler;
