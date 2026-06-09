import type { Metadata } from "next";
import Link from "next/link";
import { getNavigation } from "@/app/actions/home";
import { getIdentity } from "@/app/actions/identity";
import { Footer, Header, StickyHeaderShell } from "@/ui/home";
import { BreadcrumbJsonLd } from "@/ui/lib/jsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getIdentity();
  return {
    title: "Privacidade",
    description:
      "Como os dados de quem visita e entra em contato são tratados, na forma da Lei Geral de Proteção de Dados (LGPD).",
    alternates: { canonical: `${BASE_URL}/privacidade` },
    openGraph: {
      title: `Privacidade — ${identity.fullName}`,
      description: "Tratamento de dados pessoais na forma da LGPD.",
      url: `${BASE_URL}/privacidade`,
      locale: "pt_BR",
      type: "article",
    },
  };
}

export const revalidate = 86400;

export default async function PrivacidadePage() {
  const [identity, navLinks] = await Promise.all([getIdentity(), getNavigation()]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Início", url: BASE_URL },
          { name: "Privacidade", url: `${BASE_URL}/privacidade` },
        ]}
      />

      <StickyHeaderShell>
        <Header identity={identity} navLinks={navLinks} />
      </StickyHeaderShell>
      <main id="main">
        <nav aria-label="Trilha" className="px-6 pt-24 sm:px-10 sm:pt-28 lg:pt-32">
          <p className="marginalia mx-auto max-w-3xl">
            <Link
              href="/"
              className="text-quill hover:text-terracotta decoration-terracotta/30 hover:decoration-terracotta underline decoration-1 underline-offset-[0.28em] transition-colors"
            >
              Início
            </Link>{" "}
            <span aria-hidden="true" className="text-terracotta/60">
              ·
            </span>{" "}
            <span className="text-foreground">Privacidade</span>
          </p>
        </nav>

        <section
          aria-labelledby="privacidade-heading"
          className="px-6 py-16 sm:px-10 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-3xl">
            <p className="tracked mb-5">Privacidade</p>
            <h1
              id="privacidade-heading"
              className="display text-foreground text-balance text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.12] tracking-[-0.01em]"
            >
              Como seus <span className="display-italic text-terracotta-deep">dados</span> são
              tratados
            </h1>

            {/* Clearly-marked placeholder — this notice is a draft pending
                review by Luiza (and, idealmente, orientação jurídica) before
                launch. Kept visible on purpose so it is never mistaken for a
                final, binding policy. */}
            <div
              role="note"
              className="border-rule text-quill mt-10 border px-6 py-5 text-[0.95rem] leading-[1.6]"
            >
              <p className="display-italic text-terracotta-deep mb-1">Rascunho — em revisão</p>
              <p>
                Este texto é um modelo provisório. Ainda será revisado e adequado por Luiza antes da
                publicação. Não o considere uma política de privacidade definitiva.
              </p>
            </div>

            <div className="body-prose text-ink mt-12 max-w-[62ch] space-y-10 text-[1.06rem] leading-[1.75]">
              <div>
                <h2 className="display text-foreground mb-3 text-[1.3rem] tracking-[-0.005em]">
                  Quem trata os dados
                </h2>
                <p>
                  Os dados pessoais coletados neste site são tratados por {identity.fullName},{" "}
                  {identity.role}, em {identity.city}–{identity.region}. Contato:{" "}
                  {identity.email ? (
                    <a
                      href={`mailto:${identity.email}`}
                      className="text-quill hover:text-terracotta decoration-terracotta/40 hover:decoration-terracotta underline decoration-1 underline-offset-[0.22em] transition-colors"
                    >
                      {identity.email}
                    </a>
                  ) : (
                    "pelo WhatsApp informado no site"
                  )}
                  .
                </p>
              </div>

              <div>
                <h2 className="display text-foreground mb-3 text-[1.3rem] tracking-[-0.005em]">
                  Quais dados são coletados
                </h2>
                <p>
                  Quando você entra em contato — por WhatsApp ou e-mail —, são tratados apenas os
                  dados que você decide compartilhar (como nome e a mensagem enviada), com a
                  finalidade de responder e, se for o caso, combinar uma primeira conversa. O site
                  não exige cadastro para ser lido.
                </p>
                <p className="marginalia mt-3">
                  [A confirmar: uso de cookies, métricas de acesso e formulário de contato, conforme
                  forem ativados.]
                </p>
              </div>

              <div>
                <h2 className="display text-foreground mb-3 text-[1.3rem] tracking-[-0.005em]">
                  Finalidade e base legal
                </h2>
                <p>
                  Os dados são usados exclusivamente para o contato solicitado e para o
                  acompanhamento clínico, quando houver. Não são vendidos nem compartilhados com
                  terceiros para fins de marketing.
                </p>
              </div>

              <div>
                <h2 className="display text-foreground mb-3 text-[1.3rem] tracking-[-0.005em]">
                  Seus direitos (LGPD)
                </h2>
                <p>
                  Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode
                  solicitar a confirmação do tratamento, o acesso, a correção, a portabilidade ou a
                  exclusão dos seus dados, bem como revogar o consentimento. Para isso, basta entrar
                  em contato pelos canais acima.
                </p>
              </div>

              <div>
                <h2 className="display text-foreground mb-3 text-[1.3rem] tracking-[-0.005em]">
                  Sigilo profissional
                </h2>
                <p>
                  O conteúdo das sessões é protegido pelo sigilo profissional previsto no Código de
                  Ética Profissional do Psicólogo, independentemente do disposto nesta página.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer identity={identity} navLinks={navLinks} />
    </>
  );
}
