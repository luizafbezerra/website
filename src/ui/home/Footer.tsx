import Link from "next/link";
import { Luiza, Navigation } from "@/core";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-rule border-t px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-12 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <Link
              href="/"
              className="display-italic text-foreground hover:text-terracotta inline-block text-2xl no-underline transition-colors"
            >
              {Luiza.fullName}
            </Link>
            <p className="marginalia mt-2">psicóloga clínica</p>
          </div>

          <nav aria-label="Rodapé">
            <ul className="display flex flex-col gap-2 text-[0.98rem] sm:items-end">
              {Navigation.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground hover:text-terracotta no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={Luiza.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="display-italic text-foreground hover:text-terracotta no-underline transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-rule mt-12 flex flex-col gap-3 border-t pt-8 text-[0.85rem] sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-quill">
            © {year} {Luiza.fullName}. Todos os direitos reservados.
          </p>
          <p className="marginalia">Site construído como um manuscrito iluminado.</p>
        </div>
      </div>
    </footer>
  );
}
