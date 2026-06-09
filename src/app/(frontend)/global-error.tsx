"use client";

import { useEffect } from "react";

// Last-resort boundary: catches errors in the root layout itself, so it must
// render its own <html>/<body> and cannot use globals.css or next/font. Inline
// styles mirror the parchment palette (CLAUDE.md) with a system serif stack so
// it still reads as the same site even with the layout bypassed.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          background: "oklch(0.97 0.012 75)",
          color: "oklch(0.22 0.02 35)",
          fontFamily: "Georgia, 'Times New Roman', 'Times', serif",
        }}
      >
        <div style={{ maxWidth: "34rem" }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "0.8rem",
              color: "oklch(0.5 0.022 55)",
              margin: 0,
            }}
          >
            Erro inesperado
          </p>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.2,
              margin: "1rem 0 0",
            }}
          >
            Algo saiu do lugar.
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "oklch(0.34 0.02 45)",
              marginTop: "1.5rem",
            }}
          >
            Recarregue a página em instantes. Se o problema continuar, fale comigo pelo WhatsApp.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: "2rem",
              border: "1px solid oklch(0.42 0.14 30)",
              background: "transparent",
              color: "oklch(0.42 0.14 30)",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontStyle: "italic",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
