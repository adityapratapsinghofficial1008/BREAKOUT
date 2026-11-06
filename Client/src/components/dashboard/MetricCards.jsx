import { Play, CheckCircle2, TrendingUp, Award, ArrowUpRight } from 'lucide-react';

export default function MetricCards({ dashboardData }) {
  const data = dashboardData || { totalWatchMinutes: 0, averageScore: 0, totalTopicsCount: 0, avgOverallCompetency: 0 };
  
  const cards = [
    { 
      code: "METRIC-01",
      title: "Total Watch Time", 
      sub: "ACTIVE LEARNING", 
      value: Math.floor(data.totalWatchMinutes / 60) + "h " + (data.totalWatchMinutes % 60) + "m", 
      unit: "learned", 
      stroke: "#6366f1", 
      fillId: "gradient-watch",
      trend: "+15% this week",
      icon: <Play className="w-3.5 h-3.5" />, 
      path: "M 0 35 Q 30 28, 60 32 T 120 18 T 180 22 T 240 10",
      fillPath: "M 0 35 Q 30 28, 60 32 T 120 18 T 180 22 T 240 10 L 240 50 L 0 50 Z"
    },
    { 
      code: "METRIC-02",
      title: "Topics Completed", 
      sub: "CHECKPOINTS PASSED", 
      value: data.totalTopicsCount, 
      unit: "mastered", 
      stroke: "#10b981", 
      fillId: "gradient-topics",
      trend: `${data.totalTopicsCount > 0 ? '+ ' + data.totalTopicsCount : '0'} completed`,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />, 
      path: "M 0 38 Q 40 35, 80 25 T 160 15 T 240 8",
      fillPath: "M 0 38 Q 40 35, 80 25 T 160 15 T 240 8 L 240 50 L 0 50 Z"
    },
    { 
      code: "METRIC-03",
      title: "Average Quiz Score", 
      sub: "ACCURACY RATE", 
      value: data.averageScore + "%", 
      unit: "accuracy", 
      stroke: "#8b5cf6", 
      fillId: "gradient-score",
      trend: data.averageScore >= 50 ? "Passing Benchmark" : "Needs Review",
      icon: <Award className="w-3.5 h-3.5" />, 
      path: "M 0 32 Q 40 38, 80 20 T 160 28 T 240 12",
      fillPath: "M 0 32 Q 40 38, 80 20 T 160 28 T 240 12 L 240 50 L 0 50 Z"
    },
    { 
      code: "METRIC-04",
      title: "Capstone Competency", 
      sub: "OVERALL MASTERY", 
      value: data.avgOverallCompetency + "%", 
      unit: "proficiency", 
      stroke: "#f59e0b", 
      fillId: "gradient-comp",
      trend: data.avgOverallCompetency >= 70 ? "Ready to Build" : "In Progress",
      icon: <TrendingUp className="w-3.5 h-3.5" />, 
      path: "M 0 40 Q 50 30, 100 35 T 180 15 T 240 5",
      fillPath: "M 0 40 Q 50 30, 100 35 T 180 15 T 240 5 L 240 50 L 0 50 Z"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 font-mono">
      {cards.map((c, i) => (
        <div 
          key={i} 
          className="p-6 border relative overflow-hidden transition-all duration-300 flex flex-col justify-between group border-neutral-800 bg-neutral-950 text-neutral-100 hover:border-neutral-600"
        >
          <div>
            {/* Top row: Metric ID & Category */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                {c.code} // {c.sub}
              </span>
              <div className="p-1.5 border border-neutral-800 bg-neutral-900 text-amber-400">
                {c.icon}
              </div>
            </div>

            {/* Metric Value */}
            <h3 className="text-3xl font-black tracking-tight text-white mt-1">
              {c.value}
            </h3>
            <p className="text-xs text-neutral-400 mt-1 uppercase font-bold tracking-wider">
              {c.title}
            </p>
          </div>

          {/* Sparkline & Trend */}
          <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
              {c.trend}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-neutral-500">
              TELEMETRY
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
