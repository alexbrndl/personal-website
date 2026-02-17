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
    'nuxt-studio',
    '@nuxt/devtools',
  ],

  components: [
    { path: '~/components/content', global: true, pathPrefix: false },
    { path: '~/components/craft', global: true, pathPrefix: false },
    { path: '~/components', ignore: ['content/**', 'craft/**'] },
  ],

  hooks: {
    'components:extend': (components) => {
      for (const c of components) {
        if (['ProsFigure'].includes(c.pascalName)) {
          c.global = true
        }
      }
    },
  },

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

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/avatar.png' },
      ],
    },
  },

  site: {
    url: 'https://alexbrndl.com',
    name: 'Alex Brondel',
    description: 'Portfolio de Alex Brondel',
    defaultLocale: 'fr',
  },

  sitemap: {
    zeroRuntime: true,
  },

  colorMode: {
    classSuffix: '',
  },

  studio: {
    repository: {
      provider: 'github',
      owner: 'alexbrndl',
      repo: 'personal-website',
    },
    meta: {
      components: {
        exclude: ['Prose*', '**/craft/**'],
      },
    },
  },

  devtools: { enabled: true },
})
