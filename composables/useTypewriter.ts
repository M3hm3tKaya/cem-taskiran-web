/**
 * Typewriter animasyon composable'ı
 * Temel metni karakter karakter yazar, ardından değişen kelimeleri sırayla yazar/siler
 */

interface TypewriterOptions {
  baseText: string
  changingWords: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseBetween?: number
  loop?: boolean
}

export function useTypewriter(options: TypewriterOptions) {
  const {
    baseText,
    changingWords,
    typingSpeed = 80,
    deletingSpeed = 50,
    pauseBetween = 1500,
    loop = false,
  } = options

  // Görüntülenen metin parçaları
  const displayedBase = ref('')
  const displayedWord = ref('')
  const isComplete = ref(false)
  const isTyping = ref(false)

  // Birleşik görüntü metni
  const displayText = computed(() => displayedBase.value + displayedWord.value)

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let isDestroyed = false

  // Belirli süre bekle
  function wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      timeoutId = setTimeout(resolve, ms)
    })
  }

  // Metni karakter karakter yaz
  async function typeText(text: string, target: Ref<string>, speed: number) {
    for (let i = 0; i <= text.length; i++) {
      if (isDestroyed) return
      target.value = text.slice(0, i)
      await wait(speed)
    }
  }

  // Metni karakter karakter sil
  async function deleteText(target: Ref<string>, speed: number) {
    const text = target.value
    for (let i = text.length; i >= 0; i--) {
      if (isDestroyed) return
      target.value = text.slice(0, i)
      await wait(speed)
    }
  }

  // Kelime döngüsü
  async function cycleWords() {
    const lastIndex = changingWords.length - 1

    for (let i = 0; i < changingWords.length; i++) {
      if (isDestroyed) return

      // Kelimeyi yaz
      await typeText(changingWords[i], displayedWord, typingSpeed)

      // Son kelime ve loop kapalıysa dur
      if (i === lastIndex && !loop) {
        isComplete.value = true
        isTyping.value = false
        return
      }

      // Bekle
      await wait(pauseBetween)
      if (isDestroyed) return

      // Kelimeyi sil
      await deleteText(displayedWord, deletingSpeed)
      await wait(300) // Silme sonrası kısa bekleme
    }

    // Loop modunda başa dön
    if (loop && !isDestroyed) {
      cycleWords()
    }
  }

  // Animasyonu başlat
  async function start() {
    isTyping.value = true
    isComplete.value = false
    displayedBase.value = ''
    displayedWord.value = ''

    // Önce temel metni yaz
    await typeText(baseText, displayedBase, typingSpeed)
    if (isDestroyed) return

    // Kısa bekleme
    await wait(400)

    // Kelime döngüsünü başlat
    await cycleWords()
  }

  // Temizlik
  function destroy() {
    isDestroyed = true
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  // Component unmount'ta temizle
  onUnmounted(() => {
    destroy()
  })

  return {
    displayText,
    displayedBase,
    displayedWord,
    isComplete,
    isTyping,
    start,
    destroy,
  }
}
