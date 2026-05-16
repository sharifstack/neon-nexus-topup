"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function NavbarClient({ user }: { user: any }) {
  const { dict } = useTranslation();
  const t = dict.nav;
  return (
    <div className="hidden md:flex items-center gap-xl">
      <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]" href="/marketplace">{t.marketplace}</Link>
      <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]" href="/deals">{t.promos}</Link>
      <Link className="font-body-md text-body-md text-on-surface-variant hover:text-amber-400 hover:scale-105 transition-all duration-300 flex items-center gap-1" href="/points">
        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
        Points
      </Link>
      {user?.role === "admin" && (
        <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]" href="/admin">{t.admin}</Link>
      )}
    </div>
  );
}
