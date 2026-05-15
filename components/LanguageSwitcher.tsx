"use client";

import { useState } from 'react';
import { useTranslation } from '@/lib/LanguageContext';
import { Locale } from '@/lib/dictionaries';

export default function LanguageSwitcher() {
  const { locale, dict, setLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Locale>(locale);
  const t = dict.language;

  const handleConfirm = () => {
    setLocale(selectedLang);
    setIsOpen(false);
    // Reload so server components re-render with new locale cookie
    window.location.reload();
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-sm text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-variant/30"
        title={t.title}
      >
        <span className="material-symbols-outlined">language</span>
        <span className="ml-1 text-xs font-bold uppercase hidden md:inline-block">{locale}</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Modal / Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-surface border border-primary/20 rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.15)] backdrop-blur-xl z-50 overflow-hidden">
          <div className="p-lg bg-surface-variant/20 border-b border-outline-variant/10">
            <h3 className="text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">public</span>
              {t.title}
            </h3>
          </div>

          <div className="p-lg space-y-md">
            {/* Region Row */}
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-xs">{t.currentRegion}</p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-variant/10 border border-outline-variant/10">
                <span className="text-sm">{t.global}</span>
                <span className="material-symbols-outlined text-tertiary">check_circle</span>
              </div>
            </div>

            {/* Language Options */}
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-xs">{t.selectedLanguage}</p>
              <div className="space-y-sm">
                <button
                  onClick={() => setSelectedLang('en')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    selectedLang === 'en'
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'bg-surface-variant/10 border-outline-variant/10 text-on-surface hover:border-outline-variant/30'
                  }`}
                >
                  <span className="text-sm font-semibold">🇬🇧 {t.english}</span>
                  {selectedLang === 'en' && <span className="material-symbols-outlined text-base">check</span>}
                </button>

                <button
                  onClick={() => setSelectedLang('bn')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    selectedLang === 'bn'
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'bg-surface-variant/10 border-outline-variant/10 text-on-surface hover:border-outline-variant/30'
                  }`}
                >
                  <span className="text-sm font-semibold">🇧🇩 {t.bangla}</span>
                  {selectedLang === 'bn' && <span className="material-symbols-outlined text-base">check</span>}
                </button>
              </div>
            </div>
          </div>

          <div className="p-md bg-surface-variant/20 border-t border-outline-variant/10">
            <button
              onClick={handleConfirm}
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
