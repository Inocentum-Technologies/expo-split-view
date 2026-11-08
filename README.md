<div align="center">

# expo-split-view

**Split-view layouts for Expo apps, built for [expo-router](https://docs.expo.dev/router/introduction/).**

[![npm version](https://img.shields.io/npm/v/expo-split-view?style=flat-square&logo=npm&color=cb3837)](https://www.npmjs.com/package/expo-split-view)
[![npm downloads (monthly)](https://img.shields.io/npm/dm/expo-split-view?style=flat-square&logo=npm)](https://www.npmjs.com/package/expo-split-view)
[![npm total downloads](https://img.shields.io/npm/dt/expo-split-view?style=flat-square&logo=npm&label=total%20downloads)](https://www.npmjs.com/package/expo-split-view)
[![Build Status](https://github.com/Inocentum-Technologies/expo-split-view/actions/workflows/release.yml/badge.svg)](https://github.com/Inocentum-Technologies/expo-split-view/actions/workflows/release.yml)
[![License](https://img.shields.io/npm/l/expo-split-view?style=flat-square)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Inocentum-Technologies/expo-split-view?style=flat-square&logo=github)](https://github.com/Inocentum-Technologies/expo-split-view/stargazers)
[![Docs](https://img.shields.io/badge/docs-hosted-blue?style=flat-square&logo=readthedocs&logoColor=white)](https://inocentum-technologies.github.io/expo-split-view/)
[![Expo Router](https://img.shields.io/badge/expo--router-only-000020?style=flat-square&logo=expo)](https://docs.expo.dev/router/introduction/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/Inocentum-Technologies/expo-split-view/pulls)

<img src="./assets/splitview-banner.png" alt="Split view in action" width="600" />

[**Documentation**](https://inocentum-technologies.github.io/expo-split-view/) ·
[**Report a Bug**](https://github.com/Inocentum-Technologies/expo-split-view/issues) ·
[**Request a Feature**](https://github.com/Inocentum-Technologies/expo-split-view/issues)

</div>

---

> [!IMPORTANT]
> This module works with **expo-router only**. `react-navigation` (standalone) is not supported.

Adaptive master-detail split-view architecture for **Expo Router**. Seamlessly transitions between a tablet master-detail layout and full-screen mobile stack navigation without unmounting components or losing state.

Supports **Android**, **iOS**, and **Web**, and works in **Expo Go** out of the box with zero native build dependencies.

<div align="center">
  <img src="./assets/splitview-demo.gif" alt="expo-split-view demo" width="600" />
</div>

### Key features

- 📐 **Adaptive split layout:** side-by-side master-detail on tablets, desktops, and wide viewports; native full-screen stack on phones
- 🧠 **State preserved across form factors:** inputs, search queries, and scroll positions survive rotation and foldable unfolding
- 🧭 **Smart responsive navigation:** `useSplitView().navigate` uses `replace` on tablets and `push` on phones
- ⬅️ **Sidebar header & outer back navigation:** built-in or custom left-pane header that safely pops the host screen
- 📱 **Resilient mobile back handling:** injected header back button, Android hardware back, and edge-swipe gesture support
- 🛡️ **Safe area management:** configurable `safeAreaEdges` that clear cutouts and home indicators without double padding
- 🧩 **Compound component API:** `<SplitView>`, `<SplitView.Placeholder>`, `<SplitView.Detail>`, plus direct named exports
- 🚀 **Expo Go & Web ready:** built on standard React Native and Expo Router primitives
- ✨ More coming soon... stay tuned! 😊

### Installation

```bash
npx expo install expo-split-view
```

See the [installation guide](https://inocentum-technologies.github.io/expo-split-view/) in the docs for the optional config plugin and full setup instructions.

### Documentation

Full API reference, guides, and examples are available at:  
[https://inocentum-technologies.github.io/expo-split-view/](https://inocentum-technologies.github.io/expo-split-view/)

### Examples

Runnable demo apps live in [`example-split-view-root`](./example-split-view-root) and [`example-split-view-nested`](./example-split-view-nested).

### License

MIT © [Inocentum Technologies](https://github.com/Inocentum-Technologies)