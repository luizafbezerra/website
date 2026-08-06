import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { Sobre } from "@/domain/sobre/Sobre";
import { MediaPlaceholder } from "@/view/general/MediaPlaceholder";
import { PageSection } from "@/view/general/PageSection";

const SIGNATURE_ASPECT = "5 / 2";

/**
 * Section 5 of CONCEPT §6 — her signature closes the page.
 *
 * A letter's ending, in that order: one last line in her voice, then her hand.
 * The line is set in Cardo italic at Title scale — the same treatment the three
 * permissions get on /primeira-conversa, because it is the same gesture: Luiza
 * speaking directly, briefly, and then stopping (DESIGN's Two-Voices and
 * Italic-Is-Voice rules).
 *
 * There is no heading. You do not title a signature, and the global has no field
 * for one; the closing line labels the section instead, which is valid ARIA and
 * spends no invented copy on scaffolding a visitor did not ask for.
 *
 * While the scan does not exist the slot is a labeled frame (REQ-005) — and this
 * is the slot where that policy matters most. A signature set in a script face,
 * or drawn as an SVG, is exactly the "vector stand-in for a painted asset" DESIGN
 * §6 bans: it would forge, in her name, the one mark on the site that is supposed
 * to be hers alone.
 *
 * Nothing follows this section — no CTA, no second ask. That is CONCEPT §6's own
 * section list, and it is also the point: the page ends the way a letter does.
 *
 * A `beat`, because that is what a letter's signature is: it sits under the
 * closing line rather than standing apart from it, and the footer's own rule does
 * the separating below.
 */
export function Assinatura({
  clinica,
  content,
}: {
  clinica: Clinica;
  content: Sobre["assinatura"];
}) {
  const t = useTranslations("sobre.assinatura");

  return (
    <PageSection labelledBy="assinatura-line" pace="beat">
      <p
        id="assinatura-line"
        className="display-italic text-ink-soft max-w-[38ch] text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.3]"
      >
        {content.closingLine}
      </p>

      <div className="mt-12 w-full max-w-[24rem]">
        {content.image ? (
          <Image
            src={content.image.src}
            alt={content.image.alt || t("alt", { name: clinica.fullName })}
            width={content.image.width}
            height={content.image.height}
            sizes="24rem"
            className="h-auto w-full select-none"
          />
        ) : (
          <MediaPlaceholder
            description={t("placeholder")}
            note={t("placeholderNote")}
            aspectRatio={SIGNATURE_ASPECT}
          />
        )}
      </div>
    </PageSection>
  );
}
