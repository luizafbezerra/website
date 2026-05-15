"use client";

import { createContext } from "react";
import type * as THREE from "three";

// One-shot cube map baked from the procedural universe (deep field + galaxy
// band + nebula shader) by `<CosmosEnvProbe>`. Consumed by the brass armillary
// as its `envMap` so the rings reflect the surrounding cosmos. Null until the
// probe has rendered, in which case the consumer falls back gracefully.
export const CosmosEnvContext = createContext<THREE.CubeTexture | null>(null);
