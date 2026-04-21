import { useEffect, useRef, useCallback } from 'react';

export function useCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<any[]>([]);
  const orbsRef = useRef<any[]>([]);
  const lightningRef = useRef<any[]>([]);
  const frameRef = useRef(0);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.style.willChange = 'contents';
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles(w, h);
      createOrbs(w, h);
    };

    const createParticles = (w: number, h: number) => {
      const divisor = isMobile ? 16000 : 8000;
      const maxCount = isMobile ? 120 : 250;
      const count = Math.min(Math.floor((w * h) / divisor), maxCount);
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        const isAccent = Math.random() > 0.7;
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 0.4,
          hue: isAccent ? 270 : 190,
          alpha: Math.random() * 0.4 + 0.2,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    const createOrbs = (w: number, h: number) => {
      orbsRef.current = [];
      const count = Math.min(5, Math.floor(w / 400));
      for (let i = 0; i < count; i++) {
        orbsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 200 + 100,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          hue: Math.random() > 0.5 ? 190 : 270,
        });
      }
    };

    const generateBolt = (sx: number, sy: number, ex: number, ey: number) => {
      const points: number[] = [];
      const steps = 6;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        let x = sx + (ex - sx) * t;
        let y = sy + (ey - sy) * t;
        if (i > 0 && i < steps) {
          x += (Math.random() - 0.5) * 50;
          y += (Math.random() - 0.5) * 20;
        }
        points.push(x, y);
      }
      const branches: number[][] = [];
      if (Math.random() < 0.5) {
        const mi = Math.floor(steps / 2) * 2;
        const bx = points[mi] + (Math.random() - 0.5) * 80;
        const by = points[mi + 1] + 30 + Math.random() * 50;
        const bpts: number[] = [];
        for (let i = 0; i <= 3; i++) {
          const t2 = i / 3;
          bpts.push(
            points[mi] + (bx - points[mi]) * t2 + (Math.random() - 0.5) * 15,
            points[mi + 1] + (by - points[mi + 1]) * t2
          );
        }
        branches.push(bpts);
      }
      return { points, branches, life: 6, maxLife: 6, hue: Math.random() > 0.5 ? 190 : 270 };
    };

    const draw = (_ts: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      frameRef.current++;

      // Grid
      const horizon = h * 0.45;
      const gridLines = isMobile ? 15 : 30;
      const vertLines = isMobile ? 10 : 20;
      const scrollOffset = (frameRef.current * 0.3) % (h / gridLines);
      ctx.save();
      ctx.globalAlpha = 0.035;
      for (let i = 0; i < gridLines; i++) {
        const rawY = horizon + (i * (h - horizon) / gridLines) + scrollOffset;
        const y = horizon + ((rawY - horizon) % (h - horizon));
        const spread = (y - horizon) / (h - horizon);
        ctx.strokeStyle = spread > 0.5 ? `rgba(139,92,246,${spread * 0.5})` : `rgba(6,182,212,${spread * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      const vanishX = w / 2;
      for (let i = -vertLines; i <= vertLines; i++) {
        const baseX = vanishX + i * (w / vertLines);
        ctx.strokeStyle = `rgba(6,182,212,0.03)`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(vanishX, horizon);
        ctx.lineTo(baseX, h);
        ctx.stroke();
      }
      ctx.restore();

      // Orbs
      for (const orb of orbsRef.current) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.r) orb.x = w + orb.r;
        if (orb.x > w + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = h + orb.r;
        if (orb.y > h + orb.r) orb.y = -orb.r;
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        if (orb.hue === 190) {
          grad.addColorStop(0, 'rgba(6,182,212,0.06)');
          grad.addColorStop(0.5, 'rgba(6,182,212,0.02)');
        } else {
          grad.addColorStop(0, 'rgba(139,92,246,0.06)');
          grad.addColorStop(0.5, 'rgba(139,92,246,0.02)');
        }
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Lightning
      const frame = frameRef.current;
      const lightningInterval = isMobile ? 300 : 180;
      if (frame % lightningInterval === 0 && lightningRef.current.length < (isMobile ? 1 : 2)) {
        const sx = Math.random() * w * 0.7 + w * 0.15;
        const sy = Math.random() * h * 0.1;
        const ex = sx + (Math.random() - 0.5) * 250;
        const ey = h * (0.35 + Math.random() * 0.4);
        lightningRef.current.push(generateBolt(sx, sy, ex, ey));
      }
      for (let i = lightningRef.current.length - 1; i >= 0; i--) {
        const b = lightningRef.current[i];
        b.life--;
        if (b.life <= 0) { lightningRef.current.splice(i, 1); continue; }
        const a = b.life / b.maxLife;
        const pts = b.points;
        ctx.beginPath();
        ctx.moveTo(pts[0], pts[1]);
        for (let j = 2; j < pts.length; j += 2) ctx.lineTo(pts[j], pts[j + 1]);
        ctx.strokeStyle = `hsla(${b.hue},80%,60%,${a * 0.15})`;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pts[0], pts[1]);
        for (let j = 2; j < pts.length; j += 2) ctx.lineTo(pts[j], pts[j + 1]);
        ctx.strokeStyle = `hsla(${b.hue},90%,75%,${a * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        for (const br of b.branches) {
          ctx.beginPath();
          ctx.moveTo(br[0], br[1]);
          for (let j = 2; j < br.length; j += 2) ctx.lineTo(br[j], br[j + 1]);
          ctx.strokeStyle = `hsla(${b.hue},80%,60%,${a * 0.1})`;
          ctx.lineWidth = 5;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(br[0], br[1]);
          for (let j = 2; j < br.length; j += 2) ctx.lineTo(br[j], br[j + 1]);
          ctx.strokeStyle = `hsla(${b.hue},90%,75%,${a * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Particles
      const maxDist = 160;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        const glow = 0.5 + Math.sin(p.pulse) * 0.3;
        const r = p.r * (1 + Math.sin(p.pulse) * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha * glow})`;
        ctx.fill();
        if (!isMobile && p.r > 1.2) {
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
          halo.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${0.12 * glow})`);
          halo.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
        }
      }

      // Links — spatial hashing to avoid O(n²)
      const maxDistSq = maxDist * maxDist;
      const cellSize = maxDist;
      const grid = new Map<string, number[]>();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.floor(p.x / cellSize);
        const cy = Math.floor(p.y / cellSize);
        const k = cx + ',' + cy;
        let cell = grid.get(k);
        if (!cell) { cell = []; grid.set(k, cell); }
        cell.push(i);
      }
      ctx.lineWidth = 0.5;
      ctx.lineCap = 'round';
      for (const [k, indices] of grid) {
        const [gcx, gcy] = k.split(',').map(Number);
        for (let dcx = -1; dcx <= 1; dcx++) {
          for (let dcy = -1; dcy <= 1; dcy++) {
            const others = grid.get((gcx + dcx) + ',' + (gcy + dcy));
            if (!others) continue;
            for (const i of indices) {
              const pi = particles[i];
              for (const j of others) {
                if (j <= i) continue;
                const pj = particles[j];
                const dx = pi.x - pj.x;
                const dy = pi.y - pj.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < maxDistSq) {
                  const dist = Math.sqrt(distSq);
                  const alpha = 0.06 * (1 - dist / maxDist);
                  const mixedHue = (pi.hue + pj.hue) / 2;
                  ctx.beginPath();
                  ctx.moveTo(pi.x, pi.y);
                  ctx.lineTo(pj.x, pj.y);
                  ctx.strokeStyle = `hsla(${mixedHue}, 80%, 60%, ${alpha})`;
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      // Mouse interaction
      const mouseRadiusSq = 180 * 180;
      for (const p of particles) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < mouseRadiusSq) {
          const force = 1 - mDistSq / mouseRadiusSq;
          p.vx += mdx * force * 0.0003;
          p.vy += mdy * force * 0.0003;
        }
        p.vx *= 0.999;
        p.vy *= 0.999;
      }

      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        mouseGlow.addColorStop(0, 'rgba(139, 92, 246, 0.04)');
        mouseGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.02)');
        mouseGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx.fillStyle = mouseGlow;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    resize();
    animRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isMobile]);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return canvasRef;
}
