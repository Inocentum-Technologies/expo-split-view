import { useCallback, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    I18nManager,
    PanResponder,
    type GestureResponderHandlers,
} from 'react-native';
import { DOUBLE_TAP_MS, DRAG_SLOP, MAX_MASTER_LIST_RATIO } from './constants';

export interface UseMasterListResizeOptions {
    /** Enables dragging. When false the hook just returns `width` untouched. */
    enabled: boolean;
    /** Current width coming from props (also the initial value). Later changes are adopted. */
    width: number;
    /** Width restored by `reset()` and by a double tap on the handle. */
    defaultWidth: number;
    minWidth: number;
    maxWidth: number;
    resetOnDoubleTap: boolean;
    onResizeStart?: (width: number) => void;
    onResize?: (width: number) => void;
    onResizeEnd?: (width: number) => void;
}

export interface UseMasterListResizeResult {
    width: number;
    isResizing: boolean;
    setWidth: (width: number) => void;
    reset: () => void;
    panHandlers: GestureResponderHandlers;
}

const clamp = (value: number, min: number, max: number) =>
    Math.round(Math.min(Math.max(value, min), Math.max(min, max)));

/**
 * Internal. Owns the master pane width: drag handling, clamping, and the
 * start / change / end callbacks.
 */
export function useMasterListResize(options: UseMasterListResizeOptions): UseMasterListResizeResult {
    const { enabled, width: widthProp, minWidth, maxWidth } = options;

    const [current, setCurrent] = useState(widthProp);
    const [prevProp, setPrevProp] = useState(widthProp);
    const [isResizing, setIsResizing] = useState(false);

    // Adopt a new `masterListWidth` prop (e.g. a persisted value that loaded asynchronously).
    // Done during render so there is no frame with the stale width.
    if (prevProp !== widthProp) {
        setPrevProp(widthProp);
        setCurrent(widthProp);
    }

    const resolved = enabled ? clamp(current, minWidth, maxWidth) : widthProp;

    // Latest values for the (stable) gesture handlers, which must never see stale props.
    const latest = useRef({ ...options, width: resolved });
    latest.current = { ...options, width: resolved };

    const startWidth = useRef(0);
    const dragging = useRef(false);
    const lastTap = useRef(0);

    const applyWidth = useCallback((next: number): boolean => {
        const l = latest.current;
        // Never let the pane eat more than MAX_MASTER_LIST_RATIO of the window.
        const cap = Math.min(l.maxWidth, Dimensions.get('window').width * MAX_MASTER_LIST_RATIO);
        const clamped = clamp(next, l.minWidth, cap);
        if (clamped === l.width) return false;
        l.width = clamped;
        setCurrent(clamped);
        l.onResize?.(clamped);
        return true;
    }, []);

    const setWidth = useCallback(
        (next: number) => {
            if (!latest.current.enabled) return;
            // A programmatic change is a complete, discrete change: report it as committed too.
            if (applyWidth(next)) latest.current.onResizeEnd?.(latest.current.width);
        },
        [applyWidth]
    );

    const reset = useCallback(() => setWidth(latest.current.defaultWidth), [setWidth]);

    const panResponder = useMemo(() => {
        const finish = () => {
            const l = latest.current;
            if (dragging.current) {
                dragging.current = false;
                setIsResizing(false);
                l.onResizeEnd?.(l.width);
                return;
            }
            // No drag happened: treat as a tap and look for a double tap.
            if (!l.resetOnDoubleTap) return;
            const now = Date.now();
            if (now - lastTap.current <= DOUBLE_TAP_MS) {
                lastTap.current = 0;
                reset();
            } else {
                lastTap.current = now;
            }
        };

        return PanResponder.create({
            onStartShouldSetPanResponder: () => latest.current.enabled,
            onMoveShouldSetPanResponder: () => latest.current.enabled,
            // Once the user grabbed the handle, no ancestor (e.g. a scroll view) may steal the drag.
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: () => {
                startWidth.current = latest.current.width;
                dragging.current = false;
            },
            onPanResponderMove: (_, gesture) => {
                if (!dragging.current) {
                    if (Math.abs(gesture.dx) < DRAG_SLOP) return;
                    dragging.current = true;
                    setIsResizing(true);
                    latest.current.onResizeStart?.(latest.current.width);
                }
                // The master pane sits at the trailing edge in RTL, so dragging right shrinks it.
                const direction = I18nManager.isRTL ? -1 : 1;
                applyWidth(startWidth.current + gesture.dx * direction);
            },
            onPanResponderRelease: finish,
            onPanResponderTerminate: finish,
        });
    }, [applyWidth, reset]);

    return {
        width: resolved,
        isResizing,
        setWidth,
        reset,
        panHandlers: panResponder.panHandlers,
    };
}