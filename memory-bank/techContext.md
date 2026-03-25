# Tech Context — HLE.IO Clone

## Tech Stack (Gerçek Versiyonlar)
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
- font-display: swap (Google Fonts varsayılanı)

## Renkler
- $bg-dark: #1A1A1D
- $bg-darker: #101011
- $text-white: #FFFFFF
- $text-gray: #888888
- $accent-cyan: #00D4FF
- $grid-color: #2A2A2D

## SCSS
- `additionalData` ile `_variables.scss` tüm `<style>` bloklarına inject
- Her partial kendi `@use 'variables' as *` import'unu yapıyor (SCSS modules kuralı)
- `main.scss` global stiller

## Plugin Entegrasyonu
- `gsap.client.ts`: GSAP register + provide
- `lenis.client.ts`: Lenis instance + GSAP ticker entegrasyonu + başlangıçta stop

## Build
- Production build başarılı
- Three.js chunk: ~500KB (gzip: ~128KB) — beklenen
- manualChunks ile three ve gsap ayrı chunk'larda
