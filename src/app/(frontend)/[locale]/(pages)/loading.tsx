"use client";

import { useTranslations } from "next-intl";

// Route loading fallback. Calm by design — a single pulsing mark and a quiet
// line, no spinner chrome. `motion-safe` keeps it still for reduced-motion.
//
// A client component on purpose: `loading.tsx` receives no route params, so a
// server-side `getTranslations()` would have to read the locale off the request
// headers, and that opts the whole segment out of static rendering. Taking the
// messages from `NextIntlClientProvider` keeps the pages prerendered.
export default function Loading() {
  const t = useTranslations("loading");

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center px-6"
    >
      <p className="marginalia inline-flex items-center gap-3 text-[1rem]">
        <span aria-hidden="true" className="text-terracotta motion-safe:animate-pulse">
          ✦
        </span>
        <span className="display-italic text-ink-soft">{t("label")}</span>
      </p>
    </div>
  );
}
