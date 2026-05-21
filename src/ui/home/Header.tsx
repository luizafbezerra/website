import Image from "next/image";
import Link from "next/link";
import { Luiza, Navigation } from "@/core";
import { HeaderMobileNav } from "./HeaderMobileNav";

export function Header() {
  return (
    <header className="bg-parchment border-rule-soft border-b">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4 sm:px-10 sm:py-5">
        <div className="group inline-flex shrink-0 items-center gap-3 sm:items-start sm:gap-4">
          <Link href="/" className="block shrink-0" aria-label={`${Luiza.fullName} — início`}>
            <span className="border-terracotta/70 bg-parchment-deep relative block aspect-square w-9 shrink-0 overflow-hidden rounded-full border transition-[box-shadow] duration-200 group-hover:[box-shadow:0_0_0_1px_var(--color-terracotta),0_0_16px_-2px_oklch(0.75_0.13_80/0.5)] sm:w-10">
              <Image
                src="/art/quaternity.jpg"
                alt=""
                width={400}
                height={400}
                sizes="(min-width: 640px) 40px, 36px"
                className="h-full w-full scale-[1.18] select-none object-cover object-center"
                priority
              />
            </span>
          </Link>
          <span className="inline-flex flex-col leading-tight">
            <Link
              href="/"
              className="display-italic text-foreground text-[1.15rem] no-underline sm:text-[1.3rem]"
            >
              {Luiza.fullName}
            </Link>
            <span className="marginalia mt-0.5 hidden text-[0.76rem] sm:block">
              psicóloga · análise junguiana
            </span>
          </span>
        </div>

        <nav aria-label="Principal" className="ml-auto hidden md:block">
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
          className="display-italic text-foreground hover:text-terracotta decoration-terracotta/50 hover:decoration-terracotta ml-auto hidden items-baseline gap-2 text-[0.95rem] underline decoration-1 underline-offset-[0.3em] transition-colors md:ml-7 md:inline-flex md:text-[1rem]"
          aria-label={`Iniciar conversa pelo WhatsApp ${Luiza.phoneDisplay}`}
        >
          <span>WhatsApp</span>
          <span aria-hidden="true" className="text-terracotta">
            →
          </span>
        </a>

        <div className="ml-auto md:hidden">
          <HeaderMobileNav />
        </div>
      </div>
    </header>
  );
}
