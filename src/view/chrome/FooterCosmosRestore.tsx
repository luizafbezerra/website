"use client";

import { useCosmosShow } from "@/view/cosmos/hooks/useCosmosShow";

export function FooterCosmosRestore() {
  const [show, setShow] = useCosmosShow();
  if (show) return null;

  return (
    <button
      type="button"
      onClick={() => setShow(true)}
      className="display-italic text-quill hover:text-terracotta no-underline transition-colors"
    >
      Reabrir a abertura cósmica ↻
    </button>
  );
}
