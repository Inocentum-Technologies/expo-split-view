import {
    type Href,
    useFocusEffect,
    useNavigation,
    useRouter,
    useSegments,
} from 'expo-router';
import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useSyncExternalStore,
} from 'react';
import {
    BackHandler,
    PanResponder,
    Platform,
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';
import type { UseDetailScreenBackOptions, UseDetailBackResult } from './types';
import { BackIcon } from './BackIcon';
import { useIsTablet } from './SplitViewBreakpointContext';

/**
 * Custom hook to handle back navigation and gestures in master-detail split layouts.
 *
 * Works flexibly across bottom tabs, top tabs, stacks, drawers, and bottom sheets.
 * Solves the edge case where `router.replace` is used in Tablet UI, and subsequent rotation
 * or transition to Mobile View leaves the stack without a master list route in its history,
 * which normally causes back presses to bounce to another tab, exit the navigator, or do nothing.
 */
export function useDetailScreenBack(
    options: UseDetailScreenBackOptions = {}
): UseDetailBackResult {
    const {
        fallbackRoute,
        title,
        backTitle = 'Back',
        showHeaderButton = true,
        renderBackIcon,
        tintColor,
        masterRouteName,
        isMasterRoute: userIsMasterRoute,
        onFallback,
        disableEdgeSwipeGesture = false,
    } = options;

    const router = useRouter();
    const navigation = useNavigation();
    const segments = useSegments();
    // The breakpoint is configured once, on the parent <SplitView>.
    // Re-renders only when the window width crosses it, not on every resize tick.
    const isTablet = useIsTablet();

    // `onFallback` is only invoked from event handlers, never during render, so the latest
    // value can live in a ref. This keeps `handleBack` stable even when the consumer passes
    // an inline function (which would otherwise rebuild the PanResponder, re-run the
    // header `setOptions` effect and re-subscribe BackHandler on every render).
    const onFallbackRef = useRef(onFallback);
    useLayoutEffect(() => {
        onFallbackRef.current = onFallback;
    });

    // Dynamically infer the parent route (e.g. dropping the active child segment) if not explicitly passed
    const defaultFallback = useMemo(() => {
        if (segments.length > 1) {
            // Drops the last segment to target the parent layout/index
            return `/${segments.slice(0, -1).join('/')}` as Href;
        }
        return '/' as Href;
    }, [segments]);

    const targetFallback = fallbackRoute ?? defaultFallback;

    // Helper to determine if a route corresponds to the master list
    const isIndexRoute = useCallback(
        (routeName: string) => {
            if (!routeName) return false;
            if (userIsMasterRoute) return userIsMasterRoute(routeName);

            const target = masterRouteName ?? 'index';
            if (routeName === target) return true;

            // Normalize route by stripping search params, hash, and trailing slashes
            const cleanPath = routeName.split(/[?#]/)[0].replace(/\/+$/, '');
            const pathSegments = cleanPath.split('/').filter(Boolean);
            // Strip route groups in parentheses, e.g. (tabs), (drawer), (app)
            const nonGroupSegments = pathSegments.filter(
                (seg) => !(seg.startsWith('(') && seg.endsWith(')'))
            );

            if (nonGroupSegments.length === 0) {
                return target === 'index';
            }

            return nonGroupSegments[nonGroupSegments.length - 1] === target;
        },
        [userIsMasterRoute, masterRouteName]
    );

    // Check if the master list is currently present in this stack's navigation history
    const checkHasIndexInHistory = useCallback(() => {
        const state = navigation.getState();
        if (!state?.routes) return false;
        return state.routes.some((route) => isIndexRoute(route.name));
    }, [navigation, isIndexRoute]);

    const checkCanGoBack = useCallback(() => navigation.canGoBack(), [navigation]);

    // Re-render only when one of the derived booleans actually changes, instead of on every
    // navigation `state` event and every focus. Snapshots are re-read on each render too,
    // so width / option changes still pick up the latest values.
    const subscribeToNavigation = useCallback(
        (notify: () => void) => {
            const offState = navigation.addListener('state', notify);
            const offFocus = navigation.addListener('focus', notify);
            return () => {
                offState();
                offFocus();
            };
        },
        [navigation]
    );

    const hasIndexInHistory = useSyncExternalStore(
        subscribeToNavigation,
        checkHasIndexInHistory,
        checkHasIndexInHistory
    );
    const canGoBack = useSyncExternalStore(
        subscribeToNavigation,
        checkCanGoBack,
        checkCanGoBack
    );

    // Active condition: Intervene only on Mobile screens when the master list is NOT in history
    const showCustomMobileBack = !isTablet && !hasIndexInHistory;

    // On tablet, router.replace() is used to swap detail screens, so the placeholder is no longer
    // in history. When the user presses back at the root of a detail screen, the native stack has
    // nothing to pop and would exit the app. Intercept to return to the placeholder/fallback.
    const isTabletAtRoot = isTablet && !canGoBack;

    const handleBack = useCallback(() => {
        if (navigation.canGoBack() || (!isTablet && checkHasIndexInHistory())) {
            router.back();
        } else if (onFallbackRef.current) {
            onFallbackRef.current();
        } else {
            router.replace(targetFallback);
        }
    }, [navigation, isTablet, checkHasIndexInHistory, router, targetFallback]);

    // 1. Header Back Button
    useLayoutEffect(() => {
        if (!showHeaderButton) return;

        navigation.setOptions({
            ...(title !== undefined ? { title } : {}),
            // In Tablet UI or when native back history exists, keep default native back behavior
            headerBackVisible: !showCustomMobileBack,
            headerLeft: showCustomMobileBack
                ? () => (
                    <Pressable
                        onPress={handleBack}
                        hitSlop={12}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.backButtonPressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel="Back"
                    >
                        {renderBackIcon?.({ color: tintColor }) ?? <BackIcon color={tintColor} />}
                        {Platform.OS === 'ios' && backTitle && (
                            <Text
                                style={[
                                    styles.backText,
                                    tintColor ? { color: tintColor } : undefined,
                                ]}
                            >
                                {backTitle}
                            </Text>
                        )}
                    </Pressable>
                )
                : undefined,
        });
    }, [
        navigation,
        showHeaderButton,
        title,
        showCustomMobileBack,
        tintColor,
        backTitle,
        handleBack,
        renderBackIcon,
    ]);

    // 2. Android Hardware Back Button & System Back Gesture
    useFocusEffect(
        useCallback(() => {
            // Intercept back when the custom mobile back is active, OR when on tablet at the stack
            // root (detail was opened via router.replace so there is nothing native to pop).
            if (!showCustomMobileBack && !isTabletAtRoot) return;

            const onHardwareBack = () => {
                handleBack();
                return true;
            };

            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                onHardwareBack
            );
            return () => subscription.remove();
        }, [showCustomMobileBack, isTabletAtRoot, handleBack])
    );

    // 3. Mobile Edge-Swipe Back Gesture
    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => false,
                onMoveShouldSetPanResponder: (evt, gestureState) => {
                    if (!showCustomMobileBack || disableEdgeSwipeGesture) return false;
                    // Only intercept gestures beginning near the left edge (< 45px)
                    const isNearLeftEdge = evt.nativeEvent.pageX < 45;
                    // Must be a rightward drag that is predominantly horizontal
                    const isSwipingRight =
                        gestureState.dx > 15 &&
                        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
                    return isNearLeftEdge && isSwipingRight;
                },
                onPanResponderRelease: (_, gestureState) => {
                    if (disableEdgeSwipeGesture) return;
                    if (gestureState.dx > 50 || (gestureState.dx > 20 && gestureState.vx > 0.3)) {
                        handleBack();
                    }
                },
            }),
        [showCustomMobileBack, disableEdgeSwipeGesture, handleBack]
    );

    const { panHandlers } = panResponder;

    // Stable reference between renders so consumers can safely use the result in dependency arrays.
    return useMemo(
        () => ({
            showCustomMobileBack,
            handleBack,
            panHandlers,
            isTablet,
            hasIndexInHistory,
            isTabletAtRoot,
        }),
        [showCustomMobileBack, handleBack, panHandlers, isTablet, hasIndexInHistory, isTabletAtRoot]
    );
}

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingRight: 8,
        marginLeft: Platform.OS === 'ios' ? -8 : 0,
    },
    backButtonPressed: {
        opacity: 0.5,
    },
    backText: {
        fontSize: 17,
        marginLeft: 4,
    },
});