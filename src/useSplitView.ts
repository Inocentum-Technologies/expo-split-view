import { type Href, useNavigation, usePathname, useRouter } from 'expo-router';
import { useCallback, useContext, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { SplitViewLocationContext } from './SplitViewLocationContext';
import { useTabletBreakpoint } from './SplitViewBreakpointContext';
import { getHostBasePath, matchesRouteName } from './navigation';
import type { UseSplitViewResult } from './types';

/** The placeholder is the layout's index screen. */
function isPaneRootRoute(routeName: string | undefined): boolean {
    return matchesRouteName(routeName, 'index');
}

export function useSplitView(): UseSplitViewResult {
    const router = useRouter();
    const navigation = useNavigation();
    const pathname = usePathname();
    const location = useContext(SplitViewLocationContext);
    const { width } = useWindowDimensions();
    // The breakpoint is configured once, on the parent <SplitView>.
    const breakpoint = useTabletBreakpoint();
    const isTablet = width >= breakpoint;

    const navigate = useCallback(
        (href: Href) => {
            if (!isTablet) {
                router.push(href);
                return;
            }

            // Read inside the callback so the state is never stale.
            const state = navigation.getState();
            const pane =
                location === 'sidebar'
                    ? state?.routes[state.index]?.state // pane Stack, child of the hosting route
                    : state; // already inside the pane

            // Pane not mounted yet, or not a stack: push never destroys history.
            // Expo Router 58's tree state can omit `type`, so a missing type is treated as a stack.
            if (!pane?.routes || (pane.type && pane.type !== 'stack')) {
                router.push(href);
                return;
            }

            const depth = pane.routes.length - 1; // screens above the pane root (index / placeholder)
            const paneRootIsPlaceholder = isPaneRootRoute(pane.routes[0]?.name);

            if (depth === 0 && paneRootIsPlaceholder) {
                // Normal case: the pane shows the placeholder. Push so Back returns to it.
                const outerState = location === 'sidebar' ? state : navigation.getParent()?.getState();
                const focusedRoute = outerState?.routes?.[outerState.index ?? 0];
                const atHostBase = getHostBasePath(pathname, focusedRoute?.name) === pathname;
                if (atHostBase) {
                    router.push(href);
                    return;
                }
            }

            if (!paneRootIsPlaceholder) {
                // The pane root is a directly loaded detail/subpage, not the placeholder.
                // Drop the whole stack so the new item does not inherit that history.
                if (depth > 0) router.dismiss(depth);
                router.replace(href);
                return;
            }

            // Keep the placeholder at the root, replace the first-level detail with the new
            // item, and drop any sub-page above it.
            // The pane is the deepest focused navigator, so these act on it, not the outer stack.
            if (depth >= 2) router.dismiss(depth - 1);
            router.replace(href);
        },
        [isTablet, router, navigation, location, pathname]
    );

    // Stable reference between renders so consumers can safely use the result in dependency arrays.
    return useMemo(() => ({ isTablet, width, navigate }), [isTablet, width, navigate]);
}