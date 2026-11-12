# Changelog

All notable changes to `expo-split-view`, newest first. Releases are published on [npm](https://www.npmjs.com/package/expo-split-view).

## Unreleased

### 🚀 What's New

#### ↔️ Resizable master pane
- New opt-in `resizable` prop on `<SplitView>` (default `false`, so existing apps behave exactly as before). On tablet layouts a drag handle sits on the boundary between the panes and lets the user change the master pane width.
- **Limits:** `masterListMinWidth` (default `240`) and `masterListMaxWidth` (default `480`). The pane is additionally capped to 60% of the window so the detail pane stays usable.
- **Listeners:** `onMasterListResizeStart`, `onMasterListResize` (live, while dragging) and `onMasterListResizeEnd` (when the user lets go). Use `onMasterListResizeEnd` to persist the width.
- **Restoring a saved width:** pass it as `masterListWidth`. The pane adopts the new value whenever the prop changes, so an async storage read works. `masterListDefaultWidth` (default `320`) is what reset returns to.
- **Custom handle:** `resizeHandle` accepts any element (an `<Image>`, an SVG, a `<View>`) or a function receiving `{ width, minWidth, maxWidth, isResizing }`. `resizeHandleHitWidth` and `resizeHandleStyle` control the touch target.
- **Double tap to reset:** a double tap on the handle restores `masterListDefaultWidth` (turn off with `resetWidthOnDoubleTap={false}`).
- **`useSplitViewResize()`:** new hook returning `{ resizable, width, minWidth, maxWidth, isResizing, setWidth, reset }` for any component inside a `<SplitView>`.
- Also works with RTL layouts and web mouse dragging, and exposes accessibility increment / decrement actions on the handle.
- See [Resizable master pane](/guide/customization#resizable-master-pane) and the [API reference](/api/reference#resizable-master-pane).

### 🔄 Behavior notes

- `masterListWidth` now defaults to `masterListDefaultWidth` (still `320`), and the pane adopts new values of the prop at runtime. Apps that only set a fixed `masterListWidth` are unaffected.

## 0.0.4-rc.1

::: warning Breaking change
`tabletBreakpoint` is now configured only on `<SplitView>`. See [Upgrading](#upgrading) below or the [migration guide](/guide/migration).
:::

### ⚠️ Breaking Changes

#### Single source of truth for `tabletBreakpoint`
The tablet breakpoint is now set once, on `<SplitView>`. `<SplitView.Placeholder>`, `useSplitView()`, and `useDetailScreenBack()` read it automatically, so the layout, the placeholder, the hooks, and back handling can no longer disagree about what counts as a tablet.

**Removed:**
- The `tabletBreakpoint` prop of `<SplitView.Placeholder>`.
- The `breakpoint` argument of `useSplitView(breakpoint?)`, which is now `useSplitView()`.
- The `tabletBreakpoint` option of `useDetailScreenBack()` (and of `backOptions` on `<SplitView.Detail>`).

Outside a `<SplitView>`, the hooks and the placeholder fall back to the default `768`. TypeScript reports every leftover usage; in plain JavaScript the old values are silently ignored. Apps that never customized the breakpoint are not affected.

### 🚀 What's New

#### 📱 Opt-in `unmountMasterOnPhone`
- New `<SplitView>` prop (default `false`, so existing apps behave exactly as before).
- By default the master list is mounted **twice** on phones: once hidden in the left pane and once full-screen by `<SplitView.Placeholder>`, so its effects, subscriptions, and data fetching run twice. With `unmountMasterOnPhone`, the hidden left pane (including `leftHeader`) is not rendered below the breakpoint, so the master list is mounted once.
- Trade-off: state held by the sidebar copy of the master list (scroll position, search text) is lost when the layout crosses the breakpoint, because the pane remounts fresh when it returns.
- See [Mounting behavior on phones](/api/reference#mounting-behavior-on-phones).

#### 🧱 Smarter `stackScreenOptions`
- Your `stackScreenOptions` are now merged over the built-in defaults, so you only pass what you want to change. Top-level options merge shallowly; `unstable_nativeProps` and its `headerConfig` merge one level deeper.
- The defaults now also include native header inset flags (`unstable_nativeProps.headerConfig`: `disableLeftInsetApplication`, `disableRightInsetApplication`, `disableBottomInsetApplication`), since `<SplitView>` already handles those insets through `safeAreaEdges`.
- See [Stack screen option defaults](/api/reference#stack-screen-option-defaults).

#### 📐 Refined sidebar header sizing
The built-in sidebar header (`leftHeader={true}`) now adapts to the window as well as the platform. A window counts as tablet-sized when its smaller side is at least `600dp`.

| Platform | Default height |
| :--- | :--- |
| iOS: iPad or tablet-sized window | `50` |
| iOS: iPhone, portrait | `44` |
| iOS: iPhone, landscape | `32` |
| Android / Web: tablet-sized window | `64` |
| Android / Web: phone-sized window | `56` (previously `64`) |

Set `leftHeaderHeight` to override. See [Default sidebar header height](/api/reference#default-sidebar-header-height).

### ⚡ Performance

- **Fewer re-renders on resize:** `<SplitView>`, `<SplitView.Placeholder>`, and `useDetailScreenBack()` now re-render only when the window width crosses the breakpoint, not on every resize tick. This matters most for web window drags, iPad Stage Manager, and foldables.
- **`<SplitView>` no longer re-renders on every route change.** The outer back state is read through a subscription and only triggers a render when `canGoBack` actually flips.
- **`useDetailScreenBack()` re-renders only when needed:** it re-renders when the layout crosses the breakpoint or when its navigation-derived values change, not on every navigation `state` or `focus` event.
- **Stable handlers:** an inline `onFallback` no longer rebuilds the back handler, the edge-swipe `PanResponder`, the header options, and the hardware-back subscription on every render.
- **Memoized results:** `useSplitView()` and `useDetailScreenBack()` return memoized objects, so they are safe to use in dependency arrays.
- **Stable defaults:** default `stackScreenOptions`, `safeAreaEdges`, and the placeholder's header options are module-level constants instead of new objects on every render.
- **`<BackIcon />`** is wrapped in `React.memo` and its style is memoized.

### 🛠️ Improvements & Refactoring

- **Sidebar header:** `renderBackIcon` is now called only when the back button is actually visible. The duplicated back button was extracted into one internal component.
- **Web:** fixed the `pointerEvents` prop deprecation warning in the sidebar header by moving it into `style`.
- **RTL:** the `<BackIcon />` mirror flip is now a static style, applied only in RTL layouts.
- **Internal:** the default breakpoint and the breakpoint context live in internal modules that are not part of the public exports.
- **JSDoc:** updated `stackScreenOptions` and `leftHeaderHeight`, and fixed the `index.ts` usage example to use `masterList`.

### 📦 Packaging

- `react` is now declared as a `>=18` peer dependency (required by `useSyncExternalStore`).
- `@expo/config-plugins` is now listed in `peerDependencies` (still optional via `peerDependenciesMeta`), so package managers no longer warn about a meta entry without a peer.
- Added `"sideEffects": false` so bundlers can tree-shake unused exports.
- `prepublishOnly` now runs the typecheck, so a broken build cannot be published.
- `expo`, `expo-router`, `react`, `react-native`, and `react-native-safe-area-context` were added as `devDependencies` so `npm run typecheck` works in CI. `isolatedModules` is enabled in `tsconfig.json`.

### 📖 Documentation

- New [migration guide](/guide/migration) and this changelog page.
- Updated the [API reference](/api/reference), [Getting Started](/guide/getting-started), [Customization](/guide/customization), and [Example](/guide/example) pages with `tabletBreakpoint`, `unmountMasterOnPhone`, `stackScreenOptions` defaults, the new header heights, and `isTabletAtRoot`.
- Documented that `renderBackIcon` and `isMasterRoute` should be defined outside the component or wrapped in `useCallback`.

### 🔄 Upgrading

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

Search your project for `tabletBreakpoint`, `useSplitView(`, and `backOptions` to find leftovers. If you relied on the previous fixed sidebar header heights, set `leftHeaderHeight` explicitly.

## 0.0.3-rc.2

### 🚀 What's New

#### 📱 Native Platform-Adaptive Sidebar Header
- **Dynamic Platform Height**: The left sidebar header (`leftHeader={true}`) now automatically matches native platform navigation stack specifications:
  - **iPad**: `50dp`
  - **iPhone**: `44dp`
  - **Android & Web (Material 3)**: `64dp`
  - Integrated safe-area top inset padding (`height + insets.top`).
- **Platform Title Alignment**: The title now defaults to `'center'` on iOS and `'left'` on Android and Web, conforming to native platform header conventions.
- **New Header Styling Props**:
  - `leftHeaderTitleAlign`: Control title alignment (`'left' | 'center'`).
  - `leftHeaderTitleStyle`: Custom `TextStyle` overrides for the header title.
  - `leftHeaderStyle`: Custom `ViewStyle` overrides for the header container.
  - `leftHeaderBackIconColor`: Now typed as `ColorValue` (supporting dynamic colors and `PlatformColor`).

#### 📦 New Example: Nested Split View App (`example-split-view-nested`)
- Added a full demo application showcasing how to nest `<SplitView>` inside an outer Expo Router stack (`Dashboard → Employees`):
  - Demonstrates left sidebar header integration and safe outer back navigation.
  - Demonstrates multi-page right-pane stack flows (`/employees/[id]` → `/employees/leave`).
  - Demonstrates bottom sheet integration in master-detail flows.
  - Added runnable root shortcut: `npm run example:nested`.

### 🛠️ Improvements & Refactoring

- **Encapsulated Internal Header Component**: Kept `SplitViewSidebarHeader` and its internal props scoped to the component rather than leaking internal implementation types into public root exports.
- **TypeScript Interface Standardization**: Standardized prop definitions to TypeScript `interface` declarations.
- **JSDoc & Docstring Fixes**: Corrected documentation for `leftHeader` default value (`false`).

### 📖 Documentation

- Updated `docs/api/reference.md` and `docs/guide/customization.md` with:
  - Details on the new platform-adaptive sizing defaults and title alignment.
  - Code examples for `leftHeaderTitleAlign`, `leftHeaderTitleStyle`, and `leftHeaderStyle`.
  - Comprehensive comparison between root and nested layout patterns.

## 0.0.3-rc.1

### 🚀 Features & Enhancements

- **Custom Left Pane Headers**: Added `useCustomLeftHeader` and `SplitViewLeftHeaderContext`, allowing custom master list components to access navigation controls (`canGoBack`, `goBack`).
- **Exported `BackIcon`**: Exported the platform-adaptive `BackIcon` component directly from the root package.
- **Placeholder Header Fix**: Configured `SplitViewPlaceholder` to hide default left back buttons when displayed on tablets.

### 🛠️ Improvements & Refactor

- **Back Button Tint Color**: Simplified back button tint color handling across `useDetailScreenBack` and `SplitViewSidebarHeader`.
- **CI / Release Workflow**: Streamlined the automated GitHub Release and npm publish workflow.

### 📖 Documentation & Assets

- Updated `README.md` layout with demo GIF, badges, and quick-start links.
- Added API reference guides and examples for custom sidebar headers in VitePress docs.

## 0.0.2-beta

### 🚀 Features & Enhancements

- **`BackIcon` Component**: Added the platform-adaptive `BackIcon` component for back buttons.

### 🐛 Bug Fixes

- **Nested Screen Navigation**: Fixed navigation handling for nested screens.
- **TypeScript Types**: Fixed type definitions.

### 🛠️ Improvements & Refactor

- **Simplified Codebase**: Cleaned up and simplified the internal code.

### 📖 Documentation

- Updated the documentation.

## 0.0.1-beta

### Initial Beta Version

**Supports:** Android, iOS, Web, and Expo Go.

**What it does:**
- Mobile / small screens: behaves like a normal stack with full-screen navigation.
- Tablet / desktop / landscape: splits the screen into left (master) and right (detail) panes using Expo Router.
- Preserves state when rotating or resizing, with no unmounting and no lost form inputs.
- Smart navigation helper (`useSplitView`): uses `router.replace` on tablets to avoid history stacking in the right pane and `router.push` on phones so native back works.
- Handles mobile back: header back button, Android hardware back, and edge-swipe gestures.
- Works on Android, iOS, and Web, including Expo Go with zero native dependencies.
- Optional config plugin for iPad multitasking in native builds.