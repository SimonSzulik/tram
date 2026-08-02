import { Header } from "@/components/Header";
import { 
  BookOpen, 
  Code, 
  Terminal, 
  Lightbulb, 
  Layers, 
  Hash, 
  GitBranch, 
  Repeat, 
  FunctionSquare, 
  ArrowRight,
  Play,
  Zap,
  Cpu,
  FileCode,
  AlertCircle,
  CheckCircle,
  Info,
  Box,
  Database,
  ArrowDown,
  ArrowUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CodeBlock = ({ children, title }: { children: string; title?: string }) => (
  <div className="bg-editor rounded-lg overflow-hidden border border-border">
    {title && (
      <div className="bg-muted/50 px-4 py-2 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{title}</span>
      </div>
    )}
    <pre className="p-4 font-mono text-sm text-editor-foreground overflow-x-auto whitespace-pre-wrap">
      {children}
    </pre>
  </div>
);

const SyntaxItem = ({ name, syntax, description }: { name: string; syntax: string; description: string }) => (
  <div className="p-4 rounded-lg bg-muted/30 border border-border">
    <div className="flex items-center gap-2 mb-2">
      <Badge variant="secondary" className="font-mono">{name}</Badge>
    </div>
    <code className="block text-sm font-mono text-primary mb-2">{syntax}</code>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const ImportantNote = ({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "tip" }) => {
  const icons = {
    info: <Info className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    tip: <Lightbulb className="h-4 w-4" />
  };
  const colors = {
    info: "border-blue-500/50 bg-blue-500/10",
    warning: "border-yellow-500/50 bg-yellow-500/10",
    tip: "border-green-500/50 bg-green-500/10"
  };
  
  return (
    <div className={`p-4 rounded-lg border ${colors[type]} flex gap-3`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
};

const TRAMRegister = ({ name, description }: { name: string; description: string }) => (
  <div className="p-3 rounded-lg bg-muted/30 border border-border flex items-center gap-3">
    <code className="font-mono text-primary font-bold">{name}</code>
    <span className="text-sm text-muted-foreground">{description}</span>
  </div>
);

const Learn = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8 animate-fade-in">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Learn Tripla</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Master the <strong>TRIPLA</strong> programming language (Trierer Programmiersprache) - 
            an educational language designed at the University of Trier to teach compiler construction. 
            After completing this guide, you'll be able to write your own Tripla programs!
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <a href="#introduction" className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Introduction
          </a>
          <a href="#getting-started" className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Getting Started
          </a>
          <a href="#syntax" className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Syntax
          </a>
          <a href="#functions" className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Functions
          </a>
          <a href="#semantics" className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Semantics
          </a>
          <a href="#grammar" className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Grammar
          </a>
          <a href="#tram" className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            TRAM Machine
          </a>
          <a href="#examples" className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Examples
          </a>
        </div>

        {/* Introduction Section */}
        <section id="introduction" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Introduction to Tripla</h2>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">What is Tripla?</h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>TRIPLA</strong> (Trierer Programmiersprache - Trier Programming Language) is a simple, 
                    expression-based programming language developed at the University of Trier for teaching 
                    compiler construction concepts.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Tripla programs compile to <strong>TRAM</strong> (Trierer Abstract Machine) - a stack-based 
                    virtual machine that executes the compiled code.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Play className="h-4 w-4" />
                    <Link to="/" className="hover:underline">Try Tripla in the interactive workspace →</Link>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <span><strong>Expression-based:</strong> Everything returns a value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <span><strong>Functions:</strong> First-class with lexical scoping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <span><strong>Control flow:</strong> if-then-else and while loops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <span><strong>Integer types:</strong> Only whole numbers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                      <span><strong>Nested functions:</strong> Access to outer scopes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <ImportantNote type="warning">
            <strong>Important Restrictions:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>No local variables - use function parameters instead</li>
              <li>All functions require at least one parameter (no parameterless functions)</li>
              <li>Both <code className="text-primary">then</code> and <code className="text-primary">else</code> branches are always required</li>
              <li>Only integers - no strings, floats, or other types</li>
            </ul>
          </ImportantNote>
        </section>

        {/* Getting Started Section */}
        <section id="getting-started" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Zap className="h-5 w-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Getting Started</h2>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your First Tripla Program</CardTitle>
              <CardDescription>Let's start with a simple example</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Step 1: A Simple Calculation</h4>
                <CodeBlock title="simple.tripla">
{`// The simplest Tripla program - just a number!
42`}
                </CodeBlock>
                <p className="mt-2 text-sm text-muted-foreground">
                  This program evaluates to <strong>42</strong>. Every Tripla program is an expression that produces a value.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Step 2: Using Operators</h4>
                <CodeBlock title="operators.tripla">
{`// Arithmetic operations
3 + 5 * 2`}
                </CodeBlock>
                <p className="mt-2 text-sm text-muted-foreground">
                  Result: <strong>13</strong> (multiplication has higher precedence than addition)
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Step 3: Your First Function</h4>
                <CodeBlock title="first-function.tripla">
{`// Define a function and call it
let double(x) {
  x + x
}
in double(21)`}
                </CodeBlock>
                <p className="mt-2 text-sm text-muted-foreground">
                  Result: <strong>42</strong>. We define a function <code>double</code> that adds a number to itself, 
                  then call it with 21.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Step 4: Conditional Expression</h4>
                <CodeBlock title="conditional.tripla">
{`// Find the maximum of two numbers
let max(a, b) {
  if a > b then a else b
}
in max(10, 25)`}
                </CodeBlock>
                <p className="mt-2 text-sm text-muted-foreground">
                  Result: <strong>25</strong>. The if-then-else returns the larger of the two numbers.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Step 5: Recursion</h4>
                <CodeBlock title="factorial.tripla">
{`// Recursive factorial function
let factorial(n) {
  if n == 0 then 1
  else n * factorial(n - 1)
}
in factorial(5)`}
                </CodeBlock>
                <p className="mt-2 text-sm text-muted-foreground">
                  Result: <strong>120</strong> (5! = 5 × 4 × 3 × 2 × 1). Functions can call themselves!
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Syntax Section */}
        <section id="syntax" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-stack-push/10">
              <Code className="h-5 w-5 text-stack-push" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Syntax</h2>
          </div>

          <Tabs defaultValue="expressions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="expressions">Expressions</TabsTrigger>
              <TabsTrigger value="operators">Operators</TabsTrigger>
              <TabsTrigger value="control">Control Flow</TabsTrigger>
              <TabsTrigger value="assignment">Assignment</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
            </TabsList>

            <TabsContent value="expressions">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Expressions</CardTitle>
                  <CardDescription>
                    In Tripla, everything is an expression that evaluates to a value.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <SyntaxItem 
                      name="Constants" 
                      syntax="42, 0, 100, -5" 
                      description="Integer literals (whole numbers, including negative)"
                    />
                    <SyntaxItem 
                      name="Variables" 
                      syntax="x, counter, myVar1" 
                      description="Identifiers starting with a letter, followed by letters/digits"
                    />
                    <SyntaxItem 
                      name="Parentheses" 
                      syntax="(a + b) * c" 
                      description="Group expressions to control evaluation order"
                    />
                    <SyntaxItem 
                      name="Sequence" 
                      syntax="expr1; expr2" 
                      description="Evaluate both, return the result of the second expression"
                    />
                  </div>
                  
                  <ImportantNote type="tip">
                    <strong>Everything is an expression!</strong> Even if-then-else and while return values. 
                    The value of a sequence <code>e1; e2</code> is the value of <code>e2</code>.
                  </ImportantNote>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="operators">
              <Card>
                <CardHeader>
                  <CardTitle>Operators</CardTitle>
                  <CardDescription>
                    Tripla supports arithmetic and comparison operators.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Hash className="h-4 w-4" /> Arithmetic Operators (AOP)
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <code className="font-mono text-primary">+</code>
                          <span className="text-sm text-muted-foreground">Addition</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <code className="font-mono text-primary">-</code>
                          <span className="text-sm text-muted-foreground">Subtraction</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <code className="font-mono text-primary">*</code>
                          <span className="text-sm text-muted-foreground">Multiplication</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <code className="font-mono text-primary">/</code>
                          <span className="text-sm text-muted-foreground">Integer Division</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <GitBranch className="h-4 w-4" /> Comparison Operators (RELOP)
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <code className="font-mono text-primary">==</code>
                          <span className="text-sm text-muted-foreground">Equal to</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <code className="font-mono text-primary">!=</code>
                          <span className="text-sm text-muted-foreground">Not equal to</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <code className="font-mono text-primary">&lt;</code>
                          <span className="text-sm text-muted-foreground">Less than</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <code className="font-mono text-primary">&gt;</code>
                          <span className="text-sm text-muted-foreground">Greater than</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 rounded-lg bg-muted/30">
                    <h4 className="text-sm font-semibold mb-3">Operator Precedence (highest to lowest)</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">* /</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">+ -</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">&lt; &gt;</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">== !=</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Example: <code className="text-primary">2 + 3 * 4</code> = 14 (not 20)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="control">
              <Card>
                <CardHeader>
                  <CardTitle>Control Flow</CardTitle>
                  <CardDescription>
                    Conditional expressions and loops.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-primary" /> If-Then-Else
                    </h4>
                    <CodeBlock title="Syntax">
{`if condition then
  expression1
else
  expression2`}
                    </CodeBlock>
                    <ImportantNote type="warning">
                      <strong>Both branches are required!</strong> There is no "if without else" in Tripla.
                      The expression returns the value of the chosen branch.
                    </ImportantNote>
                    <div className="mt-4">
                      <CodeBlock title="Example: Absolute Value">
{`// Returns the absolute value of x
let abs(x) {
  if x < 0 then 0 - x else x
}
in abs(-5)`}
                      </CodeBlock>
                      <p className="mt-2 text-sm text-muted-foreground">Result: <strong>5</strong></p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Repeat className="h-4 w-4 text-primary" /> While Loop
                    </h4>
                    <CodeBlock title="Syntax">
{`while condition do {
  body
}`}
                    </CodeBlock>
                    <ImportantNote type="info">
                      The while loop returns <strong>0</strong> when it terminates. 
                      If the condition is false initially, it returns 0 immediately.
                    </ImportantNote>
                    <div className="mt-4">
                      <CodeBlock title="Example: Sum from 1 to n">
{`// Sum numbers from 1 to n using while
let sumTo(n) {
  let result(r) { r }
      counter(c) { c }
  in result = 0;
     counter = 1;
     while counter <= n do {
       result = result + counter;
       counter = counter + 1
     };
     result
}
in sumTo(5)`}
                      </CodeBlock>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Result: <strong>15</strong> (1 + 2 + 3 + 4 + 5)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assignment">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment</CardTitle>
                  <CardDescription>
                    Modifying parameter values during execution.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CodeBlock title="Assignment Syntax">
{`variable = expression`}
                  </CodeBlock>
                  
                  <ImportantNote type="warning">
                    <strong>No local variables!</strong> You can only assign to function parameters.
                    If you need "local variables", create helper functions with parameters.
                  </ImportantNote>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-3">Pattern: Using Functions as Variables</h4>
                    <CodeBlock title="Simulating Local Variables">
{`// Since we can't have local variables, we use
// function parameters as "state holders"
let compute(x) {
  let temp(t) { t }  // t acts as a "local variable"
  in temp = x * 2;   // modify t
     temp + 10       // use t
}
in compute(5)`}
                    </CodeBlock>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Result: <strong>20</strong> (5 * 2 + 10)
                    </p>
                  </div>

                  <ImportantNote type="tip">
                    Assignment returns the assigned value, so you can chain assignments:
                    <code className="block mt-1 text-primary">a = b = 5</code> sets both a and b to 5.
                  </ImportantNote>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tokens">
              <Card>
                <CardHeader>
                  <CardTitle>Lexical Elements (Tokens)</CardTitle>
                  <CardDescription>
                    The lexer breaks source code into these token types.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm mb-2">Keywords</h4>
                      <div className="flex flex-wrap gap-1">
                        {['let', 'in', 'if', 'then', 'else', 'while', 'do'].map(kw => (
                          <code key={kw} className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">{kw}</code>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm mb-2">Identifiers (ID)</h4>
                      <p className="text-xs text-muted-foreground">
                        Start with letter, followed by letters/digits:<br/>
                        <code className="text-primary">x</code>, <code className="text-primary">myVar</code>, <code className="text-primary">count1</code>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm mb-2">Constants (CONST)</h4>
                      <p className="text-xs text-muted-foreground">
                        Integer literals:<br/>
                        <code className="text-primary">0</code>, <code className="text-primary">42</code>, <code className="text-primary">1000</code>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm mb-2">Delimiters</h4>
                      <div className="flex flex-wrap gap-1">
                        {['(', ')', '{', '}', ',', ';'].map(d => (
                          <code key={d} className="text-xs px-1.5 py-0.5 bg-muted text-foreground rounded font-mono">{d}</code>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm mb-2">Comments</h4>
                      <p className="text-xs text-muted-foreground">
                        Single-line: <code className="text-primary">// comment</code><br/>
                        Multi-line: <code className="text-primary">/* comment */</code>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm mb-2">Whitespace</h4>
                      <p className="text-xs text-muted-foreground">
                        Spaces, tabs, and newlines are ignored between tokens.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Functions Section */}
        <section id="functions" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FunctionSquare className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Functions</h2>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>The let-in Expression</CardTitle>
              <CardDescription>
                Functions are defined using let-in blocks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <CodeBlock title="Basic Syntax">
{`let functionName(param1, param2, ...) {
  body
}
in expression`}
              </CodeBlock>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="font-semibold text-sm mb-2">Declaration Part (let)</h4>
                  <p className="text-sm text-muted-foreground">
                    Define one or more functions with their parameters and body.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="font-semibold text-sm mb-2">Expression Part (in)</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the defined functions. The result of this expression is the result of the let-in.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Multiple Functions</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock title="Multiple Functions in One Block">
{`// Define multiple functions together
let add(a, b) { a + b }
    multiply(a, b) { a * b }
    square(x) { multiply(x, x) }
in add(square(3), square(4))`}
                </CodeBlock>
                <p className="mt-4 text-sm text-muted-foreground">
                  Result: <strong>25</strong> (9 + 16). Functions in the same let block can call each other.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nested Functions (Lexical Scoping)</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock title="Nested Function Example">
{`// Inner function can access outer parameters
let outer(x) {
  let inner(y) {
    x + y  // x comes from outer!
  }
  in inner(10)
}
in outer(5)`}
                </CodeBlock>
                <p className="mt-4 text-sm text-muted-foreground">
                  Result: <strong>15</strong>. The inner function has access to <code>x</code> from the 
                  enclosing <code>outer</code> function.
                </p>

                <ImportantNote type="info">
                  <strong>Lexical Scoping:</strong> A function can access all parameters from enclosing functions.
                  This is determined by where the function is defined in the source code (static), not by how 
                  it's called at runtime (dynamic).
                </ImportantNote>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parameter Shadowing</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock title="Shadowing Example">
{`// Inner x shadows outer x
let outer(x) {
  let inner(x) {
    x * 2  // This is inner's x, not outer's!
  }
  in inner(100)
}
in outer(5)`}
                </CodeBlock>
                <p className="mt-4 text-sm text-muted-foreground">
                  Result: <strong>200</strong> (100 * 2). The inner <code>x</code> shadows the outer one.
                </p>

                <ImportantNote type="warning">
                  Be careful with parameter names! If an inner function uses the same parameter name 
                  as an outer function, the outer parameter becomes inaccessible.
                </ImportantNote>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Semantics Section */}
        <section id="semantics" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-execution/10">
              <Layers className="h-5 w-5 text-execution" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Semantics</h2>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What is Semantics?</CardTitle>
              <CardDescription>
                While syntax tells us how to write valid programs, semantics tells us what they mean.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                <strong>Semantics</strong> defines the meaning of syntactically correct programs. 
                For any valid Tripla program, the semantics specifies what result it produces.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="font-semibold mb-2">Big-Step Semantics</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Evaluates an expression directly to its final value in one "big step":
                  </p>
                  <code className="block text-sm font-mono text-primary">
                    eval(expr, ρ) → (value, ρ')
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    Where ρ is the environment (variable bindings)
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="font-semibold mb-2">Small-Step Semantics</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Evaluates one step at a time, like a machine:
                  </p>
                  <code className="block text-sm font-mono text-primary">
                    (code, stack, env) → (code', stack', env')
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    TRAM uses small-step execution
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="env">
              <AccordionTrigger>Environment (Binding Environment)</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-muted-foreground">
                  An <strong>environment</strong> ρ ∈ ENV maps identifiers to values or function definitions:
                </p>
                <code className="block p-3 bg-muted/30 rounded font-mono text-sm">
                  ENV : ID ∪ (ID × N) → N ∪ (ID* × Expression)
                </code>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li><strong>Variables:</strong> mapped to their current integer values</li>
                  <li><strong>Functions:</strong> mapped to their parameter list and body expression</li>
                </ul>
                <CodeBlock title="Example Environment">
{`// After evaluating:
// let f(x) { x + 1 } in f(5)

// Environment ρ contains:
// f → (x, x + 1)  -- function definition
// x → 5           -- during call to f`}
                </CodeBlock>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="expressions">
              <AccordionTrigger>Expression Evaluation Rules</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded bg-muted/30">
                    <code className="font-mono text-sm text-primary">eval(c, ρ) = (c, ρ)</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Constants:</strong> A constant evaluates to itself.
                    </p>
                  </div>
                  <div className="p-3 rounded bg-muted/30">
                    <code className="font-mono text-sm text-primary">eval(x, ρ) = (ρ(x), ρ)</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Variables:</strong> Look up the value in the environment.
                    </p>
                  </div>
                  <div className="p-3 rounded bg-muted/30">
                    <code className="font-mono text-sm text-primary">eval(e1 op e2, ρ) = (v1 op v2, ρ2)</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Binary Operations:</strong> Evaluate left, then right, then apply operator.
                    </p>
                  </div>
                  <div className="p-3 rounded bg-muted/30">
                    <code className="font-mono text-sm text-primary">eval(x = e, ρ) = (v, ρ[x ↦ v])</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Assignment:</strong> Evaluate expression, update environment, return value.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="control-flow">
              <AccordionTrigger>Control Flow Semantics</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded bg-muted/30">
                    <h4 className="font-semibold text-sm mb-1">Sequence (e1; e2)</h4>
                    <p className="text-sm text-muted-foreground">
                      Evaluate e1 (for side effects), then e2. Return the result of e2.
                    </p>
                  </div>
                  <div className="p-3 rounded bg-muted/30">
                    <h4 className="font-semibold text-sm mb-1">If-Then-Else</h4>
                    <p className="text-sm text-muted-foreground">
                      Evaluate condition. If non-zero (true), evaluate then-branch; otherwise else-branch.
                    </p>
                    <code className="block mt-2 font-mono text-xs text-primary">
                      eval(if B then E1 else E2, ρ) = eval(E1, ρ') if v ≠ 0<br/>
                      eval(if B then E1 else E2, ρ) = eval(E2, ρ') if v = 0
                    </code>
                  </div>
                  <div className="p-3 rounded bg-muted/30">
                    <h4 className="font-semibold text-sm mb-1">While Loop</h4>
                    <p className="text-sm text-muted-foreground">
                      Evaluate condition. If true, evaluate body and repeat. If false, return 0.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="functions-sem">
              <AccordionTrigger>Function Call Semantics</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="p-3 rounded bg-muted/30">
                  <h4 className="font-semibold text-sm mb-2">Function Call f(e1, ..., en)</h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    <li>Look up f in environment to get parameters (x1, ..., xn) and body</li>
                    <li>Evaluate all arguments e1, ..., en to get values v1, ..., vn</li>
                    <li>Extend environment: ρ' = ρ[x1 ↦ v1, ..., xn ↦ vn]</li>
                    <li>Evaluate function body in extended environment</li>
                    <li>Return the result (the last expression in the body)</li>
                  </ol>
                </div>
                
                <ImportantNote type="info">
                  <strong>No explicit return!</strong> The value of a function is the value of its body expression.
                  There's no <code>return</code> statement in Tripla.
                </ImportantNote>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Grammar Section */}
        <section id="grammar" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Formal Grammar</h2>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Context-Free Grammars</CardTitle>
              <CardDescription>
                Grammars formally define the syntactic structure of programming languages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                A <strong>context-free grammar</strong> G = (N, T, P, S) consists of:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 rounded bg-muted/30">
                  <code className="text-primary font-mono font-bold">N</code>
                  <span className="text-sm text-muted-foreground"> - Non-terminal symbols (variables)</span>
                </div>
                <div className="p-3 rounded bg-muted/30">
                  <code className="text-primary font-mono font-bold">T</code>
                  <span className="text-sm text-muted-foreground"> - Terminal symbols (tokens)</span>
                </div>
                <div className="p-3 rounded bg-muted/30">
                  <code className="text-primary font-mono font-bold">P</code>
                  <span className="text-sm text-muted-foreground"> - Production rules</span>
                </div>
                <div className="p-3 rounded bg-muted/30">
                  <code className="text-primary font-mono font-bold">S</code>
                  <span className="text-sm text-muted-foreground"> - Start symbol</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The <strong>language</strong> L(G) = {"{ w | S →* w }"} is the set of all strings derivable from S.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>G<sub>TRIPLA</sub> - The Tripla Grammar</CardTitle>
              <CardDescription>
                The formal grammar defining valid Tripla programs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="space-y-2">
                  <div className="text-muted-foreground">// Expression productions (E is the start symbol)</div>
                  <div><span className="text-primary font-bold">E</span> <span className="text-muted-foreground">→</span> <span className="text-yellow-500">let</span> D <span className="text-yellow-500">in</span> E</div>
                  <div className="pl-4">| ID</div>
                  <div className="pl-4">| ID <span className="text-muted-foreground">(</span> A <span className="text-muted-foreground">)</span></div>
                  <div className="pl-4">| E AOP E</div>
                  <div className="pl-4">| <span className="text-muted-foreground">(</span> E <span className="text-muted-foreground">)</span></div>
                  <div className="pl-4">| CONST</div>
                  <div className="pl-4">| ID <span className="text-muted-foreground">=</span> E</div>
                  <div className="pl-4">| E <span className="text-muted-foreground">;</span> E</div>
                  <div className="pl-4">| <span className="text-yellow-500">if</span> B <span className="text-yellow-500">then</span> E <span className="text-yellow-500">else</span> E</div>
                  <div className="pl-4">| <span className="text-yellow-500">while</span> B <span className="text-yellow-500">do</span> <span className="text-muted-foreground">{"{"}</span> E <span className="text-muted-foreground">{"}"}</span></div>
                  
                  <div className="mt-4 text-muted-foreground">// Arguments</div>
                  <div><span className="text-primary font-bold">A</span> <span className="text-muted-foreground">→</span> E | A <span className="text-muted-foreground">,</span> E</div>
                  
                  <div className="mt-4 text-muted-foreground">// Declarations (function definitions)</div>
                  <div><span className="text-primary font-bold">D</span> <span className="text-muted-foreground">→</span> ID <span className="text-muted-foreground">(</span> V <span className="text-muted-foreground">)</span> <span className="text-muted-foreground">{"{"}</span> E <span className="text-muted-foreground">{"}"}</span> | D D</div>
                  
                  <div className="mt-4 text-muted-foreground">// Parameters</div>
                  <div><span className="text-primary font-bold">V</span> <span className="text-muted-foreground">→</span> ID | V <span className="text-muted-foreground">,</span> ID</div>
                  
                  <div className="mt-4 text-muted-foreground">// Boolean expressions (conditions)</div>
                  <div><span className="text-primary font-bold">B</span> <span className="text-muted-foreground">→</span> E | E RELOP E</div>
                  
                  <div className="mt-4 text-muted-foreground">// Terminal symbols</div>
                  <div><span className="text-green-500">ID</span>: identifier (letter followed by letters/digits)</div>
                  <div><span className="text-green-500">CONST</span>: integer constant</div>
                  <div><span className="text-green-500">AOP</span>: arithmetic operators (+, -, *, /)</div>
                  <div><span className="text-green-500">RELOP</span>: relational operators (==, !=, &lt;, &gt;)</div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
                <h4 className="font-semibold text-sm mb-2">Reading Production Rules</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <code className="text-primary">→</code> means "can be replaced by"</li>
                  <li>• <code className="text-primary">|</code> means "or" (alternative production)</li>
                  <li>• <span className="text-yellow-500">Yellow</span> words are keywords (terminals)</li>
                  <li>• <span className="text-green-500">Green</span> words are token types (terminals)</li>
                  <li>• <span className="text-primary font-bold">Blue bold</span> letters are non-terminals</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* TRAM Machine Section */}
        <section id="tram" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-stack-pop/10">
              <Cpu className="h-5 w-5 text-stack-pop" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">TRAM - The Target Machine</h2>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>TRAM Overview</CardTitle>
              <CardDescription>
                TRAM (Trierer Abstract Machine) is a stack-based virtual machine that executes compiled Tripla code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Tripla compiler translates source code into TRAM instructions. TRAM is a 
                <strong> stack-based machine</strong>, meaning it uses a stack for all operations 
                instead of registers.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3">TRAM Registers</h4>
                  <div className="space-y-2">
                    <TRAMRegister name="PC" description="Program Counter - points to current instruction" />
                    <TRAMRegister name="TOP" description="Stack pointer - points to top of stack" />
                    <TRAMRegister name="PP" description="Parameter Pointer - base for parameters" />
                    <TRAMRegister name="FP" description="Frame Pointer - base of current stack frame" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Execution Model</h4>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <pre className="font-mono text-sm text-muted-foreground">
{`while (PC >= 0) {
  execute(program[PC]);
}`}
                    </pre>
                    <p className="text-xs text-muted-foreground mt-2">
                      TRAM executes instructions sequentially until PC becomes negative (HALT).
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TRAM Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stack" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
                  <TabsTrigger value="stack">Stack Operations</TabsTrigger>
                  <TabsTrigger value="arithmetic">Arithmetic</TabsTrigger>
                  <TabsTrigger value="control">Control Flow</TabsTrigger>
                  <TabsTrigger value="functions">Functions</TabsTrigger>
                </TabsList>

                <TabsContent value="stack">
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-muted/30">
                      <div className="flex items-center gap-3">
                        <code className="font-mono text-primary font-bold">CONST k</code>
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Push constant k onto the stack. TOP = TOP + 1; STACK[TOP] = k
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <div className="flex items-center gap-3">
                        <code className="font-mono text-primary font-bold">LOAD k d</code>
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Load variable at offset k from frame at depth d. Push value onto stack.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <div className="flex items-center gap-3">
                        <code className="font-mono text-primary font-bold">STORE k d</code>
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pop top value and store at offset k in frame at depth d.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <div className="flex items-center gap-3">
                        <code className="font-mono text-primary font-bold">POP</code>
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Remove top value from stack. TOP = TOP - 1
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="arithmetic">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">ADD</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pop two values, push their sum. STACK[TOP-1] = STACK[TOP-1] + STACK[TOP]
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">SUB</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pop two values, push difference.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">MUL</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pop two values, push product.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">DIV</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pop two values, push quotient (integer division).
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">LT / GT</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Compare: push 1 if true, 0 if false.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">EQ / NEQ</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Equality check: push 1 if equal/not-equal, 0 otherwise.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="control">
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">GOTO L</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Unconditional jump. PC = L
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">IFZERO L</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pop top; if zero, jump to L. Otherwise continue to next instruction.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">NOP</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        No operation. Just advance PC.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">HALT</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stop execution. PC = -1
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="functions">
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">INVOKE n L d</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Call function at label L with n arguments. d is the static nesting difference.
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary font-bold">RETURN</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Return from function. Restores PC, PP, FP from stack frame.
                      </p>
                    </div>
                    
                    <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Database className="h-4 w-4" /> Stack Frame Structure
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        When INVOKE is called, a new stack frame is created:
                      </p>
                      <div className="font-mono text-xs bg-muted/30 p-3 rounded">
                        <div className="grid grid-cols-2 gap-1">
                          <div>PP<sub>new</sub></div><div className="text-muted-foreground">→ First parameter</div>
                          <div>p<sub>1</sub>...p<sub>n</sub></div><div className="text-muted-foreground">→ Parameters</div>
                          <div>PC<sub>ret</sub></div><div className="text-muted-foreground">→ Return address</div>
                          <div>PP<sub>old</sub></div><div className="text-muted-foreground">→ Saved PP</div>
                          <div>FP<sub>old</sub></div><div className="text-muted-foreground">→ Saved FP</div>
                          <div>PP<sub>static</sub></div><div className="text-muted-foreground">→ Static link PP</div>
                          <div>FP<sub>static</sub></div><div className="text-muted-foreground">→ Static link FP</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Examples Section */}
        <section id="examples" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-stack-push/10">
              <Terminal className="h-5 w-5 text-stack-push" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Complete Examples</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Try these examples in the <Link to="/" className="text-primary hover:underline">interactive workspace</Link>!
          </p>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Example 1: Factorial (Recursive)</CardTitle>
                <CardDescription>The classic recursive function</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock title="factorial.tripla">
{`// Computes n! = n × (n-1) × ... × 1
let factorial(n) {
  if n == 0 then 1
  else n * factorial(n - 1)
}
in factorial(5)`}
                </CodeBlock>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 120 (5! = 5 × 4 × 3 × 2 × 1)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example 2: Fibonacci</CardTitle>
                <CardDescription>Double recursion</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock title="fibonacci.tripla">
{`// The nth Fibonacci number
let fib(n) {
  if n <= 1 then n
  else fib(n - 1) + fib(n - 2)
}
in fib(10)`}
                </CodeBlock>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 55 (the 10th Fibonacci number: 0,1,1,2,3,5,8,13,21,34,55)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example 3: Greatest Common Divisor</CardTitle>
                <CardDescription>Euclidean algorithm</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock title="gcd.tripla">
{`// Euclidean algorithm for GCD
let gcd(a, b) {
  if b == 0 then a
  else gcd(b, a - (a / b) * b)
}
in gcd(48, 18)`}
                </CodeBlock>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 6 (GCD of 48 and 18)
                  </p>
                </div>
                <ImportantNote type="tip">
                  Note: <code>a - (a / b) * b</code> computes the modulo since Tripla only has integer division.
                </ImportantNote>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example 4: Power Function</CardTitle>
                <CardDescription>Computing x^n</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock title="power.tripla">
{`// Computes base^exp
let power(base, exp) {
  if exp == 0 then 1
  else base * power(base, exp - 1)
}
in power(2, 10)`}
                </CodeBlock>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 1024 (2^10)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example 5: Multiple Functions</CardTitle>
                <CardDescription>Functions calling each other</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock title="multi.tripla">
{`// Multiple functions working together
let max(a, b) {
  if a > b then a else b
}
min(a, b) {
  if a < b then a else b
}
diff(a, b) {
  max(a, b) - min(a, b)
}
in diff(15, 7)`}
                </CodeBlock>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 8 (|15 - 7|)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example 6: Nested Functions with Closures</CardTitle>
                <CardDescription>Accessing outer scope variables</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock title="nested.tripla">
{`// Nested function accessing outer parameters
let makeAdder(x) {
  let add(y) {
    x + y  // x from outer scope!
  }
  in add(10)
}
in makeAdder(5)`}
                </CodeBlock>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 15 (5 + 10)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example 7: While Loop with State</CardTitle>
                <CardDescription>Imperative-style computation</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock title="sumloop.tripla">
{`// Sum from 1 to n using a while loop
let sumTo(n) {
  let result(r) { r }
      i(x) { x }
  in result = 0;
     i = 1;
     while i <= n do {
       result = result + i;
       i = i + 1
     };
     result
}
in sumTo(10)`}
                </CodeBlock>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 55 (1+2+3+4+5+6+7+8+9+10)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Practice CTA */}
        <section className="mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Ready to Practice?</h2>
                <p className="text-muted-foreground mb-4">
                  Try the examples above in our interactive Tripla workspace with real-time compilation and execution!
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Play className="h-5 w-5" />
                  Open Workspace
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>TRIPLA Compiler IDE - Based on lectures at University of Trier</p>
          <p className="mt-1">Prof. Dr. Stephan Diehl - Übersetzung und Analyse von Programmen</p>
        </div>
      </footer>
    </div>
  );
};

export default Learn;
