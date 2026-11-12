import { createContext, useContext } from 'react';
import {
    DEFAULT_MASTER_LIST_MAX_WIDTH,
    DEFAULT_MASTER_LIST_MIN_WIDTH,
    DEFAULT_MASTER_LIST_WIDTH,
} from './constants';
import type { UseSplitViewResizeResult } from './types';

const noop = () => { };

// Default is used outside a <SplitView> (read-only, nothing is resizable).
export const SplitViewResizeContext = createContext<UseSplitViewResizeResult>({
    resizable: false,
    width: DEFAULT_MASTER_LIST_WIDTH,
    minWidth: DEFAULT_MASTER_LIST_MIN_WIDTH,
    maxWidth: DEFAULT_MASTER_LIST_MAX_WIDTH,
    isResizing: false,
    setWidth: noop,
    reset: noop,
});

/**
 * Reads and controls the master pane width from anywhere inside a `<SplitView>`
 * (master list, detail screens, custom handle content, ...).
 *
 * - `width` / `isResizing` update live while the user drags the handle.
 * - `setWidth(w)` clamps to the allowed range and fires the same
 *   `onMasterListResize` / `onMasterListResizeEnd` callbacks as a drag.
 * - `reset()` restores `masterListDefaultWidth`.
 *
 * Outside a `<SplitView>` it returns a read-only default (`resizable: false`).
 */
export function useSplitViewResize(): UseSplitViewResizeResult {
    return useContext(SplitViewResizeContext);
}