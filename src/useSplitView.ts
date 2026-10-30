import { type Href, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import type { UseSplitViewResult } from './types';

/**
 * Hook to simplify responsive navigation in master-detail split views.
 *
 * `navigate(href)` automatically:
 * - Uses `router.replace(href)` on tablets (so right-pane history doesn't pile up).
 * - Uses `router.push(href)` on phones (so the back button naturally pops back to the master list).
 */
export function useSplitView(breakpoint = 768): UseSplitViewResult {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isTablet = width >= breakpoint;

    const navigate = useCallback(
        (href: Href) => {
            if (isTablet) {
                // Tablets: Replace active right-pane route
                router.replace(href);
            } else {
                // Phones: Push to stack normally
                router.push(href);
            }
        },
        [isTablet, router]
    );

    return {
        isTablet,
        width,
        navigate,
    };
}
