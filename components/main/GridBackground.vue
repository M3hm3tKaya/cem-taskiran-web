<script setup lang="ts">
// Grid çizgileri + yılan izi — hepsi aynı canvas'ta
const { canvasRef } = useSnakeTrail({
  cellSize: 50,
  maxTrailLength: 20,
  fadeSpeed: 0.015,
  color: '#00D4FF',
  gridLineColor: '#2A2A2D',
  gridLineOpacity: 0.6,
})
</script>

<template>
  <div class="grid-background">
    <canvas ref="canvasRef" class="grid-canvas" />
  </div>
</template>

<style scoped lang="scss">
.grid-background {
  position: fixed;
  inset: 0;
  z-index: $z-grid;
  pointer-events: none;
  overflow: hidden;
}

.grid-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
