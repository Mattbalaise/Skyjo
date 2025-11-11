import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Box.css'
import { createBox } from './box.js'

function Box() {
  const mountRef = useRef(null)

  useEffect(() => {
    const cleanup = createBox(
      2, 0.17, 1, 
      [
        '/images/box/face-droite.png',
        '/images/box/face-gauche.png',
        '/images/box/face-haut.png',
        '/images/box/face-bas.png',
        '/images/box/face-avant.png',
        '/images/box/face-arriere.png'
      ],
      mountRef.current
    )
    // Retourner la fonction de nettoyage pour supprimer le cube au démontage
    return cleanup
  }, [])

  return (
    <div className="box-container">
      <div ref={mountRef} className="box-canvas"></div>
    </div>
  )
}

export default Box

