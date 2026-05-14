"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function VerifyTokenPage() {
  const { token } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Initiating nexus handshake...');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage('Account activated successfully! Redirecting to login...');

          // Start countdown
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                router.push('/login');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification link expired or invalid.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error during verification.');
      }
    }

    if (token) verify();
  }, [token, router]);

  return (
    <div className="flex-grow flex items-center justify-center py-xxl px-gutter bg-gradient-animated relative overflow-hidden min-h-[80vh]">
      <div className="glass-panel-premium p-xl rounded-2xl w-full max-w-[500px] shadow-[0_0_50px_rgba(0,242,255,0.1)] flex flex-col items-center animate-fade-in-up relative z-10 border border-white/5 backdrop-blur-xl">

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-md">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <p className="font-headline-md text-headline-md text-primary animate-pulse">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center text-center gap-lg">
            <div className="w-24 h-24 rounded-full bg-tertiary/10 flex items-center justify-center border-2 border-tertiary/40 shadow-[0_0_30px_rgba(72,207,203,0.3)]">
              <CheckCircle2 className="w-12 h-12 text-tertiary" />
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Access Granted</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {message}
            </p>
            <div className="flex flex-col items-center gap-sm mt-md">
              <div className="text-4xl font-bold text-primary">{countdown}</div>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest">Seconds remaining</p>
            </div>
            <Link
              href="/login"
              className="mt-md flex items-center gap-sm px-xl py-3 bg-primary text-on-primary rounded-xl font-headline-md hover:scale-105 transition-all shadow-lg glow-primary"
            >
              Manual Override
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-center gap-lg">
            <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center border-2 border-error/40 shadow-[0_0_30px_rgba(255,107,157,0.3)]">
              <XCircle className="w-12 h-12 text-error" />
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Link Compromised</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {message}
            </p>
            <Link
              href="/register"
              className="mt-md flex items-center gap-sm px-xl py-3 bg-surface-variant/50 text-on-surface hover:bg-primary/10 border border-primary/30 rounded-xl font-headline-md transition-all"
            >
              Request New Link
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
