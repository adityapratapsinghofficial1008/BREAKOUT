import { Eye, ShieldCheck, Mic, Database } from 'lucide-react';

const capabilities = [
  {
    code: "CAP-01",
    title: "Transcript Analysis & Telemetry",
    category: "PARSER ENGINE",
    desc: "Break-out extracts every timestamp and transcript sentence in real-time, mapping out precise topic boundaries automatically.",
    icon: Eye,
    metric: "100% PARSE ACCURACY",
    detail: "Telemetry tracks timestamp gaps"
  },
  {
    code: "CAP-02",
    title: "Adaptive Video Checkpoints",
    category: "ACTIVE LOCK",
    desc: "Video playback auto-pauses at concept thresholds. Playback remains locked until concept mastery is verified.",
    icon: ShieldCheck,
    metric: "ZERO PASSIVE WATCHING",
    detail: "Forced active recall loop"
  },
  {
    code: "CAP-03",
    title: "Feynman Voice & Text Engine",
    category: "COGNITIVE AI",
    desc: "Speak or type explanations in your own words. Neural AI evaluates concept depth like a private 1-on-1 mentor.",
    icon: Mic,
    metric: "NEURAL EVALUATION",
    detail: "Concept clarity scoring"
  },
  {
    code: "CAP-04",
    title: "Capstone Mastery Tracks",
    category: "PROOF OF BUILD",
    desc: "Every course culminates in structured project specifications and competency scores to verify real-world ability.",
    icon: Database,
    metric: "PORTFOLIO VERIFIED",
    detail: "Exportable mastery report"
  }
];

export default function FeaturesGrid() {
  return (
    <section className="scroll-reveal py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-800">
      {/* Editorial Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
        <div>
          <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-3">
            // CAPABILITIES ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            FOUR PILLARS OF ACTIVE RETENTION.
          </h2>
        </div>
        <p className="text-neutral-400 max-w-md text-sm sm:text-base font-normal leading-relaxed">
          Standard tutorials encourage passive nodding. BREAKOUT forces deep understanding through rigorous automated verification.
        </p>
      </div>

      {/* Grid Cards - Swiss Minimalist Architectural Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {capabilities.map((c) => {
          const IconComponent = c.icon;
          return (
            <div
              key={c.code}
              className="p-8 border flex flex-col justify-between transition-all duration-300 group border-neutral-800 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-900/70"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs font-bold text-amber-500 tracking-wider">
                    {c.code}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest border border-neutral-800 px-2 py-0.5">
                    {c.category}
                  </span>
                </div>

                <div className="w-10 h-10 border flex items-center justify-center mb-6 transition-colors border-neutral-800 bg-neutral-950 text-white group-hover:border-white">
                  <IconComponent className="w-5 h-5 text-amber-400" />
                </div>

                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-3">
                  {c.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {c.desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800/60 font-mono">
                <span className="text-[10px] text-neutral-500 block uppercase tracking-wider mb-1">
                  VERIFICATION TARGET
                </span>
                <span className="text-xs font-bold text-neutral-200">
                  {c.metric}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
