import { useMemo } from 'react'
import { createFabricBumpMap } from '../utils/textureUtils'

function Chair({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) {
  const fabricBumpMap = useMemo(() => createFabricBumpMap(), [])
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Chair Seat - with beveled edges */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshPhysicalMaterial 
          color="#1a1a1a" 
          roughness={0.6} 
          metalness={0.1}
          bumpMap={fabricBumpMap}
          bumpScale={0.02}
        />
      </mesh>
      {/* Bevel on seat edges */}
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.02, 0.02]} />
        <meshPhysicalMaterial 
          color="#0f0f0f" 
          roughness={0.4} 
          metalness={0.2}
          bumpMap={fabricBumpMap}
          bumpScale={0.01}
        />
      </mesh>
      
      {/* Chair Back - with beveled edges */}
      <mesh position={[0, 0.25, -0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.5, 0.05]} />
        <meshPhysicalMaterial 
          color="#1a1a1a" 
          roughness={0.6} 
          metalness={0.1}
          bumpMap={fabricBumpMap}
          bumpScale={0.02}
        />
      </mesh>
      {/* Bevel on back edges */}
      <mesh position={[0, 0.25, -0.12]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.52, 0.02]} />
        <meshPhysicalMaterial 
          color="#0f0f0f" 
          roughness={0.4} 
          metalness={0.2}
          bumpMap={fabricBumpMap}
          bumpScale={0.01}
        />
      </mesh>
      
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
        <Chair key={idx} position={pos} rotation={0} />
      ))}
    </group>
  )
}

