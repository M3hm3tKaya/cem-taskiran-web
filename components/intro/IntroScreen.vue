<script setup lang="ts">
import { gsap } from 'gsap'

const emit = defineEmits<{
  'intro-complete': []
}>()

const introRef = ref<HTMLElement | null>(null)

// Typewriter state
const displayedBase = ref('')
const displayedWord = ref('')
const baseText = 'Positioned at the axis of talent and content across '
const changingWords = ['film', 'television', 'music']

let destroyed = false
let timeoutId: ReturnType<typeof setTimeout> | null = null

function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    timeoutId = setTimeout(resolve, ms)
  })
}

async function typeText(text: string, target: Ref<string>, speed: number) {
  for (let i = 0; i <= text.length; i++) {
    if (destroyed) return
    target.value = text.slice(0, i)
    await wait(speed)
  }
}

async function deleteText(target: Ref<string>, speed: number) {
  const text = target.value
  for (let i = text.length; i >= 0; i--) {
    if (destroyed) return
    target.value = text.slice(0, i)
    await wait(speed)
  }
}

async function startTypewriter() {
  // Temel metni yaz
  await typeText(baseText, displayedBase, 80)
  if (destroyed) return
  await wait(400)

  // Kelimeleri sırayla yaz/sil
  for (let i = 0; i < changingWords.length; i++) {
    if (destroyed) return
    await typeText(changingWords[i], displayedWord, 80)
    if (i < changingWords.length - 1) {
      await wait(1500)
      if (destroyed) return
      await deleteText(displayedWord, 50)
      await wait(300)
    }
  }

  // Tamamlandı — perde kaldır
  await wait(800)
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
  setTimeout(() => startTypewriter(), 500)
})

onUnmounted(() => {
  destroyed = true
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <div ref="introRef" class="intro-screen">
    <div class="intro-text">
      <span>{{ displayedBase }}</span>
      <span>{{ displayedWord }}</span>
      <span class="cursor">|</span>
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
  max-width: 75vw;
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 700;
  font-size: clamp(3rem, 8.4vw, 7.8rem);
  line-height: 1.08;
  color: #ffffff;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    padding: 40px 24px 0;
    max-width: 95vw;
  }
}

.cursor {
  display: inline-block;
  font-weight: 300;
  margin-left: 2px;
  animation: blink 530ms step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
