/** wa.me link from any phone string — strips every non-digit. */
export function whatsappUrlFromPhone(phoneE164: string): string {
  return `https://wa.me/${phoneE164.replace(/\D/g, "")}`;
}
