/**
 * One operational fact a page states, and its label — the row of a "prático"
 * or "logística" list.
 *
 * Four of the eight pages carry such a list (CONCEPT §6: /analise, /orientacao-
 * profissional, /internacional, /primeira-conversa) and all four store the same
 * pair, so the shape lives here rather than being spelled out again in each
 * page's own domain type. The same reasoning put `PagePlate` in `domain/media/`.
 *
 * Both members are non-empty by the time a row exists: a half-typed row has
 * nothing a visitor could read, so the page mappers drop it instead of rendering
 * a label with no value.
 */
export type FactRow = { label: string; value: string };
