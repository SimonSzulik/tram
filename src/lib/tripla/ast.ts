// Abstract Syntax Tree nodes for Tripla

export type ASTNode = 
  | LETNode
  | DECLNode
  | CALLNode
  | VARNode
  | BINOPNode
  | CONSTNode
  | BOOLNode
  | ASSIGNNode
  | SEQNode
  | IFNode
  | WHILENode;

export interface LETNode {
  type: 'LET';
  decls: DECLNode[];
  body: ASTNode;
}

export interface DECLNode {
  type: 'DECL';
  name: string;
  params: VARNode[];
  body: ASTNode;
}

export interface CALLNode {
  type: 'CALL';
  name: string;
  args: ASTNode[];
}

export interface VARNode {
  type: 'VAR';
  name: string;
}

export interface BINOPNode {
  type: 'BINOP';
  op: string;
  lhs: ASTNode;
  rhs: ASTNode;
}

export interface CONSTNode {
  type: 'CONST';
  value: number;
}

export interface BOOLNode {
  type: 'BOOL';
  value: boolean;
}

export interface ASSIGNNode {
  type: 'ASSIGN';
  var: VARNode;
  expr: ASTNode;
}

export interface SEQNode {
  type: 'SEQ';
  first: ASTNode;
  second: ASTNode;
}

export interface IFNode {
  type: 'IF';
  cond: ASTNode;
  thenBranch: ASTNode;
  elseBranch: ASTNode;
}

export interface WHILENode {
  type: 'WHILE';
  cond: ASTNode;
  body: ASTNode;
}

// Helper functions to create AST nodes
export const AST = {
  let: (decls: DECLNode[], body: ASTNode): LETNode => ({ type: 'LET', decls, body }),
  decl: (name: string, params: VARNode[], body: ASTNode): DECLNode => ({ type: 'DECL', name, params, body }),
  call: (name: string, args: ASTNode[]): CALLNode => ({ type: 'CALL', name, args }),
  var: (name: string): VARNode => ({ type: 'VAR', name }),
  binop: (op: string, lhs: ASTNode, rhs: ASTNode): BINOPNode => ({ type: 'BINOP', op, lhs, rhs }),
  const: (value: number): CONSTNode => ({ type: 'CONST', value }),
  bool: (value: boolean): BOOLNode => ({ type: 'BOOL', value }),
  assign: (varNode: VARNode, expr: ASTNode): ASSIGNNode => ({ type: 'ASSIGN', var: varNode, expr }),
  seq: (first: ASTNode, second: ASTNode): SEQNode => ({ type: 'SEQ', first, second }),
  if: (cond: ASTNode, thenBranch: ASTNode, elseBranch: ASTNode): IFNode => ({ type: 'IF', cond, thenBranch, elseBranch }),
  while: (cond: ASTNode, body: ASTNode): WHILENode => ({ type: 'WHILE', cond, body }),
};

// Pretty print AST
export function astToString(node: ASTNode): string {
  switch (node.type) {
    case 'LET':
      const declsStr = node.decls.map(d => astToString(d)).join(', ');
      return `let ${declsStr} in ${astToString(node.body)}`;
    case 'DECL':
      const paramsStr = node.params.map(p => p.name).join(', ');
      return `${node.name}(${paramsStr}) { ${astToString(node.body)} }`;
    case 'CALL':
      const argsStr = node.args.map(a => astToString(a)).join(', ');
      return `${node.name}(${argsStr})`;
    case 'VAR':
      return node.name;
    case 'BINOP':
      return `(${astToString(node.lhs)} ${node.op} ${astToString(node.rhs)})`;
    case 'CONST':
      return String(node.value);
    case 'BOOL':
      return String(node.value);
    case 'ASSIGN':
      return `${node.var.name} = ${astToString(node.expr)}`;
    case 'SEQ':
      return `${astToString(node.first)}; ${astToString(node.second)}`;
    case 'IF':
      return `if ${astToString(node.cond)} then ${astToString(node.thenBranch)} else ${astToString(node.elseBranch)}`;
    case 'WHILE':
      return `while ${astToString(node.cond)} do { ${astToString(node.body)} }`;
  }
}
