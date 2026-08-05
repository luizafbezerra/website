import type { OrientacaoProfissional } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";

/**
 * Section 5 of CONCEPT §6 — the bridge to /analise for somebody who came through
 * the wrong door.
 *
 * The whole craft here is restraint, because the section is one sentence away from
 * being an upsell. So: no heading above the fold's weight, one short paragraph, no
 * plate, no ornament, no second call to action, and it ends by handing over rather
 * than by asking for anything. CONCEPT §4's boundary is a routing instruction —
 * _sentido do trabalho → análise · qual profissão → orientação_ — and a visitor who
 * discovers their question was the other one should read that as permission, not as
 * a more expensive product being offered.
 *
 * Its brevity is the argument: the shortest section on the page is the one that
 * stands to gain the most from being longer.
 */
export function PerguntaMaisFunda({
  content,
}: {
  content: OrientacaoProfissional["perguntaMaisFunda"];
}) {
  return (
    <PageSection id="pergunta-mais-funda" labelledBy="pergunta-mais-funda-heading">
      <SectionHeading id="pergunta-mais-funda-heading">{content.heading}</SectionHeading>

      <p className="body-prose text-ink mt-8 max-w-[58ch]">{content.body}</p>

      {content.linkLabel && (
        <SectionLink href="/analise" className="mt-10">
          {content.linkLabel}
        </SectionLink>
      )}
    </PageSection>
  );
}
