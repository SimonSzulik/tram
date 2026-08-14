// Control-flow-graph construction for TRIPLA — a faithful TypeScript port of the
// lecture's project_04 `cfa(pred, end)` AST walk (cfg/{node,build,cfg}.py).
//
// The builder produces a fine-grained CFG (every sub-expression is its own node),
// splices out the structural placeholder ("empty") nodes, keeps only nodes
// reachable from the global START, and labels diamond out-edges T/F by the
// creation order of their targets.

import type { ASTNode, BINOPNode } from "./ast";

export type CfgKind = "start" | "end" | "diamond" | "call" | "return" | "stmt";

export interface CfgNode {
  id: number;
  kind: CfgKind;
  label: string;
}

export interface CfgEdge {
  from: number;
  to: number;
  label?: "T" | "F";
  back?: boolean;
}

export interface CfgGraph {
  nodes: CfgNode[];
  edges: CfgEdge[];
}

/* ------------------------------------------------------------ label helpers */

// Matches the Python AST __str__: nested BINOPs are parenthesised with no spaces.
function nodeStr(ast: ASTNode): string {
  switch (ast.type) {
    case "CONST":
      return String(ast.value);
    case "VAR":
      return ast.name;
    case "BOOL":
      return ast.value ? "True" : "False";
    case "BINOP":
      return `(${nodeStr(ast.lhs)}${ast.op}${nodeStr(ast.rhs)})`;
    case "ASSIGN":
      return `${ast.var.name}=${nodeStr(ast.expr)}`;
    case "SEQ":
      return `${nodeStr(ast.first)};${nodeStr(ast.second)}`;
    case "CALL":
      return `${ast.name}(${ast.args.map(nodeStr).join(",")})`;
    case "IF":
      return `if ${nodeStr(ast.cond)} then { ${nodeStr(ast.thenBranch)} } else { ${nodeStr(ast.elseBranch)} }`;
    case "WHILE":
      return `while ${nodeStr(ast.cond)} do { ${nodeStr(ast.body)} }`;
    case "LET":
      return `let {…} in ${nodeStr(ast.body)}`;
    case "DECL":
      return `${ast.name}(${ast.params.map((p) => p.name).join(",")})`;
  }
}

// The spaced label used on an emitted binary-operation box.
function binopLabel(op: BINOPNode): string {
  return `${nodeStr(op.lhs)} ${op.op} ${nodeStr(op.rhs)}`;
}

/* ------------------------------------------------------------- node model */

interface N {
  id: number;
  kind: CfgKind;
  label: string | null;
  ast: ASTNode | null;
  children: Set<N>;
  parents: Set<N>;
}

const isEmpty = (n: N): boolean =>
  (n.label === null || n.label === "None") && n.ast === null;

function displayLabel(n: N): string {
  // A diamond carries the placeholder "<?>" as its label and the condition as
  // its AST — show the condition, otherwise every decision reads "<?>".
  if (n.kind === "diamond" && n.ast) return nodeStr(n.ast);
  if (n.label !== null && n.label !== "None") return n.label;
  if (n.ast) return nodeStr(n.ast);
  return "";
}

const byId = (a: N, b: N) => a.id - b.id;

/* --------------------------------------------------------------- builder */

class CfgBuilder {
  private nextId = 0;
  private registry = new Map<string, { start: N; end: N }>();
  private activeFunction: string | null = null;

  private node(kind: CfgKind, ast: ASTNode | null = null, label: string | null = null): N {
    return { id: this.nextId++, kind, label, ast, children: new Set(), parents: new Set() };
  }

  private link(from: N, to: N) {
    from.children.add(to);
    to.parents.add(from);
  }

  build(ast: ASTNode): { start: N } {
    const start = this.node("start", null, "START");
    const end = this.node("end", null, "END");
    const final = this.cfa(ast, start, end);
    if (final) this.link(final, end);
    return { start };
  }

  // Returns the exit node of the built sub-graph, or null.
  private cfa(ast: ASTNode, pred: N, end: N | null = null): N | null {
    switch (ast.type) {
      case "CONST":
      case "VAR":
      case "BOOL": {
        const n = this.node("stmt", ast);
        this.link(pred, n);
        if (end) this.link(n, end);
        return n;
      }
      case "BINOP": {
        const left = this.cfa(ast.lhs, pred);
        if (!left) return null;
        const right = this.cfa(ast.rhs, left);
        if (!right) return null;
        const op = this.node("stmt", ast, binopLabel(ast));
        this.link(right, op);
        if (end) this.link(op, end);
        return op;
      }
      case "ASSIGN": {
        const expr = this.cfa(ast.expr, pred);
        if (!expr) return null;
        const a = this.node("stmt", ast);
        this.link(expr, a);
        if (end) this.link(a, end);
        return a;
      }
      case "SEQ": {
        const first = this.cfa(ast.first, pred);
        if (!first) return null;
        return this.cfa(ast.second, first, end);
      }
      case "IF": {
        const cond = this.cfa(ast.cond, pred, null);
        if (!cond) return null;
        const d = this.node("diamond", ast.cond, "<?>");
        this.link(cond, d);
        const trueEntry = this.node("stmt");
        this.link(d, trueEntry);
        const falseEntry = this.node("stmt");
        this.link(d, falseEntry);
        const merge = this.node("stmt");
        if (end) this.link(merge, end);
        this.cfa(ast.thenBranch, trueEntry, merge);
        this.cfa(ast.elseBranch, falseEntry, merge);
        return merge;
      }
      case "WHILE": {
        let condNode: N;
        let backTarget: N;
        if (ast.cond.type === "BINOP") {
          const left = this.cfa(ast.cond.lhs, pred);
          if (!left) return null;
          const right = this.cfa(ast.cond.rhs, left);
          if (!right) return null;
          const comp = this.node("stmt", ast.cond, binopLabel(ast.cond));
          this.link(right, comp);
          condNode = comp;
          backTarget = left;
        } else {
          const c = this.cfa(ast.cond, pred);
          if (!c) return null;
          condNode = c;
          backTarget = pred;
        }
        const d = this.node("diamond", ast.cond, "<?>");
        this.link(condNode, d);
        const bodyStart = this.node("stmt");
        this.link(d, bodyStart);
        const bodyEnd = this.cfa(ast.body, bodyStart);
        if (bodyEnd) this.link(bodyEnd, backTarget);
        const exit = this.node("stmt");
        this.link(d, exit);
        if (end) this.link(exit, end);
        return exit;
      }
      case "CALL": {
        let current = pred;
        for (const arg of ast.args) {
          const next = this.cfa(arg, current);
          if (!next) return null;
          current = next;
        }
        const call = this.node("call", ast, `CALL ${ast.name}`);
        this.link(current, call);
        const cont = this.node("stmt");
        if (end) this.link(cont, end);
        const ret = this.node("return", ast, `RET ${ast.name}`);
        const reg = this.registry.get(ast.name);
        if (!reg) {
          throw new Error(`Call to undefined function '${ast.name}'`);
        }
        this.link(reg.end, ret);
        this.link(call, reg.start);
        this.link(ret, cont);
        this.link(call, ret);
        return cont;
      }
      case "DECL": {
        let reg = this.registry.get(ast.name);
        if (!reg) {
          reg = this.makeFunctionEndpoints(ast.name, ast.params.map((p) => p.name));
        }
        const saved = this.activeFunction;
        this.activeFunction = ast.name;
        const bodyResult = this.cfa(ast.body, reg.start, reg.end);
        if (bodyResult) this.link(bodyResult, reg.end);
        this.activeFunction = saved;
        return pred; // a declaration does not extend the main flow
      }
      case "LET": {
        // Pass 1: pre-register every function so forward/mutual refs resolve.
        for (const decl of ast.decls) {
          if (!this.registry.has(decl.name)) {
            this.makeFunctionEndpoints(decl.name, decl.params.map((p) => p.name));
          }
        }
        const entry = this.node("stmt", null, "None"); // empty marker
        this.link(pred, entry);
        let cur: N | null = entry;
        for (const decl of ast.decls) {
          cur = this.cfa(decl, cur, null);
          if (!cur) return null;
        }
        const result = this.cfa(ast.body, cur, end);
        const exit = this.node("stmt", null, "None"); // empty marker
        if (result) this.link(result, exit);
        if (end) this.link(exit, end);
        return exit;
      }
    }
  }

  private makeFunctionEndpoints(name: string, params: string[]) {
    const sig = `${name}(${params.join(", ")})`;
    const start = this.node("start", null, `START ${sig}`);
    const end = this.node("end", null, `END ${sig}`);
    const reg = { start, end };
    this.registry.set(name, reg);
    return reg;
  }
}

/* ----------------------------------------------- cleanup + reachability */

function reachable(start: N): Set<N> {
  const seen = new Set<N>();
  const stack = [start];
  while (stack.length) {
    const n = stack.pop()!;
    if (seen.has(n)) continue;
    seen.add(n);
    for (const c of n.children) stack.push(c);
  }
  return seen;
}

// First non-empty node reachable by following children in ascending-id order.
function firstNonEmpty(n: N, visited = new Set<N>()): N | null {
  if (!isEmpty(n)) return n;
  if (visited.has(n)) return null;
  visited.add(n);
  for (const c of [...n.children].sort(byId)) {
    const r = firstNonEmpty(c, visited);
    if (r) return r;
  }
  return null;
}

/* ------------------------------------------------------------- emit */

// DFS colouring: an edge to a node currently on the stack is a back-edge.
function markBackEdges(nodes: CfgNode[], edges: CfgEdge[]) {
  const adj = new Map<number, CfgEdge[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) adj.get(e.from)?.push(e);
  const state = new Map<number, 0 | 1 | 2>(); // 0 unseen, 1 on-stack, 2 done
  const visit = (id: number) => {
    state.set(id, 1);
    for (const e of adj.get(id) ?? []) {
      const s = state.get(e.to) ?? 0;
      if (s === 1) e.back = true;
      else if (s === 0) visit(e.to);
    }
    state.set(id, 2);
  };
  for (const n of nodes) if ((state.get(n.id) ?? 0) === 0) visit(n.id);
}

function emit(start: N): CfgGraph {
  // Rewire: re-point every edge that lands on an empty node to the first
  // non-empty descendant (this is the project_04 empty-node splice, done
  // functionally against the original children so it is order-independent).
  const originalChildren = new Map<N, N[]>();
  for (const n of reachable(start)) originalChildren.set(n, [...n.children]);

  const resolvedChildren = (n: N): N[] => {
    const out: N[] = [];
    for (const c of (originalChildren.get(n) ?? []).sort(byId)) {
      const target = isEmpty(c) ? firstNonEmpty(c) : c;
      if (target && !out.includes(target)) out.push(target);
    }
    return out;
  };

  // Reachable non-empty nodes over the rewired graph.
  const keep = new Set<N>();
  const stack = [start];
  while (stack.length) {
    const n = stack.pop()!;
    if (isEmpty(n) || keep.has(n)) continue;
    keep.add(n);
    for (const c of resolvedChildren(n)) stack.push(c);
  }

  const nodes: CfgNode[] = [...keep]
    .sort(byId)
    .map((n) => ({ id: n.id, kind: n.kind, label: displayLabel(n) }));

  const edges: CfgEdge[] = [];
  for (const n of [...keep].sort(byId)) {
    const children = resolvedChildren(n).filter((c) => keep.has(c));
    children.sort(byId);
    children.forEach((c, idx) => {
      const edge: CfgEdge = { from: n.id, to: c.id };
      if (n.kind === "diamond") edge.label = idx === 0 ? "T" : idx === 1 ? "F" : undefined;
      edges.push(edge);
    });
  }

  markBackEdges(nodes, edges);
  return { nodes, edges };
}

/* ------------------------------------------------------------- public API */

/** Build the faithful, fine-grained CFG for a parsed TRIPLA program. */
export function buildCfg(ast: ASTNode): CfgGraph {
  const builder = new CfgBuilder();
  const { start } = builder.build(ast);
  return emit(start);
}
