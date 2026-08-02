// Tripla Parser - Builds AST from tokens using recursive descent

import { Token, TokenType } from './tokens';
import { ASTNode, DECLNode, VARNode, AST } from './ast';

export class ParserError extends Error {
  constructor(message: string, public token: Token) {
    super(`Parser Error at line ${token.line}, column ${token.column}: ${message}`);
    this.name = 'ParserError';
  }
}

export class Parser {
  private tokens: Token[];
  private pos: number = 0;
  
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  
  private current(): Token {
    return this.tokens[this.pos];
  }
  
  private peek(offset: number = 0): Token {
    return this.tokens[this.pos + offset] || this.tokens[this.tokens.length - 1];
  }
  
  private advance(): Token {
    const token = this.current();
    if (token.type !== TokenType.EOF) {
      this.pos++;
    }
    return token;
  }
  
  private expect(type: TokenType, message?: string): Token {
    const token = this.current();
    if (token.type !== type) {
      throw new ParserError(message || `Expected ${type}, got ${token.type}`, token);
    }
    return this.advance();
  }
  
  private match(...types: TokenType[]): boolean {
    return types.includes(this.current().type);
  }
  
  public parse(): ASTNode {
    const ast = this.parseExpression();
    if (this.current().type !== TokenType.EOF) {
      throw new ParserError('Unexpected token after expression', this.current());
    }
    return ast;
  }
  
  // E → let D in E | ID = E | E ; E | if B then E else E | while B do { E } | ...
  private parseExpression(): ASTNode {
    return this.parseSequence();
  }
  
  // Handle sequence: E ; E
  private parseSequence(): ASTNode {
    let left = this.parseAssignment();
    
    while (this.match(TokenType.SEMICOLON)) {
      this.advance();
      const right = this.parseAssignment();
      left = AST.seq(left, right);
    }
    
    return left;
  }
  
  // Handle assignment: ID = E
  private parseAssignment(): ASTNode {
    if (this.match(TokenType.ID) && this.peek(1).type === TokenType.ASSIGN) {
      const name = this.advance().value as string;
      this.advance(); // consume =
      const expr = this.parseAssignment();
      return AST.assign(AST.var(name), expr);
    }
    
    return this.parseOr();
  }
  
  // Handle || operator
  private parseOr(): ASTNode {
    let left = this.parseAnd();
    
    while (this.match(TokenType.OR)) {
      const op = this.advance().value as string;
      const right = this.parseAnd();
      left = AST.binop(op, left, right);
    }
    
    return left;
  }
  
  // Handle && operator
  private parseAnd(): ASTNode {
    let left = this.parseEquality();
    
    while (this.match(TokenType.AND)) {
      const op = this.advance().value as string;
      const right = this.parseEquality();
      left = AST.binop(op, left, right);
    }
    
    return left;
  }
  
  // Handle == and != operators
  private parseEquality(): ASTNode {
    let left = this.parseComparison();
    
    while (this.match(TokenType.EQ, TokenType.NEQ)) {
      const op = this.advance().value as string;
      const right = this.parseComparison();
      left = AST.binop(op, left, right);
    }
    
    return left;
  }
  
  // Handle <, >, <=, >= operators
  private parseComparison(): ASTNode {
    let left = this.parseAdditive();
    
    while (this.match(TokenType.LT, TokenType.GT, TokenType.LTE, TokenType.GTE)) {
      const op = this.advance().value as string;
      const right = this.parseAdditive();
      left = AST.binop(op, left, right);
    }
    
    return left;
  }
  
  // Handle + and - operators
  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative();
    
    while (this.match(TokenType.ADD, TokenType.SUB)) {
      const op = this.advance().value as string;
      const right = this.parseMultiplicative();
      left = AST.binop(op, left, right);
    }
    
    return left;
  }
  
  // Handle * and / operators
  private parseMultiplicative(): ASTNode {
    let left = this.parsePrimary();
    
    while (this.match(TokenType.MUL, TokenType.DIV)) {
      const op = this.advance().value as string;
      const right = this.parsePrimary();
      left = AST.binop(op, left, right);
    }
    
    return left;
  }
  
  // Handle primary expressions
  private parsePrimary(): ASTNode {
    const token = this.current();
    
    // LET expression: let D in E
    if (this.match(TokenType.LET)) {
      this.advance();
      const decls = this.parseDeclarations();
      this.expect(TokenType.IN, 'Expected "in" after declarations');
      const body = this.parseExpression();
      return AST.let(decls, body);
    }
    
    // IF expression: if B then E else E
    if (this.match(TokenType.IF)) {
      this.advance();
      const cond = this.parseBoolean();
      this.expect(TokenType.THEN, 'Expected "then" after condition');
      const thenBranch = this.parseExpression();
      this.expect(TokenType.ELSE, 'Expected "else" after then branch');
      const elseBranch = this.parseExpression();
      return AST.if(cond, thenBranch, elseBranch);
    }
    
    // WHILE expression: while B do { E }
    if (this.match(TokenType.WHILE)) {
      this.advance();
      const cond = this.parseBoolean();
      this.expect(TokenType.DO, 'Expected "do" after while condition');
      this.expect(TokenType.LB, 'Expected "{" after do');
      const body = this.parseExpression();
      this.expect(TokenType.RB, 'Expected "}" to close while body');
      return AST.while(cond, body);
    }
    
    // Boolean literals
    if (this.match(TokenType.TRUE)) {
      this.advance();
      return AST.bool(true);
    }
    if (this.match(TokenType.FALSE)) {
      this.advance();
      return AST.bool(false);
    }
    
    // Numeric constant
    if (this.match(TokenType.CONST)) {
      const value = this.advance().value as number;
      return AST.const(value);
    }
    
    // Identifier or function call
    if (this.match(TokenType.ID)) {
      const name = this.advance().value as string;
      
      // Check for function call: ID ( A )
      if (this.match(TokenType.LP)) {
        this.advance();
        const args = this.parseArguments();
        this.expect(TokenType.RP, 'Expected ")" after arguments');
        return AST.call(name, args);
      }
      
      return AST.var(name);
    }
    
    // Parenthesized expression: ( E )
    if (this.match(TokenType.LP)) {
      this.advance();
      const expr = this.parseExpression();
      this.expect(TokenType.RP, 'Expected ")" after expression');
      return expr;
    }
    
    throw new ParserError(`Unexpected token: ${token.type}`, token);
  }
  
  // Parse function declarations: D → ID ( V ) { E } | D D
  private parseDeclarations(): DECLNode[] {
    const decls: DECLNode[] = [];
    
    while (this.match(TokenType.ID)) {
      const name = this.advance().value as string;
      this.expect(TokenType.LP, 'Expected "(" after function name');
      const params = this.parseParameters();
      this.expect(TokenType.RP, 'Expected ")" after parameters');
      this.expect(TokenType.LB, 'Expected "{" for function body');
      const body = this.parseExpression();
      this.expect(TokenType.RB, 'Expected "}" to close function body');
      
      decls.push(AST.decl(name, params, body));
    }
    
    if (decls.length === 0) {
      throw new ParserError('Expected at least one declaration after "let"', this.current());
    }
    
    return decls;
  }
  
  // Parse parameters: V → ID | V , V  (at least one)
  private parseParameters(): VARNode[] {
    if (!this.match(TokenType.ID)) {
      throw new ParserError('Expected at least one parameter', this.current());
    }

    const params: VARNode[] = [AST.var(this.advance().value as string)];

    while (this.match(TokenType.COMMA)) {
      this.advance();
      if (!this.match(TokenType.ID)) {
        throw new ParserError('Expected parameter name after comma', this.current());
      }
      params.push(AST.var(this.advance().value as string));
    }

    return params;
  }

  // Parse arguments: A → E | A , E  (at least one)
  private parseArguments(): ASTNode[] {
    if (this.match(TokenType.RP)) {
      throw new ParserError('Expected at least one argument', this.current());
    }

    const args: ASTNode[] = [this.parseExpression()];

    while (this.match(TokenType.COMMA)) {
      this.advance();
      args.push(this.parseExpression());
    }

    return args;
  }

  // B → TRUE | FALSE | ( B ) | B && B | B || B | E relop E
  private parseBoolean(): ASTNode {
    let left = this.parseBooleanAtom();

    while (this.match(TokenType.AND, TokenType.OR)) {
      const op = this.advance().value as string;
      const right = this.parseBooleanAtom();
      left = AST.binop(op, left, right);
    }

    return left;
  }

  private parseBooleanAtom(): ASTNode {
    if (this.match(TokenType.TRUE)) {
      this.advance();
      return AST.bool(true);
    }
    if (this.match(TokenType.FALSE)) {
      this.advance();
      return AST.bool(false);
    }

    if (this.match(TokenType.LP)) {
      this.advance();
      const inner = this.parseBoolean();
      this.expect(TokenType.RP, 'Expected ")" after boolean expression');
      return inner;
    }

    // Comparison: E relop E (E without boolean/comparison ops — additive level)
    const left = this.parseAdditive();
    if (!this.match(TokenType.EQ, TokenType.NEQ, TokenType.LT, TokenType.GT, TokenType.LTE, TokenType.GTE)) {
      throw new ParserError(
        'Expected a boolean condition (comparison, true/false, or &&/||)',
        this.current()
      );
    }
    const op = this.advance().value as string;
    const right = this.parseAdditive();
    return AST.binop(op, left, right);
  }
}
