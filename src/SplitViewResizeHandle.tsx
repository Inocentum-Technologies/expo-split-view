import { Platform, StyleSheet, View, type ColorValue, type GestureResponderHandlers, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from 'expo-router';
import { RESIZE_ACCESSIBILITY_STEP } from './constants';
import type { SplitViewResizeHandleState } from './types';

export interface SplitViewResizeHandleProps {
    state: SplitViewResizeHandleState;
    hitWidth: number;
    panHandlers: GestureResponderHandlers;
    /** Custom visual. When omitted the built-in line + grip is drawn. */
    content?: ReactNode;
    style?: StyleProp<ViewStyle>;
    /** Called by accessibility increment / decrement actions with a delta in dp. */
    onNudge: (delta: number) => void;
}

const WEB_CURSOR = (Platform.OS === 'web' ? { cursor: 'col-resize' } : null) as ViewStyle | null;

function DefaultHandleVisual({ isResizing }: { isResizing: boolean }) {
    const theme = useTheme();
    const accent = (theme?.colors?.primary ?? '#007AFF') as ColorValue;
    const grip = (theme?.dark ? '#8E8E93' : '#B0B0B5') as ColorValue;

    return (
        <>
            {/* Divider highlight, only visible while dragging. */}
            <View
                style={[
                    styles.line,
                    isResizing && { backgroundColor: accent, width: 2 },
                ]}
            />
            {/* Grip pill, always visible so users can discover the handle. */}
            <View style={[styles.grip, { backgroundColor: isResizing ? accent : grip }]} />
        </>
    );
}

/**
 * Internal. Draggable strip centered on the boundary between the master and detail panes.
 * It takes no layout space (negative margins) and floats above both panes.
 */
export function SplitViewResizeHandle({
    state,
    hitWidth,
    panHandlers,
    content,
    style,
    onNudge,
}: SplitViewResizeHandleProps) {
    return (
        <View
            {...panHandlers}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel="Resize sidebar"
            accessibilityValue={{ min: state.minWidth, max: state.maxWidth, now: state.width }}
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={(e) => {
                if (e.nativeEvent.actionName === 'increment') onNudge(RESIZE_ACCESSIBILITY_STEP);
                if (e.nativeEvent.actionName === 'decrement') onNudge(-RESIZE_ACCESSIBILITY_STEP);
            }}
            style={[
                styles.hit,
                { width: hitWidth, marginStart: -hitWidth / 2, marginEnd: -hitWidth / 2 },
                WEB_CURSOR,
                style,
            ]}
        >
            <View style={styles.visual}>
                {content ?? <DefaultHandleVisual isResizing={state.isResizing} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    hit: {
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    // Custom content is purely visual; all touches go to the hit area.
    visual: {
        pointerEvents: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        flex: 1,
    },
    line: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 0,
        backgroundColor: 'transparent',
    },
    grip: {
        width: 4,
        height: 36,
        borderRadius: 2,
    },
});