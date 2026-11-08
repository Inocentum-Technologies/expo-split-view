# Example App

A responsive demonstration application powered by **Expo Router** and **`expo-split-view`** is located in the [`example-split-view-root/`](https://github.com/Inocentum-Technologies/expo-split-view/tree/main/example-split-view-root) directory.

This example showcases how `expo-split-view` smoothly transitions between tablet master-detail split layout and mobile full-screen stack navigation with zero state loss and synchronized back navigation.

## Quick Start

### From the Root Directory:

```bash
npm run example:root
```

> [!TIP]
> To run the nested split-view example, use `npm run example:nested`. See [`example-split-view-nested`](https://github.com/Inocentum-Technologies/expo-split-view/tree/main/example-split-view-nested).

### Or Directly from the `example-split-view-root/` Directory:

```bash
cd example-split-view-root
npm install
npm start
```

Press:
- **`w`** to open in Web Browser
- **`i`** to open in iOS Simulator
- **`a`** to open in Android Emulator


## How to Test Responsive Split View

### 1. Web Browser
Run `npm run web` (or press `w` in terminal). Simply drag and resize the browser window:
- **Width >= 768px (Tablet / Desktop):** Displays the master list on the left (340px) and the detail stack on the right.
- **Width < 768px (Mobile):** Automatically transitions to full-screen stack navigation.

### 2. iOS Simulator
- Run on iPad or iPhone.
- On iPhone or iPad, rotate using `Cmd + Left Arrow` / `Cmd + Right Arrow` to test orientation changes.

### 3. Android Emulator
- Run on a tablet emulator, phone emulator, or foldable device.

## What This Example Demonstrates

### 1. Compound Component API
- `<SplitView masterList={<MasterList />}>` in `src/app/(home)/_layout.tsx`
- `<SplitView.Placeholder masterList={<MasterList />} />` in `src/app/(home)/index.tsx`
- Detail screen in `src/app/(home)/[id].tsx`

### 2. Smart Navigation (`useSplitView`)
- Automatically uses `router.replace` on tablets (preventing right-pane history buildup) and dismisses nested subpages cleanly when selecting a new item.
- Automatically uses `router.push` on mobile (preserving native back stack).

### 3. State Preservation Across Form Factors
- Search for frameworks, apply category filters, or select an item.
- Resize the window or rotate the device between phone and tablet modes.
- The selected framework, search query, filter states, and master list scroll position remain completely intact because `<SplitView>` never unmounts either pane.

### 4. Resilient Mobile Back Navigation (`useDetailScreenBack`)
- When transitioning from tablet to mobile where `router.replace` left the stack without a root `index`, the hook automatically provides:
  - Header back button with platform-adaptive back icon
  - iOS edge-swipe gesture support
  - Android hardware back button handler
  - Safe fallback route navigation

### 5. Detail Screen & Subpage Navigation
- Select any framework to inspect its comprehensive overview, key highlights, metadata, or visit the official framework documentation.
- Navigate deeper to subpages (`src/app/(home)/subpage.tsx`) inside the right pane. When a different framework is clicked in the master list, `useSplitView` dismisses subpages so the newly selected item starts fresh.

### 6. Edge Inset & Theme Adaptation
- Uses `safeAreaEdges={['left', 'right']}` to cleanly handle landscape cutouts without adding redundant top padding.
- Seamlessly adapts between light and dark themes based on system preferences across the master list, search chips, cards, and detail pane.

