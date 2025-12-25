import { Header } from "@/components/Header";
import { Layers, ArrowRight, Cpu, Database, Cog } from "lucide-react";

const pipelineStages = [
  {
    icon: Layers,
    title: "Source Code",
    description: "Tripla code written by the programmer",
    example: "LET x = 5 + 3;",
    color: "bg-primary",
  },
  {
    icon: Cog,
    title: "Lexical Analysis",
    description: "Breaks code into tokens (keywords, numbers, operators)",
    example: "[LET] [x] [=] [5] [+] [3] [;]",
    color: "bg-execution",
  },
  {
    icon: Database,
    title: "Parsing",
    description: "Builds an Abstract Syntax Tree (AST) from tokens",
    example: "Assignment → Variable → Expression",
    color: "bg-stack-push",
  },
  {
    icon: Cpu,
    title: "Code Generation",
    description: "Generates Tram machine code from the AST",
    example: "PUSH 5; PUSH 3; ADD; STORE x",
    color: "bg-primary",
  },
];

const Compiler = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-8 animate-fade-in">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Compiler Concepts</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Understand how the Tripla compiler transforms human-readable code into
            executable Tram machine instructions.
          </p>
        </div>

        {/* What is a Compiler */}
        <section className="mb-10 p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-3">What is a Compiler?</h2>
          <p className="text-muted-foreground leading-relaxed">
            A compiler is a program that translates source code written in a high-level
            programming language (like Tripla) into a lower-level language (like Tram machine code)
            that can be executed by a computer or virtual machine. This process involves
            several stages, each transforming the code into a more executable form.
          </p>
        </section>

        {/* Compilation Pipeline */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-6">The Compilation Pipeline</h2>
          
          <div className="flex flex-col gap-4">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isLast = idx === pipelineStages.length - 1;
              
              return (
                <div key={idx} className="relative">
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-xl ${stage.color} text-primary-foreground shrink-0`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          Stage {idx + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {stage.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {stage.description}
                      </p>
                      <div className="font-mono text-sm bg-muted px-3 py-2 rounded-lg text-foreground">
                        {stage.example}
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  {!isLast && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Stack-Based Execution */}
        <section className="p-6 rounded-2xl bg-accent border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Stack-Based Execution
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Tram uses a stack-based execution model. Instead of using registers,
            operations push values onto a stack and pop them off to perform calculations.
            This simple model makes it easy to visualize how programs execute.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">PUSH Operation</h4>
              <p className="text-sm text-muted-foreground">
                Adds a value to the top of the stack. Example: <code className="bg-muted px-1 rounded">PUSH 5</code> places 5 on top.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-2">POP Operation</h4>
              <p className="text-sm text-muted-foreground">
                Removes and returns the top value. Used implicitly by operations like ADD, SUB.
              </p>
            </div>
          </div>
        </section>

        {/* More content coming */}
        <div className="mt-8 text-center py-8 text-muted-foreground">
          <p className="text-sm">
            Detailed compiler implementation guides coming soon!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Compiler;
