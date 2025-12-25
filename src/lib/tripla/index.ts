// Main entry point for the Tripla compiler

import { Lexer, LexerError } from './lexer';
import { Parser, ParserError } from './parser';
import { Compiler, CompilerError } from './compiler';
import { Instruction, Label } from './instructions';
import { ASTNode, astToString } from './ast';

export interface CompileResult {
  success: boolean;
  instructions: Instruction[];
  instructionStrings: { address: number; code: string; label?: string }[];
  ast?: ASTNode;
  error?: string;
}

export function compileTripla(source: string): CompileResult {
  try {
    // Reset label counter for consistent output
    Label.reset();
    
    // Lexical analysis
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    
    // Parsing
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    // Compilation
    const compiler = new Compiler();
    const instructions = compiler.compile(ast);
    
    // Convert to display format
    const instructionStrings = instructions.map((instr, idx) => {
      const labels = instr.assignedLabels.map(l => l.toString()).join(',');
      return {
        address: idx,
        code: instr.toString().replace(/^[^:]*:\s*/, '').replace(/^\s+/, ''),
        label: labels || undefined,
      };
    });
    
    return {
      success: true,
      instructions,
      instructionStrings,
      ast,
    };
  } catch (error) {
    let errorMessage = 'Unknown error';
    
    if (error instanceof LexerError) {
      errorMessage = error.message;
    } else if (error instanceof ParserError) {
      errorMessage = error.message;
    } else if (error instanceof CompilerError) {
      errorMessage = error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      instructions: [],
      instructionStrings: [],
      error: errorMessage,
    };
  }
}

// Re-export useful types
export { LexerError } from './lexer';
export { ParserError } from './parser';
export { CompilerError } from './compiler';
export { astToString } from './ast';
export type { ASTNode } from './ast';
export type { Instruction } from './instructions';
