---
layout: home

hero:
  name: "expo-split-view"
  text: "Adaptive Master-Detail Split-View"
  tagline: Seamless tablet split layout and full-screen mobile stack navigation for Expo Router with zero state loss.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/reference
    - theme: alt
      text: View Example App
      link: /guide/example

features:
  - title: Adaptive Split Layout
    details: Automatically presents a side-by-side master-detail pane on tablets, desktops, and wide viewports, transitioning into a native full-screen stack on phones.
  - title: State Preservation Across Form Factors
    details: Screens and inputs remain mounted when rotating orientations or unfolding devices. Form inputs, search queries, and scroll positions stay preserved.
  - title: Smart Responsive Navigation
    details: useSplitView automatically performs router.replace on tablets to prevent right-pane history stacking, and router.push on mobile to preserve back stacks.
  - title: Resilient Mobile Back Navigation
    details: Gracefully handles transitions from tablet to mobile when router.replace leaves the stack without a root index screen. Injects custom header back button and edge-swipe gestures.
  - title: Compound Component API
    details: Clean, declarative compound components (SplitView, SplitView.Placeholder, SplitView.Detail) as well as direct named exports.
  - title: Expo Go & Web Ready
    details: Built with standard React Native and Expo Router primitives with zero native build dependencies. Works across iOS, Android, and Web out of the box.
---
