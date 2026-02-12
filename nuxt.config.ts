// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/color-mode',
    '@nuxt/devtools',
  ],

  css: ['~/assets/css/main.css'],

  content: {
    experimental: {
      sqliteConnector: 'native',
    },
    renderer: {
      anchorLinks: false,
    },
  },

  i18n: {
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
    ],
    defaultLocale: 'fr',
    strategy: 'no_prefix',
    langDir: '../locales/',
  },

  fonts: {
    families: [
      { name: 'Geist', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
    ],
  },

  image: {
    quality: 80,
    format: ['webp', 'avif'],
  },

  site: {
    url: 'https://alexbrndl.com',
    name: 'Alex Brondel',
    description: 'Portfolio de Alex Brondel',
    defaultLocale: 'fr',
  },

  colorMode: {
    classSuffix: '',
  },

  devtools: { enabled: true },
})
