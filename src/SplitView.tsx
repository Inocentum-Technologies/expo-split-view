import { Stack, useTheme } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColorValue, StyleSheet, View, useWindowDimensions } from 'react-native';
import type { SplitViewProps } from './types';

export function SplitView({
    masterList,
    children,
    masterListWidth = 320,
    tabletBreakpoint = 768,
    containerStyle,
    masterStyle,
    detailStyle,
    stackScreenOptions = { headerShown: true },
    safeAreaEdges = ['left', 'right', 'bottom'],
}: SplitViewProps) {
    const { width } = useWindowDimensions();
    const theme = useTheme();
    const isTablet = width >= tabletBreakpoint;

    // Fill all safe-area padding gutters (status-bar strip, camera-cutout gap,
    // home-indicator strip) with the theme background so they never show a
    // jarring white/default colour in dark mode.
    const gutterBg = (theme?.colors?.background ?? '#ffffff') as ColorValue;

    return (
        // SafeAreaView applies the correct platform insets for the requested edges
        // automatically — no manual useSafeAreaInsets math required.
        // Developers can limit which edges are consumed via the safeAreaEdges prop
        // (e.g. ['left', 'right'] when a parent already handles top/bottom).
        <SafeAreaView
            edges={safeAreaEdges}
            style={[styles.container, { backgroundColor: gutterBg }, containerStyle]}
        >
            {/*
                The Master pane stays mounted at all times to preserve component states.
                On tablet, it sits on the left with fixed width.
                On phone, it is hidden with display: 'none' and width: 0.
                SafeAreaView's left-edge inset pushes the entire row, so the left
                pane naturally starts after the camera cutout — no width math needed.
            */}
            <View
                style={[
                    styles.leftPane,
                    {
                        borderColor: (theme?.colors?.border ?? '#e0e0e0') as ColorValue,
                        backgroundColor: (theme?.colors?.card ?? '#ffffff') as ColorValue,
                        width: masterListWidth,
                    },
                    !isTablet && styles.hiddenPane,
                    masterStyle,
                ]}
            >
                {masterList}
            </View>

            {/*
                The Detail pane holds the active screens.
                When rotating, the stack stays mounted so user inputs and scroll states persist.
            */}
            <View
                style={[
                    styles.rightPane,
                    { backgroundColor: (theme?.colors?.background ?? '#ffffff') as ColorValue },
                    detailStyle,
                ]}
            >
                {children ?? <Stack screenOptions={stackScreenOptions} />}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    leftPane: {
        borderRightWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    rightPane: {
        flex: 1,
    },
    hiddenPane: {
        display: 'none',
        width: 0,
    },
});
