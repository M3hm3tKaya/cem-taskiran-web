<script setup lang="ts">
import * as THREE from 'three'
import { gsap } from 'gsap'

const props = defineProps<{
  introDone?: boolean
}>()

const emit = defineEmits<{
  'transition-to-main': []
}>()

const containerRef = ref<HTMLElement | null>(null)
const isDayMode = ref(true)
const isTransitioning = ref(false)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let tvGroup: THREE.Group
let wallGroup: THREE.Group
let ambientLight: THREE.AmbientLight
let backLight: THREE.PointLight
let dirLight: THREE.DirectionalLight
let frontFill: THREE.DirectionalLight
let animFrame: number

let targetRotY = 0
let currentRotY = 0
let switchClickHandler: ((e: MouseEvent) => void) | null = null
let switchTrackRef: THREE.Mesh | null = null
let switchKnobMesh: THREE.Mesh | null = null
let switchKnobOffset = 0
let switchBaseX = 0
const switchOn = ref(false)

// Video + texture güncelleme
let tvCanvas: HTMLCanvasElement
let tvCtx: CanvasRenderingContext2D
let tvTexture: THREE.CanvasTexture
let tvVideo: HTMLVideoElement
let screenBounds = { x: 0, y: 0, w: 0, h: 0, r: 0 }
let staticDrawn = false
let barrelCanvas: HTMLCanvasElement | null = null
let barrelCtx: CanvasRenderingContext2D

// Switch label ekran pozisyonu
const switchLabelPos = ref({ x: 0, y: 0, visible: false })

const scrollProgress = ref(0)

// ── Yardımcı: Yuvarlak dikdörtgen path ──
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ── CanvasTexture: TV ön yüz + video ekran ──
function createTVFrontTexture(): THREE.CanvasTexture {
  tvCanvas = document.createElement('canvas')
  const s = 2
  const W = 420 * s, H = 480 * s
  tvCanvas.width = W
  tvCanvas.height = H
  tvCtx = tvCanvas.getContext('2d')!

  // Ekran koordinatlarını hesapla
  const bezelX = 32 * s, bezelY = 32 * s
  const bezelW = W - 64 * s, bezelH = H * 0.58
  const iPad = 14 * s
  const iX = bezelX + iPad, iY = bezelY + iPad
  const iW = bezelW - iPad * 2, iH = bezelH - iPad * 2
  const sPad = 10 * s
  screenBounds = {
    x: iX + sPad, y: iY + sPad,
    w: iW - sPad * 2, h: iH - sPad * 2,
    r: 16 * s,
  }

  // Video elementi
  tvVideo = document.createElement('video')
  tvVideo.src = '/videos/CT_INTRO.mp4'
  tvVideo.loop = true
  tvVideo.muted = true
  tvVideo.playsInline = true
  tvVideo.playbackRate = 1.2
  tvVideo.pause()

  // Statik kısımları çiz
  drawStaticParts()

  tvTexture = new THREE.CanvasTexture(tvCanvas)
  tvTexture.minFilter = THREE.LinearFilter
  tvTexture.magFilter = THREE.LinearFilter
  tvTexture.anisotropy = 16
  tvTexture.colorSpace = THREE.SRGBColorSpace
  return tvTexture
}

function drawStaticParts() {
  const ctx = tvCtx
  const W = tvCanvas.width, H = tvCanvas.height
  const s = 2

  // Arka plan
  ctx.fillStyle = '#8A8A8A'
  ctx.fillRect(0, 0, W, H)

  // Bezel outer
  const bezelX = 32 * s, bezelY = 32 * s
  const bezelW = W - 64 * s, bezelH = H * 0.58, bezelR = 32 * s
  ctx.fillStyle = '#2A2A2D'
  roundRect(ctx, bezelX, bezelY, bezelW, bezelH, bezelR)
  ctx.fill()

  // Bezel inner
  const iPad = 14 * s
  const iX = bezelX + iPad, iY = bezelY + iPad
  const iW = bezelW - iPad * 2, iH = bezelH - iPad * 2, iR = 24 * s
  ctx.fillStyle = '#1A1A1D'
  roundRect(ctx, iX, iY, iW, iH, iR)
  ctx.fill()

  // Ekran siyah (video yüklenmeden önce)
  const { x, y, w, h, r } = screenBounds
  ctx.fillStyle = '#0A0A0C'
  roundRect(ctx, x, y, w, h, r)
  ctx.fill()

  // Alt bölge sil (3D objeler var)
  const controlsTop = bezelY + bezelH + 20 * s
  ctx.clearRect(0, controlsTop, W, H - controlsTop)
}

// Video texture güncelleme — 20fps yeterli (her 3 frame'de 1)
let frameCount = 0

function updateScreenFrame() {
  frameCount++
  if (frameCount % 3 !== 0) return // 60fps → 20fps texture güncelleme
  if (!tvCtx || !tvVideo || !tvTexture || tvVideo.readyState < 2) return

  const { x, y, w, h, r } = screenBounds

  // Yuvarlatılmış köşelerle clip
  tvCtx.save()
  roundRect(tvCtx, x, y, w, h, r)
  tvCtx.clip()
  tvCtx.drawImage(tvVideo, x, y, w, h)
  tvCtx.restore()
  tvTexture.needsUpdate = true
}

// ── Işıklar ──
function setupLights() {
  ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8)
  scene.add(ambientLight)

  // Sol üst directional — gölgeler için
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

  // Ön dolgu — TV ön yüzü
  frontFill = new THREE.DirectionalLight(0xFFFFFF, 0.6)
  frontFill.position.set(0, 2, 8)
  frontFill.castShadow = true
  frontFill.shadow.mapSize.set(512, 512)
  frontFill.shadow.bias = -0.0003
  frontFill.shadow.camera.near = 0.5
  frontFill.shadow.camera.far = 15
  frontFill.shadow.camera.left = -3
  frontFill.shadow.camera.right = 3
  frontFill.shadow.camera.top = 3
  frontFill.shadow.camera.bottom = -3
  frontFill.shadow.radius = 2
  scene.add(frontFill)

  // Arka duvar vinyet — yumuşak yayılımlı spot, TV arkasında duvara vuruyor
  backLight = new THREE.SpotLight(0xFFFFFF, 3.0, 20, Math.PI / 3, 1.0, 1.0)
  backLight.position.set(0, 2.5, 0)
  backLight.target.position.set(0, 2, -3)
  scene.add(backLight)
  scene.add(backLight.target)

  // Hafif sağ dolgu
  const rightFill = new THREE.PointLight(0xFFFFFF, 0.15, 10)
  rightFill.position.set(5, 2, 2)
  scene.add(rightFill)
}

// ── Pütürlü duvar texture oluştur ──
function createWallBumpTexture(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Gri arka plan
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)

  // Random noise pikselleri — pütür hissi
  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30
    data[i] = 128 + noise
    data[i + 1] = 128 + noise
    data[i + 2] = 128 + noise
    data[i + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 4)
  return tex
}

// ── Duvarlar ──
function createWalls() {
  wallGroup = new THREE.Group()
  const bumpTex = createWallBumpTexture()

  // Arka duvar — radial gradient vignette texture
  const wallCanvas = document.createElement('canvas')
  wallCanvas.width = 512
  wallCanvas.height = 512
  const wctx = wallCanvas.getContext('2d')!
  // Orta gri arka plan
  wctx.fillStyle = '#908B85'
  wctx.fillRect(0, 0, 512, 512)
  // Orta üstten parlayan yumuşak radial gradient
  const wGrad = wctx.createRadialGradient(256, 160, 30, 256, 220, 400)
  wGrad.addColorStop(0, '#E5E2DD')
  wGrad.addColorStop(0.25, '#D0CCC5')
  wGrad.addColorStop(0.5, '#B5B0A8')
  wGrad.addColorStop(0.8, '#9A9590')
  wGrad.addColorStop(1, '#858078')
  wctx.fillStyle = wGrad
  wctx.fillRect(0, 0, 512, 512)
  const wallTex = new THREE.CanvasTexture(wallCanvas)

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), new THREE.MeshStandardMaterial({
    color: 0x9A9A9A,
    roughness: 0.95,
    metalness: 0.05,
  }))
  backWall.position.set(0, 2, -3)
  backWall.receiveShadow = true
  wallGroup.add(backWall)

  // Raf üst yüzey — TV'nin oturduğu yer, parlak beyaz
  const shelfTop = new THREE.Mesh(new THREE.PlaneGeometry(60, 8), new THREE.MeshStandardMaterial({ color: 0xD8D5D0, roughness: 0.4 }))
  shelfTop.rotation.x = -Math.PI / 2
  shelfTop.position.set(0, -1.0, -2.5)
  shelfTop.receiveShadow = true
  wallGroup.add(shelfTop)

  // Ön duvar — rafın ön kenarından aşağı
  const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(60, 12), new THREE.MeshStandardMaterial({ color: 0x929292, roughness: 0.95, metalness: 0.05 }))
  frontWall.position.set(0, -7.0, 1.5) // Raf ön kenarıyla aynı // Raf ön kenarıyla aynı z
  wallGroup.add(frontWall)

  scene.add(wallGroup)
}

// ── TV kutusu — ExtrudeGeometry (yuvarlak köşe) + PlaneGeometry ön yüz ──
function createTVBox() {
  tvGroup = new THREE.Group()

  const tvW = 2.8, tvH = 3.2, tvD = 2.8, r = 0.28

  // Rounded rectangle shape
  const shape = new THREE.Shape()
  const hw = tvW / 2, hh = tvH / 2
  shape.moveTo(-hw + r, -hh)
  shape.lineTo(hw - r, -hh)
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r)
  shape.lineTo(hw, hh - r)
  shape.quadraticCurveTo(hw, hh, hw - r, hh)
  shape.lineTo(-hw + r, hh)
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r)
  shape.lineTo(-hw, -hh + r)
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh)

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: tvD,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.12,
    bevelSegments: 5,
  })

  // Ön yüz z=0'da kalır, arkaya doğru -Z'ye uzar
  // ExtrudeGeometry +Z'ye extrude eder, biz -Z'ye çevireceğiz
  geom.computeBoundingBox()
  const bb = geom.boundingBox!
  // X,Y merkeze al. Z'de ön yüzü z=0'a hizala, derinlik arkaya gitsin
  geom.translate(
    -(bb.max.x + bb.min.x) / 2,
    -(bb.max.y + bb.min.y) / 2,
    -bb.max.z, // Ön yüz z=0'da, arka yüz z=-tvD'de
  )

  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8A8A8A'),
    roughness: 0.35,
    metalness: 0.02,
  })
  const tvBody = new THREE.Mesh(geom, bodyMat)
  tvBody.castShadow = true
  tvBody.receiveShadow = true
  tvGroup.add(tvBody)

  // Ön yüz — CanvasTexture + kutunun aynı rounded shape'i
  const frontTexture = createTVFrontTexture()
  const frontMat = new THREE.MeshBasicMaterial({
    map: frontTexture,
    transparent: true,
    alphaTest: 0.1,
  })
  // Aynı rounded shape — UV'leri 0-1 arası normalize et
  const frontGeom = new THREE.ShapeGeometry(shape)
  const uvAttr = frontGeom.attributes.uv
  for (let i = 0; i < uvAttr.count; i++) {
    // Shape koordinatları -hw..+hw, -hh..+hh → 0..1'e dönüştür
    uvAttr.setX(i, (uvAttr.getX(i) + hw) / tvW)
    uvAttr.setY(i, (uvAttr.getY(i) + hh) / tvH)
  }
  uvAttr.needsUpdate = true
  const frontMesh = new THREE.Mesh(frontGeom, frontMat)
  frontMesh.position.z = 0.01
  tvGroup.add(frontMesh)

  // 3D düğmeler — silindir, ön yüzden çıkık, gölge yapar
  const knobMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8A8A8A'),
    roughness: 0.35,
    metalness: 0.02,
  })

  // Düğme pozisyonları (TV koordinat sistemi: merkez 0,0)
  // Canvas'ta: knobStartX=50*2=100px, knobY=controlsTop+30*2
  // Canvas 840x960, TV 2.8x3.2 → 1px = 2.8/840 = 0.00333 birim
  // knobX[0] = (100 + 22) / 840 * 2.8 - 1.4 = -0.994
  // knobX[1] = (100 + 22 + 18*2 + 22) / 840 * 2.8 - 1.4 = -0.736
  // knobX[2] = (100 + 22*2 + 18*2*2 + 22) / 840 * 2.8 - 1.4 = -0.478
  // knobY (canvas) ≈ (bezelH + 20*2 + 30*2 + 31) = ~620px merkez
  // Y = -(620/960 * 3.2 - 1.6) = -(2.067 - 1.6) = -0.467

  const knobData = [
    { x: -1.00, y: -0.95, label: 'Volume' },
    { x: -0.75, y: -0.95, label: 'Tuning' },
    { x: -0.50, y: -0.95, label: 'Frequency' },
  ]

  const knobRingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1A1A1D'),
    roughness: 0.5,
  })

  for (const kd of knobData) {
    // Silindir düğme — %40 büyütüldü (0.04 → 0.056)
    const knobGeom = new THREE.CylinderGeometry(0.056, 0.056, 0.029, 16)
    const knob = new THREE.Mesh(knobGeom, knobMat)
    knob.rotation.x = Math.PI / 2
    knob.position.set(kd.x, kd.y, 0.03)
    knob.castShadow = true
    tvGroup.add(knob)

    // Siyah ince border — %40 büyütüldü (0.042 → 0.059)
    const ringGeom = new THREE.TorusGeometry(0.059, 0.002, 8, 24)
    const ring = new THREE.Mesh(ringGeom, knobRingMat)
    ring.position.set(kd.x, kd.y, 0.015)
    tvGroup.add(ring)

    // Etiket — %40 büyütüldü
    const labelCanvas = document.createElement('canvas')
    labelCanvas.width = 128
    labelCanvas.height = 32
    const lctx = labelCanvas.getContext('2d')!
    lctx.fillStyle = '#000000'
    lctx.font = '18px sans-serif'
    lctx.textAlign = 'center'
    lctx.fillText(kd.label, 64, 20)
    const labelTex = new THREE.CanvasTexture(labelCanvas)
    const labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.31, 0.077),
      new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, depthWrite: false })
    )
    labelMesh.position.set(kd.x, kd.y + 0.10, 0.02)
    tvGroup.add(labelMesh)
  }

  // Toggle switch — ilk düğmenin altında
  const switchTrackW = 0.42, switchTrackH = 0.15
  const switchKnobR = switchTrackH / 2 - 0.01  // Düğme yarıçapı = kanal yarıçapına yakın
  const switchX = -0.86
  const switchY = -1.33

  // Kanal (track) — gri, yuvarlak köşeli (CapsuleGeometry benzeri: 2 yarım daire + ortası)
  // ExtrudeGeometry ile yuvarlak köşeli track
  const trackShape = new THREE.Shape()
  const thr = switchTrackH / 2 // Yarıçap = yüksekliğin yarısı → tam kapsül
  const thw = switchTrackW / 2 - thr
  trackShape.moveTo(-thw, -thr)
  trackShape.lineTo(thw, -thr)
  trackShape.absarc(thw, 0, thr, -Math.PI / 2, Math.PI / 2, false)
  trackShape.lineTo(-thw, thr)
  trackShape.absarc(-thw, 0, thr, Math.PI / 2, -Math.PI / 2, false)

  // Dış kanal — açık gri
  const trackGeom = new THREE.ExtrudeGeometry(trackShape, { depth: 0.01, bevelEnabled: false })
  trackGeom.center()
  const trackMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#7A7A7A'), roughness: 0.5 })
  const trackMesh = new THREE.Mesh(trackGeom, trackMat)
  trackMesh.position.set(switchX, switchY, 0.008)
  tvGroup.add(trackMesh)
  switchTrackRef = trackMesh

  // İç ray — daha koyu, daha ince kapsül (düğmenin kayma hattı)
  const railH = switchTrackH * 0.22
  const railR = railH / 2
  const railW = switchTrackW - switchTrackH + railH // İç ray biraz kısa
  const railShape = new THREE.Shape()
  const rhw = railW / 2 - railR
  railShape.moveTo(-rhw, -railR)
  railShape.lineTo(rhw, -railR)
  railShape.absarc(rhw, 0, railR, -Math.PI / 2, Math.PI / 2, false)
  railShape.lineTo(-rhw, railR)
  railShape.absarc(-rhw, 0, railR, Math.PI / 2, -Math.PI / 2, false)

  const railGeom = new THREE.ExtrudeGeometry(railShape, { depth: 0.008, bevelEnabled: false })
  railGeom.center()
  const railMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#B5B2AE'), roughness: 0.6 })
  const railMesh = new THREE.Mesh(railGeom, railMat)
  railMesh.position.set(switchX, switchY, 0.012)
  tvGroup.add(railMesh)

  // Kayan düğme — siyah daire, ray üstünde kayar
  const switchKnobGeom = new THREE.CylinderGeometry(switchKnobR, switchKnobR, 0.02, 24)
  const switchKnobMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#1A1A1D'), roughness: 0.3, metalness: 0.05 })
  const switchKnob = new THREE.Mesh(switchKnobGeom, switchKnobMat)
  switchKnob.rotation.x = Math.PI / 2
  const knobOffX = thw
  switchKnob.position.set(switchX - knobOffX, switchY, 0.025)
  switchKnob.castShadow = true
  switchKnobMesh = switchKnob
  switchKnobOffset = knobOffX
  switchBaseX = switchX
  tvGroup.add(switchKnob)

  // Tıklama — global'e kaydet, onMounted'da bağlanacak
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  switchClickHandler = (e: MouseEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    // Tüm tvGroup'u recursive tara — switch dahil her şeyi yakala
    const hits = raycaster.intersectObjects(tvGroup.children, true)
    if (hits.length > 0) {
      toggleSwitchFromLabel()
    }
  }

  // 3D Hoparlör ızgarası — siyah yatay çizgiler, dış çerçeve yok
  const slatMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2A2A2D'),
    roughness: 0.8,
  })
  const slatCount = 22
  const slatAreaH = 0.48
  const slatH = 0.004
  const slatGap = (slatAreaH - slatCount * slatH) / (slatCount - 1)
  const slatCenterX = 0.79  // +%20 sağa
  const slatCenterY = -1.09 // +%10 aşağı
  const slatStartY = slatCenterY + slatAreaH / 2

  const slatColW = 0.34  // Her sütun genişliği
  const colGap = 0.03    // Sütunlar arası boşluk
  const colOffsets = [slatCenterX - (slatColW + colGap) / 2, slatCenterX + (slatColW + colGap) / 2]

  for (const cx of colOffsets) {
    for (let i = 0; i < slatCount; i++) {
      const slatGeom = new THREE.BoxGeometry(slatColW, slatH, 0.02)
      const slat = new THREE.Mesh(slatGeom, slatMat)
      const sy = slatStartY - i * (slatH + slatGap)
      slat.position.set(cx, sy, 0.02)
      tvGroup.add(slat)
    }
  }

  tvGroup.position.set(0, 0.78, 1.2) // Öne çekildi
  scene.add(tvGroup)
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
  createTVBox()
  window.addEventListener('resize', onResize)
}

// ── Mouse — açı 2x artırıldı ──
function onMouseMove(e: MouseEvent) {
  targetRotY = ((e.clientX / window.innerWidth - 0.5) * 2) * -0.40
}

// ── Wheel zoom — yumuşak ivme ──
let targetProgress = 0

function onWheel(e: WheelEvent) {
  e.preventDefault()
  targetProgress = Math.min(1, Math.max(0, targetProgress + e.deltaY * 0.0008))
}

// ── Touch desteği — swipe ile zoom + perspektif ──
let touchStartY = 0
let touchStartX = 0

function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
  touchStartX = e.touches[0].clientX
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  const deltaY = touchStartY - e.touches[0].clientY
  const deltaX = e.touches[0].clientX

  // Swipe yukarı = zoom in
  targetProgress = Math.min(1, Math.max(0, targetProgress + deltaY * 0.002))
  touchStartY = e.touches[0].clientY

  // Touch X pozisyonu ile perspektif
  targetRotY = ((deltaX / window.innerWidth - 0.5) * 2) * -0.40
}

// ── Render loop ──
function animate() {
  animFrame = requestAnimationFrame(animate)

  // Scroll progress yumuşak lerp ile hedefe yaklaşır
  scrollProgress.value += (targetProgress - scrollProgress.value) * 0.04

  if (targetProgress > 0.95 && !isTransitioning.value) triggerTransition()

  const p = scrollProgress.value
  currentRotY += (targetRotY * (1 - p * 0.85) - currentRotY) * 0.05

  // Kamera sahne etrafında döner — objeler sabit, gölgeler değişmez
  const camDist = 12 - p * 10.5
  const lookY = 0.3 + p * 0.8
  const camY = 0.8 + p * 0.4

  camera.position.x = Math.sin(currentRotY) * camDist
  camera.position.z = Math.cos(currentRotY) * camDist
  camera.position.y = camY
  camera.lookAt(0, lookY, 0)

  // Video frame'i ekrana çiz
  updateScreenFrame()

  renderer.render(scene, camera)

  // Switch label pozisyonunu güncelle — kanalın sol kenarı referans
  if (switchTrackRef && tvGroup) {
    const worldPos = new THREE.Vector3()
    switchTrackRef.getWorldPosition(worldPos)
    // Kanalın sol kenarına offset (kanal genişliği/2 kadar sola)
    worldPos.x -= 0.21 // Kanalın sol kenarına offset — tvGroup artık dönmüyor
    const projected = worldPos.clone().project(camera)
    const sx = (projected.x * 0.5 + 0.5) * window.innerWidth
    const sy = (-projected.y * 0.5 + 0.5) * window.innerHeight
    switchLabelPos.value = { x: sx, y: sy, visible: projected.z < 1 }
  }
}

// ── Geçiş ──
const showLoadingVideo = ref(false)

function triggerTransition() {
  if (isTransitioning.value) return
  isTransitioning.value = true

  // Loading video'yu tam ekran overlay olarak göster
  showLoadingVideo.value = true

  const doTransition = () => {
    gsap.to(containerRef.value, {
      opacity: 0, duration: 0.6, ease: 'power2.inOut',
      onComplete: () => emit('transition-to-main'),
    })
  }

  nextTick(() => {
    const loadingVid = document.querySelector('.loading-video') as HTMLVideoElement
    if (loadingVid) {
      loadingVid.currentTime = 0
      loadingVid.play().catch(() => {})
      loadingVid.ontimeupdate = () => {
        if (loadingVid.duration - loadingVid.currentTime <= 0.8) {
          loadingVid.ontimeupdate = null
          doTransition()
        }
      }
    }
    setTimeout(doTransition, 4000)
  })
}

// ── Day/Night ──
function toggleDayNight() {
  isDayMode.value = !isDayMode.value

  // Day mode: orijinal ışıklandırmaya dön
  // Day değerleri init ile birebir aynı olmalı
  const bgTarget = isDayMode.value ? new THREE.Color(0x9A9A9A) : new THREE.Color(0x4A4A4D)
  const wallBack = isDayMode.value ? new THREE.Color(0x9A9A9A) : new THREE.Color(0x424245)
  const wallFront = isDayMode.value ? new THREE.Color(0x929292) : new THREE.Color(0x3E3E41)

  if (scene.background instanceof THREE.Color) {
    gsap.to(scene.background, { r: bgTarget.r, g: bgTarget.g, b: bgTarget.b, duration: 0.8 })
  }

  // wallGroup: [0] backWall, [1] shelfTop, [2] frontWall — her biri ayrı renk
  const shelfTarget = isDayMode.value ? new THREE.Color(0xD8D5D0) : new THREE.Color(0x444040)
  const meshTargets = [wallBack, shelfTarget, wallFront]

  wallGroup.children.forEach((c, i) => {
    if (c instanceof THREE.Mesh && c.material && 'color' in c.material) {
      const t = meshTargets[i] || wallFront
      gsap.to((c.material as any).color, { r: t.r, g: t.g, b: t.b, duration: 0.8 })
    }
  })

  // Işık yoğunlukları — day değerleri setupLights() ile birebir aynı
  gsap.to(ambientLight, { intensity: isDayMode.value ? 0.8 : 0.35, duration: 0.8 })
  gsap.to(backLight, { intensity: isDayMode.value ? 3.0 : 1.3, duration: 0.8 })
  gsap.to(dirLight, { intensity: isDayMode.value ? 1.2 : 0.55, duration: 0.8 })
  gsap.to(frontFill, { intensity: isDayMode.value ? 0.6 : 0.3, duration: 0.8 })
}

// Label veya kanal tıklamasından switch + day/night birlikte
function toggleSwitchFromLabel() {
  switchOn.value = !switchOn.value
  if (switchKnobMesh) {
    const targetX = switchOn.value ? switchBaseX + switchKnobOffset : switchBaseX - switchKnobOffset
    gsap.to(switchKnobMesh.position, { x: targetX, duration: 0.25, ease: 'power2.inOut' })
  }
  toggleDayNight()
}

// ── Saat ──
const currentTime = ref('')
let clockInterval: ReturnType<typeof setInterval> | null = null
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

// Intro bitince 1sn sonra videoyu başlat
watch(() => props.introDone, (done) => {
  if (done && tvVideo) {
    tvVideo.currentTime = 0.3
    tvVideo.play().catch(() => {})
  }
})

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
  scene?.traverse((o) => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); if (o.material instanceof THREE.Material) o.material.dispose() } })
})
</script>

<template>
  <div ref="containerRef" class="tv-scene-container">
    <!-- Overlay'ler -->
    <div class="ov logo-ov"><img src="/ct-logo-black.png" alt="CT1" class="logo-img" /></div>
    <div class="ov time-ov">{{ currentTime }}</div>
    <div class="ov tag-ov">// Entertainment production backed by technical infrastructure</div>
    <div class="ov scroll-ov">Scroll Down &#x25A0;</div>
    <!-- Switch label — düğmeyi takip eder -->
    <div
      v-if="switchLabelPos.visible"
      class="switch-label"
      :style="{
        left: switchLabelPos.x + 'px',
        top: switchLabelPos.y + 'px',
      }"
      @click="toggleSwitchFromLabel"
    >
      <svg class="switch-arrow" width="82" height="90" viewBox="0 0 55 60">
        <path d="M28,2 A25,25 0 0,0 50,55" :stroke="isDayMode ? '#2A2A2D' : '#E0E0E0'" stroke-width="1.2" fill="none" />
        <polygon points="25,0 31,0 28,6" :fill="isDayMode ? '#2A2A2D' : '#E0E0E0'" />
        <polygon points="47,52 53,52 50,58" :fill="isDayMode ? '#2A2A2D' : '#E0E0E0'" />
      </svg>
      <span class="switch-text" :style="{ color: isDayMode ? '#1A1A1D' : '#E0E0E0' }">Switch Day 'N' Night</span>
    </div>

    <!-- Loading video overlay — tam ekran -->
    <video
      v-if="showLoadingVideo"
      class="loading-video"
      src="/videos/loading-screen.mp4"
      muted
      playsinline
    />
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

.ov {
  position: fixed;
  z-index: 60;
  font-family: $font-mono;
  color: $text-white;
  font-size: 12px;
  letter-spacing: 0.05em;
}
.nav-ov {
  top: 40px; left: 40px;
  ul { display: flex; flex-direction: column; gap: 8px; }
  li { cursor: pointer; transition: opacity 0.3s; &:hover { opacity: 0.6; } }
  .b { margin-right: 6px; color: $accent; }
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
// Switch label — 3D switch'i takip eder
.switch-label {
  position: fixed;
  z-index: 60;
  pointer-events: auto;
  cursor: pointer;
  transform: translate(-58px, 5px);
  display: flex;
  align-items: flex-end;
  gap: 4px;
  transition: opacity 0.3s;
  &:hover { opacity: 0.6; }
}

.switch-arrow {
  flex-shrink: 0;
}

.switch-text {
  font-family: $font-mono;
  font-size: 13px;
  color: #1A1A1D;
  letter-spacing: 0.05em;
  white-space: nowrap;
  padding-bottom: 2px;
}

@media (max-width: $breakpoint-mobile) {
  .nav-ov { top: 20px; left: 20px; }
  .logo-ov { top: 20px; }
  .time-ov { top: 20px; right: 20px; }
  .tag-ov { display: none; }
  .scroll-ov { bottom: 24px; }
}
</style>
