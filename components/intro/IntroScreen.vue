<script setup lang="ts">
import { gsap } from 'gsap'
import { useMediaQuery } from '@vueuse/core'

const emit = defineEmits<{
  'intro-complete': []
}>()

const introRef = ref<HTMLElement | null>(null)
const isMobile = useMediaQuery('(max-width: 768px)')

const typedLines = reactive<string[]>([])
const activeLine = ref(0)
const lineCount = ref(0)

let destroyed = false
let timeoutId: ReturnType<typeof setTimeout> | null = null
let currentSpeed = 80 // scroll ile azalır

function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    timeoutId = setTimeout(resolve, ms)
  })
}

async function typeLine(index: number, text: string) {
  for (let i = 0; i <= text.length; i++) {
    if (destroyed) return
    typedLines[index] = text.slice(0, i)
    await wait(currentSpeed)
  }
}

// Scroll ile hızlandır + TV sahnesine geçişi engelle
function onWheel(e: WheelEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (e.deltaY > 0) {
    currentSpeed = Math.max(8, currentSpeed - 12)
  }
}

// Mobil: touch ile hızlandır + TV sahnesine geçişi engelle
let touchStartY = 0

function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  e.stopPropagation()
  const deltaY = touchStartY - e.touches[0].clientY
  touchStartY = e.touches[0].clientY
  if (deltaY > 0) {
    currentSpeed = Math.max(8, currentSpeed - 8)
  }
}

async function startTypewriter() {
  const lines = isMobile.value ? [
    "We don't just",
    'produce',
    'content.',
    'We engineer',
    "how it's",
    'made.',
  ] : [
    "We don't just",
    'produce content.',
    'We engineer',
    "how it's made.",
  ]

  lineCount.value = lines.length
  typedLines.splice(0)
  for (const _ of lines) typedLines.push('')

  for (let i = 0; i < lines.length; i++) {
    if (destroyed) return
    activeLine.value = i + 1
    await typeLine(i, lines[i])
    if (destroyed) return
    await wait(Math.min(currentSpeed * 2, 200))
  }

  await wait(Math.min(currentSpeed * 10, 1200))
  curtainUp()
}

function curtainUp() {
  if (!introRef.value) return
  gsap.to(introRef.value, {
    y: '-100%',
    duration: 1.2,
    ease: 'power3.inOut',
    onComplete: () => {
      emit('intro-complete')
    },
  })
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('wheel', onWheel, { passive: false, capture: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
  window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })
  setTimeout(() => startTypewriter(), 500)
})

onUnmounted(() => {
  destroyed = true
  if (timeoutId) clearTimeout(timeoutId)
  window.removeEventListener('wheel', onWheel, { capture: true })
  window.removeEventListener('touchstart', onTouchStart, { capture: true })
  window.removeEventListener('touchmove', onTouchMove, { capture: true })
})
</script>

<template>
  <div ref="introRef" class="intro-screen">
    <div class="intro-text">
      <div
        v-for="(text, i) in typedLines"
        :key="i"
        v-show="activeLine >= i + 1"
        class="line"
      >
        <span>{{ text }}</span>
        <span v-if="activeLine === i + 1" class="cursor">|</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.intro-screen {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: #101011;
  display: flex;
  align-items: flex-start;
  will-change: transform;
}

.intro-text {
  padding: 60px;
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 700;
  font-size: clamp(1.4rem, 5.8vw, 7.5rem);
  line-height: 1.15;
  color: #ffffff;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    padding: 40px 24px 0;
    font-size: 12vw;
  }
}

.line {
  white-space: nowrap;
}

.cursor {
  display: inline-block;
  font-weight: 300;
  margin-left: 2px;
  color: $accent;
  animation: blink 530ms step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
