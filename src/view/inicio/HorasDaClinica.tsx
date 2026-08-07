"use client";

import { Fragment, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/view/styling/cn";

/**
 * The clinic's living hours — Brasília and her three real client geographies
 * (Portugal, Inglaterra, EUA: CONCEPT §3), each city named with its local time,
 * updating by the minute. The strip enacts "no seu fuso" instead of asserting
 * it: the page itself demonstrates that the practice's day spans those places.
 *
 * The world's voice — tracked caps with terracotta interpuncts — and the policy
 * holds: these are the clinic's places, anchored to horário de Brasília, never
 * the visitor's. Nothing here reads the visitor's clock or location.
 *
 * Times render client-side only. The page is statically revalidated, so a
 * server-rendered time would be up to an hour stale — an em dash for a moment is
 * honest; a wrong hour is not. The fade-in keeps the swap from popping.
 */

// West to east, so the row reads as a single sweep across the clock rather than as
// Brasília plus a list of elsewheres.
const CITIES = [
  { key: "novaYork", timeZone: "America/New_York" },
  { key: "brasilia", timeZone: "America/Sao_Paulo" },
  { key: "londres", timeZone: "Europe/London" },
  { key: "lisboa", timeZone: "Europe/Lisbon" },
] as const;

function localTime(now: Date, timeZone: string, locale: string): string {
  const formatted = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(now);

  // The Brazilian written convention — 14h32 — reads as her world; the colon
  // reads as a train station. English keeps its own convention.
  return locale === "pt" ? formatted.replace(":", "h") : formatted;
}

export function HorasDaClinica({ className }: { className?: string }) {
  const t = useTranslations("inicio.brasilExterior");
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);

  return (
    <p aria-label={t("horasAria")} className={cn("tracked leading-[2.2]", className)}>
      {/* Each city+time is one unbreakable unit, and the interpunct is glued to
          the unit it follows — so on a narrow screen the line breaks *between*
          cities (the bare space is the only break point) and a wrapped line ends
          on the dot rather than opening with one. */}
      {CITIES.map((city, index) => (
        <Fragment key={city.key}>
          {index > 0 && " "}
          <span className="whitespace-nowrap">
            {t(`cities.${city.key}`)}{" "}
            <time
              dateTime={now ? localTime(now, city.timeZone, "en") : undefined}
              className={cn(
                // normal-case exempts the "h" of 20h03 from `.tracked`'s uppercase —
                // the lowercase hour mark is the Brazilian written convention.
                "text-ink-soft normal-case transition-opacity duration-500",
                now ? "opacity-100" : "opacity-0",
              )}
            >
              {now ? localTime(now, city.timeZone, locale) : "—"}
            </time>
            {index < CITIES.length - 1 && (
              <span aria-hidden="true" className="text-terracotta mx-1.5">
                ·
              </span>
            )}
          </span>
        </Fragment>
      ))}
    </p>
  );
}
