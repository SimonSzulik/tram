import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { 
  Layers, 
  ArrowRight, 
  Cpu, 
  Database, 
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
  TrendingUp,
  Network,
  Box,
  Target,
  Eye,
  Settings,
  FileText,
  Terminal
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const pipelineStages = [
  {
    icon: FileCode,
    title: "Source Code",
    description: "High-level Tripla code written by the programmer",
    example: "let add(x, y) { x + y } in add(5, 3)",
    color: "bg-primary",
    delay: "0s",
  },
  {
    icon: Cog,
    title: "Lexical Analysis",
    description: "Breaks source code into tokens (keywords, identifiers, operators, literals)",
    example: "[let] [add] [(] [x] [,] [y] [)] [{] [x] [+] [y] [}] [in] [add] [(] [5] [,] [3] [)]",
    color: "bg-execution",
    delay: "0.1s",
  },
  {
    icon: GitBranch,
    title: "Syntax Analysis",
    description: "Builds an Abstract Syntax Tree (AST) from tokens using grammar rules",
    example: "FunctionDecl → FunctionCall → BinaryOp → ...",
    color: "bg-stack-push",
    delay: "0.2s",
  },
  {
    icon: Database,
    title: "Semantic Analysis",
    description: "Validates program semantics, checks types, builds symbol tables",
    example: "Type checking, scope resolution, symbol binding",
    color: "bg-blue-500",
    delay: "0.3s",
  },
  {
    icon: Cpu,
    title: "Code Generation",
    description: "Generates TRAM machine code from the validated AST",
    example: "CONST 5; CONST 3; ADD; RETURN",
    color: "bg-purple-500",
    delay: "0.4s",
  },
  {
    icon: Play,
    title: "Execution",
    description: "TRAM virtual machine executes the generated machine code",
    example: "Stack operations, register updates, control flow",
    color: "bg-green-500",
    delay: "0.5s",
  },
];

const compilerPhases = [
  {
    name: "Frontend",
    phases: ["Lexical Analysis", "Syntax Analysis", "Semantic Analysis"],
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    name: "Backend",
    phases: ["Code Generation", "Optimization", "Code Emission"],
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
];

const Compiler = () => {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Create particles for animation
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);

    // Intersection Observer for scroll animations
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-slide-in");
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((obs) => obs?.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Header />

      <main className="flex-1 container py-8 relative z-10">
        {/* Hero Section with Animation */}
        <section className={`mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 animate-fade-in">
            <Sparkles className="h-4 w-4 animate-spin-slow" />
            <span className="text-sm font-medium">Compiler Design Fundamentals</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Compiler Concepts
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Explore the fascinating world of compiler design. Learn how high-level programming languages 
            are transformed into executable machine code through a series of sophisticated transformations.
          </p>

          <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              <Code2 className="h-3 w-3 mr-1.5" />
              Lexical Analysis
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              <GitBranch className="h-3 w-3 mr-1.5" />
              Parsing
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              <Cpu className="h-3 w-3 mr-1.5" />
              Code Generation
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              <Database className="h-3 w-3 mr-1.5" />
              Optimization
            </Badge>
          </div>
        </section>

        {/* What is a Compiler - Animated Card */}
        <section 
          ref={(el) => (sectionRefs.current[0] = el)}
          className="mb-12 scroll-mt-20"
        >
          <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-primary/10 animate-pulse-slow">
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
              <p className="text-muted-foreground leading-relaxed text-lg">
                A <strong className="text-foreground">compiler</strong> is a sophisticated program that translates 
                source code written in a high-level programming language (like Tripla) into a lower-level representation 
                (like TRAM machine code) that can be executed by a computer or virtual machine.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-muted/50 border border-border hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Translation</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Converts high-level abstractions into low-level instructions while preserving program semantics.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50 border border-border hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Analysis</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analyzes code structure, validates syntax, checks types, and builds internal representations.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Key Insight</h4>
                    <p className="text-sm text-muted-foreground">
                      Compilers are essentially <strong>translators</strong> that understand both the source language 
                      (syntax and semantics) and the target language (machine code), performing complex transformations 
                      to bridge the gap between human intent and machine execution.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Compilation Pipeline - Interactive */}
        <section 
          ref={(el) => (sectionRefs.current[1] = el)}
          className="mb-12 scroll-mt-20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">The Compilation Pipeline</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow the journey of your code from source text to executable instructions
            </p>
          </div>

          <div className="relative">
            {/* Animated Connection Lines */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-green-500 transform -translate-x-1/2 opacity-30 animate-pulse-slow" 
                 style={{ height: 'calc(100% - 4rem)', top: '2rem' }} />

            <div className="space-y-6">
              {pipelineStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isActive = activeStage === idx;
                
                return (
                  <div
                    key={idx}
                    className={`relative group cursor-pointer transition-all duration-500 ${
                      isActive ? 'scale-105 z-10' : 'hover:scale-102'
                    }`}
                    onMouseEnter={() => setActiveStage(idx)}
                    onMouseLeave={() => setActiveStage(null)}
                    style={{ animationDelay: stage.delay }}
                  >
                    <Card className={`overflow-hidden border-2 transition-all duration-300 ${
                      isActive 
                        ? 'border-primary shadow-2xl shadow-primary/20' 
                        : 'border-border hover:border-primary/50 hover:shadow-lg'
                    }`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${stage.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <CardContent className="relative p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                          {/* Icon */}
                          <div className={`p-4 rounded-2xl ${stage.color} text-white shadow-lg transform transition-all duration-300 ${
                            isActive ? 'scale-110 rotate-6' : 'group-hover:scale-105 group-hover:rotate-3'
                          }`}>
                            <Icon className="h-8 w-8" />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className="font-mono">
                                Stage {idx + 1}
                              </Badge>
                              <h3 className="text-xl font-bold text-foreground">
                                {stage.title}
                              </h3>
                            </div>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                              {stage.description}
                            </p>
                            
                            <div className="mt-4 p-3 rounded-lg bg-editor border border-border">
                              <div className="flex items-center gap-2 mb-2">
                                <Terminal className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase">Example</span>
                              </div>
                              <code className="font-mono text-sm text-editor-foreground break-all">
                                {stage.example}
                              </code>
                            </div>
                          </div>

                          {/* Arrow (hidden on mobile) */}
                          {idx < pipelineStages.length - 1 && (
                            <div className="hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary animate-bounce-horizontal">
                              <ArrowRight className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Compiler Phases - Frontend vs Backend */}
        <section 
          ref={(el) => (sectionRefs.current[2] = el)}
          className="mb-12 scroll-mt-20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Compiler Architecture</h2>
            <p className="text-muted-foreground">
              Understanding the two main phases of compilation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {compilerPhases.map((phase, idx) => (
              <Card 
                key={idx}
                className={`overflow-hidden border-2 ${phase.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-50 pointer-events-none`} />
                <CardHeader className="relative">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    {phase.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  {phase.phases.map((p, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border hover:bg-card transition-colors"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-sm font-medium">{p}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Detailed Stages - Tabs */}
        <section 
          ref={(el) => (sectionRefs.current[3] = el)}
          className="mb-12 scroll-mt-20"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Deep Dive: Compilation Stages</CardTitle>
              <CardDescription>
                Explore each stage in detail with examples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lexical" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
                  <TabsTrigger value="lexical">Lexical</TabsTrigger>
                  <TabsTrigger value="syntax">Syntax</TabsTrigger>
                  <TabsTrigger value="semantic">Semantic</TabsTrigger>
                  <TabsTrigger value="generation">Code Gen</TabsTrigger>
                  <TabsTrigger value="optimization">Optimize</TabsTrigger>
                  <TabsTrigger value="execution">Execute</TabsTrigger>
                </TabsList>

                <TabsContent value="lexical" className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Cog className="h-5 w-5 text-blue-500" />
                      Lexical Analysis (Tokenization)
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The first phase breaks source code into a stream of tokens. The lexer (scanner) reads 
                      characters and groups them into meaningful units.
                    </p>
                    <div className="space-y-2">
                      <div className="font-mono text-sm bg-editor p-3 rounded border border-border">
                        <div className="text-muted-foreground mb-2">Input:</div>
                        <div className="text-editor-foreground">let x = 5 + 3</div>
                        <div className="text-muted-foreground mt-3 mb-2">Tokens:</div>
                        <div className="flex flex-wrap gap-2">
                          {['let', 'x', '=', '5', '+', '3'].map((token, i) => (
                            <Badge key={i} variant="secondary" className="font-mono animate-slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
                              {token}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="syntax" className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-green-500" />
                      Syntax Analysis (Parsing)
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The parser builds an Abstract Syntax Tree (AST) from tokens using grammar rules. 
                      This represents the hierarchical structure of the program.
                    </p>
                    <div className="font-mono text-sm bg-editor p-4 rounded border border-border">
                      <div className="text-editor-foreground space-y-1">
                        <div>Expression</div>
                        <div className="pl-4">├─ Assignment</div>
                        <div className="pl-8">│  ├─ Variable: x</div>
                        <div className="pl-8">│  └─ BinaryOp: +</div>
                        <div className="pl-12">│     ├─ Constant: 5</div>
                        <div className="pl-12">│     └─ Constant: 3</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="semantic" className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Database className="h-5 w-5 text-purple-500" />
                      Semantic Analysis
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Validates program semantics: type checking, scope resolution, symbol table construction, 
                      and ensures the program makes logical sense.
                    </p>
                    <div className="space-y-2">
                      <div className="p-3 rounded bg-card border border-border">
                        <div className="text-sm font-semibold mb-1">Symbol Table:</div>
                        <div className="font-mono text-xs space-y-1">
                          <div>x → Variable (Integer)</div>
                          <div>add → Function (Integer, Integer) → Integer</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="generation" className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-orange-500" />
                      Code Generation
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Transforms the AST into target machine code (TRAM instructions). 
                      This is where the high-level program becomes executable.
                    </p>
                    <div className="font-mono text-sm bg-editor p-3 rounded border border-border">
                      <div className="text-editor-foreground space-y-1">
                        <div>CONST 5</div>
                        <div>CONST 3</div>
                        <div>ADD</div>
                        <div>STORE x</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="optimization" className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-pink-500" />
                      Optimization
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Optional phase that improves generated code: constant folding, dead code elimination, 
                      register allocation, and more advanced optimizations.
                    </p>
                    <div className="space-y-2">
                      <div className="p-3 rounded bg-card border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Before:</div>
                        <code className="text-sm">CONST 5; CONST 3; ADD</code>
                        <div className="text-xs text-muted-foreground mt-2 mb-1">After:</div>
                        <code className="text-sm">CONST 8</code>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="execution" className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Play className="h-5 w-5 text-green-500" />
                      Execution
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The virtual machine executes the generated code, maintaining stack state, 
                      registers, and control flow.
                    </p>
                    <div className="space-y-2">
                      <div className="p-3 rounded bg-card border border-border">
                        <div className="text-sm font-semibold mb-2">Stack State:</div>
                        <div className="font-mono text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <Box className="h-3 w-3 text-green-500" />
                            <span>TOP: 8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Key Concepts */}
        <section 
          ref={(el) => (sectionRefs.current[4] = el)}
          className="mb-12 scroll-mt-20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Key Concepts</h2>
            <p className="text-muted-foreground">
              Fundamental ideas in compiler design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: "Context-Free Grammars", desc: "Formal rules defining language syntax" },
              { icon: Box, title: "Abstract Syntax Trees", desc: "Tree representation of program structure" },
              { icon: Database, title: "Symbol Tables", desc: "Data structures tracking identifiers" },
              { icon: TrendingUp, title: "Type Systems", desc: "Rules for type checking and inference" },
              { icon: Settings, title: "Code Optimization", desc: "Techniques to improve generated code" },
              { icon: Network, title: "Control Flow", desc: "Managing program execution order" },
            ].map((concept, idx) => {
              const Icon = concept.icon;
              return (
                <Card 
                  key={idx}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50"
                  style={{ animationDelay: `${idx * 0.1}s` }}
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
          <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <CardContent className="relative p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6 animate-pulse-slow">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
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