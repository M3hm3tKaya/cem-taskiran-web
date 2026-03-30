<script setup lang="ts">
</script>

<template>
  <section class="hero-section">
    <div class="hero-layout">
      <!-- Sol taraf: Başlık + açıklama -->
      <div class="hero-left">
        <MainTypewriterText />
      </div>

      <!-- Sağ taraf: Kelime bulutu -->
      <div class="hero-right">
        <MainProcessSteps />
      </div>
    </div>

    <!-- Alt bar -->
    <div class="hero-bottom-bar">
      <span class="bar-left">Film &middot; Advertising &middot; Digital</span>
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

.hero-layout {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  flex: 1;

  @media (max-width: $breakpoint-tablet) {
    flex-direction: column;
  }
}

.hero-left {
  flex: 1;
  max-width: 65%;

  @media (max-width: $breakpoint-tablet) {
    max-width: 100%;
  }
}

.hero-right {
  flex-shrink: 0;
  padding-top: 40px;
  padding-right: 40px;
  display: flex;
  align-items: center;
  min-height: 320px;

  @media (max-width: $breakpoint-tablet) {
    align-self: flex-end;
    min-height: 240px;
  }

  @media (max-width: $breakpoint-mobile) {
    padding-right: 0;
    min-height: 200px;
  }
}

.hero-bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-family: $font-mono;
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
}
</style>
