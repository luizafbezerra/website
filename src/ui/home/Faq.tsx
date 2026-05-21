import { Ornament } from "./Ornament";

type Entry = {
  question: string;
  answer: string;
};

type Props = {
  entries: ReadonlyArray<Entry>;
};

export function Faq({ entries }: Props) {
  if (entries.length === 0) return null;

  return (
    <section
      id="perguntas"
      aria-labelledby="faq-heading"
      className="bg-parchment relative px-6 py-28 sm:px-10 sm:py-36 lg:py-44"
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-16 sm:mb-20">
          <p className="tracked mb-5 text-center sm:text-left">Perguntas frequentes</p>
          <h2
            id="faq-heading"
            className="display text-foreground text-balance text-center text-[clamp(1.9rem,3.6vw,2.65rem)] leading-[1.14] tracking-[-0.008em] sm:text-left"
          >
            Antes de uma{" "}
            <span className="display-italic text-terracotta-deep">primeira conversa</span>.
          </h2>
        </header>

        <dl className="space-y-14 sm:space-y-16">
          {entries.map((entry, idx) => (
            <div key={entry.question}>
              <dt className="display text-foreground text-[clamp(1.2rem,2vw,1.45rem)] leading-[1.22] tracking-[-0.004em]">
                <span aria-hidden="true" className="display-italic text-terracotta-deep mr-3">
                  {idx + 1}.
                </span>
                {entry.question}
              </dt>
              <dd className="text-ink mt-4 max-w-[58ch] text-[1.05rem] leading-[1.72]">
                {entry.answer}
              </dd>
              {idx < entries.length - 1 ? (
                <Ornament variant="rule" className="mt-14 sm:mt-16" />
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
