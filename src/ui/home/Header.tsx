import Link from "next/link";
import { Luiza, Navigation } from "@/core";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-6 pt-8 sm:px-10 sm:pt-10">
        <Link
          href="/"
          className="group inline-flex flex-col leading-tight no-underline"
          aria-label={`${Luiza.fullName} — início`}
        >
          <span className="display-italic text-foreground text-xl sm:text-2xl">
            {Luiza.fullName}
          </span>
          <span className="marginalia mt-1 hidden text-[0.78rem] sm:block">
            psicóloga · análise junguiana
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-baseline gap-7">
            {Navigation.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="display text-foreground hover:text-terracotta text-[0.95rem] tracking-wide no-underline transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={Luiza.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="display-italic text-foreground hover:text-terracotta decoration-terracotta/50 hover:decoration-terracotta inline-flex items-baseline gap-2 text-[0.95rem] underline decoration-1 underline-offset-[0.3em] transition-colors sm:text-[1rem]"
          aria-label={`Iniciar conversa pelo WhatsApp ${Luiza.phoneDisplay}`}
        >
          <span>WhatsApp</span>
          <span aria-hidden="true" className="text-terracotta">
            →
          </span>
        </a>
      </div>
    </header>
  );
}
