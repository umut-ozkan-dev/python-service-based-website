"use client";

import { useCallback, type PointerEvent } from "react";

const PLANES = [
  {
    id: "intake",
    index: "01",
    title: "Intake",
    tint: "slate",
    x: "-18px",
    y: "12px",
    z: "-168px",
    delay: "-1.2s",
    streak: "0s",
    long: false,
  },
  {
    id: "core",
    index: "02",
    title: "AI Reasoning Core",
    tint: "cyan",
    x: "0px",
    y: "0px",
    z: "0px",
    delay: "-4.2s",
    streak: "1.15s",
    long: true,
  },
  {
    id: "sync",
    index: "03",
    title: "Synced & Approved",
    tint: "emerald",
    x: "20px",
    y: "-10px",
    z: "168px",
    delay: "-7.1s",
    streak: "2.3s",
    long: true,
  },
] as const;

const REST_X = "60deg";
const REST_Z = "-45deg";

export function SmokedGlassStack() {
  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${60 - py * 8}deg`);
    event.currentTarget.style.setProperty("--tilt-z", `${-45 + px * 10}deg`);
  }, []);

  const onPointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", REST_X);
    event.currentTarget.style.setProperty("--tilt-z", REST_Z);
  }, []);

  return (
    <figure className="gs-figure" aria-label="Smoked-glass stack. Intake flows into the AI Reasoning Core, then Synced and Approved.">
      <div className="gs-stage" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="gs-atmosphere" />
      <div className="gs-key" />
      <div className="gs-fill" />
      <div className="gs-contact" aria-hidden="true" />
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <filter id="gs-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
      </svg>
      <div className="gs-rig">
        {PLANES.map((plane) => (
          <div
            key={plane.id}
            className="gs-slot"
            style={{
              ["--x" as string]: plane.x,
              ["--y" as string]: plane.y,
              ["--z" as string]: plane.z,
              ["--delay" as string]: plane.delay,
              ["--streak" as string]: plane.streak,
            }}
          >
            <div className="gs-slab" data-tint={plane.tint}>
              <div className="gs-under" />
              <div className="gs-lip gs-lip-y n" />
              <div className="gs-lip gs-lip-y s" />
              <div className="gs-lip gs-lip-x w" />
              <div className="gs-lip gs-lip-x e" />
              <div className="gs-face">
                <svg className="gs-grain" aria-hidden="true">
                  <rect width="100%" height="100%" filter="url(#gs-grain-filter)" />
                </svg>
                <div className="gs-glint" />
                <div className="gs-streak" />
                <div className="gs-rim" />
                {plane.id === "core" ? (
                  <div className="gs-ring" aria-hidden="true">
                    <div className="gs-ring-inner" />
                  </div>
                ) : (
                  <div aria-hidden="true">
                    <span className="gs-bracket tl" />
                    <span className="gs-bracket tr" />
                    <span className="gs-bracket bl" />
                    <span className="gs-bracket br" />
                  </div>
                )}
              </div>
              <div className="gs-label">
                <div className="gs-label-card">
                  <p className="gs-index">{plane.index}</p>
                  <p className="gs-title" data-long={plane.long ? "true" : undefined}>
                    {plane.title}
                  </p>
                  <span className="gs-hairline" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      <figcaption className="gs-flow">
        <strong>Intake</strong>
        <i aria-hidden="true">→</i>
        <strong>AI Reasoning Core</strong>
        <i aria-hidden="true">→</i>
        <strong>Synced & Approved</strong>
      </figcaption>
    </figure>
  );
}
