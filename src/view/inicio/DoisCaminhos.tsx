import type { Door, Inicio } from "@/domain/inicio/Inicio";
import { PageSection } from "@/view/general/PageSection";
import { SectionHeading } from "@/view/general/SectionHeading";
import { SectionLink } from "@/view/general/SectionLink";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

/**
 * Section 4 of CONCEPT §6 — the two doors of §4, side by side, and the sentence
 * that says which one is whose.
 *
 * An editorial two-column spread divided by a warm hairline rule, not two cards.
 * DESIGN bans the cards-everywhere grid outright, and the ban earns its keep
 * here: cards would make the doors look like two products to compare on price,
 * when the actual question is which of two different questions the visitor is
 * carrying.
 *
 * The boundary sentence closes the section centered beneath both columns, in her
 * italic voice — it is the routing instruction, so it belongs to neither column.
 */
export function DoisCaminhos({ content }: { content: Inicio["doisCaminhos"] }) {
  return (
    <PageSection labelledBy="dois-caminhos-heading" width="wide">
      <SectionHeading id="dois-caminhos-heading">{content.heading}</SectionHeading>

      {content.intro && <p className="body-prose text-ink mt-8 max-w-[60ch]">{content.intro}</p>}

      <div className="border-rule mt-14 grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-16 md:divide-x md:divide-[color:var(--color-rule)]">
        <DoorColumn door={content.analysis} href="/analise" />
        <DoorColumn
          door={content.careerGuidance}
          href="/orientacao-profissional"
          className="border-rule-soft border-t pt-12 md:border-t-0 md:pt-0 md:pl-16"
        />
      </div>

      {content.boundary && (
        <p className="display-italic text-ink-soft mx-auto mt-16 max-w-[46ch] text-center text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.3] text-balance">
          {content.boundary}
        </p>
      )}
    </PageSection>
  );
}

function DoorColumn({
  door,
  href,
  className,
}: {
  door: Door;
  href: ComponentProps<typeof Link>["href"];
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="display text-foreground text-[clamp(1.45rem,2.4vw,1.85rem)] leading-[1.2] text-balance">
        {door.title}
      </h3>
      <p className="body-prose text-ink mt-5">{door.body}</p>
      <SectionLink href={href} className="mt-7">
        {door.linkLabel}
      </SectionLink>
    </div>
  );
}
