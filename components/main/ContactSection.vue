<script setup lang="ts">
</script>

<template>
  <section class="contact-section">
    <div class="contact-box">
      <p class="contact-text">Right project, right conversation<span class="accent">.</span></p>
      <a href="mailto:cem@ct1.media" class="contact-email">cem@ct1.media</a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact-section {
  position: relative;
  z-index: $z-main + 1;
  display: flex;
  justify-content: center;
  padding: 80px 60px 120px;

  @media (max-width: $breakpoint-mobile) {
    padding: 60px 24px 80px;
  }
}

.contact-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 2px solid $accent;
  padding: 50px 80px;
  max-width: 500px;
  width: 100%;

  @media (max-width: $breakpoint-mobile) {
    padding: 36px 28px;
  }
}

.contact-text {
  font-family: $font-mono;
  font-size: 14px;
  line-height: 1.7;
  color: $text-gray;
  text-align: center;
}

.accent {
  color: $accent;
}

.contact-email {
  font-family: $font-mono;
  font-size: 15px;
  font-weight: 500;
  color: $text-white;
  text-decoration: none;
  letter-spacing: 0.03em;
  transition: color 0.3s;

  &:hover {
    color: $accent;
  }
}
</style>
