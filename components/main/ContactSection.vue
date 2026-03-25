<script setup lang="ts">
</script>

<template>
  <section class="contact-section">
    <div class="contact-box">
      <div class="arrow-down">&darr;</div>
      <p class="contact-text">
        Entertainment company helping people get their
        idea sold to networks and production companies
        through our contacts in NYC and LA
      </p>
      <a href="#" class="contact-btn">Get In Touch</a>
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
  gap: 28px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 50px 80px 50px;
  max-width: 700px;
  width: 100%;

  @media (max-width: $breakpoint-mobile) {
    padding: 36px 28px;
  }
}

.arrow-down {
  font-size: 20px;
  color: $text-gray;
}

.contact-text {
  font-family: $font-mono;
  font-size: 13px;
  line-height: 1.7;
  color: $text-gray;
  text-align: center;
  max-width: 480px;
}

.contact-btn {
  font-family: $font-mono;
  font-size: 14px;
  font-weight: 500;
  color: $text-white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 12px 36px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.5);
  }
}
</style>
