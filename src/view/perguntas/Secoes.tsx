import { useTranslations } from "next-intl";
import type { FaqSection } from "@/domain/faq/groupFaqByCategory";
import type { Perguntas } from "@/domain/perguntas/Perguntas";
import { Plate } from "@/view/general/Plate";
import { Secao } from "./Secao";

const PLATE_ASPECT = "3 / 2";

/**
 * The four sections of CONCEPT §6 in the map's order, and the page's plate after
 * the last of them.
 *
 * The sequence comes from `groupFaqByCategory`, which is where the two rules live:
 * the order is CONCEPT's rather than the collection's, and a category with no
 * questions produces no section at all. Two of the four legitimately ship thin, so
 * this component must never be able to print a heading over nothing.
 *
 * **Where the plate goes, and why it moved.** It used to sit at the hinge between
 * the second and third sections, on the argument that a long scroll wants one
 * breath in the middle. With the answers collapsed there is no long scroll to
 * break: the whole point of the page now is that the four headings and their
 * questions can be taken in at once, and a full editorial painting planted in the
 * middle of that list is the one thing on screen loud enough to stop the eye
 * before it has found what it came for. So the painting waits until the questions
 * are done — the same move the home makes with the Cosmos, where the wow is the
 * farewell rather than an obstacle. It closes the reference page and hands over to
 * the `Fecho`'s quiet ask.
 *
 * Still one plate, and still not in the opening: a painting above the front-load
 * would delay exactly what a cold searcher arrived for.
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

  return (
    <>
      {sections.map((section) => (
        <Secao
          key={section.category}
          id={section.category}
          content={headings[section.category]}
          entries={section.entries}
        />
      ))}

      <div className="px-6 sm:px-10">
        <Plate
          image={plate.image}
          caption={caption}
          placeholder={t("placeholder")}
          placeholderNote={t("placeholderNote")}
          aspectRatio={PLATE_ASPECT}
        />
      </div>
    </>
  );
}
