import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SHARE_CARD_SIZE } from "./shareCardUrl";

/**
 * The social share card (CONCEPT §10, "the share loop"): the image that renders
 * every time her link is shared — including the announcement to 45K followers,
 * the largest share event the site will ever have. It exists before that
 * announcement, not after it.
 *
 * One composition for the whole site, filled per page from the registry: the
 * mandala mark she already owns, the "por" lockup, the page's own name, and her
 * positioning sentence. Built from the plate system's own vocabulary rather than
 * from a screenshot — parchment, warm ink, one terracotta rule, flat.
 *
 * The colours are hex rather than the oklch tokens because Satori (the renderer
 * behind `ImageResponse`) does not implement oklch; these are the sRGB
 * equivalents of the DESIGN palette.
 */

const PARCHMENT = "#f8eedb";
const PARCHMENT_DEEP = "#efe1c4";
const INK = "#3a2418";
const QUILL = "#7f6f5e";
const TERRACOTTA = "#9a4527";

const asset = (relativePath: string) => readFileSync(join(process.cwd(), "public", relativePath));

export type ShareCardProps = {
  /** The world's voice, tracked caps: the clinic name. */
  eyebrow: string;
  /** What this page is. The home card carries the clinic name itself. */
  title: string;
  /** "por Luiza Fernandes Bezerra" — the lockup's second half. */
  byline: string;
  /** Her positioning sentence, or the page's own description. */
  description: string;
};

export function renderShareCard({ eyebrow, title, byline, description }: ShareCardProps) {
  const mark = `data:image/jpeg;base64,${asset("art/quaternity.jpg").toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 72,
        padding: "72px 80px",
        backgroundColor: PARCHMENT,
        backgroundImage: `radial-gradient(circle at 18% 50%, ${PARCHMENT_DEEP} 0%, ${PARCHMENT} 60%)`,
        fontFamily: "Vollkorn",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders raw <img>. */}
      <img
        src={mark}
        width={400}
        height={400}
        alt=""
        style={{ objectFit: "cover", flexShrink: 0 }}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26 }}>
        <div
          style={{
            fontFamily: "Cardo",
            fontSize: 18,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: TERRACOTTA,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            fontFamily: "Cardo",
            fontSize: 72,
            lineHeight: 1.04,
            letterSpacing: "-0.012em",
            fontStyle: "italic",
            color: INK,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", width: 96, height: 1, backgroundColor: TERRACOTTA }} />

        <div style={{ fontFamily: "Cardo", fontSize: 30, fontStyle: "italic", color: TERRACOTTA }}>
          {byline}
        </div>

        <div style={{ fontSize: 22, lineHeight: 1.45, color: QUILL, maxWidth: 560 }}>
          {description}
        </div>
      </div>
    </div>,
    {
      ...SHARE_CARD_SIZE,
      fonts: [
        { name: "Cardo", data: asset("fonts/cardo-regular.ttf"), weight: 400, style: "normal" },
        { name: "Cardo", data: asset("fonts/cardo-italic.ttf"), weight: 400, style: "italic" },
        {
          name: "Vollkorn",
          data: asset("fonts/vollkorn-regular.ttf"),
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
