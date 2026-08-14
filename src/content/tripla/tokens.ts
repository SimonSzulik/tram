// TRIPLA token reference, transcribed from the course lexer (triplalex.py).

export interface TokenRow {
  token: string;
  lexeme: string;
  note?: string;
}

export interface TokenGroup {
  title: string;
  rows: TokenRow[];
}

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    title: "Keywords",
    rows: [
      { token: "LET", lexeme: "let", note: "begins a declaration block" },
      { token: "IN", lexeme: "in", note: "separates declarations from the body" },
      { token: "IF", lexeme: "if" },
      { token: "THEN", lexeme: "then" },
      { token: "ELSE", lexeme: "else", note: "mandatory — every if has an else" },
      { token: "WHILE", lexeme: "while" },
      { token: "DO", lexeme: "do" },
      { token: "TRUE", lexeme: "true", note: "boolean literal (condition position)" },
      { token: "FALSE", lexeme: "false" },
    ],
  },
  {
    title: "Identifiers & literals",
    rows: [
      { token: "ID", lexeme: "[A-Za-z_][A-Za-z0-9_]*", note: "variable / function names — keywords are lower-case only, so If or Do are valid names" },
      { token: "CONST", lexeme: "[0-9]+", note: "non-negative integer literal; leading zeros are accepted" },
    ],
  },
  {
    title: "Arithmetic operators",
    rows: [
      { token: "ADD", lexeme: "+" },
      { token: "SUB", lexeme: "-" },
      { token: "MUL", lexeme: "*" },
      { token: "DIV", lexeme: "/", note: "integer division" },
    ],
  },
  {
    title: "Comparison operators",
    rows: [
      { token: "EQ", lexeme: "==" },
      { token: "NEQ", lexeme: "!=" },
      { token: "LT", lexeme: "<" },
      { token: "GT", lexeme: ">" },
      { token: "LTE", lexeme: "<=" },
      { token: "GTE", lexeme: ">=" },
    ],
  },
  {
    title: "Boolean operators",
    rows: [
      { token: "AND", lexeme: "&&" },
      { token: "OR", lexeme: "||" },
    ],
  },
  {
    title: "Punctuation",
    rows: [
      { token: "ASSIGN", lexeme: "=", note: "assignment (an expression)" },
      { token: "LP / RP", lexeme: "( )" },
      { token: "LB / RB", lexeme: "{ }", note: "function body / loop body" },
      { token: "COMMA", lexeme: "," },
      { token: "SEMICOLON", lexeme: ";", note: "sequencing" },
    ],
  },
  {
    title: "Ignored",
    rows: [
      { token: "—", lexeme: "/* … */", note: "block comment, discarded" },
      { token: "—", lexeme: "// …", note: "line comment, discarded" },
      { token: "—", lexeme: "space, tab, newline", note: "whitespace, discarded" },
    ],
  },
];

// Operator precedence, lowest to highest binding (from the yacc precedence table).
export const PRECEDENCE: { level: number; ops: string; assoc: string }[] = [
  { level: 1, ops: ") in", assoc: "lowest" },
  { level: 2, ops: "; , identifiers", assoc: "left" },
  { level: 3, ops: "= else while if do let", assoc: "right" },
  { level: 4, ops: "||", assoc: "left" },
  { level: 5, ops: "&&", assoc: "left" },
  { level: 6, ops: "== != < > <= >=", assoc: "left" },
  { level: 7, ops: "+ -", assoc: "left" },
  { level: 8, ops: "* /", assoc: "highest" },
];
