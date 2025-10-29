import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface FPSControlsProps {
  speed?: number
}

export function FPSControls({ speed = 5 }: FPSControlsProps) {
  const { camera } = useThree()
  const keys = useRef<{ [key: string]: boolean }>({})
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const PI_2 = Math.PI / 2

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.code.toLowerCase()] = true
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code.toLowerCase()] = false
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement) {
        const movementX = event.movementX || 0
        const movementY = event.movementY || 0

        euler.current.setFromQuaternion(camera.quaternion)
        euler.current.y -= movementX * 0.002
        euler.current.x -= movementY * 0.002
        euler.current.x = Math.max(-PI_2, Math.min(PI_2, euler.current.x))
        camera.quaternion.setFromEuler(euler.current)
      }
    }

    const handleClick = () => {
      if (!document.pointerLockElement) {
        document.body.requestPointerLock()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [camera])

  useFrame((_, delta) => {
    // Simplified movement calculation
    const moveSpeed = 2 * delta * speed
    const moveVector = new THREE.Vector3()

    if (keys.current['keyw']) {
      moveVector.z -= moveSpeed
    }
    if (keys.current['keys']) {
      moveVector.z += moveSpeed
    }
    if (keys.current['keya']) {
      moveVector.x -= moveSpeed
    }
    if (keys.current['keyd']) {
      moveVector.x += moveSpeed
    }
    if (keys.current['keyq']) {
      moveVector.y += moveSpeed
    }
    if (keys.current['keye']) {
      moveVector.y -= moveSpeed
    }

    // Apply camera rotation to movement direction
    moveVector.applyQuaternion(camera.quaternion)
    moveVector.y = moveVector.y // Don't apply vertical rotation to Y movement
    
    camera.position.add(moveVector)
  })

  return null
}

