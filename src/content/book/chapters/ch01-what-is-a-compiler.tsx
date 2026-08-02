import { Prose, Callout, WorkedExample, CheckUnderstanding, GlossaryTerm } from "@/components/learn";
import { PipelineDiagram } from "@/components/book/PipelineDiagram";

export default function Chapter01() {
  return (
    <div>
      <Prose>
        <p>
          A <strong>compiler</strong> is a program that reads a program written in one language — the{" "}
          <em>source language</em> — and translates it into an equivalent program in another language, the{" "}
          <em>target language</em>. That target might be machine code for a real CPU, bytecode for a virtual
          machine, or even another high-level language. The key word is <em>equivalent</em>: the translated
          program must do the same thing as the original.
        </p>
        <p>
          Throughout this book our source language is <strong>TRIPLA</strong>, a small but complete language
          with variables, arithmetic, conditionals, loops and nested functions. Our target is the{" "}
          <strong>TRAM</strong>, a stack-based abstract machine. You can watch the whole translation happen,
          instruction by instruction, in the <a href="/">Workspace</a>.
        </p>

        <h2>Compilation vs. interpretation</h2>
        <p>
          There are two classic ways to run a program. A{" "}
          <GlossaryTerm term="compiler" german="Übersetzer">
            Translates the whole program ahead of time into another language, which is then executed.
          </GlossaryTerm>{" "}
          translates the entire program first and produces an artifact you run later. An{" "}
          <GlossaryTerm term="interpreter" german="Interpretierer">
            Walks the program's structure and performs its effects directly, without producing a separate
            translated program.
          </GlossaryTerm>{" "}
          instead walks the program and carries out its effects on the fly. Many real systems blend the two —
          Java compiles to bytecode which is then interpreted and later JIT-compiled.
        </p>
      </Prose>

      <Callout variant="tip" title="One mental model">
        <p>
          A compiler is a <em>pipeline of translations</em>: each stage takes one representation of the
          program and produces a slightly lower-level one, until we reach something the machine can run
          directly. Understanding each hand-off is the whole game.
        </p>
      </Callout>

      <Prose>
        <h2>The pipeline</h2>
        <p>
          Compilers are traditionally split into a <strong>front end</strong> that understands the source
          language, and a <strong>back end</strong> that produces target code. Between them sits an internal
          representation — for us, the <em>abstract syntax tree</em> (AST).
        </p>
      </Prose>

      <PipelineDiagram caption="The stages a TRIPLA program passes through. The front end (Scanner → Parser → Semantics) understands the source; the back end (Code Gen) produces TRAM code the machine runs." />

      <Prose>
        <ul>
          <li>
            <strong>Scanner (lexer)</strong> — groups characters into <em>tokens</em> such as <code>let</code>,{" "}
            <code>sq</code>, <code>(</code> and <code>5</code>. (Chapter&nbsp;4)
          </li>
          <li>
            <strong>Parser</strong> — checks the tokens follow the grammar and builds the AST. (Chapter&nbsp;5)
          </li>
          <li>
            <strong>Semantic analysis</strong> — assigns meaning: which variable does a name refer to, what
            scope is it in. (Chapter&nbsp;7)
          </li>
          <li>
            <strong>Code generation</strong> — walks the AST and emits TRAM instructions. (Chapter&nbsp;8)
          </li>
        </ul>
      </Prose>

      <WorkedExample
        title="Following square(5) through the pipeline"
        steps={[
          {
            label: "Source",
            content: <code className="font-mono">let sq(x) {"{"} x * x {"}"} in sq(5)</code>,
          },
          {
            label: "Tokens (scanner)",
            content: (
              <span className="font-mono text-xs">
                LET · ID(sq) · LP · ID(x) · RP · LB · ID(x) · MUL · ID(x) · RB · IN · ID(sq) · LP · CONST(5) ·
                RP
              </span>
            ),
          },
          {
            label: "AST (parser)",
            content: "A LET node with one function declaration sq, whose body is a BINOP(*), applied via a CALL to the argument 5.",
          },
          {
            label: "TRAM code (code gen)",
            content: "CONST 5, INVOKE sq, … LOAD x, LOAD x, MUL, RETURN — which the machine runs to produce 25.",
          },
        ]}
      />

      <Callout variant="lecture" title="Where this sits in the course">
        <p>
          This corresponds to the introductory lectures (UAP01). The rest of the course walks down this
          pipeline: first the target machine, then the front end, then code generation, and finally program
          analysis on top of it all.
        </p>
      </Callout>

      <CheckUnderstanding
        question="Why do compilers bother with an intermediate representation like an AST, instead of translating source text straight to machine code?"
        answer={
          <p>
            Separating concerns. The front end deals with the messy details of source syntax and produces a
            clean tree; the back end only has to understand that tree. This makes each part simpler, and lets
            you retarget the same front end to a different machine (or reuse analyses) by swapping the back
            end.
          </p>
        }
      />
    </div>
  );
}
