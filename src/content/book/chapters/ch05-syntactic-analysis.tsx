import { Prose, Callout, AstTree, CodeSample, WorkedExample, CheckUnderstanding, GlossaryTerm } from "@/components/learn";

export default function Chapter05() {
  return (
    <div>
      <Prose>
        <p>
          The parser takes the token stream and answers two questions at once: <em>is this a valid program?</em>{" "}
          and <em>what is its structure?</em> The structure it produces is the{" "}
          <GlossaryTerm term="abstract syntax tree" german="abstrakter Syntaxbaum">
            A tree that captures the essential structure of a program, dropping surface details like
            parentheses and separators.
          </GlossaryTerm>{" "}
          (AST) — the representation every later stage works on.
        </p>

        <h2>Grammars describe structure</h2>
        <p>
          A programming language's syntax is defined by a{" "}
          <GlossaryTerm term="context-free grammar" german="kontextfreie Grammatik">
            A set of rules that say how nonterminals expand into sequences of terminals and other
            nonterminals.
          </GlossaryTerm>{" "}
          (CFG). A grammar is a set of rules of the form <em>nonterminal → sequence of symbols</em>. Here is a
          slice of TRIPLA's grammar for expressions:
        </p>
      </Prose>

      <CodeSample
        lang="text"
        title="A fragment of TRIPLA's grammar"
        code={`E → CONST
  | ID
  | ID ( A )          // function call
  | E + E | E - E | E * E | E / E
  | ( E )
  | IF B THEN E ELSE E
  | LET D IN E

A → E | A , E         // argument list`}
      />

      <Prose>
        <p>
          Applying rules to expand the start symbol until only tokens remain is a <strong>derivation</strong>;
          drawing it as a tree gives a <strong>parse tree</strong>. The AST is the parse tree with the noise
          removed — no parentheses, no separators, just operators and operands.
        </p>
      </Prose>

      <Callout variant="tip" title="See the tree">
        <p>
          Edit the program and watch its AST rebuild. This is the actual TRIPLA parser; a syntax error shows up
          the moment the tokens stop following the grammar.
        </p>
      </Callout>

      <AstTree initial={`let sq(x) { x * x } in sq(5)`} />

      <Prose>
        <h2>Ambiguity and precedence</h2>
        <p>
          The fragment above is <strong>ambiguous</strong>: <code>1 + 2 * 3</code> could parse as{" "}
          <code>(1 + 2) * 3</code> or <code>1 + (2 * 3)</code>. Real parsers resolve this with{" "}
          <strong>precedence</strong> and <strong>associativity</strong> rules so that <code>*</code> binds
          tighter than <code>+</code>. TRIPLA gives multiplication and division higher precedence than addition
          and subtraction, matching ordinary arithmetic.
        </p>

        <h2>Top-down parsing: LL(1)</h2>
        <p>
          One of the simplest parsing strategies is <strong>predictive top-down</strong> parsing, also called{" "}
          <GlossaryTerm term="LL(1)" german="LL(1)-Parser">
            Left-to-right scan, Leftmost derivation, 1 token of lookahead. Chooses each rule by peeking at a
            single next token.
          </GlossaryTerm>
          . At each step it must pick which rule to apply using only the next token. To know that, we compute
          two sets for the grammar:
        </p>
        <ul>
          <li>
            <strong>FIRST(X)</strong> — the tokens that can begin something derived from <code>X</code>.
          </li>
          <li>
            <strong>FOLLOW(X)</strong> — the tokens that can appear immediately after <code>X</code>.
          </li>
        </ul>
        <p>
          From these you build a <strong>parse table</strong> mapping (nonterminal, next token) → rule. Two
          obstacles must be removed first: <strong>left recursion</strong> (a rule like <code>E → E + E</code>{" "}
          would loop forever top-down) and <strong>common prefixes</strong> (which need left factoring).
        </p>
      </Prose>

      <WorkedExample
        title="Why left recursion breaks top-down parsing"
        steps={[
          {
            label: "The rule",
            content: <span><code className="font-mono">E → E + T | T</code> — the first thing E does is try to expand E again…</span>,
          },
          {
            label: "The problem",
            content: "…with no token consumed, so the parser recurses forever without making progress.",
          },
          {
            label: "The fix",
            content: <span>Rewrite it right-recursively: <code className="font-mono">E → T E'</code>, <code className="font-mono">E' → + T E' | ε</code>. Same language, now LL(1)-parseable.</span>,
          },
        ]}
      />

      <Callout variant="lecture" title="In the lecture">
        <p>
          This maps to UAP06–07 and exercise sheet 3: context-free grammars, the LL(<em>k</em>) property,
          FIRST/FOLLOW, building an LL(1) table and tracing the parser. TRIPLA's grammar lives in{" "}
          <code>triplayacc.py</code>.
        </p>
      </Callout>

      <CheckUnderstanding
        question={
          <span>
            Why does the AST for <code>1 + 2 * 3</code> put the <code>+</code> at the root rather than the{" "}
            <code>*</code>?
          </span>
        }
        answer={
          <p>
            Because <code>*</code> binds tighter, <code>2 * 3</code> is grouped first and becomes a subtree.
            The <code>+</code> then combines <code>1</code> with that subtree, so <code>+</code> ends up at the
            root with <code>1</code> and <code>(2 * 3)</code> as its children. The root of an expression tree
            is the operator applied <em>last</em>.
          </p>
        }
      />
    </div>
  );
}
