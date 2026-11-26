"use client";

import { useEffect, useMemo, useRef } from "react";

type Vec = { x: number; y: number; z: number };
type Particle = Vec & { weight: number; cluster: boolean };
type Pulse = { from: number; to: number; lift: number; progress: number; speed: number; color: string };
type Ripple = { hub: number; age: number };

const COUNT = 2200;
const LIGHT = normalize({ x: -0.55, y: -0.45, z: 0.7 });

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalize(v: Vec, scale = 1): Vec {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: (v.x / length) * scale, y: (v.y / length) * scale, z: (v.z / length) * scale };
}

function gap(a: Vec, b: Vec) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function rotatePoint(p: Vec, rotX: number, rotY: number): Vec {
  const cy = Math.cos(rotY);
  const sy = Math.sin(rotY);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const cx = Math.cos(rotX);
  const sx = Math.sin(rotX);
  return { x: x1, y: p.y * cx - z1 * sx, z: p.y * sx + z1 * cx };
}

function slerpArc(a: Vec, b: Vec, t: number, lift: number): Vec {
  const dot = Math.max(-0.999, Math.min(0.999, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(dot);
  const sinO = Math.sin(omega) || 1;
  const w0 = Math.sin((1 - t) * omega) / sinO;
  const w1 = Math.sin(t * omega) / sinO;
  const radius = 1 + Math.sin(Math.PI * t) * lift;
  return {
    x: (a.x * w0 + b.x * w1) * radius,
    y: (a.y * w0 + b.y * w1) * radius,
    z: (a.z * w0 + b.z * w1) * radius,
  };
}

function densityOf(p: Vec) {
  return (
    Math.sin(p.x * 3.2 + p.y * 2.5) * Math.cos(p.z * 2.9 - p.x * 1.6) +
    0.5 * Math.sin(p.y * 5.1 - p.z * 4.2 + p.x * 1.3)
  );
}

function hidden(p: Vec) {
  return p.z < 0 && p.x * p.x + p.y * p.y < 0.995;
}

function buildWorld() {
  const rand = mulberry32(108);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points: Vec[] = [];
  const scored: Array<{ index: number; density: number }> = [];
  for (let i = 0; i < COUNT; i += 1) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const point = { x: Math.cos(theta) * ring, y, z: Math.sin(theta) * ring };
    points.push(point);
    scored.push({ index: i, density: densityOf(point) });
  }

  const particles: Particle[] = [];
  scored.forEach(({ index, density }) => {
    const point = points[index];
    if (density > -0.22) {
      const weight = Math.max(0, Math.min(1, (density + 0.22) / 1.4));
      particles.push({ ...point, weight, cluster: true });
      return;
    }
    if (index % 4 === 0) particles.push({ ...point, weight: 0.15, cluster: false });
  });

  const hubs: number[] = [];
  const ranked = scored.filter((item) => item.density > 0.35).sort((a, b) => b.density - a.density);
  for (const item of ranked) {
    if (hubs.length >= 20) break;
    if (hubs.every((hub) => gap(points[hub], points[item.index]) >= 0.44)) hubs.push(item.index);
  }

  const degree = new Array<number>(hubs.length).fill(0);
  const synapses: Array<[number, number]> = [];
  const pairs: Array<[number, number, number]> = [];
  for (let i = 0; i < hubs.length; i += 1) {
    for (let j = i + 1; j < hubs.length; j += 1) {
      pairs.push([gap(points[hubs[i]], points[hubs[j]]), i, j]);
    }
  }
  pairs.sort((a, b) => a[0] - b[0]);
  for (const [distance, i, j] of pairs) {
    if (distance >= 0.72 || degree[i] >= 2 || degree[j] >= 2) continue;
    synapses.push([i, j]);
    degree[i] += 1;
    degree[j] += 1;
  }

  const arcPairs = pairs.filter(([distance]) => distance >= 0.78 && distance <= 1.68);
  for (let i = arcPairs.length - 1; i > 0; i -= 1) {
    const swap = Math.floor(rand() * (i + 1));
    [arcPairs[i], arcPairs[swap]] = [arcPairs[swap], arcPairs[i]];
  }
  const used = new Set<number>();
  const chosen: Array<[number, number]> = [];
  for (const [, i, j] of arcPairs) {
    if (used.has(i) || used.has(j)) continue;
    used.add(i);
    used.add(j);
    chosen.push([i, j]);
    if (chosen.length === 6) break;
  }
  for (const [, i, j] of arcPairs) {
    if (chosen.length === 6) break;
    if (!chosen.some(([a, b]) => a === i && b === j)) chosen.push([i, j]);
  }

  const pulses: Pulse[] = chosen.slice(0, 6).map(([from, to], index) => ({
    from,
    to,
    lift: 0.14 + rand() * 0.12,
    progress: (index * 1.55) / 6,
    speed: 0.0042 + rand() * 0.0023,
    color: index < 4 ? "#38BDF8" : "#E0F2FE",
  }));

  return { particles, points, hubs, synapses, pulses };
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function HeroNeuralGlobe({ paused }: { paused: boolean }) {
  const world = useMemo(() => buildWorld(), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const startRef = useRef<() => void>(() => {});
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motion = {
      rotY: 0.55,
      spinX: 0,
      velX: 0,
      velY: 0,
      hoverX: 0,
      hoverY: 0,
      targetX: 0,
      targetY: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      elapsed: 0,
      pulses: world.pulses.map((pulse) => ({ ...pulse })),
      ripples: [] as Ripple[],
    };
    let width = 1;
    let height = 1;
    let raf = 0;
    let last = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (pausedRef.current) draw(0);
    };

    const draw = (dt: number) => {
      if (!pausedRef.current && dt > 0) {
        if (!motion.dragging) {
          motion.rotY += motion.velY;
          motion.spinX += motion.velX;
          motion.velY *= 0.93;
          motion.velX *= 0.93;
          motion.spinX *= 0.96;
        }
        motion.elapsed += dt * 16.667;
        motion.rotY += 0.002 * dt;
        motion.hoverX += (motion.targetX - motion.hoverX) * 0.06;
        motion.hoverY += (motion.targetY - motion.hoverY) * 0.06;
        for (const pulse of motion.pulses) {
          const next = pulse.progress + pulse.speed * dt;
          if (pulse.progress < 1 && next >= 1) motion.ripples.push({ hub: pulse.to, age: 0 });
          pulse.progress = next >= 1.55 ? next - 1.55 : next;
        }
        motion.ripples = motion.ripples
          .map((ripple) => ({ ...ripple, age: ripple.age + dt * (16.667 / 700) }))
          .filter((ripple) => ripple.age < 1);
      }

      const rotX = 0.22 + Math.sin(motion.elapsed * 0.0004) * 0.06 + motion.spinX + motion.hoverY;
      const rotY = motion.rotY + motion.hoverX;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.385;
      const place = (point: Vec) => {
        const rotated = rotatePoint(point, rotX, rotY);
        return { ...rotated, sx: cx + rotated.x * radius, sy: cy + rotated.y * radius };
      };

      ctx.clearRect(0, 0, width, height);
      const halo = ctx.createRadialGradient(cx - radius * 0.14, cy - radius * 0.14, radius * 0.15, cx, cy, radius * 1.42);
      halo.addColorStop(0, "rgba(56, 189, 248, 0.16)");
      halo.addColorStop(0.58, "rgba(14, 116, 144, 0.05)");
      halo.addColorStop(1, "rgba(4, 5, 7, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.42, 0, Math.PI * 2);
      ctx.fill();

      const glass = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.34, radius * 0.05, cx, cy, radius);
      glass.addColorStop(0, "rgba(22, 44, 74, 0.84)");
      glass.addColorStop(0.42, "rgba(8, 13, 22, 0.94)");
      glass.addColorStop(0.84, "rgba(4, 6, 10, 0.98)");
      glass.addColorStop(1, "rgba(12, 24, 40, 0.96)");
      ctx.fillStyle = glass;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      const fresnel = ctx.createRadialGradient(cx, cy, radius * 0.68, cx, cy, radius);
      fresnel.addColorStop(0, "rgba(56, 189, 248, 0)");
      fresnel.addColorStop(0.65, "rgba(56, 189, 248, 0)");
      fresnel.addColorStop(0.975, "rgba(56, 189, 248, 0.24)");
      fresnel.addColorStop(1, "rgba(125, 211, 252, 0.10)");
      ctx.fillStyle = fresnel;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      for (const particle of world.particles) {
        if (!particle.cluster || particle.weight <= 0.35) continue;
        const viewed = place(particle);
        if (viewed.z >= 0) continue;
        ctx.fillStyle = `rgba(100, 130, 170, ${0.05 + (1 + viewed.z) * 0.07})`;
        ctx.beginPath();
        ctx.arc(viewed.sx, viewed.sy, 0.65, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.lineWidth = 0.7;
      for (const [a, b] of world.synapses) {
        const from = world.points[world.hubs[a]];
        const to = world.points[world.hubs[b]];
        ctx.beginPath();
        let drawing = false;
        let depth = 0;
        let count = 0;
        for (let step = 0; step <= 12; step += 1) {
          const viewed = place(slerpArc(from, to, step / 12, 0.015));
          if (viewed.z < 0) {
            drawing = false;
            continue;
          }
          depth += viewed.z;
          count += 1;
          if (!drawing) {
            ctx.moveTo(viewed.sx, viewed.sy);
            drawing = true;
          } else ctx.lineTo(viewed.sx, viewed.sy);
        }
        if (!count) continue;
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 + (depth / count) * 0.11})`;
        ctx.stroke();
      }

      for (const particle of world.particles) {
        const viewed = place(particle);
        if (viewed.z < 0) continue;
        if (!particle.cluster) {
          ctx.fillStyle = "rgba(71, 85, 105, 0.16)";
          ctx.beginPath();
          ctx.arc(viewed.sx, viewed.sy, 0.65, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        const ndotl = Math.max(0, viewed.x * LIGHT.x + viewed.y * LIGHT.y + viewed.z * LIGHT.z);
        const rim = (1 - viewed.z) ** 2.4;
        const lum = Math.min(1, 0.12 + ndotl * 0.68 + rim * 0.45) * (0.45 + 0.55 * particle.weight);
        const lit = Math.max(0, Math.min(1, ndotl));
        const red = mix(mix(71, 56, lit), 232, Math.min(1, rim * 0.85 + Math.max(0, ndotl - 0.45)));
        const green = mix(mix(85, 189, lit), 244, Math.min(1, rim * 0.85 + Math.max(0, ndotl - 0.45)));
        const blue = mix(mix(105, 248, lit), 255, Math.min(1, rim * 0.85 + Math.max(0, ndotl - 0.45)));
        ctx.fillStyle = `rgba(${red | 0}, ${green | 0}, ${blue | 0}, ${0.18 + lum * 0.8})`;
        ctx.beginPath();
        ctx.arc(viewed.sx, viewed.sy, 0.75 + particle.weight * 0.85 + lum * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "lighter";
      for (const hub of world.hubs) {
        const viewed = place(world.points[hub]);
        if (viewed.z < 0) continue;
        const bloom = 8 + viewed.z * 5;
        const glow = ctx.createRadialGradient(viewed.sx, viewed.sy, 0, viewed.sx, viewed.sy, bloom);
        glow.addColorStop(0, "rgba(56, 189, 248, 0.36)");
        glow.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(viewed.sx, viewed.sy, bloom, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#F8FAFC";
        ctx.beginPath();
        ctx.arc(viewed.sx, viewed.sy, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const ripple of motion.ripples) {
        const viewed = place(world.points[world.hubs[ripple.hub]]);
        if (viewed.z < 0) continue;
        ctx.strokeStyle = `rgba(186, 230, 253, ${0.65 * (1 - ripple.age)})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.arc(viewed.sx, viewed.sy, 3 + ripple.age * 13, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.lineCap = "round";
      for (const pulse of motion.pulses) {
        const from = world.points[world.hubs[pulse.from]];
        const to = world.points[world.hubs[pulse.to]];
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = "rgba(125, 211, 252, 0.08)";
        ctx.beginPath();
        let drawing = false;
        for (let step = 0; step <= 32; step += 1) {
          const point = rotatePoint(slerpArc(from, to, step / 32, pulse.lift), rotX, rotY);
          if (hidden(point)) {
            drawing = false;
            continue;
          }
          const x = cx + point.x * radius;
          const y = cy + point.y * radius;
          if (!drawing) {
            ctx.moveTo(x, y);
            drawing = true;
          } else ctx.lineTo(x, y);
        }
        ctx.stroke();

        const tStart = Math.max(0, pulse.progress - 0.24);
        const tEnd = Math.min(1, pulse.progress);
        if (tEnd > tStart) {
          const envelope = Math.min(1, tEnd / 0.1) * Math.min(1, (1 - tStart) / 0.1);
          for (let step = 0; step < 18; step += 1) {
            const fade = (step / 18) ** 1.5;
            const a = rotatePoint(slerpArc(from, to, tStart + ((tEnd - tStart) * step) / 18, pulse.lift), rotX, rotY);
            const b = rotatePoint(slerpArc(from, to, tStart + ((tEnd - tStart) * (step + 1)) / 18, pulse.lift), rotX, rotY);
            if (hidden(a) || hidden(b)) continue;
            const red = pulse.color === "#E0F2FE" ? 224 : 56;
            const green = pulse.color === "#E0F2FE" ? 242 : 189;
            const blue = pulse.color === "#E0F2FE" ? 254 : 248;
            ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${0.9 * fade * envelope})`;
            ctx.lineWidth = 0.5 + fade * 1.7;
            ctx.beginPath();
            ctx.moveTo(cx + a.x * radius, cy + a.y * radius);
            ctx.lineTo(cx + b.x * radius, cy + b.y * radius);
            ctx.stroke();
          }
        }
        if (pulse.progress <= 1) {
          const head = rotatePoint(slerpArc(from, to, pulse.progress, pulse.lift), rotX, rotY);
          if (!hidden(head)) {
            const x = cx + head.x * radius;
            const y = cy + head.y * radius;
            const glow = ctx.createRadialGradient(x, y, 0, x, y, 10);
            glow.addColorStop(0, pulse.color === "#E0F2FE" ? "rgba(224, 242, 254, 0.8)" : "rgba(56, 189, 248, 0.75)");
            glow.addColorStop(1, "rgba(56, 189, 248, 0)");
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#F8FAFC";
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "butt";

      const rim = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      rim.addColorStop(0, "rgba(224, 242, 254, 0.36)");
      rim.addColorStop(0.45, "rgba(56, 189, 248, 0.14)");
      rim.addColorStop(1, "rgba(56, 189, 248, 0.03)");
      ctx.strokeStyle = rim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    const loop = (now: number) => {
      const previous = last;
      last = now;
      const dt = previous ? Math.min((now - previous) / 16.667, 2) : 0;
      draw(dt);
      if (!pausedRef.current) raf = window.requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (pausedRef.current) draw(0);
      else raf = window.requestAnimationFrame(loop);
    };
    startRef.current = start;

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();
    start();

    const onPointerDown = (event: PointerEvent) => {
      motion.dragging = true;
      motion.lastX = event.clientX;
      motion.lastY = event.clientY;
      wrap.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      if (motion.dragging) {
        const dx = event.clientX - motion.lastX;
        const dy = event.clientY - motion.lastY;
        motion.lastX = event.clientX;
        motion.lastY = event.clientY;
        motion.velY = dx * 0.005;
        motion.velX = dy * 0.004;
        motion.rotY += motion.velY;
        motion.spinX += motion.velX;
        if (pausedRef.current) draw(0);
        return;
      }
      motion.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.32;
      motion.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.32;
    };
    const onPointerUp = () => {
      motion.dragging = false;
      motion.targetX = 0;
      motion.targetY = 0;
    };
    wrap.addEventListener("pointerdown", onPointerDown);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerup", onPointerUp);
    wrap.addEventListener("pointerleave", onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointerleave", onPointerUp);
    };
  }, [world]);

  useEffect(() => {
    startRef.current();
  }, [paused]);

  return (
    <div ref={wrapRef} className="h-full w-full cursor-grab touch-none active:cursor-grabbing">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        role="img"
        aria-label="Interactive 3D luminous neural network globe representing live AI workflow orchestration"
      />
    </div>
  );
}
