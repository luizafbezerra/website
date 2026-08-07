import { Cosmos } from "./Cosmos";

/**
 * A star field as the scene consumes it: interleaved position and colour
 * buffers, ready to hand straight to a `bufferGeometry`.
 *
 * This is the seam "O céu desta noite" plugs into (REQ-009). Today the buffers
 * come from `proceduralSky`; a future driver can compute them from the real sky
 * over São Paulo tonight and the scene will not know the difference, because
 * what it consumes is a field of stars rather than a recipe for generating one.
 *
 * Typed arrays rather than objects at the boundary: 5,200 points crossing the
 * layer as `{x, y, z}` records would be allocated twice and copied once for no
 * gain. `starFieldFrom` is the bridge for any source that naturally produces
 * one star at a time — a catalogue, for instance.
 */

export type Rgb = readonly [number, number, number];

export type SkyStar = {
  position: Cosmos.Vec3;
  color: Rgb;
};

export type StarField = {
  positions: Float32Array;
  colors: Float32Array;
  count: number;
};

export function starFieldFrom(stars: readonly SkyStar[]): StarField {
  const positions = new Float32Array(stars.length * 3);
  const colors = new Float32Array(stars.length * 3);

  for (let index = 0; index < stars.length; index++) {
    const { position, color } = stars[index];
    positions[index * 3 + 0] = position[0];
    positions[index * 3 + 1] = position[1];
    positions[index * 3 + 2] = position[2];
    colors[index * 3 + 0] = color[0];
    colors[index * 3 + 1] = color[1];
    colors[index * 3 + 2] = color[2];
  }

  return { positions, colors, count: stars.length };
}

/** The empty field — what a driver returns when it has nothing to show. */
export const EMPTY_STAR_FIELD: StarField = {
  positions: new Float32Array(0),
  colors: new Float32Array(0),
  count: 0,
};
