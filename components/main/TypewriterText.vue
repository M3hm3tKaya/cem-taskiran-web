<script setup lang="ts">
// CT1 Media — statik hero başlık (typewriter kaldırıldı)
</script>

<template>
  <div class="hero-heading-section">
    <h1 class="hero-heading">
      We don't just produce content<span class="accent">.</span><br>
      We engineer how it's made<span class="accent">.</span>
    </h1>

    <div class="hero-description">
      <p>
        Entertainment production backed by technical infrastructure.<br>
        Built for precision, speed, and platform intelligence.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero-heading-section {
  position: relative;
  z-index: $z-main + 1;
}

.hero-heading {
  font-family: $font-mono;
  font-weight: 700;
  font-size: clamp(1.8rem, 4.5vw, 3.5rem);
  line-height: 1.15;
  color: $text-white;
  letter-spacing: -0.02em;

  @media (max-width: $breakpoint-mobile) {
    font-size: 8vw;
  }
}

.accent {
  color: $accent;
}

.hero-description {
  margin-top: 80px;
  font-size: 13px;
  line-height: 1.7;
  color: #ccc;
  font-family: $font-mono;
  max-width: 560px;

  @media (max-width: $breakpoint-mobile) {
    margin-top: 40px;
    font-size: 12px;
  }
}
</style>
