// Tripla Compiler - Generates TRAM code from AST

import { 
  ASTNode, 
  LETNode, 
  DECLNode, 
  CALLNode, 
  VARNode, 
  BINOPNode, 
  CONSTNode, 
  BOOLNode, 
  ASSIGNNode, 
  SEQNode, 
  IFNode, 
  WHILENode 
} from './ast';

import { 
  Instruction, 
  Label, 
  instructions as instr,
  attachEntryLabel
} from './instructions';

// Environment: maps variable names to (label/offset, nesting level)
type Env = Map<string, [Label | number, number]>;

export class CompilerError extends Error {
  constructor(message: string) {
    super(`Compiler Error: ${message}`);
    this.name = 'CompilerError';
  }
}

export class Compiler {
  constructor() {
    Label.reset();
  }
  
  public compile(ast: ASTNode): Instruction[] {
    return [...this.generateCode(ast, new Map(), 0), instr.halt()];
  }
  
  private generateCode(node: ASTNode, env: Env, nestingLevel: number): Instruction[] {
    switch (node.type) {
      case 'LET':
        return this.compileLet(node, env, nestingLevel);
      case 'DECL':
        return this.compileDecl(node, env, nestingLevel);
      case 'CALL':
        return this.compileCall(node, env, nestingLevel);
      case 'VAR':
        return this.compileVar(node, env, nestingLevel);
      case 'BINOP':
        return this.compileBinop(node, env, nestingLevel);
      case 'CONST':
        return this.compileConst(node);
      case 'BOOL':
        return this.compileBool(node);
      case 'ASSIGN':
        return this.compileAssign(node, env, nestingLevel);
      case 'SEQ':
        return this.compileSeq(node, env, nestingLevel);
      case 'IF':
        return this.compileIf(node, env, nestingLevel);
      case 'WHILE':
        return this.compileWhile(node, env, nestingLevel);
      default:
        throw new CompilerError(`Unknown node type: ${(node as ASTNode).type}`);
    }
  }
  
  private compileLet(node: LETNode, env: Env, nl: number): Instruction[] {
    const entryLabel = new Label();
    
    // Elaborate declarations to build new environment
    const env2 = this.elaborateDeclarations(node.decls, env, nl);
    
    // Generate code for each declaration
    let declCode: Instruction[] = [];
    for (const decl of node.decls) {
      declCode = [...declCode, ...this.generateCode(decl, env2, nl)];
    }
    
    // Generate code for the body
    const bodyCode = this.generateCode(node.body, env2, nl);
    attachEntryLabel(bodyCode, entryLabel);
    
    return [instr.goto(entryLabel), ...declCode, ...bodyCode];
  }
  
  private elaborateDeclarations(decls: DECLNode[], env: Env, nl: number): Env {
    const env2 = new Map(env);
    for (const decl of decls) {
      env2.set(decl.name, [new Label(), nl]);
    }
    return env2;
  }
  
  private compileDecl(node: DECLNode, env: Env, nl: number): Instruction[] {
    const entry = env.get(node.name);
    if (!entry) {
      throw new CompilerError(`Undeclared function: ${node.name}`);
    }
    const [funLabel] = entry;
    if (!(funLabel instanceof Label)) {
      throw new CompilerError(`Expected label for function: ${node.name}`);
    }
    
    // Build environment with parameters
    const env2 = new Map(env);
    for (let i = 0; i < node.params.length; i++) {
      env2.set(node.params[i].name, [i, nl + 1]);
    }
    
    // Generate body code
    const bodyCode = this.generateCode(node.body, env2, nl + 1);
    attachEntryLabel(bodyCode, funLabel);
    
    return [...bodyCode, instr.ireturn()];
  }
  
  private compileCall(node: CALLNode, env: Env, nl: number): Instruction[] {
    const entry = env.get(node.name);
    if (!entry) {
      throw new CompilerError(`Undeclared function: ${node.name}`);
    }
    const [funLabel, funNl] = entry;
    if (!(funLabel instanceof Label)) {
      throw new CompilerError(`Expected label for function: ${node.name}`);
    }
    
    // Generate code for arguments
    let argsCode: Instruction[] = [];
    for (const arg of node.args) {
      argsCode = [...argsCode, ...this.generateCode(arg, env, nl)];
    }
    
    const staticLinkDepth = nl - funNl;
    return [...argsCode, instr.invoke(node.args.length, funLabel, staticLinkDepth)];
  }
  
  private compileVar(node: VARNode, env: Env, nl: number): Instruction[] {
    const entry = env.get(node.name);
    if (!entry) {
      throw new CompilerError(`Undeclared variable: ${node.name}`);
    }
    const [varLabel, varNl] = entry;
    return [instr.load(varLabel, nl - varNl)];
  }
  
  private compileBinop(node: BINOPNode, env: Env, nl: number): Instruction[] {
    const left = this.generateCode(node.lhs, env, nl);
    const right = this.generateCode(node.rhs, env, nl);
    
    // Simple operations
    const simpleOps: Record<string, () => Instruction> = {
      '+': instr.add,
      '-': instr.sub,
      '/': instr.div,
      '*': instr.mul,
      '>': instr.gt,
      '<': instr.lt,
      '!=': instr.neq,
      '==': instr.eq,
    };
    
    const opFactory = simpleOps[node.op];
    if (opFactory) {
      return [...left, ...right, opFactory()];
    }
    
    // Short-circuit OR
    if (node.op === '||') {
      const lRhs = new Label();
      const lEnd = new Label();
      const rightLabeled = [...right];
      attachEntryLabel(rightLabeled, lRhs);
      
      return [
        ...left,
        instr.ifzero(lRhs),
        instr.const(1),
        instr.goto(lEnd),
        ...rightLabeled,
        instr.nop(),
      ].map((ins, idx, arr) => {
        if (idx === arr.length - 1) {
          (ins as Instruction).assignedLabels.push(lEnd);
        }
        return ins;
      });
    }
    
    // Short-circuit AND
    if (node.op === '&&') {
      const lFalse = new Label();
      const lEnd = new Label();
      
      const constZero = instr.const(0);
      constZero.assignedLabels.push(lFalse);
      
      const nopEnd = instr.nop();
      nopEnd.assignedLabels.push(lEnd);
      
      return [
        ...left,
        instr.ifzero(lFalse),
        instr.const(1),
        ...right,
        instr.mul(),
        instr.goto(lEnd),
        constZero,
        nopEnd,
      ];
    }
    
    // Less than or equal, greater than or equal: a <= b is not (a > b), and
    // a >= b is not (a < b). Negating the strict comparison keeps both operands
    // to a single evaluation — testing "a < b else a == b" instead would run
    // them twice, so a side-effecting operand (a call, an assignment) would
    // happen twice too.
    if (node.op === '<=' || node.op === '>=') {
      const strict = node.op === '<=' ? instr.gt() : instr.lt();
      return [...left, ...right, strict, instr.const(0), instr.eq()];
    }
    
    throw new CompilerError(`Unknown operator: ${node.op}`);
  }
  
  private compileConst(node: CONSTNode): Instruction[] {
    return [instr.const(node.value)];
  }
  
  private compileBool(node: BOOLNode): Instruction[] {
    return [instr.const(node.value ? 1 : 0)];
  }
  
  private compileAssign(node: ASSIGNNode, env: Env, nl: number): Instruction[] {
    const entry = env.get(node.var.name);
    if (!entry) {
      throw new CompilerError(`Undeclared variable: ${node.var.name}`);
    }
    const [varLabel, varNl] = entry;
    const exprCode = this.generateCode(node.expr, env, nl);
    const depth = nl - varNl;
    return [
      ...exprCode, 
      instr.store(varLabel, depth), 
      instr.load(varLabel, depth)
    ];
  }
  
  private compileSeq(node: SEQNode, env: Env, nl: number): Instruction[] {
    const first = this.generateCode(node.first, env, nl);
    const second = this.generateCode(node.second, env, nl);
    return [...first, instr.pop(), ...second];
  }
  
  private compileIf(node: IFNode, env: Env, nl: number): Instruction[] {
    const lElse = new Label();
    const lEnd = new Label();
    
    const condCode = this.generateCode(node.cond, env, nl);
    const thenCode = this.generateCode(node.thenBranch, env, nl);
    const elseCode = this.generateCode(node.elseBranch, env, nl);
    attachEntryLabel(elseCode, lElse);
    
    const nopEnd = instr.nop();
    nopEnd.assignedLabels.push(lEnd);
    
    return [
      ...condCode,
      instr.ifzero(lElse),
      ...thenCode,
      instr.goto(lEnd),
      ...elseCode,
      nopEnd,
    ];
  }
  
  private compileWhile(node: WHILENode, env: Env, nl: number): Instruction[] {
    const l1 = new Label();
    const l2 = new Label();
    const l3 = new Label();
    const l4 = new Label();
    
    const condCode = this.generateCode(node.cond, env, nl);
    const bodyCode = this.generateCode(node.body, env, nl);

    attachEntryLabel(bodyCode, l4);

    // The loop needs a second copy of the condition. Re-generate it instead of
    // cloning: a clone reuses the very same Label objects, so a condition that
    // emits labels of its own (<=, >=, && , ||) would define each label twice.
    // The assembler keeps one address per name, and the pre-test copy's jumps
    // then land inside the loop copy — skipping into the loop's POP, which eats
    // a slot of the caller's frame.
    const condLabeled = this.generateCode(node.cond, env, nl);
    attachEntryLabel(condLabeled, l1);
    
    const constZero = instr.const(0);
    constZero.assignedLabels.push(l3);
    
    const nopEnd = instr.nop();
    nopEnd.assignedLabels.push(l2);
    
    return [
      ...condCode,
      instr.ifzero(l3),
      instr.goto(l4),
      ...condLabeled,
      instr.ifzero(l2),
      instr.pop(),
      ...bodyCode,
      instr.goto(l1),
      constZero,
      nopEnd,
    ];
  }
}
