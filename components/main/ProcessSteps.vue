<script setup lang="ts">
import { gsap } from 'gsap'

const steps = [
  { num: 1, label: 'Develop', offsetX: -400, offsetY: 0 },
  { num: 2, label: 'Submit', offsetX: -200, offsetY: 200 },
  { num: 3, label: 'Creative Review', offsetX: -160, offsetY: 150 },
  { num: 4, label: 'Pitch', offsetX: -240, offsetY: 200 },
]

const stepsRef = ref<HTMLElement[]>([])

onMounted(() => {
  // Her adıma farklı hız ve mesafede salınım animasyonu
  stepsRef.value.forEach((el, i) => {
    if (!el) return

    // Dikey salınım
    gsap.to(el, {
      y: `${6 + i * 2}`,
      duration: 2.5 + i * 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    // Hafif yatay salınım
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
        marginLeft: step.offsetX + 'px',
        marginTop: step.offsetY + 'px',
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
  font-size: 28px;
  color: $text-white;
  letter-spacing: 0.03em;
  will-change: transform;
}

.step-num {
  color: $text-gray;
  font-size: 26px;
}

.step-label {
  font-weight: 500;
}
</style>
