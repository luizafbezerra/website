import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";
import type { RichTextContent } from "@/core/richText";

/**
 * Renders a Home rich-text body. The prose styling lives on the wrapper class
 * (`.body-prose` etc.) and cascades to the paragraphs the Lexical renderer
 * emits — the brief's body styling, with inline italic emphasis preserved.
 */
export function RichTextProse({ data, className }: { data: RichTextContent; className?: string }) {
  return (
    <div className={className}>
      <RichText data={data as unknown as SerializedEditorState} />
    </div>
  );
}
