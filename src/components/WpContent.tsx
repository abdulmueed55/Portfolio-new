"use client";

import { useEffect, useRef } from "react";

// React's dangerouslySetInnerHTML inserts <script> tags into the DOM but
// browsers never execute scripts inserted that way (a long-standing browser
// security rule) — so anything WordPress relies on client-side (carousels,
// counters, tab switchers embedded directly in the page content) silently
// does nothing. Re-creating each script tag makes the browser actually run it.
export function WpContent({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const scripts = Array.from(container.querySelectorAll("script"));
    for (const oldScript of scripts) {
      const newScript = document.createElement("script");
      for (const attr of Array.from(oldScript.attributes)) {
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    }
  }, [html]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
