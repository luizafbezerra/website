import { useTranslations } from "next-intl";
import type { Clinica, NoteOpeners } from "@/domain/clinica/Clinica";
import { whatsappUrlFromPhone } from "@/domain/clinica/whatsappUrlFromPhone";
import { WhatsAppGlyph } from "@/view/general/WhatsAppGlyph";
import { cn } from "@/view/styling/cn";

/**
 * The site's one call to action (REQ-004). Always in flow — never a sticky bar,
 * never a floating bubble, never a countdown beside it. Trust, not urgency: the
 * conversation is the reward for a calm read, so this component is placed at the
 * end of a thought, not pinned over one.
 *
 * `opener` chooses one of the four bilhete notes she wrote (CONCEPT §8.1). The
 * chosen wording is what tells her where the conversation began — attribution in
 * her voice, composed in the visitor's own browser, with nothing tracked. While
 * an opener is unwritten the link is simply bare, which is the plain button
 * CONCEPT §13.5 falls back to.
 */

type WhatsAppCtaProps = {
  clinica: Clinica;
  /** Which pre-written note the tap should carry. */
  opener?: keyof NoteOpeners;
  /** Overrides the default "Conversar pelo WhatsApp". */
  label?: string;
  /** `primary` is the square terracotta block; `quiet` is a marginalia link. */
  variant?: "primary" | "quiet";
  className?: string;
};

export function WhatsAppCta({
  clinica,
  opener,
  label,
  variant = "primary",
  className,
}: WhatsAppCtaProps) {
  const t = useTranslations("chrome.whatsapp");
  const href = whatsappUrlFromPhone(clinica.whatsappE164, opener ? clinica.notes[opener] : null);
  const text = label ?? t("label");
  const ariaLabel = t("aria", { phone: clinica.whatsappDisplay });

  if (variant === "quiet") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={cn(
          "text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta inline-flex items-baseline gap-2 underline decoration-1 underline-offset-[0.28em] transition-colors",
          className,
        )}
      >
        <WhatsAppGlyph className="text-terracotta h-[1.05em] w-[1.05em] -translate-y-px" />
        <span className="display-italic">{text}</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "bg-terracotta-deep hover:bg-foreground text-parchment group inline-flex items-baseline gap-3 px-7 py-4 no-underline transition-colors",
        className,
      )}
    >
      <WhatsAppGlyph className="h-[1.05em] w-[1.05em] -translate-y-px" />
      <span className="display-italic">{text}</span>
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </a>
  );
}
