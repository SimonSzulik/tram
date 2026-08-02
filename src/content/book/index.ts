import { createElement } from "react";
import type { Chapter } from "./types";
import { ChapterOutline } from "@/components/book/ChapterOutline";
import Chapter01 from "./chapters/ch01-what-is-a-compiler";
import Chapter03 from "./chapters/ch03-the-tram";
import Chapter04 from "./chapters/ch04-lexical-analysis";
import Chapter05 from "./chapters/ch05-syntactic-analysis";
import Chapter08 from "./chapters/ch08-code-generation";

export { PARTS } from "./types";
export type { Chapter, Part, PartId } from "./types";

// Factory for planned-but-not-yet-written chapters. Keeps the arc complete.
function outline(opts: {
  intro: string;
  keyPoints: string[];
  planned?: string[];
}) {
  return function OutlineChapter() {
    return createElement(ChapterOutline, {
      intro: createElement("p", null, opts.intro),
      keyPoints: opts.keyPoints,
      planned: opts.planned,
    });
  };
}

export const CHAPTERS: Chapter[] = [
  {
    id: "what-is-a-compiler",
    number: 1,
    part: "foundations",
    title: "What Is a Compiler?",
    summary: "Translation vs. interpretation, and the pipeline every compiler is built from.",
    objectives: [
      "Explain what a compiler translates, and into what",
      "Distinguish compilation from interpretation",
      "Name the stages of the compilation pipeline and what each produces",
    ],
    status: "complete",
    lectureRef: "UAP01",
    Content: Chapter01,
  },
  {
    id: "abstract-machines",
    number: 2,
    part: "foundations",
    title: "Abstract Machines",
    summary: "Why we translate to a simple idealised machine, and what a stack machine is.",
    objectives: [
      "Describe a machine's state as a computation from an initial to a final configuration",
      "Explain why stack machines are a convenient compilation target",
      "Read a simple abstract-machine trace",
    ],
    status: "outline",
    lectureRef: "UAP02 · Exercise 1 (MaMa)",
    Content: outline({
      intro:
        "Before committing to real hardware, compiler courses target an abstract machine — an idealised computer simple enough to reason about but powerful enough to run real programs. This chapter introduces machine state, computation as a sequence of state transitions, and the pedagogical MaMa machine that warms us up for the TRAM.",
      keyPoints: [
        "Machine configurations and the ▷ transition relation",
        "Stack machines: operands flow through a stack rather than named registers",
        "Reading and writing a computation trace K₀ ▷ … ▷ Kₙ",
        "Worst-case step counting as a first taste of program analysis",
      ],
      planned: [
        "Animated stack-machine trace stepping through a small program",
        "Side-by-side of the MaMa warm-up and the TRAM it leads to",
      ],
    }),
  },
  {
    id: "the-tram",
    number: 3,
    part: "foundations",
    title: "The TRAM",
    summary: "Registers, the stack, the 18 instructions, and the calling convention.",
    objectives: [
      "Name the four TRAM registers and what each holds",
      "Trace how instructions transform the stack",
      "Explain how INVOKE/RETURN and static links implement function calls",
    ],
    status: "complete",
    lectureRef: "UAP03–04 · Project 1",
    Content: Chapter03,
  },
  {
    id: "lexical-analysis",
    number: 4,
    part: "frontend",
    title: "Lexical Analysis",
    summary: "From a character stream to tokens, via regular languages and finite automata.",
    objectives: [
      "Describe token families with regular expressions",
      "Explain the regex → NFA → DFA → minimal-DFA pipeline",
      "Apply the maximal-munch rule to resolve ambiguous matches",
    ],
    status: "complete",
    lectureRef: "UAP05 · Exercise 2",
    Content: Chapter04,
  },
  {
    id: "syntactic-analysis",
    number: 5,
    part: "frontend",
    title: "Syntactic Analysis",
    summary: "Grammars, parse trees and the AST; top-down LL(1) parsing with FIRST/FOLLOW.",
    objectives: [
      "Read a context-free grammar and derive a parse tree",
      "Distinguish a parse tree from an abstract syntax tree",
      "Compute FIRST/FOLLOW and understand why left recursion breaks top-down parsing",
    ],
    status: "complete",
    lectureRef: "UAP06–07 · Exercise 3",
    Content: Chapter05,
  },
  {
    id: "abstract-syntax-trees",
    number: 6,
    part: "frontend",
    title: "Abstract Syntax Trees",
    summary: "Concrete vs. abstract syntax, and the node types that make up a TRIPLA program.",
    objectives: [
      "Explain what surface detail an AST discards, and why",
      "Enumerate TRIPLA's AST node kinds",
      "Walk an AST recursively",
    ],
    status: "outline",
    lectureRef: "UAP07 · Project 2",
    Content: outline({
      intro:
        "The AST is the spine of every later phase. This chapter catalogues TRIPLA's node types — LET, DECL, CALL, VAR, BINOP, CONST, BOOL, ASSIGN, SEQ, IF, WHILE — and shows how tree-walking underlies semantics, code generation and analysis alike.",
      keyPoints: [
        "Concrete syntax (parse tree) vs. abstract syntax (AST)",
        "The full TRIPLA node set and each node's children",
        "Tree traversal as the shared shape of every AST-based phase",
        "Pretty-printing an AST back to source",
      ],
      planned: [
        "Interactive AST explorer with node-by-node explanations",
        "Toggle between concrete parse tree and abstract tree for the same program",
      ],
    }),
  },
  {
    id: "semantics",
    number: 7,
    part: "frontend",
    title: "Semantics",
    summary: "Giving programs meaning: environments, scope, and evaluation rules.",
    objectives: [
      "Read big-step and small-step evaluation rules",
      "Explain how environments model variable bindings and scope",
      "Trace the evaluation of a small TRIPLA program",
    ],
    status: "outline",
    lectureRef: "UAP08–09",
    Content: outline({
      intro:
        "Syntax says what programs look like; semantics says what they mean. This chapter introduces formal semantics — both the big-step 'evaluate to a value' style and the small-step 'one reduction at a time' style — and applies them to TRIPLA's expressions, scoping and side effects.",
      keyPoints: [
        "Big-step (natural) vs. small-step (structural operational) semantics",
        "Environments ρ: mapping names to values, and how scope nests",
        "Evaluation rules for arithmetic, conditionals, loops and function calls",
        "How assignment and sequencing introduce side effects",
      ],
      planned: [
        "Step-by-step evaluator that shows the environment at each reduction",
        "Interactive derivation-tree builder for a chosen expression",
      ],
    }),
  },
  {
    id: "code-generation",
    number: 8,
    part: "backend",
    title: "Code Generation",
    summary: "The code(ρ, nl) scheme: translating expressions, control flow and functions to TRAM.",
    objectives: [
      "Translate expressions and control flow to stack-machine code",
      "Explain the role of the address environment and labels",
      "Show how nesting levels produce static-link depths for nested functions",
    ],
    status: "complete",
    lectureRef: "UAP10 · UAP12 · Exercise 4 · Project 3",
    Content: Chapter08,
  },
  {
    id: "runtime-and-calling-conventions",
    number: 9,
    part: "backend",
    title: "Runtime & Calling Conventions",
    summary: "Activation frames, INVOKE/RETURN, and static vs. dynamic links.",
    objectives: [
      "Lay out an activation frame on the stack",
      "Explain what INVOKE saves and RETURN restores",
      "Distinguish static links (scope) from dynamic links (call chain)",
    ],
    status: "outline",
    lectureRef: "UAP10 · Project 3",
    Content: outline({
      intro:
        "Functions need a disciplined way to share the stack. This chapter details the TRIPLA/TRAM calling convention: how a frame is built on INVOKE, what is saved, how RETURN unwinds it, and why two kinds of links are needed to support recursion and nested scopes at once.",
      keyPoints: [
        "Anatomy of an activation frame: parameters, saved registers, links",
        "The INVOKE sequence and the RETURN sequence, register by register",
        "Static links (lexical scope) vs. dynamic links (who called whom)",
        "How recursion reuses the same code with fresh frames",
      ],
      planned: [
        "Animated frame builder showing the stack growing across nested calls",
        "Live static-link walker for a chosen nested-function program",
      ],
    }),
  },
  {
    id: "control-flow-graphs",
    number: 10,
    part: "analysis",
    title: "Control Flow Graphs",
    summary: "Basic blocks and the graph that program analyses run on.",
    objectives: [
      "Split a program into basic blocks",
      "Build a control flow graph with true/false edges",
      "Explain why analyses work on the CFG rather than the AST",
    ],
    status: "outline",
    lectureRef: "UAP16 · Project 4",
    Content: outline({
      intro:
        "To reason about how a program executes, we model its possible paths as a graph. This chapter builds the control flow graph (CFG): nodes are basic blocks, edges are possible transfers of control, and conditionals branch into labelled true/false edges.",
      keyPoints: [
        "Basic blocks: maximal straight-line instruction sequences",
        "Constructing the CFG from TRIPLA's control constructs",
        "Diamond nodes for conditionals; edges for loops",
        "Why data-flow analysis lives on the CFG",
      ],
      planned: [
        "CFG viewer rendered from a TRIPLA program",
        "Highlight the path taken for specific inputs",
      ],
    }),
  },
  {
    id: "data-flow-analysis",
    number: 11,
    part: "analysis",
    title: "Data-Flow Analysis",
    summary: "gen/kill, forward vs. backward, and fixpoint iteration — with live variables.",
    objectives: [
      "Formulate an analysis with gen/kill sets",
      "Run a backward analysis to a fixpoint",
      "Compute live variables and reached uses",
    ],
    status: "outline",
    lectureRef: "UAP16–18 · Exercise 6 · Projects 4–5",
    Content: outline({
      intro:
        "Data-flow analysis derives facts that hold at every program point by propagating information around the CFG until nothing changes. This chapter develops the general framework and works two classic backward analyses: live variables and reached uses (def-use chains).",
      keyPoints: [
        "The gen/kill formulation and transfer functions",
        "Forward vs. backward analyses; may vs. must",
        "Fixpoint iteration: initialise, iterate, converge",
        "Live variables and reached-uses / def-use chains",
      ],
      planned: [
        "Fixpoint-iteration table that fills in round by round",
        "CFG annotated with In/Out sets you can step through",
      ],
    }),
  },
  {
    id: "optimization",
    number: 12,
    part: "analysis",
    title: "Optimization",
    summary: "Using analysis results to eliminate dead code and simplify programs.",
    objectives: [
      "Explain how an analysis result justifies a transformation",
      "Remove assignments whose results are never used",
      "Recognise constant folding and partial evaluation",
    ],
    status: "outline",
    lectureRef: "UAP21–22 · Project 5",
    Content: outline({
      intro:
        "Analyses are only useful if they let us improve the program. This chapter turns reached-uses information into dead-code elimination — removing assignments no one reads while preserving side effects — and previews constant folding and partial evaluation.",
      keyPoints: [
        "From a data-flow fact to a safe transformation",
        "Dead-code elimination driven by reached uses",
        "Preserving observable behaviour and side effects",
        "Constant folding and a first look at partial evaluation",
      ],
      planned: [
        "Before/after view of a program with dead code removed",
        "Toggle optimisations and re-generate TRAM code",
      ],
    }),
  },
  {
    id: "compiling-java",
    number: 13,
    part: "advanced",
    title: "Compiling Java",
    summary: "Objects, method dispatch, overload resolution and bytecode.",
    objectives: [
      "Compute address environments for classes and objects",
      "Explain dynamic method dispatch",
      "Resolve overloaded methods to the applicable one",
    ],
    status: "outline",
    lectureRef: "UAP11 · UAP13 · Exercise 5",
    Content: outline({
      intro:
        "Object-oriented languages add layers the TRIPLA back end never needed. This chapter scales the address-environment idea up to classes and objects, and works through method dispatch, visible/applicable methods and overload resolution, translating to Java bytecode.",
      keyPoints: [
        "Address environments for fields and objects (sizeof)",
        "Virtual method tables and dynamic dispatch",
        "Visible methods and applicable-method / overload resolution",
        "Reading Java bytecode with javap",
      ],
    }),
  },
  {
    id: "just-in-time-compilation",
    number: 14,
    part: "advanced",
    title: "Just-in-Time Compilation",
    summary: "Compiling at runtime, and the interpret-then-compile trade-off.",
    objectives: [
      "Explain when and why to compile at runtime",
      "Describe the interpretation → JIT hand-off",
      "Weigh warm-up cost against steady-state speed",
    ],
    status: "outline",
    lectureRef: "UAP14",
    Content: outline({
      intro:
        "A JIT compiler blurs the line between interpreter and compiler: it starts by interpreting, then compiles hot code to native instructions while the program runs. This chapter explains the trade-offs that make JITs win on long-running programs.",
      keyPoints: [
        "Runtime compilation vs. ahead-of-time",
        "Detecting hot spots worth compiling",
        "Warm-up cost vs. steady-state throughput",
        "Deoptimisation and speculative assumptions",
      ],
    }),
  },
  {
    id: "abstract-interpretation",
    number: 15,
    part: "advanced",
    title: "Abstract Interpretation",
    summary: "Executing programs over abstract values to prove properties.",
    objectives: [
      "Explain the idea of an abstract domain",
      "Relate abstract interpretation to data-flow analysis",
      "See a sign/interval analysis of TRIPLA",
    ],
    status: "outline",
    lectureRef: "UAP15",
    Content: outline({
      intro:
        "Abstract interpretation runs a program over approximate values — signs, intervals, sets — to compute sound over-approximations of what it can do. This chapter frames it as a unifying theory behind many static analyses.",
      keyPoints: [
        "Abstract domains and the concretisation/abstraction pair",
        "Soundness: never miss a real behaviour",
        "Abstract interpretation as generalised data-flow analysis",
        "A worked sign or interval analysis of a TRIPLA program",
      ],
    }),
  },
  {
    id: "applications",
    number: 16,
    part: "advanced",
    title: "Applications",
    summary: "Where compiler techniques go next: clones, reverse engineering, transformations, closures.",
    objectives: [
      "Recognise compiler techniques reused outside compilation",
      "Explain code clone detection at a high level",
      "Connect closures back to static links",
    ],
    status: "outline",
    lectureRef: "UAP19–23",
    Content: outline({
      intro:
        "The machinery built for compilation — ASTs, CFGs, data-flow analysis — powers a wide range of program-understanding tools. This closing chapter surveys code clone detection, reverse engineering, program transformations, partial evaluation and closures.",
      keyPoints: [
        "Code clone detection over ASTs and token streams",
        "Reverse engineering and recovering structure from code",
        "Program transformations and partial evaluation",
        "Closures and their relationship to static links",
      ],
    }),
  },
];

export function getChapter(id: string | undefined): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function adjacentChapters(id: string): { prev?: Chapter; next?: Chapter } {
  const i = CHAPTERS.findIndex((c) => c.id === id);
  if (i === -1) return {};
  return { prev: CHAPTERS[i - 1], next: CHAPTERS[i + 1] };
}
