import type { Href } from 'expo-router';
import type { ReactNode } from 'react';
import type {
    ColorValue,
    GestureResponderHandlers, StyleProp, TextStyle, ViewStyle,
} from 'react-native';

export interface SplitViewProps {
    /**
   * The master list component or element to render.
   * On tablet screens, this is visible in the left pane.
   * On phone screens, this stays mounted but is hidden with zero width,
   * allowing the Stack to natively manage the full-screen view.
   */
    masterList: ReactNode;
    /**
     * Custom children to render in the right pane instead of the default `<Stack />`.
     */
    children?: ReactNode;
    /**
     * Width of the master pane on tablet in dp. Defaults to 320.
     */
    masterListWidth?: number;
    /**
     * Minimum screen width (in points) for tablet layout. Defaults to 768.
     */
    tabletBreakpoint?: number;
    /**
     * Style override for the outermost container view.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Custom master (left) pane style.
     */
    masterStyle?: StyleProp<ViewStyle>;
    /**
     * Custom detail (right) pane style.
     */
    detailStyle?: StyleProp<ViewStyle>;
    /**
     * Default screen options for the auto-rendered `<Stack />` when `children` is not provided.
     */
    stackScreenOptions?: Record<string, any>;
    /**
     * Which safe-area edges `SplitView` should consume via `SafeAreaView`.
     *
     * - `'left'`   – clears the camera cutout in landscape (shifts the master pane right). ✅ default
     * - `'right'`  – clears the trailing cutout / rounded corner in landscape. ✅ default
     * - `'bottom'` – clears the home indicator / Android navigation bar. ✅ default
     * - `'top'`    – clears the status bar / Dynamic Island. ⚠️ **NOT included by default.**
     *
     * `'top'` is intentionally excluded from the default because `expo-router`'s `<Stack>`
     * already calls `useSafeAreaInsets()` internally to position its header below the status bar.
     * Including `'top'` here would cause the status-bar height to be applied **twice**,
     * creating a large blank gap above every screen header.
     *
     * Only add `'top'` if you are using `headerShown: false` on **all** screens and are
     * managing the header yourself, or if `SplitView` is not wrapping a `<Stack>`.
     *
     * Pass an empty array `[]` to opt out entirely when a parent already handles all edges.
     */
    safeAreaEdges?: Array<'top' | 'left' | 'right' | 'bottom'>;
}

export interface SplitViewPlaceholderProps {
    /**
     * The master list component or element to render on phone screens.
     */
    masterList: ReactNode;
    /**
     * Optional custom placeholder element to render on tablet screens before an item is selected.
     */
    placeholder?: ReactNode;
    /**
     * Text for the default placeholder on tablet screens.
     * Defaults to 'Select an item from the left pane'.
     */
    placeholderText?: string;
    /**
     * Minimum screen width (in points) for tablet layout. Defaults to 768.
     */
    tabletBreakpoint?: number;
    /**
     * Style override for the tablet placeholder container.
     */
    placeholderContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Style override for the placeholder text.
     */
    placeholderTextStyle?: StyleProp<TextStyle>;
}

export interface UseDetailScreenBackOptions {
    /**
     * Route to navigate back to if the master list index is not in the history stack.
     * If omitted, it automatically resolves to the parent route inferred from the current segments.
     */
    fallbackRoute?: Href;
    /**
     * Optional screen title to set on the header.
     */
    title?: string;
    /**
     * Screen width breakpoint in points for tablet mode. Defaults to 768.
     */
    tabletBreakpoint?: number;
    /**
     * Text label next to back chevron on iOS (defaults to "Back"). Pass empty string `""` or `null` to hide.
     */
    backTitle?: string | null;
    /**
     * Whether to automatically inject the custom header back button when needed. Defaults to true.
     */
    showHeaderButton?: boolean;
    /**
     * Custom tint color for the back button, chevron, and title text.
     * Defaults to the theme primary color (iOS) or text color (Android/other).
     */
    tintColor?: ColorValue;
    /**
     * Name of the master list route to search for in navigation history. Defaults to 'index'.
     */
    masterRouteName?: string;
    /**
     * Custom predicate to determine whether a route name corresponds to the master list.
     */
    isMasterRoute?: (routeName: string) => boolean;
    /**
     * Optional custom fallback action called instead of `router.replace(targetFallback)`.
     * Useful for custom navigators, bottom sheets, or custom modal dismissals.
     */
    onFallback?: () => void;
    /**
     * Whether to disable edge-swipe back gesture handling. Defaults to false.
     */
    disableEdgeSwipeGesture?: boolean;
    /**
     * Custom back icon renderer. Defaults to '<'.
     */
    renderBackIcon?: (props: { color: ColorValue }) => ReactNode;
}

export interface UseDetailBackResult {
    /**
     * Whether the custom back handling is active (Mobile View & master list index not in stack history).
     */
    showCustomMobileBack: boolean;
    /**
     * Function that executes the safe back action.
     */
    handleBack: () => void;
    /**
     * Touch handlers to attach to your root container: `<View {...panHandlers}>`.
     */
    panHandlers: GestureResponderHandlers;
    /**
     * Whether the current screen is in tablet layout.
     */
    isTablet: boolean;
    /**
     * Whether the master list route is present in the stack's navigation history.
     */
    hasIndexInHistory: boolean;
    /**
     * Whether the current screen is on a tablet and at the root of the navigation stack
     * (i.e. the detail was opened via router.replace and there is nothing to pop).
     * Back is intercepted in this state to return to the placeholder/fallback instead of exiting the app.
     */
    isTabletAtRoot: boolean;
}

export interface SplitViewDetailProps {
    children: ReactNode;
    /**
     * Optional custom container style.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Optional configuration options for the back button and gesture handler.
     */
    backOptions?: UseDetailScreenBackOptions;
}

export interface UseSplitViewResult {
    /**
     * Whether the current screen is in tablet mode.
     */
    isTablet: boolean;
    /**
     * Current screen width in dp.
     */
    width: number;
    /**
     * Navigates to a detail route:
     * - On tablet: dismisses any pushed subpages and calls `router.replace(href)` so right-pane history does not accumulate across items.
     * - On phone: calls `router.push(href)` to push onto the stack natively.
     */
    navigate: (href: Href) => void;
}
