# Getting Started

`expo-split-view` is an adaptive master-detail split-view architecture for **Expo Router**. It seamlessly transitions between a tablet master-detail layout and a full-screen mobile stack navigation without unmounting components or losing state.

Supports **Android**, **iOS**, and **Web**, and works in **Expo Go** out of the box with zero native build dependencies.

---

## Features

- **Adaptive Split Layout:** Automatically presents a side-by-side master-detail pane on tablets, desktops, and wide viewports, and transitions to a native full-screen stack on mobile phones.
- **State Preservation Across Form Factors:** Screens and inputs remain mounted when rotating between orientations or unfolding foldable devices. Form input values, search queries, and scroll positions are preserved.
- **Smart Responsive Navigation (`useSplitView`):** The `navigate` helper automatically executes `router.replace` on tablets (preventing right-pane history stacking) and `router.push` on phones (preserving native back history).
- **Resilient Mobile Back Navigation:** Intervenes only on mobile when `router.replace` on a tablet leaves the phone stack without a root `index` screen in history. Automatically injects a header back button, listens to the Android hardware back button, and binds edge-swipe gestures.
- **Compound Component API:** Provides clean, declarative compound components (`<SplitView>`, `<SplitView.Placeholder>`, `<SplitView.Detail>`) as well as direct named exports.
- **Expo Go & Web Ready:** Built using standard React Native and Expo Router primitives with zero native build dependencies.

---

## Installation

Install the package in your Expo project:

```bash
npx expo install expo-split-view
```

### Expo Config Plugin (Optional)

Add the config plugin to your `app.json` to automatically enable iPad / tablet multitasking support (`ios.supportsTablet: true`) in native builds:

```json
{
  "expo": {
    "plugins": ["expo-split-view"]
  }
}
```

---

## How It Works

```text
+-----------------------------------------------------------------------------------+
| TABLET VIEW (width >= 768)                                                        |
| +------------------------------------+------------------------------------------+ |
| | LEFT PANE (MasterList - width: 320)| RIGHT PANE (<Stack /> navigation)        | |
| |                                    |                                          | |
| | [Item A] (Active) --------------> | Shows: app/items/[id]                    | |
| | [Item B]                           | (or placeholder if no item is selected)  | |
| | [Item C]                           |                                          | |
| +------------------------------------+------------------------------------------+ |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| MOBILE VIEW (width < 768)                                                         |
| +-------------------------------------------------------------------------------+ |
| | MasterList stays mounted in background (display: 'none', width: 0).           | |
| | The <Stack /> occupies 100% of the screen:                                    | |
| |                                                                               | |
| | 1. Stack Root (index.tsx)     ==>  Renders MasterList full-screen             | |
| | 2. Tap item                   ==>  navigate('/items/[id]')                    | |
| | 3. Detail screen ([id].tsx)   ==>  <SplitView.Detail> provides safe back      | |
| +-------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### Tablet Layout (`width >= tabletBreakpoint`, default 768)
On tablets or desktop viewports, `<SplitView>` divides the screen horizontally:
- The **left pane** renders your master list with a fixed or customized width (default `320dp`).
- The **right pane** renders an Expo Router `<Stack />` displaying detail screens or a placeholder when no item has been chosen.
- Navigation via `navigate(href)` uses `router.replace` so selecting different master items does not create an endless navigation history inside the right pane.

### Mobile Layout (`width < tabletBreakpoint`)
On phones:
- The left pane is hidden (`display: 'none'`, `width: 0`), keeping all component state and scroll position intact in memory.
- The `<Stack />` expands to take up 100% of the screen.
- At the root `index.tsx`, `<SplitView.Placeholder>` renders the master list full-screen.
- When an item is tapped, `navigate(href)` calls `router.push`, pushing the detail screen natively onto the mobile stack.

