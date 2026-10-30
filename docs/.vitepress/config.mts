import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "expo-split-view",
  description: "Adaptive master-detail split-view architecture for Expo Router",
  base: "/expo-split-view",
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/reference' },
      { text: 'Example App', link: '/guide/example' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Quick Start', link: '/guide/quick-start' },
          { text: 'Customization', link: '/guide/customization' },
          { text: 'Example App', link: '/guide/example' },
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Components & Hooks', link: '/api/reference' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Inocentum-Technologies/expo-split-view' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Inocentum Technologies'
    }
  }
})
