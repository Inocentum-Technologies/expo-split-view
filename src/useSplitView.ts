import { type Href, useNavigation, useRouter } from 'expo-router';
import { useCallback, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { SplitViewLocationContext } from './SplitViewLocationContext';
import type { UseSplitViewResult } from './types';
import { DEFAULT_TABLET_BREAKPOINT } from './constants';

export function useSplitView(breakpoint = DEFAULT_TABLET_BREAKPOINT): UseSplitViewResult {
    const router = useRouter();
    const navigation = useNavigation();
    const location = useContext(SplitViewLocationContext);
    const { width } = useWindowDimensions();
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
            if (!pane || pane.type !== 'stack') {
                router.push(href);
                return;
            }

            const depth = pane.routes.length - 1; // screens above the pane root (index / placeholder)

            if (depth === 0) {
                router.push(href);
                return;
            }

            // The pane is the deepest focused navigator, so these act on it, not the outer stack.
            if (depth >= 2) router.dismiss(depth - 1);
            router.replace(href);
        },
        [isTablet, router, navigation, location]
    );

    return { isTablet, width, navigate };
}