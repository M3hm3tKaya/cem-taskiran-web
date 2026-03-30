<script setup lang="ts">
// CT1 Media — kayan kelime listesi (JS ile piksel-hassas sonsuz döngü)
const words = [
  'Architect', 'Shoot', 'Produce', 'Deliver',
  'Optimize', 'Adapt', 'Calibrate',
  'Systematize', 'Render', 'Integrate',
  'Configure', 'Execute', 'Refine',
  'Construct', 'Deploy', 'Engineer',
  'Align', 'Scale', 'Structure',
]

const trackRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
let animId: number | null = null
let offset = 0
const speed = 0.5 // px per frame

function animate() {
  if (!trackRef.value || !contentRef.value) {
    animId = requestAnimationFrame(animate)
    return
  }

  const contentWidth = contentRef.value.offsetWidth
  offset -= speed

  // Bir kopya tamamen geçtiyse sıfırla — piksel hassas, atlama yok
  if (Math.abs(offset) >= contentWidth) {
    offset += contentWidth
  }

  trackRef.value.style.transform = `translateX(${offset}px)`
  animId = requestAnimationFrame(animate)
}

onMounted(() => {
  animId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<template>
  <div class="marquee-wrapper">
    <div ref="trackRef" class="marquee-track">
      <div ref="contentRef" class="marquee-content">
        <span v-for="(word, i) in words" :key="'a' + i" class="marquee-word">
          {{ word }}<span class="separator">&middot;</span>
        </span>
      </div>
      <div class="marquee-content">
        <span v-for="(word, i) in words" :key="'b' + i" class="marquee-word">
          {{ word }}<span class="separator">&middot;</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.marquee-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: $z-main + 1;
  mask-image: linear-gradient(90deg, transparent, black 5%, black 95%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, black 5%, black 95%, transparent);
}

.marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
}

.marquee-content {
  display: flex;
  flex-shrink: 0;
}

.marquee-word {
  font-family: $font-heading;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: $text-gray;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: default;
  transition: color 0.3s;

  &:hover {
    color: $accent;
  }
}

.separator {
  display: inline-block;
  margin: 0 20px;
  color: rgba(255, 255, 255, 0.15);
}
</style>
