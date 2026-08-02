// Data for the general (language-agnostic) Compiler Concepts page.
// Deliberately not tied to any specific language or target machine.

import {
  Search,
  GitBranch,
  Eye,
  Boxes,
  Sparkles,
  Binary,
  type LucideIcon,
} from "lucide-react";

export type Side = "frontend" | "backend";

export interface Phase {
  id: string;
  title: string;
  subtitle: string;
  side: Side;
  icon: LucideIcon;
  /** Tailwind text color class for the accent. */
  accent: string;
  /** A one-line everyday analogy. */
  analogy: string;
  /** Plain-language description of what the phase does. */
  description: string;
  /** A tiny, language-agnostic before/after example. */
  example: { input: string; output: string };
  keyPoints: string[];
}

export const PHASES: Phase[] = [
  {
    id: "scanner",
    title: "Scanner",
    subtitle: "Lexical analysis",
    side: "frontend",
    icon: Search,
    accent: "text-sky-500",
    analogy: "Reading a sentence letter by letter and grouping them into whole words.",
    description:
      "The scanner reads the raw source text one character at a time and groups those characters into meaningful units called tokens — keywords, names, numbers, operators and punctuation. Whitespace and comments are thrown away.",
    example: {
      input: "total = price * 2",
      output: "NAME(total) · EQUALS · NAME(price) · STAR · NUMBER(2)",
    },
    keyPoints: [
      "Groups characters into tokens (the smallest meaningful units)",
      "Discards whitespace and comments",
      "Classifies each token: keyword, identifier, number, operator…",
      "Takes the longest match when patterns overlap (e.g. >= is one token)",
    ],
  },
  {
    id: "parser",
    title: "Parser",
    subtitle: "Syntactic analysis",
    side: "frontend",
    icon: GitBranch,
    accent: "text-primary",
    analogy: "Diagramming a sentence into its grammatical structure — subject, verb, object.",
    description:
      "The parser checks that the stream of tokens follows the language's grammar and organises them into a tree that captures structure and precedence: the abstract syntax tree (AST). A syntax error is reported when the tokens can't fit any rule.",
    example: {
      input: "NAME(total) EQUALS NAME(price) STAR NUMBER(2)",
      output: "Assign(total, Multiply(price, 2))",
    },
    keyPoints: [
      "Verifies the tokens follow the grammar",
      "Builds the abstract syntax tree (AST)",
      "Encodes operator precedence and associativity",
      "Reports syntax errors with a location",
    ],
  },
  {
    id: "semantic",
    title: "Semantic analysis",
    subtitle: "Meaning & checking",
    side: "frontend",
    icon: Eye,
    accent: "text-violet-500",
    analogy: "Proofreading for sense: the grammar is fine, but does the sentence actually mean something?",
    description:
      "This phase checks that a grammatically valid program also makes sense: names are declared before use, types are compatible, and scopes resolve. It records what it learns in a symbol table and annotates the tree.",
    example: {
      input: "Assign(total, Multiply(price, 2))",
      output: "type-checked AST + symbol table { total, price : Number }",
    },
    keyPoints: [
      "Resolves names to their declarations (scopes & binding)",
      "Checks types are used consistently",
      "Builds a symbol table",
      "Catches meaning errors the grammar can't",
    ],
  },
  {
    id: "ir",
    title: "Intermediate code",
    subtitle: "A neutral middle language",
    side: "backend",
    icon: Boxes,
    accent: "text-cyan-500",
    analogy: "Translating into a simple neutral 'interlingua' before writing the final language.",
    description:
      "Rather than jump straight to the target, many compilers first lower the AST into an intermediate representation (IR): simpler, machine-independent instructions. This decouples the language from the target and gives optimizations a clean thing to work on.",
    example: {
      input: "Assign(total, Multiply(price, 2))",
      output: "t1 = price * 2\ntotal = t1",
    },
    keyPoints: [
      "Simpler than source, independent of any real machine",
      "Lets one front end target many machines",
      "A convenient level for analysis and optimization",
      "Often close to three-address or stack-based code",
    ],
  },
  {
    id: "optimizer",
    title: "Optimizer",
    subtitle: "Making it better",
    side: "backend",
    icon: Sparkles,
    accent: "text-amber-500",
    analogy: "An editor tightening a draft — same meaning, fewer words, reads faster.",
    description:
      "The optimizer rewrites the intermediate code to be faster or smaller while preserving exactly what the program does. It relies on analyses that prove a change is safe — for example, that a computed value is never used.",
    example: {
      input: "t1 = 3 * 2\ntotal = t1",
      output: "total = 6   // folded a constant, removed a temp",
    },
    keyPoints: [
      "Preserves observable behaviour exactly",
      "Constant folding, dead-code elimination, and more",
      "Driven by program analysis that proves changes safe",
      "Optional — a compiler is correct without it",
    ],
  },
  {
    id: "codegen",
    title: "Code generator",
    subtitle: "Producing the target",
    side: "backend",
    icon: Binary,
    accent: "text-emerald-500",
    analogy: "Writing the final translated text in the target language, ready to publish.",
    description:
      "The last phase turns the (optimized) intermediate code into the target language — machine code, virtual-machine bytecode, or even another high-level language — choosing concrete instructions and managing storage.",
    example: {
      input: "total = 6",
      output: "PUSH 6\nSTORE total",
    },
    keyPoints: [
      "Emits concrete instructions for the target",
      "Allocates registers / stack slots for values",
      "Target can be machine code, bytecode, or source",
      "The result is what actually runs",
    ],
  },
];

export interface GlossaryItem {
  term: string;
  definition: string;
}

export const GLOSSARY: GlossaryItem[] = [
  { term: "Token", definition: "The smallest meaningful unit of source text, e.g. a keyword, name, number or operator." },
  { term: "Lexeme", definition: "The exact run of characters in the source that a token was matched from." },
  { term: "Grammar", definition: "The rules that say how valid programs are built from tokens." },
  {
    term: "Abstract syntax tree (AST)",
    definition: "A tree capturing a program's structure, with surface details like parentheses removed.",
  },
  { term: "Symbol table", definition: "A record of the names a program declares and what is known about each." },
  {
    term: "Intermediate representation (IR)",
    definition: "A simpler, machine-independent form of the program used between the front and back ends.",
  },
  {
    term: "Optimization",
    definition: "Rewriting a program to run faster or be smaller without changing what it computes.",
  },
  { term: "Target code", definition: "The output language a compiler produces: machine code, bytecode, or source." },
  { term: "Front end", definition: "The phases that understand the source language: scanning, parsing, semantic analysis." },
  { term: "Back end", definition: "The phases that produce and improve target code: IR, optimization, code generation." },
];
