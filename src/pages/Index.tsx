import { useState, useRef, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { MachineCodeView } from "@/components/MachineCodeView";
import { StackVisualization } from "@/components/StackVisualization";
import { CompilerControls } from "@/components/CompilerControls";
import { compileTripla } from "@/lib/tripla";
import { AbstractMachine, parseInstructions, MachineState } from "@/lib/tripla/abstractMachine";
import { decodeCode } from "@/lib/workspaceLink";

const SAMPLE_TRIPLA_CODE = `// Tripla Example: Recursive Factorial
// Calculates factorial of 5

let
  fact(n) {
    if (n == 0) then 1
    else n * fact(n - 1)
  }
in
  fact(5)`;

// Safety cap so an accidental infinite loop (e.g. while true) can't freeze the tab.
const MAX_RUN_TO_END_STEPS = 100_000;

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

// Seed the editor from a ?code= deep link (used by "Try in Workspace"), else the sample.
const initialCode = (() => {
  if (typeof window === "undefined") return SAMPLE_TRIPLA_CODE;
  const param = new URLSearchParams(window.location.search).get("code");
  return decodeCode(param) ?? SAMPLE_TRIPLA_CODE;
})();

const resultOf = (state: MachineState): number | null => {
  if (!state.halted || state.stack.length === 0 || state.TOP < 0) return null;
  const value = state.stack[state.TOP];
  return typeof value === "number" ? value : null;
};

const Index = () => {
  const [code, setCode] = useState(initialCode);
  const [isCompiled, setIsCompiled] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [instructions, setInstructions] = useState<InstructionDisplay[]>([]);
  const [machineState, setMachineState] = useState<MachineState>(initialMachineState);
  const [stateHistory, setStateHistory] = useState<MachineState[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

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

  // Auto-run effect (timed, animated stepping)
  useEffect(() => {
    if (isRunning && machineRef.current && !machineState.halted) {
      runIntervalRef.current = window.setInterval(() => {
        if (machineRef.current && !machineRef.current.isHalted()) {
          const currentState = machineRef.current.getState();
          setStateHistory((prev) => [...prev, currentState]);

          const newState = machineRef.current.step();
          setMachineState(newState);

          if (newState.halted) {
            setIsRunning(false);
            if (runIntervalRef.current) {
              clearInterval(runIntervalRef.current);
              runIntervalRef.current = null;
            }
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
    setWarning(null);
    const result = compileTripla(code);

    if (result.success) {
      setInstructions(result.instructionStrings);
      setIsCompiled(true);
      setStateHistory([]);

      const machineInstructions = parseInstructions(result.instructionStrings);
      machineRef.current = new AbstractMachine(machineInstructions);
      setMachineState(machineRef.current.getState());
    } else {
      setError(result.error || "Unknown compilation error");
      setIsCompiled(false);
      setInstructions([]);
      machineRef.current = null;
      setMachineState(initialMachineState);
      setStateHistory([]);
    }
  };

  const handleStep = () => {
    setWarning(null);
    if (machineRef.current && !machineRef.current.isHalted()) {
      const currentState = machineRef.current.getState();
      setStateHistory((prev) => [...prev, currentState]);

      const newState = machineRef.current.step();
      setMachineState(newState);
    }
  };

  const handleStepBack = () => {
    setWarning(null);
    if (stateHistory.length > 0 && machineRef.current) {
      const previousState = stateHistory[stateHistory.length - 1];
      setStateHistory((prev) => prev.slice(0, -1));
      machineRef.current.restoreState(previousState);
      setMachineState(previousState);
    }
  };

  const handleRun = () => {
    setWarning(null);
    if (isRunning) {
      setIsRunning(false);
    } else if (machineRef.current && !machineRef.current.isHalted()) {
      setIsRunning(true);
    }
  };

  // Instantly execute to the terminal state, skipping the timed animation.
  // Every intermediate state is pushed to history so "Back" still works.
  const handleRunToEnd = () => {
    setWarning(null);
    setIsRunning(false);
    const machine = machineRef.current;
    if (!machine || machine.isHalted()) return;

    const collected: MachineState[] = [];
    let steps = 0;
    while (!machine.isHalted() && steps < MAX_RUN_TO_END_STEPS) {
      collected.push(machine.getState());
      machine.step();
      steps += 1;
    }

    setStateHistory((prev) => [...prev, ...collected]);
    setMachineState(machine.getState());

    if (!machine.isHalted()) {
      setWarning(`Stopped after ${MAX_RUN_TO_END_STEPS.toLocaleString()} steps — possible infinite loop.`);
    }
  };

  const handleReset = () => {
    setIsCompiled(false);
    setIsRunning(false);
    setInstructions([]);
    setError(null);
    setWarning(null);
    setStateHistory([]);

    if (machineRef.current) {
      machineRef.current.reset();
    }
    machineRef.current = null;
    setMachineState(initialMachineState);
  };

  const result = resultOf(machineState);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-destructive">Compilation error</p>
              <p className="mt-1 font-mono text-sm text-destructive/90">{error}</p>
            </div>
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
            <StackVisualization machineState={machineState} result={result} />
          </div>
        </div>

        {/* Compiler Controls */}
        <CompilerControls
          onCompile={handleCompile}
          onStep={handleStep}
          onStepBack={handleStepBack}
          onRun={handleRun}
          onRunToEnd={handleRunToEnd}
          onReset={handleReset}
          isCompiled={isCompiled}
          isRunning={isRunning}
          isHalted={machineState.halted}
          canStep={!machineState.halted}
          canStepBack={stateHistory.length > 0}
          instructionCount={instructions.length}
          result={result}
          warning={warning}
        />
      </main>
    </div>
  );
};

export default Index;
