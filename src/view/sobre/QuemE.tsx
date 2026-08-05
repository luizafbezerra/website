import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { Sobre } from "@/domain/sobre/Sobre";
import { MediaPlaceholder } from "@/view/general/MediaPlaceholder";
import { PageSection } from "@/view/general/PageSection";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";

const PORTRAIT_ASPECT = "4 / 5";

/**
 * Section 2 of CONCEPT §6 — the person, in her own first person, and the page's
 * one image moment.
 *
 * The portrait is this page's image at plate scale (CONCEPT §7.1: "the portrait
 * enters as _the person who receives you_ — editorially set, plate-like, never a
 * full-bleed marketing headshot"). It sits **before** her prose and after the
 * heading, at a modest width inside the reading column: the face arrives early
 * because meeting her is the section's whole job, and it stays inside the column
 * so the body below keeps its 60–72ch measure instead of being squeezed into a
 * side-by-side grid.
 *
 * Until the shoot happens the slot is a labeled frame (REQ-005) reusing the
 * site's own portrait strings — the same words Início's hero slot uses, because
 * it is the same missing asset and two different descriptions of one photograph
 * would read as two photographs. The casual selfie does not stand in.
 *
 * No caption. Início's hero captions the portrait "quem recebe você"; here the
 * heading, the prose and the page itself already say it, and a caption repeating
 * the page's thesis under her face would be the third time in one scroll.
 */
export function QuemE({ clinica, content }: { clinica: Clinica; content: Sobre["quemE"] }) {
  const t = useTranslations("placeholder.slots");
  const sobre = useTranslations("sobre.quemE");

  return (
    <PageSection labelledBy="quem-e-heading">
      <SectionHeading id="quem-e-heading">{content.heading}</SectionHeading>

      <div className="mt-12 w-[min(20rem,70%)]">
        {content.portrait ? (
          <Image
            src={content.portrait.src}
            alt={content.portrait.alt || sobre("portraitAlt", { name: clinica.fullName })}
            width={content.portrait.width}
            height={content.portrait.height}
            priority
            sizes="20rem"
            className="vignette h-auto w-full select-none"
          />
        ) : (
          <MediaPlaceholder
            description={t("portrait")}
            note={t("portraitNote")}
            aspectRatio={PORTRAIT_ASPECT}
          />
        )}
      </div>

      <RichTextProse data={content.body} className="body-prose text-ink mt-12 max-w-[62ch]" />
    </PageSection>
  );
}
