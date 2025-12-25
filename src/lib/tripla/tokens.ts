// Token types for the Tripla lexer

export enum TokenType {
  // Keywords
  LET = 'LET',
  IN = 'IN',
  WHILE = 'WHILE',
  DO = 'DO',
  IF = 'IF',
  THEN = 'THEN',
  ELSE = 'ELSE',
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  
  // Identifiers and literals
  ID = 'ID',
  CONST = 'CONST',
  
  // Operators
  ADD = 'ADD',      // +
  SUB = 'SUB',      // -
  MUL = 'MUL',      // *
  DIV = 'DIV',      // /
  GT = 'GT',        // >
  LT = 'LT',        // <
  GTE = 'GTE',      // >=
  LTE = 'LTE',      // <=
  AND = 'AND',      // &&
  OR = 'OR',        // ||
  EQ = 'EQ',        // ==
  NEQ = 'NEQ',      // !=
  ASSIGN = 'ASSIGN', // =
  
  // Delimiters
  LB = 'LB',        // {
  RB = 'RB',        // }
  LP = 'LP',        // (
  RP = 'RP',        // )
  COMMA = 'COMMA',  // ,
  SEMICOLON = 'SEMICOLON', // ;
  
  // End of file
  EOF = 'EOF',
}

export interface Token {
  type: TokenType;
  value: string | number;
  line: number;
  column: number;
}

export const RESERVED_WORDS: Record<string, TokenType> = {
  'let': TokenType.LET,
  'in': TokenType.IN,
  'while': TokenType.WHILE,
  'do': TokenType.DO,
  'if': TokenType.IF,
  'then': TokenType.THEN,
  'else': TokenType.ELSE,
  'true': TokenType.TRUE,
  'false': TokenType.FALSE,
};
