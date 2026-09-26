"use client";

import { track } from "@/lib/analytics";

/** External/contact link that reports a conversion event (tel, WhatsApp, e-mail, download). */
export function TrackedLink({
  event,
  href,
  children,
  className,
  newTab,
  ...rest
}: {
  event: string;
  href: string;
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(event, { href })}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
