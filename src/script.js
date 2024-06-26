import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"

/**
 ******************************
 ****** Three.js Initial ******
 ******************************
 */

/**
 * Init
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(5, 5, 5)
scene.add(camera)

/**
 * Addition
 */
// Controls
const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

// MODELVIEWER
let pmremGenerator = new THREE.PMREMGenerator(renderer)
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture

new RGBELoader().setPath("environment/").load("wide_street_01_1k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping

  // scene.background = texture;
  scene.environment = texture
})

// Axes
const axes = new THREE.AxesHelper(10)
scene.add(axes)

/**
 ******************************
 ************ Main ************
 ******************************
 */

/**
 * Definitions
 */

// Main Model
let model, model1

/**
 * Models
 */
// Draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")

// GLTF Loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Load main model
gltfLoader.load("/models/1.glb", (gltf) => {
  model = gltf.scene
  model.scale.set(0.1, 0.1, 0.1)
  model.position.x = 5
  scene.add(model)
})

// Load main model
// gltfLoader.load("/models/2.glb", (gltf) => {
//   model1 = gltf.scene
//   scene.add(model1)
// })

/**
 * Action
 */

/**
 * Functioins
 */

// function version() {
//   return new Date().getTime()
// }

// Auto Resize
window.addEventListener("resize", () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Animate
 */
const animate = () => {
  // Update controls
  orbitControls.update()

  // Render Scene
  renderer.render(scene, camera)

  // Call animate again on the next frame
  window.requestAnimationFrame(animate)
}

animate()
