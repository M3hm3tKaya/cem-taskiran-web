/**
 * Lenis smooth scroll composable'ı
 * Plugin'den Lenis instance'ına erişim sağlar
 */
export function useSmoothScroll() {
  const { $lenis } = useNuxtApp()
  const lenis = $lenis as any

  function start() {
    lenis?.start()
  }

  function stop() {
    lenis?.stop()
  }

  function scrollTo(target: string | number | HTMLElement, options?: any) {
    lenis?.scrollTo(target, options)
  }

  return {
    lenis,
    start,
    stop,
    scrollTo,
  }
}
