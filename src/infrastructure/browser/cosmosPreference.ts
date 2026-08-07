import { storage } from "./storage";

// ---------------------------------------------------------------------------
// The visitor's "show the Cosmos" preference, kept in browser storage. Reading
// and writing live here; the React binding that subscribes to it is
// `view/cosmos/hooks/useCosmosShow.ts`.
//
// Cross-component updates (the footer reacting to the in-cosmos dismiss button)
// ride on a custom window event, because a storage write fires no event in the
// tab that made it.
// ---------------------------------------------------------------------------

const KEY = "cosmos:show";

export const COSMOS_SHOW_CHANGE_EVENT = "cosmos:show:change";

export function getCosmosShow(): boolean {
  const value = storage.get<boolean>(KEY);
  return value ?? true;
}

export function setCosmosShow(value: boolean): void {
  storage.set<boolean>(KEY, value);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COSMOS_SHOW_CHANGE_EVENT, { detail: value }));
  }
}
