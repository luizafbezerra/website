"use client";

import type { NightSky } from "@/domain/cosmos/nightSky";
import type { Inicio } from "@/domain/inicio/Inicio";
import { useMotionAllowed } from "@/view/general/useMotionAllowed";
import { useWideViewport } from "@/view/general/useWideViewport";
import { Cosmos } from "@/view/cosmos/Cosmos";
import { CeuDestaNoite } from "@/view/cosmos/CeuDestaNoite";

/**
 * Section 11 of CONCEPT §6 — the page's one wow, and the boundary that decides
 * which one it is. It closes the page, after the ask: the visitor deciding
 * whether to write never crosses a scroll-pinned scene on the way to the CTA,
 * and the one who stays past it leaves through wonder.
 *
 * The Cosmos owns the slot where there is room and motion is welcome; everywhere
 * else O céu desta noite does. The rule DESIGN sets is that a desktop-only
 * set-piece gets a *designed substitute*, never a hidden hole — so this
 * component's contract is that it always renders one of the two.
 *
 * The choice is made here rather than in CSS because `hidden` still mounts what
 * it hides: a phone would download and run a WebGL scene it will never see. One
 * boundary picking one child is the only form of "never both" that is true of
 * the DOM and not just of the screen.
 *
 * Before hydration both hooks report their closed value, so the server renders
 * the chart — a complete section of real content, and the correct sky, because
 * it was computed on the server for this render. A capable client then upgrades
 * to the Cosmos. The one case that renders nothing is a visitor who has
 * explicitly dismissed the Cosmos forever: that is their stated choice, it
 * persists in their own browser, and the footer offers it back.
 */
export function WowSlot({ content, sky }: { content: Inicio["cosmos"]; sky: NightSky }) {
  const motionAllowed = useMotionAllowed();
  const wide = useWideViewport();

  if (wide && motionAllowed) return <Cosmos />;

  return <CeuDestaNoite sky={sky} caption={content.caption} />;
}
