import { createContext, useContext } from 'react';
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