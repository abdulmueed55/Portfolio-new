"use client";

import { useEffect, useMemo, useRef } from "react";

// Server-rendered pages ship this HTML (including its <script> tags) inside
// the actual document, so the browser's native parser runs those scripts on
// a hard page load — but NOT on a client-side Next.js route transition
// (React just patches the DOM, no native HTML parse happens then). Running
// them ourselves in an effect fixes the second case, but doing that on top
// of the native execution double-runs everything on a hard load (duplicate
// timers/listeners), which is what broke the carousel. Fix: neutralize the
// tags before they ever reach the DOM — `type="text/plain"` makes the
// browser skip them entirely (a duplicate `type` later in the same original
// tag loses to this first one under the HTML spec) — and let this effect be
// the *only* place that ever executes them.
function neutralizeScripts(html: string) {
  return html.replace(/<script(\s|>)/gi, '<script type="text/plain" data-wp-inert="true"$1');
}

export function WpContent({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const safeHtml = useMemo(() => neutralizeScripts(html), [html]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const scripts = Array.from(container.querySelectorAll("script[data-wp-inert]"));
    for (const oldScript of scripts) {
      const newScript = document.createElement("script");
      for (const attr of Array.from(oldScript.attributes)) {
        // Skip the neutralizing type="text/plain" we injected (and its
        // marker) — the original tag's own `type`, if any, was already
        // dropped by the parser as a duplicate attribute, but none of
        // af.net's inline scripts rely on a non-default type (e.g. module).
        if (attr.name === "data-wp-inert" || attr.name === "type") continue;
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    }
  }, [safeHtml]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}
