"use client";

import { useCallback, useEffect, useState } from "react";
import {
  COSMOS_SHOW_CHANGE_EVENT,
  getCosmosShow,
  setCosmosShow,
} from "@/infrastructure/browser/cosmosPreference";

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
    window.addEventListener(COSMOS_SHOW_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(COSMOS_SHOW_CHANGE_EVENT, onChange);
  }, []);

  const update = useCallback((value: boolean) => {
    setCosmosShow(value);
  }, []);

  return [show, update];
}
