# Customization
Customize the placeholder, header back navigation, and gestures to fit your design system.

## Passing Back Options to `<SplitView.Detail>`

You can configure header options and back behavior directly on `<SplitView.Detail>` via the `backOptions` prop instead of invoking `useDetailScreenBack` manually:

```tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SplitView } from 'expo-split-view';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SplitView.Detail
      style={styles.container}
      backOptions={{
        title: `Item #${id}`,
        fallbackRoute: '/items',
        backTitle: 'Back',
        tintColor: '#4F46E5',
      }}
    >
      <Text>Detail Screen Content</Text>
    </SplitView.Detail>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
});
```

## Custom Tablet Placeholder Component

Pass a custom React element to the `placeholder` prop on `<SplitView.Placeholder>` to customize the empty state on tablets and wide displays:

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MasterList } from '@/components/MasterList';
import { SplitView } from 'expo-split-view';

export default function ItemsIndex() {
  return (
    <SplitView.Placeholder
      masterList={<MasterList />}
      placeholder={
        <View style={styles.placeholderContainer}>
          <Text style={styles.icon}>📋</Text>
          <Text style={styles.title}>No Item Selected</Text>
          <Text style={styles.subtitle}>Pick an item on the left to get started</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
```

## Custom Header Back Icon

Provide a custom icon renderer to `renderBackIcon` in `useDetailScreenBack` (or in `backOptions`):

```tsx
import { Ionicons } from '@expo/vector-icons';
import { useDetailScreenBack } from 'expo-split-view';

useDetailScreenBack({
  title: `Item #${id}`,
  fallbackRoute: '/items',
  renderBackIcon: ({ color }) => (
    <Ionicons name="chevron-back" size={24} color={color} />
  ),
});
```

::: tip
Define `renderBackIcon` outside your component (or wrap it in `useCallback`). A new function on every render makes the hook re-apply the header options each time.
:::

## Left Sidebar Header & Outer Back Navigation

When `<SplitView>` is placed inside a root stack or outer navigator (e.g. navigating from a Home or Dashboard screen into a SplitView screen), tablet users need a way to navigate back to the parent screen.

`<SplitView>` provides a built-in sidebar header that coordinates with the outer navigator:

```tsx
<SplitView
  masterList={<MasterList />}
  leftHeader={true}
  leftHeaderTitle="Categories"
  leftHeaderBackIconColor="#007AFF"
  leftHeaderTitleAlign="left" // optional: defaults to 'center' on iOS and 'left' on Android/Web
  leftHeaderTitleStyle={{ fontWeight: '700' }}
  leftHeaderStyle={{ backgroundColor: '#fcfcfc' }}
/>
```

When `leftHeader` is `true`, `<SplitView>` automatically monitors the outer navigation stack:
- **Outer Back Navigation**: If `canGoBack` is true, an adaptive platform back button (iOS chevron / Android arrow) is displayed. Pressing it safely pops the host screen in the outer navigator without disturbing right-pane detail screens or history.
- **Platform-Adaptive Sizing**: The sidebar header height automatically conforms to native platform guidelines while accounting for safe-area top insets: 50dp on iPad, 44dp on iPhone in portrait (32dp in landscape), and 64dp on Android/Web tablet-sized windows (56dp on phone-sized windows). Override with `leftHeaderHeight` if needed. See [Default sidebar header height](/api/reference#default-sidebar-header-height) for the exact rules.
- **Platform-Adaptive Alignment**: Titles default to center alignment on iOS and left alignment on Android and Web, conforming to platform conventions. Override with `leftHeaderTitleAlign`.

### Custom Sidebar Header

You can also pass a render function to `leftHeader` to render custom actions, titles, or search bars:

```tsx
<SplitView
  masterList={<MasterList />}
  leftHeader={({ canGoBack, goBack }) => (
    <View style={styles.sidebarHeader}>
      {canGoBack && (
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.sidebarTitle}>Categories</Text>
    </View>
  )}
/>
```

### Custom Header in Master List (`useCustomLeftHeader`)

When building a custom header directly inside your `MasterList` component (or when leaving `leftHeader={false}`), use the `useCustomLeftHeader()` hook to access the outer navigator's back state:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCustomLeftHeader, BackIcon } from 'expo-split-view';

export function MasterList() {
  const { canGoBack, goBack } = useCustomLeftHeader();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {canGoBack && (
          <TouchableOpacity onPress={goBack} hitSlop={8} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Categories</Text>
      </View>
      {/* Master list items */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: { marginRight: 8 },
  title: { fontSize: 18, fontWeight: '600' },
});
```

On tablet, `canGoBack` is `true` when the screen hosting the split view has a previous screen in the outer navigator. On mobile (or outside the left pane), `canGoBack` is `false` and `goBack` is a safe no-op.

## Safe Area Configuration (`safeAreaEdges`)

`<SplitView>` uses `SafeAreaView` from `react-native-safe-area-context` to safely handle device insets across orientations.

By default, `safeAreaEdges` is set to `['left', 'right', 'bottom']`:
- **`'left'` & `'right'`**: Clears display cutouts and rounded edges when rotating tablets or phones into landscape mode.
- **`'bottom'`**: Clears the iOS home indicator strip and Android gesture navigation bar.
- **`'top'`**: Excluded by default because Expo Router's `<Stack>` automatically manages status-bar top padding. Adding `'top'` by default would cause double padding.

If you are using `headerShown: false` across all screens and managing headers yourself, you can include `'top'`:

```tsx
<SplitView
  masterList={<MasterList />}
  safeAreaEdges={['left', 'right', 'bottom', 'top']}
/>
```

Or pass an empty array `[]` if a parent layout container already handles all safe area insets.

## Tablet Breakpoint (`tabletBreakpoint`)

By default, widths of `768` points and above use the tablet split layout. Change the threshold with the `tabletBreakpoint` prop on `<SplitView>`, and only there:

```tsx
// app/items/_layout.tsx
<SplitView masterList={<MasterList />} tabletBreakpoint={900} />
```

`<SplitView.Placeholder>`, `useSplitView()`, and `useDetailScreenBack()` (including `backOptions` on `<SplitView.Detail>`) read this value automatically, so every part of your split view switches layouts at the same width. They have no breakpoint option of their own. If you are upgrading, see the [migration guide](/guide/migration).

## Stack Screen Options (`stackScreenOptions`)

Pass `stackScreenOptions` to configure the `<Stack />` that `<SplitView>` renders in the right pane. Your options are merged over the built-in defaults, so you only need to pass what you want to change:

```tsx
<SplitView
  masterList={<MasterList />}
  stackScreenOptions={{
    headerTintColor: '#4F46E5',
    headerLargeTitle: false,
  }}
/>
```

The defaults (`headerShown: true` plus native header inset flags) are listed in [Stack screen option defaults](/api/reference#stack-screen-option-defaults). `stackScreenOptions` is ignored when you pass your own `children` to `<SplitView>`.

## Avoiding the Duplicate Master List on Phones (`unmountMasterOnPhone`)

On phones, the left pane is kept mounted but hidden, so the master list is mounted twice: once in the hidden left pane and once by `<SplitView.Placeholder>` inside the stack. If your master list does expensive work on mount (network requests, subscriptions), opt in to unmounting the hidden copy:

```tsx
<SplitView masterList={<MasterList />} unmountMasterOnPhone />
```

Below the breakpoint the left pane, including `leftHeader`, is not rendered. The trade-off: state held by the sidebar copy of the master list (scroll position, search text) is lost when the layout crosses the breakpoint, because the pane remounts fresh when it returns. Keep the default (`false`) if preserving that state across rotation matters more than the duplicate mount.