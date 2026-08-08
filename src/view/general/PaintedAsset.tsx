import { BlurUpImage } from "@/view/general/BlurUpImage";
import { cn } from "@/view/styling/cn";

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

/**
 * Each painting at sixteen pixels wide, inlined, so the slot holds the work's own
 * colour while the file lands rather than a hole in the parchment.
 *
 * Checked in rather than generated at build: these six files are in the repo and
 * cannot change without a commit, so a build step would recompute the same seven
 * hundred bytes on every deploy. Regenerate by resizing to 16px wide, WebP q55,
 * and base64-ing the result — the same recipe `src/payload/media/blurDataUrl.ts`
 * runs for her uploads.
 */
const BLUR: Record<PaintedAssetSrc, string> = {
  quaternity:
    "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAAAwAgCdASoQABAAAsBIJQBOgMXDqlamQR2SAAD++qmv1qnfdXfgwdnlFsHIuQTd1e/LGKNRqUBpqyrhpq5x1EktdS46SXc7UlP7lb34OyMl/+x26EITihBPj1dRr9M4uA2F7YwI3YTnm+30XJsHiaNvfk24QAAA",
  "landscape-quaternity":
    "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAACwAQCdASoQABAAAsBIJZACdADcuTpAAP7w3dL/VNXDytdo5FYzm8qMDL+6gJfgNwiN1/LGA/1Z2SASWhR/oZhAAAA=",
  "red-script":
    "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAQAgCdASoQABAAAsBIJaACdAEf/9gfdFyYAP7Qk4Qed2gOHpuNLTRicOSdew/Wjxq38G486A23twY+bUMyYLg9YxJVT2BJQDXAAA==",
  "squared-mandala":
    "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAACwAgCdASoQABAAAsBIJZgCdGaA2wAp6h02sWMbDAAA/ZoDBU26hBTv98SRQSJOwM+efNiogEw3y+VGII04xua0q63zlPjUznVe2NSlUn2jUyfpwo+iqyHBYIJm2+WxKlWdkp0C2kpETbxhGU4sGr2mxEjrx8kkmbyAAA==",
  "winter-star":
    "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAABwAgCdASoQABAAAsBIJQBOgMX1ylJkXJRHE8QAAP6r5LMiE8GqP+GeXAyJl7MnSwU9w9FiwBWUfE9XXsU6wE+HgUvm/zpPu3Q2KUn3yUulsx331oJXXPiJ3zrm9RCfG8Wpxw6HXzGn05KmsGdkwzjMp4fiVJZHFmX5/heP6PAAAA==",
  "serpent-flame":
    "data:image/webp;base64,UklGRrYAAABXRUJQVlA4IKoAAABQBACdASoQABUAPsFOoEqnpCMhsAgA8BgJbACdMoEUoAS3M0MUsyoUapuQANzWw6HaixgmXnhtFiBFiWea9t1U/8MYzt+BPHqqmwGS4wgtzfl3uwyvtLnUtrJS5U0yNe30oPny4ixJyEVnL8j4QjCqPO035MvTbQ43FqHeQ28xV7pRyCTkP+ABtxqaKyDeGhf/n/rKP2qdjsH9/833RHq36oal9330zQAAAA==",
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
      <BlurUpImage
        src={SOURCES[src]}
        alt={ALT[src]}
        width={width}
        height={height}
        blurDataURL={BLUR[src]}
        sizes={sizes}
        priority={priority}
        className={cn("h-auto w-full select-none", imgClassName)}
      />
    </figure>
  );
}
