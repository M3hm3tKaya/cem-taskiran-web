<script setup lang="ts">
// Ana sayfa typewriter — satır satır, kelime döngüsü ile
const displayedLine1 = ref('')
const displayedLine2 = ref('')
const displayedLine3 = ref('')
const displayedWord = ref('')
const activeLine = ref(0)

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
  await document.fonts.ready

  // Satırları sırayla yaz
  activeLine.value = 1
  await typeText(lines[0], displayedLine1, 80)
  if (destroyed) return
  await wait(200)

  activeLine.value = 2
  await typeText(lines[1], displayedLine2, 80)
  if (destroyed) return
  await wait(200)

  activeLine.value = 3
  await typeText(lines[2], displayedLine3, 80)
  if (destroyed) return
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

  @media (max-width: $breakpoint-mobile) {
    white-space: normal;
  }
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
