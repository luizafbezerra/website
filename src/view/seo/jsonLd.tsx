import { useTranslations } from "next-intl";
import type { Clinica } from "@/domain/clinica/Clinica";
import { type Locale, LOCALE_TAGS, SITE_LOCALES } from "@/domain/site/Locale";
import { pagePath } from "@/domain/site/pagePath";
import { absoluteUrl, BASE_URL } from "@/infrastructure/env/baseUrl";

/**
 * The site's structured data (REQ-011). Everything a machine reads about the
 * entity comes from this module — nothing bypasses it.
 *
 * `SiteEntityGraphJsonLd` emits the whole entity graph in one `@graph`, from the
 * shared chrome layout, so every page declares the same four things and links
 * them by `@id`: the clinic, the person who is the clinic, the two services she
 * offers, and the site itself. That is the Google → Instagram bridge CONCEPT §10
 * asks for, built rather than asserted: `sameAs` binds the account to the entity.
 *
 * Two shapes are deliberate. The clinic is an `Organization` with **no postal
 * address** — a `LocalBusiness` or `MedicalBusiness` describes a place a patient
 * walks into, and claiming one in structured data is the same false claim as
 * printing a street on the page (CON-001). And the person is never called a
 * "Jungian analyst" in English, a formally protected title (CON-002); her
 * `jobTitle` comes from the CMS, where that register rule is written down.
 *
 * The page-specific types stay separate: `FaqJsonLd` belongs to /perguntas,
 * `BreadcrumbJsonLd` and `ReviewsJsonLd` to the page that has the trail or the
 * testimonials.
 */

function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

// Stable graph identities. Fragments on the origin rather than on a page, so
// every page's copy of the graph refers to the same four nodes.
const CLINIC_ID = `${BASE_URL}/#clinica`;
const PERSON_ID = `${BASE_URL}/#luiza`;
const WEBSITE_ID = `${BASE_URL}/#website`;
const SERVICE_IDS = {
  analise: `${BASE_URL}/#servico-analise`,
  orientacaoProfissional: `${BASE_URL}/#servico-orientacao-profissional`,
} as const;

/**
 * Her academic record as schema.org reads it. Institution names are proper
 * nouns, so they are not translated. TASK-039 sources these from the `sobre`
 * global once that page exists and she has reviewed the full record.
 */
const ALUMNI_OF = ["Pontifícia Universidade Católica de São Paulo", "Instituto Numen"];

const SERVICE_KEYS = ["analise", "orientacaoProfissional"] as const;

/** Both languages she works in — the signal that matters most to a foreigner. */
const LANGUAGES = SITE_LOCALES.map((locale) => LOCALE_TAGS[locale]);

/** Every locale's address for a page, so a crawler can find the mirror. */
const pageUrl = (key: Parameters<typeof pagePath>[0], locale: Locale) =>
  absoluteUrl(pagePath(key, locale));

export function SiteEntityGraphJsonLd({ clinica, locale }: { clinica: Clinica; locale: Locale }) {
  const t = useTranslations("seo");
  const homeUrl = pageUrl("inicio", locale);
  const language = LOCALE_TAGS[locale];
  const sameAs = clinica.instagramUrl ? [clinica.instagramUrl] : [];

  const clinic: Record<string, unknown> = {
    "@type": "Organization",
    "@id": CLINIC_ID,
    name: clinica.clinicName,
    url: homeUrl,
    description: clinica.positioning,
    email: clinica.email,
    telephone: clinica.whatsappE164,
    // The reach, in the vocabulary a machine reads: a Brazilian practice that
    // also receives people living anywhere.
    areaServed: ["BR", "Worldwide"],
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
    ...(sameAs.length > 0 && { sameAs }),
  };

  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: clinica.fullName,
    url: pageUrl("sobre", locale),
    jobTitle: clinica.role,
    description: clinica.positioning,
    email: clinica.email,
    telephone: clinica.whatsappE164,
    knowsAbout: t.raw("knowsAbout"),
    knowsLanguage: LANGUAGES,
    alumniOf: ALUMNI_OF.map((name) => ({ "@type": "EducationalOrganization", name })),
    worksFor: { "@id": CLINIC_ID },
    ...(sameAs.length > 0 && { sameAs }),
    // Absent until she confirms the registration in writing (DEP-005): an
    // invented credential is worse than a missing one.
    ...(clinica.credential && {
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "professional license",
        name: clinica.credential,
      },
    }),
  };

  const services = SERVICE_KEYS.map((key) => ({
    "@type": "Service",
    "@id": SERVICE_IDS[key],
    name: t(`services.${key}.name`),
    description: t(`services.${key}.description`),
    serviceType: t(`services.${key}.name`),
    url: pageUrl(key, locale),
    provider: { "@id": PERSON_ID },
    areaServed: ["BR", "Worldwide"],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: homeUrl,
      availableLanguage: LANGUAGES,
    },
  }));

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: clinica.clinicName,
    url: homeUrl,
    description: clinica.positioning,
    inLanguage: language,
    publisher: { "@id": CLINIC_ID },
  };

  return (
    <JsonLdScript
      data={{ "@context": "https://schema.org", "@graph": [clinic, person, ...services, website] }}
    />
  );
}

type FaqEntry = { question: string; answer: string };

export function FaqJsonLd({ entries }: { entries: FaqEntry[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entries.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer },
        })),
      }}
    />
  );
}

type ReviewEntry = { body: string; author: string };

/**
 * Testimonials as an `ItemList` of reviews. No `ratingValue` anywhere: CONCEPT
 * §11 bans star ratings, and inventing one for the crawler would be the same
 * claim made where the visitor cannot see it.
 */
export function ReviewsJsonLd({ reviews, itemName }: { reviews: ReviewEntry[]; itemName: string }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: itemName,
        itemListElement: reviews.map((review, index) => ({
          "@type": "Review",
          position: index + 1,
          reviewBody: review.body,
          author: { "@type": "Person", name: review.author },
          itemReviewed: { "@id": CLINIC_ID },
        })),
      }}
    />
  );
}

type BreadcrumbItem = { name: string; url: string };

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
