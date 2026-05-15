import type { Blog } from "@/core/blog";

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
  workLocation?: { city: string; region: string; country: string };
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
  workLocation,
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
  if (workLocation) {
    jsonLd.workLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: workLocation.city,
        addressRegion: workLocation.region,
        addressCountry: workLocation.country,
      },
    };
  }

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

type LocalBusinessJsonLdProps = {
  name: string;
  url?: string;
  description?: string;
  telephone?: string;
  email?: string;
  image?: string;
  city: string;
  region: string;
  country: string;
  priceRange?: string;
  areaServed?: string[];
  founder?: { name: string; url?: string };
  openingHours?: string[];
  type?: "MedicalBusiness" | "ProfessionalService" | "LocalBusiness";
  aggregateRating?: { ratingValue: number; reviewCount: number };
};

export function LocalBusinessJsonLd({
  name,
  url = BASE_URL,
  description,
  telephone,
  email,
  image,
  city,
  region,
  country,
  priceRange,
  areaServed,
  founder,
  openingHours,
  type = "MedicalBusiness",
  aggregateRating,
}: LocalBusinessJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    url,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: region,
      addressCountry: country,
    },
  };

  if (description) jsonLd.description = description;
  if (telephone) jsonLd.telephone = telephone;
  if (email) jsonLd.email = email;
  if (image) jsonLd.image = image;
  if (priceRange) jsonLd.priceRange = priceRange;
  if (areaServed) jsonLd.areaServed = areaServed;
  if (openingHours) jsonLd.openingHoursSpecification = openingHours;
  if (founder) {
    jsonLd.founder = {
      "@type": "Person",
      name: founder.name,
      url: founder.url ?? url,
    };
  }
  if (aggregateRating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
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

type BlogPostingJsonLdProps = {
  post: Blog.Post;
  locale: string;
  dateModified?: string;
  image?: string;
  wordCount?: number;
  authorName?: string;
};

export function BlogPostingJsonLd({
  post,
  locale,
  dateModified,
  image,
  wordCount,
  authorName = "Author",
}: BlogPostingJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: authorName,
      url: BASE_URL,
    },
    url: `${BASE_URL}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  if (dateModified) jsonLd.dateModified = dateModified;
  if (image) jsonLd.image = image;
  if (wordCount !== undefined) jsonLd.wordCount = wordCount;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
