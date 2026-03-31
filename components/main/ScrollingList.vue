<script setup lang="ts">
// CT1 Media — Marka logo gridi
const brands = [
  { name: 'Aselsan', src: '/brands/aselsan.png', invert: false, h: '40px' },
  { name: 'ASUS', src: '/brands/asus.png', invert: false, h: '40px' },
  { name: 'Puma', src: '/brands/puma.png', invert: true, h: '50px' },
  { name: 'TBB', src: '/brands/tbb.png', invert: false, h: '50px' },
]
</script>

<template>
  <section class="brands-section">
    <div class="section-header">
      <h2 class="section-title">Brands we've built for<span class="accent">.</span></h2>
    </div>

    <div class="logo-grid">
      <div v-for="(brand, i) in brands" :key="i" class="logo-item">
        <img
          :src="brand.src"
          :alt="brand.name"
          class="brand-logo"
          :class="{ 'invert': brand.invert }"
          :style="{ height: brand.h }"
/>
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
  align-items: center;
  justify-content: center;

  @media (max-width: $breakpoint-mobile) {
    gap: 20px 30px;
    padding: 0 24px;
  }
}

.logo-item {
  padding: 20px 32px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  transition: background 0.3s, border-color 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }
}

.brand-logo {
  width: auto;
  object-fit: contain;

  &.invert {
    filter: invert(1);
  }
}
</style>
