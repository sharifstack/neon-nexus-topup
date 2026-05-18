"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Mail, X } from "lucide-react";

interface ContactOption {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const contactOptions: ContactOption[] = [
  {
    id: "whatsapp",
    label: "WhatsApp Support",
    value: "01403876678",
    href: "https://wa.me/8801403876678",
    icon: <MessageCircle className="w-[18px] h-[18px]" />,
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  },
  {
    id: "email",
    label: "Email Support",
    value: "sharifstack@gmail.com",
    href: "mailto:sharifstack@gmail.com",
    icon: <Mail className="w-[18px] h-[18px]" />,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
  },
];

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed bottom-5 right-5 lg:bottom-8 lg:right-8 z-50 flex flex-col items-end">
      {/* Menu Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 bg-[#131b2e]/95 backdrop-blur-2xl border border-white/10 rounded-[1.25rem] p-2.5 w-[200px] md:w-[220px] shadow-2xl origin-bottom-right"
          >
            <div className="flex flex-col gap-2">
              <div className="px-1 py-1 border-b border-white/5 pb-2">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] block text-center">Contact Us</span>
              </div>
              {contactOptions.map((option, idx) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border transition-all duration-300 group ${option.color}`}
                    aria-label={option.label}
                  >
                    <div className="flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5">
                      {option.icon}
                    </div>
                    <span className="text-sm font-bold tracking-wide transition-colors truncate">
                      {option.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0a0f1d]"
        aria-label="Toggle contact menu"
        aria-expanded={isOpen}
      >
        <div className="absolute inset-0 rounded-full border border-white/20" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle Ping Animation */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border-2 border-[#131b2e]"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
