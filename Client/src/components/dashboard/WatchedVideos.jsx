import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Layers, Clock, Terminal } from 'lucide-react';

const watchedTutorialsMock = [
  {
    id: "py-cli",
    title: "Python for Beginners: CLI Personal Finance",
    duration: "2h 45m",
    watchedAt: "June 15, 2026",
    code: "CRS-01",
    tasks: [
      "Create an interactive command menu",
      "Implement JSON/CSV data persistence",
      "Generate weekly expense summaries",
      "Add category search & budget alerts"
    ]
  },
  {
    id: "dsa-avl",
    title: "Data Structures: AVL Tree Self-Balancing",
    duration: "6h 15m",
    watchedAt: "June 12, 2026",
    code: "CRS-02",
    tasks: [
      "Implement AVL Tree node rotation logic",
      "Build SVG-based tree structure renderer",
      "Animate traversal routes step-by-step",
      "Integrate node lookup metrics visualizer"
    ]
  },
  {
    id: "web-kanban",
    title: "React & Tailwind CSS: Interactive Kanban Board",
    duration: "4h 10m",
    watchedAt: "June 08, 2026",
    code: "CRS-03",
    tasks: [
      "Implement HTML5 Drag & Drop event system",
      "Create status columns and task details modal",
      "Synchronize changes with browser storage",
      "Add filter tags for task search"
    ]
  },
  {
    id: "db-schema",
    title: "PostgreSQL Database Admin: ER Schemas",
    duration: "3h 30m",
    watchedAt: "June 02, 2026",
    code: "CRS-04",
    tasks: [
      "Design schema normalized to 3NF",
      "Write transactions with ACID constraints",
      "Create triggers for auto-updating stock",
      "Build indexing rules for catalog search"
    ]
  }
];

export default function WatchedVideos({ dashboardData }) {
  const navigate = useNavigate();
  const rawSessions = dashboardData?.recentSessions || [];

  const watchedTutorials = rawSessions.map((session) => {
    const staticInfo = watchedTutorialsMock.find((t) => t.id === session.videoId);
    return {
      ...session,
      code: staticInfo ? staticInfo.code : "CRS-SYS",
      title: session.title || (staticInfo ? staticInfo.title : "Custom Video Tutorial"),
      tasks: staticInfo ? staticInfo.tasks : [
        "Complete the quiz checkpoint questions",
        "Submit all topic explanations",
        "Improve your overall competency"
      ]
    };
  });

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (watchedTutorials.length > 0 && !selectedId) {
      setSelectedId(watchedTutorials[0].videoId || watchedTutorials[0].id);
    }
  }, [watchedTutorials, selectedId]);

  const activeTutorial = watchedTutorials.find(t => (t.videoId || t.id) === selectedId);

  return (
    <div className="p-6 sm:p-8 border border-neutral-800 bg-neutral-950 text-neutral-100 flex flex-col font-mono">
      <div className="flex items-center justify-between mb-6 border-b border-neutral-800/40 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider">TUTORIAL & CAPSTONE REGISTRY</h2>
        </div>
        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
          {watchedTutorials.length} ACTIVE WORKSPACES
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        {/* Left column: Watched Videos List */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">
            // SELECT WORKSPACE MODULE
          </span>
          <div className="space-y-2 overflow-y-auto pr-1 max-h-[340px]">
            {watchedTutorials.map((tutorial) => {
              const currentId = tutorial.videoId || tutorial.id;
              const isActive = currentId === selectedId;
              return (
                <button
                  key={currentId}
                  onClick={() => setSelectedId(currentId)}
                  className={`w-full text-left p-3.5 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-neutral-950 border-white'
                      : 'bg-neutral-900/50 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase mb-1">
                    <span className={isActive ? 'text-neutral-700' : 'text-amber-500'}>
                      {tutorial.code}
                    </span>
                    <span>SCORE: {tutorial.capstoneScore || 0}%</span>
                  </div>
                  <h3 className="text-xs font-bold font-sans uppercase tracking-tight truncate">
                    {tutorial.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-mono opacity-80">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tutorial.duration || '0m'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Capstone Specification details */}
        <div className="lg:col-span-7">
          {activeTutorial ? (
            <div className="h-full flex flex-col justify-between p-6 border border-neutral-800 bg-neutral-900/40">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4 border-b border-neutral-800/40 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">
                      CAPSTONE SPECIFICATION // {activeTutorial.code}
                    </span>
                    <h4 className="text-sm font-extrabold uppercase font-sans tracking-tight mt-1">
                      {activeTutorial.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 border border-neutral-700 bg-neutral-950 text-emerald-400 uppercase">
                    SCORE: {activeTutorial.capstoneScore || 0}%
                  </span>
                </div>

                <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-6">
                  Complete the checkpoint questions and Feynman voice prompts for this tutorial to raise your overall capstone score.
                </p>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                    MODULE CHECKLIST
                  </span>
                  <ul className="space-y-2 font-sans text-xs">
                    {activeTutorial.tasks && activeTutorial.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-neutral-300">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-800/40 flex justify-end">
                <button
                  onClick={() => navigate(`/workspace/${activeTutorial.videoId || activeTutorial.id}`)}
                  className="px-5 py-2.5 border border-white bg-white text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer hover:bg-neutral-200"
                >
                  <span>LAUNCH WORKSPACE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-neutral-800 p-6 text-center text-neutral-500 font-bold text-xs">
              <Layers className="w-8 h-8 text-neutral-600 mb-2" />
              <span>SELECT A MODULE TO VIEW SPECIFICATION</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
