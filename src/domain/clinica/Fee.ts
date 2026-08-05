/**
 * A fee is either stated or to be discussed — never an empty string (REQ-006).
 *
 * Making the absence a case of the type rather than a nullable string is what
 * keeps "a combinar" out of the view layer's conditionals: the component renders
 * whichever case it is handed, and no page can accidentally print a blank price.
 * The wording of the to-be-discussed case is localized chrome, not stored copy.
 */
export type Fee = { kind: "stated"; text: string } | { kind: "toDiscuss" };

const TO_DISCUSS: Fee = { kind: "toDiscuss" };

/** Normalize a stored fee field: blank, whitespace, or unset all mean "a combinar". */
export function feeFrom(stored: string | null | undefined): Fee {
  const text = stored?.trim();
  if (!text) return TO_DISCUSS;

  return { kind: "stated", text };
}
