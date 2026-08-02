// Tripla Lexer - Tokenizes Tripla source code

import { Token, TokenType, RESERVED_WORDS } from './tokens';

export class LexerError extends Error {
  constructor(message: string, public line: number, public column: number) {
    super(`Lexer Error at line ${line}, column ${column}: ${message}`);
    this.name = 'LexerError';
  }
}

export class Lexer {
  private input: string;
  private pos: number = 0;
  private line: number = 1;
  private column: number = 1;
  
  constructor(input: string) {
    this.input = input;
  }
  
  private peek(offset: number = 0): string {
    return this.input[this.pos + offset] || '';
  }
  
  private advance(): string {
    const char = this.input[this.pos];
    this.pos++;
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }
  
  private skipWhitespace(): void {
    while (this.pos < this.input.length) {
      const char = this.peek();
      if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        this.advance();
      } else {
        break;
      }
    }
  }
  
  private skipComment(): boolean {
    if (this.peek() === '/' && this.peek(1) === '/') {
      // Single-line comment
      while (this.pos < this.input.length && this.peek() !== '\n') {
        this.advance();
      }
      return true;
    }
    
    if (this.peek() === '/' && this.peek(1) === '*') {
      // Multi-line comment
      this.advance(); // /
      this.advance(); // *
      while (this.pos < this.input.length) {
        if (this.peek() === '*' && this.peek(1) === '/') {
          this.advance(); // *
          this.advance(); // /
          break;
        }
        this.advance();
      }
      return true;
    }
    
    return false;
  }
  
  private readNumber(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';
    
    while (this.pos < this.input.length && /[0-9]/.test(this.peek())) {
      value += this.advance();
    }
    
    return {
      type: TokenType.CONST,
      value: parseInt(value, 10),
      line: startLine,
      column: startColumn,
    };
  }
  
  private readIdentifier(): Token {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';
    
    while (this.pos < this.input.length && /[A-Za-z0-9_]/.test(this.peek())) {
      value += this.advance();
    }
    
    const tokenType = RESERVED_WORDS[value.toLowerCase()] || TokenType.ID;
    
    return {
      type: tokenType,
      value: tokenType === TokenType.ID ? value : value.toLowerCase(),
      line: startLine,
      column: startColumn,
    };
  }
  
  public tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.pos < this.input.length) {
      this.skipWhitespace();
      if (this.skipComment()) continue;
      if (this.pos >= this.input.length) break;
      
      const startLine = this.line;
      const startColumn = this.column;
      const char = this.peek();
      
      // Numbers
      if (/[0-9]/.test(char)) {
        tokens.push(this.readNumber());
        continue;
      }
      
      // Identifiers and keywords
      if (/[A-Za-z_]/.test(char)) {
        tokens.push(this.readIdentifier());
        continue;
      }
      
      // Operators and delimiters
      switch (char) {
        case '+':
          this.advance();
          tokens.push({ type: TokenType.ADD, value: '+', line: startLine, column: startColumn });
          break;
        case '-':
          this.advance();
          tokens.push({ type: TokenType.SUB, value: '-', line: startLine, column: startColumn });
          break;
        case '*':
          this.advance();
          tokens.push({ type: TokenType.MUL, value: '*', line: startLine, column: startColumn });
          break;
        case '/':
          this.advance();
          tokens.push({ type: TokenType.DIV, value: '/', line: startLine, column: startColumn });
          break;
        case '>':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            tokens.push({ type: TokenType.GTE, value: '>=', line: startLine, column: startColumn });
          } else {
            tokens.push({ type: TokenType.GT, value: '>', line: startLine, column: startColumn });
          }
          break;
        case '<':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            tokens.push({ type: TokenType.LTE, value: '<=', line: startLine, column: startColumn });
          } else {
            tokens.push({ type: TokenType.LT, value: '<', line: startLine, column: startColumn });
          }
          break;
        case '=':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            tokens.push({ type: TokenType.EQ, value: '==', line: startLine, column: startColumn });
          } else {
            tokens.push({ type: TokenType.ASSIGN, value: '=', line: startLine, column: startColumn });
          }
          break;
        case '!':
          this.advance();
          if (this.peek() === '=') {
            this.advance();
            tokens.push({ type: TokenType.NEQ, value: '!=', line: startLine, column: startColumn });
          } else {
            throw new LexerError(`Unexpected character '!'`, startLine, startColumn);
          }
          break;
        case '&':
          this.advance();
          if (this.peek() === '&') {
            this.advance();
            tokens.push({ type: TokenType.AND, value: '&&', line: startLine, column: startColumn });
          } else {
            throw new LexerError(`Unexpected character '&'`, startLine, startColumn);
          }
          break;
        case '|':
          this.advance();
          if (this.peek() === '|') {
            this.advance();
            tokens.push({ type: TokenType.OR, value: '||', line: startLine, column: startColumn });
          } else {
            throw new LexerError(`Unexpected character '|'`, startLine, startColumn);
          }
          break;
        case '{':
          this.advance();
          tokens.push({ type: TokenType.LB, value: '{', line: startLine, column: startColumn });
          break;
        case '}':
          this.advance();
          tokens.push({ type: TokenType.RB, value: '}', line: startLine, column: startColumn });
          break;
        case '(':
          this.advance();
          tokens.push({ type: TokenType.LP, value: '(', line: startLine, column: startColumn });
          break;
        case ')':
          this.advance();
          tokens.push({ type: TokenType.RP, value: ')', line: startLine, column: startColumn });
          break;
        case ',':
          this.advance();
          tokens.push({ type: TokenType.COMMA, value: ',', line: startLine, column: startColumn });
          break;
        case ';':
          this.advance();
          tokens.push({ type: TokenType.SEMICOLON, value: ';', line: startLine, column: startColumn });
          break;
        default:
          throw new LexerError(`Unexpected character '${char}'`, startLine, startColumn);
      }
    }
    
    tokens.push({ type: TokenType.EOF, value: '', line: this.line, column: this.column });
    return tokens;
  }
}
