"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Trash = {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  tint: string;
  rot: number;
};

const BUBBLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 6 + Math.random() * 26,
  delay: Math.random() * 8,
  dur: 9 + Math.random() * 10,
}));

const DRIPS = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  left: 4 + Math.random() * 92,
  w: 14 + Math.random() * 26,
  delay: Math.random() * 7,
  dur: 10 + Math.random() * 8,
}));

const ALGAE = [
  { left: 6, top: 30, size: 220, rot: 18 },
  { left: 70, top: 22, size: 180, rot: -12 },
  { left: 38, top: 58, size: 260, rot: 6 },
  { left: 84, top: 64, size: 150, rot: -22 },
  { left: 18, top: 72, size: 200, rot: 10 },
];

const TRASH_TINTS = ["#3d5e1f", "#2d4a16", "#5a4a1e", "#264030", "#43611d"];

export default function PantanoCounter() {
  const [count, setCount] = useState(0);
  const [trash, setTrash] = useState<Trash[]>([]);
  const canRef = useRef<HTMLDivElement>(null);
  const trashId = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setCount((c) => c + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    const can = canRef.current;
    let toX = window.innerWidth / 2;
    let toY = window.innerHeight - 120;
    if (can) {
      const r = can.getBoundingClientRect();
      toX = r.left + r.width / 2;
      toY = r.top + r.height * 0.28;
    }

    const id = trashId.current++;
    const tint =
      TRASH_TINTS[Math.floor(Math.random() * TRASH_TINTS.length)] ?? "#3d5e1f";
    const rot = -40 + Math.random() * 80;

    setTrash((prev) => [
      ...prev,
      { id, fromX: e.clientX, fromY: e.clientY, toX, toY, tint, rot },
    ]);
    setCount((c) => c - 1);

    window.setTimeout(() => {
      const canEl = canRef.current;
      if (canEl) {
        canEl.animate(
          [
            { transform: "rotate(0deg) scale(1)", offset: 0 },
            { transform: "rotate(-9deg) scale(1.04)", offset: 0.18 },
            { transform: "rotate(7deg) scale(0.99)", offset: 0.4 },
            { transform: "rotate(-5deg) scale(1.02)", offset: 0.62 },
            { transform: "rotate(3deg) scale(1)", offset: 0.8 },
            { transform: "rotate(0deg) scale(1)", offset: 1 },
          ],
          { duration: 550, easing: "ease-out" }
        );
      }
      setTrash((prev) => prev.filter((t) => t.id !== id));
    }, 620);
  }, []);

  const setTrashRef = useCallback((el: HTMLDivElement | null, t: Trash) => {
    if (!el) return;
    const midX = (t.fromX + t.toX) / 2;
    const midY = Math.min(t.fromY, t.toY) - 90;
    el.animate(
      [
        {
          transform: `translate(${t.fromX - 22}px, ${t.fromY - 22}px) rotate(0deg) scale(1)`,
          opacity: 1,
          offset: 0,
        },
        {
          transform: `translate(${midX - 22}px, ${midY - 22}px) rotate(${t.rot}deg) scale(1.05)`,
          opacity: 1,
          offset: 0.5,
        },
        {
          transform: `translate(${t.toX - 22}px, ${t.toY - 22}px) rotate(${t.rot * 0.4}deg) scale(0.5)`,
          opacity: 0.9,
          offset: 1,
        },
      ],
      { duration: 620, easing: "ease-in", fill: "forwards" }
    );
  }, []);

  return (
    <main
      onPointerDown={handlePointer}
      className="relative h-[100dvh] w-full cursor-crosshair select-none overflow-hidden touch-none"
    >
      {/* ----- cielo radiactivo ----- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#cdf500_0%,#9acb1f_22%,#4d6a0e_45%,#0c2230_70%,#05080a_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_8%,rgba(206,255,0,0.55),transparent_70%)] [animation:pantano-glow_5s_ease-in-out_infinite]" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,rgba(174,242,0,0.18),transparent)]" />
      </div>

      {/* ----- neblina tóxica ----- */}
      <div className="pointer-events-none absolute inset-0 z-[5]">
        <div className="absolute left-[-20%] top-[18%] h-40 w-[140%] rounded-full bg-[#9acb1f]/10 blur-3xl [animation:pantano-fog_14s_ease-in-out_infinite_alternate]" />
        <div className="absolute left-[-10%] top-[34%] h-32 w-[130%] rounded-full bg-[#0a3a2a]/30 blur-3xl [animation:pantano-fog_18s_ease-in-out_infinite_alternate-reverse]" />
      </div>

      {/* ----- agua contaminada ----- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[38%] z-[6]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#103040_0%,#0a2230_35%,#06121c_100%)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(120,180,60,0.18),transparent)] [animation:pantano-shimmer_7s_ease-in-out_infinite]" />
        <div className="absolute inset-x-[-10%] top-6 h-16 rounded-[50%] bg-[#5a7a0e]/15 blur-2xl [animation:pantano-shimmer_9s_ease-in-out_infinite]" />
      </div>

      {/* ----- barro / fondo del pantano ----- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[7] h-[26%] bg-[linear-gradient(180deg,transparent,#1a2a0e_40%,#0c1407_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[7] h-[14%] bg-[radial-gradient(50%_100%_at_50%_100%,#2d4a16,transparent_70%)] opacity-70" />

      {/* ----- algas ----- */}
      <div className="pointer-events-none absolute inset-0 z-[8]">
        {ALGAE.map((a, i) => (
          <div
            key={i}
            className="absolute rounded-[42%_58%_45%_55%_/_55%_45%_60%_40%] bg-[#2d4a16]/35 blur-md [animation:pantano-sway_9s_ease-in-out_infinite]"
            style={{
              left: `${a.left}%`,
              top: `${a.top}%`,
              width: a.size,
              height: a.size,
              transform: `rotate(${a.rot}deg)`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* ----- drips de slime ----- */}
      <div className="pointer-events-none absolute inset-0 z-[9]">
        {DRIPS.map((d) => (
          <div
            key={d.id}
            className="absolute top-0 rounded-b-full bg-[#3d5e1f]/45 blur-[1px] [animation:pantano-drip_linear_infinite]"
            style={{
              left: `${d.left}%`,
              width: d.w,
              height: d.w * 2.2,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.dur}s`,
            }}
          />
        ))}
      </div>

      {/* ----- burbujas ----- */}
      <div className="pointer-events-none absolute inset-0 z-[10]">
        {BUBBLES.map((b) => (
          <div
            key={b.id}
            className="absolute bottom-[-40px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(180,230,90,0.5),rgba(20,60,40,0.15)_70%,transparent)] [animation:pantano-rise_linear_infinite]"
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.dur}s`,
            }}
          />
        ))}
      </div>

      {/* ----- contador ----- */}
      <div className="pointer-events-none absolute inset-0 z-[20] flex flex-col items-center justify-center">
        <span
          key={count}
          className="block text-[clamp(7rem,26vw,20rem)] tracking-[-0.04em] text-[#d6ff33] [animation:pantano-count_0.5s_cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            fontFamily: "var(--font-anton)",
            textShadow:
              "0 0 18px rgba(206,255,0,0.55), 0 0 48px rgba(120,200,30,0.45), 0 4px 0 rgba(0,0,0,0.55)",
          }}
        >
          {count}
        </span>
        <p className="mt-2 text-center font-sans text-[0.7rem] uppercase tracking-[0.45em] text-[#9acb1f]/70">
          contaminación
        </p>
      </div>

      {/* ----- instrucción ----- */}
      <div className="pointer-events-none absolute inset-x-0 top-5 z-[30] flex justify-center">
        <p className="rounded-full border border-[#9acb1f]/25 bg-[#05080a]/40 px-4 py-1.5 text-center font-sans text-[0.7rem] tracking-[0.25em] text-[#cde88a]/80 backdrop-blur">
          TOCÁ LA PANTALLA · TIRÁ LA BASURA AL TACHO
        </p>
      </div>

      {/* ----- basura cayendo ----- */}
      <div className="pointer-events-none absolute inset-0 z-[40]">
        {trash.map((t) => (
          <div
            key={t.id}
            ref={(el) => setTrashRef(el, t)}
            className="absolute left-0 top-0"
          >
            <div
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/40 shadow-[0_0_14px_rgba(0,0,0,0.6)]"
              style={{
                background: `radial-gradient(circle at 32% 28%, #6f8a2e, ${t.tint} 70%, #1a2a0e)`,
              }}
            >
              <span
                className="text-[0.9rem] font-black text-[#eaffb0]"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                -1
              </span>
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#1a2a0e]/80" />
            </div>
          </div>
        ))}
      </div>

      {/* ----- tacho de basura metálico ----- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[50] flex justify-center">
        <div
          ref={canRef}
          style={{ transformOrigin: "50% 100%" }}
          className="relative w-[min(46vw,260px)]"
        >
          <svg viewBox="0 0 200 250" className="w-full drop-shadow-[0_18px_22px_rgba(0,0,0,0.55)]">
            <defs>
              <linearGradient id="canBody" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3a3f47" />
                <stop offset="20%" stopColor="#8b909a" />
                <stop offset="48%" stopColor="#5a606b" />
                <stop offset="78%" stopColor="#2b2f36" />
                <stop offset="100%" stopColor="#181b20" />
              </linearGradient>
              <linearGradient id="canLid" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4a4f57" />
                <stop offset="45%" stopColor="#a7adb8" />
                <stop offset="100%" stopColor="#23262c" />
              </linearGradient>
              <linearGradient id="canRim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cfd4dc" />
                <stop offset="100%" stopColor="#454a53" />
              </linearGradient>
            </defs>

            {/* cuerpo */}
            <path
              d="M22 70 L178 70 L165 238 Q100 252 35 238 Z"
              fill="url(#canBody)"
              stroke="#0c0e11"
              strokeWidth="2"
            />
            {/* banda superior del cuerpo */}
            <path d="M20 70 L180 70 L177 86 L23 86 Z" fill="url(#canRim)" opacity="0.9" />
            {/* nervaduras verticales */}
            {[40, 70, 100, 130, 160].map((x) => (
              <path
                key={x}
                d={`M${x} 86 L${x - 3} 232`}
                stroke="rgba(0,0,0,0.28)"
                strokeWidth="2"
              />
            ))}
            {[55, 85, 115, 145].map((x) => (
              <path
                key={x}
                d={`M${x} 86 L${x - 2} 232`}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
              />
            ))}
            {/* slime que chorrea del tacho */}
            <path
              d="M30 86 q4 30 -6 50 q10 -8 8 -36 q8 18 0 44 q8 -6 6 -32"
              fill="#3d5e1f"
              opacity="0.55"
            />
            <path
              d="M170 86 q-6 34 4 58 q-10 -10 -6 -40 q-8 20 2 50 q-10 -8 -6 -36"
              fill="#2d4a16"
              opacity="0.5"
            />
            <ellipse cx="60" cy="150" rx="14" ry="8" fill="#264030" opacity="0.45" />
            <ellipse cx="128" cy="190" rx="18" ry="10" fill="#1f3a24" opacity="0.5" />

            {/* tapa */}
            <ellipse cx="100" cy="66" rx="86" ry="16" fill="url(#canLid)" stroke="#0c0e11" strokeWidth="2" />
            <ellipse cx="100" cy="62" rx="86" ry="14" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            {/* mango */}
            <rect x="90" y="44" width="20" height="16" rx="3" fill="url(#canLid)" stroke="#0c0e11" strokeWidth="2" />
            <rect x="93" y="47" width="14" height="10" rx="2" fill="#15171b" />
            {/* reflejo tóxico en la tapa */}
            <ellipse cx="100" cy="58" rx="60" ry="5" fill="#9acb1f" opacity="0.18" />
          </svg>
        </div>
      </div>

      {/* ----- grime / viñeta final ----- */}
      <div className="pointer-events-none absolute inset-0 z-[45] mix-blend-overlay opacity-[0.18] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
      <div className="pointer-events-none absolute inset-0 z-[46] [background:radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
    </main>
  );
}
