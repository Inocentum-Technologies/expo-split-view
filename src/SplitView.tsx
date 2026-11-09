import { Stack, useNavigation, useTheme, type NativeStackNavigationOptions } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, useWindowDimensions, type ColorValue } from 'react-native';
import type { SplitViewProps } from './types';
import { SplitViewLocationContext } from './SplitViewLocationContext';
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { SplitViewSidebarHeader } from './SplitViewSidebarHeader';
import { SplitViewLeftHeaderContext } from './SplitViewLeftHeaderContext';
import { SplitViewBreakpointContext } from './SplitViewBreakpointContext';
import { DEFAULT_TABLET_BREAKPOINT } from './constants';

// Stable default references so they are not re-created on every render.
const DEFAULT_STACK_SCREEN_OPTIONS: NativeStackNavigationOptions = { headerShown: true };
const DEFAULT_SAFE_AREA_EDGES: NonNullable<SplitViewProps['safeAreaEdges']> = ['left', 'right', 'bottom'];

export function SplitView({
    masterList,
    children,
    masterListWidth = 320,
    unmountMasterOnPhone = false,
    tabletBreakpoint = DEFAULT_TABLET_BREAKPOINT,
    containerStyle,
    masterStyle,
    detailStyle,
    stackScreenOptions = DEFAULT_STACK_SCREEN_OPTIONS,
    safeAreaEdges = DEFAULT_SAFE_AREA_EDGES,
    leftHeader = false,
    leftHeaderTitle,
    renderBackIcon,
    leftHeaderHeight,
    leftHeaderBackIconColor,
    leftHeaderTitleAlign,
    leftHeaderTitleStyle,
    leftHeaderStyle,
}: SplitViewProps) {
    const { width } = useWindowDimensions();
    const theme = useTheme();
    const isTablet = width >= tabletBreakpoint;

    // By default the left pane stays mounted (hidden) on phones to preserve its state.
    // With `unmountMasterOnPhone` it is removed entirely, so the master list is only
    // mounted once (by SplitView.Placeholder inside the stack).
    const showLeftPane = isTablet || !unmountMasterOnPhone;

    // Fill all safe-area padding gutters (status-bar strip, camera-cutout gap,
    // home-indicator strip) with the theme background so they never show a
    // jarring white/default colour in dark mode.
    const gutterBg = (theme?.colors?.background ?? '#ffffff') as ColorValue;

    // Outer stack: confirmed by your log (routes: ["index", "home"]).
    const navigation = useNavigation();

    // canGoBack is derived from the outer stack state. Subscribing through
    // useSyncExternalStore re-renders only when the boolean actually flips
    // (instead of on every pathname change), and it re-checks the snapshot right
    // after mount, so a not-yet-complete state during the first render is corrected.
    const subscribeToNavState = useCallback(
        (notify: () => void) => navigation.addListener('state', notify),
        [navigation]
    );
    const getCanGoBack = useCallback(() => {
        const s = navigation.getState();
        return !!s && s.type === 'stack' && s.index > 0;
    }, [navigation]);
    const canGoBack = useSyncExternalStore(subscribeToNavState, getCanGoBack, getCanGoBack);

    const goBack = useCallback(() => navigation.goBack(), [navigation]);

    // after canGoBack and goBack are defined
    const leftHeaderValue = useMemo(() => ({ canGoBack, goBack }), [canGoBack, goBack]);

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
                The breakpoint context wraps BOTH panes so SplitView.Placeholder, useSplitView
                and useDetailScreenBack (rendered inside the stack) inherit `tabletBreakpoint`
                without it being passed again.
            */}
            <SplitViewBreakpointContext.Provider value={tabletBreakpoint}>
                {/*
                    The Master pane stays mounted at all times to preserve component states
                    (unless `unmountMasterOnPhone` is set).
                    On tablet, it sits on the left with fixed width.
                    On phone, it is hidden with display: 'none' and width: 0.
                    SafeAreaView's left-edge inset pushes the entire row, so the left
                    pane naturally starts after the camera cutout — no width math needed.
                */}
                {showLeftPane && (
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
                        <SplitViewLocationContext.Provider value="sidebar">
                            <SplitViewLeftHeaderContext.Provider value={leftHeaderValue}>
                                {leftHeader === true && (
                                    <SplitViewSidebarHeader
                                        title={leftHeaderTitle}
                                        renderBackIcon={renderBackIcon}
                                        backIconColor={leftHeaderBackIconColor}
                                        height={leftHeaderHeight}
                                        canGoBack={canGoBack}
                                        onBack={goBack}
                                        titleAlign={leftHeaderTitleAlign}
                                        titleStyle={leftHeaderTitleStyle}
                                        headerStyle={leftHeaderStyle}
                                    />
                                )}
                                {typeof leftHeader === 'function' && leftHeader({ canGoBack, goBack })}
                                {masterList}
                            </SplitViewLeftHeaderContext.Provider>
                        </SplitViewLocationContext.Provider>
                    </View>
                )}

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
            </SplitViewBreakpointContext.Provider>
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