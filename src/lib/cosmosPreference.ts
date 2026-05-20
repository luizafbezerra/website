"use client";

import { useCallback, useEffect, useState } from "react";
import { storage } from "./storage";

const KEY = "cosmos:show";
const EVENT = "cosmos:show:change";

export function getCosmosShow(): boolean {
  const value = storage.get<boolean>(KEY);
  return value ?? true;
}

export function setCosmosShow(value: boolean): void {
  storage.set<boolean>(KEY, value);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
  }
}

// Always returns `true` on first paint to match the SSR-default branch and
// avoid hydration mismatch. The real value is read on mount; cross-component
// updates (e.g. footer reacting to the in-cosmos dismiss button) ride on a
// custom window event.
export function useCosmosShow(): [boolean, (value: boolean) => void] {
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    setShow(getCosmosShow());
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<boolean>).detail;
      setShow(detail);
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  const update = useCallback((value: boolean) => {
    setCosmosShow(value);
  }, []);

  return [show, update];
}
