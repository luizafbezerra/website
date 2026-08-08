"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/view/styling/cn";

/**
 * An image that resolves out of its own low-quality placeholder instead of
 * appearing.
 *
 * `next/image`'s built-in `placeholder="blur"` paints the LQIP as the `img`'s own
 * background and then drops it the instant the file decodes — a hard cut, which
 * is no better than the empty box it replaced. So the placeholder lives on a
 * layer of its own here, *above* the picture, and fades out across it. What the
 * visitor sees is one image sharpening, which is what a plate arriving should
 * look like.
 *
 * **The picture underneath is never faded in**, and that is deliberate: Chrome
 * will not treat a transparent element as an LCP candidate, so fading the image
 * up would push the page's largest paint out by the length of the transition.
 * Fading the cover off instead leaves the image painted at full opacity the
 * whole time — the metric sees it immediately, the visitor sees it settle.
 *
 * A cached image is already `complete` before React can attach `onLoad`, so the
 * effect below checks for that and clears the cover with no transition at all.
 * Without it, every back-navigation would replay a fade over a picture that was
 * never missing.
 *
 * The blur here is not the depth blur DESIGN §105 bans: it is the picture's own
 * sixteen pixels scaled up, on screen only until the file lands, and §211 asks
 * for it by name.
 */

type BlurUpImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Applied to the wrapper, which is what carries the layout box. */
  wrapperClassName?: string;
};

export function BlurUpImage({
  src,
  alt,
  width,
  height,
  blurDataURL,
  sizes,
  priority,
  className,
  wrapperClassName,
}: BlurUpImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"waiting" | "settling" | "settled">("waiting");

  useEffect(() => {
    // Cached, or decoded between render and hydration: no arrival to narrate.
    if (imgRef.current?.complete) setState("settled");
  }, []);

  // Nothing to fade from — render the picture alone rather than a bare box.
  if (!blurDataURL) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <span className={cn("relative block", wrapperClassName)}>
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        onLoad={() => setState((s) => (s === "waiting" ? "settling" : s))}
        className={className}
      />

      {state !== "settled" && (
        <span
          aria-hidden="true"
          onTransitionEnd={() => setState("settled")}
          style={{ backgroundImage: `url("${blurDataURL}")` }}
          className={cn(
            "pointer-events-none absolute inset-0 bg-cover bg-center",
            // Scaled past the edges because a blur of this radius drags the
            // parchment in at the borders and would ring the picture.
            "scale-105 blur-xl",
            "transition-opacity duration-700 ease-out motion-reduce:duration-200",
            state === "settling" ? "opacity-0" : "opacity-100",
          )}
        />
      )}
    </span>
  );
}
