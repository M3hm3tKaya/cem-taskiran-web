<script setup lang="ts">
import { gsap } from 'gsap'

const sectionRef = ref<HTMLElement | null>(null)
const diskRotation = ref(0)

// Maks dönüş açısı — çok fazla tur atmasın
const maxRotation = 25 // derece

function updateRotation() {
  if (!sectionRef.value) return

  const rect = sectionRef.value.getBoundingClientRect()
  const sectionCenter = rect.top + rect.height / 2
  const viewportCenter = window.innerHeight / 2
  const offset = sectionCenter - viewportCenter

  // -1 ile 1 arası normalize
  const maxRange = window.innerHeight * 0.8
  const normalized = Math.max(-1, Math.min(1, offset / maxRange))

  // Hedef açı: ortadayken 0, yukarı/aşağı gittikçe ±maxRotation
  const targetRotation = normalized * maxRotation

  // Yumuşak lerp ile hedefe yaklaş
  diskRotation.value += (targetRotation - diskRotation.value) * 0.06
}

onMounted(() => {
  gsap.ticker.add(updateRotation)
})

onUnmounted(() => {
  gsap.ticker.remove(updateRotation)
})

const paragraphText = `A production studio that treats technology as method, not marketing.`
</script>

<template>
  <section ref="sectionRef" class="rotating-disk-section">
    <div class="disk-container">

      <!-- KATMAN 1: Statik metin — ortasında dairesel delik -->
      <div class="text-layer text-layer--static">
        <p class="disk-paragraph">{{ paragraphText }}</p>
      </div>

      <!-- KATMAN 2: Dönen disk — aynı metnin klonu, dairesel mask -->
      <div
        class="text-layer text-layer--disk"
        :style="{ transform: `rotate(${diskRotation}deg)` }"
      >
        <p class="disk-paragraph">{{ paragraphText }}</p>
      </div>

      <!-- KATMAN 3: Dekoratif kenarlık halkası -->
      <div class="disk-border-ring" />

    </div>
  </section>
</template>

<style scoped lang="scss">
$disk-diameter: 380px;
$disk-diameter-tablet: 280px;
$disk-diameter-mobile: 200px;

// Daire merkezi: dikeyde %55 (biraz aşağıda)
$disk-center-y: 55%;

.rotating-disk-section {
  position: relative;
  z-index: $z-main + 1;
  width: 100%;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 60px;
  overflow: hidden;

  @media (max-width: $breakpoint-mobile) {
    padding: 60px 24px;
  }
}

.disk-container {
  position: relative;
  width: 100%;
  max-width: 900px;
}

.disk-paragraph {
  font-family: $font-heading;
  font-weight: 500;
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 1.15;
  color: $text-white;
  text-align: center;
  margin: 0;
  padding: 0;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.text-layer {
  width: 100%;
}

// KATMAN 1: Statik — ortasında delik (biraz aşağıda)
.text-layer--static {
  position: relative;
  -webkit-mask-image: radial-gradient(
    circle calc(#{$disk-diameter} / 2) at 50% $disk-center-y,
    transparent 0%, transparent 99%, black 100%
  );
  mask-image: radial-gradient(
    circle calc(#{$disk-diameter} / 2) at 50% $disk-center-y,
    transparent 0%, transparent 99%, black 100%
  );

  @media (max-width: $breakpoint-tablet) {
    -webkit-mask-image: radial-gradient(
      circle calc(#{$disk-diameter-tablet} / 2) at 50% $disk-center-y,
      transparent 0%, transparent 99%, black 100%
    );
    mask-image: radial-gradient(
      circle calc(#{$disk-diameter-tablet} / 2) at 50% $disk-center-y,
      transparent 0%, transparent 99%, black 100%
    );
  }

  @media (max-width: $breakpoint-mobile) {
    -webkit-mask-image: radial-gradient(
      circle calc(#{$disk-diameter-mobile} / 2) at 50% $disk-center-y,
      transparent 0%, transparent 99%, black 100%
    );
    mask-image: radial-gradient(
      circle calc(#{$disk-diameter-mobile} / 2) at 50% $disk-center-y,
      transparent 0%, transparent 99%, black 100%
    );
  }
}

// KATMAN 2: Dönen disk (biraz aşağıda)
.text-layer--disk {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 50% $disk-center-y;
  will-change: transform;

  -webkit-mask-image: radial-gradient(
    circle calc(#{$disk-diameter} / 2) at 50% $disk-center-y,
    black 0%, black 99%, transparent 100%
  );
  mask-image: radial-gradient(
    circle calc(#{$disk-diameter} / 2) at 50% $disk-center-y,
    black 0%, black 99%, transparent 100%
  );

  @media (max-width: $breakpoint-tablet) {
    transform-origin: 50% $disk-center-y;
    -webkit-mask-image: radial-gradient(
      circle calc(#{$disk-diameter-tablet} / 2) at 50% $disk-center-y,
      black 0%, black 99%, transparent 100%
    );
    mask-image: radial-gradient(
      circle calc(#{$disk-diameter-tablet} / 2) at 50% $disk-center-y,
      black 0%, black 99%, transparent 100%
    );
  }

  @media (max-width: $breakpoint-mobile) {
    transform-origin: 50% $disk-center-y;
    -webkit-mask-image: radial-gradient(
      circle calc(#{$disk-diameter-mobile} / 2) at 50% $disk-center-y,
      black 0%, black 99%, transparent 100%
    );
    mask-image: radial-gradient(
      circle calc(#{$disk-diameter-mobile} / 2) at 50% $disk-center-y,
      black 0%, black 99%, transparent 100%
    );
  }
}

// KATMAN 3: Kenarlık halkası (biraz aşağıda)
.disk-border-ring {
  position: absolute;
  top: $disk-center-y;
  left: 50%;
  width: $disk-diameter;
  height: $disk-diameter;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  pointer-events: none;
  z-index: 5;

  @media (max-width: $breakpoint-tablet) {
    width: $disk-diameter-tablet;
    height: $disk-diameter-tablet;
  }

  @media (max-width: $breakpoint-mobile) {
    width: $disk-diameter-mobile;
    height: $disk-diameter-mobile;
  }
}
</style>
