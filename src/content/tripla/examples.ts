// Curated TRIPLA example programs.

export interface Example {
  id: string;
  title: string;
  blurb: string;
  code: string;
  result: string;
  concepts: string[];
}

export const EXAMPLES: Example[] = [
  {
    id: "square",
    title: "Square",
    blurb: "The smallest useful program: one function, one call.",
    code: `let square(x) { x * x } in square(10)`,
    result: "100",
    concepts: ["function definition", "call", "arithmetic"],
  },
  {
    id: "abs",
    title: "Absolute value",
    blurb: "A conditional expression returning one of two values.",
    code: `let abs(x) {
  if (x < 0) then 0 - x else x
} in abs(0 - 7)`,
    result: "7",
    concepts: ["if/then/else", "comparison"],
  },
  {
    id: "factorial",
    title: "Recursive factorial",
    blurb: "A function that calls itself until a base case.",
    code: `let factorial(n) {
  if (n == 0) then 1
  else n * factorial(n - 1)
} in factorial(5)`,
    result: "120",
    concepts: ["recursion", "if/then/else"],
  },
  {
    id: "gcd",
    title: "Greatest common divisor",
    blurb: "Euclid's algorithm with mutual comparison and recursion.",
    code: `let ggT(a, b) {
  if (a == b) then a
  else if (a > b) then ggT(a - b, b)
  else ggT(b - a, a)
} in ggT(3528, 3780)`,
    result: "252",
    concepts: ["recursion", "nested if"],
  },
  {
    id: "nested",
    title: "Nested functions",
    blurb: "An inner function that reads the outer function's parameter — lexical scope via static links.",
    code: `let wrapper(number, threshold) {
  let square(x) {
    if (x * x > threshold) then x else x * x
  }
  in square(number)
} in wrapper(4, 10)`,
    result: "4",
    concepts: ["nested functions", "lexical scope", "static links"],
  },
  {
    id: "side-effect",
    title: "Side effects",
    blurb: "Assignment, sequencing, and an inner function mutating an outer variable.",
    code: `let f(x, y) {
  let g(x) { y = x + 7 }
  in x = g(5); y
} in f(1, 2)`,
    result: "12",
    concepts: ["assignment", "sequencing", "side effects"],
  },
];
