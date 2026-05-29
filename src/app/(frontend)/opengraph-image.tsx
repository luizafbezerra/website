import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { Luiza } from "@/core";

export const runtime = "nodejs";
export const alt = `${Luiza.fullName} — psicóloga junguiana em ${Luiza.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PARCHMENT = "#f8eedb";
const PARCHMENT_DEEP = "#efe1c4";
const INK = "#3a2418";
const QUILL = "#7f6f5e";
const TERRACOTTA = "#9a4527";

const readFont = (filename: string) => readFileSync(join(process.cwd(), "public/fonts", filename));

export default async function OpengraphImage() {
  const quaternity = readFileSync(join(process.cwd(), "public/art/quaternity.jpg"));
  const quaternitySrc = `data:image/jpeg;base64,${quaternity.toString("base64")}`;

  const cardoRegular = readFont("cardo-regular.ttf");
  const cardoItalic = readFont("cardo-italic.ttf");
  const vollkornRegular = readFont("vollkorn-regular.ttf");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: PARCHMENT,
        backgroundImage: `radial-gradient(circle at 18% 50%, ${PARCHMENT_DEEP} 0%, ${PARCHMENT} 60%)`,
        padding: "72px 80px",
        alignItems: "center",
        gap: 72,
        fontFamily: "Vollkorn",
      }}
    >
      <img
        src={quaternitySrc}
        width={420}
        height={420}
        alt=""
        style={{
          objectFit: "cover",
          flexShrink: 0,
          boxShadow: "0 1px 0 rgba(58,36,24,0.16), 0 18px 40px -28px rgba(58,36,24,0.25)",
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: TERRACOTTA,
          }}
        >
          {`${Luiza.role} · ${Luiza.city}`}
        </div>

        <div
          style={{
            fontFamily: "Cardo",
            fontSize: 78,
            lineHeight: 1.04,
            color: INK,
            fontStyle: "italic",
            letterSpacing: "-0.012em",
          }}
        >
          {Luiza.fullName}
        </div>

        <div
          style={{
            fontFamily: "Cardo",
            fontSize: 32,
            color: TERRACOTTA,
            fontStyle: "italic",
            lineHeight: 1.2,
          }}
        >
          {`${Luiza.tradition} — para a vida adulta`}
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: 22,
            lineHeight: 1.45,
            color: QUILL,
            maxWidth: 560,
          }}
        >
          {`Para adultos que atravessam ansiedade, lutos, relações ou propósito. Atendimento presencial em ${Luiza.city} e online em todo o ${Luiza.country}.`}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Cardo", data: cardoRegular, weight: 400, style: "normal" },
        { name: "Cardo", data: cardoItalic, weight: 400, style: "italic" },
        { name: "Vollkorn", data: vollkornRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
