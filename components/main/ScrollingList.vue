<script setup lang="ts">
// CT1 Media — Marka logo gridi
// Yükseklikler: her logonun metin kısmı Aselsan'ın "n" yüksekliğine hizalı
const brands = [
  { name: 'Aselsan', src: '/brands/aselsan.png', h: '42px', offset: '0px', debug: false },
  { name: 'ASUS', src: '/brands/asus.png', h: '29px', offset: '0px', debug: false },
  { name: 'Puma', src: '/brands/puma.png', h: '63px', offset: '0px', debug: false },
  { name: 'TBB', src: '/brands/tbb.png', h: '46px', offset: '-8px', debug: false },
]
</script>

<template>
  <section class="brands-section">
    <div class="section-header">
      <h2 class="section-title">Brands we've built for<span class="accent">.</span></h2>
    </div>

    <div class="logo-grid">
      <div v-for="(brand, i) in brands" :key="i" class="logo-item" :class="{ 'debug-guides': brand.debug }">
        <img :src="brand.src" :alt="brand.name" class="brand-logo" :style="{ height: brand.h, marginBottom: brand.offset }" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.brands-section {
  position: relative;
  z-index: $z-main;
  padding: 120px 0 80px;

  @media (max-width: $breakpoint-mobile) {
    padding: 60px 0 40px;
  }
}

.section-header {
  padding: 0 60px;
  margin-bottom: 60px;

  @media (max-width: $breakpoint-mobile) {
    padding: 0 24px;
    margin-bottom: 40px;
  }
}

.section-title {
  font-family: $font-heading;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 500;
  line-height: 1.05;
  color: $text-gray;
  letter-spacing: 0.02em;
}

.accent {
  color: $accent;
}

.logo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 40px 60px;
  padding: 0 60px;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    gap: 30px;
    padding: 0 24px;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
}

.logo-item {
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: $breakpoint-mobile) {
    width: 100%;
  }
}

.brand-logo {
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);

}

.logo-grid {
  align-items: flex-end;
}
</style>
