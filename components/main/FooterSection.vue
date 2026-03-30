<script setup lang="ts">
</script>

<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-left">
        <img src="/ct-logo-orange.png" alt="CT1 Media" class="footer-logo" />
      </div>
      <div class="footer-right">
        <span>All rights reserved</span>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  position: relative;
  z-index: $z-main + 1;
  padding: 40px 60px;
  border-top: 1px solid $grid-color;

  @media (max-width: $breakpoint-mobile) {
    padding: 30px 24px;
  }
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: $font-mono;
  font-size: 12px;
  color: $text-gray;

  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    gap: 12px;
  }
}

.footer-logo {
  height: 134px;
  width: auto;

  @media (max-width: $breakpoint-mobile) {
    height: 100px;
  }
}
</style>
