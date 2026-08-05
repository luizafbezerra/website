/**
 * wa.me link from any phone string — strips every non-digit.
 *
 * An optional `note` becomes WhatsApp's prefilled message: this is how the
 * bilhete works (CONCEPT §8.1). The visitor taps an opener already written in
 * her voice, and the arriving message tells Luiza which page and which service
 * the conversation began on — service attribution with nothing tracked, because
 * the whole composition happens in the visitor's own browser.
 */
export function whatsappUrlFromPhone(phoneE164: string, note?: string | null): string {
  const url = `https://wa.me/${phoneE164.replace(/\D/g, "")}`;
  const text = note?.trim();

  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}
