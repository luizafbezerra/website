import { useTranslations } from "next-intl";
import type { OrientacaoProfissional } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PageSection } from "@/view/general/PageSection";
import { Plate } from "@/view/general/Plate";
import { RichTextProse } from "@/view/general/RichTextProse";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

const PLATE_ASPECT = "3 / 2";

/**
 * Section 4 of CONCEPT §6 — the honest comparison, and the section on which this
 * page is actually decided: a licensed psychologist bound by a professional code,
 * tests *inside* a guided psychological process rather than a result mailed to you,
 * and vocation read in depth. It is also the page's one Jungian anchor.
 *
 * **It is not a comparison table, and that is a design decision rather than an
 * omission.** A competitor column with checkmarks is the SaaS pattern DESIGN bans
 * twice over (cards-everywhere grids, and the anti-reference list's "feature
 * comparison"), and it would put words in a coach's mouth to score them. So the
 * section states only what *she* does and lets the difference land. Each distinction
 * is a paragraph of body prose opening on a **rubricated** phrase — real manuscript
 * practice, terracotta on parchment, and the one place on this page where the accent
 * appears in running text. `terracotta-deep` rather than `terracotta`: at body size
 * on `parchment-deep` the lighter pigment lands near 4.1:1, under the 4.5:1 floor
 * PRODUCT sets, and a differentiator nobody can read differentiates nothing.
 *
 * The rubrication is also why these are paragraphs and not a `<dl>` of title/text
 * pairs: two sections earlier "para quem" already uses titled blocks, and repeating
 * that shape here would turn an argument into a second list of features. Flowing
 * prose with no rules between the items says these three are one case.
 *
 * **Tone.** This is one of the page's two `deep` sections (the ask is the other) —
 * the page carries no wow set-piece, because the only symbol its own vocabulary
 * suggests is the forbidden one (CON-006: no zodiac imagery here, a wheel beside
 * psychological tests would read as predictive assessment). A tonal event is what
 * marks the decisive section instead, and DESIGN allows exactly two per page.
 *
 * **The plate closes the section.** CONCEPT §12 suggests a painted crossroads or
 * labyrinth, and the labyrinth is fair Jungian vocabulary (§9.10) — so the page's
 * one painting sits beside its one Jungian sentence, which is amplificação doing its
 * actual job. It lands here rather than earlier because a full editorial painting
 * between "is this me?" and "what do I get?" would delay exactly the answer this
 * page's reader came for. Until her painting is chosen and its provenance verified
 * the slot is a labeled frame (REQ-005); a vector crossroads would invert the idea
 * into the generated ornament DESIGN bans.
 */
export function NemCoaching({ content }: { content: OrientacaoProfissional["nemCoaching"] }) {
  const t = useTranslations("orientacaoProfissional.plate");
  const { plate } = content;

  // A gallery label needs both the hand and the work; a lone painter names nothing.
  const caption =
    plate.painter && plate.workTitle
      ? { painter: plate.painter, title: plate.workTitle, year: plate.year ?? undefined }
      : null;

  return (
    <PageSection id="nem-coaching" labelledBy="nem-coaching-heading" tone="deep">
      <SectionHeading id="nem-coaching-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[60ch]" />

      <ul className="mt-12 space-y-9">
        {content.distinctions.map((distinction) => (
          <li key={distinction.title} className="body-prose text-ink max-w-[58ch]">
            <span className="display-italic text-terracotta-deep">{distinction.title}</span>{" "}
            {distinction.text}
          </li>
        ))}
      </ul>

      {content.anchor && (
        <p className="display-italic text-ink-soft mt-16 max-w-[44ch] text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.35]">
          {content.anchor}
        </p>
      )}

      {/* The bridge to /analise, folded in as this section's close (2026-08
          condensation — it no longer holds a band of its own). The craft is
          restraint: one paragraph, a quiet hand-off, no second call to action.
          A visitor who discovers their question was the other one should read
          this as permission, not as a more expensive product being offered. */}
      {content.bridge.body && (
        <p className="body-prose text-ink mt-14 max-w-[58ch]">{content.bridge.body}</p>
      )}

      {content.bridge.linkLabel && (
        <SectionLink href="/analise" className="mt-8">
          {content.bridge.linkLabel}
        </SectionLink>
      )}

      <Plate
        image={plate.image}
        caption={caption}
        placeholder={t("placeholder")}
        placeholderNote={t("placeholderNote")}
        aspectRatio={PLATE_ASPECT}
      />
    </PageSection>
  );
}
