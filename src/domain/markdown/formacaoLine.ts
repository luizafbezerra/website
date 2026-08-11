import type { FormacaoItem } from "@/domain/sobre/Sobre";

/**
 * `Graduação em Psicologia — PUC-SP (2003)`, at whatever precision she has
 * confirmed. A row with no title has nothing to print and is dropped.
 *
 * Shared by /sobre's twin and the home's, for the same reason `FormacaoList` is
 * shared by the two rendered pages: the record has one source, and a second
 * copy of the formatting is a second chance for the two to disagree about
 * whether the institution takes an em dash.
 */
export function formacaoLine(item: FormacaoItem): string | null {
  const title = item.title?.trim();
  if (!title) return null;

  const institution = item.institution?.trim();
  const period = item.period?.trim();

  return [title, institution && `— ${institution}`, period && `(${period})`]
    .filter(Boolean)
    .join(" ");
}
