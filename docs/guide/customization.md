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

