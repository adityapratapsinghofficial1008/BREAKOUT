import { LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../../lib/auth';

export default function Sidebar({ userName = "Guest", userEmail = "Local Session" }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authClient.clearAuth();
    navigate('/');
  };

  return (
    <aside className="w-64 h-screen sticky top-0 hidden md:flex flex-col justify-between p-6 border-r border-neutral-800 bg-neutral-950 text-white">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center font-mono font-bold text-xs border bg-white text-neutral-950 border-white">
            BK
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-widest uppercase font-mono block">BREAKOUT</span>
            <span className="text-[9px] font-mono text-neutral-500 uppercase">TELEMETRY DECK</span>
          </div>
        </div>

        {/* Navigation Rail */}
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 border font-mono text-xs font-bold border-white bg-white text-neutral-950">
            <LayoutDashboard className="w-4 h-4" /> DASHBOARD
          </a>
        </nav>
      </div>

      {/* User Session Card */}
      <div className="p-4 border font-mono bg-neutral-900/60 border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center font-bold text-xs border bg-neutral-950 border-neutral-700 text-amber-400">
              {userName ? userName.charAt(0).toUpperCase() : "G"}
            </div>
            <div>
              <h4 className="text-xs font-bold leading-tight truncate max-w-[100px]">{userName || "Guest"}</h4>
              <span className="text-[9px] text-neutral-500 font-mono block truncate max-w-[100px]">{userEmail || "Local Session"}</span>
            </div>
          </div>

          <button 
            onClick={handleLogout} 
            className="text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer" 
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[9px] text-neutral-500 border-t border-neutral-800/40 pt-2">
          <span>STATUS: AUTHENTICATED</span>
          <span className="text-emerald-500 font-bold">ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
