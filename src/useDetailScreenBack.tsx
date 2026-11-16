import {
    type Href,
    useFocusEffect,
    useNavigation,
    usePathname,
    useRouter,
} from 'expo-router';
import {
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useSyncExternalStore,
} from 'react';
import { BackHandler, PanResponder } from 'react-native';
import type { UseDetailScreenBackOptions, UseDetailBackResult } from './types';
import { HeaderBackButton } from './HeaderBackButton';
import { useIsTablet } from './SplitViewBreakpointContext';
import { getParentHref } from './navigation';

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
    // The real URL: route groups stripped and dynamic params resolved, unlike useSegments().
    const pathname = usePathname();
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

    // Infer the parent from the resolved pathname (e.g. dropping the active child segment).
    const defaultFallback = useMemo(
        () => getParentHref(pathname) ?? ('/' as Href),
        [pathname]
    );

    const targetFallback = fallbackRoute ?? defaultFallback;
    const hasLogicalParent = getParentHref(pathname) !== null;

    // Helper to determine if a route corresponds to the master list
    const isIndexRoute = useCallback(
        (routeName: string) => {
            if (!routeName) return false;
            if (userIsMasterRoute) return userIsMasterRoute(routeName);

            const target = masterRouteName ?? 'index';
            if (routeName === target) return true;

            // Normalize route by stripping search params, hash, and route groups
            const pathSegments = routeName
                .split(/[?#]/)[0]
                .split('/')
                .filter(Boolean)
                .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')));

            if (pathSegments.length === 0) {
                return target === 'index';
            }

            // A dynamic segment such as `[id]/index` is a detail route, not the master list.
            if (pathSegments.some((seg) => seg.startsWith('['))) {
                return false;
            }

            return pathSegments[pathSegments.length - 1] === target;
        },
        [userIsMasterRoute, masterRouteName]
    );

    // Check if the master list is currently present in this stack's navigation history
    const checkHasIndexInHistory = useCallback(() => {
        const state = navigation.getState();
        if (!state?.routes) return false;
        return state.routes.some((route) => isIndexRoute(route.name));
    }, [navigation, isIndexRoute]);

    // Only this navigator's stack matters. `navigation.canGoBack()` would also report
    // parent history, which after a reload with anchors is true while the pane stack is
    // still at its root and the native header shows no back arrow.
    // Expo Router 58's tree state can omit `type`, so a missing type is treated as a stack.
    const checkCanGoBack = useCallback(() => {
        const state = navigation.getState();
        if (!state?.routes) return false;
        if (state.type && state.type !== 'stack') return false;
        return state.index > 0;
    }, [navigation]);

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

    // Intervene whenever this stack has nothing to pop but the screen has a logical
    // parent: reload / direct URL, on phone and tablet alike.
    const showCustomBack = hasLogicalParent && !canGoBack;
    // Kept for consumers that only want the phone-specific flag.
    const showCustomMobileBack = showCustomBack && !isTablet;

    // On tablet, router.replace() is used to swap detail screens, so the placeholder is no longer
    // in history. When the user presses back at the root of a detail screen, the native stack has
    // nothing to pop and would exit the app. Intercept to return to the placeholder/fallback.
    const isTabletAtRoot = isTablet && !canGoBack;

    const handleBack = useCallback(() => {
        const state = navigation.getState();
        const hasStackHistory =
            !!state?.routes && (!state.type || state.type === 'stack') && state.index > 0;
        if (hasStackHistory) {
            router.back();
        } else if (onFallbackRef.current) {
            onFallbackRef.current();
        } else {
            router.dismissTo(targetFallback);
        }
    }, [navigation, router, targetFallback]);

    // 1. Header Back Button
    useLayoutEffect(() => {
        if (!showHeaderButton) return;

        navigation.setOptions({
            ...(title !== undefined ? { title } : {}),
            // When native history exists, keep the default native back behavior.
            headerBackVisible: !showCustomBack,
            headerLeft: showCustomBack
                ? () => (
                    <HeaderBackButton
                        onPress={handleBack}
                        tintColor={tintColor}
                        backTitle={backTitle}
                        renderBackIcon={renderBackIcon}
                    />
                )
                : undefined,
        });
    }, [
        navigation,
        showHeaderButton,
        title,
        showCustomBack,
        tintColor,
        backTitle,
        handleBack,
        renderBackIcon,
    ]);

    // 2. Android Hardware Back Button & System Back Gesture
    useFocusEffect(
        useCallback(() => {
            // Intercept back when the custom back is active, OR when on tablet at the stack
            // root (detail was opened via router.replace so there is nothing native to pop).
            if (!showCustomBack && !isTabletAtRoot) return;

            const onHardwareBack = () => {
                handleBack();
                return true;
            };

            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                onHardwareBack
            );
            return () => subscription.remove();
        }, [showCustomBack, isTabletAtRoot, handleBack])
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
            showCustomBack,
            showCustomMobileBack,
            handleBack,
            panHandlers,
            isTablet,
            hasIndexInHistory,
            isTabletAtRoot,
        }),
        [
            showCustomBack,
            showCustomMobileBack,
            handleBack,
            panHandlers,
            isTablet,
            hasIndexInHistory,
            isTabletAtRoot,
        ]
    );
}