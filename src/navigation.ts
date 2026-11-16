import type { Href } from 'expo-router';

/** URL path segments with empty segments removed. */
export function getPathSegments(pathname: string): string[] {
    return pathname.split('/').filter(Boolean);
}

/**
 * Number of leading URL segments a route name contributes.
 * Route groups `(tabs)` and a trailing `index` do not add a segment.
 */
export function getRouteNameDepth(routeName: string | undefined): number {
    if (!routeName) return 0;
    return routeName
        .split('/')
        .filter((segment) => segment && segment !== 'index' && !(segment.startsWith('(') && segment.endsWith(')')))
        .length;
}

/**
 * Parent href of a resolved pathname: `/a/b/c` -> `/a/b`, `/a` -> `/`, `/` -> `null`.
 *
 * `usePathname()` is used as the source because it strips route groups and resolves
 * dynamic params, so the result is always a navigable href.
 */
export function getParentHref(pathname: string): Href | null {
    const segments = getPathSegments(pathname);
    if (segments.length === 0) return null;
    return `/${segments.slice(0, -1).join('/')}` as Href;
}

/**
 * Base path of the layout that hosts a `<SplitView>`.
 *
 * `hostRouteName` is the name of the focused route in the host's parent navigator
 * (for example `employees` or `(home)`), which tells how many leading pathname
 * segments belong to the host. Everything after that belongs to the pane stack.
 */
export function getHostBasePath(pathname: string, hostRouteName: string | undefined): string {
    const segments = getPathSegments(pathname).slice(0, getRouteNameDepth(hostRouteName));
    return `/${segments.join('/')}`;
}
