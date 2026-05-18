"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MessageCircle, Mail, ArrowUp, Hexagon, Phone,
  Zap, ShieldCheck, Clock
} from 'lucide-react';
import { useEffect, useState } from "react";

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socials = [
    { name: 'Facebook', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" /></svg>, href: '#', color: 'hover:text-[#1877F2] hover:shadow-[0_0_10px_rgba(24,119,242,0.5)]' },
    { name: 'Instagram', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, href: '#', color: 'hover:text-[#E4405F] hover:shadow-[0_0_10px_rgba(228,64,95,0.5)]' },
    { name: 'TikTok', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>, href: '#', color: 'hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]' },
    { name: 'Discord', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>, href: '#', color: 'hover:text-[#5865F2] hover:shadow-[0_0_10px_rgba(88,101,242,0.5)]' },
    { name: 'YouTube', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>, href: '#', color: 'hover:text-[#FF0000] hover:shadow-[0_0_10px_rgba(255,0,0,0.5)]' },
    { name: 'Telegram', icon: <Send className="w-4 h-4" />, href: '#', color: 'hover:text-[#0088cc] hover:shadow-[0_0_10px_rgba(0,136,204,0.5)]' },
    { name: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" />, href: '#', color: 'hover:text-[#25D366] hover:shadow-[0_0_10px_rgba(37,211,102,0.5)]' }
  ];

  const payments = [
    { name: 'bKash', color: 'bg-[#E2136E]', text: 'text-white' },
    { name: 'Nagad', color: 'bg-[#F7941D]', text: 'text-white' },
    { name: 'Rocket', color: 'bg-[#8C1515]', text: 'text-white' },
  ];

  const links = [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Refund Policy', href: '#' },
    { name: 'Cookies Policy', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <footer className="relative bg-[#080b14] border-t border-primary/20 w-full mt-auto overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(0,242,255,0.4)]" />

      <div className="max-w-container-max mx-auto px-6 md:px-12 pt-16 pb-8">
        {/* Row 1: Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-12"
        >
          <div className="flex items-center gap-3 shrink-0">
            <Hexagon className="w-8 h-8 text-primary fill-primary/20" />
            <span className="font-headline-lg text-2xl font-black italic text-white tracking-wider">NEON <span className="text-primary">NEXUS</span></span>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10 mx-4" />
          <p className="font-body-md text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Neon Nexus is a trusted gaming marketplace for top-ups, flash deals, and digital rewards. Fast, secure, and built for gamers in Bangladesh.
          </p>
        </motion.div>

        {/* Row 2 & 3: Social, Payments, Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-8 mb-12">

          {/* Socials - 4 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            <h4 className="font-label-md text-sm font-bold text-white uppercase tracking-wider">Follow Us</h4>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant transition-all duration-300 ${social.color} hover:bg-white/10 hover:-translate-y-1`}
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Payments - 5 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            <h4 className="font-label-md text-sm font-bold text-white uppercase tracking-wider">Supported Payment Methods</h4>
            <div className="flex flex-wrap gap-2">
              {payments.map((pm) => (
                <div
                  key={pm.name}
                  className={`px-3 py-1.5 rounded-md ${pm.color} ${pm.text} font-bold text-[10px] tracking-wide shadow-sm flex items-center justify-center min-w-[60px] opacity-90 hover:opacity-100 transition-opacity cursor-default`}
                >
                  {pm.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trusted Platform - 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <h4 className="font-label-md text-sm font-bold text-white uppercase tracking-wider">Trusted Platform</h4>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface-variant/30 border border-outline-variant/10 hover:bg-surface-variant/50 hover:border-outline-variant/30 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-xs text-on-surface">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface-variant/30 border border-outline-variant/10 hover:bg-surface-variant/50 hover:border-outline-variant/30 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-md bg-[#25D366]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                </div>
                <span className="font-bold text-xs text-on-surface">Secure Payments</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-surface-variant/30 border border-outline-variant/10 hover:bg-surface-variant/50 hover:border-outline-variant/30 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-md bg-[#F7941D]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4 text-[#F7941D]" />
                </div>
                <span className="font-bold text-xs text-on-surface">24/7 Platform Uptime</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Links & Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5"
        >
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="text-[11px] text-on-surface-variant/70 tracking-wide">
            © 2026 Sharif. All Rights Reserved.
          </div>
        </motion.div>
      </div>

      {/* Floating Back to Top */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-surface-container/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg hover:bg-primary hover:text-black hover:border-primary hover:scale-110 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all duration-300"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
