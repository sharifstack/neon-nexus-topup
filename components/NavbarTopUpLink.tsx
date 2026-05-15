"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function NavbarTopUpLink() {
  const { dict } = useTranslation();
  return (
    <Link href="/topup" className="bg-primary-container text-on-primary-container px-lg py-sm rounded-full font-label-md text-label-md hover:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)]">
      {dict.nav.topUp}
    </Link>
  );
}
