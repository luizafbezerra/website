import type { GlobalConfig } from "payload";
import { localizedRichText, localizedText } from "../../fields/copyFields";
import { mediaSlot } from "../../fields/mediaSlot";
import { PAGES_GROUP, pageAccess, revalidatePageHook } from "./shared";

/**
 * Sobre (`/sobre`) — meet the person behind the name and verify the credentials
 * are real. The formação section is the record, plainly: no editorializing, the
 * list speaks for itself.
 *
 * This is the one page written entirely in her first person: every other page is
 * Símbolos do Self speaking, this one is Luiza (CONCEPT §2). The credential strip
 * is NOT a tab here — it comes from A Clínica, because CONCEPT §8.8 puts the same
 * strip on every core page and a per-page copy drifts the moment one is edited
 * (the same reason TASK-035 dropped the identical tab from `page-inicio`).
 */
export const PageSobre: GlobalConfig = {
  slug: "page-sobre",
  label: "Sobre",
  admin: {
    group: PAGES_GROUP,
    description: "A sua página: quem recebe, a formação por inteiro e a história da clínica.",
  },
  access: pageAccess,
  hooks: { afterChange: revalidatePageHook("sobre") },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "abertura",
          label: "Abertura",
          description:
            "O começo da página: o título e as primeiras linhas, em primeira pessoa, que já dizem quem você é, o que você atende, em que idiomas e de onde — para leitores e para buscadores. A tira de credenciais entra logo abaixo, vinda de A Clínica.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({
              name: "lead",
              label: "Primeiras linhas",
              description:
                "Duas ou três frases: psicóloga clínica, a tradição junguiana, os dois atendimentos, on-line, em português e inglês, Brasil e exterior.",
            }),
          ],
        },
        {
          name: "quemE",
          label: "2 · Quem é a Luiza",
          description:
            "Vinte e dois anos na psicologia, clínica desde 2014, Jung no segundo ano — um caminho sem volta. Escreva em primeira pessoa.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
            mediaSlot({
              name: "portrait",
              label: "Retrato",
              description: "O mesmo retrato do início, ou um segundo quadro da mesma sessão.",
            }),
          ],
        },
        {
          name: "formacao",
          label: "3 · Formação",
          description:
            "O registro acadêmico por inteiro, sem adjetivos: graduação, pós, aprimoramentos, extensões. Uma linha por item.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            {
              name: "items",
              type: "array",
              label: "Formação",
              labels: { singular: "Item", plural: "Itens" },
              fields: [
                localizedText({ name: "title", label: "Curso ou título", required: true }),
                { name: "institution", type: "text", label: "Instituição" },
                {
                  name: "period",
                  type: "text",
                  label: "Período",
                  admin: {
                    description:
                      "Opcional. Em branco, a linha mostra só o curso e a instituição — melhor deixar vazio do que arriscar um ano errado.",
                  },
                },
              ],
            },
          ],
        },
        {
          name: "aClinica",
          label: "4 · A clínica",
          description:
            "A história de Símbolos do Self: da página com 45 mil pessoas à clínica com o mesmo nome. O lugar e a pessoa. É aqui que o site conta essa história por inteiro — o início só resume e manda para cá.",
          fields: [
            localizedText({ name: "heading", label: "Título" }),
            localizedRichText({ name: "body", label: "Texto" }),
            localizedText({
              name: "linkLabel",
              label: "Rótulo do link para A primeira conversa",
              description:
                "A única saída da página, em voz baixa — para quem terminou de ler e quer saber como é começar.",
            }),
          ],
        },
      ],
    },
  ],
};
