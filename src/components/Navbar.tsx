"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Dropdown, Label } from "@heroui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/content/types";
import type { Ui } from "@/content/ui";
import { path } from "@/lib/routes";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      aria-hidden="true"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NavMenu({
  label,
  items,
  isActive,
  pathname,
}: {
  label: string;
  items: { href: string; label: string; active: boolean }[];
  isActive: boolean;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  // Close after any navigation (derived state, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  return (
    <li>
      <Dropdown isOpen={open} onOpenChange={setOpen}>
        <Dropdown.Trigger
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-1 py-1 text-sm outline-none transition-colors hover:text-accent data-[focus-visible]:outline-2 data-[focus-visible]:outline-accent ${
            isActive || open ? "text-accent" : "text-ink/80"
          }`}
        >
          {label}
          <Chevron open={open} />
        </Dropdown.Trigger>
        <Dropdown.Popover placement="bottom" offset={14} className="min-w-60 rounded-2xl p-1.5">
          <Dropdown.Menu aria-label={label} onAction={() => setOpen(false)}>
            {items.map((it) => (
              <Dropdown.Item
                key={it.href}
                id={it.href}
                href={it.href}
                textValue={it.label}
                aria-current={it.active ? "page" : undefined}
                className={`rounded-xl px-3.5 py-2.5 ${it.active ? "text-accent" : ""}`}
              >
                <Label className="cursor-pointer text-sm">{it.label}</Label>
                {it.active && <span aria-hidden="true" className="ms-auto h-1.5 w-1.5 rounded-full bg-accent" />}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </li>
  );
}

export function Navbar({ ui, locale }: { ui: Ui; locale: Locale }) {
  const pathname = usePathname() || "/";
  const isHome = pathname === path(locale, "home");
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

  // Transparent over the dark home hero only; solid glass everywhere else.
  const solid = scrolled || !isHome;

  type Link_ = { href: string; label: string; active: boolean };
  const entries: (Link_ | { label: string; children: Link_[] })[] = ui.nav.map((e) =>
    "children" in e
      ? {
          label: e.label,
          children: e.children.map((c) => {
            const href = path(locale, c.key);
            return { href, label: c.label, active: pathname === href };
          }),
        }
      : { label: e.label, href: path(locale, e.key), active: pathname === path(locale, e.key) }
  );

  return (
    <header
      data-theme={solid ? undefined : "dark"}
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,border-color] duration-500 border-b ${
        solid ? "glass border-line/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)]" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 md:px-8 h-16 md:h-[4.5rem]">
        <Link href={path(locale, "home")} aria-label={ui.home}>
          <Logo />
        </Link>

        <ul className="hidden xl:flex items-center gap-6">
          {entries.map((e) =>
            "children" in e ? (
              <NavMenu key={e.label} pathname={pathname} label={e.label} items={e.children} isActive={e.children.some((c) => c.active)} />
            ) : (
              <li key={e.href}>
                <Link
                  href={e.href}
                  aria-current={e.active ? "page" : undefined}
                  className={`whitespace-nowrap text-sm transition-colors hover:text-accent ${e.active ? "text-accent" : "text-ink/80"}`}
                >
                  {e.label}
                </Link>
              </li>
            )
          )}
        </ul>

        <div className="hidden xl:flex items-center gap-3">
          <ThemeToggle ui={ui} />
          <LanguageSwitcher locale={locale} ui={ui} />
          <Link
            href={path(locale, "study")}
            className="rounded-full bg-energy px-5 py-2.5 text-sm font-semibold text-on-energy hover:bg-energy-hover transition-colors whitespace-nowrap"
          >
            {ui.cta.study}
          </Link>
        </div>

        {/* mobile / tablet */}
        <div className="flex xl:hidden items-center gap-3">
          <ThemeToggle ui={ui} />
          <LanguageSwitcher locale={locale} ui={ui} />
          <button
            aria-label={open ? ui.a11y.closeMenu : ui.a11y.openMenu}
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
            className="xl:hidden glass border-t border-line/60 h-[calc(100svh-4rem)] overflow-y-auto"
          >
            <ul className="flex flex-col px-6 py-6">
              {entries.map((e) =>
                "children" in e ? (
                  <li key={e.label} className="border-b border-line/40 py-3">
                    <p className="py-2 text-sm text-mist">{e.label}</p>
                    <ul className="grid gap-1 ps-3">
                      {e.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={() => setOpen(false)}
                            aria-current={c.active ? "page" : undefined}
                            className={`block py-2 text-lg ${c.active ? "text-accent" : ""}`}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      onClick={() => setOpen(false)}
                      aria-current={e.active ? "page" : undefined}
                      className={`block py-4 text-2xl display-sub border-b border-line/40 hover:text-accent transition-colors ${
                        e.active ? "text-accent" : ""
                      }`}
                    >
                      {e.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
            <div className="px-6 pb-10">
              <Link
                href={path(locale, "study")}
                onClick={() => setOpen(false)}
                className="block rounded-full bg-energy px-6 py-4 text-center font-semibold text-on-energy"
              >
                {ui.cta.study}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
