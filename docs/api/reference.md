# API Reference

`expo-split-view` exposes compound components as well as direct named exports and hooks.

::: warning Upgrading
`tabletBreakpoint` is now configured **only** on `<SplitView>`. It was removed from `<SplitView.Placeholder>`, `useSplitView()`, and `useDetailScreenBack()`. See the [migration guide](/guide/migration).
:::

## Available Exports

| Export | Type | Description |
| :--- | :--- | :--- |
| `<SplitView>` | Component | Root layout component (renders left master pane and right `<Stack />`). |
| `<SplitView.Placeholder>` / `SplitViewPlaceholder` | Component | Displays master list on phone, placeholder on tablet. |
| `<SplitView.Detail>` / `SplitViewDetail` | Component | Detail screen container with auto-bound edge-swipe gestures. |
| `<BackIcon>` / `BackIcon` | Component | Platform-adaptive back icon with automatic RTL handling and theme support. |
| `useSplitView()` | Hook | Provides `{ isTablet, width, navigate(href) }`. |
| `useDetailScreenBack(options)` | Hook | Configures header back button, Android back handler, and edge-swipe gesture. |
| `useCustomLeftHeader()` | Hook | Hook for master list components in the left pane to access `{ canGoBack, goBack }`. |


## `<SplitView />`

The root coordinator placed in your route group's `_layout.tsx`.

```tsx
import { SplitView } from 'expo-split-view';
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `masterList` | `ReactNode` | *required* | The master list element to render in the left pane. |
| `masterListWidth` | `number` | `320` | Width of the left pane on tablets (in dp / points). |
| `unmountMasterOnPhone` | `boolean` | `false` | Unmounts the left pane (master list and left header) on phones instead of keeping it mounted but hidden. See [Mounting behavior on phones](#mounting-behavior-on-phones). |
| `tabletBreakpoint` | `number` | `768` | Viewport width threshold (in points) for tablet layout. This is the **only** place the breakpoint is configured: `<SplitView.Placeholder>`, `useSplitView()`, and `useDetailScreenBack()` inside this `<SplitView>` read it automatically (they fall back to `768` outside a `<SplitView>`). |
| `containerStyle` | `StyleProp<ViewStyle>` | `undefined` | Styles applied to the root container. |
| `masterStyle` | `StyleProp<ViewStyle>` | `undefined` | Styles applied to the master (left) pane wrapper. |
| `detailStyle` | `StyleProp<ViewStyle>` | `undefined` | Styles applied to the detail (right) pane wrapper. |
| `stackScreenOptions`| `NativeStackNavigationOptions` | [see below](#stack-screen-option-defaults) | Screen options for the underlying Expo Router `<Stack />`, merged over the built-in defaults. Ignored when you pass `children`. |
| `safeAreaEdges` | `Array<'top' \| 'left' \| 'right' \| 'bottom'>` | `['left', 'right', 'bottom']` | Safe-area edges consumed by `<SplitView>`. `'top'` is excluded by default to avoid double status-bar padding. |
| `leftHeader` | `boolean \| ((ctx: SplitViewLeftHeaderValueProps) => ReactNode)` | `false` | Left pane header. `true` renders built-in header with back button; a function lets you render custom header controls. |
| `leftHeaderTitle` | `string` | `undefined` | Title text displayed in the built-in sidebar header. |
| `renderBackIcon` | `() => ReactNode` | `undefined` | Custom back icon renderer for the built-in sidebar header. |
| `leftHeaderHeight` | `number` | [platform-adaptive](#default-sidebar-header-height) | Height in dp of the left sidebar header (excluding safe-area top inset). |
| `leftHeaderBackIconColor` | `ColorValue` | `undefined` | Tint color for the built-in sidebar header back icon. |
| `leftHeaderTitleAlign` | `'left' \| 'center'` | `iOS: 'center', Android/Web: 'left'` | Title alignment for the built-in sidebar header. |
| `leftHeaderTitleStyle` | `StyleProp<TextStyle>` | `undefined` | Custom style for the built-in sidebar header title. |
| `leftHeaderStyle` | `StyleProp<ViewStyle>` | `undefined` | Custom style for the built-in sidebar header container. |
| `children` | `ReactNode` | `undefined` | Custom content for the right pane (overrides `<Stack />`). |

### Mounting behavior on phones

By default the left pane stays mounted on phones, hidden with `display: 'none'` and `width: 0`, so its state survives rotating to a tablet layout. The trade-off is that on phones your master list is mounted **twice**: once hidden in the left pane, and once by `<SplitView.Placeholder>` inside the stack. Its effects, subscriptions, and data fetching run for both copies.

Set `unmountMasterOnPhone` to remove the hidden copy:

```tsx
<SplitView masterList={<MasterList />} unmountMasterOnPhone />
```

With it enabled, below the breakpoint the left pane (including the built-in or custom `leftHeader`) is not rendered at all, so the master list is mounted only once. State held by the sidebar copy of the master list (scroll position, search text, and so on) is lost when the layout crosses the breakpoint, for example on rotation or window resize, because the pane remounts fresh when it becomes visible again. The right pane and its navigation state are not affected.

### Stack screen option defaults

When `children` is not provided, `<SplitView>` renders a `<Stack />` with these defaults:

```tsx
{
  headerShown: true,
  unstable_nativeProps: {
    headerConfig: {
      disableLeftInsetApplication: true,
      disableRightInsetApplication: true,
      disableBottomInsetApplication: true,
    },
  },
}
```

The inset flags stop the native header from applying left, right, and bottom insets on its own, since `<SplitView>` already handles them through `safeAreaEdges`.

Your `stackScreenOptions` are merged over these defaults, so you only need to pass what you want to change. Top-level options are merged shallowly, and `unstable_nativeProps` and its `headerConfig` are merged one level deeper, so overriding one inset flag keeps the other two.

::: warning
`unstable_nativeProps` is an unstable API of the underlying native stack and may change between `expo-router` / `react-native-screens` releases.
:::

### Default sidebar header height

When `leftHeaderHeight` is not set, the built-in sidebar header picks a height from the platform and window size. A device counts as tablet-sized when the smaller side of the window is at least 600dp.

| Platform | Height |
| :--- | :--- |
| iOS: iPad, or tablet-sized window | `50` |
| iOS: iPhone, portrait | `44` |
| iOS: iPhone, landscape | `32` |
| Android / Web: tablet-sized window | `64` |
| Android / Web: phone-sized window | `56` |

The safe-area top inset is added on top of these values.


## `<SplitView.Placeholder />`

Index component placed in your route group's root `index.tsx`. Also available as named export `SplitViewPlaceholder`.

```tsx
import { SplitView } from 'expo-split-view';
// or
import { SplitViewPlaceholder } from 'expo-split-view';
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `masterList` | `ReactNode` | *required* | The master list element rendered full-screen on phones. |
| `placeholder` | `ReactNode` | `undefined` | Custom placeholder element for tablets. |
| `placeholderText` | `string` | `'Select an item from the left pane'` | Text displayed in default tablet placeholder. |
| `placeholderContainerStyle` | `StyleProp<ViewStyle>` | `undefined` | Style for the tablet placeholder container. |
| `placeholderTextStyle` | `StyleProp<TextStyle>` | `undefined` | Style for the tablet placeholder text. |

::: info Tablet breakpoint
`<SplitView.Placeholder>` no longer takes a `tabletBreakpoint` prop. It uses the `tabletBreakpoint` of the parent `<SplitView>` (default `768`).
:::


## `<SplitView.Detail />`

Detail container component placed in your route group's `[id]/index.tsx`. Also available as named export `SplitViewDetail`.

```tsx
import { SplitView } from 'expo-split-view';
// or
import { SplitViewDetail } from 'expo-split-view';
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | *required* | The content of the detail screen. |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Container view style. |
| `backOptions` | `UseDetailScreenBackOptions` | `undefined` | Configuration options passed directly to `useDetailScreenBack`. |


## `useSplitView()`

Helper hook that simplifies responsive layout detection and navigation across tablets and phones.

```tsx
import { useSplitView } from 'expo-split-view';

const { isTablet, width, navigate } = useSplitView();
```

The hook takes no parameters. The tablet breakpoint comes from the parent `<SplitView>`'s `tabletBreakpoint` prop (default `768`, also used when the hook runs outside a `<SplitView>`).

### Return Value (`UseSplitViewResult`)

| Property | Type | Description |
| :--- | :--- | :--- |
| `isTablet` | `boolean` | `true` if current viewport width >= the parent `<SplitView>`'s `tabletBreakpoint`. |
| `width` | `number` | Current screen width in points / dp. |
| `navigate` | `(href: Href) => void` | Navigates to a detail route: uses `router.replace(href)` on tablet and `router.push(href)` on phone. |

The returned object is memoized, so it is safe to use in dependency arrays.


## `useDetailScreenBack()`

Custom hook for detail screens providing resilient back navigation and gestures when rotating between tablet and mobile layouts.

```tsx
import { useDetailScreenBack } from 'expo-split-view';

const {
  showCustomMobileBack,
  handleBack,
  panHandlers,
  isTablet,
  hasIndexInHistory,
  isTabletAtRoot,
} = useDetailScreenBack(options);
```

The tablet breakpoint comes from the parent `<SplitView>`'s `tabletBreakpoint` prop. It is not an option of this hook.

### Options (`UseDetailScreenBackOptions`)

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `fallbackRoute` | `Href` | `parent route` | Target fallback route if the master list is absent from stack history (dynamically drops the active screen segment, or `'/'`). |
| `title` | `string` | `undefined` | Header title string. |
| `backTitle` | `string \| null` | `'Back'` | Back button label on iOS (pass `""` or `null` to hide). |
| `showHeaderButton` | `boolean` | `true` | Automatically inject custom back button when required. |
| `tintColor` | `ColorValue` | `theme-adaptive` | Custom tint color for back chevron and text (defaults to black in light mode and white in dark mode). |
| `masterRouteName` | `string` | `'index'` | Name of the master list route to search for in navigation history. |
| `isMasterRoute` | `(routeName: string) => boolean` | `undefined` | Custom predicate function to match the master list screen in stack history. |
| `onFallback` | `() => void` | `undefined` | Custom callback invoked on fallback navigation (e.g. for custom modals or bottom sheets). An inline function is fine: the latest one is always called, without re-applying header options or handlers. |
| `disableEdgeSwipeGesture` | `boolean` | `false` | Disable edge-swipe back gesture handling (e.g. inside swipeable tabs or bottom sheets). |
| `renderBackIcon` | `(props: { color?: ColorValue }) => ReactNode` | `undefined` | Custom back icon renderer (defaults to chevron `<`). |

::: tip Memoize `renderBackIcon` and `isMasterRoute`
A new function identity makes the hook re-apply the header options (`renderBackIcon`) or re-subscribe to navigation events (`isMasterRoute`) on every render. Defining them outside the component, or wrapping them in `useCallback`, avoids that. `onFallback` does not need this.
:::

### Return Value (`UseDetailBackResult`)

| Property | Type | Description |
| :--- | :--- | :--- |
| `showCustomMobileBack` | `boolean` | `true` when custom back behavior is active (phone & index absent from history). |
| `handleBack` | `() => void` | Executes safe back action (`router.back()` or fallback). |
| `panHandlers` | `GestureResponderHandlers` | Touch handlers for iOS edge-swipe back gesture. Handled automatically when using `<SplitView.Detail>`. |
| `isTablet` | `boolean` | `true` if current viewport width >= the parent `<SplitView>`'s `tabletBreakpoint`. |
| `hasIndexInHistory` | `boolean` | `true` if `index` route exists in current stack navigation history. |
| `isTabletAtRoot` | `boolean` | `true` when on tablet and at the root of the navigation stack. Back is intercepted to return to placeholder/fallback instead of exiting the app. |

The hook does not re-render your screen on every navigation event or window resize. It re-renders only when the layout crosses the tablet breakpoint or when its navigation-derived values (whether the master list is in history, whether the stack can go back) change. The returned object is memoized, so it is safe to use in dependency arrays.


## `useCustomLeftHeader()`

Custom hook for master list components rendered inside the left pane. Use together with `leftHeader={false}` (default) on `<SplitView>` to build your own custom header or back navigation inside the master list.

```tsx
import { useCustomLeftHeader } from 'expo-split-view';

const { canGoBack, goBack } = useCustomLeftHeader();
```

### Return Value (`SplitViewLeftHeaderValueProps`)

| Property | Type | Description |
| :--- | :--- | :--- |
| `canGoBack` | `boolean` | `true` when the screen hosting the split view has a previous screen in the outer navigator. |
| `goBack` | `() => void` | Safely pops the screen hosting the split view (never pops right-pane screens). |

::: info Behavior Outside Sidebar
Outside the left sidebar (for example, on phones where `MasterList` is rendered in the root index screen), it safely returns `{ canGoBack: false, goBack: () => {} }`.
:::


## `<BackIcon />`

Reusable platform-adaptive back icon component rendering iOS chevron (`back-ios.png`) or Android arrow (`back-android.png`) based on `Platform.OS`. Automatically handles RTL mirroring via `I18nManager.isRTL` and adapts to light/dark color schemes. It is wrapped in `React.memo`, so it only re-renders when its props change.

```tsx
import { BackIcon } from 'expo-split-view';

<BackIcon color="#007AFF" size={24} />
```

### Props (`BackIconProps`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `color` | `ColorValue` | `theme-adaptive` | Tint color. Defaults to black in light mode (`#000000`) and white in dark mode (`#FFFFFF`). |
| `size` | `number` | `22 (iOS) / 24 (other)` | Rendered icon size in dp. |
| `style` | `StyleProp<ImageStyle>` | `undefined` | Additional styles applied to the icon image. |


## Types

### `SplitViewLeftHeaderValueProps`

Context value passed to the `leftHeader` render function and returned by `useCustomLeftHeader()`:

```tsx
export type SplitViewLeftHeaderValueProps = {
  /** True when the screen hosting the split view has a previous screen to return to. */
  canGoBack: boolean;
  /** Pops the screen hosting the split view. Never pops right-pane screens. */
  goBack: () => void;
};
```

### `BackIconProps`

Props accepted by `<BackIcon />`:

```tsx
export type BackIconProps = {
  /** Tint color. Defaults to black in light mode and white in dark mode. */
  color?: ColorValue;
  /** Rendered size in dp. Defaults to 22 on iOS and 24 elsewhere. */
  size?: number;
  style?: StyleProp<ImageStyle>;
};
```