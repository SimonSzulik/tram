import { useState } from "react";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { MachineCodeView } from "@/components/MachineCodeView";
import { StackVisualization } from "@/components/StackVisualization";
import { CompilerControls } from "@/components/CompilerControls";
import { toast } from "sonner";

const SAMPLE_TRIPLA_CODE = `// Sample Tripla Program
// Calculate the sum of 5 and 3

LET x = 5;
LET y = 3;
LET sum = x + y;

// Output the result
PRINT sum;`;

const SAMPLE_INSTRUCTIONS = [
  { address: 0, code: "PUSH 5", label: "START" },
  { address: 1, code: "STORE x" },
  { address: 2, code: "PUSH 3" },
  { address: 3, code: "STORE y" },
  { address: 4, code: "LOAD x" },
  { address: 5, code: "LOAD y" },
  { address: 6, code: "ADD" },
  { address: 7, code: "STORE sum" },
  { address: 8, code: "LOAD sum" },
  { address: 9, code: "PRINT", label: "OUTPUT" },
  { address: 10, code: "HALT" },
];

const Index = () => {
  const [code, setCode] = useState(SAMPLE_TRIPLA_CODE);
  const [isCompiled, setIsCompiled] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [instructions, setInstructions] = useState<typeof SAMPLE_INSTRUCTIONS>([]);
  const [stack, setStack] = useState<{ value: string | number; isNew?: boolean }[]>([]);

  const handleCompile = () => {
    // Placeholder compilation
    setInstructions(SAMPLE_INSTRUCTIONS);
    setIsCompiled(true);
    setCurrentLine(-1);
    setStack([]);
    toast.success("Compilation successful!", {
      description: `Generated ${SAMPLE_INSTRUCTIONS.length} Tram instructions`,
    });
  };

  const handleStep = () => {
    if (currentLine < instructions.length - 1) {
      const nextLine = currentLine + 1;
      setCurrentLine(nextLine);
      
      // Simulate stack operations
      const instruction = instructions[nextLine];
      if (instruction.code.startsWith("PUSH")) {
        const value = instruction.code.split(" ")[1];
        setStack((prev) => [...prev, { value, isNew: true }]);
        setTimeout(() => {
          setStack((prev) =>
            prev.map((item, idx) =>
              idx === prev.length - 1 ? { ...item, isNew: false } : item
            )
          );
        }, 400);
      } else if (instruction.code === "ADD" && stack.length >= 2) {
        // Pop two, push result
        setStack((prev) => {
          const newStack = prev.slice(0, -2);
          const sum = Number(prev[prev.length - 1].value) + Number(prev[prev.length - 2].value);
          return [...newStack, { value: sum, isNew: true }];
        });
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
    toast.info("Workspace reset");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col">
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
