import type { RichTextContent } from "@/domain/richText/RichTextContent";
import { richText } from "@/domain/richText/richText";
import type { Locale } from "@/domain/site/Locale";

// ---------------------------------------------------------------------------
// Privacidade (`/privacidade`) — CONCEPT §6's four sections plus the page's own
// opening and one added section, as the page and its components consume them.
// One member per tab in `page-privacidade`, so a field's admin path and its
// render path read the same.
//
// **The defaults are keyed by locale, and only on this page.** Every other page
// carries one Portuguese `*_DEFAULTS` object and lets Payload's `fallback: true`
// serve Portuguese to an English reader who reaches an untranslated field
// (RISK-001 of the master plan, accepted). That trade is wrong here: this is the
// page an anglophone opens *to check whether the site can be trusted with them*,
// and answering in a language they cannot read is the one place a fallback stops
// being a rough edge and becomes the defect. So `PRIVACIDADE_DEFAULTS` is a
// `Record<Locale, Privacidade>`, the mapper takes the locale, and `/en/privacy`
// degrades to English even with Payload switched off entirely.
//
// **On the copy in these defaults.** All of it is a draft, and unlike the rest of
// the site it is *factual rather than her voice*: every sentence states something
// the repository itself decides — the cookie's name, lifetime and payload
// (`src/i18n/routing.ts`), what `@vercel/analytics` collects and that it sets no
// cookie (mounted in `(frontend)/[locale]/layout.tsx`), that there is no form
// anywhere, that the bilhete is composed in the visitor's own browser
// (`whatsappUrlFromPhone` + `BilheteNote`), and CONCEPT §11's rule that symbols
// index content and never the visitor. Drafting it therefore does not put prose
// in her name the way drafting her clinical voice would (CONCEPT §11). It still
// needs her sign-off, and it is the one page on the site where a lawyer's read is
// worth more than a designer's — see plan/feature-page-privacidade-1.md.
// ---------------------------------------------------------------------------

/** One line of either honest list: a short title and the fact under it. */
export type PrivacyItem = { title: string; text: string };

export type Privacidade = {
  abertura: {
    heading: string;
    body: RichTextContent;
  };
  guarda: {
    heading: string;
    /** Short and specific. The asymmetry with `nuncaFaz` is the page's argument. */
    items: PrivacyItem[];
  };
  nuncaFaz: {
    heading: string;
    items: PrivacyItem[];
  };
  bilheteNota: {
    heading: string;
    body: string;
    linkLabel: string;
  };
  responsavel: {
    heading: string;
    body: RichTextContent;
    /** The LGPD rights sentence, kept as its own field so it can be corrected alone. */
    rights: string;
    /** Sigilo profissional — true regardless of anything else on this page. */
    confidentiality: string;
  };
};

const PT: Privacidade = {
  abertura: {
    heading: "Privacidade",
    // The whole page in three sentences (REQ-012): what stays in your browser,
    // what the statistics are, and why there is no cookie banner. Most people who
    // open this page are checking one thing and leaving.
    body: richText([
      "Este site quase não guarda nada. A única coisa que fica no seu navegador é a sua escolha de idioma, e as estatísticas de visita que eu recebo são anônimas e agregadas: não há nelas nenhuma forma de saber quem você é.",
      "É por isso que não existe aviso de cookies aqui: não há nada para você consentir.",
    ]),
  },
  guarda: {
    heading: "O que o site guarda",
    items: [
      {
        title: "A sua escolha de idioma",
        text: "Se você troca para inglês, o site anota essa escolha no seu próprio navegador, num cookie chamado NEXT_LOCALE que vale por um ano. Ele guarda uma palavra — português ou inglês — e nenhum número, código ou identificador.",
      },
      {
        title: "Estatísticas de visita",
        text: "Quantas pessoas abriram cada página, de que site chegaram e de que país. É assim que eu descubro se o atendimento a quem mora fora do Brasil está chegando a alguém. Sem cookies e sem identificador: contam visitas, não pessoas.",
      },
      {
        title: "Se você fechou a abertura cósmica da página inicial",
        text: "Essa preferência também fica no seu navegador, na memória local do site, e nunca sai do seu aparelho. Ela desaparece quando você limpa os dados de navegação.",
      },
    ],
  },
  nuncaFaz: {
    heading: "O que o site nunca faz",
    items: [
      {
        title: "Não sabe quem você é.",
        text: "Não há cadastro, não há login e não há um único formulário nestas páginas. Não existe onde digitar o seu nome, então não há nome nenhum para guardar.",
      },
      {
        title: "Não segue você.",
        text: "Nada de cookies de publicidade, pixel de rede social ou identificador que atravesse páginas. Nenhuma parte do site precisa saber que você já esteve aqui antes.",
      },
      {
        title: "Não personaliza nada para você.",
        text: "Todas as pessoas leem exatamente a mesma página; nada aqui muda de acordo com quem está lendo. Os símbolos deste site indexam conteúdo, nunca quem visita: em lugar nenhum você vai encontrar pedido de data de nascimento, o seu signo, ou uma leitura feita para você. A roda de A Análise é vocabulário junguiano, não um retrato seu.",
      },
      {
        title: "Não vende nem compartilha nada.",
        text: "Não existe dado seu para vender. Nada daqui vai para anunciante, corretor de dados ou lista de e-mails — não há lista de e-mails.",
      },
      {
        title: "Não interrompe você.",
        text: "Sem pop-up, sem chatbot, sem convite para assinar nada e sem aviso de cookies. Você lê o que quiser e vai embora quando quiser.",
      },
    ],
  },
  bilheteNota: {
    heading: "Sobre o bilhete",
    body: "Em A primeira conversa as mensagens já vêm escritas: você toca a que mais se parece com o seu caso e ela abre no WhatsApp com o texto pronto, que você ainda pode mudar ou apagar antes de enviar. Essa montagem acontece inteira no seu navegador — qual bilhete você tocou não é registrado em lugar nenhum, nem por mim nem pelo site — e a mensagem só chega até mim quando você a envia, do seu próprio WhatsApp. Quando ela chega, ela diz por onde a conversa começou porque é isso que está escrito nela, não porque o site tenha me contado.",
    linkLabel: "conhecer a primeira conversa",
  },
  responsavel: {
    heading: "Quem responde por isso",
    body: richText([
      "Quando você me escreve, os dados são só os que você decidiu me contar: o seu nome, o que você escreveu, o horário que a gente combinou. Uso isso para responder e para marcar, e não passo nada disso a ninguém.",
      "A conversa em si acontece no WhatsApp, que é um serviço de terceiros e tem as suas próprias regras — não são minhas nem deste site. Se você preferir escrever por e-mail, também pode.",
    ]),
    rights:
      "Pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir a confirmação de que eu tenho dados seus, o acesso a eles, a correção, a portabilidade ou a exclusão, e pode retirar o seu consentimento a qualquer momento. Basta me escrever.",
    confidentiality:
      "O conteúdo das sessões é coberto pelo sigilo profissional previsto no Código de Ética Profissional do Psicólogo, independentemente do que esta página diga.",
  },
};

/**
 * The English page, written rather than fallen back to (see the note above).
 * CON-002's register binds here as everywhere: she is a clinical psychologist
 * working in the Jungian tradition, never a "Jungian analyst".
 */
const EN: Privacidade = {
  abertura: {
    heading: "Privacy",
    body: richText([
      "This site keeps almost nothing. The only thing left in your browser is your choice of language, and the visit statistics I receive are anonymous and aggregate: there is nothing in them that could tell anyone who you are.",
      "That is why there is no cookie notice here: there is nothing for you to consent to.",
    ]),
  },
  guarda: {
    heading: "What the site keeps",
    items: [
      {
        title: "Your choice of language",
        text: "If you switch to English, the site notes that choice in your own browser, in a cookie called NEXT_LOCALE that lasts a year. It holds one word — Portuguese or English — and no number, code or identifier.",
      },
      {
        title: "Visit statistics",
        text: "How many people opened each page, which site they came from and which country they were in. That is how I find out whether my work with people living outside Brazil is reaching anyone. No cookies and no identifier: they count visits, not people.",
      },
      {
        title: "Whether you closed the cosmic overture on the home page",
        text: "That preference also stays in your browser, in the site's local storage, and never leaves your device. It disappears when you clear your browsing data.",
      },
    ],
  },
  nuncaFaz: {
    heading: "What the site never does",
    items: [
      {
        title: "It does not know who you are.",
        text: "There is no sign-up, no login and not one form on these pages. There is nowhere to type your name, so there is no name to keep.",
      },
      {
        title: "It does not follow you.",
        text: "No advertising cookies, no social-network pixel, no identifier that travels between pages. No part of the site needs to know you have been here before.",
      },
      {
        title: "It does not personalise anything for you.",
        text: "Everyone reads exactly the same page; nothing here changes according to who is reading. The symbols on this site index content, never the visitor: nowhere will you be asked for a date of birth, or for your sign, or offered a reading made for you. The wheel on Analysis is Jungian vocabulary, not a portrait of you.",
      },
      {
        title: "It does not sell or share anything.",
        text: "There is no data of yours to sell. Nothing here goes to an advertiser, a data broker or a mailing list — there is no mailing list.",
      },
      {
        title: "It does not interrupt you.",
        text: "No pop-ups, no chatbot, no invitation to subscribe to anything and no cookie notice. You read what you like and leave when you like.",
      },
    ],
  },
  bilheteNota: {
    heading: "About the note",
    body: "On The first conversation the messages come already written: you tap the one closest to your own case and it opens in WhatsApp with the text ready, which you can still change or delete before sending. That composition happens entirely in your own browser — which note you tapped is recorded nowhere, not by me and not by the site — and the message only reaches me when you send it yourself, from your own WhatsApp. When it arrives it says where the conversation began, because that is what is written in it, not because the site told me.",
    linkLabel: "see the first conversation",
  },
  responsavel: {
    heading: "Who is responsible for this",
    body: richText([
      "When you write to me, the only data there is is what you decided to tell me: your name, what you wrote, the time we agreed on. I use it to reply and to arrange a session, and I pass none of it to anyone.",
      "The conversation itself happens on WhatsApp, a third-party service with its own rules — they are neither mine nor this site's. If you would rather write by email, you can.",
    ]),
    rights:
      "Under Brazil's General Data Protection Law (Lei nº 13.709/2018) you can ask for confirmation that I hold data about you, for access to it, for correction, portability or deletion, and you can withdraw your consent at any time. Just write to me.",
    confidentiality:
      "The content of sessions is covered by the professional confidentiality set out in the Brazilian Psychologists' Code of Professional Ethics, regardless of anything this page says.",
  },
};

/** What renders when Payload is off or a field is blank, per locale. */
export const PRIVACIDADE_DEFAULTS: Record<Locale, Privacidade> = { pt: PT, en: EN };
