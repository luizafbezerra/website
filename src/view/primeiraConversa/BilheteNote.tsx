"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { WhatsAppGlyph } from "@/view/general/WhatsAppGlyph";

/**
 * One pre-written note, and **O selo** (CONCEPT §9.7): tapping it folds the note
 * once and presses her mandala mark into it like wax.
 *
 * **The seal is never in the handoff's way.** This is a real anchor to `wa.me`, so
 * the browser opens WhatsApp the instant it is tapped and the crease plays on the
 * note left behind — nothing is intercepted, nothing is deferred, and no timer
 * decides when the visitor gets to write. `target="_blank"` is what makes the
 * moment visible at all: the page stays put, so the note the visitor just chose
 * seals itself in view while WhatsApp opens beside it.
 *
 * That also means the whole conversion path survives with JavaScript off. The link
 * and its prefilled message are in the server-rendered HTML; the client boundary
 * exists only to set one attribute, and losing it costs an animation rather than
 * the north star.
 *
 * The note is set in her voice — Cardo italic on a lighter sheet over the section's
 * deeper parchment (DESIGN §4: depth is tonal, never shadowed) — because it is not
 * a button in a grid. It is the sentence the visitor is about to send, shown
 * verbatim so the tap holds no surprise.
 */

type BilheteNoteProps = {
  /** Which door this note comes through, for the accessible name. */
  doorLabel: string;
  /** The message the visitor sends, verbatim. */
  text: string;
  href: string;
};

export function BilheteNote({ doorLabel, text, href }: BilheteNoteProps) {
  const t = useTranslations("primeiraConversa.bilhete");
  const [sealed, setSealed] = useState(false);

  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        // No preventDefault: the navigation is the browser's, and the seal is a
        // side effect of a tap that has already left.
        onClick={() => setSealed(true)}
        data-sealed={sealed || undefined}
        aria-label={t("noteAria", { door: doorLabel })}
        className="bilhete-note border-rule bg-parchment hover:border-terracotta/70 group relative block border px-6 py-6 no-underline transition-colors sm:px-8 sm:py-7"
      >
        <span className="tracked text-terracotta block">{doorLabel}</span>

        <span className="display-italic text-ink mt-4 block max-w-[46ch] text-[clamp(1.2rem,2vw,1.45rem)] leading-[1.35]">
          “{text}”
        </span>

        <span className="text-quill group-hover:text-terracotta mt-5 inline-flex items-baseline gap-2 text-sm transition-colors">
          <WhatsAppGlyph className="text-terracotta h-[1.05em] w-[1.05em] -translate-y-px" />
          <span className="body-italic">{t("send")}</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>

        {/* The mark, in the round crop the header wears — a real painted asset,
            never a drawn circle. Decorative: the note's accessible name already
            says which door this is, so the seal adds nothing to announce. */}
        <span
          aria-hidden="true"
          className="bilhete-seal border-terracotta/60 pointer-events-none absolute right-5 bottom-5 block aspect-square w-11 overflow-hidden rounded-full border sm:right-7 sm:bottom-6 sm:w-12"
        >
          <Image
            src="/art/quaternity.jpg"
            alt=""
            width={400}
            height={400}
            sizes="48px"
            className="h-full w-full scale-[1.18] select-none object-cover object-center"
          />
        </span>
      </a>
    </li>
  );
}
