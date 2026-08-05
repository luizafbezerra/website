"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useFormatter, useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import type { Inicio } from "@/domain/inicio/Inicio";
import type { InstagramPost } from "@/domain/instagram/InstagramPost";
import { InstagramGlyph } from "@/view/general/InstagramGlyph";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { cn } from "@/view/styling/cn";
import { captionLabel, splitCaption } from "./instagramCaption";
import { InstagramTile, type PrintSlot, type ResponsiveSlot } from "./InstagramTile";

/**
 * Section 3 of CONCEPT §6 — the bridge between the gallery and the house.
 *
 * The latest posts hang like small framed prints around the one on the desk:
 * one post holds the center at reading size, the others drift gently at fixed
 * slots around it, joined to the center by hairlines. Choosing a print sends it
 * to the center — the two prints trade slots and the reading column re-sets
 * itself with that post's date and caption, the opening sentence in Cardo
 * italic. The column, not the image, carries the words: the feed burns her
 * captions into the picture; the house typesets them.
 *
 * Movement is plain CSS transitions on the slot coordinates. View Transitions
 * were considered and rejected: they snapshot elements, which freezes the idle
 * drift mid-frame for the duration of every swap.
 *
 * One constellation serves every screen: phones get the same prints on a
 * tighter slot geometry — the focused print anchoring the middle, satellites
 * ringed around it at thumb size — with the reading column flowing below.
 * Cursor gravity stays a fine-pointer affair; touch never mounts it.
 *
 * The posts are her live feed, not a curated list — the latest six, fetched
 * hourly, with nothing for her to maintain. The heading and the intro stay
 * CMS-editable, because those are her words about the section rather than its
 * contents.
 *
 * **With no posts the section does not exist.** A dead token or a Meta outage
 * hides it, and the page reads as if the bridge was never part of the design —
 * which is the only honest empty state for a section whose whole content is her
 * live feed. There is no placeholder to ship: the feed is either there or it
 * isn't.
 */

/**
 * Slot 0 is the desk; the rest hang around it, clear of one another and of the
 * reading column at every width the canvas renders at. Each slot carries both
 * geometries: the desktop spread and the phone cluster, where the center
 * print anchors the middle and the satellites ring it at thumb size (72–80px,
 * above the 44px touch minimum). The `vw` bounds keep narrow phones from
 * letting prints collide. The coordinates are design decisions, not derived
 * values — tune them by eye, on the page.
 */
const SLOTS: ResponsiveSlot[] = [
  { lg: { x: 62, y: 52, w: "17rem" }, sm: { x: 50, y: 52, w: "min(11rem, 46vw)" } },
  { lg: { x: 14, y: 18, w: "7.5rem" }, sm: { x: 12, y: 12, w: "min(5rem, 21vw)" } },
  { lg: { x: 44, y: 10, w: "6rem" }, sm: { x: 88, y: 14, w: "min(4.75rem, 20vw)" } },
  { lg: { x: 10, y: 58, w: "6.75rem" }, sm: { x: 11, y: 52, w: "min(4.5rem, 19vw)" } },
  { lg: { x: 26, y: 86, w: "7.25rem" }, sm: { x: 13, y: 88, w: "min(5rem, 21vw)" } },
  { lg: { x: 89, y: 13, w: "5.5rem" }, sm: { x: 87, y: 86, w: "min(4.5rem, 19vw)" } },
];

/**
 * How far a print will lean toward the cursor, at most (px). The whole gesture
 * is an intention, not an attraction: at arm's length it is a few pixels, and
 * even under the cursor the print barely leaves its slot.
 */
const GRAVITY_PULL = 10;

/**
 * Beyond this distance from a print's center the cursor has no pull (px).
 * About one print's width of reach: the cursor draws the print it is
 * approaching, not its neighbours.
 */
const GRAVITY_RADIUS = 140;

/**
 * Per-frame fraction of the remaining distance a print closes — roughly
 * three-quarters of a second to settle. Quick enough that the lean is felt
 * while the cursor is still there, slow enough that it never tracks the
 * pointer one-to-one.
 */
const GRAVITY_LERP = 0.05;

/** Position in the reading column's arrival order. */
const stagger = (index: number) => ({ "--stagger": index }) as CSSProperties;

/** The hairlines joining every occupied satellite slot to the desk. */
function ConstellationLines({
  slots,
  count,
  className,
}: {
  slots: PrintSlot[];
  count: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {slots.slice(1, count).map((slot) => (
        <line
          key={`${slot.x}-${slot.y}`}
          x1={slots[0].x}
          y1={slots[0].y}
          x2={slot.x}
          y2={slot.y}
          className="stroke-rule"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          opacity={0.55}
        />
      ))}
    </svg>
  );
}

export function InstagramBridge({
  clinica,
  content,
  posts,
}: {
  clinica: Clinica;
  content: Inicio["instagram"];
  posts: InstagramPost[];
}) {
  const t = useTranslations("inicio.instagram");
  const format = useFormatter();

  const shown = posts.slice(0, SLOTS.length);

  // slotByPost[i] is the slot post i occupies; slot 0 is the focused one.
  const [slotByPost, setSlotByPost] = useState<number[]>(() => shown.map((_, i) => i));

  const canvasRef = useRef<HTMLDivElement>(null);
  const printsRef = useRef(new Map<number, HTMLLIElement>());

  // Cursor gravity: satellites lean a few pixels toward a pointer that comes
  // near, and settle back when it leaves. Imperative on purpose — this writes
  // transforms at frame rate, which React state should never mediate. The
  // focused print (`data-focused`) is left alone: the one on the desk holds
  // still. Skipped entirely without a fine pointer or under reduced motion.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const offsets = new Map<HTMLLIElement, { x: number; y: number }>();
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;

    const step = () => {
      let moving = pointer !== null;

      for (const print of printsRef.current.values()) {
        let targetX = 0;
        let targetY = 0;

        if (pointer && print.dataset.focused === undefined) {
          // The li's rect is the slot position — gravity translates a child,
          // so reading the parent never feeds the pull back into itself.
          const rect = print.getBoundingClientRect();
          const dx = pointer.x - (rect.left + rect.width / 2);
          const dy = pointer.y - (rect.top + rect.height / 2);
          const distance = Math.hypot(dx, dy);

          if (distance > 1 && distance < GRAVITY_RADIUS) {
            // Squared falloff: the pull fades in and out at the edge of range
            // rather than switching on, which is what makes it read as weight.
            const nearness = 1 - distance / GRAVITY_RADIUS;
            const pull = nearness * nearness * GRAVITY_PULL;
            targetX = (dx / distance) * pull;
            targetY = (dy / distance) * pull;
          }
        }

        const offset = offsets.get(print) ?? { x: 0, y: 0 };
        offset.x += (targetX - offset.x) * GRAVITY_LERP;
        offset.y += (targetY - offset.y) * GRAVITY_LERP;
        offsets.set(print, offset);

        if (Math.abs(offset.x) + Math.abs(offset.y) > 0.1) moving = true;

        const gravity = print.firstElementChild as HTMLElement | null;
        if (gravity) gravity.style.translate = `${offset.x}px ${offset.y}px`;
      }

      frame = moving ? requestAnimationFrame(step) : 0;
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      wake();
    };
    const onLeave = () => {
      pointer = null;
      wake();
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const focusPost = (index: number) => {
    setSlotByPost((prev) => {
      if (prev[index] === 0) return prev;

      // The chosen print and the focused one trade slots, so every other print
      // stays where it hangs — the calmest rearrangement that exists.
      const next = [...prev];
      next[prev.indexOf(0)] = prev[index];
      next[index] = 0;
      return next;
    });
  };

  if (shown.length === 0) return null;

  const focusedPost = shown[slotByPost.indexOf(0)];
  const caption = splitCaption(focusedPost.caption);
  const postDate = (post: InstagramPost) =>
    format.dateTime(new Date(post.timestamp), { day: "numeric", month: "long" });
  const postLabel = (post: InstagramPost, index: number) =>
    captionLabel(post.caption) ?? t("tileFallbackLabel", { number: index + 1 });

  return (
    <PageSection labelledBy="instagram-heading" width="wide">
      <SectionHeading id="instagram-heading">{content.heading}</SectionHeading>

      {content.intro && <p className="body-prose text-ink mt-8 max-w-[60ch]">{content.intro}</p>}

      <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-center lg:gap-14">
        {/* The constellation — the phone cluster and the desktop spread are the
            same prints on different slot geometry, so the hairlines come in one
            SVG per breakpoint. */}
        <div
          ref={canvasRef}
          className="relative h-[22rem] [--instagram-float-scale:0.55] lg:h-[34rem] lg:[--instagram-float-scale:1]"
        >
          <ConstellationLines
            slots={SLOTS.map((slot) => slot.sm)}
            count={shown.length}
            className="lg:hidden"
          />
          <ConstellationLines
            slots={SLOTS.map((slot) => slot.lg)}
            count={shown.length}
            className="hidden lg:block"
          />

          <ul className="absolute inset-0">
            {shown.map((post, index) => (
              <InstagramTile
                key={post.id}
                post={post}
                slot={SLOTS[slotByPost[index]]}
                slotNumber={slotByPost[index]}
                isFocused={slotByPost[index] === 0}
                label={postLabel(post, index)}
                onFocus={() => focusPost(index)}
                printRef={(el) => {
                  if (el) printsRef.current.set(index, el);
                  else printsRef.current.delete(index);
                }}
              />
            ))}
          </ul>
        </div>

        {/* The reading column — her words, out of the image and onto the page. */}
        <div aria-live="polite" className="mt-10 lg:mt-0">
          <div key={focusedPost.id} className="instagram-caption-swap">
            <p className="tracked" style={stagger(0)}>
              <span className="text-terracotta">{postDate(focusedPost)}</span>
              {" · "}
              {clinica.instagramHandle}
            </p>

            {caption?.lede && (
              <p
                className="display text-ink mt-6 text-[clamp(1.35rem,2vw,1.7rem)] leading-[1.32] italic text-pretty"
                style={stagger(1)}
              >
                {caption.lede}
              </p>
            )}
            {caption?.body && (
              <p
                className={cn("text-ink-soft max-w-[48ch]", caption.lede ? "mt-4" : "mt-6")}
                style={stagger(2)}
              >
                {caption.body}
              </p>
            )}

            <p className="marginalia mt-7" style={stagger(3)}>
              <a
                href={focusedPost.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta group inline-flex items-center gap-2 transition-colors"
              >
                <InstagramGlyph className="size-[1.05em] shrink-0" />
                <span className="decoration-terracotta/40 group-hover:decoration-terracotta underline decoration-1 underline-offset-[0.28em]">
                  {t("seePost")}
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>

      <p className="marginalia mt-12">
        <a
          href={clinica.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta group inline-flex items-center gap-2 transition-colors"
        >
          <InstagramGlyph className="size-[1.05em] shrink-0" />
          <span className="decoration-terracotta/40 group-hover:decoration-terracotta underline decoration-1 underline-offset-[0.28em]">
            {t("follow", { handle: clinica.instagramHandle })}
          </span>
        </a>
      </p>
    </PageSection>
  );
}
