# Tech Context — CT1 Media Web

## Tech Stack
| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| Node.js | 22.20.0 | Runtime |
| Nuxt.js | 3.21.2 | SPA framework |
| Vue.js | 3.5.30 | Reactive UI |
| Vite | 7.3.1 | Build tool |
| Nitro | 2.13.2 | Server engine |
| Three.js | latest | 3D TV sahnesi |
| GSAP | latest | Animasyonlar + ScrollTrigger |
| Lenis | latest | Smooth scrolling |
| Sass | latest | CSS preprocessor |
| @vueuse/core | latest | Vue composable utilities |
| @nuxt/image | latest | Görsel optimizasyonu |

## Font
- IBM Plex Mono (Google Fonts — 400, 500, 700)

## Renkler
- $bg-dark: #0E0E10
- $bg-darker: #101011
- $text-white: #FFFFFF
- $text-gray: #888888
- $accent: #F04E23 (turuncu-kırmızı)
- $grid-color: #2A2A2D

## SCSS
- `additionalData` ile `_variables.scss` tüm `<style>` bloklarına inject
- `main.scss` global stiller

## Plugin Entegrasyonu
- `gsap.client.ts`: GSAP register + provide
- `lenis.client.ts`: Lenis instance + GSAP ticker entegrasyonu

## Assetler
- `public/ct-logo-white.png` — beyaz logo, şeffaf bg
- `public/ct-logo-orange.png` — turuncu logo, şeffaf bg (nav/header)
- `public/ct-logo-black.png` — siyah logo, şeffaf bg (TV sahnesi)
- `public/videos/CT_INTRO.mp4` — TV ekranı videosu (20MB)

## Deploy
- Cloudflare Pages (cloudflare-pages-static preset)
- Wrangler CLI ile deploy
- Domain: cem-taskiran-web.pages.dev / cem.mhtbilisim.com

## Build
- Three.js chunk ~500KB (gzip ~133KB)
- manualChunks ile three ve gsap ayrı chunk'larda
