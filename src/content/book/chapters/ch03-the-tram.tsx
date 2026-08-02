import { Prose, Callout, CodeSample, WorkedExample, CheckUnderstanding, TryInWorkspace } from "@/components/learn";
import { INSTRUCTION_INFO, REGISTER_INFO } from "@/lib/tripla/instructionInfo";

const GROUPS: { title: string; names: string[] }[] = [
  { title: "Stack & values", names: ["CONST", "LOAD", "STORE", "POP"] },
  { title: "Arithmetic", names: ["ADD", "SUB", "MUL", "DIV"] },
  { title: "Comparison", names: ["LT", "GT", "EQ", "NEQ"] },
  { title: "Control flow", names: ["IFZERO", "GOTO", "NOP", "HALT"] },
  { title: "Functions", names: ["INVOKE", "RETURN"] },
];

export default function Chapter03() {
  return (
    <div>
      <Prose>
        <p>
          Before we can generate code, we need to know what we are generating code <em>for</em>. The{" "}
          <strong>TRAM</strong> (Trier Abstract Machine) is a <strong>stack machine</strong>: instead of named
          registers holding operands, computation flows through a single stack. To add two numbers you push
          both, then execute <code>ADD</code>, which pops them and pushes the sum. This design makes code
          generation from an expression tree remarkably direct.
        </p>

        <h2>Machine state</h2>
        <p>The machine's entire state is a stack plus four registers:</p>
      </Prose>

      <div className="my-6 grid gap-3 sm:grid-cols-2">
        {Object.values(REGISTER_INFO).map((r) => (
          <div key={r.name} className="rounded-lg border border-border bg-card/60 p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-bold text-primary">{r.name}</span>
              <span className="text-xs text-muted-foreground">{r.full}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
          </div>
        ))}
      </div>

      <Prose>
        <h2>The instruction set</h2>
        <p>
          The TRAM has just 18 instructions. Every TRIPLA program, however complex, compiles down to sequences
          of these. Hover any instruction in the Workspace's machine-code panel to see the same descriptions.
        </p>
      </Prose>

      <div className="my-6 space-y-5">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <h4 className="mb-2 text-sm font-semibold text-foreground">{g.title}</h4>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {g.names.map((n, i) => {
                    const info = INSTRUCTION_INFO[n];
                    return (
                      <tr key={n} className={i % 2 ? "bg-muted/30" : ""}>
                        <td className="whitespace-nowrap px-3 py-2 align-top font-mono font-semibold text-primary">
                          {info.name}
                          {info.args && <span className="ml-1 text-muted-foreground">{info.args}</span>}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{info.summary}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <Prose>
        <h2>A tiny program</h2>
        <p>
          Here is the arithmetic expression <code>3 * 4 + 5</code> compiled to TRAM code. Read it as
          instructions to a stack: push, push, multiply, push, add.
        </p>
      </Prose>

      <CodeSample
        lang="tram"
        title="3 * 4 + 5"
        code={`CONST 3
CONST 4
MUL
CONST 5
ADD
HALT`}
      />

      <WorkedExample
        title="How the stack evolves"
        steps={[
          { label: "CONST 3", content: <span className="font-mono">stack: [3]</span> },
          { label: "CONST 4", content: <span className="font-mono">stack: [3, 4]</span> },
          { label: "MUL", content: <span className="font-mono">pops 3 and 4, pushes 12 → [12]</span> },
          { label: "CONST 5", content: <span className="font-mono">stack: [12, 5]</span> },
          { label: "ADD", content: <span className="font-mono">pops 12 and 5, pushes 17 → [17]</span> },
          { label: "HALT", content: <span className="font-mono">result 17 is left on top</span> },
        ]}
      />

      <Callout variant="info" title="Functions and static links">
        <p>
          Calls are where a stack machine earns its keep. <code>INVOKE n p d</code> saves the return address
          and the caller's registers, then jumps to the function at address <code>p</code>. The extra argument{" "}
          <code>d</code> — the <em>static-link depth</em> — records how many enclosing scopes to climb to reach
          the variables of a nested function. This is exactly how TRIPLA implements lexical scoping, and we
          build it in Chapters 8 and 9.
        </p>
      </Callout>

      <Prose>
        <p>
          You do not have to take any of this on faith. Compile a TRIPLA program in the Workspace, then use{" "}
          <strong>Step</strong> to watch each instruction move the stack and registers — or <strong>Run to
          End</strong> to jump straight to the result.
        </p>
      </Prose>

      <TryInWorkspace code={`let sq(x) { x * x } in sq(5)`} label="Open square(5) in the Workspace" />

      <CheckUnderstanding
        question={
          <span>
            On a stack machine, what does the sequence <code>CONST 10 · CONST 3 · SUB</code> leave on the
            stack?
          </span>
        }
        answer={
          <p>
            <span className="font-mono">7</span>. <code>SUB</code> pops the two operands and pushes{" "}
            <span className="font-mono">a − b</span> where <span className="font-mono">a</span> was pushed
            first — here <span className="font-mono">10 − 3</span>.
          </p>
        }
      />
    </div>
  );
}
