"use client";

import { Fragment, useEffect, useState } from "react";
import {
  WHEEL_SECTOR_PATHS,
  WHEEL_VIEWBOX,
  WHEEL_ZODIAC,
  shortestRotationDelta,
  signRotationDeg,
  type WheelSign,
} from "@/core/wheel";
import type { MandalaContent } from "@/core/zodiacContent";

type ActiveState = { sign: WheelSign | null; pinned: boolean };

export function Symbols({ content }: { content: MandalaContent }) {
  const { zodiac, vedic } = content;
  const [active, setActive] = useState<ActiveState>({ sign: null, pinned: false });
  const [rotationDeg, setRotationDeg] = useState<number>(0);

  useEffect(() => {
    const target = active.pinned && active.sign ? signRotationDeg(active.sign) : 0;
    setRotationDeg((prev) => prev + shortestRotationDelta(prev, target));
  }, [active.pinned, active.sign]);

  useEffect(() => {
    const clearIfActive = () =>
      setActive((prev) =>
        prev.sign === null && !prev.pinned ? prev : { sign: null, pinned: false },
      );

    const handlePointer = (e: Event) => {
      const target = e.target as Element | null;
      // Keep the active sign when the pointer lands on a sector (to re-pin) or
      // anywhere inside the detail panel — selecting/copying the prose there must
      // not dismiss it. Only a genuine press *outside* the wheel clears.
      if (target?.closest("[data-wheel-sector],[data-wheel-detail-panel]")) return;
      clearIfActive();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearIfActive();
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const handleEnter = (sign: WheelSign) => {
    setActive((prev) => (prev.pinned ? prev : { sign, pinned: false }));
  };

  const handleLeave = (sign: WheelSign) => {
    setActive((prev) => {
      if (prev.pinned) return prev;
      if (prev.sign?.id !== sign.id) return prev;
      return { sign: null, pinned: false };
    });
  };

  const handleFocus = (sign: WheelSign) => {
    setActive((prev) => (prev.pinned ? prev : { sign, pinned: false }));
  };

  const handleBlur = (sign: WheelSign) => {
    setActive((prev) => {
      if (prev.pinned) return prev;
      if (prev.sign?.id !== sign.id) return prev;
      return { sign: null, pinned: false };
    });
  };

  const handleToggle = (sign: WheelSign) => {
    setActive((prev) => {
      if (prev.sign?.id === sign.id && prev.pinned) {
        return { sign, pinned: false };
      }
      return { sign, pinned: true };
    });
  };

  const activeId = active.sign?.id ?? null;

  return (
    <section
      id="simbolos"
      aria-labelledby="symbols-heading"
      className="relative px-6 py-28 sm:px-10 sm:py-36 lg:py-44"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="bg-terracotta/70 h-px w-24" aria-hidden="true" />

          <h2
            id="symbols-heading"
            className="display text-foreground mt-12 text-balance text-[clamp(1.7rem,3.2vw,2.4rem)] leading-[1.18] tracking-[-0.006em]"
          >
            Mandala dos <span className="display-italic text-terracotta-deep">signos</span>
          </h2>

          <p className="marginalia mt-5 max-w-[46ch]">
            Doze figuras pintadas, vinte e sete nakshatras, a Terra ao centro — um mapa de
            ressonâncias, não de previsões.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-16">
          <div className="mx-auto w-[min(48rem,90vw)] lg:mx-0">
            <div
              data-active={activeId ? "true" : "false"}
              data-pinned={active.pinned ? "true" : "false"}
              className="relative aspect-square w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.3,0,0.2,1)] motion-reduce:transition-none"
              style={{
                clipPath: "circle(50% at 50% 50%)",
                transform: `rotate(${rotationDeg}deg)`,
              }}
            >
              <svg
                viewBox={`0 0 ${WHEEL_VIEWBOX} ${WHEEL_VIEWBOX}`}
                className="absolute inset-0 h-full w-full"
              >
                <defs>
                  <filter id="wheel-desat">
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                      <feFuncR type="linear" slope="0.95" />
                      <feFuncG type="linear" slope="0.95" />
                      <feFuncB type="linear" slope="0.95" />
                    </feComponentTransfer>
                  </filter>
                  {WHEEL_ZODIAC.map((sign) => (
                    <clipPath key={sign.id} id={`wheel-clip-${sign.id}`}>
                      <path d={WHEEL_SECTOR_PATHS[sign.id]} />
                    </clipPath>
                  ))}
                </defs>

                <g
                  role="img"
                  aria-label="Mandala pintada com doze figuras zodiacais, vinte e sete nakshatras védicos e a Terra ao centro"
                >
                  <image
                    href="/art/wheel.jpg"
                    x="0"
                    y="0"
                    width={WHEEL_VIEWBOX}
                    height={WHEEL_VIEWBOX}
                    preserveAspectRatio="xMidYMid meet"
                    filter={activeId ? "url(#wheel-desat)" : undefined}
                    className="transition-[filter] duration-300 motion-reduce:transition-none"
                  />

                  {activeId ? (
                    <image
                      href="/art/wheel.jpg"
                      x="0"
                      y="0"
                      width={WHEEL_VIEWBOX}
                      height={WHEEL_VIEWBOX}
                      preserveAspectRatio="xMidYMid meet"
                      clipPath={`url(#wheel-clip-${activeId})`}
                    />
                  ) : null}
                </g>

                <g aria-label="Setores zodiacais">
                  {WHEEL_ZODIAC.map((sign) => {
                    const isActive = active.sign?.id === sign.id;
                    return (
                      <path
                        key={sign.id}
                        d={WHEEL_SECTOR_PATHS[sign.id]}
                        data-wheel-sector={sign.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`${sign.label}, ${sign.dateRange}`}
                        aria-pressed={isActive && active.pinned}
                        onMouseEnter={() => handleEnter(sign)}
                        onMouseLeave={() => handleLeave(sign)}
                        onFocus={() => handleFocus(sign)}
                        onBlur={() => handleBlur(sign)}
                        onClick={() => handleToggle(sign)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleToggle(sign);
                          }
                        }}
                        className="fill-transparent cursor-pointer outline-none transition-[stroke] duration-150 motion-reduce:transition-none focus-visible:stroke-terracotta-deep focus-visible:[stroke-width:3]"
                      />
                    );
                  })}
                </g>
              </svg>
            </div>

            <output
              aria-live="polite"
              className="display-italic text-terracotta-deep mt-5 block min-h-[1.7em] text-center text-[1.05rem]"
            >
              {active.sign ? `${active.sign.label} · ${active.sign.dateRange}` : " "}
            </output>
          </div>

          <WheelDetail sign={active.sign} pinned={active.pinned} zodiac={zodiac} vedic={vedic} />
        </div>

        <div hidden>
          {WHEEL_ZODIAC.map((sign) => {
            const z = zodiac[sign.id];
            const v = vedic[sign.id];
            return (
              <div key={sign.id} data-wheel-detail={sign.id}>
                <h3>{sign.label}</h3>
                <p>{sign.dateRange}</p>
                <dl>
                  <dt>Elemento</dt>
                  <dd>{z.element}</dd>
                  <dt>Modalidade</dt>
                  <dd>{z.modality}</dd>
                  <dt>Regente</dt>
                  <dd>{z.ruler}</dd>
                  <dt>Corpo</dt>
                  <dd>{z.bodyPart}</dd>
                  <dt>Arquétipo</dt>
                  <dd>{z.archetype}</dd>
                </dl>
                <p>{z.paragraph}</p>
                <h4>Tradição védica — três mansões lunares</h4>
                <dl>
                  {v.nakshatras.map((n) => (
                    <Fragment key={n.name}>
                      <dt>
                        {n.name}
                        {n.range ? ` (${n.range})` : ""}
                      </dt>
                      <dd>
                        Divindade: {n.deity}. Regente: {n.ruler}. Símbolo: {n.symbol}. {n.motif}
                      </dd>
                    </Fragment>
                  ))}
                </dl>
                <p>{v.paragraph}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type WheelDetailProps = {
  sign: WheelSign | null;
  pinned: boolean;
  zodiac: MandalaContent["zodiac"];
  vedic: MandalaContent["vedic"];
};

function WheelDetail({ sign, pinned, zodiac, vedic }: WheelDetailProps) {
  const content = sign ? zodiac[sign.id] : null;
  const vedicEntry = sign ? vedic[sign.id] : null;

  return (
    <aside
      aria-live="polite"
      aria-atomic="true"
      data-wheel-detail-panel
      data-pinned={pinned ? "true" : "false"}
      data-placeholder={content?._isPlaceholder ? "true" : undefined}
      data-vedic-placeholder={vedicEntry?._isPlaceholder ? "true" : undefined}
      className="mx-auto max-w-[52ch] lg:mx-0 lg:min-h-[44rem]"
    >
      {sign && content && vedicEntry ? (
        <>
          <h3 className="display text-foreground text-[clamp(1.4rem,2.6vw,1.9rem)] leading-[1.15] tracking-[-0.004em]">
            {sign.label}
          </h3>
          <p className="marginalia text-terracotta-deep mt-1">{sign.dateRange}</p>
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            <dt className="tracked-ink">Elemento</dt>
            <dd className="display-italic">{content.element}</dd>
            <dt className="tracked-ink">Modalidade</dt>
            <dd className="display-italic">{content.modality}</dd>
            <dt className="tracked-ink">Regente</dt>
            <dd className="display-italic">{content.ruler}</dd>
            <dt className="tracked-ink">Corpo</dt>
            <dd className="display-italic">{content.bodyPart}</dd>
            <dt className="tracked-ink">Arquétipo</dt>
            <dd className="display-italic">{content.archetype}</dd>
          </dl>
          <p className="body-italic text-ink mt-6 text-[1.06rem] leading-[1.75]">
            {content.paragraph}
          </p>

          <div className="bg-terracotta/40 mt-10 h-px w-12" aria-hidden="true" />
          <h4 className="tracked-ink text-foreground mt-8">Tradição védica</h4>
          <p className="marginalia mt-1">Três mansões lunares</p>

          <ul className="mt-6 space-y-5">
            {vedicEntry.nakshatras.map((n) => (
              <li key={n.name}>
                <p className="display-italic text-foreground text-[1.05rem] leading-[1.25]">
                  {n.name}
                  {n.range ? (
                    <span className="marginalia text-terracotta-deep"> ({n.range})</span>
                  ) : null}
                </p>
                <p className="marginalia mt-1">
                  {n.deity} · {n.ruler} · {n.symbol}
                </p>
                <p className="body-italic text-ink mt-1 text-[0.95rem] leading-[1.65]">{n.motif}</p>
              </li>
            ))}
          </ul>

          <p className="body-italic text-ink mt-6 text-[0.95rem] leading-[1.65]">
            {vedicEntry.paragraph}
          </p>
        </>
      ) : (
        <>
          <p className="marginalia max-w-[44ch] text-[1rem]">
            Passe o cursor — ou navegue com o teclado — por uma das doze figuras. Toque para fixar
            os detalhes.
          </p>
          <p className="marginalia mt-6">
            Cada signo abre, ao lado do seu retrato, um segundo capítulo védico — as
            <em> nakshatras </em>
            da tradição lunar indiana.
          </p>
        </>
      )}
    </aside>
  );
}
