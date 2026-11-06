import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth';

export default function AuthModal({ authView, setAuthView, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isUnverified, setIsUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessNotice('');
    setIsUnverified(false);

    try {
      setLoading(true);

      if (authView === 'signup') {
        const res = await authClient.register({ email, password, name });
        setSuccessNotice(res.message || 'Registration complete! Check your email for verification.');
        setEmail('');
        setPassword('');
        setName('');
      } else {
        const res = await authClient.login({ email, password });
        setAuthView(null);
        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        }
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      if (err.isUnverified) {
        setIsUnverified(true);
        setUnverifiedEmail(err.email || email);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError('');
      const targetEmail = unverifiedEmail || email;
      const res = await authClient.resendVerification(targetEmail);
      setSuccessNotice(res.message || 'A fresh verification link has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Could not resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono animate-in fade-in duration-200">
      <div className="w-full max-w-md border border-neutral-800 bg-neutral-950 text-white shadow-2xl relative">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              {authView === 'signup' ? 'REGISTER NEW ACCOUNT' : 'SECURE AUTH LOGIN'}
            </span>
          </div>
          <button 
            onClick={() => setAuthView(null)}
            className="text-neutral-500 hover:text-white transition-colors text-xs font-bold cursor-pointer"
          >
            [CLOSE ✕]
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              {authView === 'signup' ? 'CREATE LEARNING PROFILE' : 'WELCOME BACK TO BREAKOUT'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1 font-sans">
              {authView === 'signup' 
                ? 'Register your details to start adaptive learning and retain 100% of video tutorials.' 
                : 'Enter your registered credentials to access your retention suites.'}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <span>{error}</span>
                {isUnverified && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="block font-bold underline hover:text-red-300 cursor-pointer text-[11px]"
                  >
                    {resending ? 'Sending link...' : 'Resend verification email now →'}
                  </button>
                )}
              </div>
            </div>
          )}

          {successNotice && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4 font-sans text-xs">
            {authView === 'signup' && (
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Turing"
                  className="w-full px-4 py-2.5 font-mono text-xs border outline-none transition-colors bg-neutral-900 border-neutral-700 focus:border-white text-white"
                />
              </div>
            )}

            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 font-mono text-xs border outline-none transition-colors bg-neutral-900 border-neutral-700 focus:border-white text-white"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 font-mono text-xs border outline-none transition-colors pr-10 bg-neutral-900 border-neutral-700 focus:border-white text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border bg-white text-neutral-950 border-white hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <span>{authView === 'signup' ? 'REGISTER & SEND VERIFICATION' : 'SIGN IN TO DASHBOARD'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="text-center font-mono text-xs border-t border-neutral-800/60 pt-4">
            {authView === 'signup' ? (
              <span className="text-neutral-500">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setAuthView('login');
                    setError('');
                    setSuccessNotice('');
                  }}
                  className="text-amber-500 hover:underline font-bold"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span className="text-neutral-500">
                Need a new account?{' '}
                <button
                  onClick={() => {
                    setAuthView('signup');
                    setError('');
                    setSuccessNotice('');
                  }}
                  className="text-amber-500 hover:underline font-bold"
                >
                  Register
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
