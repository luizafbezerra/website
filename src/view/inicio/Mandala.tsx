import type { Inicio } from "@/domain/inicio/Inicio";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { MandalaWheel } from "./MandalaWheel";

/**
 * The painted wheel — the twelfth section of Início, and the first of its two
 * wow surfaces. It sits after Contato and immediately above the Cosmos, so the
 * grammar the home already had is preserved: nothing spectacular stands between
 * a visitor and the ask, and whoever scrolls past it gets the wonder as the
 * page's farewell.
 *
 * The heading and the intro are hers, from the CMS, and they are server-rendered
 * prose; only the wheel itself needs a client boundary. The intro carries the
 * whole policy in her own voice: the signs are vocabulary for naming what someone
 * is living, never a prediction and never a reading of the person looking
 * (CONCEPT §11, DESIGN §6's ban on predictive language).
 *
 * `id="mandala"` — the name it had on `/analise`, kept so the fragment survives
 * the move. It is also where `/simbolos` now lands.
 *
 * **No `tone="deep"`, unlike on `/analise`.** This page already spends both of
 * DESIGN §4's tonal events, on Brasil e exterior and on Contato — and Contato is
 * the band directly above. A deep wheel would fuse with it into one long deep
 * stretch and separate nothing. On plain parchment the saturated painting is
 * doing the separating on its own, against the deep band it follows.
 */
export function Mandala({ content }: { content: Inicio["mandala"] }) {
  return (
    <PageSection id="mandala" labelledBy="mandala-heading" width="wide">
      <SectionHeading id="mandala-heading">{content.heading}</SectionHeading>

      <p className="body-prose text-ink mt-8 max-w-[62ch]">{content.intro}</p>

      <MandalaWheel readings={content.readings} />
    </PageSection>
  );
}
