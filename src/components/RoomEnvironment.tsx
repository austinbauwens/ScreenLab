import { useMemo } from 'react'
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

      {/* Ceiling beams running across the room */}
      <group position={[0, 5, 0]}>
        {/* Front to back beams */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`beam-horizontal-${i}`} position={[(i - 2) * 4, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.15, 0.15, 18]} />
            <meshPhysicalMaterial 
              color="#2a2a2a" 
              roughness={0.3} 
              metalness={0.7}
              bumpMap={trussBumpMap}
              bumpScale={0.02}
            />
          </mesh>
        ))}
        
        {/* Left to right beams */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={`beam-vertical-${i}`} position={[0, 0, (i - 3.5) * 2.5]} castShadow receiveShadow>
            <boxGeometry args={[20, 0.15, 0.15]} />
            <meshPhysicalMaterial 
              color="#2a2a2a" 
              roughness={0.3} 
              metalness={0.7}
              bumpMap={trussBumpMap}
              bumpScale={0.02}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

