import type { CSSProperties, Ref } from "react";
import { useTranslations } from "next-intl";
import type { InstagramPost } from "@/domain/instagram/InstagramPost";
import { cn } from "@/view/styling/cn";

/**
 * One print in the constellation — a post in a small vellum mount, hung at a
 * slot around the one on the desk.
 *
 * Every movement lives on its own element so they compose instead of fighting:
 * the `<li>` owns the slot position and transitions it when the arrangement
 * changes; the gravity wrapper receives the cursor-pull translate the bridge
 * writes at frame rate; two nested wrappers each carry one axis of the idle
 * float. The focused print holds still — no float, no gravity (the bridge
 * reads `data-focused` to leave it alone) — drops the crop, and gains the gilt
 * fillet, the thin gold inner line a framer puts inside a mat.
 *
 * **A plain `<img>`, deliberately, and never `next/image`.** Instagram's terms
 * forbid copying her media onto another host, which is exactly what the image
 * optimizer does when it proxies and caches a URL. The browser loads the signed
 * URL straight from Meta and pays with `loading="lazy"` instead of an optimizer.
 *
 * Satellite images are `alt=""` because the button carries the accessible name;
 * the focused image is page content and speaks its own alt text.
 */

/** Where a print hangs: percentages of the canvas, plus its mount width. */
export type PrintSlot = { x: number; y: number; w: string };

/** A slot's two geometries — the phone cluster and the desktop spread. */
export type ResponsiveSlot = { sm: PrintSlot; lg: PrintSlot };

export function InstagramTile({
  post,
  slot,
  slotNumber,
  isFocused,
  label,
  onFocus,
  printRef,
}: {
  post: InstagramPost;
  slot: ResponsiveSlot;
  /** Which slot the print occupies — desyncs the float so no two sway together. */
  slotNumber: number;
  isFocused: boolean;
  label: string;
  onFocus: () => void;
  /** Registers the print with the bridge's cursor-gravity loop. */
  printRef: Ref<HTMLLIElement>;
}) {
  const t = useTranslations("inicio.instagram");

  // Periods stay mutually unrelated per print, so no two prints — and neither
  // axis of one print — ever fall into step. Negative delays start each one
  // mid-travel, so nothing lines up at the origin on load.
  const float = {
    "--instagram-float-x-duration": `${9 + slotNumber * 1.3}s`,
    "--instagram-float-y-duration": `${13 + slotNumber * 1.7}s`,
    "--instagram-float-x-delay": `${slotNumber * -3.1}s`,
    "--instagram-float-y-delay": `${slotNumber * -5.3}s`,
  } as CSSProperties;

  return (
    <li
      ref={printRef}
      data-focused={isFocused || undefined}
      className="instagram-print absolute -translate-x-1/2 -translate-y-1/2"
      style={
        {
          "--print-x-sm": `${slot.sm.x}%`,
          "--print-y-sm": `${slot.sm.y}%`,
          "--print-w-sm": slot.sm.w,
          "--print-x-lg": `${slot.lg.x}%`,
          "--print-y-lg": `${slot.lg.y}%`,
          "--print-w-lg": slot.lg.w,
          zIndex: isFocused ? 10 : 1,
        } as CSSProperties
      }
    >
      <span className="instagram-gravity block">
        <span className={cn("block", !isFocused && "instagram-float-x")} style={float}>
          <span className={cn("block", !isFocused && "instagram-float-y")} style={float}>
            <button
              type="button"
              onClick={onFocus}
              aria-current={isFocused || undefined}
              className={cn(
                "focus-visible:outline-terracotta block w-full focus-visible:outline-2 focus-visible:outline-offset-[3px]",
                isFocused ? "cursor-default" : "cursor-pointer",
              )}
            >
              <span className="sr-only">
                {isFocused ? t("tileCurrent", { work: label }) : t("tileAction", { work: label })}
              </span>
              <span
                className={cn(
                  "bg-vellum border-rule block border transition-[filter,opacity] duration-300",
                  isFocused
                    ? "p-2"
                    : "p-1 opacity-90 [filter:saturate(0.75)_sepia(0.08)] hover:opacity-100 hover:[filter:none]",
                )}
              >
                <span
                  className={cn(
                    "block border",
                    isFocused ? "border-gilt p-1.5" : "border-transparent",
                  )}
                >
                  <img
                    src={post.imageUrl}
                    alt={isFocused ? post.altText : ""}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "w-full select-none",
                      isFocused
                        ? "max-h-[13rem] object-contain lg:max-h-[18rem]"
                        : "aspect-square object-cover",
                    )}
                  />
                </span>
              </span>
            </button>
          </span>
        </span>
      </span>
    </li>
  );
}
