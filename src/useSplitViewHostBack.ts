import { type Href, useNavigation, usePathname, useRouter } from 'expo-router';
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { getHostBasePath, getParentHref } from './navigation';

export interface SplitViewHostBack {
    /** True when the host can leave: the outer stack has history, or a fallback parent exists. */
    canGoBack: boolean;
    /** Pops the host when possible, otherwise navigates to the resolved fallback. */
    goBack: () => void;
    /** Resolved fallback for the hosting screen. `null` when the host is the app root. */
    fallbackRoute: Href | null;
}

/**
 * Back state for the screen hosting a `<SplitView>`.
 *
 * On web, a reload rebuilds navigation state from the URL alone, so the outer stack
 * may have no history even though the host is not the app root. In that case the
 * sidebar back button targets the host's logical parent.
 */
export function useSplitViewHostBack(fallbackRoute?: Href): SplitViewHostBack {
    const navigation = useNavigation();
    const router = useRouter();
    const pathname = usePathname();

    const subscribe = useCallback(
        (notify: () => void) => navigation.addListener('state', notify),
        [navigation]
    );

    // A string snapshot keeps `useSyncExternalStore` stable between renders.
    const getSnapshot = useCallback(() => {
        const state = navigation.getState();
        if (!state?.routes) return '0:';
        // Expo Router 58's tree state can omit `type`, so a missing type is treated as a stack.
        const hasHistory = (!state.type || state.type === 'stack') && state.index > 0;
        return `${hasHistory ? 1 : 0}:${state.routes[state.index ?? 0]?.name ?? ''}`;
    }, [navigation]);

    const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    const separator = snapshot.indexOf(':');
    const hasHistory = snapshot.slice(0, separator) === '1';
    const hostRouteName = snapshot.slice(separator + 1);

    const inferredFallback = useMemo(
        () => getParentHref(getHostBasePath(pathname, hostRouteName)),
        [pathname, hostRouteName]
    );
    const resolvedFallback = fallbackRoute ?? inferredFallback;

    const goBack = useCallback(() => {
        // Read at call time so the handler never acts on a stale state.
        const state = navigation.getState();
        if ((!state?.type || state.type === 'stack') && (state?.index ?? 0) > 0) {
            navigation.goBack();
            return;
        }
        if (resolvedFallback) router.dismissTo(resolvedFallback);
    }, [navigation, router, resolvedFallback]);

    return useMemo(
        () => ({
            canGoBack: hasHistory || resolvedFallback !== null,
            goBack,
            fallbackRoute: resolvedFallback,
        }),
        [hasHistory, resolvedFallback, goBack]
    );
}
