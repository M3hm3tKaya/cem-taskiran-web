<script setup lang="ts">
// Scroll serbest bırak
onMounted(() => {
  document.body.style.overflow = 'auto'

  const { $lenis } = useNuxtApp()
  if ($lenis) {
    ;($lenis as any).start()
  }
})
</script>

<template>
  <div class="main-content">
    <!-- Grid arka plan + yılan efekti -->
    <MainGridBackground />

    <!-- Logo (fixed) -->
    <div class="main-logo overlay-fixed">
      <img src="/ct-logo-orange.png" alt="CT1 Media" />
    </div>

    <!-- Sections -->
    <MainHeroSection />

    <!-- Faz 5: Kayan liste -->
    <MainScrollingList />

    <!-- Faz 6: Dönen disk -->
    <MainRotatingDisk />

    <!-- Contact kutusu -->
    <MainContactSection />

    <!-- Footer -->
    <MainFooterSection />
  </div>
</template>

<style scoped lang="scss">
.main-content {
  position: relative;
  background-color: $bg-dark;
  min-height: 100vh;
}

.overlay-fixed {
  position: fixed;
  z-index: $z-main + 5;
  font-family: $font-mono;
  font-size: 12px;
  color: $text-white;
  letter-spacing: 0.05em;
}

.main-nav {
  top: 40px;
  left: 40px;

  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    cursor: pointer;
    transition: opacity 0.3s;

    &:hover { opacity: 0.6; }
  }

  .bullet {
    margin-right: 6px;
    color: $accent;
  }

  @media (max-width: $breakpoint-mobile) {
    top: 20px;
    left: 20px;
  }
}

.main-logo {
  top: 40px;
  left: 50%;
  transform: translateX(-50%);

  img {
    height: 67px;
    width: auto;
  }

  @media (max-width: $breakpoint-mobile) {
    top: 20px;

    img { height: 53px; }
  }
}
</style>
