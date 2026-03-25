<script setup lang="ts">
import { gsap } from 'gsap'
import { useMediaQuery } from '@vueuse/core'

// Proje kartları verisi
const projects = [
  { id: 1, title: 'ACROSS THE BRIDGE', subtitle: 'Series Format', color: '#4A1525' },
  { id: 2, title: 'HLE', subtitle: 'Proprietary Notice', color: '#152545' },
  { id: 3, title: '$VILLE', subtitle: 'Writers Guild', color: '#1A3525' },
  { id: 4, title: 'DREAM SCREEN', subtitle: 'Written By', color: '#2A1545' },
]

const displayProjects = computed(() => [...projects, ...projects, ...projects])

const trackRef = ref<HTMLElement | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
let velocity = 0
let currentX = 0
let animationId: number | null = null

// ── Marquee ayarları ──
const baseSpeed = 0.5
const maxVelocity = 6
const lerpUp = 0.03
const lerpDown = 0.015
let targetVelocity = baseSpeed

function onWheel(e: WheelEvent) {
  targetVelocity = Math.min(maxVelocity, targetVelocity + Math.abs(e.deltaY) * 0.04)
}

// Touch swipe desteği
let touchLastX = 0
function onTouchStart(e: TouchEvent) {
  touchLastX = e.touches[0].clientX
}
function onTouchMoveList(e: TouchEvent) {
  const deltaX = touchLastX - e.touches[0].clientX
  targetVelocity = Math.min(maxVelocity, targetVelocity + Math.abs(deltaX) * 0.08)
  touchLastX = e.touches[0].clientX
}

// ── 3D Perspektif v2 — vanishing point sağda ──
const perspectiveStyle = ref<Record<string, string>>({})
const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(max-width: 1024px)')

const maxRotateY = computed(() => isMobile.value ? 10 : isTablet.value ? 20 : 30)
const maxRotateX = computed(() => isMobile.value ? 3 : isTablet.value ? 5 : 8)

function updatePerspective() {
  if (!sectionRef.value) return

  const rect = sectionRef.value.getBoundingClientRect()
  const sectionCenter = rect.top + rect.height / 2
  const viewportCenter = window.innerHeight / 2
  const offset = sectionCenter - viewportCenter

  // -1 ile 1 arası normalize
  // offset > 0 → section aşağıda (üstündeyiz) → sol-aşağı eğilim
  // offset < 0 → section yukarıda (altındayız) → sol-yukarı eğilim
  const maxRange = window.innerHeight * 0.7
  const normalizedOffset = Math.max(-1, Math.min(1, offset / maxRange))

  // rotateY: perspektif yoğunluğu — mutlak değere bağlı (her zaman pozitif)
  const absOffset = Math.abs(normalizedOffset)
  const rotY = absOffset * maxRotateY.value

  // rotateX: eğilim yönü — offset işaretine bağlı
  const rotX = normalizedOffset * maxRotateX.value

  perspectiveStyle.value = {
    transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
    transformOrigin: 'right center',
  }
}

// ── Marquee animasyonu ──
function animate() {
  if (!trackRef.value) {
    animationId = requestAnimationFrame(animate)
    return
  }

  targetVelocity = Math.max(baseSpeed, targetVelocity * 0.97)
  const lerp = velocity < targetVelocity ? lerpUp : lerpDown
  velocity += (targetVelocity - velocity) * lerp
  currentX -= velocity

  const trackWidth = trackRef.value.scrollWidth / 3
  if (Math.abs(currentX) >= trackWidth) {
    currentX += trackWidth
  }

  trackRef.value.style.transform = `translateX(${currentX}px)`
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMoveList, { passive: true })
  animate()
  gsap.ticker.add(updatePerspective)
})

onUnmounted(() => {
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMoveList)
  gsap.ticker.remove(updatePerspective)
  if (animationId !== null) cancelAnimationFrame(animationId)
})
</script>

<template>
  <section ref="sectionRef" class="scrolling-section">
    <!-- Section başlığı -->
    <div class="section-header">
      <h2 class="section-title">
        <span class="outline">Our</span> projects
      </h2>
      <p class="section-desc">
        HLE creates opportunities for the storytellers, trendsetters, and creatives
        of all types who are looking to get their message amplified. By helping shape
        original media that appeals to the industry's mandates and long-term visions.
      </p>
    </div>

    <!-- Perspektif parent — perspective CSS burada -->
    <div class="cards-perspective-container">
      <!-- Dönen wrapper — rotateY/rotateX burada -->
      <div class="cards-perspective-wrapper" :style="perspectiveStyle">
        <div ref="trackRef" class="scrolling-track">
          <div
            v-for="(project, index) in displayProjects"
            :key="`${project.id}-${index}`"
            class="project-card"
            :style="{ backgroundColor: project.color }"
          >
            <div class="card-content">
              <span class="card-subtitle">{{ project.subtitle }}</span>
              <h3 class="card-title">{{ project.title }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.scrolling-section {
  position: relative;
  z-index: $z-main + 1;
  padding: 120px 0 80px;
  overflow-x: clip;
  overflow-y: visible;
}

.section-header {
  padding: 0 60px;
  margin-bottom: 60px;

  @media (max-width: $breakpoint-mobile) {
    padding: 0 24px;
    margin-bottom: 40px;
  }
}

.section-title {
  font-family: $font-mono;
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 700;
  line-height: 1.05;
  margin-bottom: 24px;

  .outline {
    -webkit-text-stroke: 1.5px $text-white;
    color: transparent;
  }
}

.section-desc {
  max-width: 700px;
  font-size: 13px;
  line-height: 1.7;
  color: $text-gray;
}

// Perspektif parent
.cards-perspective-container {
  perspective: 2400px;
  perspective-origin: 80% 50%;
  overflow: visible;
  width: 100%;
}

// Dönen wrapper
.cards-perspective-wrapper {
  transform-style: preserve-3d;
  will-change: transform;
}

// Kayan track
.scrolling-track {
  display: flex;
  gap: 24px;
  will-change: transform;
  padding: 0 60px;
  transform-style: preserve-3d;

  @media (max-width: $breakpoint-mobile) {
    gap: 16px;
    padding: 0 24px;
  }
}

// Proje kartları
.project-card {
  flex-shrink: 0;
  width: 300px;
  height: 420px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
  transition: border-color 0.3s;
  transform-style: preserve-3d;
  backface-visibility: hidden;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: $breakpoint-mobile) {
    width: 240px;
    height: 340px;
  }
}

.card-content {
  padding: 24px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

.card-subtitle {
  display: block;
  font-size: 11px;
  color: $text-gray;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.card-title {
  font-family: $font-mono;
  font-size: 18px;
  font-weight: 700;
  color: $text-white;
  letter-spacing: 0.05em;
}
</style>
