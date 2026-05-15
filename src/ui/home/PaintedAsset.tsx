import Image from "next/image";
import { cn } from "@/lib";

export type PaintedAssetSrc =
  | "quaternity"
  | "landscape-quaternity"
  | "red-script"
  | "squared-mandala"
  | "winter-star"
  | "serpent-flame";

const SOURCES: Record<PaintedAssetSrc, string> = {
  quaternity: "/art/quaternity.jpg",
  "landscape-quaternity": "/art/landscape-quaternity.jpg",
  "red-script": "/art/red-script.jpg",
  "squared-mandala": "/art/squared-mandala.jpg",
  "winter-star": "/art/winter-star.jpg",
  "serpent-flame": "/art/serpent-flame.jpg",
};

const ALT: Record<PaintedAssetSrc, string> = {
  quaternity:
    "Mandala pintada à mão com quatro arquétipos cardeais ao redor de um centro estrelado",
  "landscape-quaternity":
    "Pintura de paisagem alquímica com pequena quaternidade flutuando entre céu e terra",
  "red-script":
    "Glifos arquetípicos vermelhos sobre fundo de pedras escuras com pequena quaternidade",
  "squared-mandala": "Mandala geométrica com pétalas centrais brancas sobre orla terracota",
  "winter-star":
    "Estrela de gelo com máscara arquetípica e símbolo central, em tons azuis e terracota",
  "serpent-flame": "Chama-serpente subindo de chão xadrez vermelho contra fundo de musgo",
};

type Props = {
  src: PaintedAssetSrc;
  className?: string;
  imgClassName?: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
};

export function PaintedAsset({
  src,
  className,
  imgClassName,
  width,
  height,
  priority,
  sizes,
}: Props) {
  return (
    <figure className={cn("relative inline-block", className)} aria-hidden={false}>
      <Image
        src={SOURCES[src]}
        alt={ALT[src]}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={cn("h-auto w-full select-none", imgClassName)}
      />
    </figure>
  );
}
