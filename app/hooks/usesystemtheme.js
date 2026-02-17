"use client";

import { useEffect, useState } from "react";

export function useSystemTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    // ✅ Defer initial setState to avoid synchronous cascade
    const id = setTimeout(() => setIsDark(mq.matches), 0);

    // ✅ Change handler is already async (event callback) — fine as-is
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);

    return () => {
      clearTimeout(id);
      mq.removeEventListener("change", handler);
    };
  }, []);

  return isDark;
}