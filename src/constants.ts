/**
 * Internal constants shared across the module.
 * Intentionally NOT re-exported from index.ts.
 */

/** Minimum screen width (in points) for the tablet layout. */
export const DEFAULT_TABLET_BREAKPOINT = 768;

/** Default width (dp) of the master (left) pane on tablets. */
export const DEFAULT_MASTER_LIST_WIDTH = 320;

/** Default lower bound (dp) for a resizable master pane. */
export const DEFAULT_MASTER_LIST_MIN_WIDTH = 240;

/** Default upper bound (dp) for a resizable master pane. */
export const DEFAULT_MASTER_LIST_MAX_WIDTH = 480;

/**
 * The master pane never takes more than this share of the window,
 * whatever `masterListMaxWidth` says, so the detail pane always stays usable.
 */
export const MAX_MASTER_LIST_RATIO = 0.6;

/** Default touch-target width (dp) of the resize handle, centered on the pane boundary. */
export const DEFAULT_RESIZE_HANDLE_HIT_WIDTH = 24;

/** Step (dp) used by accessibility increment / decrement actions on the handle. */
export const RESIZE_ACCESSIBILITY_STEP = 24;

/** Max delay (ms) between two taps on the handle to count as a double tap. */
export const DOUBLE_TAP_MS = 300;

/** Horizontal movement (dp) before a touch on the handle is treated as a drag instead of a tap. */
export const DRAG_SLOP = 3;