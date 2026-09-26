import { whatsappHref } from "@/content/company";
import type { Ui } from "@/content/ui";
import { TrackedLink } from "./TrackedLink";

/** Floating WhatsApp button (all devices). */
export function FloatingContact({ ui }: { ui: Ui }) {
  return (
    <div className="fixed bottom-5 end-5 z-50">
      <TrackedLink
        event="whatsapp_click"
        href={whatsappHref(ui.contact.whatsappText)}
        newTab
        aria-label={ui.a11y.whatsapp}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.5 14.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97 1-3.62-.24-.37a9.77 9.77 0 0 1-1.5-5.2c0-5.4 4.4-9.8 9.83-9.8a9.74 9.74 0 0 1 6.94 2.88 9.73 9.73 0 0 1 2.87 6.93c0 5.41-4.4 9.8-9.81 9.8Zm8.36-18.16A11.73 11.73 0 0 0 12.05.2C5.54.2.24 5.5.24 12c0 2.08.54 4.1 1.58 5.9L.14 24l6.26-1.64a11.8 11.8 0 0 0 5.64 1.44h.01c6.5 0 11.8-5.3 11.8-11.8 0-3.15-1.23-6.11-3.44-8.35Z" />
        </svg>
      </TrackedLink>
    </div>
  );
}
