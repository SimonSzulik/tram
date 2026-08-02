import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { MachineCodeView } from "@/components/MachineCodeView";
import { StackVisualization } from "@/components/StackVisualization";
import { CompilerControls } from "@/components/CompilerControls";
import { compileTripla } from "@/lib/tripla";
import { AbstractMachine, parseInstructions, MachineState } from "@/lib/tripla/abstractMachine";
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

const initialMachineState: MachineState = {
  PC: 0,
  PP: 0,
  FP: 0,
  TOP: -1,
  stack: [],
  halted: true,
};

const Index = () => {
  const [code, setCode] = useState(SAMPLE_TRIPLA_CODE);
  const [isCompiled, setIsCompiled] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [instructions, setInstructions] = useState<InstructionDisplay[]>([]);
  const [machineState, setMachineState] = useState<MachineState>(initialMachineState);
  const [stateHistory, setStateHistory] = useState<MachineState[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const machineRef = useRef<AbstractMachine | null>(null);
  const runIntervalRef = useRef<number | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (runIntervalRef.current) {
        clearInterval(runIntervalRef.current);
      }
    };
  }, []);

  // Auto-run effect
  useEffect(() => {
    if (isRunning && machineRef.current && !machineState.halted) {
      runIntervalRef.current = window.setInterval(() => {
        if (machineRef.current && !machineRef.current.isHalted()) {
          // Save current state before stepping
          const currentState = machineRef.current.getState();
          setStateHistory(prev => [...prev, currentState]);
          
          const newState = machineRef.current.step();
          setMachineState(newState);
          
          if (newState.halted) {
            setIsRunning(false);
            if (runIntervalRef.current) {
              clearInterval(runIntervalRef.current);
              runIntervalRef.current = null;
            }
            toast.success("Program completed!", {
              description: newState.stack.length > 0 
                ? `Result: ${newState.stack[newState.TOP]}` 
                : "Stack is empty",
            });
          }
        }
      }, 1000);
    } else if (runIntervalRef.current) {
      clearInterval(runIntervalRef.current);
      runIntervalRef.current = null;
    }

    return () => {
      if (runIntervalRef.current) {
        clearInterval(runIntervalRef.current);
        runIntervalRef.current = null;
      }
    };
  }, [isRunning, machineState.halted]);

  const handleCompile = () => {
    setError(null);
    const result = compileTripla(code);
    
    if (result.success) {
      setInstructions(result.instructionStrings);
      setIsCompiled(true);
      setStateHistory([]);
      
      // Parse instructions and create machine
      const machineInstructions = parseInstructions(result.instructionStrings);
      machineRef.current = new AbstractMachine(machineInstructions);
      setMachineState(machineRef.current.getState());
      
      toast.success("Compilation successful!", {
        description: `Generated ${result.instructionStrings.length} TRAM instructions`,
        duration: 2000,
      });
    } else {
      setError(result.error || 'Unknown compilation error');
      setIsCompiled(false);
      setInstructions([]);
      machineRef.current = null;
      setMachineState(initialMachineState);
      setStateHistory([]);
      toast.error("Compilation failed", {
        description: result.error,
      });
    }
  };

  const handleStep = () => {
    if (machineRef.current && !machineRef.current.isHalted()) {
      // Save current state before stepping
      const currentState = machineRef.current.getState();
      setStateHistory(prev => [...prev, currentState]);
      
      const newState = machineRef.current.step();
      setMachineState(newState);
      
      if (newState.halted) {
        toast.success("Program completed!", {
          description: newState.stack.length > 0 
            ? `Result: ${newState.stack[newState.TOP]}` 
            : "Stack is empty",
        });
      }
    } else {
      toast.info("Execution complete!");
    }
  };

  const handleStepBack = () => {
    if (stateHistory.length > 0 && machineRef.current) {
      const previousState = stateHistory[stateHistory.length - 1];
      setStateHistory(prev => prev.slice(0, -1));
      
      // Restore machine to previous state
      machineRef.current.restoreState(previousState);
      setMachineState(previousState);
    }
  };

  const handleRun = () => {
    if (isRunning) {
      setIsRunning(false);
    } else if (machineRef.current && !machineRef.current.isHalted()) {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsCompiled(false);
    setIsRunning(false);
    setInstructions([]);
    setError(null);
    setStateHistory([]);
    
    if (machineRef.current) {
      machineRef.current.reset();
    }
    machineRef.current = null;
    setMachineState(initialMachineState);
    
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
              currentLine={machineState.halted ? -1 : machineState.PC}
            />
          </div>

          {/* Right Panel: Stack */}
          <div className="lg:col-span-1 min-h-[400px] lg:min-h-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <StackVisualization machineState={machineState} />
          </div>
        </div>

        {/* Compiler Controls */}
        <CompilerControls
          onCompile={handleCompile}
          onStep={handleStep}
          onStepBack={handleStepBack}
          onRun={handleRun}
          onReset={handleReset}
          isCompiled={isCompiled}
          isRunning={isRunning}
          canStep={!machineState.halted}
          canStepBack={stateHistory.length > 0}
        />
      </main>
    </div>
  );
};

export default Index;
