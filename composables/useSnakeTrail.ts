/**
 * Grid çizgileri + mouse'u takip eden yılan izi efekti
 * Her ikisi de aynı canvas üzerinde çizilir — mükemmel hizalama
 */

interface SnakeTrailOptions {
  cellSize?: number
  maxTrailLength?: number
  fadeSpeed?: number
  color?: string
  gridLineColor?: string
  gridLineOpacity?: number
}

interface TrailCell {
  x: number
  y: number
  age: number
}

export function useSnakeTrail(options: SnakeTrailOptions = {}) {
  const {
    cellSize = 50,
    maxTrailLength = 20,
    fadeSpeed = 0.02,
    color = '#00D4FF',
    gridLineColor = '#2A2A2D',
    gridLineOpacity = 0.6,
  } = options

  const canvasRef = ref<HTMLCanvasElement | null>(null)

  let ctx: CanvasRenderingContext2D | null = null
  let trail: TrailCell[] = []
  let lastGridX = -1
  let lastGridY = -1
  let animationId: number | null = null
  let isDestroyed = false

  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 212, b: 255 }
  }

  const rgb = hexToRgb(color)

  function onMouseMove(e: MouseEvent) {
    const gridX = Math.floor(e.clientX / cellSize)
    const gridY = Math.floor(e.clientY / cellSize)

    if (gridX !== lastGridX || gridY !== lastGridY) {
      lastGridX = gridX
      lastGridY = gridY
      trail.push({ x: gridX, y: gridY, age: 0 })

      if (trail.length > maxTrailLength) {
        trail.shift()
      }
    }
  }

  // Grid çizgilerini çiz
  function drawGrid() {
    if (!ctx || !canvasRef.value) return
    const { width, height } = canvasRef.value

    ctx.strokeStyle = gridLineColor
    ctx.globalAlpha = gridLineOpacity
    ctx.lineWidth = 1

    // Dikey çizgiler
    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath()
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, height)
      ctx.stroke()
    }

    // Yatay çizgiler
    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath()
      ctx.moveTo(0, y + 0.5)
      ctx.lineTo(width, y + 0.5)
      ctx.stroke()
    }

    ctx.globalAlpha = 1
  }

  function render() {
    if (isDestroyed || !ctx || !canvasRef.value) return

    const canvas = canvasRef.value
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Önce grid çizgilerini çiz
    drawGrid()

    // Sonra trail hücrelerini çiz (grid'in üstüne)
    const nextTrail: TrailCell[] = []

    for (const cell of trail) {
      cell.age += fadeSpeed

      if (cell.age < 1) {
        const opacity = Math.max(0, 1 - cell.age)

        // Hücre pozisyonu — grid çizgilerinin arasına tam oturur
        const px = cell.x * cellSize + 1
        const py = cell.y * cellSize + 1
        const size = cellSize - 1

        // Hücre doldurma
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.3})`
        ctx.fillRect(px, py, size, size)

        // Hücre kenarlıkları
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.6})`
        ctx.lineWidth = 1
        ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1)

        nextTrail.push(cell)
      }
    }

    trail = nextTrail
    animationId = requestAnimationFrame(render)
  }

  function resize() {
    if (!canvasRef.value) return
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
  }

  function init() {
    if (!canvasRef.value) return
    ctx = canvasRef.value.getContext('2d')
    resize()
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    render()
  }

  function destroy() {
    isDestroyed = true
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', resize)
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }
    trail = []
  }

  onMounted(() => {
    nextTick(() => init())
  })

  onUnmounted(() => {
    destroy()
  })

  return { canvasRef, init, destroy }
}
