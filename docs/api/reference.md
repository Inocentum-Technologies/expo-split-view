# API Reference

`expo-split-view` exposes compound components as well as direct named exports and hooks.

---

## Available Exports

| Export | Type | Description |
| :--- | :--- | :--- |
| `<SplitView>` | Component | Root layout component (renders left master pane and right `<Stack />`). |
| `<SplitView.Placeholder>` / `SplitViewPlaceholder` | Component | Displays master list on phone, placeholder on tablet. |
| `<SplitView.Detail>` / `SplitViewDetail` | Component | Detail screen container with auto-bound edge-swipe gestures. |
| `useSplitView(breakpoint?)` | Hook | Provides `{ isTablet, width, navigate(href) }`. |
| `useDetailScreenBack(options)` | Hook | Configures header back button, Android back handler, and edge-swipe gesture. |

---

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
| `tabletBreakpoint` | `number` | `768` | Viewport width threshold (in points) for tablet layout. |
| `containerStyle` | `StyleProp<ViewStyle>` | `undefined` | Styles applied to the root container. |
| `masterStyle` | `StyleProp<ViewStyle>` | `undefined` | Styles applied to the master (left) pane wrapper. |
| `detailStyle` | `StyleProp<ViewStyle>` | `undefined` | Styles applied to the detail (right) pane wrapper. |
| `stackScreenOptions`| `NativeStackNavigationOptions` | `{ headerShown: true }` | Screen options passed to the underlying Expo Router `<Stack />`. |
| `safeAreaEdges` | `Array<'top' \| 'left' \| 'right' \| 'bottom'>` | `['left', 'right', 'bottom']` | Safe-area edges consumed by `<SplitView>`. `'top'` is excluded by default to avoid double status-bar padding. |
| `leftHeader` | `boolean \| ((ctx: SplitViewLeftHeaderContext) => ReactNode)` | `false` | Left pane header. `true` renders built-in header with back button; a function lets you render custom header controls. |
| `leftHeaderTitle` | `string` | `undefined` | Title text displayed in the built-in sidebar header. |
| `renderBackIcon` | `() => ReactNode` | `undefined` | Custom back icon renderer for the built-in sidebar header. |
| `leftHeaderHeight` | `number` | `56` | Height in dp of the left sidebar header (excluding safe-area top inset). |
| `leftHeaderBackIconColor` | `string` | `undefined` | Tint color for the built-in sidebar header back icon. |
| `children` | `ReactNode` | `undefined` | Custom content for the right pane (overrides `<Stack />`). |

---

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
| `tabletBreakpoint` | `number` | `768` | Viewport width threshold (in points) for tablet layout. |
| `placeholderContainerStyle` | `StyleProp<ViewStyle>` | `undefined` | Style for the tablet placeholder container. |
| `placeholderTextStyle` | `StyleProp<TextStyle>` | `undefined` | Style for the tablet placeholder text. |

---

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

---

## `useSplitView()`

Helper hook that simplifies responsive layout detection and navigation across tablets and phones.

```tsx
import { useSplitView } from 'expo-split-view';

const { isTablet, width, navigate } = useSplitView(breakpoint?);
```

### Parameters

- `breakpoint` (`number`, optional, default `768`): The minimum width in dp to be considered a tablet layout.

### Return Value (`UseSplitViewResult`)

| Property | Type | Description |
| :--- | :--- | :--- |
| `isTablet` | `boolean` | `true` if current viewport width >= `breakpoint`. |
| `width` | `number` | Current screen width in points / dp. |
| `navigate` | `(href: Href) => void` | Navigates to a detail route: uses `router.replace(href)` on tablet and `router.push(href)` on phone. |

---

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
} = useDetailScreenBack(options);
```

### Options (`UseDetailScreenBackOptions`)

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `fallbackRoute` | `Href` | `parent route` | Target fallback route if the master list is absent from stack history (dynamically drops the active screen segment, or `'/'`). |
| `title` | `string` | `undefined` | Header title string. |
| `tabletBreakpoint` | `number` | `768` | Viewport width threshold (in points) for tablet layout. |
| `backTitle` | `string \| null` | `'Back'` | Back button label on iOS (pass `""` or `null` to hide). |
| `showHeaderButton` | `boolean` | `true` | Automatically inject custom back button when required. |
| `tintColor` | `ColorValue` | `theme-adaptive` | Custom tint color for back chevron and text (defaults to black in light mode and white in dark mode). |
| `masterRouteName` | `string` | `'index'` | Name of the master list route to search for in navigation history. |
| `isMasterRoute` | `(routeName: string) => boolean` | `undefined` | Custom predicate function to match the master list screen in stack history. |
| `onFallback` | `() => void` | `undefined` | Custom callback invoked on fallback navigation (e.g. for custom modals or bottom sheets). |
| `disableEdgeSwipeGesture` | `boolean` | `false` | Disable edge-swipe back gesture handling (e.g. inside swipeable tabs or bottom sheets). |
| `renderBackIcon` | `(props: { color?: ColorValue }) => ReactNode` | `undefined` | Custom back icon renderer (defaults to chevron `<`). |

### Return Value (`UseDetailBackResult`)

| Property | Type | Description |
| :--- | :--- | :--- |
| `showCustomMobileBack` | `boolean` | `true` when custom back behavior is active (phone & index absent from history). |
| `handleBack` | `() => void` | Executes safe back action (`router.back()` or fallback). |
| `panHandlers` | `GestureResponderHandlers` | Touch handlers for iOS edge-swipe back gesture. Handled automatically when using `<SplitView.Detail>`. |
| `isTablet` | `boolean` | `true` if current viewport width >= `tabletBreakpoint`. |
| `hasIndexInHistory` | `boolean` | `true` if `index` route exists in current stack navigation history. |
| `isTabletAtRoot` | `boolean` | `true` when on tablet and at the root of the navigation stack. Back is intercepted to return to placeholder/fallback instead of exiting the app. |

---

## Types

### `SplitViewLeftHeaderContext`

Context passed to the `leftHeader` render function:

```tsx
export type SplitViewLeftHeaderContext = {
  /** True when the screen hosting the split view has a previous screen to return to. */
  canGoBack: boolean;
  /** Pops the screen hosting the split view. Never pops right-pane screens. */
  goBack: () => void;
};
```

