import { createContext, useContext } from 'react';
import type { Href } from 'expo-router';

/**
 * Fallback route resolved by the enclosing `<SplitView>` for the hosting screen.
 * `null` when the host has no logical parent (it is the app root).
 */
export const SplitViewFallbackContext = createContext<Href | null>(null);

/** Internal: used by `<SplitView.Placeholder>` to share the host fallback. */
export function useSplitViewFallbackRoute(): Href | null {
    return useContext(SplitViewFallbackContext);
}
