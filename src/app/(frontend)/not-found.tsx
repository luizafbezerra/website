import type { Metadata } from "next";
import Link from "next/link";
import { getNavigation } from "@/app/actions/home";
import { getIdentity } from "@/app/actions/identity";
import { Footer, Header, StickyHeaderShell } from "@/ui/home";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default async function NotFound() {
  const [identity, navLinks] = await Promise.all([getIdentity(), getNavigation()]);

  const linkClass =
    "display-italic text-foreground decoration-terracotta hover:text-terracotta inline-flex text-[1.08rem] underline decoration-1 underline-offset-[0.22em] transition-colors";

  return (
    <>
      <StickyHeaderShell>
        <Header identity={identity} navLinks={navLinks} />
      </StickyHeaderShell>
      <main
        id="main"
        className="flex min-h-[60vh] items-center px-6 py-32 sm:px-10 sm:py-44 lg:py-52"
      >
        <div className="mx-auto max-w-2xl text-center sm:text-left">
          <p className="tracked mb-6">Erro 404</p>
          <h1 className="display text-foreground text-balance text-[clamp(2rem,4.4vw,3rem)] leading-[1.12] tracking-[-0.01em]">
            Esta página <span className="display-italic text-terracotta-deep">se perdeu</span> pelo
            caminho.
          </h1>
          <p className="body-prose text-ink mt-8 max-w-[52ch] text-[1.085rem] leading-[1.74]">
            O endereço que você procura não existe ou foi movido — acontece. Volte ao início ou, se
            preferir falar comigo, o WhatsApp está sempre por perto.
          </p>

          <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-10">
            <Link href="/" className={linkClass}>
              Voltar ao início
            </Link>
            <a
              href={identity.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Conversar pelo WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer identity={identity} navLinks={navLinks} />
    </>
  );
}
