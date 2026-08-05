"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { IDENTITY_DEFAULTS } from "@/domain/site/Identity";
import { Link } from "@/i18n/navigation";

// Route-level error boundary. Renders inside the root layout (html/body/fonts +
// globals.css), so the manuscript utilities and the locale's messages are both
// available. Kept calm and brief — an apology, a retry, and a way to reach Luiza
// — never a stack trace.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  const linkClass =
    "display-italic text-foreground decoration-terracotta hover:text-terracotta inline-flex text-[1.08rem] underline decoration-1 underline-offset-[0.22em] transition-colors";

  return (
    <main id="main" className="flex min-h-screen items-center px-6 py-32 sm:px-10 sm:py-44">
      <div className="mx-auto max-w-2xl text-center sm:text-left">
        <p className="tracked mb-6">{t("eyebrow")}</p>
        <h1 className="display text-foreground text-balance text-[clamp(2rem,4.4vw,3rem)] leading-[1.12] tracking-[-0.01em]">
          {t.rich("title", {
            em: (chunks) => <span className="display-italic text-terracotta-deep">{chunks}</span>,
          })}
        </h1>
        <p className="body-prose text-ink mt-8 max-w-[52ch] text-[1.085rem] leading-[1.74]">
          {t("body")}
        </p>

        <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-10">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-terracotta-deep hover:bg-foreground inline-flex items-center gap-3 px-6 py-3 text-parchment no-underline transition-colors"
          >
            <span className="display-italic text-[1.05rem]">{t("retry")}</span>
            <span aria-hidden="true">↺</span>
          </button>
          <Link href="/" className={linkClass}>
            {t("backHome")}
          </Link>
          <a
            href={IDENTITY_DEFAULTS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {t("whatsapp")}
          </a>
        </div>
      </div>
    </main>
  );
}
