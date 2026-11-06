import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { authClient } from '../lib/auth';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided in the URL.');
      return;
    }

    authClient.verifyEmail(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Your email has been verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification link is invalid or has expired.');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-mono bg-neutral-950 text-white">
      <div className="w-full max-w-md border border-neutral-800 bg-neutral-900/60 p-8 shadow-2xl text-center space-y-6">
        <div className="flex justify-center">
          {status === 'loading' && <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />}
          {status === 'success' && <CheckCircle2 className="w-12 h-12 text-emerald-500" />}
          {status === 'error' && <AlertCircle className="w-12 h-12 text-rose-500" />}
        </div>

        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 block mb-2">
            // EMAIL VERIFICATION PROTOCOL
          </span>
          <h1 className="text-xl font-black uppercase tracking-tight">
            {status === 'loading' && 'VERIFYING YOUR ACCOUNT...'}
            {status === 'success' && 'EMAIL VERIFIED SUCCESSFULLY'}
            {status === 'error' && 'VERIFICATION FAILED'}
          </h1>
          <p className="text-xs text-neutral-400 mt-2 font-sans leading-relaxed">
            {message}
          </p>
        </div>

        {status === 'success' && (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border bg-white text-neutral-950 border-white hover:bg-neutral-200"
          >
            <span>ENTER DASHBOARD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {status === 'error' && (
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full py-3 font-mono font-bold text-xs uppercase tracking-wider transition-all border border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-neutral-500"
          >
            RETURN TO HOME
          </Link>
        )}
      </div>
    </div>
  );
}
