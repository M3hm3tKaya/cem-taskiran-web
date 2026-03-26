# System Patterns — HLE.IO Clone

## Mimari
- Nuxt.js 3 SPA modu (ssr: false)
- Component-based yapı — Nuxt auto-import
- Composables ile logic ayrımı

## Component İsimlendirme (Nuxt Auto-Import)
Nuxt dizin tabanlı auto-import kullanır:
- `components/intro/IntroScreen.vue` → `<IntroIntroScreen />`
- `components/landing/TVScene.vue` → `<LandingTVScene />`
- `components/main/MainContent.vue` → `<MainMainContent />`
- `components/shared/CustomCursor.vue` → `<SharedCustomCursor />`

## State Akışı
```
pages/index.vue:
  showIntro (true) → onIntroComplete() → showTVScene (true) → onTransitionToMain() → showMainContent (true)
```

## Animasyon Mimarisi
- **IntroScreen:** 3 satır ref (inline typewriter) → GSAP y:-100% perde kalkış → emit
- **TVScene:** useMousePerspective → Three.js rotation lerp + ScrollTrigger zoom → triggerTransition → emit
- **MainContent:** useSnakeTrail canvas + inline typewriter loop (3 satır) + ScrollingList velocity + RotatingDisk wheel

## Responsive Yaklaşım
- Typewriter metinleri sabit satır kırılmalarıyla 3 satıra bölünür (white-space: nowrap)
- Font boyutları vw tabanlı clamp() ile viewport orantılı
- ProcessSteps offsetleri vw birimleri ile ekrana göre ölçeklenir
- HeroSection padding-top: 160px — fixed nav ile içerik çakışmasını önler

## Scroll Yönetimi
- Lenis: Plugin'de başlatılır, intro sırasında `stop()`, TV/Main'de `start()`
- Lenis ↔ GSAP: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(lenis.raf)`
- ScrollingList: Wheel event → velocity artır → friction ile yavaşla
- RotatingDisk: Wheel event → diskRotation -= deltaY * factor

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
