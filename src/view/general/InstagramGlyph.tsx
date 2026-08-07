/**
 * The Instagram mark, drawn in the same hand as `WhatsAppGlyph` — one stroke
 * weight, `currentColor`, no brand fill. The site's icons are drawn rather
 * than pulled from a set, so an official coloured logo would be the one
 * saturated thing on screen that isn't a painting.
 */

type Props = {
  className?: string;
};

export function InstagramGlyph({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17" cy="7" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
