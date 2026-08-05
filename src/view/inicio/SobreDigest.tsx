import type { Inicio } from "@/domain/inicio/Inicio";
import { RichTextProse } from "@/view/general/RichTextProse";
import { PageSection } from "./PageSection";
import { SectionHeading } from "./SectionHeading";
import { SectionLink } from "./SectionLink";

/**
 * Section 7 of CONCEPT §6 — four lines and the hook, enough to want to click
 * through to /sobre. Deliberately short: the full record, the formação and the
 * clinic's origin story belong to that page, and repeating them here would spend
 * the reason to go.
 */
export function SobreDigest({ content }: { content: Inicio["sobreDigest"] }) {
  return (
    <PageSection labelledBy="sobre-digest-heading">
      <SectionHeading id="sobre-digest-heading">{content.heading}</SectionHeading>

      <RichTextProse data={content.body} className="body-prose text-ink mt-8 max-w-[62ch]" />

      <SectionLink href="/sobre" className="mt-10">
        {content.linkLabel}
      </SectionLink>
    </PageSection>
  );
}
