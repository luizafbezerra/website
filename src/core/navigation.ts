export namespace Navigation {
  export type Link = {
    label: string;
    href: string;
  };

  export const links: Link[] = [
    { label: "Sobre", href: "/#sobre" },
    { label: "Como trabalho", href: "/#abordagem" },
    { label: "Escrita", href: "/blog" },
    { label: "Contato", href: "/#contato" },
  ];
}
