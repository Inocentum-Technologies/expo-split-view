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
                // Tablets: If user was navigating within subpages in the detail pane,
                // dismiss them first so the new item starts clean at the stack root
                // and previous detail screens/subpages do not linger in history.
                if (typeof router.canDismiss === 'function' && router.canDismiss()) {
                    router.dismissAll();
                }
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
