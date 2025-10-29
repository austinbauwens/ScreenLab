import { useMemo } from 'react'
import { createBumpMap, createWoodBumpMap } from '../utils/textureUtils'

export function Stage() {
  const stageBumpMap = useMemo(() => createBumpMap(256, 0.03), [])
  const podiumBumpMap = useMemo(() => createWoodBumpMap(256), [])

  return (
    <group>
      {/* Main Stage Platform */}
      <mesh position={[0, 0.15, -5.5]} castShadow receiveShadow>
        <boxGeometry args={[12, 0.3, 3]} />
        <meshPhysicalMaterial
          color="#2a2a2a"
          roughness={0.3}
          metalness={0.1}
          bumpMap={stageBumpMap}
          bumpScale={0.01}
        />
      </mesh>

      {/* Beveled front edge */}
      <mesh position={[0, 0.3, -4.25]} castShadow receiveShadow>
        <boxGeometry args={[12, 0.08, 0.1]} />
        <meshPhysicalMaterial 
          color="#1a1a1a" 
          roughness={0.2} 
          metalness={0.3}
          bumpMap={stageBumpMap}
          bumpScale={0.005}
        />
      </mesh>

      {/* Podium/Box on stage with beveled edges */}
      <mesh position={[0, 0.5, -5]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.8, 0.8]} />
        <meshPhysicalMaterial 
          color="#1f1f1f" 
          roughness={0.4} 
          metalness={0.05}
          bumpMap={podiumBumpMap}
          bumpScale={0.02}
        />
      </mesh>
      
      {/* Podium top bevel */}
      <mesh position={[0, 0.9, -5]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.02, 0.82]} />
        <meshPhysicalMaterial 
          color="#151515" 
          roughness={0.3} 
          metalness={0.1}
          bumpMap={podiumBumpMap}
          bumpScale={0.01}
        />
      </mesh>
    </group>
  )
}

