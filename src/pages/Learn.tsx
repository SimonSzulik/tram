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
  FileCode
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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
            Master the Tripla programming language - a simple, educational language designed to teach 
            compiler concepts. After completing this guide, you will be able to write your own Tripla programs.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <a href="#introduction" className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Introduction
          </a>
          <a href="#syntax" className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Syntax
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
                    <strong>Tripla</strong> (Trierer Programmiersprache - Trier Programming Language) is an educational 
                    programming language designed at the University of Trier to teach compiler construction concepts.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    It is a simple, expression-based functional language that compiles to <strong>TRAM</strong> 
                    (Trierer Abstract Machine) - a stack-based virtual machine.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Play className="h-4 w-4" />
                    <Link to="/" className="hover:underline">Try Tripla in the interactive workspace</Link>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <span><strong>Expression-based:</strong> Everything is an expression that returns a value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <span><strong>Functions:</strong> First-class functions with lexical scoping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <span><strong>Imperative constructs:</strong> Assignment, if-then-else, while loops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <span><strong>Simple types:</strong> Integers and booleans</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Your First Tripla Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock title="hello.tripla">
{`// A simple Tripla program
let factorial(n) {
  if n == 0 then 1
  else n * factorial(n - 1)
}
in factorial(5)`}
              </CodeBlock>
              <p className="mt-4 text-muted-foreground">
                This program defines a factorial function and calls it with the argument 5. 
                The result is 120 (5! = 5 × 4 × 3 × 2 × 1 = 120).
              </p>
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
              <TabsTrigger value="functions">Functions</TabsTrigger>
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
                      syntax="42, 0, 100" 
                      description="Integer literals (whole numbers)"
                    />
                    <SyntaxItem 
                      name="Booleans" 
                      syntax="true, false" 
                      description="Boolean values for logical operations"
                    />
                    <SyntaxItem 
                      name="Variables" 
                      syntax="x, counter, myVar" 
                      description="Identifiers starting with a letter, containing letters and digits"
                    />
                    <SyntaxItem 
                      name="Parentheses" 
                      syntax="(expression)" 
                      description="Group expressions and control evaluation order"
                    />
                    <SyntaxItem 
                      name="Assignment" 
                      syntax="x = 5" 
                      description="Assigns a value to a variable and returns the value"
                    />
                    <SyntaxItem 
                      name="Sequence" 
                      syntax="expr1; expr2" 
                      description="Evaluates both expressions, returns the result of the second"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="operators">
              <Card>
                <CardHeader>
                  <CardTitle>Operators</CardTitle>
                  <CardDescription>
                    Tripla supports arithmetic and comparison operators with standard precedence.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Hash className="h-4 w-4" /> Arithmetic Operators
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
                          <span className="text-sm text-muted-foreground">Division</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <GitBranch className="h-4 w-4" /> Comparison Operators
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
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <code className="font-mono text-primary">&lt;=</code>
                          <span className="text-sm text-muted-foreground">Less than or equal</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <code className="font-mono text-primary">&gt;=</code>
                          <span className="text-sm text-muted-foreground">Greater than or equal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-3">Operator Precedence (highest to lowest)</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">* /</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">+ -</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">&lt; &gt; &lt;= &gt;=</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">== !=</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">&&</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">||</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="control">
              <Card>
                <CardHeader>
                  <CardTitle>Control Flow</CardTitle>
                  <CardDescription>
                    Tripla provides conditional expressions and loops.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-primary" /> If-Then-Else
                    </h4>
                    <CodeBlock title="Conditional Expression">
{`if condition then
  expression1
else
  expression2`}
                    </CodeBlock>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Important:</strong> Both <code className="text-primary">then</code> and <code className="text-primary">else</code> branches 
                      are required. The expression returns the value of the chosen branch.
                    </p>
                    <CodeBlock title="Example">
{`// Returns the absolute value
if x < 0 then 0 - x else x`}
                    </CodeBlock>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Repeat className="h-4 w-4 text-primary" /> While Loop
                    </h4>
                    <CodeBlock title="While Loop Syntax">
{`while condition do {
  body
}`}
                    </CodeBlock>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Executes the body as long as the condition is true. Returns 0 when the loop ends.
                    </p>
                    <CodeBlock title="Example">
{`// Sum numbers from 1 to 10
let sum(n) {
  let result(r) { r }
  acc(a) { a }
  in result = 0;
     acc = 1;
     while acc <= n do {
       result = result + acc;
       acc = acc + 1
     };
     result
}
in sum(10)`}
                    </CodeBlock>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="functions">
              <Card>
                <CardHeader>
                  <CardTitle>Functions</CardTitle>
                  <CardDescription>
                    Functions are defined using the let-in construct.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <FunctionSquare className="h-4 w-4 text-primary" /> Function Definition
                    </h4>
                    <CodeBlock title="Syntax">
{`let functionName(param1, param2, ...) {
  body
}
in expression`}
                    </CodeBlock>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Functions are declared in the <code className="text-primary">let</code> block and used in the 
                      <code className="text-primary"> in</code> expression.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Multiple Function Definitions</h4>
                    <CodeBlock title="Multiple Functions">
{`let add(a, b) { a + b }
    multiply(a, b) { a * b }
    square(x) { multiply(x, x) }
in add(square(3), square(4))`}
                    </CodeBlock>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Multiple functions can be defined in the same let block. They can call each other.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Recursive Functions</h4>
                    <CodeBlock title="Recursion Example">
{`let fib(n) {
  if n <= 1 then n
  else fib(n - 1) + fib(n - 2)
}
in fib(10)`}
                    </CodeBlock>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Functions can call themselves recursively.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Nested Let Expressions</h4>
                    <CodeBlock title="Nested Functions">
{`let outer(x) {
  let inner(y) { x + y }
  in inner(10)
}
in outer(5)`}
                    </CodeBlock>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Functions can be nested. Inner functions have access to variables from outer scopes (lexical scoping).
                    </p>
                  </div>
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
                        {['let', 'in', 'if', 'then', 'else', 'while', 'do', 'true', 'false'].map(kw => (
                          <code key={kw} className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">{kw}</code>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm mb-2">Identifiers</h4>
                      <p className="text-xs text-muted-foreground">
                        Start with letter, followed by letters/digits: <code className="text-primary">x</code>, <code className="text-primary">myVar</code>, <code className="text-primary">count1</code>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm mb-2">Constants</h4>
                      <p className="text-xs text-muted-foreground">
                        Integer literals: <code className="text-primary">0</code>, <code className="text-primary">42</code>, <code className="text-primary">1000</code>
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
                        Single-line: <code className="text-primary">// comment</code><br />
                        Multi-line: <code className="text-primary">/* comment */</code>
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <h4 className="font-semibold text-sm mb-2">Whitespace</h4>
                      <p className="text-xs text-muted-foreground">
                        Spaces, tabs, and newlines are ignored (except in strings).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
                Semantics defines the meaning of valid programs - what happens when they execute.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                While syntax tells us <em>how to write</em> valid programs, semantics tells us 
                <em> what they mean</em>. For every syntactically correct program, the semantics 
                defines what result it produces.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="font-semibold mb-2">Big-Step Semantics</h4>
                  <p className="text-sm text-muted-foreground">
                    Describes evaluation as a single relation from expression to final value:
                  </p>
                  <code className="block mt-2 text-sm font-mono text-primary">
                    eval(expr, env) → (value, new_env)
                  </code>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="font-semibold mb-2">Small-Step Semantics</h4>
                  <p className="text-sm text-muted-foreground">
                    Describes evaluation as a sequence of small steps (state transitions):
                  </p>
                  <code className="block mt-2 text-sm font-mono text-primary">
                    step(code, stack, env) → (code', stack', env')
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="env">
              <AccordionTrigger>Environment and Bindings</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p className="text-muted-foreground">
                  An <strong>environment</strong> (or binding environment) maps variable names to their values 
                  and function names to their definitions. When you evaluate an expression, you do so in the 
                  context of an environment.
                </p>
                <CodeBlock title="Environment Example">
{`// Environment: { x → 5, y → 10 }
// Evaluating: x + y
// Result: 15

// Environment: { square → ((x), x * x) }
// Evaluating: square(4)  
// Result: 16`}
                </CodeBlock>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="expressions">
              <AccordionTrigger>Expression Evaluation Rules</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded bg-muted/30">
                    <code className="font-mono text-sm text-primary">eval(c, ρ) = (c, ρ)</code>
                    <p className="text-sm text-muted-foreground mt-1">A constant evaluates to itself.</p>
                  </div>
                  <div className="p-3 rounded bg-muted/30">
                    <code className="font-mono text-sm text-primary">eval(x, ρ) = (ρ(x), ρ)</code>
                    <p className="text-sm text-muted-foreground mt-1">A variable evaluates to its value in the environment.</p>
                  </div>
                  <div className="p-3 rounded bg-muted/30">
                    <code className="font-mono text-sm text-primary">eval(e1 op e2, ρ) = (op(v1, v2), ρ2)</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Binary operations: evaluate left, then right, then apply operator.
                    </p>
                  </div>
                  <div className="p-3 rounded bg-muted/30">
                    <code className="font-mono text-sm text-primary">eval(x = e, ρ) = (v, ρ[x/v])</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Assignment: evaluate expression, update environment with new binding.
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
                      Evaluate e1, then e2. Return the result of e2. The result of e1 is discarded.
                    </p>
                  </div>
                  <div className="p-3 rounded bg-muted/30">
                    <h4 className="font-semibold text-sm mb-1">If-Then-Else</h4>
                    <p className="text-sm text-muted-foreground">
                      Evaluate condition. If true, evaluate and return then-branch. 
                      If false, evaluate and return else-branch.
                    </p>
                  </div>
                  <div className="p-3 rounded bg-muted/30">
                    <h4 className="font-semibold text-sm mb-1">While Loop</h4>
                    <p className="text-sm text-muted-foreground">
                      Evaluate condition. If true, evaluate body, then repeat. 
                      If false, return 0 and stop.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="functions-sem">
              <AccordionTrigger>Function Semantics</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="p-3 rounded bg-muted/30">
                  <h4 className="font-semibold text-sm mb-1">Let-In Expression</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The let expression adds function definitions to the environment, then evaluates the body.
                  </p>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    <li>Extend environment with all function definitions</li>
                    <li>Evaluate the body expression in the extended environment</li>
                    <li>Restore the original environment (for function bindings)</li>
                    <li>Return the result</li>
                  </ol>
                </div>
                <div className="p-3 rounded bg-muted/30">
                  <h4 className="font-semibold text-sm mb-1">Function Call</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    When calling <code className="text-primary">f(e1, ..., en)</code>:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    <li>Look up f in environment to get parameters (x1, ..., xn) and body</li>
                    <li>Evaluate all arguments e1, ..., en to get values v1, ..., vn</li>
                    <li>Extend environment with parameter bindings: xi → vi</li>
                    <li>Evaluate function body in extended environment</li>
                    <li>Restore original parameter values in environment</li>
                    <li>Return the result</li>
                  </ol>
                </div>
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
                Grammars define the syntactic structure of programming languages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                A <strong>context-free grammar</strong> G = (S, N, T, P) consists of:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 rounded bg-muted/30">
                  <code className="text-primary font-mono">S</code>
                  <span className="text-sm text-muted-foreground"> - Start symbol</span>
                </div>
                <div className="p-3 rounded bg-muted/30">
                  <code className="text-primary font-mono">N</code>
                  <span className="text-sm text-muted-foreground"> - Non-terminal symbols</span>
                </div>
                <div className="p-3 rounded bg-muted/30">
                  <code className="text-primary font-mono">T</code>
                  <span className="text-sm text-muted-foreground"> - Terminal symbols (tokens)</span>
                </div>
                <div className="p-3 rounded bg-muted/30">
                  <code className="text-primary font-mono">P</code>
                  <span className="text-sm text-muted-foreground"> - Production rules</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tripla Grammar</CardTitle>
              <CardDescription>
                The formal grammar defining valid Tripla programs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="space-y-2">
                  <div className="text-muted-foreground">// Expression productions</div>
                  <div><span className="text-primary">E</span> <span className="text-muted-foreground">→</span> <span className="text-execution">let</span> D <span className="text-execution">in</span> E</div>
                  <div>  | ID</div>
                  <div>  | ID <span className="text-muted-foreground">(</span> A <span className="text-muted-foreground">)</span></div>
                  <div>  | E AOP E</div>
                  <div>  | <span className="text-muted-foreground">(</span> E <span className="text-muted-foreground">)</span></div>
                  <div>  | CONST</div>
                  <div>  | ID <span className="text-muted-foreground">=</span> E</div>
                  <div>  | E <span className="text-muted-foreground">;</span> E</div>
                  <div>  | <span className="text-execution">if</span> B <span className="text-execution">then</span> E <span className="text-execution">else</span> E</div>
                  <div>  | <span className="text-execution">while</span> B <span className="text-execution">do</span> <span className="text-muted-foreground">{"{"}</span> E <span className="text-muted-foreground">{"}"}</span></div>
                  <div className="mt-4 text-muted-foreground">// Arguments</div>
                  <div><span className="text-primary">A</span> <span className="text-muted-foreground">→</span> E | A <span className="text-muted-foreground">,</span> E</div>
                  <div className="mt-4 text-muted-foreground">// Declarations (functions)</div>
                  <div><span className="text-primary">D</span> <span className="text-muted-foreground">→</span> ID <span className="text-muted-foreground">(</span> V <span className="text-muted-foreground">)</span> <span className="text-muted-foreground">{"{"}</span> E <span className="text-muted-foreground">{"}"}</span> | D D</div>
                  <div className="mt-4 text-muted-foreground">// Parameters</div>
                  <div><span className="text-primary">V</span> <span className="text-muted-foreground">→</span> ID | V <span className="text-muted-foreground">,</span> V</div>
                  <div className="mt-4 text-muted-foreground">// Boolean expressions</div>
                  <div><span className="text-primary">B</span> <span className="text-muted-foreground">→</span> E | E RELOP E</div>
                  <div className="mt-4 text-muted-foreground">// Terminal symbols</div>
                  <div><span className="text-stack-push">ID</span>: identifier (letter followed by letters/digits)</div>
                  <div><span className="text-stack-push">CONST</span>: integer constant</div>
                  <div><span className="text-stack-push">AOP</span>: arithmetic operators (+, -, *, /)</div>
                  <div><span className="text-stack-push">RELOP</span>: relational operators (==, !=, &lt;, &gt;)</div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
                <h4 className="font-semibold text-sm mb-2">Understanding the Grammar</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <code className="text-primary">→</code> means "can be replaced by"</li>
                  <li>• <code className="text-primary">|</code> means "or" (alternative)</li>
                  <li>• <span className="text-execution">Bold</span> words are keywords</li>
                  <li>• UPPERCASE words are token types</li>
                  <li>• The language L(G) = {"{ w | E →* w }"} is all strings derivable from E</li>
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
              <CardTitle>About TRAM</CardTitle>
              <CardDescription>
                TRAM (Trierer Abstract Machine) is the stack-based virtual machine that executes Tripla code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Tripla compiler translates source code into TRAM instructions. TRAM is a 
                <strong> stack-based machine</strong>, meaning it uses a stack to store operands and 
                intermediate results instead of registers.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                  <Terminal className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold">Stack-Based</h4>
                  <p className="text-xs text-muted-foreground mt-1">Operations use values from the stack</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                  <ArrowRight className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold">Sequential</h4>
                  <p className="text-xs text-muted-foreground mt-1">Instructions executed in order</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                  <Layers className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold">Frame-Based</h4>
                  <p className="text-xs text-muted-foreground mt-1">Stack frames for function calls</p>
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
                  <TabsTrigger value="stack">Stack</TabsTrigger>
                  <TabsTrigger value="arithmetic">Arithmetic</TabsTrigger>
                  <TabsTrigger value="control">Control</TabsTrigger>
                  <TabsTrigger value="functions">Functions</TabsTrigger>
                </TabsList>

                <TabsContent value="stack">
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">CONST k</code>
                      <p className="text-sm text-muted-foreground mt-1">Push constant k onto the stack</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">LOAD k d</code>
                      <p className="text-sm text-muted-foreground mt-1">Load variable at offset k, depth d onto stack</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">STORE k d</code>
                      <p className="text-sm text-muted-foreground mt-1">Store top of stack to variable at offset k, depth d</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">POP</code>
                      <p className="text-sm text-muted-foreground mt-1">Remove top value from stack</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="arithmetic">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">ADD</code>
                      <p className="text-sm text-muted-foreground mt-1">Pop two values, push their sum</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">SUB</code>
                      <p className="text-sm text-muted-foreground mt-1">Pop two values, push difference</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">MUL</code>
                      <p className="text-sm text-muted-foreground mt-1">Pop two values, push product</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">DIV</code>
                      <p className="text-sm text-muted-foreground mt-1">Pop two values, push quotient</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">EQ</code>
                      <p className="text-sm text-muted-foreground mt-1">Pop two, push 1 if equal, 0 otherwise</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">LT / GT</code>
                      <p className="text-sm text-muted-foreground mt-1">Compare values (less than / greater than)</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="control">
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">GOTO L</code>
                      <p className="text-sm text-muted-foreground mt-1">Jump to label L unconditionally</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">IFZERO L</code>
                      <p className="text-sm text-muted-foreground mt-1">Pop top; if zero, jump to label L</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">NOP</code>
                      <p className="text-sm text-muted-foreground mt-1">No operation (do nothing)</p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">HALT</code>
                      <p className="text-sm text-muted-foreground mt-1">Stop program execution</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="functions">
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">INVOKE n L d</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Call function at label L with n arguments, nesting difference d
                      </p>
                    </div>
                    <div className="p-3 rounded bg-muted/30">
                      <code className="font-mono text-primary">RETURN</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Return from function call (pop frame, restore state)
                      </p>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold text-sm mb-2">Stack Frame Structure</h4>
                      <p className="text-sm text-muted-foreground">
                        When INVOKE is called, a new stack frame is created containing:
                      </p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Return address (where to continue after function)</li>
                        <li>• Static link (pointer to enclosing scope)</li>
                        <li>• Local variables and parameters</li>
                      </ul>
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

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Example 1: Factorial</CardTitle>
                <CardDescription>A classic recursive function</CardDescription>
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
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 120 (5! = 5 × 4 × 3 × 2 × 1)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example 2: Fibonacci</CardTitle>
                <CardDescription>Double recursion example</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock title="fibonacci.tripla">
{`// Computes the nth Fibonacci number
let fib(n) {
  if n <= 1 then n
  else fib(n - 1) + fib(n - 2)
}
in fib(10)`}
                </CodeBlock>
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 55 (the 10th Fibonacci number)
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
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 6 (GCD of 48 and 18)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example 4: Power Function</CardTitle>
                <CardDescription>Computing x^n using recursion</CardDescription>
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
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
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
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 8 (|15 - 7|)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example 6: Nested Functions</CardTitle>
                <CardDescription>Inner functions accessing outer scope</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock title="nested.tripla">
{`// Nested function with closure
let outer(x) {
  let inner(y) {
    x + y  // x from outer scope
  }
  in inner(10)
}
in outer(5)`}
                </CodeBlock>
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    <strong>Result:</strong> 15 (5 + 10)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Practice CTA */}
        <section className="mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Practice?</h3>
                  <p className="text-muted-foreground">
                    Try writing your own Tripla programs in the interactive workspace. 
                    Watch your code compile to TRAM and execute step by step!
                  </p>
                </div>
                <Link 
                  to="/"
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <Play className="h-5 w-5" />
                  Open Workspace
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Learn;
