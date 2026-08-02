// TRAM Instructions - Target machine code for the Tripla compiler

export class Label {
  private static counter = 0;
  public readonly id: number;
  public address: number = -1;
  
  constructor() {
    Label.counter++;
    this.id = Label.counter;
  }
  
  public toString(): string {
    return `L${this.id}`;
  }
  
  public static reset(): void {
    Label.counter = 0;
  }
}

export interface Instruction {
  assignedLabels: Label[];
  toString(): string;
  clone(): Instruction;
}

abstract class BaseInstruction implements Instruction {
  public assignedLabels: Label[] = [];
  
  protected labelsToString(): string {
    if (this.assignedLabels.length === 0) {
      return '  ';
    }
    return this.assignedLabels.map(l => l.toString()).join(',') + ': ';
  }
  
  abstract toString(): string;
  abstract clone(): Instruction;
}

export class Halt extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'HALT'; }
  clone(): Halt { 
    const h = new Halt();
    h.assignedLabels = [...this.assignedLabels];
    return h;
  }
}

export class Nop extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'NOP'; }
  clone(): Nop {
    const n = new Nop();
    n.assignedLabels = [...this.assignedLabels];
    return n;
  }
}

export class Pop extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'POP'; }
  clone(): Pop {
    const p = new Pop();
    p.assignedLabels = [...this.assignedLabels];
    return p;
  }
}

export class Const extends BaseInstruction {
  constructor(public readonly k: number) { super(); }
  toString(): string { return this.labelsToString() + `CONST ${this.k}`; }
  clone(): Const {
    const c = new Const(this.k);
    c.assignedLabels = [...this.assignedLabels];
    return c;
  }
}

export class Store extends BaseInstruction {
  constructor(public readonly k: number | Label, public readonly d: number) { super(); }
  toString(): string { 
    const kStr = this.k instanceof Label ? this.k.toString() : String(this.k);
    return this.labelsToString() + `STORE ${kStr} ${this.d}`; 
  }
  clone(): Store {
    const s = new Store(this.k, this.d);
    s.assignedLabels = [...this.assignedLabels];
    return s;
  }
}

export class Load extends BaseInstruction {
  constructor(public readonly k: number | Label, public readonly d: number) { super(); }
  toString(): string { 
    const kStr = this.k instanceof Label ? this.k.toString() : String(this.k);
    return this.labelsToString() + `LOAD ${kStr} ${this.d}`; 
  }
  clone(): Load {
    const l = new Load(this.k, this.d);
    l.assignedLabels = [...this.assignedLabels];
    return l;
  }
}

export class Add extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'ADD'; }
  clone(): Add {
    const a = new Add();
    a.assignedLabels = [...this.assignedLabels];
    return a;
  }
}

export class Sub extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'SUB'; }
  clone(): Sub {
    const s = new Sub();
    s.assignedLabels = [...this.assignedLabels];
    return s;
  }
}

export class Mul extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'MUL'; }
  clone(): Mul {
    const m = new Mul();
    m.assignedLabels = [...this.assignedLabels];
    return m;
  }
}

export class Div extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'DIV'; }
  clone(): Div {
    const d = new Div();
    d.assignedLabels = [...this.assignedLabels];
    return d;
  }
}

export class Lt extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'LT'; }
  clone(): Lt {
    const l = new Lt();
    l.assignedLabels = [...this.assignedLabels];
    return l;
  }
}

export class Gt extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'GT'; }
  clone(): Gt {
    const g = new Gt();
    g.assignedLabels = [...this.assignedLabels];
    return g;
  }
}

export class Eq extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'EQ'; }
  clone(): Eq {
    const e = new Eq();
    e.assignedLabels = [...this.assignedLabels];
    return e;
  }
}

export class Neq extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'NEQ'; }
  clone(): Neq {
    const n = new Neq();
    n.assignedLabels = [...this.assignedLabels];
    return n;
  }
}

export class Goto extends BaseInstruction {
  constructor(public readonly label: Label) { super(); }
  toString(): string { return this.labelsToString() + `GOTO ${this.label.toString()}`; }
  clone(): Goto {
    const g = new Goto(this.label);
    g.assignedLabels = [...this.assignedLabels];
    return g;
  }
}

export class Ifzero extends BaseInstruction {
  constructor(public readonly label: Label) { super(); }
  toString(): string { return this.labelsToString() + `IFZERO ${this.label.toString()}`; }
  clone(): Ifzero {
    const i = new Ifzero(this.label);
    i.assignedLabels = [...this.assignedLabels];
    return i;
  }
}

export class Invoke extends BaseInstruction {
  constructor(
    public readonly n: number, 
    public readonly label: Label, 
    public readonly d: number
  ) { super(); }
  toString(): string { 
    return this.labelsToString() + `INVOKE ${this.n} ${this.label.toString()} ${this.d}`; 
  }
  clone(): Invoke {
    const i = new Invoke(this.n, this.label, this.d);
    i.assignedLabels = [...this.assignedLabels];
    return i;
  }
}

export class Ireturn extends BaseInstruction {
  toString(): string { return this.labelsToString() + 'RETURN'; }
  clone(): Ireturn {
    const r = new Ireturn();
    r.assignedLabels = [...this.assignedLabels];
    return r;
  }
}

// Factory functions for creating instructions
export const instructions = {
  halt: () => new Halt(),
  nop: () => new Nop(),
  pop: () => new Pop(),
  const: (k: number) => new Const(k),
  store: (k: number | Label, d: number) => new Store(k, d),
  load: (k: number | Label, d: number) => new Load(k, d),
  add: () => new Add(),
  sub: () => new Sub(),
  mul: () => new Mul(),
  div: () => new Div(),
  lt: () => new Lt(),
  gt: () => new Gt(),
  eq: () => new Eq(),
  neq: () => new Neq(),
  goto: (label: Label) => new Goto(label),
  ifzero: (label: Label) => new Ifzero(label),
  invoke: (n: number, label: Label, d: number) => new Invoke(n, label, d),
  ireturn: () => new Ireturn(),
};

// Helper to attach a label to the first instruction
export function attachEntryLabel(code: Instruction[], label: Label): Instruction[] {
  if (code.length > 0) {
    code[0].assignedLabels.push(label);
  }
  return code;
}

// Deep clone an instruction array
export function cloneInstructions(code: Instruction[]): Instruction[] {
  return code.map(instr => instr.clone());
}
