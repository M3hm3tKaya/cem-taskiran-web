<script setup lang="ts">
import { gsap } from 'gsap'

const emit = defineEmits<{
  'intro-complete': []
}>()

const introRef = ref<HTMLElement | null>(null)

// Her satır ayrı ref — satır kırılmaları sabit
const displayedLine1 = ref('')
const displayedLine2 = ref('')
const displayedLine3 = ref('')
const displayedWord = ref('')
const activeLine = ref(1)

const lines = [
  'Positioned at the axis',
  'of talent and content',
  'across ',
]
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
  // Satır 1: "Positioned at the axis"
  activeLine.value = 1
  await typeText(lines[0], displayedLine1, 80)
  if (destroyed) return
  await wait(200)

  // Satır 2: "of talent and content"
  activeLine.value = 2
  await typeText(lines[1], displayedLine2, 80)
  if (destroyed) return
  await wait(200)

  // Satır 3: "across "
  activeLine.value = 3
  await typeText(lines[2], displayedLine3, 80)
  if (destroyed) return
  await wait(400)

  // Değişen kelimeler: film → television → music
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
      <div v-if="activeLine >= 1" class="line">
        <span>{{ displayedLine1 }}</span>
        <span v-if="activeLine === 1" class="cursor">|</span>
      </div>
      <div v-if="activeLine >= 2" class="line">
        <span>{{ displayedLine2 }}</span>
        <span v-if="activeLine === 2" class="cursor">|</span>
      </div>
      <div v-if="activeLine >= 3" class="line">
        <span>{{ displayedLine3 }}</span>
        <span class="changing-word">
          <span>{{ displayedWord }}</span>
          <span v-if="activeLine === 3" class="cursor">|</span>
        </span>
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

  @media (max-width: 768px) {
    white-space: normal;
  }
}

.changing-word {
  @media (max-width: 768px) {
    display: block;
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
