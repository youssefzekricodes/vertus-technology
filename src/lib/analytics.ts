/**
 * Conversion tracking (GA4). No-op until analytics is enabled (env id set)
 * AND the visitor has accepted cookies — gtag is only loaded after consent.
 */
type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", event, params);
}

export const CONSENT_KEY = "vertus-consent";
export type Consent = "granted" | "denied";
