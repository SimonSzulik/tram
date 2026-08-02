import { Prose, Callout, CodeSample, WorkedExample, CheckUnderstanding, GlossaryTerm, TryInWorkspace } from "@/components/learn";

export default function Chapter08() {
  return (
    <div>
      <Prose>
        <p>
          With a checked AST in hand, the back end turns it into TRAM instructions. The whole translation is a
          single idea applied recursively: <strong>define a function that emits code for each kind of AST
          node</strong>, and let it call itself on the children. In the lecture this is written{" "}
          <code>code(ρ, nl)</code> — generate code in the environment <code>ρ</code> at nesting level{" "}
          <code>nl</code>.
        </p>

        <h2>Expressions: the stack does the work</h2>
        <p>
          Because the TRAM is a stack machine, arithmetic falls out almost for free. To compile{" "}
          <code>a * b</code>, emit the code for <code>a</code>, then the code for <code>b</code>, then a single{" "}
          <code>MUL</code>. Each sub-expression leaves its value on the stack; the operator consumes them.
        </p>
      </Prose>

      <CodeSample
        lang="text"
        title="The translation scheme for a binary operation"
        code={`code(BINOP(op, l, r)) = code(l)      // leaves l's value on the stack
                        code(r)      // leaves r's value on the stack
                        OP           // pops both, pushes the result`}
      />

      <Prose>
        <h2>Variables and the address environment</h2>
        <p>
          A variable name means nothing to the machine — the machine addresses <em>stack slots</em>. The{" "}
          <GlossaryTerm term="address environment" german="Adressumgebung">
            A mapping from each variable name in scope to its storage location: a slot offset plus the nesting
            level at which it was declared.
          </GlossaryTerm>{" "}
          <code>ρ</code> records, for every name in scope, where it lives. Compiling a variable read becomes a{" "}
          <code>LOAD k d</code>, where <code>k</code> is the slot and <code>d</code> is how many static links to
          climb; an assignment becomes <code>STORE k d</code>. The lecture computes these with a helper,{" "}
          <code>elab_def</code>, that walks the declarations and assigns each name a slot.
        </p>

        <h2>Control flow: labels and jumps</h2>
        <p>
          There are no <code>if</code> or <code>while</code> instructions — only conditional and unconditional
          jumps. The generator invents fresh <strong>labels</strong> and stitches them together:
        </p>
      </Prose>

      <CodeSample
        lang="text"
        title="if cond then a else b"
        code={`         code(cond)          // condition value on the stack
         IFZERO Lelse        // if 0, jump to the else branch
         code(a)             // then branch
         GOTO Lend
Lelse:   code(b)             // else branch
Lend:    ...`}
      />

      <WorkedExample
        title="Compiling square(5)"
        steps={[
          {
            label: "Source",
            content: <code className="font-mono">let sq(x) {"{"} x * x {"}"} in sq(5)</code>,
          },
          {
            label: "Declare sq",
            content: "elab_def gives sq a code label and binds its parameter x to slot 0 of sq's frame.",
          },
          {
            label: "Body of sq",
            content: <span className="font-mono text-xs">LOAD 0 0 · LOAD 0 0 · MUL · RETURN</span>,
          },
          {
            label: "The call sq(5)",
            content: <span className="font-mono text-xs">CONST 5 · INVOKE 1 Lsq 0</span>,
          },
          {
            label: "Run it",
            content: "The machine pushes 5, calls sq, loads x twice, multiplies, and returns 25.",
          },
        ]}
      />

      <Callout variant="info" title="Nested functions and static links">
        <p>
          When a function is declared <em>inside</em> another, its body can use the outer function's variables.
          The nesting level <code>nl</code> is what makes this work: if a variable was declared at level 1 and
          used at level 3, the generator emits a static-link depth of <code>d = 3 − 1 = 2</code>, so{" "}
          <code>LOAD</code>/<code>STORE</code> climb two frames to find it. This is the machinery behind
          lexical scoping (Chapter 9).
        </p>
      </Callout>

      <Prose>
        <p>
          Compile any program in the Workspace to see the generated TRAM code in the middle panel, then step
          through it to watch the scheme above execute.
        </p>
      </Prose>

      <TryInWorkspace
        code={`let
  fact(n) {
    if (n == 0) then 1
    else n * fact(n - 1)
  }
in
  fact(5)`}
        label="Compile factorial and watch the code"
      />

      <Callout variant="lecture" title="In the lecture">
        <p>
          This is UAP10 / UAP12 and exercise sheet 4, and Project 3: the <code>code(ρ, nl)</code> scheme,{" "}
          <code>elab_def</code>, label management, and translating expressions, control flow and functions. The
          reference implementation is <code>compiler.py</code>.
        </p>
      </Callout>

      <CheckUnderstanding
        question={
          <span>
            Why does compiling <code>a * b</code> emit the code for <code>a</code> and <code>b</code>{" "}
            <em>before</em> the <code>MUL</code>, rather than after?
          </span>
        }
        answer={
          <p>
            A stack machine consumes operands that are already on the stack. <code>MUL</code> pops the top two
            values, so both operands must be pushed first. Emitting the operator last mirrors how the tree is
            evaluated: children before parent (post-order).
          </p>
        }
      />
    </div>
  );
}
