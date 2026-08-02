// TRAM Abstract Machine - TypeScript implementation based on Java version

export class MachineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MachineError";
  }
}

export enum Opcode {
  CONST = 1,
  LOAD = 2,
  STORE = 3,
  ADD = 4,
  SUB = 5,
  MUL = 6,
  DIV = 7,
  LT = 8,
  GT = 9,
  EQ = 10,
  NEQ = 11,
  IFZERO = 12,
  GOTO = 13,
  HALT = 14,
  NOP = 15,
  INVOKE = 16,
  RETURN = 17,
  POP = 18,
}

export interface MachineInstruction {
  opcode: Opcode;
  arg1?: number;
  arg2?: number;
  arg3?: number;
}

export interface MachineState {
  PC: number;
  PP: number;
  FP: number;
  TOP: number;
  stack: (number | null)[];
  halted: boolean;
}

const DEFAULT_STACK_SIZE = 32;

export class AbstractMachine {
  private program: MachineInstruction[];
  private STACK: (number | null)[];
  private PC: number;
  private PP: number;
  private FP: number;
  private TOP: number;

  constructor(program: MachineInstruction[]) {
    this.program = program || [];
    this.STACK = new Array(DEFAULT_STACK_SIZE).fill(null);
    this.PC = 0;
    this.PP = 0;
    this.FP = 0;
    this.TOP = -1;
  }

  reset(): void {
    this.STACK = new Array(DEFAULT_STACK_SIZE).fill(null);
    this.PC = 0;
    this.PP = 0;
    this.FP = 0;
    this.TOP = -1;
  }

  restoreState(state: MachineState): void {
    this.PC = state.PC;
    this.PP = state.PP;
    this.FP = state.FP;
    this.TOP = state.TOP;
    // Restore stack
    this.STACK = new Array(Math.max(DEFAULT_STACK_SIZE, state.stack.length)).fill(null);
    for (let i = 0; i < state.stack.length; i++) {
      this.STACK[i] = state.stack[i];
    }
  }

  getState(): MachineState {
    // Only show stack up to TOP, and ensure all values are numbers (not null)
    const visibleStack: (number | null)[] = [];
    for (let i = 0; i <= this.TOP; i++) {
      visibleStack.push(this.STACK[i] ?? 0);
    }
    return {
      PC: this.PC,
      PP: this.PP,
      FP: this.FP,
      TOP: this.TOP,
      stack: visibleStack,
      halted: this.PC < 0 || this.PC >= this.program.length,
    };
  }

  isHalted(): boolean {
    return this.PC < 0 || this.PC >= this.program.length;
  }

  getCurrentInstruction(): MachineInstruction | null {
    if (this.PC >= 0 && this.PC < this.program.length) {
      return this.program[this.PC];
    }
    return null;
  }

  step(): MachineState {
    if (this.PC >= 0 && this.PC < this.program.length) {
      this.execute(this.program[this.PC]);
    }
    return this.getState();
  }

  private execute(instr: MachineInstruction): void {
    switch (instr.opcode) {
      case Opcode.CONST:
        this.doConst(instr.arg1 ?? 0);
        break;
      case Opcode.LOAD:
        this.doLoad(instr.arg1 ?? 0, instr.arg2 ?? 0);
        break;
      case Opcode.STORE:
        this.doStore(instr.arg1 ?? 0, instr.arg2 ?? 0);
        break;
      case Opcode.ADD:
        this.doAdd();
        break;
      case Opcode.SUB:
        this.doSub();
        break;
      case Opcode.MUL:
        this.doMul();
        break;
      case Opcode.DIV:
        this.doDiv();
        break;
      case Opcode.LT:
        this.doLt();
        break;
      case Opcode.GT:
        this.doGt();
        break;
      case Opcode.EQ:
        this.doEq();
        break;
      case Opcode.NEQ:
        this.doNeq();
        break;
      case Opcode.IFZERO:
        this.doIfZero(instr.arg1 ?? 0);
        break;
      case Opcode.GOTO:
        this.doGoto(instr.arg1 ?? 0);
        break;
      case Opcode.HALT:
        this.doHalt();
        break;
      case Opcode.NOP:
        this.doNop();
        break;
      case Opcode.INVOKE:
        this.doInvoke(instr.arg1 ?? 0, instr.arg2 ?? 0, instr.arg3 ?? 0);
        break;
      case Opcode.RETURN:
        this.doReturn();
        break;
      case Opcode.POP:
        this.doPop();
        break;
    }
  }

  private ensureStackSize(i: number): void {
    if (this.TOP + i + 1 > this.STACK.length) {
      const newStack = new Array(this.STACK.length * 2).fill(null);
      for (let j = 0; j < this.STACK.length; j++) {
        newStack[j] = this.STACK[j];
      }
      this.STACK = newStack;
    }
  }

  private doConst(k: number): void {
    this.ensureStackSize(1);
    this.STACK[this.TOP + 1] = k;
    this.TOP = this.TOP + 1;
    this.PC = this.PC + 1;
  }

  private doAdd(): void {
    const a = this.STACK[this.TOP - 1] ?? 0;
    const b = this.STACK[this.TOP] ?? 0;
    this.STACK[this.TOP - 1] = a + b;
    this.TOP = this.TOP - 1;
    this.PC = this.PC + 1;
  }

  private doPop(): void {
    this.TOP = this.TOP - 1;
    this.PC = this.PC + 1;
  }

  private doSub(): void {
    const a = this.STACK[this.TOP - 1] ?? 0;
    const b = this.STACK[this.TOP] ?? 0;
    this.STACK[this.TOP - 1] = a - b;
    this.TOP = this.TOP - 1;
    this.PC = this.PC + 1;
  }

  private doMul(): void {
    const a = this.STACK[this.TOP - 1] ?? 0;
    const b = this.STACK[this.TOP] ?? 0;
    this.STACK[this.TOP - 1] = a * b;
    this.TOP = this.TOP - 1;
    this.PC = this.PC + 1;
  }

  private doDiv(): void {
    const a = this.STACK[this.TOP - 1] ?? 0;
    const b = this.STACK[this.TOP] ?? 0;
    if (b === 0) {
      throw new MachineError("Division by zero");
    }
    // Java-style integer division (toward zero), not Math.floor (toward −∞).
    this.STACK[this.TOP - 1] = Math.trunc(a / b);
    this.TOP = this.TOP - 1;
    this.PC = this.PC + 1;
  }

  private doLt(): void {
    const a = this.STACK[this.TOP - 1] ?? 0;
    const b = this.STACK[this.TOP] ?? 0;
    this.STACK[this.TOP - 1] = a < b ? 1 : 0;
    this.TOP = this.TOP - 1;
    this.PC = this.PC + 1;
  }

  private doGt(): void {
    const a = this.STACK[this.TOP - 1] ?? 0;
    const b = this.STACK[this.TOP] ?? 0;
    this.STACK[this.TOP - 1] = a > b ? 1 : 0;
    this.TOP = this.TOP - 1;
    this.PC = this.PC + 1;
  }

  private doEq(): void {
    const a = this.STACK[this.TOP - 1] ?? 0;
    const b = this.STACK[this.TOP] ?? 0;
    this.STACK[this.TOP - 1] = a === b ? 1 : 0;
    this.TOP = this.TOP - 1;
    this.PC = this.PC + 1;
  }

  private doNeq(): void {
    const a = this.STACK[this.TOP - 1] ?? 0;
    const b = this.STACK[this.TOP] ?? 0;
    this.STACK[this.TOP - 1] = a !== b ? 1 : 0;
    this.TOP = this.TOP - 1;
    this.PC = this.PC + 1;
  }

  private doGoto(p: number): void {
    this.PC = p;
  }

  private doIfZero(p: number): void {
    const val = this.STACK[this.TOP] ?? 0;
    if (val === 0) {
      this.PC = p;
    } else {
      this.PC = this.PC + 1;
    }
    this.TOP = this.TOP - 1;
  }

  private doHalt(): void {
    this.PC = -1;
  }

  private doNop(): void {
    this.PC = this.PC + 1;
  }

  private doInvoke(n: number, p: number, d: number): void {
    this.ensureStackSize(5);
    this.STACK[this.TOP + 1] = this.PC + 1;
    this.STACK[this.TOP + 2] = this.PP;
    this.STACK[this.TOP + 3] = this.FP;
    this.STACK[this.TOP + 4] = this.spp(d, this.PP, this.FP);
    this.STACK[this.TOP + 5] = this.sfp(d, this.PP, this.FP);
    this.PP = this.TOP - n + 1;
    this.FP = this.TOP + 1;
    this.TOP = this.TOP + 5;
    this.PC = p;
  }

  private spp(d: number, pp: number, fp: number): number {
    if (d === 0) return pp;
    const newPP = this.STACK[fp + 3] ?? 0;
    const newFP = this.STACK[fp + 4] ?? 0;
    return this.spp(d - 1, newPP, newFP);
  }

  private sfp(d: number, pp: number, fp: number): number {
    if (d === 0) return fp;
    const newPP = this.STACK[fp + 3] ?? 0;
    const newFP = this.STACK[fp + 4] ?? 0;
    return this.sfp(d - 1, newPP, newFP);
  }

  private doReturn(): void {
    const res = this.STACK[this.TOP] ?? 0;
    this.TOP = this.PP;
    this.PC = this.STACK[this.FP] ?? 0;
    this.PP = this.STACK[this.FP + 1] ?? 0;
    this.FP = this.STACK[this.FP + 2] ?? 0;
    this.STACK[this.TOP] = res;
  }

  private doStore(k: number, d: number): void {
    const addr = this.spp(d, this.PP, this.FP) + k;
    this.STACK[addr] = this.STACK[this.TOP] ?? 0;
    this.TOP = this.TOP - 1;
    this.PC = this.PC + 1;
  }

  private doLoad(k: number, d: number): void {
    this.ensureStackSize(1);
    const addr = this.spp(d, this.PP, this.FP) + k;
    this.STACK[this.TOP + 1] = this.STACK[addr] ?? 0;
    this.TOP = this.TOP + 1;
    this.PC = this.PC + 1;
  }
}

// Parse instruction strings into MachineInstruction objects
export function parseInstructions(instructionStrings: { code: string; label?: string }[]): MachineInstruction[] {
  // First pass: build label-to-address map
  const labelMap = new Map<string, number>();
  instructionStrings.forEach((instr, idx) => {
    if (instr.label) {
      // Handle multiple labels separated by comma
      const labels = instr.label.split(',');
      labels.forEach(label => {
        labelMap.set(label.trim(), idx);
      });
    }
  });

  const opcodeMap: Record<string, Opcode> = {
    'CONST': Opcode.CONST,
    'LOAD': Opcode.LOAD,
    'STORE': Opcode.STORE,
    'ADD': Opcode.ADD,
    'SUB': Opcode.SUB,
    'MUL': Opcode.MUL,
    'DIV': Opcode.DIV,
    'LT': Opcode.LT,
    'GT': Opcode.GT,
    'EQ': Opcode.EQ,
    'NEQ': Opcode.NEQ,
    'IFZERO': Opcode.IFZERO,
    'GOTO': Opcode.GOTO,
    'HALT': Opcode.HALT,
    'NOP': Opcode.NOP,
    'INVOKE': Opcode.INVOKE,
    'RETURN': Opcode.RETURN,
    'POP': Opcode.POP,
  };

  // Helper to resolve a value that might be a label or a number
  const resolveValue = (val: string): number | undefined => {
    if (!val) return undefined;
    // Check if it's a label (starts with L)
    if (val.startsWith('L') && labelMap.has(val)) {
      return labelMap.get(val);
    }
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? undefined : parsed;
  };

  // Second pass: parse instructions and resolve labels
  return instructionStrings.map((instr) => {
    const code = instr.code.trim();
    const parts = code.split(/\s+/);
    const opcodeName = parts[0];

    const opcode = opcodeMap[opcodeName];
    if (opcode === undefined) {
      throw new MachineError(`Unknown opcode: ${opcodeName}`);
    }

    return {
      opcode,
      arg1: resolveValue(parts[1]),
      arg2: resolveValue(parts[2]),
      arg3: resolveValue(parts[3]),
    };
  });
}

export function opcodeToString(opcode: Opcode): string {
  const names: Record<Opcode, string> = {
    [Opcode.CONST]: 'CONST',
    [Opcode.LOAD]: 'LOAD',
    [Opcode.STORE]: 'STORE',
    [Opcode.ADD]: 'ADD',
    [Opcode.SUB]: 'SUB',
    [Opcode.MUL]: 'MUL',
    [Opcode.DIV]: 'DIV',
    [Opcode.LT]: 'LT',
    [Opcode.GT]: 'GT',
    [Opcode.EQ]: 'EQ',
    [Opcode.NEQ]: 'NEQ',
    [Opcode.IFZERO]: 'IFZERO',
    [Opcode.GOTO]: 'GOTO',
    [Opcode.HALT]: 'HALT',
    [Opcode.NOP]: 'NOP',
    [Opcode.INVOKE]: 'INVOKE',
    [Opcode.RETURN]: 'RETURN',
    [Opcode.POP]: 'POP',
  };
  return names[opcode] ?? 'UNKNOWN';
}
