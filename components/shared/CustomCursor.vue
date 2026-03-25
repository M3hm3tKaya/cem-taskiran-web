<script setup lang="ts">
const cursorRef = ref<HTMLElement | null>(null)

let mouseX = 0
let mouseY = 0
let currentX = 0
let currentY = 0
let animationId: number | null = null
const isHovering = ref(false)
const isVisible = ref(false)

// Touch cihaz kontrolü
const isTouchDevice = ref(false)

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
  if (!isVisible.value) isVisible.value = true
}

function onMouseEnterInteractive() {
  isHovering.value = true
}

function onMouseLeaveInteractive() {
  isHovering.value = false
}

function animate() {
  currentX = mouseX
  currentY = mouseY

  if (cursorRef.value) {
    cursorRef.value.style.transform = `translate(${currentX}px, ${currentY}px)`
  }

  animationId = requestAnimationFrame(animate)
}

function setupHoverListeners() {
  const interactives = document.querySelectorAll('a, button, [role="button"], .project-card, .day-night-toggle, li')
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', onMouseEnterInteractive)
    el.addEventListener('mouseleave', onMouseLeaveInteractive)
  })
}

onMounted(() => {
  // Touch cihaz kontrolü
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  if (!isTouchDevice.value) {
    document.body.style.cursor = 'none'
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    animate()

    // DOM güncellemelerinden sonra hover listener'ları kur
    setTimeout(setupHoverListeners, 1000)

    // MutationObserver ile yeni eklenen elementleri de yakala
    const observer = new MutationObserver(() => {
      setupHoverListeners()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    onUnmounted(() => {
      observer.disconnect()
    })
  }
})

onUnmounted(() => {
  document.body.style.cursor = ''
  window.removeEventListener('mousemove', onMouseMove)
  if (animationId !== null) cancelAnimationFrame(animationId)
})
</script>

<template>
  <div
    v-if="!isTouchDevice"
    ref="cursorRef"
    class="custom-cursor"
    :class="{ visible: isVisible, hovering: isHovering }"
  >
    <div class="cursor-line horizontal" />
    <div class="cursor-line vertical" />
  </div>
</template>

<style scoped lang="scss">
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: $z-cursor;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
  will-change: transform;

  &.visible {
    opacity: 1;
  }

  &.hovering {
    .cursor-line {
      &.horizontal {
        width: 32px;
      }
      &.vertical {
        height: 32px;
      }
    }
  }
}

.cursor-line {
  position: absolute;
  background-color: $text-white;
  transition: width 0.2s, height 0.2s;

  &.horizontal {
    width: 20px;
    height: 1.5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &.vertical {
    width: 1.5px;
    height: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
