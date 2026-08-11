"use client";

import { Fragment, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { offsetMinutes, REACH } from "@/domain/clinica/reach";
import { cn } from "@/view/styling/cn";

/**
 * The clinic's living hours — Brasília and the five countries she works with
 * (CONCEPT §3), each named with its city, its local time, and how far its clock
 * sits from Brasília's, updating by the minute. The strip enacts "no seu fuso"
 * instead of asserting it: the page itself demonstrates that the practice's day
 * spans those places.
 *
 * **This is the site's list of countries.** Before it, the reach was three names
 * welded into four prose sentences, and adding two more meant a longer sentence
 * on every one of them. So the contract matters: **the country and city names
 * server-render**, in markup, and only the clock and the offset wait for
 * hydration. A crawler, a screen reader and a reader with JavaScript off all get
 * the list; what they miss is the arithmetic, which the Markdown twins state in
 * words instead.
 *
 * Times and offsets render client-side only. The pages are statically
 * revalidated, so a server-rendered hour would be up to an hour stale — an em
 * dash for a moment is honest; a wrong hour is not. The same is true of the
 * offset, which moves twice a year in Europe and North America and never in
 * Brazil.
 *
 * The world's voice — tracked caps, terracotta hairlines — and the policy holds:
 * these are the clinic's places, anchored to horário de Brasília, never the
 * visitor's. Nothing here reads the visitor's clock or location.
 */

/**
 * How far from Brasília the bar's track reaches, in hours, in either direction.
 *
 * Five, because that is the widest the real spread gets: Amsterdã is +5 under
 * European summer time and Nova York is −2 under North American standard time, so
 * the track is used rather than mostly empty, and nothing ever clamps. A place
 * further out would clamp to the end of the track — which is honest, since the
 * exact figure is written beside it in words.
 */
const BAR_SCALE_HOURS = 5;

export function HorasDaClinica({
  variant = "strip",
  className,
}: {
  /** `strip`: one tracked-caps line for the home band. `full`: a ruled list. */
  variant?: "strip" | "full";
  className?: string;
}) {
  const now = useNow();

  return variant === "strip" ? (
    <ReachStrip now={now} className={className} />
  ) : (
    <ReachList now={now} className={className} />
  );
}

/**
 * The home band's one-line run: country, local time, terracotta interpunct.
 * Cities are left to `/internacional` — six country-plus-city pairs would wrap
 * into a paragraph, and on the home page the countries are the fact.
 */
function ReachStrip({ now, className }: { now: Date | null; className?: string }) {
  const t = useTranslations("horas");

  return (
    <p aria-label={t("aria")} className={cn("tracked leading-[2.2]", className)}>
      {/* Each place+time is one unbreakable unit, and the interpunct is glued to
          the unit it follows — so on a narrow screen the line breaks *between*
          places (the bare space is the only break point) and a wrapped line ends
          on the dot rather than opening with one. */}
      {REACH.map((place, index) => (
        <Fragment key={place.key}>
          {index > 0 && " "}
          <span className="whitespace-nowrap">
            {t(`places.${place.key}.country`)} <LocalTime now={now} timeZone={place.timeZone} />
            {index < REACH.length - 1 && (
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

/**
 * `/internacional`'s ruled list: one row per place, with a hairline whose length
 * and direction measure the row against a Brasília zero-line.
 *
 * The bar is the page's craft moment and it is drawn in the system's own grammar
 * — a rule, a hairline, one terracotta accent — rather than in a chart library or
 * a canvas. It is decoration over a fact that is already written beside it in
 * words, so it is `aria-hidden` and it disappears below `sm`, where a 6-hour
 * track would be a smudge: the sentence "4 h à frente" carries the whole meaning
 * on a phone.
 */
function ReachList({ now, className }: { now: Date | null; className?: string }) {
  const t = useTranslations("horas");

  return (
    <ul aria-label={t("listAria")} className={cn("border-rule-soft border-t", className)}>
      {REACH.map((place) => {
        const minutes = now === null ? null : offsetMinutes(now, place.timeZone);

        return (
          <li
            key={place.key}
            className="border-rule-soft flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b py-4"
          >
            <span className="tracked w-full sm:w-44 sm:shrink-0">
              {t(`places.${place.key}.country`)}
            </span>
            <span className="text-ink sm:w-32 sm:shrink-0">{t(`places.${place.key}.city`)}</span>
            <LocalTime now={now} timeZone={place.timeZone} />
            <span className="hidden min-w-24 sm:block sm:flex-1">
              <OffsetBar minutes={minutes} />
            </span>
            <span className="text-ink-soft body-italic ml-auto sm:ml-0 sm:w-32 sm:text-right">
              <OffsetWords minutes={minutes} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** The place's clock, or an em dash for the moment before hydration. */
function LocalTime({ now, timeZone }: { now: Date | null; timeZone: string }) {
  const locale = useLocale();

  return (
    <time
      dateTime={now ? localTime(now, timeZone, "en") : undefined}
      className={cn(
        // normal-case exempts the "h" of 20h03 from `.tracked`'s uppercase — the
        // lowercase hour mark is the Brazilian written convention. The fade keeps
        // the em-dash-to-hour swap from popping; under reduced motion it simply
        // swaps.
        "text-ink-soft normal-case tabular-nums motion-safe:transition-opacity motion-safe:duration-500",
        now ? "opacity-100" : "opacity-0",
      )}
    >
      {now ? localTime(now, timeZone, locale) : "—"}
    </time>
  );
}

/** "4 h à frente" · "1 h atrás" · "aqui". Nothing at all before hydration. */
function OffsetWords({ minutes }: { minutes: number | null }) {
  const t = useTranslations("horas");
  if (minutes === null) return null;
  if (minutes === 0) return t("here");

  const hours = Math.abs(minutes) / 60;
  // Half-hour zones exist (India, parts of Australia); none of hers are, but a
  // row added later should print "5,5 h" rather than "5.5 h" in Portuguese.
  const formatted = Number.isInteger(hours) ? String(hours) : hours.toFixed(1).replace(".", ",");

  return minutes > 0 ? t("ahead", { hours: formatted }) : t("behind", { hours: formatted });
}

/**
 * The hairline: a Brasília zero-line down the middle of the track, and a rule
 * running east or west of it in proportion to the difference.
 */
function OffsetBar({ minutes }: { minutes: number | null }) {
  const hours = (minutes ?? 0) / 60;
  const reach = (Math.min(Math.abs(hours), BAR_SCALE_HOURS) / BAR_SCALE_HOURS) * 50;
  const ahead = hours > 0;

  return (
    <span aria-hidden="true" className="relative block h-4">
      <span className="bg-rule absolute inset-y-0 left-1/2 w-px" />

      {minutes !== null && minutes !== 0 && (
        <span
          className="bg-terracotta absolute top-1/2 h-px motion-safe:transition-opacity motion-safe:duration-500"
          style={ahead ? { left: "50%", width: `${reach}%` } : { right: "50%", width: `${reach}%` }}
        />
      )}
    </span>
  );
}

function localTime(now: Date, timeZone: string, locale: string): string {
  const formatted = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(now);

  // The Brazilian written convention — 14h32 — reads as her world; the colon
  // reads as a train station. English keeps its own convention.
  return locale === "pt" ? formatted.replace(":", "h") : formatted;
}

/** The shared clock: null until hydration, then ticking every half minute. */
function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);

  return now;
}
