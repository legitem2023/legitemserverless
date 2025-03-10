'use client';
import { useEffect } from "react";

const LoadEruda = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && /Android|iPhone/i.test(navigator.userAgent)) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/eruda";
      script.onload = () => {
        const eruda = (window as any).eruda;
        if (!eruda._isInit) {
          eruda.init();
          eruda.add(eruda.get("console")); // ✅ Enable console plugin for persistent logs
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  return null;
};

export default LoadEruda;
