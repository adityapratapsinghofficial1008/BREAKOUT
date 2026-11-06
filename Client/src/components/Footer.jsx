export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 bg-neutral-950 text-white py-12 px-6 sm:px-12 flex flex-col gap-8 font-mono">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center font-bold text-[10px]">
            BK
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-widest uppercase block">BREAKOUT ENGINE</span>
            <span className="text-[10px] text-neutral-500">© 2026 ENG_RUN. ALL RIGHTS RESERVED.</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-xs font-bold text-neutral-500 uppercase tracking-widest">
          <a href="#" className="hover:text-amber-400 transition-colors">PRIVACY_SPEC</a>
          <a href="#" className="hover:text-amber-400 transition-colors">TERMS_MANIFEST</a>
          <a href="https://github.com/your-org/break-out" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">GITHUB_SRC</a>
        </div>
      </div>
    </footer>
  );
}
