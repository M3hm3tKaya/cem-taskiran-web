<script setup lang="ts">
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { gsap } from 'gsap'

const props = defineProps<{
  introDone?: boolean
}>()

const emit = defineEmits<{
  'transition-to-main': []
}>()

const containerRef = ref<HTMLElement | null>(null)
const isTransitioning = ref(false)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let modelGroup: THREE.Group
let wallGroup: THREE.Group
let ambientLight: THREE.AmbientLight
let backLight: THREE.SpotLight
let dirLight: THREE.DirectionalLight
let frontFill: THREE.DirectionalLight
let animFrame: number

let targetRotY = 0
let currentRotY = 0

// Video
let tvVideo: HTMLVideoElement
let videoTexture: THREE.VideoTexture
let screenMesh: THREE.Mesh | null = null

const scrollProgress = ref(0)
const currentTime = ref('')
let clockInterval: ReturnType<typeof setInterval> | null = null

// ── Işıklar ──
function setupLights() {
  ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8)
  scene.add(ambientLight)

  dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.2)
  dirLight.position.set(-4, 6, 5)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.set(1024, 1024)
  dirLight.shadow.bias = -0.0003
  dirLight.shadow.camera.near = 0.5
  dirLight.shadow.camera.far = 25
  dirLight.shadow.camera.left = -10
  dirLight.shadow.camera.right = 10
  dirLight.shadow.camera.top = 10
  dirLight.shadow.camera.bottom = -10
  dirLight.shadow.radius = 3
  scene.add(dirLight)

  frontFill = new THREE.DirectionalLight(0xFFFFFF, 0.6)
  frontFill.position.set(0, 2, 8)
  frontFill.castShadow = true
  frontFill.shadow.mapSize.set(512, 512)
  frontFill.shadow.bias = -0.0003
  scene.add(frontFill)

  backLight = new THREE.SpotLight(0xFFFFFF, 3.0, 20, Math.PI / 3, 1.0, 1.0)
  backLight.position.set(0, 2.5, 0)
  backLight.target.position.set(0, 2, -3)
  scene.add(backLight)
  scene.add(backLight.target)

  const rightFill = new THREE.PointLight(0xFFFFFF, 0.15, 10)
  rightFill.position.set(5, 2, 2)
  scene.add(rightFill)
}

// ── Duvarlar ──
function createWalls() {
  wallGroup = new THREE.Group()

  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 20),
    new THREE.MeshStandardMaterial({ color: 0x9A9A9A, roughness: 0.95, metalness: 0.05 })
  )
  backWall.position.set(0, 2, -3)
  backWall.receiveShadow = true
  wallGroup.add(backWall)

  const shelfTop = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 8),
    new THREE.MeshStandardMaterial({ color: 0xD8D5D0, roughness: 0.4 })
  )
  shelfTop.rotation.x = -Math.PI / 2
  shelfTop.position.set(0, -1.0, -2.5)
  shelfTop.receiveShadow = true
  wallGroup.add(shelfTop)

  const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 12),
    new THREE.MeshStandardMaterial({ color: 0x929292, roughness: 0.95, metalness: 0.05 })
  )
  frontWall.position.set(0, -7.0, 1.5)
  wallGroup.add(frontWall)

  scene.add(wallGroup)
}

// ── Video hazırla ──
function setupVideo() {
  tvVideo = document.createElement('video')
  tvVideo.src = '/videos/tv-screen.mp4'
  tvVideo.loop = true
  tvVideo.muted = true
  tvVideo.playsInline = true
  tvVideo.playbackRate = 1.0
  tvVideo.autoplay = true
  tvVideo.play().catch(() => {})

  videoTexture = new THREE.VideoTexture(tvVideo)
  videoTexture.minFilter = THREE.LinearFilter
  videoTexture.magFilter = THREE.LinearFilter
  videoTexture.colorSpace = THREE.SRGBColorSpace
}

// ── GLTF Model yükle ──
function loadModel() {
  const loader = new GLTFLoader()
  modelGroup = new THREE.Group()

  loader.load('/models/monitor_klavye.gltf', (gltf) => {
    const model = gltf.scene

    // Screen mesh'ini bul ve video texture ata
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true

        if (child.name === 'screen') {
          screenMesh = child
          const uv = child.geometry.attributes.uv
          // Video 1.78 ratio, ekran ~1.30 ratio
          // Dikeyde tam göster, yatayda ortadan kırp
          // UV'ler standart 0-1 değil → önce normalize et
          let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity
          for (let j = 0; j < uv.count; j++) {
            const u = uv.getX(j), v = uv.getY(j)
            if (u < minU) minU = u; if (u > maxU) maxU = u
            if (v < minV) minV = v; if (v > maxV) maxV = v
          }
          const rangeU = maxU - minU
          const rangeV = maxV - minV

          for (let j = 0; j < uv.count; j++) {
            // 0-1 aralığına normalize et
            const normU = (uv.getX(j) - minU) / rangeU
            const normV = 1 - (uv.getY(j) - minV) / rangeV // Y flip
            uv.setXY(j, normU, normV)
          }
          uv.needsUpdate = true
          child.material = new THREE.MeshBasicMaterial({
            map: videoTexture,
            color: 0xffffff,
            toneMapped: false,
          })
        }
      }
    })

    // Modeli ölçekle ve konumlandır
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // Monitörü sahneye uygun boyuta getir (~3 birim genişlik)
    const targetWidth = 3.5
    const scale = targetWidth / size.x
    model.scale.setScalar(scale)

    // Merkeze al
    model.position.x = -center.x * scale
    model.position.y = -center.y * scale - 0.5
    model.position.z = -center.z * scale

    modelGroup.add(model)
    modelGroup.position.set(0, 0.78, 1.2)
    scene.add(modelGroup)
  })
}

// ── Sahne init ──
function initScene() {
  if (!containerRef.value) return
  const w = window.innerWidth, h = window.innerHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x9A9A9A)

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
  camera.position.set(0, 0.8, 12)
  camera.lookAt(0, 0.3, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.3
  renderer.domElement.style.cursor = 'default'
  containerRef.value.appendChild(renderer.domElement)

  setupLights()
  createWalls()
  setupVideo()
  loadModel()
  window.addEventListener('resize', onResize)
}

// ── Mouse perspektif ──
function onMouseMove(e: MouseEvent) {
  targetRotY = ((e.clientX / window.innerWidth - 0.5) * 2) * -0.40
}

// ── Wheel zoom ──
let targetProgress = 0

function onWheel(e: WheelEvent) {
  e.preventDefault()
  targetProgress = Math.min(1, Math.max(0, targetProgress + e.deltaY * 0.0005))
}

// ── Touch desteği ──
let touchStartY = 0

function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  const deltaY = touchStartY - e.touches[0].clientY
  const deltaX = e.touches[0].clientX

  targetProgress = Math.min(1, Math.max(0, targetProgress + deltaY * 0.0012))
  touchStartY = e.touches[0].clientY

  targetRotY = ((deltaX / window.innerWidth - 0.5) * 2) * -0.40
}

// ── Render loop ──
function animate() {
  animFrame = requestAnimationFrame(animate)

  scrollProgress.value += (targetProgress - scrollProgress.value) * 0.04

  if (targetProgress > 0.99 && !isTransitioning.value) triggerTransition()

  const p = scrollProgress.value
  currentRotY += (targetRotY * (1 - p * 0.85) - currentRotY) * 0.05

  // Screen mesh varsa onun pozisyonuna doğru yaklaş
  let screenWorldY = 1.1
  let screenWorldZ = 1.7
  if (screenMesh) {
    const worldPos = new THREE.Vector3()
    screenMesh.getWorldPosition(worldPos)
    screenWorldY = worldPos.y
    screenWorldZ = worldPos.z
  }

  const camDist = 12 - p * 10.5
  const lookY = 0.3 + p * (screenWorldY - 0.3)
  const lookZ = p * screenWorldZ
  const camY = 0.8 + p * (screenWorldY - 0.8)

  const screenOffsetX = -0.25 // %7 sola kaydir
  camera.position.x = Math.sin(currentRotY) * camDist + p * screenOffsetX
  camera.position.z = Math.cos(currentRotY) * camDist + p * screenWorldZ
  camera.position.y = camY
  camera.lookAt(p * screenOffsetX, lookY, lookZ)

  // Video texture güncelle
  if (videoTexture && tvVideo.readyState >= 2) {
    videoTexture.needsUpdate = true
  }

  renderer.render(scene, camera)
}

// ── Geçiş ──
const showLoadingVideo = ref(false)

function triggerTransition() {
  if (isTransitioning.value) return
  isTransitioning.value = true

  showLoadingVideo.value = true

  nextTick(() => {
    const loadingVid = document.querySelector('.loading-video') as HTMLVideoElement
    if (loadingVid) {
      loadingVid.currentTime = 0
      loadingVid.play().catch(() => {})
    }
    // 1sn sonra fade out başlasın (video 1.5sn)
    setTimeout(() => {
      const fadeOverlay = document.querySelector('.fade-overlay') as HTMLElement
      if (fadeOverlay) {
        gsap.to(fadeOverlay, {
          opacity: 1, duration: 0.5, ease: 'power2.in',
          onComplete: () => emit('transition-to-main'),
        })
      } else {
        emit('transition-to-main')
      }
    }, 1000)
  })
}


// ── Saat ──
function updateClock() {
  const now = new Date()
  currentTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`
}

function onResize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Intro bitince videoyu başlat

onMounted(() => {
  document.body.style.overflow = 'hidden'
  initScene()
  animate()
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: false })
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('resize', onResize)
  if (clockInterval) clearInterval(clockInterval)
  renderer?.dispose()
  scene?.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose()
      if (o.material instanceof THREE.Material) o.material.dispose()
    }
  })
})
</script>

<template>
  <div ref="containerRef" class="tv-scene-container">
    <!-- Overlay'ler -->
    <div class="ov logo-ov"><img src="/ct-logo-black.png" alt="CT1" class="logo-img" /></div>
    <div class="ov time-ov">{{ currentTime }}</div>
    <div class="ov tag-ov">// Entertainment production backed by technical infrastructure</div>
    <div class="ov scroll-ov">Scroll Down &#x25A0;</div>


    <!-- Loading video overlay — v-show ile DOM'da hazır bekler -->
    <video
      v-show="showLoadingVideo"
      class="loading-video"
      src="/videos/transition.mp4"
      muted
      playsinline
      preload="auto"
    />

    <!-- Fade out overlay — video üstünde siyah ekran -->
    <div v-if="showLoadingVideo" class="fade-overlay" />
  </div>
</template>

<style scoped lang="scss">
.tv-scene-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: $z-tv-scene;
  overflow: hidden;
}

.loading-video {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 100;
}

.fade-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #0E0E10;
  opacity: 0;
  z-index: 101;
  pointer-events: none;
}

.ov {
  position: fixed;
  z-index: 60;
  font-family: $font-mono;
  color: $text-white;
  font-size: 12px;
  letter-spacing: 0.05em;
}
.logo-ov { top: 40px; left: 50%; transform: translateX(-50%); }
.logo-img { height: 67px; width: auto; }
.time-ov { top: 40px; right: 40px; font-size: 13px; color: #000; }
.tag-ov { bottom: 40px; left: 40px; color: #000; font-size: 11px; max-width: 400px; }
.scroll-ov {
  bottom: 40px; left: 50%; transform: translateX(-50%); font-size: 11px; color: #000;
  animation: pulse 1.5s ease-in-out infinite alternate;
  @keyframes pulse { from { opacity: 0.4; } to { opacity: 1; } }
}


@media (max-width: $breakpoint-mobile) {
  .logo-ov { top: 20px; }
  .time-ov { top: 20px; right: 20px; }
  .tag-ov { display: none; }
  .scroll-ov { bottom: 24px; }
}
</style>
