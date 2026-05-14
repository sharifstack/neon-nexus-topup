"use client";

import { useState, useEffect } from "react";

const SLIDES = [
  {
    accent: "#1a6df0",
    gradient: "linear-gradient(135deg, #1a6df0 0%, #0d3fa8 100%)",
    img: "https://cdn2.steamgriddb.com/hero_thumb/033522d9bdf796d13c4b594cbdf03184.jpg",
    badge: "PUBG MOBILE",
    title: "Season Pass Direct Purchase Launched!",
    subtitle: "Top up Delta Coins for up to 35% bonus!",
    cta: "GO",
    href: "/marketplace/pubg-mobile",
  },
  {
    accent: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
    img: "https://cdn2.steamgriddb.com/hero_thumb/714aeac233808ffb2b01e3910edff2bc.jpg",
    badge: "GENSHIN IMPACT",
    title: "Genesis Crystal Special Offer!",
    subtitle: "Get up to 25% extra crystals this week only.",
    cta: "TOP UP",
    href: "/marketplace/genshin-impact",
  },
  {
    accent: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)",
    img: "https://cdn2.steamgriddb.com/hero_thumb/6b68046389020611bcec0f52271e28b6.jpg",
    badge: "MOBILE LEGENDS",
    title: "Mobile Legends Diamond Boost!",
    subtitle: "Limited time: Extra 20% Diamonds on all top-ups.",
    cta: "GET NOW",
    href: "/marketplace/mobile-legends",
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl mb-6" style={{ height: 220 }}>
      {/* Slides wrapper */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 flex transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
        >
          {/* ── LEFT: game image ──────────────────────────── */}
          <div className="relative w-[55%] h-full flex-shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.img}
              alt={s.badge}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* right-side fade so image bleeds into the text panel */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, transparent 40%, ${s.accent}ee 100%)`,
              }}
            />
          </div>

          {/* ── RIGHT: promo text panel ───────────────────── */}
          <div
            className="flex-1 flex flex-col justify-center px-8 py-6 relative overflow-hidden"
            style={{ background: s.gradient }}
          >
            {/* decorative swirl */}
            <div
              className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
            />

            {/* badge */}
            <span className="inline-flex items-center gap-1 text-white/80 text-xs font-bold uppercase tracking-widest mb-2 w-fit">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>sports_esports</span>
              {s.badge}
            </span>

            {/* title */}
            <h2 className="text-white font-extrabold leading-tight mb-2" style={{ fontSize: 22, maxWidth: 260 }}>
              {s.title}
            </h2>

            {/* subtitle */}
            <p className="text-white/75 text-sm mb-4" style={{ maxWidth: 240 }}>{s.subtitle}</p>

            {/* CTA */}
            <a
              href={s.href}
              className="inline-flex items-center gap-1 bg-white text-gray-900 font-bold px-6 py-2 rounded-full text-sm w-fit hover:scale-105 transition-transform shadow-lg"
            >
              {s.cta}
            </a>
          </div>
        </div>
      ))}

      {/* ── Arrows ──────────────────────────────────── */}
      <button
        onClick={() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
      </button>
      <button
        onClick={() => setCurrent(c => (c + 1) % SLIDES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
      </button>

      {/* ── Dots ────────────────────────────────────── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 8,
              height: 8,
              background: i === current ? "#fff" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
