<script setup lang="ts">
</script>

<template>
  <section class="hero-section">
    <div class="hero-layout">
      <!-- Sol taraf: Typewriter + açıklama -->
      <div class="hero-left">
        <MainTypewriterText />

        <div class="hero-description">
          <p>
            HLE creates opportunities for the storytellers, trendsetters,
            <br />&nbsp;&nbsp;&nbsp;&nbsp;and creatives of all types who are looking to get their message amplified.
          </p>
          <p>
            By helping shape original media that appeals to the industry's
            <br />&nbsp;&nbsp;mandates and long-term visions, HLE is able to align creator with buyer.
          </p>
        </div>
      </div>

      <!-- Sağ taraf: Süreç adımları -->
      <div class="hero-right">
        <MainProcessSteps />
      </div>
    </div>

    <!-- Alt bar -->
    <div class="hero-bottom-bar">
      <span class="bar-left">a place</span>
      <span class="bar-center">to pitch your ideas to creatives and producers</span>
      <span class="bar-right">Scroll Down</span>
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
    padding: 80px 24px 24px;
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

  @media (max-width: $breakpoint-tablet) {
    align-self: flex-end;
  }
}

.hero-description {
  margin-top: 140px;
  font-size: 13px;
  line-height: 1.7;
  color: $text-white;
  font-family: $font-mono;

  p {
    margin-bottom: 16px;
  }

  @media (max-width: $breakpoint-mobile) {
    margin-top: 40px;
    font-size: 12px;
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
