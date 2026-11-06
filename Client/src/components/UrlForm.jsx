import { ArrowRight, Play, CheckCircle2, Terminal } from 'lucide-react';

export default function UrlForm({ videoUrl, setVideoUrl, onSubmit }) {
  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Structural Editorial Header */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 border font-mono text-[11px] font-bold uppercase tracking-widest mb-6 border-neutral-800 bg-neutral-900/60 text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          SYSTEM STATUS: ONLINE // INTELLECTUAL RETENTION SUITE
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] uppercase text-white">
          STOP PASSIVE WATCHING.<br />
          <span className="italic font-serif font-normal text-neutral-400">
            VERIFY EVERYTHING.
          </span>
        </h1>

        <p className="text-base sm:text-lg font-normal leading-relaxed mt-6 max-w-2xl text-neutral-400">
          BREAKOUT automatically extracts YouTube transcripts, inserts active concept check-points, and verifies your retention using natural voice & text AI evaluation.
        </p>
      </div>

      {/* URL Input Form Container */}
      <div className="mt-10 max-w-3xl">
        <form onSubmit={onSubmit} className="relative">
          <div className="p-2 border flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all bg-neutral-950 border-neutral-800 focus-within:border-white shadow-2xl">
            <div className="flex items-center gap-3 px-4 py-2 flex-1">
              <Terminal className="w-5 h-5 shrink-0 text-neutral-500" />
              <input
                type="url"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste YouTube Video URL (e.g., https://youtube.com/watch?v=...)"
                className="w-full bg-transparent font-mono text-sm sm:text-base outline-none transition-colors text-white placeholder:text-neutral-600"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-4 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 shrink-0 border bg-white text-neutral-950 border-white hover:bg-neutral-200"
            >
              <span>INITIALIZE WORKSPACE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* System Capabilities Meta Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>INSTANT PARSE & TRANSCRIBE</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>FEYNMAN VOICE ENGINE</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>VERIFIED CAPSTONE CREATION</span>
          </div>
        </div>
      </div>

      {/* Demo Video Teaser Ribbon */}
      <div className="mt-16 border-t border-neutral-800 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3 text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>TRY SAMPLE CURRICULUMS:</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setVideoUrl("https://www.youtube.com/watch?v=t8pPdKYpowI")}
            className="px-3 py-1.5 border border-neutral-800 hover:border-neutral-500 transition-colors text-neutral-300 hover:text-white"
          >
            Python CLI Finance →
          </button>
          <button
            type="button"
            onClick={() => setVideoUrl("https://www.youtube.com/watch?v=YLq5sV_Zg6U")}
            className="px-3 py-1.5 border border-neutral-800 hover:border-neutral-500 transition-colors text-neutral-300 hover:text-white"
          >
            AVL Tree Self-Balancing →
          </button>
          <button
            type="button"
            onClick={() => setVideoUrl("https://www.youtube.com/watch?v=hQcFE0RD0cQ")}
            className="px-3 py-1.5 border border-neutral-800 hover:border-neutral-500 transition-colors text-neutral-300 hover:text-white"
          >
            React Kanban Board →
          </button>
        </div>
      </div>
    </section>
  );
}
