"use client";

import { useTranslations } from "next-intl";
import { useCosmosShow } from "@/view/cosmos/hooks/useCosmosShow";
import { cn } from "@/view/styling/cn";

export function FooterCosmosRestore({ className }: { className?: string }) {
  const t = useTranslations("chrome");
  const [show, setShow] = useCosmosShow();
  if (show) return null;

  return (
    <button
      type="button"
      onClick={() => setShow(true)}
      className={cn(
        "display-italic text-quill hover:text-terracotta no-underline transition-colors",
        className,
      )}
    >
      {t("cosmosRestore")}
    </button>
  );
}
