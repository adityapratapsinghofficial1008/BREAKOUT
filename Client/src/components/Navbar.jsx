import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth';

export default function Navbar({ user, onLogout, setAuthView }) {
  const navigate = useNavigate();

  const initial = user?.name?.charAt(0)?.toUpperCase()
    || user?.email?.charAt(0)?.toUpperCase()
    || 'U';

  const handleLogout = () => {
    authClient.clearAuth();
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-5">
      <nav className="max-w-7xl mx-auto h-16 px-6 sm:px-8 border border-neutral-800 bg-neutral-950/90 text-white shadow-2xl backdrop-blur-md flex items-center justify-between">
        {/* Brand Logo - Swiss Typography */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 flex items-center justify-center font-mono font-bold text-xs border bg-white text-neutral-950 border-white">
            BK
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-widest uppercase font-mono">
              BREAKOUT
            </span>
            <span className="text-[9px] font-mono tracking-tighter text-neutral-500 uppercase -mt-1">
              SYS.V2.4 // RETENTION ENGINE
            </span>
          </div>
        </a>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {user ? (
            /* Logged-in User Controls */
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-xs font-mono font-bold cursor-pointer px-4 py-2 border border-neutral-700 bg-neutral-900 hover:bg-white hover:text-neutral-950 text-white transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                DASHBOARD
              </button>
              
              <button
                onClick={handleLogout}
                title={`Signed in as ${user.email}\nClick to log out`}
                className="w-9 h-9 font-mono font-bold text-xs flex items-center justify-center border border-white bg-white text-neutral-950 hover:bg-neutral-200 transition-all cursor-pointer"
              >
                {initial}
              </button>
            </div>
          ) : (
            /* Guest Controls */
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAuthView && setAuthView('login')}
                className="text-xs font-mono font-bold px-3 py-2 text-neutral-300 hover:text-white transition-colors cursor-pointer uppercase tracking-wider"
              >
                LOG IN
              </button>

              <button
                onClick={() => setAuthView && setAuthView('signup')}
                className="px-5 py-2 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wider border border-white bg-white text-neutral-950 hover:bg-neutral-200"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
