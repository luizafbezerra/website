import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // Serve the clean per-post Markdown at /blog/<slug>.md. A suffixed dynamic
  // segment ([slug].md) is not reliably registered by Next 16's router (the
  // [slug] page swallows "<slug>.md"), so we rewrite the public .md URL to a
  // plain nested route handler. `beforeFiles` runs before filesystem route
  // matching, so the rewrite wins over the [slug] page.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/blog/:slug.md", destination: "/blog/:slug/md" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

// @ts-ignore
export default withPayload(nextConfig);
