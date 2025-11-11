import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ============================================
// CONFIGURATION PAR DÉFAUT
// ============================================
const DEFAULT_CONFIG = {
  camera: {
    fov: 15,
    near: 0.1,
    far: 1000,
    positionZ: 5
  },
  renderer: {
    sizeRatio: 1.5
  },
  controls: {
    dampingFactor: 0.5,
    enableZoom: false,
    autoRotate: false
  },
  edges: {
    color: 0x333333,
    linewidth: 3,
    opacity: 0.1
  },
  rotation: {
    x: Math.PI / 5,
    y: Math.PI / 8,
    z: 0
  }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Initialise la scène Three.js
 * @returns {THREE.Scene}
 */
function createScene() {
  return new THREE.Scene()
}

/**
 * Initialise la caméra
 * @param {Object} config - Configuration de la caméra
 * @returns {THREE.PerspectiveCamera}
 */
function createCamera(config = DEFAULT_CONFIG.camera) {
  const camera = new THREE.PerspectiveCamera(
    config.fov,
    window.innerWidth / window.innerHeight,
    config.near,
    config.far
  )
  camera.position.z = config.positionZ
  return camera
}

/**
 * Initialise le renderer WebGL
 * @param {HTMLElement} container - Le conteneur DOM
 * @param {Object} config - Configuration du renderer
 * @returns {THREE.WebGLRenderer}
 * @throws {Error} Si WebGL n'est pas supporté
 */
function createRenderer(container, config = DEFAULT_CONFIG.renderer) {
  try {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(
      window.innerWidth / config.sizeRatio,
      window.innerHeight / config.sizeRatio
    )
    
    if (container) {
      container.appendChild(renderer.domElement)
    }
    
    return renderer
  } catch (error) {
    // WebGL n'est pas supporté ou erreur lors de la création du renderer
    console.error('Erreur lors de la création du renderer WebGL:', error)
    // Afficher un message d'erreur à l'utilisateur
    if (container) {
      container.innerHTML = `
        <div style="
          padding: 20px;
          background: rgba(255, 100, 100, 0.1);
          border: 2px solid rgba(255, 100, 100, 0.5);
          border-radius: 10px;
          color: #ff6464;
          text-align: center;
          font-family: sans-serif;
        ">
          <h3>⚠️ WebGL non supporté</h3>
          <p>Votre navigateur ne supporte pas WebGL ou il est désactivé.</p>
          <p style="font-size: 0.9em; opacity: 0.8;">
            Essayez avec un navigateur récent (Chrome, Firefox, Edge)
          </p>
        </div>
      `
    }
    throw new Error('WebGL n\'est pas supporté par ce navigateur')
  }
}

/**
 * Crée le matériau avec texture ou couleur
 * @param {string|string[]|number} textureOrColor - Texture ou couleur
 * @param {THREE.WebGLRenderer} renderer - Le renderer
 * @returns {THREE.Material|THREE.Material[]}
 */
function createMaterial(textureOrColor, renderer) {
  // Cas 1 : Tableau de 6 URLs pour les 6 faces
  if (Array.isArray(textureOrColor) && textureOrColor.length === 6) {
    const textureLoader = new THREE.TextureLoader()
    
    return textureOrColor.map(url => {
      const texture = textureLoader.load(url)
      
      // Améliorer la netteté
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      
      return new THREE.MeshBasicMaterial({ map: texture })
    })
  }
  
  // Cas 2 : Couleur simple
  return new THREE.MeshBasicMaterial({ color: textureOrColor })
}

/**
 * Crée le cube avec sa géométrie et son matériau
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 * @param {number} depth - Profondeur
 * @param {THREE.Material|THREE.Material[]} material - Matériau(x)
 * @returns {Object} - { cube, geometry }
 */
function createCube(width, height, depth, material) {
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const cube = new THREE.Mesh(geometry, material)
  
  return { cube, geometry }
}

/**
 * Ajoute des bordures sur les arêtes du cube
 * @param {THREE.Mesh} cube - Le cube
 * @param {THREE.BoxGeometry} geometry - La géométrie
 * @param {Object} config - Configuration des bordures
 * @returns {Object} - { edges, lineMaterial }
 */
function addEdges(cube, geometry, config = DEFAULT_CONFIG.edges) {
  const edges = new THREE.EdgesGeometry(geometry)
  const lineMaterial = new THREE.LineBasicMaterial({
    color: config.color,
    linewidth: config.linewidth,
    opacity: config.opacity,
    transparent: true
  })
  const edgeLines = new THREE.LineSegments(edges, lineMaterial)
  
  cube.add(edgeLines)
  
  return { edges, lineMaterial }
}

/**
 * Configure l'orientation initiale du cube
 * @param {THREE.Mesh} cube - Le cube
 * @param {Object} config - Configuration de rotation
 */
function setInitialRotation(cube, config = DEFAULT_CONFIG.rotation) {
  cube.rotation.x = config.x
  cube.rotation.y = config.y
  cube.rotation.z = config.z
}

/**
 * Initialise les contrôles OrbitControls
 * @param {THREE.Camera} camera - La caméra
 * @param {HTMLElement} domElement - L'élément DOM du renderer
 * @param {Object} config - Configuration des contrôles
 * @returns {OrbitControls}
 */
function createControls(camera, domElement, config = DEFAULT_CONFIG.controls) {
  const controls = new OrbitControls(camera, domElement)
  controls.enableDamping = true
  controls.dampingFactor = config.dampingFactor
  controls.enableZoom = config.enableZoom
  controls.autoRotate = config.autoRotate
  
  return controls
}

// ============================================
// FONCTION PRINCIPALE
// ============================================

/**
 * Crée une boîte 3D avec Three.js
 * @param {number} width - Largeur de la boîte
 * @param {number} height - Hauteur de la boîte
 * @param {number} depth - Profondeur de la boîte
 * @param {string|string[]|number} textureOrColor - URL de texture, tableau de 6 URLs, ou couleur hexa
 * @param {HTMLElement} container - Le conteneur DOM
 * @returns {Function} - Fonction de nettoyage
 */
export function createBox(width = 2, height = 2, depth = 2, textureOrColor = 0xffffff, container) {
  // Initialiser les composants Three.js
  const scene = createScene()
  const camera = createCamera()
  const renderer = createRenderer(container)
  
  // Créer le matériau et le cube
  const material = createMaterial(textureOrColor, renderer)
  const { cube, geometry } = createCube(width, height, depth, material)
  
  // Ajouter les bordures
  const { edges, lineMaterial } = addEdges(cube, geometry)
  
  // Configurer l'orientation
  setInitialRotation(cube)
  
  // Ajouter le cube à la scène
  scene.add(cube)
  
  // Configurer les contrôles
  const controls = createControls(camera, renderer.domElement)
  
  // Boucle d'animation
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  
  animate()
  
  // Fonction de nettoyage
  return function cleanup() {
    // Nettoyer les contrôles et géométries
    controls.dispose()
    geometry.dispose()
    edges.dispose()
    lineMaterial.dispose()
    
    // Nettoyer le(s) matériau(x)
    if (Array.isArray(material)) {
      material.forEach(mat => {
        if (mat.map) mat.map.dispose()
        mat.dispose()
      })
    } else {
      if (material.map) material.map.dispose()
      material.dispose()
    }
    
    // Nettoyer le renderer
    renderer.dispose()
    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement)
    }
  }
}

