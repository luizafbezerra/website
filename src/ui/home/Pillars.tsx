import { Luiza } from "@/core";
import { Ornament } from "./Ornament";
import { PaintedAsset, type PaintedAssetSrc } from "./PaintedAsset";

type Plate = {
  src: PaintedAssetSrc;
  label: string;
  caption: string;
};

const PLATES: Record<"I" | "II" | "III", Plate> = {
  I: {
    src: "winter-star",
    label: "Estrela de inverno.",
    caption: "A máscara arquetípica diante do centro imóvel.",
  },
  II: {
    src: "landscape-quaternity",
    label: "Paisagem alquímica.",
    caption: "Pequena quaternidade entre céu e terra.",
  },
  III: {
    src: "squared-mandala",
    label: "Mandala geométrica.",
    caption: "Quatro direções, centro de pétalas, orla terracota.",
  },
};

export function Pillars() {
  return (
    <section
      id="abordagem"
      aria-labelledby="approach-heading"
      className="px-6 py-28 sm:px-10 sm:py-36 lg:py-44"
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 sm:mb-20">
          <p className="tracked mb-5 text-center sm:text-left">Como trabalho</p>
          <h2
            id="approach-heading"
            className="display text-foreground text-balance text-center text-[clamp(1.95rem,3.8vw,2.75rem)] leading-[1.13] tracking-[-0.008em] sm:text-left"
          >
            Sonhos, símbolos e o caminho de{" "}
            <span className="display-italic text-terracotta-deep">individuação</span>.
          </h2>

          <div className="body-prose dropcap text-ink mt-10 max-w-[60ch] text-[1.085rem] leading-[1.74]">
            <p>
              Tomo a sério aquilo que se manifesta em sonhos, fantasias, imagens recorrentes e
              sintomas. Eles não são ruído: são as maneiras pelas quais a psique fala sobre o que
              ainda não cabe em palavras.
            </p>
            <p>
              No trabalho clínico, isso aparece como uma escuta lenta, uma atenção a tudo o que se
              repete, e uma curiosidade pelo que está por trás daquilo que dói. Não trato de remover
              sintomas com pressa: ajudo a entender o que eles vieram dizer, para que o caminho à
              frente seja escolhido — e não apenas suportado.
            </p>
          </div>
        </header>

        <Ornament variant="trinity" className="mb-20 sm:mb-24" />

        <div className="mb-14 sm:mb-20">
          <p className="display-italic text-quill max-w-[58ch] text-[1.02rem] leading-[1.7]">
            Três frentes que costumam trazer alguém para a análise — quase sempre se cruzam, e a
            escuta começa por onde dói mais agora.
          </p>
        </div>

        <ol className="space-y-32 sm:space-y-40">
          {Luiza.pillars.map((pillar) => {
            const plate = PLATES[pillar.numeral];
            return (
              <li key={pillar.numeral} className="group">
                <article className="relative">
                  <figure className="mx-auto mb-12 block max-w-[22rem] sm:mx-0 sm:mb-14">
                    <PaintedAsset
                      src={plate.src}
                      width={520}
                      height={520}
                      sizes="22rem"
                      className="block w-full"
                    />
                    <figcaption className="marginalia mt-5 text-center sm:text-left">
                      <span className="display-italic text-terracotta-deep">{plate.label}</span>{" "}
                      {plate.caption}
                    </figcaption>
                  </figure>

                  <span
                    aria-hidden="true"
                    className="display-italic text-terracotta-deep float-left mr-3 -mt-2 -ml-1 select-none text-[clamp(4rem,8vw,7rem)] leading-[0.82] tracking-[-0.02em] sm:mr-5 sm:-ml-2"
                  >
                    {pillar.numeral}
                  </span>
                  <h3 className="display text-foreground text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.18] tracking-[-0.005em]">
                    {pillar.title}
                  </h3>
                  <p className="text-ink mt-5 max-w-[58ch] text-[1.06rem] leading-[1.74]">
                    {pillar.paragraph}
                  </p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
