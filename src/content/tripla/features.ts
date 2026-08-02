// Data for the Learn TRIPLA "feature explorer" — one entry per language feature.

import {
  Calculator,
  Variable,
  GitFork,
  Repeat,
  FunctionSquare,
  Recycle,
  Boxes,
  type LucideIcon,
} from "lucide-react";

export interface Feature {
  id: string;
  label: string;
  icon: LucideIcon;
  /** One-line summary shown under the title. */
  tagline: string;
  /** Explanation paragraphs. */
  paragraphs: string[];
  /** A copyable example program. */
  example: string;
  result: string;
}

export const FEATURES: Feature[] = [
  {
    id: "values",
    label: "Values & arithmetic",
    icon: Calculator,
    tagline: "Integers and the four arithmetic operators.",
    paragraphs: [
      "TRIPLA's only runtime values are integers. You combine them with +, -, * and /, and grouping with parentheses works as you'd expect.",
      "Multiplication and division bind tighter than addition and subtraction, so 2 + 3 * 4 is 14, not 20. Division truncates toward zero.",
    ],
    example: `let compute(x) { 2 + 3 * 4 } in compute(0)`,
    result: "14",
  },
  {
    id: "variables",
    label: "Variables & assignment",
    icon: Variable,
    tagline: "Parameters are mutable, and assignment is itself an expression.",
    paragraphs: [
      "A function's parameters act as its local variables. You can reassign them with name = expression.",
      "Assignment is an expression: it stores the value and also yields it, so it can appear anywhere a value is expected.",
    ],
    example: `let f(x) { x = x + 1 } in f(41)`,
    result: "42",
  },
  {
    id: "conditionals",
    label: "if / then / else",
    icon: GitFork,
    tagline: "A conditional that chooses between two values.",
    paragraphs: [
      "if condition then A else B evaluates the condition, then yields A or B. The else branch is mandatory — because an if is an expression, it must always produce a value.",
      "Conditions are built from comparisons (==, !=, <, >, <=, >=) combined with && and ||.",
    ],
    example: `let abs(x) {
  if (x < 0) then 0 - x else x
} in abs(0 - 7)`,
    result: "7",
  },
  {
    id: "loops",
    label: "while loops",
    icon: Repeat,
    tagline: "Repeat a body while a condition holds.",
    paragraphs: [
      "while condition do { body } repeats the body as long as the condition is true. Like everything else it is an expression, and is normally used for its effect on variables.",
      "Combine it with sequencing (;) to run the loop and then produce a final result.",
    ],
    example: `let countdown(n) {
  while (n > 0) do { n = n - 1 }; n
} in countdown(5)`,
    result: "0",
  },
  {
    id: "functions",
    label: "Functions",
    icon: FunctionSquare,
    tagline: "Define functions in let … in and call them.",
    paragraphs: [
      "Functions are declared inside a let block: name(params) { body }. The program value is the expression after in.",
      "Several functions can be declared together and may call one another.",
    ],
    example: `let
  add(a, b) { a + b }
  square(x) { x * x }
in
  add(square(3), square(4))`,
    result: "25",
  },
  {
    id: "recursion",
    label: "Recursion",
    icon: Recycle,
    tagline: "A function that calls itself.",
    paragraphs: [
      "A function may call itself. As long as there is a base case that stops the recursion, this expresses repetition naturally.",
      "The classic example is the factorial: n! = n × (n−1)!, stopping at 0! = 1.",
    ],
    example: `let factorial(n) {
  if (n == 0) then 1
  else n * factorial(n - 1)
} in factorial(5)`,
    result: "120",
  },
  {
    id: "scope",
    label: "Nested scope",
    icon: Boxes,
    tagline: "Functions inside functions, with lexical scope.",
    paragraphs: [
      "A function body can contain its own let, creating a nested function. Inner functions can read and write the variables of the function that encloses them.",
      "Names resolve lexically — to the nearest enclosing declaration — which is what makes nested helpers so useful.",
    ],
    example: `let outer(x) {
  let inner(y) { x + y }
  in inner(10)
} in outer(5)`,
    result: "15",
  },
];
