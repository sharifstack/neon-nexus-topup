"use client";

import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CheckEmailPage() {
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setResending(true);
    // In a real app, this would call a server action with the user's email from session or state
    setTimeout(() => {
      setMessage('Verification link resent! Please check your spam folder.');
      setResending(false);
    }, 2000);
  };

  return (
    <div className="flex-grow flex items-center justify-center py-xxl px-gutter bg-gradient-animated relative overflow-hidden min-h-[80vh]">
      <div className="glass-panel-premium p-xl rounded-2xl w-full max-w-[500px] shadow-[0_0_50px_rgba(0,242,255,0.1)] flex flex-col items-center animate-fade-in-up relative z-10 border border-white/5 backdrop-blur-xl">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/40 shadow-[0_0_30px_rgba(0,242,255,0.3)] mb-xl animate-pulse">
          <Mail className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-md text-center tracking-tight">Check Your Inbox</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant text-center mb-xl leading-relaxed">
          We've sent a secure verification link to your email address. Please click the link to activate your account and gain access to the Nexus.
        </p>

        <div className="w-full flex flex-col gap-md">
          {message && (
            <div className="p-sm bg-tertiary/20 text-tertiary rounded-lg text-center font-label-md border border-tertiary/30">
              {message}
            </div>
          )}
          
          <button 
            onClick={handleResend}
            disabled={resending}
            className="w-full flex items-center justify-center gap-sm py-md bg-surface-variant/50 hover:bg-primary/10 text-primary border border-primary/30 rounded-xl font-headline-md transition-all disabled:opacity-50"
          >
            {resending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            Resend Verification Link
          </button>

          <Link 
            href="/login" 
            className="w-full flex items-center justify-center gap-sm py-md text-on-surface-variant hover:text-white transition-colors font-label-md"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </div>

        <div className="mt-xl pt-lg border-t border-white/5 w-full text-center">
          <p className="text-xs text-on-surface-variant/60">
            Didn't receive the email?Please check your spam folder or contact support at <span className="text-primary">[EMAIL_ADDRESS]</span>
          </p>
        </div>
      </div>
    </div>
  );
}
