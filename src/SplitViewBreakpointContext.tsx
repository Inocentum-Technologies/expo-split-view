import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';
import { Dimensions } from 'react-native';
import { DEFAULT_TABLET_BREAKPOINT } from './constants';

/**
 * Internal. Carries the `tabletBreakpoint` set on <SplitView> down to
 * SplitView.Placeholder, useSplitView and useDetailScreenBack.
 * <SplitView> is the only place the breakpoint can be configured.
 * Intentionally NOT re-exported from index.ts.
 */
export const SplitViewBreakpointContext = createContext<number>(DEFAULT_TABLET_BREAKPOINT);

/** Returns the nearest SplitView's breakpoint (768 when rendered outside a SplitView). */
export function useTabletBreakpoint(): number {
    return useContext(SplitViewBreakpointContext);
}

function subscribeToDimensions(notify: () => void) {
    const subscription = Dimensions.addEventListener('change', notify);
    return () => subscription.remove();
}

/**
 * `window width >= breakpoint`, subscribed through a boolean snapshot so the caller
 * re-renders only when the width crosses the breakpoint, not on every resize tick
 * (unlike `useWindowDimensions`, which re-renders on every change).
 */
export function useIsWideWindow(breakpoint: number): boolean {
    const getSnapshot = useCallback(
        () => Dimensions.get('window').width >= breakpoint,
        [breakpoint]
    );
    return useSyncExternalStore(subscribeToDimensions, getSnapshot, getSnapshot);
}

/** Tablet layout check for anything rendered inside a <SplitView>. */
export function useIsTablet(): boolean {
    return useIsWideWindow(useTabletBreakpoint());
}