import type { CSSProperties } from "react";
import { useFormatter, useTranslations } from "next-intl";
import type { NightSky } from "@/domain/cosmos/nightSky";
import { horizonPoint } from "@/domain/cosmos/nightSky";
import { CeuRevealTrigger } from "@/view/cosmos/CeuRevealTrigger";

/**
 * **O céu desta noite** (CONCEPT §9.5) — the Cosmos substitute on phones and
 * under reduced motion, and the page's farewell wherever the 3D atlas cannot go.
 *
 * The real sky over São Paulo at the moment the page was rendered, drawn as a
 * star chart: the 26 constellation figures the atlas already uses, rotated into
 * the observer's horizon frame and projected onto a disc, with everything that
 * has set simply absent. Tomorrow it is a different chart, which is the whole
 * point — the strongest "alive between visits" signal available for the cost of
 * arithmetic.
 *
 * It replaced A Lâmina, which was built and measured and dropped: a phone
 * viewport is 2.16:1, so `object-fit: cover` on any plate less tall than that
 * never moved the lens at all (CONCEPT §9.1 records the evidence).
 *
 * Two properties make it safe where the atlas is not. It is **still by
 * default** — the markup is the finished chart, and that is what reduced
 * motion, browsers without scroll-driven animations, and no-JS readers all
 * get. Where motion is both allowed and supported, CSS alone performs *o
 * anoitecer* as the chart scrolls into view: the twilight veil lifts, the
 * stars come out brightest-first (the order real dusk follows — the same
 * magnitude hierarchy the chart already draws as size), and the figures ink
 * themselves in last, because the lines need their stars before they mean
 * anything. Scroll-scrubbed, not time-fired, so the visitor drives dusk and
 * nothing plays at anyone who asked not to be moved. Afterwards the sky holds
 * still, except the first-magnitude stars, which flicker the way the real
 * ones do. And it indexes **a place and a time, never a person**: the same
 * sky for every visitor, computed server-side from the render clock, with no
 * birthdate, no location request, and nothing per-visitor (CONCEPT §11).
 *
 * The dark ground is the one sanctioned exception to the parchment rule
 * (PRODUCT.md carve-out): a chart of the night sky on parchment is a chart of
 * nothing. It is bounded to the plate and does not bleed into the page.
 */

/** Altitude circles drawn on the chart, in degrees above the horizon. */
const ALMUCANTARS = [30, 60];

/** The compass marks, paired with the bearing each one sits at. */
const CARDINALS = [
  { key: "north", azimuth: 0 },
  { key: "east", azimuth: 90 },
  { key: "south", azimuth: 180 },
  { key: "west", azimuth: 270 },
] as const;

export function CeuDestaNoite({ sky, caption }: { sky: NightSky; caption: string | null }) {
  const t = useTranslations("inicio.ceu");
  const format = useFormatter();

  // The instant is São Paulo's, fixed by the i18n config, so this renders the
  // same string on the server and on the client regardless of who is reading.
  const date = format.dateTime(sky.at, { day: "numeric", month: "long" });

  return (
    <section aria-labelledby="ceu-heading" className="ceu-section px-6">
      <CeuRevealTrigger />
      <div className="mx-auto flex w-full max-w-[34rem] flex-col items-center text-center">
        <h2
          id="ceu-heading"
          className="display-italic text-parchment ceu-reveal text-[clamp(1.85rem,5vw,2.4rem)]"
        >
          {t("heading")}
        </h2>

        <p className="text-parchment/70 ceu-reveal ceu-reveal-late mt-3 max-w-[30ch] text-sm leading-relaxed">
          {t("subtitle")}
        </p>

        <SkyChart sky={sky} label={t("chartLabel", { date })} />

        <p className="marginalia text-parchment/60 ceu-reveal mt-7">
          {caption ?? t("caption", { date })}
        </p>
      </div>
    </section>
  );
}

/**
 * The chart itself, drawn on the unit disc the domain projects onto.
 *
 * The viewBox *is* the sky — one unit is the horizon radius — so there is no
 * pixel arithmetic here and none in the domain either. Sizing is entirely the
 * container's business, and the chart stays sharp at any of it.
 *
 * The wrapper div, not the svg, carries the `--ceu-dusk` view timeline the
 * anoitecer scrubs against: a plain block is a CSS box under every engine's
 * definition, and an svg that failed to be a timeline subject would strand
 * every star at its hidden from-keyframe — an empty sky, permanently.
 */
function SkyChart({ sky, label }: { sky: NightSky; label: string }) {
  return (
    <div className="ceu-dusk-frame mt-10 w-full max-w-[24rem]">
      <svg viewBox="-1.17 -1.17 2.34 2.34" className="block w-full" role="img" aria-label={label}>
        <defs>
          {/* The dome: lighter overhead, deepening toward the horizon, which is
              how the sky actually reads away from a city's light. */}
          <radialGradient id="ceu-dome" cx="50%" cy="44%" r="72%">
            <stop offset="0%" stopColor="var(--color-cosmos-zenith)" />
            <stop offset="62%" stopColor="var(--color-cosmos-dome)" />
            <stop offset="100%" stopColor="var(--color-cosmos-night)" />
          </radialGradient>
        </defs>

        <circle cx="0" cy="0" r="1" fill="url(#ceu-dome)" />

        {/* The twilight veil — zenith light washed over the whole dome, lifted
            by the anoitecer as the chart scrolls in. Its resting opacity is 0,
            so wherever the animation cannot run the veil simply is not there
            and the sky is already night. */}
        <circle
          className="ceu-veil"
          cx="0"
          cy="0"
          r="1"
          fill="var(--color-cosmos-zenith)"
          opacity="0"
          aria-hidden="true"
        />

        {/* The gilt armature — the instrument the sky is read against, not part
            of the sky. Hairlines, and faint enough to sit under the stars. It
            never animates: the instrument is already printed on the page, and
            night falls inside it. */}
        <g
          fill="none"
          stroke="var(--color-gilt)"
          strokeWidth="0.004"
          opacity="0.28"
          aria-hidden="true"
        >
          <circle cx="0" cy="0" r="1" />
          {ALMUCANTARS.map((altitude) => (
            <circle key={altitude} cx="0" cy="0" r={almucantarRadius(altitude)} />
          ))}
          <line x1="0" y1="-1" x2="0" y2="1" />
          <line x1="-1" y1="0" x2="1" y2="0" />
        </g>

        {/* The figures: the lines people have drawn between these stars for
            millennia — the projection this section is actually about.
            `pathLength=1` normalises every segment so the anoitecer can draw
            each one with a single dash unit, whatever its real length. */}
        <g
          fill="none"
          stroke="var(--color-gilt)"
          strokeWidth="0.0035"
          strokeLinecap="round"
          opacity="0.42"
          aria-hidden="true"
        >
          {sky.figures.map((line) => (
            <line
              key={`${line.x1},${line.y1},${line.x2},${line.y2}`}
              className="ceu-figure"
              pathLength={1}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
            />
          ))}
        </g>

        <g fill="var(--color-starlight)" aria-hidden="true">
          {sky.stars.map((star, index) => (
            <circle
              key={star.id}
              className={`ceu-star ceu-mag-${duskClass(star.magnitude)}`}
              style={kindleStyle(star.magnitude, index)}
              cx={star.x}
              cy={star.y}
              r={starRadius(star.magnitude)}
              opacity={starOpacity(star.magnitude)}
            />
          ))}
        </g>

        <g fill="var(--color-gilt)" opacity="0.7" aria-hidden="true">
          {CARDINALS.map(({ key, azimuth }) => {
            const point = horizonPoint(azimuth);
            return (
              <text
                key={key}
                x={point.x * 1.09}
                y={point.y * 1.09}
                fontSize="0.062"
                fontFamily="var(--font-display)"
                letterSpacing="0.01"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {/* Norte · Leste · Sul · Oeste — the same in both site languages. */}
                {{ north: "N", east: "L", south: "S", west: "O" }[key]}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/**
 * Which wave of dusk a star arrives in — 1 first, like the real evening.
 *
 * The cuts follow the chart's own hierarchy: 1 is the named first-magnitude
 * stars (Sirius through Hadar), 2 the rest of the bright table, 3 the
 * second-magnitude figures, 4 the unnamed vertices that fill in last, the way
 * the faint stars only appear once the sky has actually darkened.
 */
function duskClass(magnitude: number): 1 | 2 | 3 | 4 {
  if (magnitude <= 0.65) return 1;
  if (magnitude <= 1.6) return 2;
  if (magnitude <= 2.5) return 3;
  return 4;
}

/**
 * Per-star phase and period for the first-magnitude flicker, so the handful
 * of brightest stars never pulse in lockstep. Derived from the render index —
 * deterministic, because this markup is rendered on the server and again on
 * the client and the two must agree.
 */
function kindleStyle(magnitude: number, index: number): CSSProperties | undefined {
  if (duskClass(magnitude) !== 1) return undefined;
  return {
    "--ceu-kindle-duration": `${(3.4 + (index % 4) * 0.7).toFixed(1)}s`,
    "--ceu-kindle-delay": `${((index * 0.97) % 3.3).toFixed(2)}s`,
  } as CSSProperties;
}

/** Where an altitude circle falls, under the same stereographic projection. */
function almucantarRadius(altitudeDeg: number): number {
  return Math.tan((((90 - altitudeDeg) / 2) * Math.PI) / 180);
}

/**
 * Brightness as size, on the inverse ramp charts have always used: first
 * magnitude reads as a disc, third as a point. Clamped at both ends so an
 * uncatalogued vertex never vanishes and Sirius never becomes a blob.
 */
function starRadius(magnitude: number): number {
  return clamp(0.0155 - (magnitude + 1.5) * 0.0022, 0.005, 0.016);
}

/** The faint end also fades, so the hierarchy survives on a small screen. */
function starOpacity(magnitude: number): number {
  return clamp(1 - (magnitude + 1.5) * 0.08, 0.45, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
