"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_KEY, type Consent } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const OPEN_EVENT = "vertus-consent-open";

function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Consent banner + GA4 loader. Nothing is shown and no cookie is set when
 * NEXT_PUBLIC_GA_ID is not configured; GA only loads after "Accepter".
 */
export function CookieConsent({
  text,
  accept,
  decline,
  more,
  privacyHref,
}: {
  text: string;
  accept: string;
  decline: string;
  more: string;
  privacyHref: string;
}) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const c = readConsent();
    // Reading persisted consent once on mount; the banner only shows client-side.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(c);
    setVisible(c === null);
    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const choose = (c: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, c);
    } catch {}
    setConsent(c);
    setVisible(false);
  };

  if (!GA_ID) return null;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {visible && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookies"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-2xl glass border border-line/70 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.3)] md:flex md:items-center md:gap-5"
        >
          <p className="text-sm text-ink/90 leading-relaxed">
            {text}{" "}
            <Link href={privacyHref} className="underline hover:text-accent">
              {more}
            </Link>
          </p>
          <div className="mt-4 flex shrink-0 gap-3 md:mt-0">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="rounded-full border border-line px-4 py-2 text-sm hover:border-energy"
            >
              {decline}
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="rounded-full bg-energy px-4 py-2 text-sm font-semibold text-on-energy hover:bg-energy-hover"
            >
              {accept}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function CookieSettingsLink({ label }: { label: string }) {
  if (!GA_ID) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="hover:text-accent transition-colors"
    >
      {label}
    </button>
  );
}
