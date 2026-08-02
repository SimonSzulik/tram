// The TRIPLA construct/command wiki. One entry per language construct, with facts
// grounded in the course grammar (triplayacc.py) and code generator (compiler.py).

export type WikiCategory = "Binding" | "Functions" | "Control flow" | "Expressions" | "Operators" | "Values";

export interface WikiEntry {
  id: string;
  name: string;
  category: WikiCategory;
  /** Short searchable synonyms/keywords. */
  keywords: string[];
  syntax: string;
  /** What it does, 1–3 sentences. */
  description: string;
  /** A minimal, runnable TRIPLA program demonstrating it. */
  example: string;
  /** How it lowers to TRAM code (informal). */
  compilesTo: string;
}

export const WIKI: WikiEntry[] = [
  {
    id: "let-in",
    name: "let … in",
    category: "Binding",
    keywords: ["let", "in", "declare", "scope", "block"],
    syntax: "let D in E",
    description:
      "Introduces one or more function definitions D that are visible inside the body expression E (and inside each other). The value of the whole let is the value of E.",
    example: "let double(x) { x + x } in double(21)",
    compilesTo:
      "Each definition in D is assigned a code label by elab_def; the body E is then compiled in an environment that knows those labels and the enclosing variables.",
  },
  {
    id: "function-definition",
    name: "Function definition",
    category: "Functions",
    keywords: ["def", "function", "declare", "params", "parameters"],
    syntax: "name ( params ) { body }",
    description:
      "Defines a function inside a let. Parameters become local variables; the body is an expression whose value is returned. Multiple definitions are written side by side, and definitions may be nested for lexical scoping.",
    example: "let add(a, b) { a + b } in add(2, 3)",
    compilesTo:
      "Parameters are bound to consecutive stack slots in the function's frame; the body is compiled followed by a RETURN.",
  },
  {
    id: "function-call",
    name: "Function call",
    category: "Functions",
    keywords: ["call", "invoke", "apply", "arguments"],
    syntax: "name ( arg1, arg2, … )",
    description:
      "Calls a previously declared function with the given argument expressions. Arguments are evaluated left to right, then control transfers to the function.",
    example: "let sq(x) { x * x } in sq(9)",
    compilesTo:
      "Each argument is compiled (leaving its value on the stack), then INVOKE n p d — n arguments, target label p, and static-link depth d = current level − definition level.",
  },
  {
    id: "if-then-else",
    name: "if / then / else",
    category: "Control flow",
    keywords: ["if", "then", "else", "conditional", "branch"],
    syntax: "if B then E1 else E2",
    description:
      "Evaluates the boolean condition B; if true the value is E1, otherwise E2. The else branch is mandatory — an if is an expression and must always produce a value.",
    example: "let abs(x) { if (x < 0) then 0 - x else x } in abs(0 - 7)",
    compilesTo:
      "code(B); IFZERO Lelse; code(E1); GOTO Lend; Lelse: code(E2); Lend: — a conditional jump around the two branches.",
  },
  {
    id: "while-do",
    name: "while … do",
    category: "Control flow",
    keywords: ["while", "do", "loop", "iterate"],
    syntax: "while B do { E }",
    description:
      "Repeats the body E as long as the boolean condition B holds. Like everything in TRIPLA it is an expression; it is normally used for its side effects on variables.",
    example: "let countdown(n) { while (n > 0) do { n = n - 1 }; n } in countdown(5)",
    compilesTo:
      "Ltest: code(B); IFZERO Lend; code(E); POP; GOTO Ltest; Lend: — test at the top, jump back after the body.",
  },
  {
    id: "assignment",
    name: "Assignment",
    category: "Expressions",
    keywords: ["assign", "=", "set", "mutate", "store"],
    syntax: "name = E",
    description:
      "Stores the value of E into the variable name and yields that value. Because assignment is an expression, it can appear anywhere a value is expected.",
    example: "let f(x) { x = x + 1 } in f(41)",
    compilesTo: "code(E); STORE k d (write the slot); then LOAD k d so the assignment still yields the value.",
  },
  {
    id: "sequence",
    name: "Sequencing ( ; )",
    category: "Expressions",
    keywords: [";", "sequence", "then", "statement"],
    syntax: "E1 ; E2",
    description:
      "Evaluates E1, discards its result, then evaluates E2 and yields its value. Used to run side-effecting expressions in order.",
    example: "let f(x) { x = x + 1; x = x * 2; x } in f(10)",
    compilesTo: "code(E1); POP; code(E2) — the first result is dropped with POP before the second runs.",
  },
  {
    id: "arithmetic",
    name: "Arithmetic operators",
    category: "Operators",
    keywords: ["+", "-", "*", "/", "add", "subtract", "multiply", "divide", "arithmetic"],
    syntax: "E + E   E - E   E * E   E / E",
    description:
      "The four integer operations. Multiplication and division bind tighter than addition and subtraction; division truncates toward zero.",
    example: "let e(x) { 2 + 3 * 4 } in e(0)",
    compilesTo: "code(left); code(right); then ADD / SUB / MUL / DIV, which pops both operands and pushes the result.",
  },
  {
    id: "comparison",
    name: "Comparison operators",
    category: "Operators",
    keywords: ["==", "!=", "<", ">", "<=", ">=", "compare", "equals"],
    syntax: "E == E   E != E   E < E   E > E   E <= E   E >= E",
    description:
      "Compare two expressions, producing a boolean usable in a condition. Internally the result is 1 (true) or 0 (false).",
    example: "let f(x) { if (x == 42) then 1 else 0 } in f(42)",
    compilesTo:
      "LT/GT/EQ/NEQ map to single instructions; <= and >= are synthesized from the others (e.g. a <= b as not (a > b)).",
  },
  {
    id: "boolean",
    name: "Boolean operators",
    category: "Operators",
    keywords: ["&&", "||", "and", "or", "boolean", "logic"],
    syntax: "B && B   B || B   true   false",
    description:
      "Combine conditions. && and || short-circuit: the right operand is only evaluated when it can still affect the result.",
    example: "let f(x) { if (x > 0 && x < 10) then 1 else 0 } in f(5)",
    compilesTo:
      "Short-circuit && and || are compiled with conditional jumps rather than a single instruction, so the right side is skipped when possible.",
  },
  {
    id: "variable",
    name: "Variable reference",
    category: "Values",
    keywords: ["var", "variable", "identifier", "read", "load"],
    syntax: "name",
    description:
      "Reads the current value of a parameter or variable. The name is resolved through the lexical scope to a specific stack slot.",
    example: "let f(x) { x } in f(7)",
    compilesTo: "LOAD k d — read slot k, climbing d static links to reach the frame where the variable lives.",
  },
  {
    id: "constant",
    name: "Integer constant",
    category: "Values",
    keywords: ["const", "number", "integer", "literal"],
    syntax: "0 | [1-9][0-9]*",
    description: "A non-negative integer literal. It is the simplest expression and the base case of code generation.",
    example: "let f(x) { 123 } in f(0)",
    compilesTo: "CONST k — pushes the literal k onto the stack.",
  },
];

export const WIKI_CATEGORIES: WikiCategory[] = [
  "Binding",
  "Functions",
  "Control flow",
  "Expressions",
  "Operators",
  "Values",
];
