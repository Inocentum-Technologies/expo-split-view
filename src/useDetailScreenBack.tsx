import {
    type Href,
    useFocusEffect,
    useNavigation,
    useRouter,
    useSegments,
    useTheme,
} from 'expo-router';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react';
import {
    BackHandler,
    ColorValue,
    PanResponder,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
} from 'react-native';
import type { UseDetailScreenBackOptions, UseDetailBackResult } from './types';

function BackIcon({ color = '#007AFF' }: { color?: ColorValue }) {
    return <Text style={[styles.backIconText, { color }]}>
        {'<'}
    </Text>
}

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
        tabletBreakpoint = 768,
        backTitle = 'Back',
        showHeaderButton = true,
        renderBackIcon,
        tintColor: userTintColor,
        masterRouteName,
        isMasterRoute: userIsMasterRoute,
        onFallback,
        disableEdgeSwipeGesture = false,
    } = options;

    const router = useRouter();
    const navigation = useNavigation();
    const theme = useTheme();
    const segments = useSegments();
    const { width } = useWindowDimensions();
    const isTablet = width >= tabletBreakpoint;

    // Dynamically infer the parent route (e.g. dropping the active child segment) if not explicitly passed
    const defaultFallback = useMemo(() => {
        if (segments && segments.length > 1) {
            // Drops the last segment to target the parent layout/index
            const parentSegments = segments.slice(0, -1);
            return `/${parentSegments.join('/')}` as Href;
        }
        return '/' as Href;
    }, [segments]);

    const targetFallback = fallbackRoute ?? defaultFallback;

    // Helper to determine if a route corresponds to the master list
    const isIndexRoute = useCallback(
        (routeName: string) => {
            if (!routeName) return false;

            if (userIsMasterRoute) {
                return userIsMasterRoute(routeName);
            }

            const target = masterRouteName ?? 'index';

            // 1. Direct match with target name
            if (routeName === target) return true;

            // 2. Normalize route by removing search parameters, hashes, and trailing slashes
            const cleanPath = routeName.split('?')[0].split('#')[0].replace(/\/+$/, '');
            if (cleanPath === target || cleanPath === '' || (target === 'index' && cleanPath === '/')) {
                return true;
            }

            // 3. Match against the leaf segment
            const pathSegments = cleanPath.split('/').filter(Boolean);
            if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1] === target) {
                return true;
            }

            // 4. Strip route groups in parentheses, e.g. (tabs), (top-tabs), (drawer), (app), etc.
            const nonGroupSegments = pathSegments.filter(
                (seg) => !(seg.startsWith('(') && seg.endsWith(')'))
            );
            if (
                nonGroupSegments.length > 0 &&
                nonGroupSegments[nonGroupSegments.length - 1] === target
            ) {
                return true;
            }

            if (target === 'index' && nonGroupSegments.length === 0) {
                return true;
            }

            return false;
        },
        [userIsMasterRoute, masterRouteName]
    );

    // Check if the master list is currently present in this stack's navigation history
    const checkHasIndexInHistory = useCallback(() => {
        const state = navigation.getState();
        if (!state?.routes) return false;
        return state.routes.some((route) => isIndexRoute(route.name));
    }, [navigation, isIndexRoute]);

    // Force re-render whenever navigation state updates or screen gains focus
    const [, forceUpdate] = useState({});

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', () => {
            forceUpdate({});
        });
        return unsubscribe;
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            forceUpdate({});
        }, [])
    );

    const hasIndexInHistory = checkHasIndexInHistory();

    // Active condition: Intervene only on Mobile screens when the master list is NOT in history
    const showCustomMobileBack = !isTablet && !hasIndexInHistory;

    // On tablet, router.replace() is used to swap detail screens, so the placeholder is no longer
    // in history. When the user presses back at the root of a detail screen, the native stack has
    // nothing to pop and would exit the app. Intercept to return to the placeholder/fallback.
    const isTabletAtRoot = isTablet && !navigation.canGoBack();

    const handleBack = useCallback(() => {
        if (!isTablet && checkHasIndexInHistory()) {
            router.back();
        } else if (onFallback) {
            onFallback();
        } else {
            router.replace(targetFallback);
        }
    }, [isTablet, checkHasIndexInHistory, router, onFallback, targetFallback]);

    // Adaptive header tint color: user-specified color > theme colors > platform fallback
    const tintColor = userTintColor ?? (
        Platform.OS === 'ios'
            ? (theme?.colors?.primary || (theme?.dark ? '#0A84FF' : '#007AFF'))
            : (theme?.colors?.text || (theme?.dark ? '#FFFFFF' : '#111827'))
    );

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
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.backButtonPressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel="Back"
                    >
                        {renderBackIcon ? renderBackIcon({ color: tintColor }) : <BackIcon color={tintColor} />}
                        {Platform.OS === 'ios' && backTitle && (
                            <Text style={[styles.backText, { color: tintColor }]}>
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

    return {
        showCustomMobileBack,
        handleBack,
        panHandlers: panResponder.panHandlers,
        isTablet,
        hasIndexInHistory,
        isTabletAtRoot,
    };
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
    backIconText: {
        fontSize: 20,
        fontWeight: '600',
        marginRight: 4,
        lineHeight: 22,
    },
    backText: {
        fontSize: 17,
        marginLeft: 4,
    },
});
