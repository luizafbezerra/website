"use client";

// GLSL for the procedural nebula sphere. The vertex shader forwards a
// normalized "look direction" from the sphere centre; the fragment shader
// runs two octaves of simplex-noise FBM on that direction and mixes the
// locked earth-pigment palette (terracotta, cobalt, ochre) against a warm
// dark umber baseline. No time uniform — static painterly wash; one bake
// into the env cube map is enough.

export const nebulaVertexShader = /* glsl */ `
varying vec3 vWorldDir;

void main() {
  // Direction from the sphere centre (mesh origin) to this vertex, in world
  // space. The mesh is an inverted icosphere centred at the scene origin, so
  // this direction also matches the view direction for any camera inside.
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldDir = normalize(wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

// Ashima / Ian McEwan's stock 3D simplex noise — public domain, MIT-style
// (the `snoise` function in this file is the standard inlined snippet that
// ships with most reference shaders). Compact enough to drop in directly.
export const nebulaFragmentShader = /* glsl */ `
varying vec3 vWorldDir;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// 4-octave fractional Brownian motion. Low base frequency = large soft
// painterly blobs; the higher harmonics add gentle texture rather than the
// granular "static" you get from generic noise wallpapers.
float fbm(vec3 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    v += amp * snoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec3 dir = normalize(vWorldDir);

  // Two FBM samples at different frequencies + offsets so the warm-cool
  // mix isn't perfectly correlated. Remap from [-1, 1]-ish to [0, 1].
  float n  = clamp(fbm(dir * 1.5) * 0.5 + 0.5, 0.0, 1.0);
  float n2 = clamp(fbm(dir * 4.0 + vec3(7.3, 2.1, 5.7)) * 0.5 + 0.5, 0.0, 1.0);

  // Locked palette — earth pigments only. Baseline is a warm dark umber so
  // the void never reads as pure black; mixed against terracotta + cobalt +
  // ochre as the noise rises.
  vec3 base   = vec3(0.04, 0.025, 0.018);
  vec3 terra  = vec3(0.42, 0.18, 0.10);
  vec3 cobalt = vec3(0.10, 0.13, 0.32);
  vec3 ochre  = vec3(0.50, 0.36, 0.14);

  float m1 = smoothstep(0.55, 0.82, n);
  float m2 = smoothstep(0.60, 0.88, n2);

  vec3 col = base;
  col = mix(col, terra,  m1 * 0.55);
  col = mix(col, cobalt, m2 * 0.40);
  col += ochre * pow(n * n2, 2.0) * 0.25;

  // Very faint cosmic-dust haze so the deep void has atmosphere rather than
  // pure black at low FBM values.
  float haze = smoothstep(0.30, 0.55, n) * 0.05;
  col += vec3(0.18, 0.10, 0.06) * haze;

  gl_FragColor = vec4(col, 1.0);
}
`;
