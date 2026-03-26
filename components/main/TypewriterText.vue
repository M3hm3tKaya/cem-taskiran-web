<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

// Ana sayfa typewriter — satır satır, kelime döngüsü ile
const isMobile = useMediaQuery('(max-width: 768px)')

const typedLines = reactive<string[]>([])
const displayedWord = ref('')
const activeLine = ref(0)
const lineCount = ref(0)

const changingWords = ['film', 'television', 'music']

let destroyed = false
let timeoutId: ReturnType<typeof setTimeout> | null = null

function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    timeoutId = setTimeout(resolve, ms)
  })
}

async function typeLine(index: number, text: string, speed: number) {
  for (let i = 0; i <= text.length; i++) {
    if (destroyed) return
    typedLines[index] = text.slice(0, i)
    await wait(speed)
  }
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
  await document.fonts.ready

  const lines = isMobile.value ? [
    'Positioned',
    'at the axis',
    'of talent',
    'and content',
    'across',
  ] : [
    'Positioned at the axis',
    'of talent and content',
    'across ',
  ]

  lineCount.value = lines.length
  typedLines.splice(0)
  for (const _ of lines) typedLines.push('')

  // Satırları sırayla yaz
  for (let i = 0; i < lines.length; i++) {
    if (destroyed) return
    activeLine.value = i + 1
    await typeLine(i, lines[i], 80)
    if (destroyed) return
    await wait(200)
  }

  await wait(400)

  // Kelimeleri sonsuz döngüde yaz/sil
  while (!destroyed) {
    for (let i = 0; i < changingWords.length; i++) {
      if (destroyed) return
      await typeText(changingWords[i], displayedWord, 80)
      await wait(1500)
      if (destroyed) return
      await deleteText(displayedWord, 50)
      await wait(300)
    }
  }
}

onMounted(() => {
  startTypewriter()
})

onUnmounted(() => {
  destroyed = true
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <div class="typewriter-section">
    <div class="submit-link">&bull; Submit Your Pitch</div>
    <h1 class="typewriter-heading">
      <template v-for="(text, i) in typedLines" :key="i">
        <div v-if="activeLine >= i + 1 && i < lineCount - 1" class="line">
          <span>{{ text }}</span>
          <span v-if="activeLine === i + 1" class="cursor">|</span>
        </div>
      </template>
      <div v-if="activeLine >= lineCount" class="line">
        <span>{{ typedLines[lineCount - 1] }}</span>
        <span class="changing-word">
          <span>{{ displayedWord }}</span>
          <span class="cursor">|</span>
        </span>
      </div>
    </h1>
  </div>
</template>

<style scoped lang="scss">
.typewriter-section {
  position: relative;
  z-index: $z-main + 1;
}

.submit-link {
  font-size: 12px;
  color: $text-gray;
  margin-bottom: 16px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: $text-white;
  }
}

.typewriter-heading {
  font-family: $font-mono;
  font-weight: 700;
  font-size: clamp(1.8rem, 4.5vw, 3.5rem);
  line-height: 1.15;
  color: $text-white;
  letter-spacing: -0.02em;

  @media (max-width: $breakpoint-mobile) {
    font-size: 12vw;
  }
}

.line {
  white-space: nowrap;
}

.changing-word {
  @media (max-width: $breakpoint-mobile) {
    display: block;
  }
}

.cursor {
  display: inline-block;
  font-weight: 300;
  margin-left: 2px;
  animation: blink 530ms step-end infinite;
}
</style>
