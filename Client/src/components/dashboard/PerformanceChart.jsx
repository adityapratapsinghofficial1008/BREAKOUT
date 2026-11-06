import { Terminal } from 'lucide-react';

export default function PerformanceChart({ dashboardData }) {
  const chartData = dashboardData?.chartData || [];
  
  const points = chartData.length > 0 
    ? chartData.map(c => ({
        label: new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.min(100, Math.max(0, c.score || 0)),
        avg: 65
      }))
    : [
        { label: "SESS-1", score: 65, avg: 65 },
        { label: "SESS-2", score: 80, avg: 65 },
        { label: "SESS-3", score: 75, avg: 65 },
        { label: "SESS-4", score: 90, avg: 65 }
      ];

  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 30;
  const paddingY = 20;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const getCoordinates = () => {
    if (points.length === 0) return [];
    if (points.length === 1) {
      const y = paddingY + chartHeight - (points[0].score / 100) * chartHeight;
      return [{ x: paddingX + chartWidth / 2, y, ...points[0] }];
    }
    const step = chartWidth / (points.length - 1);
    return points.map((p, i) => {
      const x = paddingX + i * step;
      const y = paddingY + chartHeight - (p.score / 100) * chartHeight;
      return { x, y, ...p };
    });
  };

  const coords = getCoordinates();

  const generateSmoothPath = (coordsList) => {
    if (coordsList.length === 0) return '';
    if (coordsList.length === 1) return `M ${coordsList[0].x} ${coordsList[0].y}`;

    let path = `M ${coordsList[0].x} ${coordsList[0].y}`;
    for (let i = 0; i < coordsList.length - 1; i++) {
      const current = coordsList[i];
      const next = coordsList[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const linePath = generateSmoothPath(coords);
  const areaPath = coords.length > 0 
    ? `${linePath} L ${coords[coords.length - 1].x} ${paddingY + chartHeight} L ${coords[0].x} ${paddingY + chartHeight} Z`
    : '';

  return (
    <div className="p-6 sm:p-8 border flex flex-col justify-between font-mono border-neutral-800 bg-neutral-950 text-neutral-100">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-neutral-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-black uppercase tracking-wider">RETENTION ACCURACY OSCILLOSCOPE</h2>
          </div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            QUIZ TELEMETRY (LAST 7 SESSIONS)
          </span>
        </div>

        {/* Legend Ribbon */}
        <div className="flex items-center gap-6 mb-6 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-amber-400" />
            <span className="text-neutral-400">SESSION SCORE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-neutral-600 border-b border-dashed border-neutral-500" />
            <span className="text-neutral-500">65% BENCHMARK</span>
          </div>
        </div>

        <div className="w-full h-44 relative pl-10 pr-4">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line 
              x1={paddingX} 
              y1={paddingY + chartHeight * 0.35} 
              x2={svgWidth - paddingX} 
              y2={paddingY + chartHeight * 0.35} 
              stroke="#525252" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
            />

            {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

            {linePath && (
              <path 
                d={linePath} 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="2.5" 
                strokeLinecap="square" 
              />
            )}

            {coords.map((pt, i) => (
              <g key={i}>
                <rect 
                  x={pt.x - 4} 
                  y={pt.y - 4} 
                  width="8" 
                  height="8" 
                  className="fill-neutral-950 stroke-amber-400" 
                  strokeWidth="2" 
                />
              </g>
            ))}
          </svg>
        </div>

        <div className="flex justify-between pl-10 pr-4 mt-3 text-[10px] font-bold text-neutral-500">
          {coords.map((pt, i) => (
            <span key={i} className="text-center uppercase">{pt.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
