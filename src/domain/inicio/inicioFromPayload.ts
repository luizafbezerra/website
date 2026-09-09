import { pageImageFrom } from "@/domain/media/pageImageFrom";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { ZODIAC_SIGN_IDS, type ZodiacSignId } from "@/domain/zodiac/zodiacContent";
import type { PayloadPageInicio } from "@/infrastructure/payload/getPageInicioGlobal";
import { type Beat, type Door, type Inicio, INICIO_DEFAULTS, type SignReading } from "./Inicio";

/** Blank strings are absences, not values — a cleared field must fall back. */
function filled(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

/**
 * A rich-text field is empty when Lexical has no paragraphs, which is what an
 * editor who selected everything and deleted leaves behind — not `null`.
 */
function filledRichText(value: RichTextContent | null | undefined): RichTextContent | null {
  if (!value) return null;
  const children = value.root?.children;
  return Array.isArray(children) && children.length > 0 ? value : null;
}

/**
 * Her twelve readings. Every sign is present in the result so the wheel can look
 * any of them up, and every unwritten half is `null` — REQ-007's gate is this
 * mapping, not a component's conditional.
 */
function readingsFrom(raw: PayloadPageInicio["mandala"]): Record<ZodiacSignId, SignReading> {
  return Object.fromEntries(
    ZODIAC_SIGN_IDS.map((id) => {
      const stored = raw?.[id];
      return [id, { reading: filled(stored?.reading), vedicReading: filled(stored?.vedicReading) }];
    }),
  ) as Record<ZodiacSignId, SignReading>;
}

function doorFrom(raw: NonNullable<PayloadPageInicio["doisCaminhos"]>["analysis"], fallback: Door) {
  return {
    title: filled(raw?.title) ?? fallback.title,
    body: filled(raw?.body) ?? fallback.body,
    linkLabel: filled(raw?.linkLabel) ?? fallback.linkLabel,
  };
}

/**
 * The three beats, in stored order; a beat with no text has nothing to say.
 *
 * An empty array falls back to the defaults. Payload materializes an untouched
 * array field as `[]` rather than as absent, so the two states "she cleared this"
 * and "she never opened this tab" are the same value — and of the two readings,
 * only one is safe: "como é começar" is a section CONCEPT §6 requires, and
 * treating `[]` as a decision made it vanish from the page silently.
 */
function beatsFrom(raw: NonNullable<PayloadPageInicio["comoComecar"]>["beats"]): Beat[] {
  if (!Array.isArray(raw) || raw.length === 0) return INICIO_DEFAULTS.comoComecar.beats;

  return raw
    .map((beat, index) => ({
      // A missing numeral is scaffolding she should not have to type.
      numeral: filled(beat?.numeral) ?? ROMAN_NUMERALS[index] ?? String(index + 1),
      text: filled(beat?.text),
    }))
    .filter((beat): beat is Beat => beat.text !== null);
}

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V"];

/** Normalize the raw `page-inicio` global, falling back field by field. */
export function inicioFromPayload(doc: PayloadPageInicio): Inicio {
  const defaults = INICIO_DEFAULTS;

  return {
    hero: {
      lead: filledRichText(doc.hero?.lead) ?? defaults.hero.lead,
      ctaPrimaryLabel: filled(doc.hero?.ctaPrimaryLabel) ?? defaults.hero.ctaPrimaryLabel,
      ctaSecondaryLabel: filled(doc.hero?.ctaSecondaryLabel) ?? defaults.hero.ctaSecondaryLabel,
      portrait: pageImageFrom(doc.hero?.portrait),
    },
    instagram: {
      heading: filled(doc.instagram?.heading) ?? defaults.instagram.heading,
      intro: filled(doc.instagram?.intro) ?? defaults.instagram.intro,
    },
    doisCaminhos: {
      heading: filled(doc.doisCaminhos?.heading) ?? defaults.doisCaminhos.heading,
      intro: filled(doc.doisCaminhos?.intro) ?? defaults.doisCaminhos.intro,
      analysis: doorFrom(doc.doisCaminhos?.analysis, defaults.doisCaminhos.analysis),
      careerGuidance: doorFrom(
        doc.doisCaminhos?.careerGuidance,
        defaults.doisCaminhos.careerGuidance,
      ),
      boundary: filled(doc.doisCaminhos?.boundary) ?? defaults.doisCaminhos.boundary,
    },
    oSintoma: {
      heading: filled(doc.oSintoma?.heading) ?? defaults.oSintoma.heading,
      body: filledRichText(doc.oSintoma?.body) ?? defaults.oSintoma.body,
      linkLabel: filled(doc.oSintoma?.linkLabel) ?? defaults.oSintoma.linkLabel,
    },
    mandala: {
      heading: filled(doc.mandala?.heading) ?? defaults.mandala.heading,
      intro: filled(doc.mandala?.intro) ?? defaults.mandala.intro,
      readings: readingsFrom(doc.mandala),
    },
    cosmos: {
      caption: filled(doc.cosmos?.caption),
    },
    sobreDigest: {
      heading: filled(doc.sobreDigest?.heading) ?? defaults.sobreDigest.heading,
      body: filledRichText(doc.sobreDigest?.body) ?? defaults.sobreDigest.body,
      linkLabel: filled(doc.sobreDigest?.linkLabel) ?? defaults.sobreDigest.linkLabel,
    },
    brasilExterior: {
      heading: filled(doc.brasilExterior?.heading) ?? defaults.brasilExterior.heading,
      body: filled(doc.brasilExterior?.body) ?? defaults.brasilExterior.body,
      linkLabel: filled(doc.brasilExterior?.linkLabel) ?? defaults.brasilExterior.linkLabel,
    },
    comoComecar: {
      heading: filled(doc.comoComecar?.heading) ?? defaults.comoComecar.heading,
      beats: beatsFrom(doc.comoComecar?.beats),
      linkLabel: filled(doc.comoComecar?.linkLabel) ?? defaults.comoComecar.linkLabel,
    },
    vozes: { heading: filled(doc.vozes?.heading) ?? defaults.vozes.heading },
    contato: {
      eyebrow: filled(doc.contato?.eyebrow) ?? defaults.contato.eyebrow,
      heading: filled(doc.contato?.heading) ?? defaults.contato.heading,
      body: filledRichText(doc.contato?.body) ?? defaults.contato.body,
      whatsappLabel: filled(doc.contato?.whatsappLabel) ?? defaults.contato.whatsappLabel,
    },
  };
}
