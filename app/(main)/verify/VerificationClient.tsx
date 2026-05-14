"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerificationClient() {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
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

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[80vh] px-6 py-12">
      <div className="w-full max-w-[480px] bg-surface-container-high rounded-[2.5rem] border border-white/5 p-8 md:p-12 text-center shadow-[0_0_60px_rgba(34,197,94,0.1)] flex flex-col items-center animate-fade-in-up">
        <div className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-500 border border-green-500/30">
          <span className="material-symbols-outlined text-green-500 text-5xl" style={{ textShadow: '0 0 20px rgba(34,197,94,0.5)' }}>verified_user</span>
        </div>
        
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 uppercase tracking-tighter leading-none">Account Verified!</h1>
        
        <p className="text-on-surface-variant text-lg leading-relaxed mb-10 opacity-80">
          Your account has been successfully verified. You can now access all features of Neon Nexus.
        </p>
        
        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-sm text-on-surface-variant/60 font-medium uppercase tracking-widest">
            Redirecting in <span className="text-primary font-black">{countdown}s</span>
          </p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_#00f2ff]" 
              style={{ width: `${(countdown / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
