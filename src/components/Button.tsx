"use client";

import Link from "next/link";
import { useRef } from "react";
import { track as trackEvent } from "@/lib/analytics";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "energy" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  /** Opens in a new tab (WhatsApp, maps…). */
  external?: boolean;
  /** Analytics event sent on click. */
  track?: string;
};

/** Primary action. Energy = filled green; ghost = outlined. Subtle magnetic pull on pointer devices. */
export function Button({
  href,
  onClick,
  children,
  variant = "energy",
  type = "button",
  disabled,
  className = "",
  external,
  track,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    el.style.transform = `translate(${x * 6}px, ${y * 5}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  const handleClick = () => {
    if (track) trackEvent(track, { href });
    onClick?.();
  };

  const cls = [
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold",
    "transition-[background,color,border-color,box-shadow,transform] duration-300 ease-out will-change-transform",
    variant === "energy"
      ? "bg-energy text-on-energy hover:bg-energy-hover shadow-[0_0_0_0_rgba(34,196,122,0)] hover:shadow-[0_8px_36px_-8px_rgba(34,196,122,0.45)]"
      : "border border-line bg-base/50 backdrop-blur-md text-ink hover:border-energy hover:text-accent",
    disabled ? "opacity-60 pointer-events-none" : "",
    className,
  ].join(" ");

  if (href) {
    const common = {
      className: cls,
      onPointerMove: onMove,
      onPointerLeave: onLeave,
      onClick: handleClick,
    };
    if (external || /^(https?:|tel:|mailto:)/.test(href)) {
      return (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...common}
        >
          {children}
        </a>
      );
    }
    return (
      <Link ref={ref as React.RefObject<HTMLAnchorElement>} href={href} {...common}>
        {children}
      </Link>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={cls}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </button>
  );
}
