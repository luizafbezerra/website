import type { Sobre } from "@/domain/sobre/Sobre";
import { RichTextProse } from "@/view/general/RichTextProse";

/**
 * The page's opening — its one `h1`, her lead, and the page's single drop cap.
 *
 * The `h1` is her **name**. Every other page on the site opens on what the place
 * offers; this one opens on the person, because /sobre is the address the entity
 * graph gives the `Person` node (`jsonLd.tsx`) and because the query this page
 * exists to win is somebody typing her name into a search box after seeing it on
 * a bio link. It is a page title she owns in the CMS rather than a second copy of
 * `clinica.fullName` — the strip below it already reads the name and the CRP from
 * A Clínica, so the two are never asked to agree about a fact.
 *
 * The lead is the whole AEO front-load (REQ-012), in her first person: clinical
 * psychologist, the Jungian tradition, the two doors, online, in which languages,
 * from where. It also says what the rest of the page holds, which is what a
 * sceptical reader — and an assistant summarizing the page — wants next.
 *
 * No portrait here. CONCEPT §7.1 keeps the opening type-led, and her face belongs
 * to the section that is about her rather than to the screen that introduces it.
 */
export function Abertura({ content }: { content: Sobre["abertura"] }) {
  return (
    <section
      aria-labelledby="abertura-heading"
      className="px-6 pt-32 pb-16 sm:px-10 sm:pt-36 sm:pb-20 lg:pt-40"
    >
      <div className="mx-auto w-full max-w-3xl">
        <h1
          id="abertura-heading"
          className="display text-foreground text-[clamp(2rem,4vw,3.1rem)] leading-[1.12] tracking-[-0.005em] text-balance"
        >
          {content.heading}
        </h1>

        <RichTextProse
          data={content.lead}
          className="body-prose dropcap text-ink mt-10 max-w-[62ch]"
        />
      </div>
    </section>
  );
}
