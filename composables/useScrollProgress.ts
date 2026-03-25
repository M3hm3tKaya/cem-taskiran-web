/**
 * Scroll ilerleme hesaplama composable'ı
 * Container içinde scroll pozisyonunu 0-1 arası normalize eder
 */
export function useScrollProgress(containerRef: Ref<HTMLElement | null>) {
  const progress = ref(0)

  function onScroll() {
    const el = containerRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const scrollableHeight = el.scrollHeight - window.innerHeight

    if (scrollableHeight <= 0) {
      progress.value = 0
      return
    }

    // Container'ın üstü viewport'un üstünden ne kadar geçti
    const scrolled = -rect.top
    progress.value = Math.min(1, Math.max(0, scrolled / scrollableHeight))
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { progress }
}
