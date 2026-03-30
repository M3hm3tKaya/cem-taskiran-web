<script setup lang="ts">
// CT1 Media — kelime bulutu animasyonu (ProcessSteps yerine)
const words = [
  'Architect', 'Shoot', 'Produce', 'Deliver',
  'Optimize', 'Adapt', 'Calibrate',
  'Systematize', 'Render', 'Integrate',
  'Configure', 'Execute', 'Refine',
  'Construct', 'Deploy', 'Engineer',
  'Align', 'Scale', 'Structure',
]

const positions = [
  { top: '0%', left: '8%' },
  { top: '3%', left: '62%' },
  { top: '18%', left: '32%' },
  { top: '30%', left: '0%' },
  { top: '34%', left: '58%' },
  { top: '50%', left: '18%' },
  { top: '55%', left: '65%' },
  { top: '70%', left: '5%' },
  { top: '72%', left: '48%' },
  { top: '88%', left: '25%' },
  { top: '92%', left: '60%' },
]

interface Slot {
  word: string
  top: string
  left: string
  state: 'hidden' | 'active' | 'highlight'
}

const slots = ref<Slot[]>(
  positions.map((pos, i) => ({
    word: words[i % words.length],
    top: pos.top,
    left: pos.left,
    state: 'hidden' as const,
  }))
)

const visibleCount = 5
let intervalId: ReturnType<typeof setInterval> | null = null

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Grid tabanlı yerleşim — her kelime ayrı hücrede, asla üst üste gelmez
// En uzun kelime "Systematize" (~100px) + buffer için geniş hücreler
function generateSpacedPositions(count: number): { top: number; left: number }[] {
  const rows = 3
  const cols = 2
  const cellH = 100 / rows // ~%33 yükseklik
  const cellW = 100 / cols // %50 genişlik

  const allCells: { row: number; col: number }[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      allCells.push({ row: r, col: c })
    }
  }

  // Rastgele hücreler seç
  const shuffled = shuffle(allCells).slice(0, count)

  // Her hücre içinde küçük rastgele offset (doğal dağınıklık, taşma yok)
  return shuffled.map(cell => ({
    top: Math.floor(cell.row * cellH + Math.random() * (cellH * 0.4)),
    left: Math.floor(cell.col * cellW + Math.random() * (cellW * 0.3)),
  }))
}

function cycle() {
  // Önce hepsini fade out
  slots.value.forEach(s => (s.state = 'hidden'))

  // Fade out süresi kadar bekle, sonra yeni kelimeleri fade in
  setTimeout(() => {
    const indices = shuffle(Array.from({ length: positions.length }, (_, i) => i))
      .slice(0, visibleCount)

    const newPositions = generateSpacedPositions(visibleCount)
    const highlightIdx = indices[Math.floor(Math.random() * indices.length)]

    // Tekrarsız kelime seç
    const shuffledWords = shuffle([...words]).slice(0, visibleCount)

    indices.forEach((idx, j) => {
      const pos = newPositions[j] || { top: 0, left: 0 }
      slots.value[idx].word = shuffledWords[j]
      slots.value[idx].top = pos.top + '%'
      slots.value[idx].left = pos.left + '%'
      slots.value[idx].state = idx === highlightIdx ? 'highlight' : 'active'
    })
  }, 800) // fade out transition süresi kadar bekle
}

onMounted(() => {
  cycle()
  intervalId = setInterval(cycle, 4000) // 800ms fade out + 3s görünür
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="word-cloud">
    <span
      v-for="(slot, i) in slots"
      :key="i"
      class="wc-word"
      :class="slot.state"
      :style="{ top: slot.top, left: slot.left }"
    >
      {{ slot.word }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.word-cloud {
  position: relative;
  width: 280px;
  height: 320px;
  z-index: $z-main + 1;

  @media (max-width: $breakpoint-tablet) {
    width: 240px;
    height: 240px;
  }

  @media (max-width: $breakpoint-mobile) {
    width: 200px;
    height: 200px;
  }
}

.wc-word {
  position: absolute;
  font-family: $font-mono;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #555;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 1.2s ease, color 1.2s ease;

  &.active {
    opacity: 1;
    color: #888;
  }

  &.highlight {
    opacity: 1;
    color: $accent;
  }

  @media (max-width: $breakpoint-mobile) {
    font-size: 11px;
  }
}
</style>
