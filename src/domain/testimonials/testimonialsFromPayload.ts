import type { PayloadTestimonial } from "@/infrastructure/payload/findPublishedTestimonials";
import type { Testimonial, TestimonialService } from "./Testimonial";

const SERVICES: readonly string[] = ["analise", "orientacao"] satisfies TestimonialService[];

function serviceFrom(value: string | null | undefined): TestimonialService | null {
  return typeof value === "string" && SERVICES.includes(value)
    ? (value as TestimonialService)
    : null;
}

/**
 * Keep only rows that carry recorded consent and both halves of a quote (SEC-002).
 *
 * The consent check is deliberately repeated here even though the accessor
 * already filters on it in SQL and the collection's access control filters it for
 * public reads: this is the last gate before the words reach a component, and the
 * one a unit test can prove. Three independent gates, none of them a comment
 * asking the next developer to remember.
 */
export function testimonialsFromPayload(docs: PayloadTestimonial[]): Testimonial[] {
  return docs
    .filter((doc) => doc?.consentGiven === true)
    .map((doc) => ({
      body: doc.body?.trim() ?? "",
      attribution: doc.attribution?.trim() ?? "",
      context: doc.context?.trim() || null,
      service: serviceFrom(doc.service),
      abroad: doc.abroad === true,
    }))
    .filter((testimonial) => Boolean(testimonial.body && testimonial.attribution));
}
