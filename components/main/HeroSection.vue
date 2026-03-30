<script setup lang="ts">
</script>

<template>
  <section class="hero-section">
    <div class="hero-content">
      <MainTypewriterText />
    </div>

    <!-- Kayan kelime listesi -->
    <div class="marquee-area">
      <MainProcessSteps />
    </div>

    <!-- Alt bar -->
    <div class="hero-bottom-bar">
      <span class="bar-left">Content &middot; Commercial &middot; Film &middot; Systems</span>
      <span class="bar-center">Production infrastructure, not just production</span>
      <span class="bar-right">&darr;</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 160px 60px 40px;
  z-index: $z-main;

  @media (max-width: $breakpoint-mobile) {
    padding: 100px 24px 24px;
  }
}

.hero-content {
  flex: 1;
  max-width: 65%;

  @media (max-width: $breakpoint-tablet) {
    max-width: 100%;
  }
}

.marquee-area {
  padding: 40px 0;

  @media (max-width: $breakpoint-mobile) {
    padding: 24px 0;
  }
}

.hero-bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-family: $font-heading;
  color: $text-gray;
  padding-top: 20px;
  border-top: 1px solid $grid-color;

  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}

.bar-center {
  color: $text-white;
  font-size: 12px;
  font-family: $font-heading;
}
</style>
