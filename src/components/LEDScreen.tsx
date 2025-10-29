import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LEDScreenProps {
  videoTexture: THREE.VideoTexture | null
  brightness: number
  videoElement?: HTMLVideoElement | null
}

export function LEDScreen({ videoTexture, brightness, videoElement }: LEDScreenProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.RectAreaLight>(null)
  const pointLightRefs = useRef<Array<THREE.PointLight>>([])
  
  // Store previous colors for easing
  const prevColorRef = useRef<THREE.Color>(new THREE.Color(1, 1, 1))
  const targetColorRef = useRef<THREE.Color>(new THREE.Color(1, 1, 1))

  useEffect(() => {
    if (lightRef.current && videoTexture) {
      lightRef.current.intensity = brightness * 8
      lightRef.current.width = 10
      lightRef.current.height = 5
    }
    
    // Configure video texture for better color quality
    if (videoTexture) {
      videoTexture.format = THREE.RGBAFormat
      videoTexture.colorSpace = THREE.SRGBColorSpace
      videoTexture.minFilter = THREE.LinearFilter
      videoTexture.magFilter = THREE.LinearFilter
      videoTexture.generateMipmaps = false
      videoTexture.flipY = true
      videoTexture.needsUpdate = true
    }
    
    // Force material update when texture changes
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial
      material.map = videoTexture
      material.needsUpdate = true
    }
  }, [brightness, videoTexture])
  
  // Sample video texture periodically for color updates
  useEffect(() => {
    if (!videoTexture || !videoElement) return
    
    const updateTargetColor = () => {
      const video = videoElement
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        const sampleSize = 256 // Increased for better color accuracy
        const canvas = document.createElement('canvas')
        canvas.width = sampleSize
        canvas.height = sampleSize
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          try {
            ctx.drawImage(video, 0, 0, sampleSize, sampleSize)
            const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize)
            
            // Sample multiple points and average for better color representation
            const samplePoints = [
              { x: 0.3, y: 0.3 }, { x: 0.5, y: 0.3 }, { x: 0.7, y: 0.3 },
              { x: 0.3, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.5 },
              { x: 0.3, y: 0.7 }, { x: 0.5, y: 0.7 }, { x: 0.7, y: 0.7 },
            ]
            
            let totalR = 0, totalG = 0, totalB = 0
            
            samplePoints.forEach(point => {
              const px = Math.floor(point.x * sampleSize)
              const py = Math.floor(point.y * sampleSize)
              const index = (py * sampleSize + px) * 4
              
              totalR += imageData.data[index] / 255
              totalG += imageData.data[index + 1] / 255
              totalB += imageData.data[index + 2] / 255
            })
            
            const avgR = totalR / samplePoints.length
            const avgG = totalG / samplePoints.length
            const avgB = totalB / samplePoints.length
            
            // Boost saturation for more vibrant colors
            const luminance = (avgR + avgG + avgB) / 3
            const saturationBoost = 1.5
            
            const saturatedR = luminance + (avgR - luminance) * saturationBoost
            const saturatedG = luminance + (avgG - luminance) * saturationBoost
            const saturatedB = luminance + (avgB - luminance) * saturationBoost
            
            targetColorRef.current.setRGB(
              Math.max(0, Math.min(1, saturatedR)),
              Math.max(0, Math.min(1, saturatedG)),
              Math.max(0, Math.min(1, saturatedB))
            )
          } catch (e) {
            // Ignore CORS errors
          }
        }
      }
    }
    
    const interval = setInterval(updateTargetColor, 50) // Update every 50ms for more responsive colors
    return () => clearInterval(interval)
  }, [videoTexture, videoElement])

  useFrame((state) => {
    if (lightRef.current && videoTexture) {
      lightRef.current.intensity = brightness * 20
    }
    
    // Smoothly ease the light colors towards the target
    const lerpSpeed = 0.1 // Faster transition for more responsive colors
    prevColorRef.current.lerp(targetColorRef.current, lerpSpeed)
    
    // Update lights with eased color
    if (lightRef.current) {
      lightRef.current.color.copy(prevColorRef.current)
    }
    
    pointLightRefs.current.forEach((light) => {
      light.color.copy(prevColorRef.current)
    })
  })

  return (
    <group position={[0, 2.5, -6]}>
      {/* LED Screen */}
      <mesh ref={meshRef}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshBasicMaterial
          map={videoTexture}
          colorSpace={THREE.SRGBColorSpace}
          toneMapped={false}
        />
      </mesh>

      {/* RectAreaLight for environment lighting from the screen */}
      {videoTexture && (
        <rectAreaLight
          ref={lightRef}
          args={['#ffffff', brightness * 20, 10, 5]}
          position={[0, 0, 0.1]}
          width={10}
          height={5}
        />
      )}
      
      {/* Additional point lights from the screen for environment illumination with dynamic colors */}
      {videoTexture && (
        <>
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[0] = ref }}
            position={[-3, 0, -0.5]}
            intensity={brightness * 10}
            distance={30}
            decay={1.2}
            color="#ffffff"
          />
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[1] = ref }}
            position={[0, 0, -0.5]}
            intensity={brightness * 12}
            distance={30}
            decay={1.2}
            color="#ffffff"
          />
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[2] = ref }}
            position={[3, 0, -0.5]}
            intensity={brightness * 10}
            distance={30}
            decay={1.2}
            color="#ffffff"
          />
          {/* Additional downward-facing lights to hit chairs and floor */}
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[3] = ref }}
            position={[-3, 1.5, -0.5]}
            intensity={brightness * 8}
            distance={25}
            decay={1.3}
            color="#ffffff"
          />
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[4] = ref }}
            position={[0, 1.5, -0.5]}
            intensity={brightness * 10}
            distance={25}
            decay={1.3}
            color="#ffffff"
          />
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[5] = ref }}
            position={[3, 1.5, -0.5]}
            intensity={brightness * 8}
            distance={25}
            decay={1.3}
            color="#ffffff"
          />
        </>
      )}

      {/* Screen Frame with bevel */}
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[10.2, 5.2, 0.05]} />
        <meshPhysicalMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      
      {/* Beveled frame edges */}
      <mesh position={[-5.05, 0, 0]}>
        <boxGeometry args={[0.1, 5.4, 0.1]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} metalness={0.2} />
      </mesh>
      <mesh position={[5.05, 0, 0]}>
        <boxGeometry args={[0.1, 5.4, 0.1]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} metalness={0.2} />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <boxGeometry args={[10.2, 0.1, 0.1]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} metalness={0.2} />
      </mesh>
      <mesh position={[0, -2.6, 0]}>
        <boxGeometry args={[10.2, 0.1, 0.1]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} metalness={0.2} />
      </mesh>
    </group>
  )
}
