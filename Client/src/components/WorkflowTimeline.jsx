import { CheckCircle2 } from 'lucide-react';

const steps = [
  { 
    step: "01", 
    label: "INPUT TELEMETRY", 
    title: "Paste YouTube Video Link", 
    desc: "Drop in any programming course, computer science lecture, or complex technical tutorial link to begin." 
  },
  { 
    step: "02", 
    label: "AI ANALYSIS", 
    title: "Automated Checkpoint Build", 
    desc: "BREAKOUT parses the transcript, detects concept transitions, and builds Feynman check questions automatically." 
  },
  { 
    step: "03", 
    label: "VERIFIED RETENTION", 
    title: "Learn & Prove Mastery", 
    desc: "Watch undisturbed until checkpoints pause playback. Pass quizzes with 50%+ retention score to unlock and resume." 
  }
];

export default function WorkflowTimeline() {
  return (
    <section className="scroll-reveal py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-800 bg-neutral-950/40">
      {/* Section Header */}
      <div className="mb-16">
        <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-3">
          // OPERATIONAL EXECUTION WORKFLOW
        </span>
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          HOW BREAKOUT WORKS.
        </h2>
        <p className="text-sm sm:text-base font-normal mt-3 max-w-lg text-neutral-400">
          Three systematic phases to transform passive video watching into active, verifiable skills.
        </p>
      </div>

      {/* Step Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {steps.map((s, idx) => (
          <div 
            key={idx} 
            className="p-8 border border-neutral-800 bg-neutral-900/40 flex flex-col justify-between transition-all group hover:border-neutral-600"
          >
            <div>
              <div className="flex items-center justify-between font-mono mb-8">
                <span className="text-2xl font-black text-amber-500">
                  {s.step}
                </span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border border-neutral-800 px-2 py-0.5">
                  {s.label}
                </span>
              </div>

              <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-3">
                {s.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {s.desc}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center gap-2 font-mono text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SYSTEM AUTOMATED</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
