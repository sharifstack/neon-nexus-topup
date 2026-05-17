"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  FileText,
  ShieldAlert,
  Image as ImageIcon,
  Zap,
  Star,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from "@/app/actions/auth";

const navItems = [
  { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, href: '/admin' },
  { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '/admin/analytics' },
  { name: 'Inventory', icon: <Package className="w-5 h-5" />, href: '/admin/inventory' },
  { name: 'Banners', icon: <ImageIcon className="w-5 h-5" />, href: '/admin/banners' },
  { name: 'Deals & Drops', icon: <Zap className="w-5 h-5" />, href: '/admin/deals' },
  { name: 'Points Store', icon: <Star className="w-5 h-5" />, href: '/admin/points' },
  { name: 'Orders', icon: <ShoppingCart className="w-5 h-5" />, href: '/admin/orders' },
  { name: 'Users', icon: <Users className="w-5 h-5" />, href: '/admin/users' },
  { name: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      {/* ── Desktop Sidebar (Unchanged) ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col p-md space-y-sm bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl text-primary dark:text-primary font-label-md text-label-md h-[calc(100vh-5rem)] w-64 fixed left-0 top-20 z-40 border-r border-outline-variant/10 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-md mb-xl px-sm pt-sm mt-4">
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
            <ShieldAlert className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Admin Panel</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Nexus Control</p>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
                    : 'text-on-surface-variant hover:bg-surface-variant/30 hover:translate-x-1'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* CTA */}
        <div className="mt-auto pt-lg border-t border-outline-variant/10 pb-sm">
          <button className="w-full py-sm px-md bg-surface-variant/50 hover:bg-primary/10 text-primary border border-primary/20 rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm transition-all hover:shadow-[0_0_15px_rgba(0,242,255,0.2)]">
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </aside>

      {/* ── Mobile Floating Hamburger Button ─────────────────────────────────── */}
      <div className="md:hidden fixed bottom-20 right-4 z-40 flex items-center gap-2">
        <button 
          onClick={() => setIsOpen(true)}
          className="px-5 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_20px_rgba(0,242,255,0.5)] active:scale-95 transition-all border border-cyan-400"
          aria-label="Open Admin Menu"
        >
          <Menu className="w-5 h-5 text-black" />
          <span>Admin Menu</span>
        </button>
      </div>

      {/* ── Mobile Compact Bottom Admin Nav ─────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#131b2e]/95 backdrop-blur-2xl border-t border-white/10 z-30 flex items-center justify-around px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        {[
          { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, href: '/admin' },
          { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '/admin/analytics' },
          { name: 'Inventory', icon: <Package className="w-5 h-5" />, href: '/admin/inventory' },
          { name: 'Orders', icon: <ShoppingCart className="w-5 h-5" />, href: '/admin/orders' },
        ].map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive ? 'text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] font-bold' : 'text-on-surface-variant opacity-70 hover:opacity-100'
              }`}
            >
              {item.icon}
              <span className="text-[10px] uppercase tracking-wider font-semibold">{item.name}</span>
            </Link>
          );
        })}

        <button 
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-on-surface-variant opacity-70 hover:opacity-100 transition-all"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Menu</span>
        </button>
      </div>

      {/* ── Mobile Drawer / Slide-In Sidebar ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Slide-In Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0a0f1d]/95 backdrop-blur-3xl z-50 md:hidden flex flex-col border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.8)] overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#131b2e]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <ShieldAlert className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="font-bold text-white uppercase tracking-tight text-base">Admin Panel</h1>
                    <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Nexus Control</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                  aria-label="Close Admin Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <p className="px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">CMS Management</p>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-sm tracking-wide ${
                        isActive 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                          : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Admin Profile & Logout Section */}
              <div className="p-6 border-t border-white/10 bg-[#131b2e]/30 space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-md">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-white uppercase tracking-wider truncate">Admin Operative</p>
                    <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      System Online
                    </p>
                  </div>
                </div>

                <form action={logout}>
                  <button 
                    type="submit"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                  >
                    <LogOut className="w-4 h-4" />
                    Secure Logout
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
