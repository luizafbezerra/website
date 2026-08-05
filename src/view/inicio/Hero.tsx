import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { Inicio } from "@/domain/inicio/Inicio";
import { MediaPlaceholder } from "@/view/general/MediaPlaceholder";
import { RichTextProse } from "@/view/general/RichTextProse";
import { WhatsAppCta } from "@/view/general/WhatsAppCta";
import { SectionLink } from "./SectionLink";

const PORTRAIT_ASPECT = "4 / 5";

/**
 * The first screen (CONCEPT §6.1). Type-led, as §7.1 requires: the lockup and her
 * positioning sentence speak before any image does, and the portrait enters
 * beside them as _the person who receives you_ — editorially set, plate-like,
 * never a full-bleed marketing headshot.
 *
 * Desktop is an asymmetric spread — the reading column left at its natural
 * measure, the portrait in a narrower right column with a marginalia caption in
 * her voice. A manuscript page with its illumination, each side in one of the
 * site's two voices. Below `lg` it stacks, and the portrait follows the type
 * rather than filling the screen ahead of it.
 *
 * The compactness is a requirement, not a preference. CONCEPT §5's recognition
 * rule gives the page ~1.5 mobile screens to show a follower the three
 * signatures of the feed, and the mark is the only one the chrome supplies — so
 * every line here has to earn its height or the Instagram row never crests in
 * time.
 *
 * The `h1` carries the clinic name and her name together: it is the one place
 * the "por" lockup is stated at display scale, and it is the page's only `h1`
 * (REQ-006).
 */
export function Hero({ clinica, content }: { clinica: Clinica; content: Inicio["hero"] }) {
  const t = useTranslations("placeholder.slots");
  const inicio = useTranslations("inicio.hero");

  return (
    <section
      aria-labelledby="hero-heading"
      className="px-6 pt-32 pb-16 sm:px-10 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="lg:col-start-1">
          <h1
            id="hero-heading"
            className="display text-foreground text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.05] tracking-[-0.012em] text-balance"
          >
            {clinica.clinicName}
            <span className="tracked text-quill mt-4 block">
              {inicio("by", { name: clinica.fullName })}
            </span>
          </h1>

          {/* Her positioning sentence, verbatim — who, what, for whom and how far
              the practice reaches, in one line, in the first screen (REQ-006). */}
          <p className="display-italic text-ink-soft mt-8 text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.25] text-balance">
            {clinica.positioning}
          </p>

          <RichTextProse
            data={content.lead}
            className="body-prose dropcap text-ink mt-10 max-w-[60ch]"
          />

          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-baseline sm:gap-8">
            <WhatsAppCta clinica={clinica} label={content.ctaPrimaryLabel} />
            <SectionLink href="/primeira-conversa">{content.ctaSecondaryLabel}</SectionLink>
          </div>
        </div>

        {/* Until the shoot happens the slot holds a labeled frame (REQ-005): the
            casual selfie re-created the amateur register the site exists to
            leave, so it comes down rather than standing in. */}
        <figure className="w-[min(15rem,60%)] lg:col-start-2 lg:w-full lg:max-w-[22rem] lg:self-start">
          {content.portrait ? (
            <Image
              src={content.portrait.src}
              alt={content.portrait.alt || inicio("portraitAlt", { name: clinica.fullName })}
              width={content.portrait.width}
              height={content.portrait.height}
              priority
              sizes="(min-width: 1024px) 22rem, 15rem"
              className="vignette h-auto w-full select-none"
            />
          ) : (
            <MediaPlaceholder
              description={t("portrait")}
              note={t("portraitNote")}
              aspectRatio={PORTRAIT_ASPECT}
            />
          )}

          {/* Only once there is a face to caption. While the slot is a labeled
              frame the placeholder's own note already says what belongs there,
              and two lines of marginalia under an empty box is one more than the
              box deserves. */}
          {content.portrait && (
            <figcaption className="marginalia mt-4">{inicio("portraitCaption")}</figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}
