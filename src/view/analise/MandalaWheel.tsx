"use client";

import { useTranslations } from "next-intl";
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";
import type { SignReading } from "@/domain/analise/Analise";
import {
  shortestRotationDelta,
  signRotationDeg,
  WHEEL_SECTOR_PATHS,
  WHEEL_VIEWBOX,
  WHEEL_ZODIAC,
} from "@/domain/wheel/wheelGeometry";
import { VEDIC_CONTENT, ZODIAC_CONTENT, type ZodiacSignId } from "@/domain/zodiac/zodiacContent";
import { useMotionAllowed } from "@/view/general/useMotionAllowed";

// ---------------------------------------------------------------------------
// The painted wheel — this page's one wow (CONCEPT §7.4, DESIGN §5).
//
// It is a real painted canvas, not generated ornament: twelve zodiacal figures,
// twenty-seven lunar mansions and the Earth at the centre, photographed once and
// shipped as an asset. Hovering or selecting a sector desaturates the rest of the
// painting and turns the chosen figure up to twelve o'clock — the interaction is
// a magnifying glass over her own image, which is the only kind of motion DESIGN
// allows outside the Cosmos carve-out.
//
// **What it may say.** Prose about a sign renders only from her CMS fields
// (REQ-007 / CONCEPT §11): `reading` and `vedicReading`, both empty at launch, in
// which case the sign shows its scholarly reference and nothing more. The
// reference itself — element · modality · ruler · body · archetype, and each
// mansion's deity · ruler · symbol — is interlocking nomenclature rather than
// editorial voice, so it renders. Nothing here is predictive and nothing reads
// the visitor: the wheel indexes her material, never the person looking at it.
//
// **Why the image is not a CMS slot.** `wheelGeometry` is calibrated to these
// exact pixels (Áries at ~4 o'clock, the annulus between radii 142 and 325 of a
// 690 viewBox). A different painting uploaded into the same slot would silently
// misalign all twelve sectors, so the asset is versioned with the code that
// measures it. Replacing it means recalibrating the geometry.
// ---------------------------------------------------------------------------

const WHEEL_SRC = "/art/wheel.jpg";
const PANEL_ID = "mandala-detail";
const tabId = (id: ZodiacSignId) => `mandala-sign-${id}`;

/**
 * The sectors, prepared once at module load.
 *
 * `WheelSign["id"]` is typed as `string` by the geometry module, so the id is
 * narrowed here. `zodiacContent.test.ts` asserts that `WHEEL_ZODIAC`'s ids and
 * `ZODIAC_SIGN_IDS` are the same list in the same order, which is what makes the
 * assertion safe rather than hopeful.
 */
const SECTORS = WHEEL_ZODIAC.map((sign) => ({
  id: sign.id as ZodiacSignId,
  label: sign.label,
  dateRange: sign.dateRange,
  path: WHEEL_SECTOR_PATHS[sign.id],
  rotation: signRotationDeg(sign),
}));

const FIRST_SECTOR_ID = SECTORS[0]?.id ?? "aries";

/** Circular navigation: the wheel has no first or last, only neighbours. */
function step(id: ZodiacSignId, delta: number): ZodiacSignId {
  const index = SECTORS.findIndex((sector) => sector.id === id);
  const next = (index + delta + SECTORS.length) % SECTORS.length;
  return SECTORS[next]?.id ?? id;
}

export function MandalaWheel({ readings }: { readings: Record<ZodiacSignId, SignReading> }) {
  const t = useTranslations("analise.mandala");
  const motionAllowed = useMotionAllowed();

  // Which sign the panel is showing. Hover, focus, arrow keys and taps all set it.
  const [activeId, setActiveId] = useState<ZodiacSignId | null>(null);
  // Which sign the wheel has actually turned to. Only an explicit activation
  // does this, because rotating on hover would make a swept cursor a carousel.
  const [turnedId, setTurnedId] = useState<ZodiacSignId | null>(null);
  const [rotationDeg, setRotationDeg] = useState(0);
  const tablistRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const target = turnedId ? (SECTORS.find((s) => s.id === turnedId)?.rotation ?? 0) : 0;
    setRotationDeg((prev) => prev + shortestRotationDelta(prev, target));
  }, [turnedId]);

  useEffect(() => {
    const clear = () => {
      setActiveId(null);
      setTurnedId(null);
    };

    const onPointerDown = (event: Event) => {
      const target = event.target as Element | null;
      // A press on a sector re-selects; a press inside the panel must not dismiss
      // it, or selecting text there would close what is being read.
      if (target?.closest("[data-wheel-sector],[data-wheel-panel]")) return;
      clear();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") clear();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const focusSector = (id: ZodiacSignId) => {
    tablistRef.current?.querySelector<SVGPathElement>(`[data-wheel-sector="${id}"]`)?.focus();
  };

  const handleEnter = (id: ZodiacSignId) => {
    // Once a sign has been turned up, a passing cursor no longer overrides it.
    if (turnedId) return;
    setActiveId(id);
  };

  const handleLeave = (id: ZodiacSignId) => {
    if (turnedId) return;
    // A sector the keyboard is still sitting on stays open: losing the panel
    // because the mouse happened to pass by would strand a keyboard reader.
    if (tablistRef.current?.contains(document.activeElement)) return;
    setActiveId((prev) => (prev === id ? null : prev));
  };

  const handleActivate = (id: ZodiacSignId) => {
    setActiveId(id);
    setTurnedId((prev) => (prev === id ? null : id));
  };

  const handleKeyDown = (event: ReactKeyboardEvent, id: ZodiacSignId) => {
    const deltas: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    const delta = deltas[event.key];

    if (delta !== undefined) {
      event.preventDefault();
      const next = step(id, delta);
      // Select before moving focus, so the leaving sector's handlers see the new
      // value and the panel never blinks back to its resting state in between.
      setActiveId(next);
      focusSector(next);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next = event.key === "Home" ? FIRST_SECTOR_ID : (SECTORS.at(-1)?.id ?? FIRST_SECTOR_ID);
      setActiveId(next);
      focusSector(next);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate(id);
    }
  };

  // Roving tabindex: the wheel is one tab stop, and the arrow keys move inside
  // it. Twelve tab stops in the middle of a reading page is a keyboard trap in
  // everything but name.
  const tabbableId = activeId ?? FIRST_SECTOR_ID;
  const active = activeId ? SECTORS.find((sector) => sector.id === activeId) : undefined;

  return (
    <div className="mt-14 grid items-start gap-12 lg:mt-20 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
      <div className="mx-auto w-[min(24rem,86vw)] lg:mx-0 lg:w-full">
        <div
          className="relative aspect-square w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.3,0,0.2,1)] motion-reduce:transition-none"
          style={{
            clipPath: "circle(50% at 50% 50%)",
            // Under reduced motion the wheel does not turn at all: an instant
            // 90° jump is not a gentler version of a rotation, it is a worse one.
            // The desaturation and the highlight still mark the chosen figure.
            transform: motionAllowed ? `rotate(${rotationDeg}deg)` : undefined,
          }}
        >
          <svg
            viewBox={`0 0 ${WHEEL_VIEWBOX} ${WHEEL_VIEWBOX}`}
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <filter id="wheel-desaturate">
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncR type="linear" slope="0.95" />
                  <feFuncG type="linear" slope="0.95" />
                  <feFuncB type="linear" slope="0.95" />
                </feComponentTransfer>
              </filter>
              {SECTORS.map((sector) => (
                <clipPath key={sector.id} id={`wheel-clip-${sector.id}`}>
                  <path d={sector.path} />
                </clipPath>
              ))}
            </defs>

            <g role="img" aria-label={t("wheelAlt")}>
              <image
                href={WHEEL_SRC}
                x="0"
                y="0"
                width={WHEEL_VIEWBOX}
                height={WHEEL_VIEWBOX}
                preserveAspectRatio="xMidYMid meet"
                filter={activeId ? "url(#wheel-desaturate)" : undefined}
                className="transition-[filter] duration-300 motion-reduce:transition-none"
              />

              {activeId ? (
                <image
                  href={WHEEL_SRC}
                  x="0"
                  y="0"
                  width={WHEEL_VIEWBOX}
                  height={WHEEL_VIEWBOX}
                  preserveAspectRatio="xMidYMid meet"
                  clipPath={`url(#wheel-clip-${activeId})`}
                />
              ) : null}
            </g>

            <g
              ref={tablistRef}
              role="tablist"
              aria-label={t("tablistLabel")}
              aria-orientation="horizontal"
            >
              {SECTORS.map((sector) => (
                <path
                  key={sector.id}
                  id={tabId(sector.id)}
                  d={sector.path}
                  data-wheel-sector={sector.id}
                  role="tab"
                  tabIndex={sector.id === tabbableId ? 0 : -1}
                  aria-selected={sector.id === activeId}
                  aria-controls={PANEL_ID}
                  aria-label={t("signAria", { sign: sector.label, dates: sector.dateRange })}
                  onMouseEnter={() => handleEnter(sector.id)}
                  onMouseLeave={() => handleLeave(sector.id)}
                  onFocus={() => setActiveId(sector.id)}
                  onClick={() => handleActivate(sector.id)}
                  onKeyDown={(event) => handleKeyDown(event, sector.id)}
                  className="focus-visible:stroke-terracotta-deep cursor-pointer fill-transparent outline-none transition-[stroke] duration-150 focus-visible:[stroke-width:3] motion-reduce:transition-none"
                />
              ))}
            </g>
          </svg>
        </div>

        {/* The chosen figure, named under the wheel. `aria-hidden` because the
            focused sector's own label and the panel's heading already say it —
            two live regions announcing the same sign is the defect this replaces. */}
        <p
          aria-hidden="true"
          className="display-italic text-terracotta-deep mt-5 block min-h-[1.7em] text-center"
        >
          {active ? `${active.label} · ${active.dateRange}` : " "}
        </p>
      </div>

      {/* `tabIndex={0}` because a tabpanel holding no focusable content still has
          to be reachable from its tab — that is how a keyboard reader gets from
          the wheel into what the wheel is showing them. The focus ring is the
          site-wide `:focus-visible` rule in `globals.css`, not a local override. */}
      <div
        id={PANEL_ID}
        role="tabpanel"
        data-wheel-panel
        tabIndex={0}
        aria-labelledby={active ? tabId(active.id) : undefined}
        aria-label={active ? undefined : t("panelLabel")}
        className="mx-auto max-w-[52ch] lg:mx-0 lg:min-h-[34rem]"
      >
        {active ? (
          <SignDetail
            id={active.id}
            label={active.label}
            dateRange={active.dateRange}
            reading={readings[active.id]}
          />
        ) : (
          <div className="space-y-6">
            <p className="marginalia max-w-[44ch]">{t("hint")}</p>
            <p className="marginalia max-w-[44ch]">{t("hintVedic")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * One sign's page in the wheel's index: its correspondences, her reading if she
 * has written one, its three lunar mansions, and her Vedic reading if she has
 * written that.
 *
 * The nomenclature stays Portuguese in both locales — it is source-language
 * scholarly vocabulary, and the labels reach it through `messages` so translating
 * it later is a message-catalogue edit rather than a code change.
 */
function SignDetail({
  id,
  label,
  dateRange,
  reading,
}: {
  id: ZodiacSignId;
  label: string;
  dateRange: string;
  reading: SignReading;
}) {
  const t = useTranslations("analise.mandala");
  const content = ZODIAC_CONTENT[id];
  const { nakshatras } = VEDIC_CONTENT[id];

  const rows: [string, string][] = [
    [t("fields.element"), content.element],
    [t("fields.modality"), content.modality],
    [t("fields.ruler"), content.ruler],
    [t("fields.body"), content.bodyPart],
    [t("fields.archetype"), content.archetype],
  ];

  return (
    <>
      <h3 className="display text-foreground text-[clamp(1.4rem,2.6vw,1.9rem)] leading-[1.15] tracking-[-0.004em]">
        {label}
      </h3>
      <p className="marginalia text-terracotta-deep mt-1">{dateRange}</p>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
        {rows.map(([term, value]) => (
          <div key={term} className="col-span-2 grid grid-cols-subgrid">
            <dt className="tracked-ink">{term}</dt>
            <dd className="display-italic">{value}</dd>
          </div>
        ))}
      </dl>

      {/* REQ-007: her words or nothing. */}
      {reading.reading && (
        <p className="body-prose text-ink mt-6 max-w-[52ch]">{reading.reading}</p>
      )}

      <div className="bg-terracotta/40 mt-10 h-px w-12" aria-hidden="true" />
      <h4 className="tracked-ink text-foreground mt-8">{t("vedic")}</h4>
      <p className="marginalia mt-1">{t("vedicSub")}</p>

      <ul className="mt-6 space-y-5">
        {nakshatras.map((nakshatra) => (
          <li key={`${nakshatra.name}-${nakshatra.range ?? ""}`}>
            <p className="display-italic text-foreground text-[1.05rem] leading-[1.25]">
              {nakshatra.name}
              {nakshatra.range ? (
                <span className="marginalia text-terracotta-deep"> ({nakshatra.range})</span>
              ) : null}
            </p>
            <p className="marginalia mt-1">
              {nakshatra.deity} · {nakshatra.ruler} · {nakshatra.symbol}
            </p>
          </li>
        ))}
      </ul>

      {reading.vedicReading && (
        <p className="body-prose text-ink mt-6 max-w-[52ch]">{reading.vedicReading}</p>
      )}
    </>
  );
}
