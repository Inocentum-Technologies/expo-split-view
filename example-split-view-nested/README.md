# expo-split-view Example App (Nested Layout)

A demonstration app showcasing how to nest **`expo-split-view`** inside an **Expo Router** parent navigation stack (e.g. Dashboard → Employees Directory).

This example highlights deep navigation patterns, left sidebar headers with outer back navigation, multi-screen navigation in the detail pane, and bottom sheets.

> [!TIP]
> Looking for a standalone root master-detail split view example? See the [`example-split-view-root`](../example-split-view-root) app (`npm run example:root`).

---

## Quick Start

### From the Root Directory:

```bash
npm run example:nested
```

### Or Directly from the `example-split-view-nested/` Directory:

```bash
cd example-split-view-nested
npm install
npm start
```

Press:
- **`w`** to open in Web Browser
- **`i`** to open in iOS Simulator
- **`a`** to open in Android Emulator

---

## How to Test Responsive Split View

### 1. Web Browser
Run `npm run web` (or press `w` in terminal). Simply drag and resize the browser window:
- **Width >= 768px (Tablet / Desktop):** 
  - On the Dashboard (`/`), tap the **Employees** KPI card to navigate into `/employees`.
  - The employees layout renders side-by-side: the `EmployeeList` on the left pane (340px) with its own sidebar header and back button, and the right pane hosting the detail screens.
  - Tapping the left sidebar back button pops out of the split view and returns to the Dashboard.
- **Width < 768px (Mobile):** 
  - Automatically transitions to a full-screen native stack flow: Dashboard → Employee List (`/employees`) → Employee Details (`/employees/[id]`) → Request Leave (`/employees/leave`).

### 2. iOS Simulator
- Run on an iPad or iPhone simulator.
- Use `Cmd + Left Arrow` / `Cmd + Right Arrow` to test orientation changes between portrait and landscape.

### 3. Android Emulator
- Run on a tablet emulator, phone emulator, or foldable device.

---

## App Architecture & Routing

```text
src/app/
├── _layout.tsx              # Root Stack navigator (Dashboard & Employees)
├── index.tsx                # Dashboard screen (KPI cards, stats, navigation trigger)
└── employees/               # Nested route group hosting SplitView
    ├── _layout.tsx          # SplitView layout coordinator (masterList + right stack)
    ├── index.tsx            # SplitView.Placeholder (tablet placeholder / phone master list)
    ├── [id].tsx             # Employee details screen wrapped in SplitView.Detail
    └── leave.tsx            # Request leave form pushed onto right-pane stack
```

---

## Key Features Demonstrated

### 1. Nested Split View in a Parent Stack
Shows how `<SplitView>` operates as a screen within an outer Expo Router stack (`src/app/_layout.tsx`):
- The outer navigator manages the parent stack (`/` Dashboard → `/employees`).
- The `/employees` route group hosts `<SplitView>` with its own independent right-pane stack navigation.

### 2. Left Sidebar Header & Outer Back Navigation (`leftHeader`)
In `src/app/employees/_layout.tsx`:
```tsx
<SplitView
  masterList={<EmployeeList />}
  masterListWidth={340}
  safeAreaEdges={['left', 'right']}
  leftHeader
  leftHeaderTitle="Employees"
/>
```
- On tablet / wide screens, renders a header above the left master pane titled **Employees**.
- Displays an adaptive platform back button that connects to the outer navigator, safely popping the entire split view back to the Dashboard without affecting or resetting inner right-pane routes.

### 3. Multi-Level Right Pane Stack Navigation
- From an employee's details screen (`/employees/[id]`), users can tap **Request Leave** to navigate to `/employees/leave?id=...`.
- On tablet, the leave request form opens inside the right pane stack while the employee master list remains pinned and fully interactive on the left pane.
- Navigating back from the leave form safely pops only the right-pane stack.

### 4. Smart Navigation (`useSplitView`)
In `src/components/employee-list.tsx`:
```tsx
const { navigate } = useSplitView();

// Calls router.replace on tablet (preventing right-pane history buildup)
// Calls router.push on phone (preserving native stack back navigation)
navigate(`/employees/${item.id}`);
```

### 5. Resilient Mobile Back Navigation (`SplitView.Detail`)
In `src/app/employees/[id].tsx`:
```tsx
<SplitView.Detail
  backOptions={{ fallbackRoute: '/employees', title: employee.name }}
>
  ...
</SplitView.Detail>
```
Handles smooth transitions between tablet and mobile even if the screen was loaded directly or history was replaced, ensuring the back button and swipe-to-go-back gesture always return safely to `/employees`.

### 6. Modern Native UI
Built with:
- **Tailwind CSS v4** via `uniwind`
- **PanelUI Native** (`panelui-native`) components: Cards, Badges, Avatars, KPI charts, DatePickers, and Bottom Sheets (`ResetPasswordSheet`)
- Edge-to-edge support with `react-native-keyboard-controller` and `react-native-safe-area-context`

