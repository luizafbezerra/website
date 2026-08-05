import type { Analise } from "@/domain/analise/Analise";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { MandalaWheel } from "./MandalaWheel";

/**
 * Section 4 of CONCEPT §6 — the painted wheel, this page's one wow.
 *
 * The heading and the intro are hers, from the CMS, and they are server-rendered
 * prose; only the wheel itself needs a client boundary. The intro carries the
 * whole policy in her own voice: the signs are vocabulary for naming what someone
 * is living, never a prediction and never a reading of the person looking
 * (CONCEPT §11, DESIGN §6's ban on predictive language).
 *
 * `id="mandala"` rather than the retired page's `id="simbolos"`. `/simbolos` still
 * 308s here, and a stale fragment simply lands at the top of `/analise`, which is
 * where a visitor arriving from a route that no longer exists should land: the
 * page's opening answers them. An id named after a deleted address is a name the
 * next reader has to decode.
 *
 * `tone="deep"` — one of this page's two tonal events (the other is the terminal
 * ask). The wheel is a saturated painted asset, and a deeper parchment is what
 * separates a set-piece from the plate two sections above it; on plain parchment
 * the two would read as the same kind of thing.
 */
export function Mandala({ content }: { content: Analise["mandala"] }) {
  return (
    <PageSection id="mandala" labelledBy="mandala-heading" tone="deep" width="wide">
      <SectionHeading id="mandala-heading">{content.heading}</SectionHeading>

      <p className="body-prose text-ink mt-8 max-w-[62ch]">{content.intro}</p>

      <MandalaWheel readings={content.readings} />
    </PageSection>
  );
}
