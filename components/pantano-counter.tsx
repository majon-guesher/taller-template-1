"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Falling = {
  id: number;
  value: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  rot: number;
};

const BUBBLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 8 + Math.random() * 22,
  delay: Math.random() * 8,
  dur: 9 + Math.random() * 10,
}));

const ALGAE_BG = [
  { left: 4, top: 34, size: 200, rot: 14, hue: "#1f3a14" },
  { left: 72, top: 26, size: 160, rot: -10, hue: "#264a16" },
  { left: 36, top: 56, size: 240, rot: 5, hue: "#1a3010" },
  { left: 86, top: 60, size: 140, rot: -20, hue: "#2d5519" },
  { left: 16, top: 70, size: 180, rot: 8, hue: "#1f3a14" },
];

export default function PantanoCounter() {
  const [count, setCount] = useState(0);
  const [falling, setFalling] = useState<Falling[]>([]);
  const canRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef(0);
  const fallId = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      countRef.current += 1;
      setCount(countRef.current);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    const can = canRef.current;
    const num = numRef.current;

    let toX = window.innerWidth / 2;
    let toY = window.innerHeight - 140;
    if (can) {
      const r = can.getBoundingClientRect();
      toX = r.left + r.width / 2;
      toY = r.top + r.height * 0.22;
    }

    let fromX = window.innerWidth / 2;
    let fromY = window.innerHeight / 2;
    if (num) {
      const r = num.getBoundingClientRect();
      fromX = r.left + r.width / 2;
      fromY = r.top + r.height / 2;
    }

    const id = fallId.current++;
    const rot = -25 + Math.random() * 50;
    const oldCount = countRef.current;

    countRef.current -= 1;
    setCount(countRef.current);
    setFalling((prev) => [
      ...prev,
      { id, value: oldCount, fromX, fromY, toX, toY, rot },
    ]);

    window.setTimeout(() => {
      const canEl = canRef.current;
      if (canEl) {
        canEl.animate(
          [
            { transform: "rotate(0deg) scale(1)", offset: 0 },
            { transform: "rotate(-10deg) scale(1.05)", offset: 0.18 },
            { transform: "rotate(8deg) scale(0.97)", offset: 0.4 },
            { transform: "rotate(-6deg) scale(1.02)", offset: 0.62 },
            { transform: "rotate(3deg) scale(1)", offset: 0.8 },
            { transform: "rotate(0deg) scale(1)", offset: 1 },
          ],
          { duration: 580, easing: "ease-out" }
        );
      }
      setFalling((prev) => prev.filter((t) => t.id !== id));
    }, 640);
  }, []);

  const setFallingRef = useCallback((el: HTMLDivElement | null, f: Falling) => {
    if (!el) return;
    const midX = (f.fromX + f.toX) / 2;
    const midY = Math.min(f.fromY, f.toY) - 60;
    el.animate(
      [
        {
          transform: `translate(${f.fromX}px, ${f.fromY}px) rotate(0deg) scale(1)`,
          opacity: 1,
          offset: 0,
        },
        {
          transform: `translate(${midX}px, ${midY}px) rotate(${f.rot}deg) scale(0.85)`,
          opacity: 1,
          offset: 0.55,
        },
        {
          transform: `translate(${f.toX}px, ${f.toY}px) rotate(${f.rot * 0.3}deg) scale(0.1)`,
          opacity: 0,
          offset: 1,
        },
      ],
      { duration: 640, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "forwards" }
    );
  }, []);

  return (
    <main
      onPointerDown={handlePointer}
      className="relative h-[100dvh] w-full cursor-crosshair select-none overflow-hidden touch-none"
    >
      {/* ----- cielo radiactivo ----- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#d4ff00_0%,#a6d420_20%,#5a7a0e_42%,#0c2230_68%,#05080a_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_8%,rgba(206,255,0,0.5),transparent_70%)] [animation:pantano-glow_5s_ease-in-out_infinite]" />
      </div>

      {/* ----- nubes tóxicas cartoon ----- */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[28%]">
        <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M0,180 Q80,140 160,170 Q220,120 320,150 Q400,110 480,145 Q560,105 640,140 Q740,100 820,135 Q900,105 1000,140 Q1080,115 1200,150 L1200,0 L0,0 Z"
            fill="#7a9a18"
            stroke="#0a1a05"
            strokeWidth="4"
            opacity="0.55"
          />
          <path
            d="M0,220 Q120,190 220,210 Q300,175 400,200 Q500,170 620,200 Q720,175 840,205 Q940,185 1080,210 Q1140,200 1200,215 L1200,0 L0,0 Z"
            fill="#9acb1f"
            stroke="#0a1a05"
            strokeWidth="3"
            opacity="0.35"
          />
        </svg>
      </div>

      {/* ----- neblina tóxica ----- */}
      <div className="pointer-events-none absolute inset-0 z-[5]">
        <div className="absolute left-[-20%] top-[20%] h-40 w-[140%] rounded-full bg-[#9acb1f]/10 blur-3xl [animation:pantano-fog_14s_ease-in-out_infinite_alternate]" />
        <div className="absolute left-[-10%] top-[36%] h-32 w-[130%] rounded-full bg-[#0a3a2a]/30 blur-3xl [animation:pantano-fog_18s_ease-in-out_infinite_alternate-reverse]" />
      </div>

      {/* ----- agua contaminada ----- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[36%] z-[6]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0e2a38_0%,#082030_40%,#04101a_100%)]" />
        {/* ondas dibujadas */}
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-20 w-full">
          <path d="M0,40 Q100,15 200,40 T400,40 T600,40 T800,40 T1000,40 T1200,40" fill="none" stroke="#2d5519" strokeWidth="4" opacity="0.6" />
          <path d="M0,60 Q100,35 200,60 T400,60 T600,60 T800,60 T1000,60 T1200,60" fill="none" stroke="#3d6e1f" strokeWidth="3" opacity="0.45" />
          <path d="M0,80 Q120,60 240,80 T480,80 T720,80 T960,80 T1200,80" fill="none" stroke="#1a3010" strokeWidth="3" opacity="0.5" />
        </svg>
      </div>

      {/* ----- barro ----- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[7] h-[24%] bg-[linear-gradient(180deg,transparent,#1a2a0e_35%,#0a1405_100%)]" />

      {/* ----- algas fondo cartoon ----- */}
      <div className="pointer-events-none absolute inset-0 z-[8]">
        {ALGAE_BG.map((a, i) => (
          <div
            key={i}
            className="absolute [animation:pantano-sway_8s_ease-in-out_infinite]"
            style={{
              left: `${a.left}%`,
              top: `${a.top}%`,
              width: a.size,
              height: a.size * 1.3,
              transform: `rotate(${a.rot}deg)`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            <svg viewBox="0 0 100 130" className="h-full w-full">
              <path
                d="M50,130 Q30,100 45,75 Q60,50 40,25 Q50,10 55,0"
                fill="none"
                stroke={a.hue}
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M50,130 Q30,100 45,75 Q60,50 40,25 Q50,10 55,0"
                fill="none"
                stroke="#0a1a05"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <ellipse cx="42" cy="55" rx="14" ry="7" fill={a.hue} stroke="#0a1a05" strokeWidth="2.5" transform="rotate(-30 42 55)" />
              <ellipse cx="58" cy="35" rx="12" ry="6" fill={a.hue} stroke="#0a1a05" strokeWidth="2.5" transform="rotate(35 58 35)" />
              <ellipse cx="48" cy="80" rx="13" ry="6" fill={a.hue} stroke="#0a1a05" strokeWidth="2.5" transform="rotate(-20 48 80)" />
            </svg>
          </div>
        ))}
      </div>

      {/* ----- drips de slime ----- */}
      <div className="pointer-events-none absolute inset-0 z-[9]">
        {Array.from({ length: 7 }, (_, i) => ({
          id: i,
          left: 6 + Math.random() * 88,
          w: 16 + Math.random() * 22,
          delay: Math.random() * 7,
          dur: 11 + Math.random() * 7,
        })).map((d) => (
          <div
            key={d.id}
            className="absolute top-0 rounded-b-full bg-[#3d5e1f]/55 [animation:pantano-drip_linear_infinite]"
            style={{
              left: `${d.left}%`,
              width: d.w,
              height: d.w * 2.4,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.dur}s`,
            }}
          />
        ))}
      </div>

      {/* ----- burbujas cartoon ----- */}
      <div className="pointer-events-none absolute inset-0 z-[10]">
        {BUBBLES.map((b) => (
          <div
            key={b.id}
            className="absolute bottom-[-40px] rounded-full [animation:pantano-rise_linear_infinite]"
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.dur}s`,
              background:
                "radial-gradient(circle at 30% 30%, rgba(180,230,90,0.6), rgba(30,70,40,0.2) 70%, transparent)",
              border: "2px solid rgba(10,26,5,0.5)",
            }}
          />
        ))}
      </div>

      {/* ----- contador ----- */}
      <div className="pointer-events-none absolute inset-0 z-[20] flex flex-col items-center justify-center">
        <span
          ref={numRef}
          key={count}
          className="block text-[clamp(7rem,26vw,20rem)] tracking-[-0.04em] text-[#d6ff33] [animation:pantano-count_0.5s_cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            fontFamily: "var(--font-anton)",
            textShadow:
              "3px 3px 0 #0a1a05, 0 0 18px rgba(206,255,0,0.5), 0 0 48px rgba(120,200,30,0.35)",
          }}
        >
          {count}
        </span>
        <p className="mt-3 text-center font-sans text-[0.7rem] uppercase tracking-[0.45em] text-[#9acb1f]/70">
          contaminación
        </p>
      </div>

      {/* ----- instrucción ----- */}
      <div className="pointer-events-none absolute inset-x-0 top-5 z-[30] flex justify-center">
        <p className="rounded-full border-2 border-[#9acb1f]/40 bg-[#05080a]/50 px-4 py-1.5 text-center font-sans text-[0.7rem] tracking-[0.25em] text-[#cde88a]/85">
          TOCÁ LA PANTALLA · TIRÁ LA BASURA AL TACHO
        </p>
      </div>

      {/* ----- número cayendo al tacho ----- */}
      <div className="pointer-events-none absolute inset-0 z-[40]">
        {falling.map((f) => (
          <div
            key={f.id}
            ref={(el) => setFallingRef(el, f)}
            className="absolute left-0 top-0"
            style={{ transformOrigin: "50% 50%" }}
          >
            <div style={{ transform: "translate(-50%, -50%)" }}>
              <span
                className="block text-[clamp(7rem,26vw,20rem)] tracking-[-0.04em] text-[#d6ff33]"
                style={{
                  fontFamily: "var(--font-anton)",
                  textShadow:
                    "3px 3px 0 #0a1a05, 0 0 18px rgba(206,255,0,0.5)",
                }}
              >
                {f.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ----- tacho + algas rodeándolo ----- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[50] flex justify-center">
        <div className="relative w-[min(40vw,440px)]">
          {/* algas detrás del tacho */}
          <div className="pointer-events-none absolute inset-x-[-8%] bottom-0 z-0 h-[55%]">
            <svg viewBox="0 0 260 160" className="h-full w-full">
              <path d="M30,160 Q20,120 35,90 Q45,65 30,35 Q40,15 35,0" fill="none" stroke="#1f3a14" strokeWidth="9" strokeLinecap="round" />
              <path d="M30,160 Q20,120 35,90 Q45,65 30,35 Q40,15 35,0" fill="none" stroke="#0a1a05" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="32" cy="50" rx="11" ry="6" fill="#1f3a14" stroke="#0a1a05" strokeWidth="2" transform="rotate(-40 32 50)" />
              <ellipse cx="40" cy="25" rx="10" ry="5" fill="#1f3a14" stroke="#0a1a05" strokeWidth="2" transform="rotate(30 40 25)" />

              <path d="M230,160 Q240,125 225,95 Q215,68 232,38 Q222,16 228,2" fill="none" stroke="#2d5519" strokeWidth="9" strokeLinecap="round" />
              <path d="M230,160 Q240,125 225,95 Q215,68 232,38 Q222,16 228,2" fill="none" stroke="#0a1a05" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="228" cy="55" rx="11" ry="6" fill="#2d5519" stroke="#0a1a05" strokeWidth="2" transform="rotate(40 228 55)" />
              <ellipse cx="220" cy="28" rx="9" ry="5" fill="#2d5519" stroke="#0a1a05" strokeWidth="2" transform="rotate(-30 220 28)" />
            </svg>
          </div>

          {/* tacho metálico cartoon */}
          <div
            ref={canRef}
            style={{ transformOrigin: "50% 100%" }}
            className="relative z-10"
          >
            <svg viewBox="0 0 200 260" className="w-full drop-shadow-[0_14px_0_rgba(0,0,0,0.4)]">
              {/* cuerpo */}
              <path
                d="M20,72 L180,72 L168,238 Q100,254 32,238 Z"
                fill="#6b7280"
                stroke="#0a0e10"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* sombra derecha cel-shaded */}
              <path
                d="M150,72 L168,238 Q140,248 120,250 L130,72 Z"
                fill="#2b2f36"
                opacity="0.55"
              />
              {/* highlights izquierdos */}
              <path d="M40,76 L34,232" fill="none" stroke="#b8bfca" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              {/* banda superior */}
              <path d="M16,72 L184,72 L180,90 L20,90 Z" fill="#d1d5db" stroke="#0a0e10" strokeWidth="4" strokeLinejoin="round" />
              <path d="M150,72 L180,72 L178,90 L150,90 Z" fill="#6b7280" opacity="0.5" />
              {/* nervaduras */}
              {[50, 80, 110, 140].map((x) => (
                <path key={x} d={`M${x},90 L${x - 4},230`} fill="none" stroke="#0a0e10" strokeWidth="2.5" opacity="0.4" />
              ))}
              {/* slime del tacho */}
              <path d="M28,90 q6,28 -4,48 q10,-6 7,-32 q8,16 0,42 q8,-4 6,-28" fill="#3d5e1f" stroke="#0a1a05" strokeWidth="2" opacity="0.8" />
              <path d="M172,90 q-7,30 3,52 q-10,-8 -6,-38 q-7,18 2,46 q-9,-6 -5,-32" fill="#2d4a16" stroke="#0a1a05" strokeWidth="2" opacity="0.75" />
              {/* manchas de barro */}
              <ellipse cx="65" cy="150" rx="14" ry="9" fill="#1f3a14" stroke="#0a1a05" strokeWidth="2" opacity="0.7" />
              <ellipse cx="130" cy="195" rx="18" ry="11" fill="#1a3010" stroke="#0a1a05" strokeWidth="2" opacity="0.65" />
              {/* tapa */}
              <ellipse cx="100" cy="68" rx="88" ry="18" fill="#9ca3af" stroke="#0a0e10" strokeWidth="4" />
              <ellipse cx="100" cy="64" rx="88" ry="15" fill="none" stroke="#e5e7eb" strokeWidth="2.5" opacity="0.5" />
              <path d="M100,50 L100,68" stroke="#0a0e10" strokeWidth="3" opacity="0.3" />
              {/* mango */}
              <rect x="88" y="44" width="24" height="18" rx="4" fill="#9ca3af" stroke="#0a0e10" strokeWidth="4" />
              <rect x="92" y="48" width="16" height="10" rx="2" fill="#1a1d22" />
              {/* reflejo tóxico tapa */}
              <ellipse cx="100" cy="60" rx="58" ry="5" fill="#9acb1f" opacity="0.3" />
            </svg>
          </div>

          {/* algas delante en la base, rodeando el tacho */}
          <div className="pointer-events-none absolute inset-x-[-6%] bottom-0 z-20 h-[28%] [animation:pantano-sway_7s_ease-in-out_infinite]">
            <svg viewBox="0 0 240 80" className="h-full w-full">
              <path d="M20,80 Q12,55 24,35 Q30,20 22,5" fill="none" stroke="#3d6e1f" strokeWidth="8" strokeLinecap="round" />
              <path d="M20,80 Q12,55 24,35 Q30,20 22,5" fill="none" stroke="#0a1a05" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="22" cy="22" rx="10" ry="5" fill="#3d6e1f" stroke="#0a1a05" strokeWidth="2" transform="rotate(-35 22 22)" />

              <path d="M55,80 Q60,60 50,42 Q45,25 55,10" fill="none" stroke="#2d5519" strokeWidth="7" strokeLinecap="round" />
              <path d="M55,80 Q60,60 50,42 Q45,25 55,10" fill="none" stroke="#0a1a05" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="52" cy="30" rx="9" ry="5" fill="#2d5519" stroke="#0a1a05" strokeWidth="2" transform="rotate(30 52 30)" />

              <path d="M185,80 Q180,58 190,38 Q196,22 186,8" fill="none" stroke="#2d5519" strokeWidth="7" strokeLinecap="round" />
              <path d="M185,80 Q180,58 190,38 Q196,22 186,8" fill="none" stroke="#0a1a05" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="188" cy="28" rx="9" ry="5" fill="#2d5519" stroke="#0a1a05" strokeWidth="2" transform="rotate(-30 188 28)" />

              <path d="M220,80 Q228,56 216,36 Q210,20 220,6" fill="none" stroke="#3d6e1f" strokeWidth="8" strokeLinecap="round" />
              <path d="M220,80 Q228,56 216,36 Q210,20 220,6" fill="none" stroke="#0a1a05" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="218" cy="24" rx="10" ry="5" fill="#3d6e1f" stroke="#0a1a05" strokeWidth="2" transform="rotate(35 218 24)" />

              {/* pasto/barro base */}
              <path d="M0,80 Q30,72 60,78 Q90,70 120,76 Q150,68 180,76 Q210,70 240,78 L240,80 Z" fill="#1a3010" stroke="#0a1a05" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* ----- viñeta final ----- */}
      <div className="pointer-events-none absolute inset-0 z-[46] [background:radial-gradient(120%_90%_at_50%_50%,transparent_58%,rgba(0,0,0,0.6)_100%)]" />
    </main>
  );
}
