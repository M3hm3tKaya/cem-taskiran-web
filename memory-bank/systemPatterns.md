# System Patterns — CT1 Media Web

## Mimari
- Nuxt.js 3 SPA modu (ssr: false)
- Component-based yapı — Nuxt auto-import
- Composables ile logic ayrımı

## Component İsimlendirme (Nuxt Auto-Import)
- `components/intro/IntroScreen.vue` → `<IntroScreen />`
- `components/landing/TVScene.vue` → `<LandingTVScene />`
- `components/main/MainContent.vue` → `<MainContent />`
- `components/shared/CustomCursor.vue` → `<SharedCustomCursor />`

## State Akışı
```
pages/index.vue:
  showIntro (true) → onIntroComplete() → introDone=true, showTVScene visible
    → onTransitionToMain() → showMainContent (true)
  introDone prop → TVScene video başlatır
```

## Animasyon Mimarisi
- **IntroScreen:** Satır satır typewriter (reactive speed) → GSAP y:-100% perde kalkış → emit
- **TVScene:** useMousePerspective → Three.js rotation lerp + wheel zoom → triggerTransition → emit
- **MainContent:** Grid trail (canvas) + Word cloud (fade in/out, grid yerleşim) + RotatingDisk (scroll)

## Intro Scroll Engelleme
- Wheel: `capture: true` + `preventDefault` + `stopPropagation`
- Touch: `touchstart` + `touchmove` aynı pattern
- TV sahnesine event ulaşmaz, intro bitene kadar

## Word Cloud Yerleşim
- 3×2 grid (6 hücre), 5 kelime seçilir
- Her hücre içinde küçük rastgele offset (doğal dağınıklık)
- Tekrarsız kelime seçimi (shuffle)
- Fade out (0.8s) → pozisyon değiş → fade in (1.2s) → 3s görünür

## TV Sahnesi Video
- CT_INTRO.mp4, intro bittikten sonra başlar (currentTime = 0.3)
- Canvas çözünürlüğü 840×960 (2x), anisotropy 16
- Video roundRect clip (yuvarlatılmış köşeler)
- playbackRate 1.2x

## Day/Night Toggle
- 4 ışık kontrol: ambient, backLight, dirLight, frontFill
- Duvar renkleri: wallGroup.children [0]=backWall, [1]=shelfTop, [2]=frontWall
- Night %30 açık (önceki sürüme göre)
- Day moduna dönüş init değerleriyle birebir aynı

## Scroll Yönetimi
- Lenis: Plugin'de başlatılır, intro sırasında stop(), TV/Main'de start()
- Lenis ↔ GSAP: lenis.on('scroll', ScrollTrigger.update) + gsap.ticker.add(lenis.raf)

## Grid Snake Trail
- Bresenham interpolasyon (mouse hızlı giderken boşluk yok)
- pointermove event, sadece pointerType=mouse için interpolasyon
- Renk: #F04E23

## Responsive Yaklaşım
- Font boyutları vw tabanlı clamp()
- Intro mobil: 6 satır kırılım, 12vw font
- Touch event desteği (intro hızlandırma + TV sahne engelleme)

## Chunk Optimization
```js
manualChunks: { three: ['three'], gsap: ['gsap', 'gsap/ScrollTrigger'] }
```

## Z-index Katmanları
- cursor: 1000
- intro: 100
- tv-scene: 50
- main: 10 (overlay: 15)
- grid: 1
