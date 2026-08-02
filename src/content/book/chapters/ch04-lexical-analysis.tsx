import { Prose, Callout, LiveTokens, CodeSample, WorkedExample, CheckUnderstanding, GlossaryTerm } from "@/components/learn";

export default function Chapter04() {
  return (
    <div>
      <Prose>
        <p>
          The first job of the front end is to stop thinking about individual characters. Source code arrives
          as a flat stream of characters — <code>l</code>, <code>e</code>, <code>t</code>, space,{" "}
          <code>s</code>, <code>q</code>… — but the parser wants to reason about meaningful units:{" "}
          <em>the keyword <code>let</code></em>, <em>the identifier <code>sq</code></em>, <em>a number</em>.
          Turning characters into those units is <strong>lexical analysis</strong>, done by a{" "}
          <GlossaryTerm term="lexer" german="Lexer / Scanner">
            The component that reads characters and produces a stream of tokens, discarding whitespace and
            comments.
          </GlossaryTerm>
          .
        </p>

        <h2>Tokens</h2>
        <p>
          A <strong>token</strong> is a category plus the text that matched it. TRIPLA's tokens fall into a few
          families:
        </p>
        <ul>
          <li>
            <strong>Keywords</strong>: <code>let in if then else while do true false</code>
          </li>
          <li>
            <strong>Identifiers</strong> (<code>ID</code>): a letter or <code>_</code> followed by letters,
            digits or <code>_</code>
          </li>
          <li>
            <strong>Numbers</strong> (<code>CONST</code>): <code>0</code>, or a non-zero digit then more digits
          </li>
          <li>
            <strong>Operators & punctuation</strong>: <code>+ - * / == != &lt; &gt; &lt;= &gt;= &amp;&amp; || = ( ) {"{ }"} , ;</code>
          </li>
        </ul>
        <p>
          Whitespace and comments (<code>/* … */</code> and <code>// …</code>) are recognised and then thrown
          away — they matter for separating tokens but carry no meaning of their own.
        </p>
      </Prose>

      <Callout variant="tip" title="Try it live">
        <p>
          Edit the source below and watch the token stream update. This is the <em>real</em> TRIPLA lexer
          running in your browser — the same one the Workspace uses.
        </p>
      </Callout>

      <LiveTokens initial={`let sq(x) { x * x } in sq(5)`} />

      <Prose>
        <h2>How a lexer decides: regular languages</h2>
        <p>
          Each token family is described by a <strong>regular expression</strong>. An identifier, for example,
          is <code>[A-Za-z_][A-Za-z0-9_]*</code>. Regular expressions are exactly powerful enough to describe
          tokens — and crucially, every regular expression can be turned into a{" "}
          <GlossaryTerm term="finite automaton" german="endlicher Automat">
            A machine with a finite set of states that reads input one symbol at a time; it accepts an input if
            it ends in an accepting state.
          </GlossaryTerm>{" "}
          that recognises it by reading one character at a time.
        </p>
        <p>The standard construction goes in three moves:</p>
      </Prose>

      <WorkedExample
        title="From a pattern to a scanner"
        steps={[
          {
            label: "Regular expression",
            content: <span>Describe the token family, e.g. an identifier as <code className="font-mono">[A-Za-z_][A-Za-z0-9_]*</code>.</span>,
          },
          {
            label: "NFA",
            content: "Thompson's construction turns the regex into a nondeterministic finite automaton — small, but it may have several possible moves per character.",
          },
          {
            label: "DFA",
            content: "The subset construction converts the NFA into a deterministic automaton: exactly one next state per character. That is what a fast scanner actually runs.",
          },
          {
            label: "Minimise",
            content: "Merge equivalent states so the DFA is as small as possible. Now scanning is a simple table lookup per character.",
          },
        ]}
      />

      <Prose>
        <h2>Maximal munch</h2>
        <p>
          When several patterns could match, real scanners take the <strong>longest</strong> match — the{" "}
          <em>maximal munch</em> rule. Reading <code>&gt;=</code>, the scanner does not stop after{" "}
          <code>&gt;</code>; it keeps going and produces a single <code>GTE</code> token. Keyword-vs-identifier
          conflicts are resolved the other way: scan a whole word, <em>then</em> check whether it happens to be
          a reserved word.
        </p>
      </Prose>

      <CodeSample
        lang="text"
        title="Ambiguity resolved by longest match"
        code={`x >= 10    →  ID(x)  GTE   CONST(10)     // not GT then ASSIGN
letx       →  ID(letx)                    // one identifier, not 'let' + 'x'`}
      />

      <Callout variant="lecture" title="In the lecture">
        <p>
          This is UAP05 and exercise sheet 2, where you prove languages regular and hand-build the
          NFA → minimal-DFA pipeline. The TRIPLA lexer you just used lives in <code>triplalex.py</code> in the
          course project.
        </p>
      </Callout>

      <CheckUnderstanding
        question={
          <span>
            How many tokens does the lexer produce for <code>if(a==0)</code> (ignoring the end-of-file marker)?
          </span>
        }
        answer={
          <p>
            Six: <span className="font-mono">IF · LP · ID(a) · EQ · CONST(0) · RP</span>. Note that{" "}
            <code>==</code> is a single <code>EQ</code> token thanks to maximal munch, not two <code>=</code>{" "}
            signs.
          </p>
        }
      />
    </div>
  );
}
