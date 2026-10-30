# Quick Start

This guide demonstrates how to set up `expo-split-view` in an Expo Router application.

::: info Flexible Route Structure
`expo-split-view` works in **any Expo Router route group** — inside a tab layout, as a standalone stack, or nested within a drawer. A tab layout is not required but is fully supported. Common scenarios include:
- A tab inside `app/(tabs)/items/` — split view as one tab among others
- A standalone stack at `app/items/` — no tabs at all
- Nested inside a drawer at `app/(drawer)/items/`
:::

---

## File Structure

A standard file structure for a split-view route group looks like this:

```text
app/
  items/
    _layout.tsx       <-- Layout coordinator (<SplitView>)
    index.tsx         <-- Root index screen (<SplitView.Placeholder>)
    [id]/
      index.tsx       <-- Detail screen (<SplitView.Detail>)
components/
  MasterList.tsx      <-- Shared master list with useSplitView()
```

---

## Step-by-Step Implementation

### 1. Route Group Layout (`app/items/_layout.tsx`)

Render `<SplitView>` in your route group layout, passing your master list component:

```tsx
import React from 'react';
import { MasterList } from '@/components/MasterList';
import { SplitView } from 'expo-split-view';

export default function ItemsLayout() {
  return <SplitView masterList={<MasterList />} />;
}
```

### 2. Route Index (`app/items/index.tsx`)

Use `<SplitView.Placeholder>` for the root index screen. On mobile, it displays the master list full-screen. On tablet, it displays a placeholder until an item is selected:

```tsx
import React from 'react';
import { MasterList } from '@/components/MasterList';
import { SplitView } from 'expo-split-view';

export default function ItemsIndex() {
  return (
    <SplitView.Placeholder
      masterList={<MasterList />}
      placeholderText="Select an item from the list to view its details."
    />
  );
}
```

### 3. Master List Component (`components/MasterList.tsx`)

Use the `useSplitView` hook to handle navigation. Calling `navigate(route)` automatically calls `router.replace` on tablets and `router.push` on mobile devices:

```tsx
import React from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { useSplitView } from 'expo-split-view';

export function MasterList({ items }: { items: { id: string; title: string }[] }) {
  const { navigate, isTablet } = useSplitView();

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigate(`/items/${item.id}`)}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
```

### 4. Detail Screen (`app/items/[id]/index.tsx`)

Wrap your detail screen in `<SplitView.Detail>` to automatically attach edge-swipe gesture handlers, and call `useDetailScreenBack` to handle back button behavior:

```tsx
import React from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SplitView, useDetailScreenBack } from 'expo-split-view';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  useDetailScreenBack({
    title: `Item #${id}`,
    fallbackRoute: '/items',
  });

  return (
    <SplitView.Detail>
      <View>
        <Text>Viewing details for item #{id}</Text>
      </View>
    </SplitView.Detail>
  );
}
```

---

## Next Steps

- Check out [Customization](/guide/customization) to tailor placeholder content, back options, and header icons.
- Explore the [Example App](/guide/example) to see a full, interactive implementation with filters, search, and nested navigation.

