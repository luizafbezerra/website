"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  WHEEL_SECTOR_PATHS,
  WHEEL_VIEWBOX,
  WHEEL_ZODIAC,
  shortestRotationDelta,
  signRotationDeg,
  type WheelSign,
} from "@/core/wheel";
import { VEDIC_CONTENT, ZODIAC_CONTENT } from "@/core/zodiacContent";
import { cn } from "@/lib";

type ActiveState = { sign: WheelSign | null; pinned: boolean };

export function Symbols() {
  const [active, setActive] = useState<ActiveState>({ sign: null, pinned: false });
  const [displayedSign, setDisplayedSign] = useState<WheelSign | null>(null);
  const [visible, setVisible] = useState<boolean>(true);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const target = active.pinned && active.sign ? signRotationDeg(active.sign) : 0;
    setRotationDeg((prev) => prev + shortestRotationDelta(prev, target));
  }, [active.pinned, active.sign]);

  useEffect(() => {
    if (swapTimer.current) clearTimeout(swapTimer.current);
    if (active.sign?.id === displayedSign?.id) {
      setVisible(true);
      return;
    }
    setVisible(false);
    swapTimer.current = setTimeout(() => {
      setDisplayedSign(active.sign);
      setVisible(true);
    }, 160);
    return () => {
      if (swapTimer.current) clearTimeout(swapTimer.current);
    };
  }, [active.sign, displayedSign]);

  useEffect(() => {
    const clearIfActive = () =>
      setActive((prev) =>
        prev.sign === null && !prev.pinned ? prev : { sign: null, pinned: false },
      );

    const handlePointer = (e: Event) => {
      const target = e.target as Element | null;
      if (target?.closest("[data-wheel-sector]")) return;
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

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-[auto_1fr] lg:gap-16">
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
              {displayedSign ? `${displayedSign.label} · ${displayedSign.dateRange}` : " "}
            </output>
          </div>

          <WheelDetail sign={displayedSign} pinned={active.pinned} visible={visible} />
        </div>

        <div hidden>
          {WHEEL_ZODIAC.map((sign) => {
            const content = ZODIAC_CONTENT[sign.id];
            const vedic = VEDIC_CONTENT[sign.id];
            return (
              <div key={sign.id} data-wheel-detail={sign.id}>
                <h3>{sign.label}</h3>
                <p>{sign.dateRange}</p>
                <dl>
                  <dt>Elemento</dt>
                  <dd>{content.element}</dd>
                  <dt>Modalidade</dt>
                  <dd>{content.modality}</dd>
                  <dt>Regente</dt>
                  <dd>{content.ruler}</dd>
                  <dt>Corpo</dt>
                  <dd>{content.bodyPart}</dd>
                  <dt>Arquétipo</dt>
                  <dd>{content.archetype}</dd>
                </dl>
                <p>{content.paragraph}</p>
                <h4>Tradição védica — três mansões lunares</h4>
                <dl>
                  {vedic.nakshatras.map((n) => (
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
                <p>{vedic.paragraph}</p>
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
  visible: boolean;
};

function WheelDetail({ sign, pinned, visible }: WheelDetailProps) {
  const content = sign ? ZODIAC_CONTENT[sign.id] : null;
  const vedic = sign ? VEDIC_CONTENT[sign.id] : null;

  return (
    <aside
      aria-live="polite"
      aria-atomic="true"
      data-pinned={pinned ? "true" : "false"}
      data-placeholder={content?._isPlaceholder ? "true" : undefined}
      data-vedic-placeholder={vedic?._isPlaceholder ? "true" : undefined}
      className={cn(
        "mx-auto max-w-[52ch] lg:mx-0 lg:min-h-[34rem]",
        "transition-opacity duration-200 ease-out motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {sign && content && vedic ? (
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
            {vedic.nakshatras.map((n) => (
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
            {vedic.paragraph}
          </p>
        </>
      ) : (
        <>
          <p className="body-italic text-ink text-[1.06rem] leading-[1.75]">
            Doze signos do zodíaco ocidental encontram aqui as vinte e sete nakshatras da tradição
            védica, dispostas em torno da Terra. Não é instrumento de previsão; é um mapa simbólico
            — um modo de imaginar como o psiquismo coletivo se organiza em padrões de ressonância,
            arquétipos que cada análise reencontra à sua maneira.
          </p>
          <p className="body-italic text-ink mt-4 text-[1.06rem] leading-[1.75]">
            O anel externo recolhe as vinte e sete <em>nakshatras</em> — as &ldquo;mansões
            lunares&rdquo; da astronomia védica indiana. Onde o zodíaco ocidental conta o ano pelo
            Sol, as nakshatras o contam pela Lua.
          </p>
          <p className="marginalia mt-6">
            Passe o cursor — ou navegue com o teclado — por uma das doze figuras. Toque para fixar
            os detalhes.
          </p>
          <p className="marginalia mt-4">
            Cada signo abre, ao lado de seu retrato, um segundo capítulo védico.
          </p>
        </>
      )}
    </aside>
  );
}
