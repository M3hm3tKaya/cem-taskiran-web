<script setup lang="ts">
// CT1 Media — Marka logo gridi (ScrollingList yerine)
// Placeholder logolar — müşteri gerçek logoları gönderince değiştirilecek
const brands = [
  'Brand Logo', 'Brand Logo', 'Brand Logo', 'Brand Logo',
  'Brand Logo', 'Brand Logo', 'Brand Logo', 'Brand Logo',
]
</script>

<template>
  <section class="brands-section">
    <div class="section-header">
      <h2 class="section-title">Brands we've built for<span class="accent">.</span></h2>
    </div>

    <div class="logo-grid">
      <div v-for="(brand, i) in brands" :key="i" class="logo-item">
        {{ brand }}
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

  @media (max-width: $breakpoint-mobile) {
    gap: 20px 30px;
    padding: 0 24px;
  }
}

.logo-item {
  font-family: $font-mono;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 16px 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  transition: border-color 0.3s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
  }
}
</style>
