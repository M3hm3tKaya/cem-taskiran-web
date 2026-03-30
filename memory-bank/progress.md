# Progress — CT1 Media Web

## Genel İlerleme
- [x] Faz 1: Proje Altyapısı ve Konfigürasyon
- [x] Faz 2: Giriş Ekranı (Intro Screen)
- [x] Faz 3: 3D TV Sahnesi (Landing Page)
- [x] Faz 4: Ana Sayfa İçeriği — Grid, Typewriter, Yılan Efekti
- [x] Faz 5: Kayan Liste ve Proje Kartları
- [x] Faz 6: Dönen Disk (Rotating Disk)
- [x] Faz 7: Custom Cursor, Polish ve Responsive
- [x] Faz 8: Final — Test ve Build
- [x] Faz 9: Responsive düzeltmeler (satır kırılma, vw scaling)
- [x] Faz 10: HLE → CT1 Media full rebrand

## Faz 10: CT1 Media Rebrand (2026-03-30)

### Global
- $accent-cyan → $accent: #F04E23
- nuxt.config: title, description, theme-color
- Grid trail + snake trail renk #F04E23
- main.scss selection renk güncellendi

### Intro (IntroScreen.vue)
- 4 satır statik typewriter: "We don't just / produce content. / We engineer / how it's made."
- Değişen kelime mekanizması kaldırıldı
- Scroll (wheel) + touch ile typewriter hızlanıyor
- capture:true ile TV sahnesine geçiş engelleniyor (mobil dahil)
- Cursor rengi accent

### TV Sahnesi (TVScene.vue)
- Nav: Work/Studio/Contact, bullet #F04E23
- Logo: ct-logo-black.png (67px)
- Tagline, scroll down, saat → siyah renk
- CT_INTRO.mp4: intro sonrası başlar, 0.3sn skip, 1.2x hız
- Canvas 840×960 (2x), anisotropy 16
- Video roundRect clip
- Day/Night: 4 ışık kontrol, night %30 açık, day=init değerleri

### Ana Sayfa (MainContent.vue)
- Nav: Work/Studio/Contact, bullet accent
- Logo: ct-logo-orange.png (67px)

### Hero (TypewriterText.vue + HeroSection.vue)
- Statik başlık (typewriter kaldırıldı)
- Açıklama güncellendi
- "Submit Your Pitch" kaldırıldı
- Alt bar: "Content · Commercial · Film · Systems" / "Production infrastructure..." / "↓"

### Word Cloud (ProcessSteps.vue)
- 19 kelime havuzu, 3×2 grid yerleşim
- Fade out→reposition→fade in döngüsü (4sn)
- Tekrarsız kelime seçimi
- Minimum mesafe garantisi

### Logo Grid (ScrollingList.vue)
- Kayan kart sistemi → statik marka logo gridi
- Başlık: "Brands we've built for." (nokta accent)
- Placeholder logolar

### Diğer
- RotatingDisk: yeni manifesto metni
- ContactSection: "Right project, right conversation." + mailto:cem@ct1.media + üst border accent
- FooterSection: CT1 (#F04E23) + © 2026 CT1 Media

### Assetler
- public/ct-logo-white.png, ct-logo-orange.png, ct-logo-black.png
- public/videos/CT_INTRO.mp4
- musteri-revizyon-dosyalari/ (kaynak dosyalar)
- html-preview/ (müşteri metin onay HTML'leri)
