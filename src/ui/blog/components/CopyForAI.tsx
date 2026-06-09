"use client";

import { useState } from "react";

type CopyState = "idle" | "copied" | "error";

/**
 * Copies the post's clean Markdown (the `/blog/<slug>.md` artifact agents read)
 * to the clipboard. Manuscript-styled — a sharp-edged outlined affordance with
 * a pilcrow, not a generic rounded icon button — to sit honestly inside the
 * page's editorial register. Mirrors the clipboard + transient-state pattern in
 * ShareButtons/CodeBlockCopy.
 */
export function CopyForAI({ slug }: { slug: string }) {
  const [state, setState] = useState<CopyState>("idle");

  const handleCopy = async () => {
    try {
      const res = await fetch(`/blog/${slug}.md`);
      if (!res.ok) throw new Error("Markdown unavailable");
      const markdown = await res.text();

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(markdown);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = markdown;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  };

  const label =
    state === "copied"
      ? "Copiado!"
      : state === "error"
        ? "Não foi possível copiar"
        : "Copiar para IA";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      title="Copia o texto limpo desta publicação em Markdown, para colar em uma IA"
      className="border-rule text-quill hover:border-terracotta hover:text-terracotta focus-visible:border-terracotta focus-visible:text-terracotta inline-flex items-baseline gap-2 border px-3.5 py-2 text-[0.85rem] transition-colors outline-none"
    >
      <span aria-hidden="true" className="text-terracotta">
        {state === "copied" ? "✓" : "❡"}
      </span>
      <span className="display-italic">{label}</span>
    </button>
  );
}
