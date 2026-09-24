"use client";

import { useSyncExternalStore } from "react";
import type { Dict } from "@/content/site";
import { THEME_KEY, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const root = document.documentElement;
  const observer = new MutationObserver(onChange);
  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  // Follow OS changes until the visitor picks a theme explicitly.
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  const onSystem = (e: MediaQueryListEvent) => {
    if (localStorage.getItem(THEME_KEY)) return;
    root.setAttribute("data-theme", e.matches ? "light" : "dark");
  };
  mq.addEventListener("change", onSystem);

  return () => {
    observer.disconnect();
    mq.removeEventListener("change", onSystem);
  };
}

const getTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

// Unknown on the server: the pre-paint script decides on the client.
const getServerTheme = (): Theme | null => null;

export function ThemeToggle({ t }: { t: Dict }) {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, getServerTheme);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? t.a11y.themeToDark : t.a11y.themeToLight}
      className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink/80 hover:border-solar hover:text-accent transition-colors data-cursor"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={theme === null ? "opacity-0" : "transition-transform duration-500 motion-reduce:transition-none"}
        style={{ transform: isLight ? "rotate(0deg)" : "rotate(-90deg)" }}
      >
        {isLight ? (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5V4.5M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
