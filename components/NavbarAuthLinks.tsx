"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function NavbarAuthLinks() {
  const { dict } = useTranslation();
  return (
    <>
      <Link href="/login" className="text-on-surface-variant hover:text-primary font-label-md text-label-md px-md py-sm transition-colors">
        {dict.nav.login}
      </Link>
      <Link href="/register" className="bg-primary-container text-on-primary-container px-lg py-sm rounded-full font-label-md text-label-md hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]">
        {dict.nav.register}
      </Link>
    </>
  );
}
