"use client";

import { useRef } from "react";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "solar" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

/** Primary action. Solar = filled gold; ghost = outlined. Subtle magnetic pull on pointer devices. */
export function Button({
  href,
  onClick,
  children,
  variant = "solar",
  type = "button",
  disabled,
  className = "",
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

  const cls = [
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold",
    "transition-[background,color,border-color,box-shadow] duration-300 will-change-transform",
    "data-cursor",
    variant === "solar"
      ? "bg-solar text-on-solar hover:bg-solar-hover shadow-[0_0_0_0_rgba(240,168,27,0)] hover:shadow-[0_8px_36px_-8px_rgba(240,168,27,0.45)]"
      : "border border-line bg-base/50 backdrop-blur-md text-ink hover:border-solar hover:text-accent",
    disabled ? "opacity-60 pointer-events-none" : "",
    className,
  ].join(" ");

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={cls}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </button>
  );
}
