import { useMemo } from 'react'
import * as THREE from 'three'
import { createBumpMap, createWoodBumpMap } from '../utils/textureUtils'

export function RoomEnvironment() {
  const floorBumpMap = useMemo(() => createBumpMap(256, 0.05), [])
  const wallBumpMap = useMemo(() => createBumpMap(256, 0.03), [])
  const trussBumpMap = useMemo(() => createWoodBumpMap(256), [])

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.05}
          bumpMap={floorBumpMap}
          bumpScale={0.01}
        />
      </mesh>

      {/* Back Wall - Simplified */}
      <mesh position={[0, 3, -8]} receiveShadow>
        <boxGeometry args={[20, 8, 0.5]} />
        <meshPhysicalMaterial 
          color="#0f0f0f" 
          roughness={0.8} 
          metalness={0.05}
          bumpMap={wallBumpMap}
          bumpScale={0.005}
        />
      </mesh>

      {/* Minimal ceiling truss */}
      <group position={[0, 5, -6]}>
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={`truss-${i}`} position={[(i - 1) * 4, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 0.1, 10]} />
            <meshPhysicalMaterial 
              color="#333" 
              roughness={0.2} 
              metalness={0.8}
              bumpMap={trussBumpMap}
              bumpScale={0.01}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

