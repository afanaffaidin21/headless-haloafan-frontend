"use client";

import { useEffect, useState } from "react";

export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
        e.preventDefault();
        setVisible((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="grid-overlay no-print"
      role="presentation"
      aria-hidden="true"
    >
      <span className="absolute bottom-3 left-3 border border-line bg-panel px-3 py-1.5 font-mono text-[10px] tracking-wider text-accent">
        GRID 12-COL · CTRL/CMD+G TO HIDE
      </span>
    </div>
  );
}
