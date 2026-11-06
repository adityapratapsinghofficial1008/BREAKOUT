import { Target, Clock, CheckCircle2, Terminal } from 'lucide-react';

export default function WatchTimeMetrics({ dashboardData }) {
  const data = dashboardData || { totalWatchMinutes: 0, totalTopicsCount: 0, averageScore: 0 };
  const h = Math.floor(data.totalWatchMinutes / 60);
  const m = data.totalWatchMinutes % 60;

  const focusMetrics = [
    {
      code: "INSIGHT-01",
      title: "Learning Consistency",
      value: `${h}h ${m}m`,
      subtitle: "Total watch time spent learning",
      status: "ON TRACK",
      icon: <Clock className="w-3.5 h-3.5 text-amber-500" />
    },
    {
      code: "INSIGHT-02",
      title: "Checkpoint Retention",
      value: `${data.averageScore || 0}%`,
      subtitle: "Avg accuracy across quiz checks",
      status: data.averageScore >= 50 ? "HEALTHY" : "NEEDS REVIEW",
      icon: <Target className="w-3.5 h-3.5 text-emerald-500" />
    },
    {
      code: "INSIGHT-03",
      title: "Modules Completed",
      value: `${data.totalTopicsCount || 0} TOPICS`,
      subtitle: "Key concepts mastered in workspace",
      status: "ACTIVE",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
    }
  ];

  return (
    <div className="p-6 sm:p-8 border flex flex-col justify-between w-full font-mono transition-all border-neutral-800 bg-neutral-950 text-neutral-100">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-6 border-b border-neutral-800/40 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider">LEARNING VELOCITY & INSIGHTS</h2>
        </div>
        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
          TELEMETRY STREAM // LIVE
        </span>
      </div>

      {/* Grid of Micro-Metrics */}
      <div className="space-y-4">
        {focusMetrics.map((item, idx) => (
          <div 
            key={idx}
            className="p-4 border border-neutral-800 bg-neutral-900/40 flex items-center justify-between transition-all hover:border-neutral-700"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 border border-neutral-800 bg-neutral-950">
                {item.icon}
              </div>
              <div>
                <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-widest">
                  {item.code} // {item.title}
                </span>
                <span className="text-sm font-bold text-white tracking-tight">
                  {item.value}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2 py-0.5 border ${
              item.status === 'ON TRACK' || item.status === 'HEALTHY'
                ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                : 'border-amber-500/30 text-amber-400 bg-amber-500/5'
            }`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500">
        <span>STATUS: PASSIVE WATCHING DISABLED</span>
        <span className="text-emerald-500 font-bold">100% RECALL LOOP</span>
      </div>
    </div>
  );
}
