import sharp from "sharp";

/**
 * A low-quality image placeholder: the picture at postage-stamp size, inlined as
 * a data URI so it costs a request of its own exactly never.
 *
 * The site's images are paintings and a portrait — the two things on a page a
 * visitor actually waits for — and until they land the layout holds an empty
 * box. An LQIP fills that box with the picture's own colour and massing, so the
 * arrival is a resolve rather than an appearance. DESIGN §211 asks for it in so
 * many words.
 *
 * Sixteen pixels wide is small enough that the data URI stays under ~600 bytes
 * (it travels inside the HTML, so every byte is paid on the critical path) and
 * large enough to carry the composition once CSS blurs it back up. WebP rather
 * than JPEG: at this size JPEG's blocking is coarser than the blur that hides
 * it, and every browser that gets this far reads WebP.
 *
 * Generated once at upload rather than per render. The pages are ISR, so a
 * render-time version would only run at revalidate — but it would still refetch
 * the original from Blob on every one of them, for a value that cannot change
 * while the file does not.
 */
export async function blurDataUrlFrom(buffer: Buffer): Promise<string | null> {
  try {
    const tiny = await sharp(buffer)
      .resize(16, null, { fit: "inside" })
      .webp({ quality: 55 })
      .toBuffer();
    return `data:image/webp;base64,${tiny.toString("base64")}`;
  } catch (error) {
    // An LQIP is a nicety; a failed one must never fail the upload. The field
    // stays empty and the image renders with no placeholder, exactly as it did
    // before this existed.
    console.error("[media] could not derive a blur placeholder:", error);
    return null;
  }
}
