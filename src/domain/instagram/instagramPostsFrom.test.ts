import { describe, expect, it } from "vitest";
import type { RawInstagramMedia } from "@/infrastructure/instagram/findInstagramMedia";
import { instagramPostsFrom } from "./instagramPostsFrom";

/** A complete row, as `/me/media` returns one of her carousels. */
const row = (overrides: RawInstagramMedia = {}): RawInstagramMedia => ({
  id: "17900000000000001",
  caption: "Uma passagem de Jung sobre o sintoma.",
  media_type: "CAROUSEL_ALBUM",
  media_url: "https://scontent.cdninstagram.com/v/um.jpg",
  permalink: "https://www.instagram.com/p/Cabc123/",
  timestamp: "2026-07-30T12:00:00+0000",
  alt_text: "",
  ...overrides,
});

describe("instagramPostsFrom", () => {
  it("maps a carousel row to the post the page renders", () => {
    expect(instagramPostsFrom([row()])).toEqual([
      {
        id: "17900000000000001",
        caption: "Uma passagem de Jung sobre o sintoma.",
        imageUrl: "https://scontent.cdninstagram.com/v/um.jpg",
        permalink: "https://www.instagram.com/p/Cabc123/",
        timestamp: "2026-07-30T12:00:00+0000",
        altText: "Uma passagem de Jung sobre o sintoma.",
      },
    ]);
  });

  it("keeps the API's order, which is newest first", () => {
    const posts = instagramPostsFrom([
      row({ id: "3", permalink: "https://www.instagram.com/p/tres/" }),
      row({ id: "2", permalink: "https://www.instagram.com/p/dois/" }),
    ]);

    expect(posts.map((post) => post.id)).toEqual(["3", "2"]);
  });

  describe("which URL is the image", () => {
    // `media_url` on a VIDEO is the video file: rendering it in an <img> shows
    // nothing at all.
    it("uses the thumbnail for a video", () => {
      const posts = instagramPostsFrom([
        row({
          media_type: "VIDEO",
          media_url: "https://scontent.cdninstagram.com/v/reel.mp4",
          thumbnail_url: "https://scontent.cdninstagram.com/v/reel-still.jpg",
        }),
      ]);

      expect(posts[0]?.imageUrl).toBe("https://scontent.cdninstagram.com/v/reel-still.jpg");
    });

    it("uses media_url for an image, ignoring a thumbnail if one appears", () => {
      const posts = instagramPostsFrom([
        row({
          media_type: "IMAGE",
          media_url: "https://scontent.cdninstagram.com/v/foto.jpg",
          thumbnail_url: "https://scontent.cdninstagram.com/v/nao-esta.jpg",
        }),
      ]);

      expect(posts[0]?.imageUrl).toBe("https://scontent.cdninstagram.com/v/foto.jpg");
    });
  });

  describe("rows with nothing to render", () => {
    it("drops a row with no media_url", () => {
      expect(instagramPostsFrom([row({ media_url: null })])).toEqual([]);
    });

    it("drops a video whose thumbnail never arrived", () => {
      const rows = [row({ media_type: "VIDEO", thumbnail_url: null })];

      expect(instagramPostsFrom(rows)).toEqual([]);
    });

    it("drops a row with no permalink, since the tile would open nowhere", () => {
      expect(instagramPostsFrom([row({ permalink: "  " })])).toEqual([]);
    });

    it("keeps the usable rows when one of them is broken", () => {
      const posts = instagramPostsFrom([
        row({ media_url: null }),
        row({ id: "17900000000000002" }),
      ]);

      expect(posts).toHaveLength(1);
      expect(posts[0]?.id).toBe("17900000000000002");
    });
  });

  describe("alt text", () => {
    it("prefers the accessibility caption she typed in the app", () => {
      const posts = instagramPostsFrom([row({ alt_text: "Ninfas à beira de um lago." })]);

      expect(posts[0]?.altText).toBe("Ninfas à beira de um lago.");
    });

    // Every live post has `alt_text: ""`, so this is the real path today.
    it("falls back to the caption's first line", () => {
      const posts = instagramPostsFrom([
        row({ alt_text: "", caption: "O sintoma como chamado.\n\n#jung #psicologiaanalitica" }),
      ]);

      expect(posts[0]?.altText).toBe("O sintoma como chamado.");
    });

    it("cuts a long caption on a word boundary", () => {
      const caption = `${"palavra ".repeat(20)}fim`;

      const { altText } = instagramPostsFrom([row({ caption })])[0]!;

      expect(altText.length).toBeLessThanOrEqual(101);
      expect(altText.endsWith("…")).toBe(true);
      expect(altText).not.toMatch(/palavr…$/);
    });

    it("is an empty string when there is no caption either", () => {
      const posts = instagramPostsFrom([row({ alt_text: null, caption: null })]);

      expect(posts[0]?.altText).toBe("");
      expect(posts[0]?.caption).toBeNull();
    });
  });
});
