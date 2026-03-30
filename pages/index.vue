<script setup lang="ts">
const showIntro = ref(true)
// TV sahnesi baştan render edilir — intro'nun arkasında hazır bekler
const showTVScene = ref(true)
const showMainContent = ref(false)
const introDone = ref(false)

function onIntroComplete() {
  showIntro.value = false
  introDone.value = true
}

function onTransitionToMain() {
  showTVScene.value = false
  // Scroll pozisyonunu sıfırla — ana sayfa en üstten başlasın
  window.scrollTo(0, 0)
  showMainContent.value = true
}
</script>

<template>
  <div id="app">
    <!-- TV sahnesi arkada hazır bekler (z-index düşük) -->
    <LandingTVScene v-if="showTVScene" :intro-done="introDone" @transition-to-main="onTransitionToMain" />

    <!-- Intro perdesi üstte durur, kalkarken TV görünür -->
    <IntroScreen v-if="showIntro" @intro-complete="onIntroComplete" />

    <MainContent v-if="showMainContent" />
    <SharedCustomCursor />
  </div>
</template>

<style scoped lang="scss">
#app {
  position: relative;
}
</style>
