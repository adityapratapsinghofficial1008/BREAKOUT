import { FaCheck } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";

export default function PipelineModal({ currentStep, pipelineSteps }) {
  const isLastStep = currentStep === pipelineSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono">
      <div className="bg-neutral-950 text-white w-full max-w-lg p-8 border border-neutral-800 flex flex-col items-center text-center shadow-2xl">
        <div className="relative mb-6 flex items-center justify-center">
          {isLastStep ? (
            <div className="w-14 h-14 bg-white text-neutral-950 flex items-center justify-center text-xl font-bold">
              <FaCheck />
            </div>
          ) : (
            <ImSpinner2 className="w-12 h-12 text-amber-500 animate-spin" />
          )}
        </div>

        <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
          // SYSTEM PIPELINE EXECUTION
        </div>

        <h3 className="text-xl font-black uppercase tracking-tight">
          {isLastStep ? "INITIALIZATION COMPLETE" : "PARSING TELEMETRY STREAM"}
        </h3>
        <p className="text-neutral-400 text-xs mt-2 font-sans max-w-xs h-10">
          {pipelineSteps[currentStep]}
        </p>

        <div className="w-full bg-neutral-900 h-2 border border-neutral-800 my-6">
          <div 
            className="h-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / pipelineSteps.length) * 100}%` }}
          />
        </div>

        <div className="w-full bg-neutral-900/90 text-left p-4 border border-neutral-800 font-mono text-[11px] space-y-2">
          {pipelineSteps.slice(0, currentStep + 1).map((step, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-2 tracking-wide ${
                index === currentStep ? 'text-amber-400 font-bold' : 'text-neutral-500'
              }`}
            >
              <span>&gt;</span>
              <span>{index === pipelineSteps.length - 1 ? step : `${step.replace("...", "")} [OK]`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}