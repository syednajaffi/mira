"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
          appearance?: "always" | "execute" | "interaction-only";
        }
      ) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

interface Props {
  siteKey: string;
  onToken: (token: string) => void;
  theme?: "light" | "dark" | "auto";
}

export function TurnstileWidget({ siteKey, onToken, theme = "light" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    function render() {
      if (cancelled || !ref.current || !window.turnstile) return;
      try {
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          theme,
          size: "flexible",
          appearance: "interaction-only",
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken("")
        });
      } catch (err) {
        console.warn("[turnstile] render error", err);
      }
    }

    if (typeof window !== "undefined" && window.turnstile) {
      render();
    } else {
      const id = setInterval(() => {
        if (window.turnstile) {
          clearInterval(id);
          render();
        }
      }, 250);
      return () => {
        cancelled = true;
        clearInterval(id);
        if (widgetId.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetId.current);
          } catch {
            // already removed
          }
        }
      };
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          // already removed
        }
      }
    };
  }, [siteKey, theme, onToken]);

  return <div ref={ref} className="cf-turnstile mt-1" />;
}
