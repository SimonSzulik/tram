import { useState } from "react";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { MachineCodeView } from "@/components/MachineCodeView";
import { StackVisualization } from "@/components/StackVisualization";
import { CompilerControls } from "@/components/CompilerControls";
import { compileTripla } from "@/lib/tripla";
import { toast } from "sonner";

const SAMPLE_TRIPLA_CODE = `// Tripla Example: Recursive Factorial
// Calculates factorial of 5

let
  fact(n) {
    if (n == 0) then 1
    else n * fact(n - 1)
  }
in
  fact(5)`;

type InstructionDisplay = {
  address: number;
  code: string;
  label?: string;
};

const Index = () => {
  const [code, setCode] = useState(SAMPLE_TRIPLA_CODE);
  const [isCompiled, setIsCompiled] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [instructions, setInstructions] = useState<InstructionDisplay[]>([]);
  const [stack, setStack] = useState<{ value: string | number; isNew?: boolean }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCompile = () => {
    setError(null);
    const result = compileTripla(code);
    
    if (result.success) {
      setInstructions(result.instructionStrings);
      setIsCompiled(true);
      setCurrentLine(-1);
      setStack([]);
      toast.success("Compilation successful!", {
        description: `Generated ${result.instructionStrings.length} TRAM instructions`,
      });
    } else {
      setError(result.error || 'Unknown compilation error');
      setIsCompiled(false);
      setInstructions([]);
      toast.error("Compilation failed", {
        description: result.error,
      });
    }
  };

  const handleStep = () => {
    if (currentLine < instructions.length - 1) {
      const nextLine = currentLine + 1;
      setCurrentLine(nextLine);
      
      // Simulate stack operations based on instruction
      const instruction = instructions[nextLine];
      const code = instruction.code;
      
      if (code.startsWith("CONST")) {
        const value = code.split(" ")[1];
        setStack((prev) => [...prev, { value, isNew: true }]);
        setTimeout(() => {
          setStack((prev) =>
            prev.map((item, idx) =>
              idx === prev.length - 1 ? { ...item, isNew: false } : item
            )
          );
        }, 400);
      } else if (code === "ADD" && stack.length >= 2) {
        setStack((prev) => {
          const newStack = prev.slice(0, -2);
          const sum = Number(prev[prev.length - 1].value) + Number(prev[prev.length - 2].value);
          return [...newStack, { value: sum, isNew: true }];
        });
      } else if (code === "SUB" && stack.length >= 2) {
        setStack((prev) => {
          const newStack = prev.slice(0, -2);
          const diff = Number(prev[prev.length - 2].value) - Number(prev[prev.length - 1].value);
          return [...newStack, { value: diff, isNew: true }];
        });
      } else if (code === "MUL" && stack.length >= 2) {
        setStack((prev) => {
          const newStack = prev.slice(0, -2);
          const product = Number(prev[prev.length - 2].value) * Number(prev[prev.length - 1].value);
          return [...newStack, { value: product, isNew: true }];
        });
      } else if (code === "DIV" && stack.length >= 2) {
        setStack((prev) => {
          const newStack = prev.slice(0, -2);
          const quotient = Math.floor(Number(prev[prev.length - 2].value) / Number(prev[prev.length - 1].value));
          return [...newStack, { value: quotient, isNew: true }];
        });
      } else if (code === "POP" && stack.length >= 1) {
        setStack((prev) => prev.slice(0, -1));
      } else if (code === "HALT") {
        toast.success("Program completed!", {
          description: stack.length > 0 ? `Result: ${stack[stack.length - 1].value}` : "Stack is empty",
        });
        setIsRunning(false);
      }
    } else {
      toast.info("Execution complete!");
      setIsRunning(false);
    }
  };

  const handleRun = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsCompiled(false);
    setIsRunning(false);
    setCurrentLine(-1);
    setInstructions([]);
    setStack([]);
    setError(null);
    toast.info("Workspace reset");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-destructive font-mono text-sm">{error}</p>
          </div>
        )}

        {/* Workspace Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Left Panel: Code Editor */}
          <div className="lg:col-span-1 min-h-[400px] lg:min-h-0 animate-fade-in">
            <CodeEditor value={code} onChange={setCode} />
          </div>

          {/* Middle Panel: Machine Code */}
          <div className="lg:col-span-1 min-h-[400px] lg:min-h-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <MachineCodeView
              instructions={instructions}
              currentLine={currentLine}
            />
          </div>

          {/* Right Panel: Stack */}
          <div className="lg:col-span-1 min-h-[400px] lg:min-h-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <StackVisualization stack={stack} />
          </div>
        </div>

        {/* Compiler Controls */}
        <CompilerControls
          onCompile={handleCompile}
          onStep={handleStep}
          onRun={handleRun}
          onReset={handleReset}
          isCompiled={isCompiled}
          isRunning={isRunning}
          canStep={currentLine < instructions.length - 1}
        />
      </main>
    </div>
  );
};

export default Index;
