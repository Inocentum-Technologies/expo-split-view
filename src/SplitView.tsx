import { Stack, useNavigation, usePathname, useTheme } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, useWindowDimensions, type ColorValue } from 'react-native';
import type { SplitViewProps } from './types';
import { SplitViewLocationContext } from './SplitViewLocationContext';
import { useCallback, useEffect, useState } from 'react';
import { SplitViewSidebarHeader } from './SplitViewSidebarHeader';

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
    leftHeader = false,
    leftHeaderTitle,
    renderBackIcon,
    leftHeaderHeight,
    leftHeaderBackIconColor,
}: SplitViewProps) {
    const { width } = useWindowDimensions();
    const theme = useTheme();
    const isTablet = width >= tabletBreakpoint;

    // Fill all safe-area padding gutters (status-bar strip, camera-cutout gap,
    // home-indicator strip) with the theme background so they never show a
    // jarring white/default colour in dark mode.
    const gutterBg = (theme?.colors?.background ?? '#ffffff') as ColorValue;

    // Outer stack: confirmed by your log (routes: ["index", "home"]).
    const navigation = useNavigation();
    const pathname = usePathname();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        const update = () => {
            const s = navigation.getState();
            setCanGoBack(!!s && s.type === 'stack' && s.index > 0);
        };

        update(); // after mount, so the state is complete
        return navigation.addListener('state', update);
    }, [navigation, pathname]);

    const goBack = useCallback(() => navigation.goBack(), [navigation]);

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
                <SplitViewLocationContext.Provider value="sidebar">
                    {leftHeader === true && (
                        <SplitViewSidebarHeader
                            title={leftHeaderTitle}
                            renderBackIcon={renderBackIcon}
                            backIconColor={leftHeaderBackIconColor}
                            height={leftHeaderHeight}
                            canGoBack={canGoBack}
                            onBack={goBack}
                        />
                    )}
                    {typeof leftHeader === 'function' && leftHeader({ canGoBack, goBack })}
                    {masterList}
                </SplitViewLocationContext.Provider>
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
