// TRIPLA grammar reference, transcribed from the course parser (triplayacc.py).
// Four expression-level nonterminals plus argument/parameter/declaration lists.

export interface GrammarRule {
  lhs: string;
  /** Right-hand-side alternatives. */
  rhs: { symbols: string; note?: string }[];
}

export const GRAMMAR: GrammarRule[] = [
  {
    lhs: "E",
    rhs: [
      { symbols: "CONST", note: "integer literal" },
      { symbols: "ID", note: "variable" },
      { symbols: "ID ( A )", note: "function call" },
      { symbols: "E + E  |  E - E  |  E * E  |  E / E", note: "arithmetic" },
      { symbols: "( E )", note: "grouping" },
      { symbols: "ID = E", note: "assignment (yields the value)" },
      { symbols: "E ; E", note: "sequencing" },
      { symbols: "IF B THEN E ELSE E", note: "conditional" },
      { symbols: "WHILE B DO { E }", note: "loop" },
      { symbols: "LET D IN E", note: "declarations then body" },
    ],
  },
  {
    lhs: "A",
    rhs: [
      { symbols: "E", note: "single argument" },
      { symbols: "A , E", note: "more arguments" },
    ],
  },
  {
    lhs: "D",
    rhs: [
      { symbols: "ID ( V ) { E }", note: "one function definition" },
      { symbols: "D ID ( V ) { E }", note: "several, written side by side" },
    ],
  },
  {
    lhs: "V",
    rhs: [
      { symbols: "ID", note: "single parameter" },
      { symbols: "V , V", note: "more parameters" },
    ],
  },
  {
    lhs: "B",
    rhs: [
      { symbols: "TRUE  |  FALSE", note: "boolean literal" },
      { symbols: "( B )", note: "grouping" },
      { symbols: "B && B  |  B || B", note: "boolean combination" },
      { symbols: "E == E  |  E != E", note: "equality of expressions" },
      { symbols: "E < E  |  E > E  |  E <= E  |  E >= E", note: "ordering" },
    ],
  },
];

export const NONTERMINALS: { symbol: string; name: string }[] = [
  { symbol: "E", name: "Expression" },
  { symbol: "A", name: "Argument list" },
  { symbol: "D", name: "Declaration list" },
  { symbol: "V", name: "Parameter list" },
  { symbol: "B", name: "Boolean" },
];
