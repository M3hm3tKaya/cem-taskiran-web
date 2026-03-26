<script setup lang="ts">
import { gsap } from 'gsap'
import { useMediaQuery } from '@vueuse/core'

const isMobile = useMediaQuery('(max-width: 768px)')

const steps = computed(() => isMobile.value ? [
  { num: 1, label: 'Develop', offsetX: '-20px', offsetY: '0px' },
  { num: 2, label: 'Submit', offsetX: '10px', offsetY: '40px' },
  { num: 3, label: 'Creative Review', offsetX: '-10px', offsetY: '40px' },
  { num: 4, label: 'Pitch', offsetX: '20px', offsetY: '40px' },
] : [
  { num: 1, label: 'Develop', offsetX: '-14vw', offsetY: '0px' },
  { num: 2, label: 'Submit', offsetX: '-7vw', offsetY: '10vw' },
  { num: 3, label: 'Creative Review', offsetX: '-5vw', offsetY: '8vw' },
  { num: 4, label: 'Pitch', offsetX: '-9vw', offsetY: '10vw' },
])

const stepsRef = ref<HTMLElement[]>([])

onMounted(() => {
  stepsRef.value.forEach((el, i) => {
    if (!el) return

    gsap.to(el, {
      y: `${6 + i * 2}`,
      duration: 2.5 + i * 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    gsap.to(el, {
      x: `${3 + i * 1.5}`,
      duration: 3 + i * 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.5,
    })
  })
})
</script>

<template>
  <div class="process-steps">
    <div
      v-for="(step, i) in steps"
      :key="step.num"
      :ref="(el) => { if (el) stepsRef[i] = el as HTMLElement }"
      class="step"
      :style="{
        marginLeft: step.offsetX,
        marginTop: step.offsetY,
      }"
    >
      <span class="step-num">[{{ step.num }}]</span>
      <span class="step-label">{{ step.label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.process-steps {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: $z-main + 1;
}

.step {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: $font-mono;
  font-size: clamp(14px, 3vw, 28px);
  color: $text-white;
  letter-spacing: 0.03em;
  will-change: transform;
}

.step-num {
  color: $text-gray;
  font-size: clamp(13px, 2.8vw, 26px);
}

.step-label {
  font-weight: 500;
}
</style>
