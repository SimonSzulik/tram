// Curated TRIPLA example programs from course project_05 triplaprograms.

export interface Example {
  id: string;
  title: string;
  blurb: string;
  code: string;
  result?: string;
}

export const EXAMPLES: Example[] = [
  {
    id: "square",
    title: "Square",
    blurb: "Single function, one call.",
    code: `// Tripla Example: Square
// Square a number
// Expected result: 100

let square(x) { x*x }
in square(10)`,
    result: "100",
  },
  {
    id: "factorial",
    title: "Factorial",
    blurb: "Recursive factorial of 5.",
    code: `// Tripla Example: Factorial
// Recursive factorial of 5
// Expected result: 120

let
  fact(n) {
    if (n == 0) then 1
    else n * fact(n - 1)
  }
in
  fact(5)`,
    result: "120",
  },
  {
    id: "side-effect",
    title: "Side effects",
    blurb: "Nested assign mutating an outer variable.",
    code: `// Tripla Example: Side effects
// Nested assign into outer y
// Expected result: 12

let f(x, y) {
	let g(x) {
		y = x + 7
	} in x = g(5); y
} in f(1, 2)`,
    result: "12",
  },
  {
    id: "while",
    title: "While loop",
    blurb: "Loop with compound condition and updates.",
    code: `// Tripla Example: While loop
// Loop until a equals b
// Expected result: 9

let func(a,b) {
        while ( a > 0 && b != a ) do {
          b = b + 1;
          a = a - 1
        }
    }
in func(10, 8)`,
    result: "9",
  },
  {
    id: "ggt-iter",
    title: "GCD (iterative)",
    blurb: "Euclid's algorithm with a while loop.",
    code: `// Tripla Example: GCD (iterative)
// Iterative Euclid GCD
// Expected result: 252

let ggT(a, b) {
    if (a == b) then
        a
    else
        while (a != b) do {
            if (a > b) then
                a = a - b
            else
                b = b - a
        };
        a
} in ggT(3528, 3780)`,
    result: "252",
  },
  {
    id: "complex",
    title: "Complex nested",
    blurb: "Recursion, nested lets, and mutual definitions.",
    code: `// Tripla Example: Complex nested
// Nested lets and recursion
// Expected result: 90000

let
f1(b) {
if(b==0) then 0 else f1(b-1)
}
f2(a, b) {
    if(a > b) then f1(a) else f1(b);
    let g(c) {
        a*b*c
    } in g(a*b)
}
in
f1(10); f2(10, let max(a, b) {
            if(a > b) then a else b
        }
        in max(20, 30))`,
    result: "90000",
  },
];
