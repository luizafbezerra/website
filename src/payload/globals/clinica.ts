import type { GlobalConfig } from "payload";
import { revalidatePath } from "next/cache";
import { MACHINE_INDEX_PATH, twinEntries } from "@/domain/markdown/twinPath";
import { localizedText, localizedTextarea } from "../fields/copyFields";

/**
 * "A Clínica" — every cross-page fact of the practice, stored exactly once
 * (REQ-003). Anything a visitor can read on more than one page lives here:
 * who she is, how to reach her, whether she is taking new patients, what it
 * costs, the note openers, the Jung passages, the privacy line.
 *
 * The page globals under "Páginas" hold only what belongs to a single page, so
 * an edit here changes the whole site and an edit there changes one screen.
 * That split is the answer to "which page am I editing?" (GOAL-004).
 *
 * NAMED tabs: each tab owns a data path (`identity.fullName`, `contact.email`),
 * which keeps the mapper readable and lets two sections use the same field name
 * without colliding. There is no in-place migration to preserve — the old
 * `settings` global is dropped in the same phase.
 */
export const Clinica: GlobalConfig = {
  slug: "clinica",
  label: "A Clínica",
  admin: {
    group: "A clínica",
    description:
      "Os fatos que valem para todo o site. Editado uma vez aqui, muda em todas as páginas.",
  },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        // The seed writes this global outside a Next request scope, where
        // `revalidatePath` throws; it passes `skipRevalidate`. Real admin saves
        // run inside a request. `layout` because these facts render in the
        // chrome of every page, not on one route.
        if (context?.skipRevalidate) return;
        revalidatePath("/", "layout");

        // `("/", "layout")` covers the pages but not the route handlers, and
        // these facts are in every Markdown twin's frame (the lockup, her
        // positioning sentence, the credential strip, availability, WhatsApp,
        // email) as well as in the machine index (TASK-043). Each has to be named.
        for (const twin of twinEntries()) revalidatePath(twin.path);
        revalidatePath(MACHINE_INDEX_PATH);
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ── Identidade ───────────────────────────────────────────────────────
        {
          name: "identity",
          label: "Identidade",
          description: "Quem recebe e sob que nome. A frase de posicionamento é a mais importante.",
          fields: [
            {
              name: "clinicName",
              type: "text",
              label: "Nome da clínica",
              required: true,
              admin: {
                description: "Fecha o título de cada página e abre o colofão do rodapé.",
              },
            },
            { name: "fullName", type: "text", label: "Nome completo", required: true },
            {
              name: "shortName",
              type: "text",
              label: "Nome curto",
              admin: { description: "Forma familiar, ex.: para a legenda do retrato." },
            },
            localizedText({
              name: "role",
              label: "Profissão",
              description:
                'Em português: "Psicóloga clínica". Em inglês: "clinical psychologist working in the analytical-psychology tradition" — "Jungian analyst" é título protegido e não pode ser usado.',
            }),
            {
              name: "credential",
              type: "text",
              label: "Registro (CRP)",
              admin: {
                description:
                  "Registro no Conselho, ex.: CRP 06/123456. Em branco, o site omite a linha em vez de inventar um número.",
              },
            },
            {
              name: "credentials",
              type: "array",
              label: "Linha de credencial",
              labels: { singular: "Item", plural: "Itens" },
              admin: {
                description:
                  "A tira de fatos que aparece nas páginas principais, na ordem em que você colocar aqui. O CRP acima entra sozinho na frente. Só entram fatos confirmados por você — apague qualquer item de que não tenha certeza.",
              },
              fields: [
                localizedText({
                  name: "item",
                  label: "Item",
                  required: true,
                  description: "Ex.: PUC-SP · clínica desde 2014 · Brasil e exterior.",
                }),
              ],
            },
            localizedTextarea({
              name: "positioning",
              label: "Frase de posicionamento",
              description:
                "A frase canônica da clínica, palavra por palavra. Aparece no hero, na descrição das páginas e nos dados estruturados que o Google e os assistentes leem.",
            }),
          ],
        },
        // ── Contato ──────────────────────────────────────────────────────────
        {
          name: "contact",
          label: "Contato",
          description: "O WhatsApp é o caminho principal — todo botão do site monta o link daqui.",
          fields: [
            {
              name: "whatsappE164",
              type: "text",
              label: "WhatsApp (formato E.164)",
              admin: {
                description: "Formato E.164 (ex.: +5511964158128) — define o link do WhatsApp.",
              },
            },
            {
              name: "whatsappDisplay",
              type: "text",
              label: "WhatsApp (exibição)",
              admin: { description: "Forma legível exibida na tela, ex.: +55 11 96415-8128." },
            },
            { name: "email", type: "email", label: "E-mail" },
            { name: "instagramUrl", type: "text", label: "URL do Instagram" },
            {
              name: "instagramHandle",
              type: "text",
              label: "Usuário do Instagram",
              admin: { description: "Ex.: @simbolos.do.self" },
            },
          ],
        },
        // ── Disponibilidade ──────────────────────────────────────────────────
        {
          name: "availability",
          label: "Disponibilidade",
          description:
            "Uma linha honesta em todo o site. Dizer que não há vagas evita mensagens que caem no silêncio — e nunca cria urgência.",
          fields: [
            {
              name: "state",
              type: "select",
              label: "Estado",
              required: true,
              defaultValue: "open",
              options: [
                { label: "Com horários disponíveis", value: "open" },
                { label: "Lista de espera curta", value: "waitlist" },
                {
                  label: "Sem novos atendimentos no momento — escreva e eu aviso",
                  value: "closed",
                },
              ],
            },
            localizedText({
              name: "responseWindow",
              label: "Tempo de resposta",
              description:
                'Ex.: "respondo em até um dia útil (horário de Brasília)". Sempre ancorado no horário de Brasília.',
            }),
          ],
        },
        // ── Honorários ───────────────────────────────────────────────────────
        {
          name: "fees",
          label: "Honorários",
          description:
            'Todos opcionais. Enquanto um valor estiver em branco, o site escreve "a combinar" — nunca um campo vazio.',
          fields: [
            {
              name: "analysis",
              type: "text",
              label: "Análise (por sessão)",
              admin: { description: "Ex.: R$ 250. Em reais nas páginas em português." },
            },
            {
              name: "careerGuidance",
              type: "text",
              label: "Orientação profissional",
              admin: {
                description: "Valor do percurso ou da sessão, como você preferir escrever.",
              },
            },
            localizedTextarea({
              name: "internationalNote",
              label: "Nota internacional",
              description:
                'Enquadramento para quem está fora, ex.: "valores em dólar/euro — combinamos na primeira conversa". O site nunca converte moeda automaticamente.',
            }),
          ],
        },
        // ── Bilhetes ─────────────────────────────────────────────────────────
        {
          name: "notes",
          label: "Bilhetes",
          description:
            "As mensagens já escritas que a pessoa toca para te enviar. A escolha dela conta de onde a conversa começou — sem rastrear ninguém.",
          fields: [
            localizedTextarea({
              name: "analysis",
              label: "Bilhete — análise",
              description: "Para quem chega pela porta da análise.",
            }),
            localizedTextarea({
              name: "careerGuidance",
              label: "Bilhete — orientação profissional",
              description: "Para quem chega pela porta da orientação profissional e de carreira.",
            }),
            localizedTextarea({
              name: "unsure",
              label: "Bilhete — não sei qual caminho é o meu",
              description: "Para quem ainda não sabe qual das duas portas é a sua.",
            }),
            {
              name: "english",
              type: "textarea",
              label: "Bilhete — em inglês",
              admin: {
                description:
                  "Escrito em inglês de propósito, não traduzido: é o bilhete oferecido a quem fala inglês, inclusive nas páginas em português.",
              },
            },
            localizedTextarea({
              name: "international",
              label: "Bilhete — quem mora fora do Brasil",
              description:
                "Só aparece na página Brasil e exterior, no lugar dos quatro da primeira conversa. Diz que a pessoa mora fora — é o que te conta, na própria mensagem, de onde a conversa começou.",
            }),
          ],
        },
        // ── Passagens de Jung ────────────────────────────────────────────────
        {
          name: "jung",
          label: "Passagens de Jung",
          description:
            "O conjunto de onde o site sorteia uma passagem por visita. Quanto mais você acrescenta, mais o site diz algo novo entre uma visita e outra.",
          fields: [
            {
              name: "passages",
              type: "array",
              label: "Passagens",
              labels: { singular: "Passagem", plural: "Passagens" },
              fields: [
                localizedTextarea({ name: "text", label: "Texto", required: true }),
                {
                  name: "attribution",
                  type: "text",
                  label: "Fonte",
                  admin: { description: "Ex.: C. G. Jung, Obras Completas, vol. 9/1." },
                },
              ],
            },
          ],
        },
        // ── Privacidade ──────────────────────────────────────────────────────
        {
          name: "privacy",
          label: "Privacidade",
          description:
            "A linha curta que resume, em todo o site, o que ele guarda e o que não faz.",
          fields: [
            localizedTextarea({
              name: "line",
              label: "Linha de privacidade",
              description:
                "Ex.: o site guarda apenas a sua escolha de idioma, no seu próprio navegador.",
            }),
          ],
        },
      ],
    },
  ],
};
