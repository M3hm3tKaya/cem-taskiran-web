<script setup lang="ts">
// Ana sayfa typewriter — sürekli döngü modunda
const { displayedBase, displayedWord, start } = useTypewriter({
  baseText: 'Positioned at the axis of talent and content across ',
  changingWords: ['film', 'television', 'music'],
  typingSpeed: 80,
  deletingSpeed: 50,
  pauseBetween: 1500,
  loop: true,
})

onMounted(async () => {
  await document.fonts.ready
  start()
})
</script>

<template>
  <div class="typewriter-section">
    <div class="submit-link">&bull; Submit Your Pitch</div>
    <h1 class="typewriter-heading">
      <span class="base">{{ displayedBase }}</span>
      <span class="word">{{ displayedWord }}</span>
      <span class="cursor">|</span>
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
  line-height: 1.08;
  color: $text-white;
  max-width: 65vw;
  letter-spacing: -0.02em;

  @media (max-width: $breakpoint-mobile) {
    max-width: 90vw;
    font-size: clamp(1.4rem, 6vw, 2.5rem);
  }
}

.cursor {
  display: inline-block;
  font-weight: 300;
  margin-left: 2px;
  animation: blink 530ms step-end infinite;
}
</style>
