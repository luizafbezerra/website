// Calibration for the painted wheel at /art/wheel.webp.
// In the painting Áries (the ram) sits at roughly the 4 o'clock position,
// which is +30° in SVG coordinates (0° = east, +y = south).
// The twelve signs progress counter-clockwise from there, so the painted
// position of a sign is computed as (WHEEL_START_ANGLE_DEG - angle).
export const WHEEL_START_ANGLE_DEG = 33;
export const WHEEL_SECTOR_DEG = 30;

export const WHEEL_VIEWBOX = 690;
export const WHEEL_CENTER = WHEEL_VIEWBOX / 2;

// Default radii (in SVG units; viewBox is WHEEL_VIEWBOX×WHEEL_VIEWBOX).
// Inner = boundary between Earth disc and zodiac figures ring.
// Outer = outer edge of the Nakshatra band — the highlight annulus spans both
// the zodiac figures and the Nakshatras in a single arc. Override per-sign via
// WheelSign.innerRadius / outerRadius if a particular figure or Nakshatra needs
// to be tightened individually.
export const WHEEL_INNER_RADIUS = 142;
export const WHEEL_OUTER_RADIUS = 325;

export type WheelSign = {
  id: string;
  label: string;
  dateRange: string;
  // Position in zodiac order; 0 = Áries, stepping by 30° per sign.
  angle: number;
  // Optional per-sign fine-tune overrides.
  //   angleOffset:  degrees added to the center angle (clockwise positive in SVG coords).
  //   innerRadius:  override the inner annulus edge for this sign only.
  //   outerRadius:  override the outer annulus edge for this sign only.
  //   sectorWidth:  override the angular width (default WHEEL_SECTOR_DEG = 30°).
  angleOffset?: number;
  innerRadius?: number;
  outerRadius?: number;
  sectorWidth?: number;
};

export const WHEEL_ZODIAC: ReadonlyArray<WheelSign> = [
  { id: "aries", label: "Áries", dateRange: "21 mar – 19 abr", angle: 1 },
  { id: "taurus", label: "Touro", dateRange: "20 abr – 20 mai", angle: 31 },
  { id: "gemini", label: "Gêmeos", dateRange: "21 mai – 20 jun", angle: 60 },
  { id: "cancer", label: "Câncer", dateRange: "21 jun – 22 jul", angle: 90 },
  { id: "leo", label: "Leão", dateRange: "23 jul – 22 ago", angle: 119 },
  { id: "virgo", label: "Virgem", dateRange: "23 ago – 22 set", angle: 149 },
  { id: "libra", label: "Libra", dateRange: "23 set – 22 out", angle: 179 },
  { id: "scorpio", label: "Escorpião", dateRange: "23 out – 21 nov", angle: 209 },
  { id: "sagittarius", label: "Sagitário", dateRange: "22 nov – 21 dez", angle: 239 },
  { id: "capricorn", label: "Capricórnio", dateRange: "22 dez – 19 jan", angle: 269 },
  { id: "aquarius", label: "Aquário", dateRange: "20 jan – 18 fev", angle: 299 },
  { id: "pisces", label: "Peixes", dateRange: "19 fev – 20 mar", angle: 330 },
] as const;

export function polar(r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: WHEEL_CENTER + r * Math.cos(a), y: WHEEL_CENTER + r * Math.sin(a) };
}

export function sectorPath(
  centerAngle: number,
  innerR: number = WHEEL_INNER_RADIUS,
  outerR: number = WHEEL_OUTER_RADIUS,
  sectorW: number = WHEEL_SECTOR_DEG,
) {
  const half = sectorW / 2;
  const start = centerAngle - half;
  const end = centerAngle + half;
  const si = polar(innerR, start);
  const so = polar(outerR, start);
  const ei = polar(innerR, end);
  const eo = polar(outerR, end);
  return [
    `M ${si.x.toFixed(2)} ${si.y.toFixed(2)}`,
    `L ${so.x.toFixed(2)} ${so.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 0 1 ${eo.x.toFixed(2)} ${eo.y.toFixed(2)}`,
    `L ${ei.x.toFixed(2)} ${ei.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 0 0 ${si.x.toFixed(2)} ${si.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export const signSvgAngle = (sign: WheelSign) =>
  WHEEL_START_ANGLE_DEG - sign.angle + (sign.angleOffset ?? 0);

export function sectorPathForSign(sign: WheelSign): string {
  return sectorPath(
    signSvgAngle(sign),
    sign.innerRadius ?? WHEEL_INNER_RADIUS,
    sign.outerRadius ?? WHEEL_OUTER_RADIUS,
    sign.sectorWidth ?? WHEEL_SECTOR_DEG,
  );
}

export const WHEEL_SECTOR_PATHS: Record<WheelSign["id"], string> = Object.fromEntries(
  WHEEL_ZODIAC.map((sign) => [sign.id, sectorPathForSign(sign)]),
);

// Rotation (degrees) needed to bring `sign`'s center to SVG -90° (12 o'clock).
// Apply as `transform: rotate(...)` on the wheel wrapper so the active sign's
// painted figure and labels land at the top in readable orientation.
export const signRotationDeg = (sign: WheelSign) => -90 - signSvgAngle(sign);

// Shortest signed delta (in degrees) to go from `currentDeg` to a visually
// equivalent angle of `targetDeg`. Result is in (-180, +180]. Adding it to
// `currentDeg` produces a rotation that takes the short way around rather
// than spinning through the long arc.
export function shortestRotationDelta(currentDeg: number, targetDeg: number): number {
  let d = (targetDeg - currentDeg) % 360;
  if (d > 180) d -= 360;
  else if (d <= -180) d += 360;
  return d;
}
