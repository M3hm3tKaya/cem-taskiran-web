/**
 * Mouse X/Y pozisyonuna göre perspektif rotasyon hesaplama
 * Lerp ile yumuşak geçiş sağlar
 */
export function useMousePerspective(maxAngle = 15) {
  const rotationY = ref(0)
  const rotationX = ref(0)
  const normalizedX = ref(0)
  const normalizedY = ref(0)

  // Hedef değerler (lerp için)
  let targetRotY = 0
  let targetRotX = 0

  // Mouse pozisyonunu güncelle
  function onMouseMove(e: MouseEvent) {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window

    // -1 → 1 arası normalize
    normalizedX.value = (clientX / innerWidth) * 2 - 1
    normalizedY.value = (clientY / innerHeight) * 2 - 1

    // Mouse'un TERSİ yönüne rotasyon
    targetRotY = -normalizedX.value * maxAngle
    targetRotX = normalizedY.value * (maxAngle * 0.2) // Y ekseni daha az döner
  }

  let animationId: number | null = null

  // Her frame'de lerp ile yumuşak geçiş
  function animate() {
    const lerpFactor = 0.05
    rotationY.value += (targetRotY - rotationY.value) * lerpFactor
    rotationX.value += (targetRotX - rotationX.value) * lerpFactor
    animationId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    animate()
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }
  })

  return {
    rotationY,
    rotationX,
    normalizedX,
    normalizedY,
  }
}
