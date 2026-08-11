import { describe, expect, it } from "vitest";
import { ANALISE_DEFAULTS } from "@/domain/analise/Analise";
import { CLINICA_DEFAULTS } from "@/domain/clinica/Clinica";
import { INTERNACIONAL_DEFAULTS } from "@/domain/internacional/Internacional";
import { ORIENTACAO_PROFISSIONAL_DEFAULTS } from "@/domain/orientacaoProfissional/OrientacaoProfissional";
import { PRIMEIRA_CONVERSA_DEFAULTS } from "@/domain/primeiraConversa/PrimeiraConversa";
import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { extractParagraphs } from "@/domain/richText/extractParagraphs";
import { SOBRE_DEFAULTS } from "@/domain/sobre/Sobre";

// ---------------------------------------------------------------------------
// Her supplied text, pinned.
//
// Luiza sent a block of her own prose on 2026-08-07. Most of it is now the
// shipped default on four pages, and `docs/source-copy-2026-08-07.md` is the
// ledger that records where each paragraph went and which nine mechanical
// corrections were applied to it.
//
// This file is the enforcement. CONCEPT §11 makes her text the source copy, and
// the failure mode it guards against is not malice but helpfulness: an agent
// running a style pass, tightening a sentence, "fixing" a triad or an `-ing`
// tail, straightening a curly quote, replacing an em dash with a hyphen. Every
// one of those is an improvement to a draft and a corruption of hers.
//
// So the strings below are duplicated on purpose. A test that imported its
// expectations from the same constant it checks would pass no matter what
// happened to the copy. If you are here because this file failed:
//
//   · the copy changed and the change was wrong → revert the copy;
//   · the copy changed and she asked for it → add a row to the ledger's
//     correction table first, then update the string here to match.
//
// Never the second without the first. The ledger is what she signs off on.
// ---------------------------------------------------------------------------

/** Her paragraphs as they must read after the ledger's corrections. */
const HERS = {
  positioning: "Clínica de psicologia analítica (Jung) on-line para todo o Brasil e exterior.",

  metodoNaoRemovo:
    "Não removo sintomas, trabalho o fortalecimento do seu ego para que esses sintomas não sejam necessários um dia. A clínica analítica não trabalha para eliminar sintomas, lidamos com a psicologia profunda.",
  metodoComoFazemos:
    "Como fazemos isso? Através da conscientização das próprias emoções, da personalidade, do momento de vida, como se reage às tristezas e felicidades da própria existência. Aliado a isso, o trabalho de forma consistente, através de encontros semanais.",
  metodoAnticapitalista:
    "Gosto de dizer que a psicologia clínica é o trabalho mais “anticapitalista” que existe, pois o que é oferecido não traz uma solução rápida tampouco indolor. Por uma questão ética, o conteúdo dos encontros é ditado pelo paciente, de acordo com aquilo que ele está preparado para trazer.",
  metodoPontuacoes:
    "Eu só farei pontuações daquilo que acredito que você esteja preparado para receber, respeitando o tempo do seu processo e a sua subjetividade. Não existe pressa no processo de individuação.",

  analiseSintoma:
    "Diferente de abordagens que focam apenas em calar um sintoma (como a ansiedade ou a angústia), a clínica da psicologia profunda entende que o sintoma tem um propósito: ele é um chamado do nosso inconsciente pedindo atenção.",
  analiseIntegral:
    "Nesta abordagem, olhamos para o ser humano de forma integral. Nós exploramos não apenas a sua história de vida e seus desafios conscientes, mas também a linguagem do seu mundo interno. Trabalhamos com a ideia de Individuação — o processo contínuo de se tornar quem você realmente é, integrando suas luzes e sombras.",
  analiseColaboracao:
    "É um trabalho de colaboração. Juntos, vamos construir pontes entre o seu consciente e o seu inconsciente, promovendo mais equilíbrio, sentido e vitalidade para a sua vida.",
  analiseJornada:
    "Se você sente que é o momento de iniciar essa jornada de volta para si mesmo(a), será uma alegria acompanhar o seu processo.",

  orientacaoEspecializada:
    "Sou especializada em orientação profissional e orientação de carreira pela PUC-SP. Através de testes psicológicos, conversas e atividades propostas, posso te ajudar a descobrir a profissão que faz mais sentido no momento atual da sua vida.",
  orientacaoEncontros: "São feitos até doze encontros semanais, on-line.",

  sobreJornada:
    "A minha jornada na psicologia já soma vinte e dois anos, com atuação direta na clínica desde 2014. Meu objetivo é oferecer um espaço seguro de escuta, reflexão e transformação para quem busca se conhecer de forma autêntica e profunda.",
  sobreAbordagem:
    "A minha abordagem teórica e acadêmica é a Psicologia Analítica do Carl Gustav Jung. Na primeira vez em que entrei em contato com a sua teoria, estava no segundo ano de faculdade, foi um caminho sem volta para mim! Desde então fiz matérias focadas nessa linha, assim como o TCC e posteriormente as pós-graduações.",
  sobreEstudo:
    "Acredito que o cuidado com o outro exige estudo constante e aprofundamento rigoroso.",

  internacionalDistancia:
    "Para garantir que a distância não seja um obstáculo para o seu processo de autoconhecimento, os meus atendimentos acontecem no formato on-line.",

  // Her 2026-08 FAQ answer about valores, minus its closing clause (ledger row
  // 10). It is the site's only statement of how a value is arrived at, and it
  // prints on the four pages that quote a price.
  valores:
    "Combinamos os valores antes da primeira sessão, conforme a modalidade e a frequência. Para saber o valor atual, é só me escrever no WhatsApp.",
} as const;

/** Her six course names, in the order she gave them. */
const HER_FORMACAO = [
  { title: "Graduação em Psicologia", institution: "PUC-SP" },
  { title: "Pós-graduação em Psicologia Clínica", institution: "Instituto Numen" },
  { title: "Aprimoramento em Psicologia Clínica Junguiana", institution: "PUC-SP" },
  { title: "Aprimoramento em Orientação Profissional e de Carreira", institution: "PUC-SP" },
  { title: "Extensão em Psicologia e Religião", institution: "PUC-SP" },
  { title: "Extensão em Psicologia, Religião e Fenômenos Anômalos", institution: "USP" },
] as const;

/**
 * One plain string per paragraph, italic and bold runs concatenated back in.
 *
 * Her sentences are pinned at paragraph granularity rather than run granularity
 * on purpose: where the italic falls inside `um caminho sem volta` is a typographic
 * decision the design system owns, but the words either side of it are hers.
 */
function paragraphsOf(content: RichTextContent): string[] {
  return extractParagraphs(content).map((runs) => runs.map((run) => run.text).join(""));
}

describe("her supplied text, 2026-08-07", () => {
  it("keeps the positioning sentence byte-identical (SRC-A)", () => {
    expect(CLINICA_DEFAULTS.positioning).toBe(HERS.positioning);
  });

  describe("A análise", () => {
    it("keeps her five method paragraphs, with only the two logged corrections (SRC-C, SRC-D)", () => {
      expect(paragraphsOf(ANALISE_DEFAULTS.oMetodo.body).slice(1)).toEqual([
        HERS.metodoNaoRemovo,
        HERS.metodoComoFazemos,
        HERS.metodoAnticapitalista,
        HERS.metodoPontuacoes,
      ]);
    });

    it("opens the abertura's second paragraph with her symptom sentence (SRC-F.1)", () => {
      expect(paragraphsOf(ANALISE_DEFAULTS.abertura.body)[1]).toBe(HERS.analiseSintoma);
    });

    it("carries her individuação paragraph, guardrail clause appended (SRC-F.2)", () => {
      const individuacao = paragraphsOf(ANALISE_DEFAULTS.oMetodo.individuacao)[0];
      expect(individuacao).toContain(HERS.analiseIntegral);
      // CON-006: the clause is ours and stays until her sign-off removes it.
      expect(individuacao).toBe(
        `${HERS.analiseIntegral} É um conceito que descreve a direção do trabalho, não um resultado que a análise prometa.`,
      );
    });

    it("keeps her collaboration sentence whole (SRC-F.4)", () => {
      expect(ANALISE_DEFAULTS.oMetodo.closingLine).toBe(HERS.analiseColaboracao);
    });

    it("keeps her closing invitation, si mesmo(a) included (SRC-H)", () => {
      expect(ANALISE_DEFAULTS.pratico.comecar.body).toBe(HERS.analiseJornada);
    });

    it("italicises Individuação where she capitalised it", () => {
      const runs = extractParagraphs(ANALISE_DEFAULTS.oMetodo.individuacao)[0];
      expect(runs.filter((run) => run.italic).map((run) => run.text)).toEqual(["Individuação"]);
    });
  });

  describe("Orientação profissional e de carreira", () => {
    it("opens with her own paragraphs (SRC-B)", () => {
      const [first, second] = paragraphsOf(ORIENTACAO_PROFISSIONAL_DEFAULTS.abertura.body);
      expect(first).toBe(HERS.orientacaoEspecializada);
      expect(second).toMatch(/^São feitos até doze encontros semanais, on-line\./);
    });

    it("does not repeat her deliverable phrase in oPercurso (GUD-001)", () => {
      expect(ORIENTACAO_PROFISSIONAL_DEFAULTS.oPercurso.deliverable).not.toContain(
        "a profissão que faz mais sentido",
      );
    });
  });

  describe("Sobre", () => {
    it("carries her two bio paragraphs (SRC-E.1, E.2, E.3)", () => {
      const paragraphs = paragraphsOf(SOBRE_DEFAULTS.quemE.body);
      expect(paragraphs[1]).toBe(HERS.sobreJornada);
      expect(paragraphs[2]).toBe(HERS.sobreAbordagem);
    });

    it("keeps her exclamation mark", () => {
      expect(paragraphsOf(SOBRE_DEFAULTS.quemE.body)[2]).toContain("sem volta para mim!");
    });

    it("carries her formação intro (SRC-E.4)", () => {
      expect(SOBRE_DEFAULTS.formacao.intro).toBe(HERS.sobreEstudo);
    });

    it("names all six courses as she named them, with no invented year (SRC-E.5)", () => {
      expect(
        SOBRE_DEFAULTS.formacao.items.map(({ title, institution }) => ({ title, institution })),
      ).toEqual(HER_FORMACAO);
      expect(SOBRE_DEFAULTS.formacao.items.every((item) => item.period === null)).toBe(true);
    });
  });

  describe("Brasil e exterior", () => {
    it("opens with her sentence about distance (SRC-G.1)", () => {
      expect(paragraphsOf(INTERNACIONAL_DEFAULTS.abertura.body)[0]).toBe(
        HERS.internacionalDistancia,
      );
    });
  });

  describe("Valores", () => {
    it("keeps her pricing sentence, with only the logged trim (ledger row 10)", () => {
      expect(CLINICA_DEFAULTS.fees.note).toBe(HERS.valores);
    });

    it("dropped only the response window, and nothing else of hers", () => {
      // The clause the ledger licensed cutting, and the reason it could be cut:
      // both /primeira-conversa and the home's agenda line already answer it.
      expect(CLINICA_DEFAULTS.fees.note).not.toContain("respondo em até um dia útil");
      expect(PRIMEIRA_CONVERSA_DEFAULTS.logistica.doubts[1].answer).toContain("Em até um dia útil");
    });

    it("says where the value is agreed, and never inside the session being priced", () => {
      expect(CLINICA_DEFAULTS.fees.note).toContain("WhatsApp");
      expect(CLINICA_DEFAULTS.fees.internationalNote).not.toContain("na primeira conversa");
    });
  });

  describe("her typography survives (CON-004)", () => {
    it("keeps the curly quotes around anticapitalista", () => {
      const paragraph = paragraphsOf(ANALISE_DEFAULTS.oMetodo.body)[3];
      expect(paragraph).toContain("“anticapitalista”");
      expect(paragraph).not.toContain('"anticapitalista"');
    });

    it("keeps the em dash in her individuação sentence", () => {
      expect(paragraphsOf(ANALISE_DEFAULTS.oMetodo.individuacao)[0]).toContain(
        "de Individuação — o processo",
      );
    });
  });

  describe("the corrections the ledger licensed, and no others", () => {
    it("fixed the agreement in é ditado (row 1)", () => {
      const paragraph = paragraphsOf(ANALISE_DEFAULTS.oMetodo.body)[3];
      expect(paragraph).toContain("o conteúdo dos encontros é ditado");
      expect(paragraph).not.toContain("são ditados");
    });

    it("closed the anti capitalista space (row 2)", () => {
      expect(paragraphsOf(ANALISE_DEFAULTS.oMetodo.body)[3]).not.toContain("anti capitalista");
    });

    it("hyphenated PUC-SP and spelled out doze (rows 3, 6)", () => {
      const abertura = paragraphsOf(ORIENTACAO_PROFISSIONAL_DEFAULTS.abertura.body).join(" ");
      expect(abertura).toContain("PUC-SP");
      expect(abertura).not.toContain("PUC - SP");
      expect(abertura).not.toContain("12 encontros");
    });

    it("hyphenated pós-graduações and fixed the preposition (rows 4, 5)", () => {
      const paragraph = paragraphsOf(SOBRE_DEFAULTS.quemE.body)[2];
      expect(paragraph).toContain("pós-graduações");
      expect(paragraph).toContain("Na primeira vez em que entrei");
      expect(paragraph).not.toContain("À primeira vez");
    });

    it("spelled on-line her own way, and vinte e dois in prose (rows 7, 8)", () => {
      expect(paragraphsOf(INTERNACIONAL_DEFAULTS.abertura.body)[0]).toContain("formato on-line");
      expect(paragraphsOf(SOBRE_DEFAULTS.quemE.body)[1]).toContain("vinte e dois anos");
    });

    it("left si mesmo(a) exactly as she wrote it", () => {
      expect(ANALISE_DEFAULTS.pratico.comecar.body).toContain("si mesmo(a)");
    });
  });
});
