"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Dict, Locale } from "@/content/site";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ t, locale }: { t: Dict; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      data-theme={scrolled ? undefined : "dark"}
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,border-color] duration-500 border-b ${
        scrolled ? "glass border-line/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)]" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8 h-16 md:h-[4.5rem]">
        <a href="#accueil" aria-label={t.nav.links[0].label} className="data-cursor">
          <Logo />
        </a>

        <ul className="hidden lg:flex items-center gap-8">
          {t.nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-ink/80 hover:text-accent transition-colors data-cursor"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle t={t} />
          <LanguageSwitcher locale={locale} t={t} />
          <a
            href="#contact"
            className="rounded-full bg-solar px-5 py-2.5 text-sm font-semibold text-on-solar hover:bg-solar-hover transition-colors data-cursor"
          >
            {t.nav.cta}
          </a>
        </div>

        {/* mobile */}
        <div className="flex lg:hidden items-center gap-3">
          <ThemeToggle t={t} />
          <LanguageSwitcher locale={locale} t={t} />
          <button
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative h-10 w-10 grid place-items-center"
          >
            <span aria-hidden="true" className="relative block h-3.5 w-6">
              <span
                className={`absolute inset-x-0 h-0.5 rounded-full bg-ink transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute inset-x-0 top-1.5 h-0.5 rounded-full bg-ink transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute inset-x-0 h-0.5 rounded-full bg-ink transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden glass border-t border-line/60 h-[calc(100svh-4rem)] overflow-y-auto"
          >
            <ul className="flex flex-col gap-1 px-6 py-8">
              {t.nav.links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduced ? false : { opacity: 0, x: locale === "ar" ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-2xl display-sub border-b border-line/40 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="px-6 pb-10">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-solar px-6 py-4 text-center font-semibold text-on-solar"
              >
                {t.nav.cta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
