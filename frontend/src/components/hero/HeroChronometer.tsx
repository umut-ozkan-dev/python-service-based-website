"use client";

import { useEffect, useState } from "react";

const PHASES = [
  { sec: "08s", pct: 18, label: "Instant reply sent", channel: "SMS", tone: "sky" },
  { sec: "23s", pct: 46, label: "Prospect qualified", channel: "WEB", tone: "sky" },
  { sec: "39s", pct: 74, label: "CRM record synced", channel: "CRM", tone: "sky" },
  { sec: "51s", pct: 88, label: "Calendar slot booked", channel: "CAL", tone: "emerald" },
] as const;

const RADIUS = 148;
const CIRC = 2 * Math.PI * RADIUS;

function ticks() {
  return Array.from({ length: 60 }, (_, index) => {
    const angle = (index / 60) * Math.PI * 2 - Math.PI / 2;
    const major = index % 5 === 0;
    const inner = major ? 164 : 170;
    const outer = 178;
    return {
      x1: 200 + Math.cos(angle) * inner,
      y1: 200 + Math.sin(angle) * inner,
      x2: 200 + Math.cos(angle) * outer,
      y2: 200 + Math.sin(angle) * outer,
      major,
    };
  });
}

const NODES = [
  { label: "WEB", angle: -120 },
  { label: "SMS", angle: -30 },
  { label: "MAIL", angle: 90 },
];

export function HeroChronometer({ paused }: { paused: boolean }) {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActivePhaseIndex((current) => (current + 1) % PHASES.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [paused]);

  const phase = PHASES[activePhaseIndex];
  const offset = CIRC * (1 - phase.pct / 100);
  const stroke = phase.tone === "emerald" ? "#34D399" : "#38BDF8";

  return (
    <div className="relative h-[340px] w-[340px] sm:h-[410px] sm:w-[410px]">
      <div className="pointer-events-none absolute inset-8 rounded-full bg-sky-400/10 blur-3xl" />
      <svg viewBox="0 0 400 400" className="relative h-full w-full" role="img" aria-label={`${phase.sec} ${phase.label}`}>
        <defs>
          <radialGradient id="titaniumGrad" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#2A3140" />
            <stop offset="46%" stopColor="#12161E" />
            <stop offset="100%" stopColor="#07090D" />
          </radialGradient>
        </defs>
        {ticks().map((tick) => (
          <line
            key={`${tick.x1}-${tick.y1}`}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.major ? "#94A3B8" : "#334155"}
            strokeWidth={tick.major ? 1.6 : 1}
          />
        ))}
        <g className="animate-slow-orbit" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="188" fill="none" stroke="rgba(56,189,248,0.35)" strokeWidth="1" strokeDasharray="3 9" />
        </g>
        <circle cx="200" cy="200" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle
          cx="200"
          cy="200"
          r={RADIUS}
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transform="rotate(-90 200 200)"
          style={{ transition: "stroke-dashoffset 700ms ease, stroke 700ms ease" }}
        />
        {NODES.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = 200 + Math.cos(rad) * 118;
          const y = 200 + Math.sin(rad) * 118;
          return (
            <g key={node.label}>
              <line x1="200" y1="200" x2={x} y2={y} stroke="rgba(148,163,184,0.35)" strokeWidth="0.8" />
              <circle cx={x} cy={y} r="3" fill="#38BDF8" />
              <text x={x} y={y - 8} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="var(--font-mono), ui-monospace, monospace">
                {node.label}
              </text>
            </g>
          );
        })}
        <circle cx="200" cy="200" r="92" fill="url(#titaniumGrad)" stroke="rgba(255,255,255,0.16)" />
        <text x="186" y="184" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontFamily="var(--font-heading), sans-serif">
          relay60
        </text>
        <text x="222" y="184" textAnchor="middle" fill="#38BDF8" fontSize="13" fontFamily="var(--font-heading), sans-serif">
          .
        </text>
        <text x="200" y="216" textAnchor="middle" fill="#F8FAFC" fontSize="28" fontFamily="var(--font-mono), ui-monospace, monospace">
          {phase.sec}
        </text>
        <text x="200" y="236" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="var(--font-mono), ui-monospace, monospace">
          {phase.label}
        </text>
      </svg>
    </div>
  );
}
