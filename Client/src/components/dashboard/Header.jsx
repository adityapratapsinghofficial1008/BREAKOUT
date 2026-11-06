import { Calendar, Terminal } from 'lucide-react';

export default function Header({ userName }) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full border-b border-neutral-800 pb-6">
      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">
          <Terminal className="w-3.5 h-3.5" /> COMMAND CENTER // OVERVIEW
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          WELCOME BACK, {userName ? userName.split(' ')[0] : 'GUEST'}.
        </h1>
        <p className="text-xs font-mono mt-0.5 text-neutral-400">
          Active session initialized. Continue technical retention tracking.
        </p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        {/* Live Date Node Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 border text-xs font-bold font-mono bg-neutral-950 border-neutral-800 text-neutral-400 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-neutral-400" /> {formattedDate}
        </div>
      </div>
    </header>
  );
}
