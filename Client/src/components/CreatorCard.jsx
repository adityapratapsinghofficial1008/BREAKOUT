import { FaGithub, FaLinkedin } from 'react-icons/fa6';

export default function CreatorCard({ className = '' }) {
  return (
    <div
      className={`border px-3 py-2 flex items-center gap-3 font-mono text-[11px] backdrop-blur-md shadow-2xl transition-all border-neutral-800 bg-neutral-950/95 text-neutral-200 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] uppercase tracking-wider text-neutral-400">
          Created by
        </span>
        <span className="font-bold text-white tracking-wide">
          Adityapratap Singh
        </span>
      </div>

      <div className="h-3 w-px bg-neutral-800" />

      <div className="flex items-center gap-2 text-neutral-400">
        <a
          href="https://github.com/adityapratap005"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          className="hover:text-amber-400 transition-colors p-0.5"
        >
          <FaGithub className="w-3.5 h-3.5" />
        </a>
        <a
          href="https://www.linkedin.com/in/adityapratapsingh005"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          className="hover:text-amber-400 transition-colors p-0.5"
        >
          <FaLinkedin className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
