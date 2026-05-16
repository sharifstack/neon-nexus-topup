"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/app/actions/auth";

export default function NavbarClient({ user }: { user: any }) {
  const { dict } = useTranslation();
  const t = dict.nav;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const navLinks = [
    { name: t.marketplace, href: "/marketplace", icon: "store" },
    { name: t.promos, href: "/deals", icon: "local_offer" },
    { name: "Points", href: "/points", icon: "stars", highlight: true },
  ];

  if (user?.role === "admin") {
    navLinks.push({ name: t.admin, href: "/admin", icon: "admin_panel_settings" });
  }

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9998] lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-[#0d0d14] border-l border-white/10 z-[9999] flex flex-col lg:hidden shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-primary font-black tracking-tighter">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
                <span className="text-lg uppercase">Neon Nexus</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-white transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
              {/* Navigation Links */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] px-2 mb-2">Navigation</span>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 p-3 rounded-2xl text-sm font-black tracking-widest uppercase transition-all ${
                        isActive
                          ? "bg-primary/10 border border-primary/20 text-primary shadow-[0_0_20px_rgba(0,242,255,0.1)]"
                          : link.highlight
                          ? "hover:bg-amber-500/5 text-amber-400 border border-transparent hover:border-amber-500/20"
                          : "hover:bg-white/5 text-white/70 hover:text-white border border-transparent"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        isActive
                          ? "bg-primary border-primary text-black"
                          : link.highlight 
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                          : "bg-white/5 border-white/10 text-on-surface-variant"
                      }`}>
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {link.icon}
                        </span>
                      </div>
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* User Section for Mobile */}
              <div className="pt-6 border-t border-white/5">
                <span className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] px-2 mb-4 block">Account</span>
                {user ? (
                  <div className="space-y-3">
                    <Link
                      href="/account"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:bg-white/5 hover:border-white/10 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors">
                        <img 
                          src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user._id || user.email}`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                          onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`; }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-black uppercase tracking-widest text-xs">{user.name || "My Account"}</p>
                        <p className="text-on-surface-variant text-[10px] font-bold line-clamp-1">{user.email}</p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">chevron_right</span>
                    </Link>

                    <Link
                      href="/points"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 text-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                        <span className="font-black text-xs uppercase tracking-widest">Points Balance</span>
                      </div>
                      <span className="font-black text-lg italic tracking-tighter">{(user.points || 0).toLocaleString()}</span>
                    </Link>

                    <form action={logout} className="pt-2">
                      <button
                        type="submit"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border border-red-500/20 text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Logout
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest text-center hover:bg-white/10 transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="py-4 rounded-2xl bg-primary border border-primary text-black font-black text-xs uppercase tracking-widest text-center shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Join
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Desktop Links - RESTORED ORIGINAL DESIGN */}
      <div className="hidden md:flex items-center gap-xl">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body-md text-body-md transition-all duration-300 flex items-center gap-1 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] ${
                link.highlight
                  ? "text-amber-400 hover:text-amber-300"
                  : isActive
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {link.icon && (
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {link.icon}
                </span>
              )}
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Menu Button - MD Breakpoint */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-primary hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all active:scale-95 shadow-lg"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>

      {/* Mobile Drawer Portal */}
      {mounted ? createPortal(drawerContent, document.body) : null}
    </>
  );
}
