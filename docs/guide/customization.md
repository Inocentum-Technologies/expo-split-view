# Customization

Customize the placeholder, header back navigation, and gestures to fit your design system.

---

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

---

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

---

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

---

## Left Sidebar Header & Outer Back Navigation

When `<SplitView>` is placed inside a root stack or outer navigator (e.g. navigating from a Home or Dashboard screen into a SplitView screen), tablet users need a way to navigate back to the parent screen.

`<SplitView>` provides a built-in sidebar header that coordinates with the outer navigator:

```tsx
<SplitView
  masterList={<MasterList />}
  leftHeader={true}
  leftHeaderTitle="Categories"
  leftHeaderHeight={56}
  leftHeaderBackIconColor="#007AFF"
/>
```

When `leftHeader` is `true`, `<SplitViewSidebarHeader>` automatically monitors the outer navigation stack. If `canGoBack` is true, it displays an adaptive platform back button (iOS chevron / Android arrow). Pressing it pops the host screen—without disturbing any subpages or state in the right-pane detail stack.

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

---

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

