"use client";

import { useState } from "react";

/** Google Maps loaded on demand (no third-party request until the visitor asks). */
export function MapEmbed({ title, loadLabel, notice, query }: { title: string; loadLabel: string; notice: string; query: string }) {
  const [show, setShow] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <div className="relative min-h-80 overflow-hidden rounded-2xl border border-line/60 bg-base-soft/50">
      {show ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-8 text-center grid-lines">
          <div>
            <p className="font-semibold">{title}</p>
            <p className="mt-2 max-w-sm text-sm text-mist">{notice}</p>
            <button
              type="button"
              onClick={() => setShow(true)}
              className="mt-5 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-energy hover:text-accent"
            >
              {loadLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
