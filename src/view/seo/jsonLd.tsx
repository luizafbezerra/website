const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

type PersonJsonLdProps = {
  name: string;
  url?: string;
  jobTitle?: string;
  sameAs?: string[];
  image?: string;
  email?: string;
  telephone?: string;
  description?: string;
  knowsAbout?: string[];
  knowsLanguage?: string[];
};

export function PersonJsonLd({
  name,
  url = BASE_URL,
  jobTitle,
  sameAs = [],
  image,
  email,
  telephone,
  description,
  knowsAbout,
  knowsLanguage,
}: PersonJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
  };

  if (jobTitle) jsonLd.jobTitle = jobTitle;
  if (sameAs.length > 0) jsonLd.sameAs = sameAs;
  if (image) jsonLd.image = image;
  if (email) jsonLd.email = email;
  if (telephone) jsonLd.telephone = telephone;
  if (description) jsonLd.description = description;
  if (knowsAbout) jsonLd.knowsAbout = knowsAbout;
  if (knowsLanguage) jsonLd.knowsLanguage = knowsLanguage;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type WebSiteJsonLdProps = {
  name: string;
  url?: string;
  description?: string;
  inLanguage?: string;
};

export function WebSiteJsonLd({
  name,
  url = BASE_URL,
  description,
  inLanguage = "pt-BR",
}: WebSiteJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    inLanguage,
  };
  if (description) jsonLd.description = description;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type OnlineClinicJsonLdProps = {
  name: string;
  url?: string;
  description?: string;
  telephone?: string;
  email?: string;
  image?: string;
  /** Profiles that bind this entity to the same practice — Instagram above all. */
  sameAs?: string[];
  areaServed?: string[];
  founder?: { name: string; url?: string };
};

/**
 * The clinic as an entity — an `Organization` with **no postal address**, because
 * the practice is online only (REQ-011 / CON-001). It deliberately is not a
 * `LocalBusiness` or `MedicalBusiness`: those describe a place a patient walks
 * into, and claiming one in structured data is the same false claim as printing a
 * street on the page.
 *
 * TASK-032 grows this into the full entity graph (the two services, the person,
 * the site) emitted from one place; this is the honest minimum until then.
 */
export function OnlineClinicJsonLd({
  name,
  url = BASE_URL,
  description,
  telephone,
  email,
  image,
  sameAs = [],
  areaServed,
  founder,
}: OnlineClinicJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
  };

  if (description) jsonLd.description = description;
  if (telephone) jsonLd.telephone = telephone;
  if (email) jsonLd.email = email;
  if (image) jsonLd.image = image;
  if (sameAs.length > 0) jsonLd.sameAs = sameAs;
  if (areaServed) jsonLd.areaServed = areaServed;
  if (founder) {
    jsonLd.founder = {
      "@type": "Person",
      name: founder.name,
      url: founder.url ?? url,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type FaqEntry = { question: string; answer: string };

export function FaqJsonLd({ entries }: { entries: FaqEntry[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type ReviewEntry = {
  body: string;
  author: string;
  rating?: number;
  datePublished?: string;
};

type ReviewsJsonLdProps = {
  itemName: string;
  itemUrl?: string;
  reviews: ReviewEntry[];
};

export function ReviewsJsonLd({ itemName, itemUrl = BASE_URL, reviews }: ReviewsJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${itemName} — depoimentos`,
    itemListElement: reviews.map((review, idx) => ({
      "@type": "Review",
      position: idx + 1,
      reviewBody: review.body,
      author: {
        "@type": "Person",
        name: review.author,
      },
      itemReviewed: {
        "@type": "Person",
        name: itemName,
        url: itemUrl,
      },
      ...(review.rating !== undefined && {
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
        },
      }),
      ...(review.datePublished && { datePublished: review.datePublished }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type BreadcrumbItem = { name: string; url: string };

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
