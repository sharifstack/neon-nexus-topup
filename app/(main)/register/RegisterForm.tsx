"use client";

import { register } from '@/app/actions/auth';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/LanguageContext';

export default function RegisterForm() {
  const [error, setError] = useState('');
  const { dict } = useTranslation();
  const t = dict.auth;

  async function handleSubmit(formData: FormData) {
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <>
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs tracking-tight">{t.registerTitle}</h1>
      <p className="font-body-md text-body-md text-on-surface-variant text-center mb-xl opacity-80">{t.registerSubtitle}</p>

      <form action={handleSubmit} className="flex flex-col gap-lg w-full">
        {error && <div className="p-sm bg-error/20 text-error rounded-md text-sm border border-error/50 shadow-[0_0_15px_rgba(255,180,171,0.2)] animate-fade-in-up">{error}</div>}

        <div className="flex flex-col gap-xs group">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider group-focus-within:text-secondary transition-colors duration-300">{t.codename}</label>
          <input
            name="name"
            type="text"
            required
            className="input-premium-secondary w-full"
            placeholder="Cipher"
          />
        </div>

        <div className="flex flex-col gap-xs group">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider group-focus-within:text-secondary transition-colors duration-300">{t.email}</label>
          <input
            name="email"
            type="email"
            required
            className="input-premium-secondary w-full"
            placeholder="hacker@neon.nexus"
          />
        </div>

        <div className="flex flex-col gap-xs group">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider group-focus-within:text-secondary transition-colors duration-300">{t.password}</label>
          <input
            name="password"
            type="password"
            required
            className="input-premium-secondary w-full"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-secondary-container to-secondary text-on-secondary-container font-headline-md text-headline-md py-md rounded-xl mt-sm glow-secondary hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-white/20 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-sm">
            {t.registerBtn}
            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
        </button>

        <p className="text-center text-sm text-on-surface-variant mt-sm">
          {t.alreadyRegistered}{' '}
          <Link href="/login" className="text-secondary font-semibold hover:text-white hover:underline transition-colors duration-300">{t.accessTerminal}</Link>
        </p>
      </form>
    </>
  );
}
