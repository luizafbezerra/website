import { useTranslations } from "next-intl";
import { Fragment } from "react";
import type { FaqSection } from "@/domain/faq/groupFaqByCategory";
import type { Perguntas } from "@/domain/perguntas/Perguntas";
import { Plate } from "@/view/general/Plate";
import { Secao } from "./Secao";

const PLATE_ASPECT = "3 / 2";

/**
 * The four sections of CONCEPT §6 in the map's order, and the page's plate at the
 * breath between them.
 *
 * The sequence comes from `groupFaqByCategory`, which is where the two rules live:
 * the order is CONCEPT's rather than the collection's, and a category with no
 * questions produces no section at all. Two of the four legitimately ship thin, so
 * this component must never be able to print a heading over nothing.
 *
 * **Where the plate goes.** PAT-002 wants one plate per page, and a long Q&A scroll
 * has exactly one natural breath: after the second section. With all four present
 * that is the hinge of the page's argument — the two sections about *what the two
 * works are* end, and the two about *how the work runs* begin — so the painting
 * reads as the turn rather than as an obstacle between a visitor and the answer
 * they came for. With fewer sections it still lands mid-scroll rather than at
 * either end. Not in the opening: a full editorial painting there would delay the
 * front-load. Not at the close: the hand-off is the quietest moment on the page
 * and a plate above it would be the loudest.
 */
export function Secoes({
  sections,
  headings,
  plate,
}: {
  sections: FaqSection[];
  headings: Perguntas["sections"];
  plate: Perguntas["plate"];
}) {
  const t = useTranslations("perguntas.plate");

  // A gallery label needs both the hand and the work; a lone painter names nothing.
  const caption =
    plate.painter && plate.workTitle
      ? { painter: plate.painter, title: plate.workTitle, year: plate.year ?? undefined }
      : null;

  const plateAfter = Math.min(1, sections.length - 1);

  return (
    <>
      {sections.map((section, index) => (
        // A Fragment rather than a wrapper element: the sections are siblings in
        // the page's landmark structure, and a div between them would say nothing.
        <Fragment key={section.category}>
          <Secao
            id={section.category}
            content={headings[section.category]}
            entries={section.entries}
          />
          {index === plateAfter && (
            <div className="px-6 sm:px-10">
              <Plate
                image={plate.image}
                caption={caption}
                placeholder={t("placeholder")}
                placeholderNote={t("placeholderNote")}
                aspectRatio={PLATE_ASPECT}
              />
            </div>
          )}
        </Fragment>
      ))}
    </>
  );
}
