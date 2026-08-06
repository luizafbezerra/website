/**
 * A fragment id for one question, so `/perguntas#p-quanto-tempo-dura-uma-analise`
 * lands on that question and opens it — browsers reveal a closed `<details>` when
 * the fragment targets it, which is the whole reason the ids exist.
 *
 * Derived from the question text rather than from a database id, because the
 * questions are CMS rows and their numeric ids mean nothing to a person reading a
 * link. The trade is that rewriting a question changes its anchor and retires the
 * old link; a question is rewritten roughly never, and a stale anchor degrades to
 * landing at the top of the page.
 *
 * `NFD` then dropping combining marks folds the diacritics instead of deleting the
 * letters under them, so "análise" becomes `analise` and not `anlise`.
 */
export function questionAnchor(question: string): string {
  const slug = question
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "");

  // The prefix keeps these clear of the section ids, which are the bare category
  // names — and guarantees a valid id even from a question of pure punctuation.
  return `p-${slug}`;
}
