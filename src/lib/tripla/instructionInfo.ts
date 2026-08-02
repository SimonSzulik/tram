// Human-readable reference for the TRAM instruction set and registers.
// Single source of truth reused by the Workspace tooltips, the TRIPLA Manual,
// and the Compiler Book so the descriptions never drift apart.

export interface InstructionInfo {
  /** Mnemonic as emitted by the compiler / shown in the machine-code view. */
  name: string;
  /** Argument signature, e.g. "k d" or "p". Empty string for no args. */
  args: string;
  /** One-line summary of what the instruction does to the machine state. */
  summary: string;
  /** Optional longer explanation for reference pages. */
  detail?: string;
}

export const INSTRUCTION_INFO: Record<string, InstructionInfo> = {
  CONST: {
    name: "CONST",
    args: "k",
    summary: "Push the integer constant k onto the stack.",
    detail: "STACK[TOP+1] = k; TOP += 1. The basic way values enter the stack.",
  },
  LOAD: {
    name: "LOAD",
    args: "k d",
    summary: "Push the value of local variable k, reached d static links up.",
    detail:
      "Reads a variable from an activation frame. k is the slot offset; d is how many enclosing scopes (static links) to climb — this is how lexical scoping of nested functions works.",
  },
  STORE: {
    name: "STORE",
    args: "k d",
    summary: "Pop a value and store it into local variable k, d static links up.",
    detail:
      "The write counterpart of LOAD. Used to implement assignment (x = e). k is the slot offset, d the static-link depth.",
  },
  ADD: { name: "ADD", args: "", summary: "Pop two values, push their sum." },
  SUB: { name: "SUB", args: "", summary: "Pop two values, push their difference (a − b)." },
  MUL: { name: "MUL", args: "", summary: "Pop two values, push their product." },
  DIV: { name: "DIV", args: "", summary: "Pop two values, push their integer quotient (a / b)." },
  LT: { name: "LT", args: "", summary: "Pop a, b; push 1 if a < b else 0." },
  GT: { name: "GT", args: "", summary: "Pop a, b; push 1 if a > b else 0." },
  EQ: { name: "EQ", args: "", summary: "Pop a, b; push 1 if a == b else 0." },
  NEQ: { name: "NEQ", args: "", summary: "Pop a, b; push 1 if a != b else 0." },
  IFZERO: {
    name: "IFZERO",
    args: "p",
    summary: "Pop a value; if it is 0, jump to address p, otherwise continue.",
    detail: "The conditional branch. Together with GOTO it implements if/then/else and while loops.",
  },
  GOTO: { name: "GOTO", args: "p", summary: "Unconditionally jump to address p." },
  HALT: { name: "HALT", args: "", summary: "Stop execution (sets PC to −1). The result is left on top of the stack." },
  NOP: { name: "NOP", args: "", summary: "Do nothing; advance to the next instruction." },
  INVOKE: {
    name: "INVOKE",
    args: "n p d",
    summary: "Call the function at address p with n arguments; d is the static-link depth.",
    detail:
      "Saves the return address, the caller's PP/FP and the static link, then sets up a fresh frame and jumps to p. The n arguments already on the stack become the callee's parameters.",
  },
  RETURN: {
    name: "RETURN",
    args: "",
    summary: "Return from the current function, leaving its result on the stack.",
    detail: "Restores PC, PP and FP from the saved frame and replaces the frame with the return value.",
  },
  POP: { name: "POP", args: "", summary: "Discard the top stack value (used to drop a sequenced expression's result)." },
};

export interface RegisterInfo {
  name: string;
  full: string;
  summary: string;
}

export const REGISTER_INFO: Record<string, RegisterInfo> = {
  PC: {
    name: "PC",
    full: "Program Counter",
    summary: "Address of the instruction currently being executed. Branches and calls change it.",
  },
  PP: {
    name: "PP",
    full: "Procedure Pointer",
    summary: "Base of the current activation frame — where the current function's parameters and locals begin.",
  },
  FP: {
    name: "FP",
    full: "Frame Pointer",
    summary: "Points at the saved return address / caller registers of the current frame; used by RETURN.",
  },
  TOP: {
    name: "TOP",
    full: "Top of Stack",
    summary: "Index of the topmost occupied stack cell. Grows on push, shrinks on pop.",
  },
};

/** Extract the leading mnemonic from a machine-code line like "LOAD 0 1". */
export function mnemonicOf(code: string): string {
  return code.trim().split(/\s+/)[0]?.toUpperCase() ?? "";
}

/** Extract the operands from a machine-code line like "LOAD 0 1" → ["0", "1"]. */
export function operandsOf(code: string): string[] {
  return code.trim().split(/\s+/).slice(1);
}

const plural = (n: string, word: string) => `${n} ${word}${n === "1" ? "" : "s"}`;

const frameSuffix = (d: string) =>
  d === "0" ? " in the current frame." : `, reached ${plural(d, "static link")} up.`;

/**
 * A concrete, value-substituted description of a specific instruction line —
 * e.g. "CONST 5" → "Push the constant 5 onto the stack." Returns null for
 * instructions with no operands (their generic summary already says it all).
 */
export function describeConcrete(code: string): string | null {
  const mnem = mnemonicOf(code);
  const a = operandsOf(code);
  switch (mnem) {
    case "CONST":
      return a[0] !== undefined ? `Push the constant ${a[0]} onto the stack.` : null;
    case "LOAD":
      return a[0] !== undefined
        ? `Push the value of variable slot ${a[0]}${frameSuffix(a[1] ?? "0")}`
        : null;
    case "STORE":
      return a[0] !== undefined
        ? `Pop the top value and store it into variable slot ${a[0]}${frameSuffix(a[1] ?? "0")}`
        : null;
    case "IFZERO":
      return a[0] !== undefined ? `Pop a value; if it is 0, jump to ${a[0]}.` : null;
    case "GOTO":
      return a[0] !== undefined ? `Jump to ${a[0]}.` : null;
    case "INVOKE":
      return a[1] !== undefined
        ? `Call the function at ${a[1]} with ${plural(a[0] ?? "0", "argument")}` +
            (a[2] && a[2] !== "0" ? ` (climbing ${plural(a[2], "static link")}).` : ".")
        : null;
    default:
      return null;
  }
}
