# Active Context — CT1 Media (eski: HLE.IO Clone)

## Mevcut Durum
- **Aktif Faz:** Full rebrand HLE → CT1 Media tamamlandı
- **Son yapılan:** Tüm component'ler CT1 markasına dönüştürüldü, yeni özellikler eklendi
- **Sıradaki:** Müşteri onayı, marka logoları (logo grid), deploy

## Session Notları (2026-03-30)
### Rebrand: HLE → CT1 Media
- Accent renk: #00D4FF (cyan) → #F04E23 (turuncu-kırmızı)
- Logo: "HL" text → CT logo görseli (shutter+T formu, .ai'dan PNG export)
- Nav: About us/Contacts/FAQ → Work/Studio/Contact, bullet rengi accent
- Tüm cümle sonlarında nokta accent renkte (marka imzası)

### Intro Ekranı
- Typewriter 4 satır statik: "We don't just / produce content. / We engineer / how it's made."
- Değişen kelime mekanizması kaldırıldı
- Scroll/touch ile typewriter hızlanıyor
- Wheel+touch event'ler capture ile yakalanıp TV sahnesine geçişi engelliyor

### Hero Bölümü
- Statik başlık (typewriter kaldırıldı): "We don't just produce content. We engineer how it's made."
- Açıklama: "Entertainment production backed by technical infrastructure."
- "Submit Your Pitch" CTA kaldırıldı

### Word Cloud (eski ProcessSteps)
- 19 kelime havuzu (Architect, Shoot, Produce, Deploy, vb.)
- 3×2 grid tabanlı yerleşim — kelimeler asla üst üste gelmez
- Fade out → pozisyon değiş → fade in döngüsü (4sn interval)
- Her cycle'da tekrarsız kelime seçimi

### Proje Bölümü → Logo Grid
- Kayan kart sistemi kaldırıldı → statik marka logo gridi
- Placeholder logolar — müşteri gerçek logoları gönderecek

### Diğer Bölümler
- Disk: "A production studio that treats technology as method, not marketing."
- Contact: "Right project, right conversation." + mailto:cem@ct1.media
- Contact box üst border accent renk
- Footer: CT1 (#F04E23) + © 2026 CT1 Media

### TV Sahnesi
- Logo: siyah versiyon, 67px
- Tagline, scroll down, saat → siyah renk
- CT_INTRO.mp4 entegre (intro bittikten sonra başlar, 0.3sn skip, 1.2x hız)
- Canvas çözünürlüğü 2x (840×960), anisotropy 16
- Video köşeleri yuvarlatılmış (roundRect clip)
- Day/Night: karanlık mod %30 daha açık, tüm 4 ışık kontrol ediliyor, geri dönüş orijinal ile birebir

### Grid/Snake Trail
- Renk #F04E23 (turuncu-kırmızı)

## Session Notları (2026-03-26)
- IntroScreen ve TypewriterText: satır kırılmaları sabitlendi
- ProcessSteps: vw birimleri ile viewport orantılı konumlandırma
- HeroSection: padding-top 160px
- Snake trail: Bresenham interpolation, pointermove

## Bilinen Sorunlar
- Build'de Three.js chunk'ı ~500KB (beklenen)
- Logo grid placeholder — müşteri gerçek marka logolarını gönderecek
- CT_LOGO.ai bitmap dönüşüm — ideal SVG export müşteriden bekleniyor
