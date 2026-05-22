"use client";

import { useEffect, useRef, useState } from "react";

export function useNearViewport<T extends HTMLElement>(rootMargin = "720px") {
  const ref = useRef<T | null>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isNear) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setIsNear(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNear(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isNear, rootMargin]);

  return [ref, isNear] as const;
}
