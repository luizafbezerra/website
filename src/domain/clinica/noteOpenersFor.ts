import type { Locale } from "@/domain/site/Locale";
import type { NoteOpeners } from "./Clinica";

/** One note the bilhete offers: which door it comes through, and its text. */
export type NoteOpener = { door: keyof NoteOpeners; text: string };

/**
 * The notes a page offers, in the order CONCEPT §6 lists them, skipping the ones
 * she has not written.
 *
 * **The English note is a Portuguese-page affordance.** CONCEPT §6 lists four
 * openers — análise · orientação · "não sei" · English — and the fourth exists so
 * an anglophone reading the Portuguese site has a note they can send. On `/en` the
 * other three are already English, so it would render a fourth card saying, more
 * vaguely, what the first one says. It is dropped there.
 *
 * Which note a visitor taps is never recorded: the wording of the arriving message
 * is the whole of the attribution (CONCEPT §8.1).
 */
const DOORS: Array<keyof NoteOpeners> = ["analysis", "careerGuidance", "unsure", "english"];

export function noteOpenersFor(notes: NoteOpeners, locale: Locale): NoteOpener[] {
  return DOORS.filter((door) => !(door === "english" && locale === "en")).flatMap((door) => {
    const text = notes[door]?.trim();
    return text ? [{ door, text }] : [];
  });
}
