import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { 
  Layers, 
  ArrowRight, 
  Cpu, 
  Cog, 
  Code2, 
  FileCode,
  GitBranch,
  Zap,
  Play,
  BookOpen,
  Lightbulb,
  CheckCircle,
  Sparkles,
  Box,
  Target,
  Eye,
  FileText,
  Terminal,
  Search,
  Settings,
  Binary
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Frontend phases
const frontendPhases = [
  {
    id: "scanner",
    icon: Search,
    title: "Scanner",
    subtitle: "Lexical Analysis",
    description: "Reads source code character by character and groups them into tokens (lexemes). Identifies keywords, identifiers, operators, and literals.",
    example: {
      input: 'let add(x, y) { x + y }',
      output: ['let', 'add', '(', 'x', ',', 'y', ')', '{', 'x', '+', 'y', '}']
    },
    color: "bg-blue-500",
    details: [
      "Removes whitespace and comments",
      "Recognizes language keywords",
      "Identifies numeric and string literals",
      "Generates token stream for parser"
    ]
  },
  {
    id: "parser",
    icon: GitBranch,
    title: "Parser",
    subtitle: "Syntactic Analysis",
    description: "Analyzes token stream according to grammar rules and builds an Abstract Syntax Tree (AST) representing the program structure.",
    example: {
      input: "Token stream from scanner",
      output: "FunctionDecl(add) → BinaryOp(+) → [Var(x), Var(y)]"
    },
    color: "bg-cyan-500",
    details: [
      "Validates grammar rules (context-free grammar)",
      "Builds hierarchical AST structure",
      "Reports syntax errors with location",
      "Handles operator precedence"
    ]
  },
  {
    id: "semantic",
    icon: Eye,
    title: "Semantic Analysis",
    subtitle: "Meaning Validation",
    description: "Checks that the program makes semantic sense: validates types, resolves identifiers, and builds symbol tables.",
    example: {
      input: "AST from parser",
      output: "Type-annotated AST + Symbol Table"
    },
    color: "bg-indigo-500",
    details: [
      "Type checking and inference",
      "Scope and binding resolution",
      "Symbol table construction",
      "Semantic error detection"
    ]
  }
];

// Backend phases
const backendPhases = [
  {
    id: "intermediate",
    icon: Layers,
    title: "Intermediate Code",
    subtitle: "IR Generation",
    description: "Transforms the AST into an intermediate representation (IR) that is machine-independent and easier to optimize.",
    example: {
      input: "Annotated AST",
      output: "Three-address code or SSA form"
    },
    color: "bg-purple-500",
    details: [
      "Machine-independent representation",
      "Facilitates optimization passes",
      "Abstracts target architecture",
      "Enables portability"
    ]
  },
  {
    id: "optimization",
    icon: Zap,
    title: "Optimization",
    subtitle: "Code Improvement",
    description: "Applies transformations to improve code efficiency: constant folding, dead code elimination, loop optimization.",
    example: {
      input: "CONST 3; CONST 5; ADD",
      output: "CONST 8"
    },
    color: "bg-pink-500",
    details: [
      "Constant folding and propagation",
      "Dead code elimination",
      "Loop unrolling and optimization",
      "Register allocation"
    ]
  },
  {
    id: "codegen",
    icon: Binary,
    title: "Code Generation",
    subtitle: "Target Code",
    description: "Produces the final target code (TRAM instructions) that can be executed by the virtual machine or hardware.",
    example: {
      input: "Optimized IR",
      output: "CONST 5; CONST 3; ADD; RETURN"
    },
    color: "bg-orange-500",
    details: [
      "Instruction selection",
      "Register assignment",
      "Address calculation",
      "Executable output generation"
    ]
  }
];

const CompilerPhaseDiagram = () => {
  const [selectedPhase, setSelectedPhase] = useState<string>("scanner");

  const allPhases = [...frontendPhases, ...backendPhases];
  const selectedPhaseData = allPhases.find(p => p.id === selectedPhase);

  const PhaseBox = ({ 
    phase, 
    index, 
    total,
    showArrow = true 
  }: { 
    phase: typeof frontendPhases[0]; 
    index: number;
    total: number;
    showArrow?: boolean;
  }) => {
    const Icon = phase.icon;
    const isActive = selectedPhase === phase.id;
    
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedPhase(phase.id)}
          className={`
            relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
            ${isActive 
              ? `${phase.color} text-white border-transparent shadow-lg scale-105` 
              : 'bg-card border-border hover:border-primary/50 hover:scale-[1.02]'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2 min-w-[100px]">
            <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-primary'}`} />
            <span className={`text-sm font-semibold text-center ${isActive ? 'text-white' : 'text-foreground'}`}>
              {phase.title}
            </span>
          </div>
          {isActive && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-inherit" />
          )}
        </button>
        {showArrow && index < total - 1 && (
          <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Compiler Flow */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-purple-500/5 border border-border">
        {/* Source and Target */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 mb-8">
          {/* Source Program */}
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-stack-push/20 border-2 border-stack-push text-stack-push">
              <div className="flex flex-col items-center gap-2">
                <FileCode className="h-8 w-8" />
                <span className="font-bold">Source</span>
                <span className="text-xs opacity-80">Tripla Code</span>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Compiler Box */}
          <div className="flex-1 max-w-4xl">
            <div className="relative p-6 rounded-2xl bg-primary/10 border-2 border-primary/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                Compiler
              </div>
              
              {/* Frontend Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <span className="text-sm font-semibold text-muted-foreground px-3 py-1 rounded-full bg-blue-500/10">
                    Frontend
                  </span>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-cyan-500 to-indigo-500" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {frontendPhases.map((phase, idx) => (
                    <PhaseBox 
                      key={phase.id} 
                      phase={phase} 
                      index={idx} 
                      total={frontendPhases.length}
                      showArrow={idx < frontendPhases.length - 1}
                    />
                  ))}
                </div>
              </div>

              {/* Divider Arrow */}
              <div className="flex justify-center my-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-0.5 h-4 bg-gradient-to-b from-indigo-500 to-purple-500" />
                  <ArrowRight className="h-5 w-5 text-purple-500 rotate-90" />
                </div>
              </div>

              {/* Backend Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                  <span className="text-sm font-semibold text-muted-foreground px-3 py-1 rounded-full bg-purple-500/10">
                    Backend
                  </span>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-pink-500 to-orange-500" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {backendPhases.map((phase, idx) => (
                    <PhaseBox 
                      key={phase.id} 
                      phase={phase} 
                      index={idx + 3} 
                      total={backendPhases.length}
                      showArrow={idx < backendPhases.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Target Program */}
          <div className="flex items-center gap-4">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <div className="p-4 rounded-xl bg-execution/20 border-2 border-execution text-execution">
              <div className="flex flex-col items-center gap-2">
                <Cpu className="h-8 w-8" />
                <span className="font-bold">Target</span>
                <span className="text-xs opacity-80">TRAM Code</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Details (always shown for selected phase) */}
      {selectedPhaseData && (
        <div className="p-6 rounded-xl bg-card border-2 border-border shadow-sm animate-fade-in" key={selectedPhaseData.id}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${selectedPhaseData.color} text-white`}>
              <selectedPhaseData.icon className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-foreground">{selectedPhaseData.title}</h4>
              <p className="text-muted-foreground">{selectedPhaseData.subtitle}</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">{selectedPhaseData.description}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {selectedPhaseData.details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-stack-push flex-shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Compiler = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("lexical");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="flex-1 container py-8 relative z-10">
        {/* Hero Section */}
        <section className={`mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4 animate-spin-slow" />
            <span className="text-sm font-medium">Compiler Design Fundamentals</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Compiler Concepts
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Understand how high-level source code is transformed into executable machine code 
            through a series of sophisticated analysis and synthesis phases.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {["Scanner", "Parser", "Semantic Analysis", "Code Generation"].map((phase, idx) => (
              <Badge key={idx} variant="secondary" className="px-3 py-1.5">
                {phase}
              </Badge>
            ))}
          </div>
        </section>

        {/* What is a Compiler */}
        <section className="mb-12">
          <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">What is a Compiler?</CardTitle>
                  <CardDescription className="text-base mt-1">
                    The bridge between human-readable code and machine execution
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                A <strong className="text-foreground">compiler</strong> is a program that translates 
                source code written in a high-level programming language into a lower-level representation 
                that can be executed by a computer or virtual machine. Unlike an interpreter (which executes 
                code line by line), a compiler processes the entire program and produces an executable output.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-muted/50 border border-border hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Translation</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Converts high-level abstractions into low-level instructions.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50 border border-border hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Analysis</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Validates syntax, checks types, and builds internal representations.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Optimization</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Improves code efficiency while preserving semantics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Interactive Compiler Structure Diagram */}
        <section className="mb-12">
          <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Compiler Structure</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click on each phase to learn more about its role in the compilation process
          </p>
          </div>

          <CompilerPhaseDiagram />
        </section>

        {/* Deep Dive Tabs */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Deep Dive: Compilation Phases</CardTitle>
              <CardDescription>
                Explore each phase with detailed examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6 h-auto gap-1">
                  <TabsTrigger value="lexical" className="text-xs md:text-sm">Scanner</TabsTrigger>
                  <TabsTrigger value="syntax" className="text-xs md:text-sm">Parser</TabsTrigger>
                  <TabsTrigger value="semantic" className="text-xs md:text-sm">Semantic</TabsTrigger>
                  <TabsTrigger value="intermediate" className="text-xs md:text-sm">IR</TabsTrigger>
                  <TabsTrigger value="optimization" className="text-xs md:text-sm">Optimize</TabsTrigger>
                  <TabsTrigger value="codegen" className="text-xs md:text-sm">Code Gen</TabsTrigger>
                </TabsList>

                <TabsContent value="lexical" className="space-y-4 animate-fade-in">
                  <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                      <Search className="h-6 w-6 text-blue-500" />
                      Scanner (Lexical Analysis)
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      The scanner (or lexer) reads the source code character by character and groups them 
                      into meaningful units called <strong className="text-foreground">tokens</strong>. 
                      It uses regular expressions and finite automata to recognize patterns.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="font-mono text-sm bg-editor p-4 rounded-lg border border-border">
                        <div className="text-muted-foreground mb-2 text-xs uppercase font-bold">Input Source Code:</div>
                        <div className="text-editor-foreground text-lg">let x = 5 + 3</div>
                        <div className="text-muted-foreground mt-4 mb-2 text-xs uppercase font-bold">Output Token Stream:</div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { token: 'LET', value: 'let', type: 'keyword' },
                            { token: 'IDENT', value: 'x', type: 'identifier' },
                            { token: 'ASSIGN', value: '=', type: 'operator' },
                            { token: 'NUMBER', value: '5', type: 'literal' },
                            { token: 'PLUS', value: '+', type: 'operator' },
                            { token: 'NUMBER', value: '3', type: 'literal' }
                          ].map((t, i) => (
                            <div key={i} className="flex flex-col items-center p-2 rounded-lg bg-card border border-border animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                              <Badge variant="secondary" className="font-mono text-xs mb-1">{t.token}</Badge>
                              <span className="text-xs text-muted-foreground">{t.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-card border border-border">
                          <h4 className="font-semibold mb-2">Token Types</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Keywords: let, in, if, then, else, while, do</li>
                            <li>• Identifiers: variable and function names</li>
                            <li>• Literals: numbers (integers)</li>
                            <li>• Operators: +, -, *, /, =, &lt;, &gt;</li>
                            <li>• Punctuation: (, ), &#123;, &#125;, ,</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-card border border-border">
                          <h4 className="font-semibold mb-2">Key Concepts</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Regular expressions define patterns</li>
                            <li>• Finite automata recognize tokens</li>
                            <li>• Whitespace is typically ignored</li>
                            <li>• Comments are stripped</li>
                            <li>• Error reporting on invalid characters</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="syntax" className="space-y-4 animate-fade-in">
                  <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                      <GitBranch className="h-6 w-6 text-cyan-500" />
                      Parser (Syntactic Analysis)
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      The parser analyzes the token stream according to the language's <strong className="text-foreground">context-free grammar</strong> and 
                      builds an <strong className="text-foreground">Abstract Syntax Tree (AST)</strong> representing the program's structure.
                    </p>
                    
                    <div className="font-mono text-sm bg-editor p-4 rounded-lg border border-border mb-4">
                      <div className="text-muted-foreground mb-2 text-xs uppercase font-bold">AST for: let x = 5 + 3 in x</div>
                      <div className="text-editor-foreground space-y-1 pl-2">
                        <div className="flex items-center gap-2">
                          <span className="text-syntax-keyword">LetExpression</span>
                        </div>
                        <div className="pl-4 border-l-2 border-muted space-y-1">
                          <div>├─ <span className="text-syntax-operator">binding:</span> x</div>
                          <div>├─ <span className="text-syntax-operator">value:</span></div>
                          <div className="pl-4 border-l-2 border-muted">
                            <div>│  └─ <span className="text-syntax-keyword">BinaryOp</span> (+)</div>
                            <div className="pl-6">├─ left: <span className="text-syntax-number">5</span></div>
                            <div className="pl-6">└─ right: <span className="text-syntax-number">3</span></div>
                          </div>
                          <div>└─ <span className="text-syntax-operator">body:</span> <span className="text-foreground">x</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-semibold mb-2">Tripla Grammar (Simplified)</h4>
                      <div className="font-mono text-xs text-muted-foreground space-y-1">
                        <div>E → <span className="text-syntax-keyword">let</span> D <span className="text-syntax-keyword">in</span> E</div>
                        <div>E → <span className="text-syntax-keyword">if</span> E <span className="text-syntax-keyword">then</span> E <span className="text-syntax-keyword">else</span> E</div>
                        <div>E → <span className="text-syntax-keyword">while</span> E <span className="text-syntax-keyword">do</span> E</div>
                        <div>E → E op E | (E) | n | x | x(Args)</div>
                        <div>D → x = E | x(Params) &#123; E &#125;</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="semantic" className="space-y-4 animate-fade-in">
                  <div className="p-6 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                      <Eye className="h-6 w-6 text-indigo-500" />
                      Semantic Analysis
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Validates that the program makes semantic sense. Builds symbol tables, resolves 
                      variable bindings, and performs type checking.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <h4 className="font-semibold mb-3">Symbol Table</h4>
                        <div className="font-mono text-xs space-y-2">
                          <div className="flex justify-between p-2 rounded bg-muted/50">
                            <span>x</span>
                            <span className="text-muted-foreground">Variable (Int) @ scope 1</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-muted/50">
                            <span>add</span>
                            <span className="text-muted-foreground">Function (Int, Int) → Int</span>
                          </div>
                          <div className="flex justify-between p-2 rounded bg-muted/50">
                            <span>y</span>
                            <span className="text-muted-foreground">Parameter (Int) @ scope 2</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <h4 className="font-semibold mb-3">Checks Performed</h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-stack-push" />
                            Variable declared before use
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-stack-push" />
                            Function arity matches call
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-stack-push" />
                            No duplicate declarations
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-stack-push" />
                            Scope rules respected
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="intermediate" className="space-y-4 animate-fade-in">
                  <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                      <Layers className="h-6 w-6 text-purple-500" />
                      Intermediate Representation (IR)
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      The IR is a machine-independent representation that bridges the gap between 
                      source code and target machine code. It facilitates optimization and portability.
                    </p>
                    
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <h4 className="font-semibold mb-2">Three-Address Code Example</h4>
                      <div className="font-mono text-sm text-muted-foreground">
                        <div className="text-xs text-muted-foreground mb-2">// For: (a + b) * (c - d)</div>
                        <div>t1 = a + b</div>
                        <div>t2 = c - d</div>
                        <div>t3 = t1 * t2</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="optimization" className="space-y-4 animate-fade-in">
                  <div className="p-6 rounded-xl bg-pink-500/10 border border-pink-500/30">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                      <Zap className="h-6 w-6 text-pink-500" />
                      Optimization
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Improves the generated code for better performance while preserving 
                      program semantics. Can be applied at different levels (local, global, interprocedural).
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <h4 className="font-semibold mb-2">Constant Folding</h4>
                        <div className="font-mono text-sm">
                          <div className="text-destructive line-through">CONST 3; CONST 5; ADD</div>
                          <div className="text-stack-push">CONST 8</div>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <h4 className="font-semibold mb-2">Dead Code Elimination</h4>
                        <div className="font-mono text-sm">
                          <div className="text-destructive line-through">x = 5; x = 10; // first assignment unused</div>
                          <div className="text-stack-push">x = 10;</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="codegen" className="space-y-4 animate-fade-in">
                  <div className="p-6 rounded-xl bg-orange-500/10 border border-orange-500/30">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                      <Binary className="h-6 w-6 text-orange-500" />
                      Code Generation
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Produces the final target code (TRAM instructions) that can be executed 
                      by the virtual machine. Maps high-level constructs to machine operations.
                    </p>
                    
                    <div className="font-mono text-sm bg-editor p-4 rounded-lg border border-border">
                      <div className="text-muted-foreground mb-2 text-xs uppercase font-bold">Tripla: let add(x,y) &#123; x + y &#125; in add(5, 3)</div>
                      <div className="text-editor-foreground space-y-1">
                        <div><span className="text-syntax-keyword">JUMP</span> <span className="text-syntax-number">4</span> <span className="text-syntax-comment">// Skip function body</span></div>
                        <div><span className="text-syntax-keyword">LOAD</span> <span className="text-syntax-number">-3</span> <span className="text-syntax-comment">// Load x</span></div>
                        <div><span className="text-syntax-keyword">LOAD</span> <span className="text-syntax-number">-4</span> <span className="text-syntax-comment">// Load y</span></div>
                        <div><span className="text-syntax-keyword">ADD</span> <span className="text-syntax-comment">// x + y</span></div>
                        <div><span className="text-syntax-keyword">RETURN</span></div>
                        <div><span className="text-syntax-keyword">CONST</span> <span className="text-syntax-number">3</span> <span className="text-syntax-comment">// Push argument y</span></div>
                        <div><span className="text-syntax-keyword">CONST</span> <span className="text-syntax-number">5</span> <span className="text-syntax-comment">// Push argument x</span></div>
                        <div><span className="text-syntax-keyword">CALL</span> <span className="text-syntax-number">1</span> <span className="text-syntax-comment">// Call add function</span></div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Key Concepts Grid */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Key Concepts</h2>
            <p className="text-muted-foreground">Fundamental ideas in compiler design</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: "Context-Free Grammars", desc: "Formal rules defining language syntax using production rules" },
              { icon: GitBranch, title: "Abstract Syntax Trees", desc: "Tree representation capturing program structure" },
              { icon: Box, title: "Symbol Tables", desc: "Data structures tracking identifiers and their attributes" },
              { icon: Layers, title: "Intermediate Representation", desc: "Machine-independent code for optimization" },
              { icon: Zap, title: "Code Optimization", desc: "Techniques to improve performance and reduce code size" },
              { icon: Cpu, title: "Target Machine", desc: "Final executable code for the target platform (TRAM)" },
            ].map((concept, idx) => {
              const Icon = concept.icon;
              return (
                <Card 
                  key={idx}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/50"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{concept.title}</h3>
                        <p className="text-sm text-muted-foreground">{concept.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <CardContent className="relative p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6 animate-pulse-slow">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to Explore?
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                Try compiling and executing Tripla code in our interactive workspace. 
                See the compilation pipeline in action!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/">
                    <Play className="h-5 w-5" />
                    Open Workspace
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link to="/learn">
                    <BookOpen className="h-5 w-5" />
                    Learn Tripla
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Compiler;
