# Active Context — HLE.IO Clone

## Mevcut Durum
- **Aktif Faz:** Faz 8 tamamlandı + Responsive düzeltmeler yapıldı
- **Son yapılan:** Typewriter satır kırılmaları, ProcessSteps vw scaling, nav overlap fix
- **Sıradaki:** Deploy (opsiyonel) / ek iyileştirmeler

## Session Notları (2026-03-26)
- IntroScreen ve TypewriterText: satır kırılmaları sabitlendi (3 satır: axis / content / across+kelime)
- ProcessSteps: sabit px offset → vw birimleri ile viewport orantılı konumlandırma
- HeroSection: padding-top 100px → 160px (Submit Your Pitch / FAQ çakışması çözüldü)
- Font boyutları vw tabanlı clamp ile her ekranda orantılı hale getirildi
- white-space: nowrap ile satır içi taşma önlendi

## Session Notları (2026-03-25)
- Faz 1-8 arası tüm fazlar tek session'da tamamlandı
- Proje hatasız derleniyor ve build alınabiliyor
- Three.js ve GSAP ayrı chunk'lara bölündü (manualChunks)
- Tüm componentler Nuxt auto-import ile çalışıyor

## Tamamlanan Componentler
- IntroScreen (typewriter + perde kalkış + sabit 3 satır kırılma)
- TVScene (Three.js 3D TV + mouse perspektif + scroll zoom + CRT + Day/Night)
- GridBackground + useSnakeTrail (canvas 2D yılan izi)
- TypewriterText (loop modu + sabit 3 satır kırılma, composable kullanmıyor)
- ProcessSteps (vw tabanlı offset, viewport orantılı), HeroSection
- ScrollingList (infinite marquee + scroll velocity)
- RotatingDisk (scroll ile dönen disk)
- CustomCursor (+ şekli, hover büyüme, touch cihazda devre dışı)

## Bilinen Sorunlar
- Build'de Three.js chunk'ı ~500KB (beklenen, three.js doğası gereği)
- DEP0155 deprecation warning (Node.js, @vue/shared package.json — fonksiyonel sorun yok)
