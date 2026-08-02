import { BookOpen, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { PhaseExplorer } from "@/components/concepts/PhaseExplorer";
import { Prose, Callout, AnimatedFigure, GlossaryTerm } from "@/components/learn";

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

const Compiler = () => {
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

        {/* Interactive pipeline (includes FE/BE framing) */}
        <section className="mt-8">
          <h2 className="font-display text-2xl font-bold text-foreground">The compilation pipeline</h2>
          <p className="mb-4 mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Compilers are split in two. The <strong>front end</strong> understands the source language; the{" "}
            <strong>back end</strong> produces target code. Between them sits an internal representation, which
            lets one front end serve many targets.
          </p>
          <PhaseExplorer />
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
      </main>
    </div>
  );
};

export default Compiler;
