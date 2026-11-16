# Migration Guide

Changes you may need to act on when upgrading to `expo-split-view` **0.0.4-rc.1**. For the full list of changes, see the [changelog](/guide/changelog).

## Breaking: `tabletBreakpoint` is configured only on `<SplitView>`

The tablet breakpoint is now set in one place, the `tabletBreakpoint` prop of `<SplitView>`. Everything inside that `<SplitView>` follows it automatically, so the layout, the placeholder, `useSplitView()`, and `useDetailScreenBack()` can no longer disagree about what counts as a tablet.

These per-component overrides were **removed**:

| Removed | Replacement |
| :--- | :--- |
| `<SplitView.Placeholder tabletBreakpoint={…} />` prop | Set `tabletBreakpoint` on `<SplitView>`. |
| `useSplitView(breakpoint)` argument | Call `useSplitView()` with no argument. |
| `tabletBreakpoint` option of `useDetailScreenBack()` (and of `backOptions` on `<SplitView.Detail>`) | Set `tabletBreakpoint` on `<SplitView>`. |

```tsx
// Before
<SplitView masterList={<MasterList />} tabletBreakpoint={900} />
<SplitView.Placeholder masterList={<MasterList />} tabletBreakpoint={900} />
const { isTablet } = useSplitView(900);
useDetailScreenBack({ tabletBreakpoint: 900 });

// After
<SplitView masterList={<MasterList />} tabletBreakpoint={900} />
<SplitView.Placeholder masterList={<MasterList />} />
const { isTablet } = useSplitView();
useDetailScreenBack();
```

::: warning
TypeScript reports an error for every leftover usage. In plain JavaScript the old values are silently ignored, so search your project for `tabletBreakpoint`, `useSplitView(` and `backOptions`.
:::

If you never customized the breakpoint, nothing changes: the default is still `768`. Outside a `<SplitView>`, `useSplitView()` and `useDetailScreenBack()` also fall back to `768`.

## Behavior changes to be aware of

### Sidebar header default height

The built-in sidebar header (`leftHeader={true}`) now picks its default height from the platform and window size: 50 on iPad or tablet-sized iOS windows, 44 on iPhone in portrait, 32 on iPhone in landscape, and on Android/Web 64 for tablet-sized windows and 56 for phone-sized ones (previously 64 on all Android/Web windows). If you need the exact old values, set `leftHeaderHeight` explicitly. See [Default sidebar header height](/api/reference#default-sidebar-header-height).

### `stackScreenOptions` defaults

The default options for the right-pane `<Stack />` now also include native header inset flags (`unstable_nativeProps.headerConfig`). Your `stackScreenOptions` are merged over the defaults, so options you already pass keep working. See [Stack screen option defaults](/api/reference#stack-screen-option-defaults).

### Back navigation after reload / direct URLs

Fallback targets are now derived from `usePathname()` instead of `useSegments()`, so
route groups are stripped and dynamic params are resolved. The old inference could
produce a literal `/(group)/[id]` path on reload.

- `<SplitView>` gained `fallbackRoute`. When the outer stack has no history, the
  sidebar back button goes to the inferred parent of the host layout (or the prop).
  It is now shown (and works) where it previously did nothing.
- `useCustomLeftHeader().canGoBack` can now be `true` when a logical parent exists,
  even without outer history. `goBack()` navigates to that fallback in that case.
- `useDetailScreenBack()` injects its header back button on tablets too, not only
  on phones. `showCustomMobileBack` remains as the phone-only alias of the new
  `showCustomBack`.
- Dynamic routes such as `[id]/index` are no longer mistaken for the master list
  when checking history.

If your app relied on the previous fallback path, pass `fallbackRoute` explicitly.
See [Reload and direct URLs](/api/reference#reload-and-direct-urls).

### Requirements

`react` 18 or newer is now declared as a peer dependency.

## New: `unmountMasterOnPhone`

An opt-in prop on `<SplitView>` (default `false`, so existing apps are unaffected) that unmounts the hidden left pane on phones, so your master list is mounted once instead of twice. See [Mounting behavior on phones](/api/reference#mounting-behavior-on-phones).

## Under the hood (no action needed)

- Components and hooks that depend on the breakpoint re-render only when the window width crosses it, not on every resize tick.
- `useDetailScreenBack()` re-renders only when its navigation-derived values change, not on every navigation event.
- `useSplitView()` and `useDetailScreenBack()` return memoized objects, and an inline `onFallback` no longer causes the hook to re-apply handlers on every render.
- `<BackIcon />` is wrapped in `React.memo`.