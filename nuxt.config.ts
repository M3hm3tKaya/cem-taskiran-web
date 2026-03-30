export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  // SPA modu — Three.js client-side gerektirir
  ssr: false,

  // Global stil dosyası
  css: ['~/assets/scss/main.scss'],

  // Modüller
  modules: ['@nuxt/image'],

  // Uygulama head ayarları
  app: {
    head: {
      title: 'CT1 Media — Production Infrastructure',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Entertainment production backed by technical infrastructure. Built for precision, speed, and platform intelligence.' },
        { name: 'theme-color', content: '#0E0E10' },
      ],
      link: [
        // IBM Plex Mono — Google Fonts preconnect + load
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap',
        },
      ],
    },
  },

  // SCSS global değişkenleri tüm componentlere inject et
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables" as *;',
          api: 'modern-compiler',
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            gsap: ['gsap', 'gsap/ScrollTrigger'],
          },
        },
      },
    },
  },

  // appManifest hatası susturma (Nuxt 3 bilinen sorun — dead code analiz hatası)
  experimental: {
    appManifest: false,
  },

  // Cloudflare Pages deploy (static SPA)
  nitro: {
    preset: 'cloudflare-pages-static',
  },

  devtools: { enabled: false },
})
