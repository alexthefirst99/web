'use client';

import { useEffect, useRef } from 'react';

/**
 * Pointer effects ported from the portfolio (js/site.js) so the AI page feels the same:
 *  - custom cursor: ring + dot (mix-blend difference); the ring grows over links/buttons
 *  - spotlight: cards with `.tile` or `[data-spot]` get a soft light that follows the pointer
 *  - magnetic: `[data-magnetic]` elements lean toward the pointer
 *  - tilt: `[data-tilt]` gets a gentle 3D tilt; `[data-depth="n"]` layers drift by n px
 * Only on fine pointers (mouse/trackpad) and when reduced motion is not requested.
 */
export default function HoverFx() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine) return;

    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const m = { x: 0, y: 0, sx: 0, sy: 0, cx: -100, cy: -100, rx: -100, ry: -100 };

    // Spotlight works even with reduced motion (it is not movement).
    const onMove = (e: PointerEvent) => {
      m.x = (e.clientX / window.innerWidth) * 2 - 1;
      m.y = (e.clientY / window.innerHeight) * 2 - 1;
      m.cx = e.clientX;
      m.cy = e.clientY;
      document.querySelectorAll<HTMLElement>('.tile, [data-spot]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (e.clientY > r.top - 200 && e.clientY < r.bottom + 200) {
          el.style.setProperty('--mx', `${e.clientX - r.left}px`);
          el.style.setProperty('--my', `${e.clientY - r.top}px`);
        }
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    if (reduce) return () => window.removeEventListener('pointermove', onMove);

    ring.style.display = dot.style.display = 'block';
    document.body.classList.add('fx-cursor');

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      ring.classList.toggle('is-hover', !!t?.closest?.('a, button'));
    };
    const onLeave = () => { m.cx = m.cy = -100; };
    document.addEventListener('pointerover', onOver);
    document.documentElement.addEventListener('pointerleave', onLeave);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      m.sx += (m.x - m.sx) * 0.06;
      m.sy += (m.y - m.sy) * 0.06;
      m.rx += (m.cx - m.rx) * 0.18;
      m.ry += (m.cy - m.ry) * 0.18;
      ring.style.transform = `translate(${m.rx}px, ${m.ry}px)`;
      dot.style.transform = `translate(${m.cx}px, ${m.cy}px)`;

      document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
        el.style.transform = `perspective(1800px) rotateX(${(-m.sy * 1.6).toFixed(2)}deg) rotateY(${(m.sx * 2.2).toFixed(2)}deg)`;
      });
      document.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
        const d = Number(el.dataset.depth) || 0;
        el.style.transform = `translate3d(${(m.sx * d).toFixed(1)}px, ${(m.sy * d).toFixed(1)}px, 0)`;
      });
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const r = el.getBoundingClientRect();
        const dx = m.cx - (r.left + r.width / 2);
        const dy = m.cy - (r.top + r.height / 2);
        const near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.9;
        el.style.transition = 'transform .35s cubic-bezier(.2,.8,.2,1)';
        el.style.transform = near ? `translate(${dx * 0.25}px, ${dy * 0.3}px)` : 'translate(0, 0)';
      });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.body.classList.remove('fx-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="fx-ring" aria-hidden />
      <div ref={dotRef} className="fx-dot" aria-hidden />
    </>
  );
}
