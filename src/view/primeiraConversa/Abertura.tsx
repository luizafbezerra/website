import { useTranslations } from "next-intl";
import type { PrimeiraConversa } from "@/domain/primeiraConversa/PrimeiraConversa";
import { RichTextProse } from "@/view/general/RichTextProse";
import { BILHETE_ANCHOR } from "./bilheteAnchor";

/**
 * The page's opening — its one `h1`, her lead, and the page's single drop cap.
 *
 * The lead is the whole AEO front-load (REQ-006): what a first conversation is,
 * how long it lasts, in which languages, from where, and at what commitment. A
 * visitor who reads nothing else on the page has still had their question
 * answered, and so has an assistant quoting the page back to someone.
 *
 * No portrait. `/sobre` is the page whose subject is the person; this page's
 * subject is the process, and a face here would answer a question nobody asked at
 * the cost of the first screen's height.
 *
 * The one affordance besides reading is a quiet jump to the notes at the foot of
 * the page. Somebody arrives here already decided — usually from a WhatsApp item
 * in the header they did not notice — and making them scroll past five sections to
 * write is friction disguised as narrative. It is a text link in the marginalia
 * voice, not a second call to action: the terracotta block belongs to the bilhete.
 */
export function Abertura({ content }: { content: PrimeiraConversa["abertura"] }) {
  const t = useTranslations("primeiraConversa");

  return (
    <section
      aria-labelledby="abertura-heading"
      className="px-6 pt-32 pb-16 sm:px-10 sm:pt-36 sm:pb-20 lg:pt-40"
    >
      <div className="mx-auto w-full max-w-3xl">
        <h1
          id="abertura-heading"
          className="display text-foreground text-[clamp(2rem,4vw,3.1rem)] leading-[1.12] tracking-[-0.005em] text-balance"
        >
          {content.heading}
        </h1>

        <RichTextProse
          data={content.lead}
          className="body-prose dropcap text-ink mt-10 max-w-[62ch]"
        />

        <p className="mt-10">
          <a
            href={`#${BILHETE_ANCHOR}`}
            className="marginalia text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta inline-flex items-baseline gap-2 underline decoration-1 underline-offset-[0.28em] transition-colors"
          >
            <span>{t("skipToBilhete")}</span>
            <span aria-hidden="true">↓</span>
          </a>
        </p>
      </div>
    </section>
  );
}
