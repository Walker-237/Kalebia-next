"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useReveal
 * ---------------------------------------------------------------------
 * Hook version of the design system's Reveal.tsx pattern (§6).
 * Returns a ref to attach to any element + a boolean that flips to
 * true once the element crosses the given viewport threshold, and
 * stays true (no re-hide on scroll-up, matching the hero's fade-up
 * behavior extended below the fold).
 *
 * Usage:
 *   const { ref, visible } = useReveal();
 *   <div ref={ref} className={visible ? "is-visible" : ""}>...</div>
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.2
) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion: reveal immediately, no animation gate.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/**
 * useCountUp
 * ---------------------------------------------------------------------
 * Animates a number from 0 to `target` once `start` becomes true,
 * eased with the site's shared cubic-bezier(0.22, 1, 0.36, 1) curve.
 * Used by Impact.tsx for the kinetic number reveal.
 */
export function useCountUp(target: number, start: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    const ease = (t: number) => {
      // cubic-bezier(0.22, 1, 0.36, 1) approximation via standard easeOutCubic-ish curve
      return 1 - Math.pow(1 - t, 3);
    };

    let raf: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      setValue(Math.round(ease(t) * target));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return value;
}