import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import { createFabricBumpMap } from '../utils/textureUtils'

function Chair({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) {
  const fabricBumpMap = useMemo(() => createFabricBumpMap(), [])
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Chair Seat - with rounded edges */}
      <RoundedBox args={[0.4, 0.05, 0.4]} radius={0.02} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#1a1a1a" 
          roughness={0.6} 
          metalness={0.1}
          bumpMap={fabricBumpMap}
          bumpScale={0.02}
        />
      </RoundedBox>
      
      {/* Chair Back - with rounded edges */}
      <RoundedBox args={[0.4, 0.5, 0.05]} radius={0.02} position={[0, 0.25, -0.15]} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#1a1a1a" 
          roughness={0.6} 
          metalness={0.1}
          bumpMap={fabricBumpMap}
          bumpScale={0.02}
        />
      </RoundedBox>
      
      {/* Chair Legs - more refined */}
      <mesh position={[-0.15, -0.15, -0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.025, 0.3, 0.025]} />
        <meshPhysicalMaterial 
          color="#151515" 
          roughness={0.3} 
          metalness={0.7}
          bumpMap={fabricBumpMap}
          bumpScale={0.01}
        />
      </mesh>
      <mesh position={[0.15, -0.15, -0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.025, 0.3, 0.025]} />
        <meshPhysicalMaterial 
          color="#151515" 
          roughness={0.3} 
          metalness={0.7}
          bumpMap={fabricBumpMap}
          bumpScale={0.01}
        />
      </mesh>
      <mesh position={[-0.15, -0.15, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.025, 0.3, 0.025]} />
        <meshPhysicalMaterial 
          color="#151515" 
          roughness={0.3} 
          metalness={0.7}
          bumpMap={fabricBumpMap}
          bumpScale={0.01}
        />
      </mesh>
      <mesh position={[0.15, -0.15, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.025, 0.3, 0.025]} />
        <meshPhysicalMaterial 
          color="#151515" 
          roughness={0.3} 
          metalness={0.7}
          bumpMap={fabricBumpMap}
          bumpScale={0.01}
        />
      </mesh>
    </group>
  )
}

export function AudienceSeating() {
  // Create a full seating arrangement across the entire floor
  const positions = useMemo(() => {
    const positions: Array<[number, number, number]> = []
    const chairWidth = 0.5
    const chairDepth = 0.7
    const totalWidth = 12 // Total width of seating area
    const totalDepth = 6 // Total depth of seating area
    const startX = -totalWidth / 2
    const startZ = 2
    
    // Create rows across the entire width
    const chairsPerRow = Math.floor(totalWidth / chairWidth)
    const numRows = Math.floor(totalDepth / chairDepth)
    
    for (let row = 0; row < numRows; row++) {
      for (let chair = 0; chair < chairsPerRow; chair++) {
        positions.push([
          startX + chair * chairWidth,
          0,
          startZ - row * chairDepth,
        ] as [number, number, number])
      }
    }
    
    return positions
  }, [])

  return (
    <group>
      {positions.map((pos, idx) => (
        <Chair key={idx} position={pos} rotation={Math.PI} />
      ))}
    </group>
  )
}

