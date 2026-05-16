'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Server Component Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#0d1117]">
      <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl text-error">warning</span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">System Error Detected</h1>
      <p className="text-on-surface-variant max-w-md mb-8">
        We encountered a temporary server-side rendering issue. This usually resolves itself after a quick refresh.
      </p>
      
      {error.digest && (
        <div className="mb-8 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
          <code className="text-[10px] text-primary/70 font-mono">Error ID: {error.digest}</code>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"
        >
          Try Again
        </button>
        <Link
          href="/marketplace"
          className="bg-white/5 text-white border border-white/10 px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
