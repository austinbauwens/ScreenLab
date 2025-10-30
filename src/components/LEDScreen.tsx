import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LEDScreenProps {
  videoTexture: THREE.VideoTexture | null
  brightness: number
  videoElement?: HTMLVideoElement | null
  multiVideoMode?: boolean
  videoTextures?: [THREE.VideoTexture | null, THREE.VideoTexture | null, THREE.VideoTexture | null]
  videoElements?: [HTMLVideoElement | null, HTMLVideoElement | null, HTMLVideoElement | null]
  lightIntensity?: number
}

export function LEDScreen({ videoTexture, brightness, videoElement, multiVideoMode = false, videoTextures, videoElements, lightIntensity = 1.0 }: LEDScreenProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const leftMeshRef = useRef<THREE.Mesh>(null)
  const rightMeshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.RectAreaLight>(null)
  const pointLightRefs = useRef<Array<THREE.PointLight>>([])
  
  // Store previous colors for easing (separate colors for each screen in multi-video mode)
  const prevColorRefs = useRef<Array<THREE.Color>>([new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1)])
  const targetColorRefs = useRef<Array<THREE.Color>>([new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1)])
  
  // For backward compatibility with single video mode
  const prevColorRef = useRef<THREE.Color>(new THREE.Color(1, 1, 1))
  const targetColorRef = useRef<THREE.Color>(new THREE.Color(1, 1, 1))
  
  // Calculate screen dimensions based on video aspect ratio
  const [screenWidth, setScreenWidth] = useState(10)
  const [screenHeight, setScreenHeight] = useState(5)
  const [gapSize, setGapSize] = useState(1)

  useEffect(() => {
    // Update screen dimensions based on video aspect ratio
    if (videoElement) {
      const updateDimensions = () => {
        if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
          const aspectRatio = videoElement.videoWidth / videoElement.videoHeight
          
          // Keep a fixed height (5) and adjust width based on aspect ratio
          const targetHeight = 5
          const targetWidth = targetHeight * aspectRatio
          
          console.log('Video dimensions:', videoElement.videoWidth, 'x', videoElement.videoHeight)
          console.log('Setting screen to:', targetWidth, 'x', targetHeight)
          
          setScreenWidth(targetWidth)
          setScreenHeight(targetHeight)
          
          // If wider than 16:9, increase gap between screens
          const sixteenNineAspectRatio = 16/9
          if (aspectRatio > sixteenNineAspectRatio) {
            // Increase gap based on how much wider than 16:9
            const extraWidth = targetWidth - (targetHeight * sixteenNineAspectRatio)
            setGapSize(1 + extraWidth * 0.3) // Scale the extra width for gap
          } else {
            setGapSize(1)
          }
          
          // Update light dimensions to match
          if (lightRef.current) {
            lightRef.current.width = targetWidth
            lightRef.current.height = targetHeight
          }
        }
      }
      
      // Try to get dimensions immediately
      updateDimensions()
      
      // Also listen for loadedmetadata event in case video dimensions aren't available yet
      videoElement.addEventListener('loadedmetadata', updateDimensions)
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', updateDimensions)
      }
    }
    
    if (lightRef.current && videoTexture) {
      lightRef.current.intensity = brightness * 8
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
  }, [brightness, videoTexture, videoElement])
  
  // Helper function to sample color from a video element
  const sampleColorFromVideo = (video: HTMLVideoElement, targetColor: THREE.Color) => {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      const sampleSize = 256
      const canvas = document.createElement('canvas')
      canvas.width = sampleSize
      canvas.height = sampleSize
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        try {
          ctx.drawImage(video, 0, 0, sampleSize, sampleSize)
          const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize)
          
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
          
          const luminance = (avgR + avgG + avgB) / 3
          const saturationBoost = 1.5
          
          const saturatedR = luminance + (avgR - luminance) * saturationBoost
          const saturatedG = luminance + (avgG - luminance) * saturationBoost
          const saturatedB = luminance + (avgB - luminance) * saturationBoost
          
          targetColor.setRGB(
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
  
  // Sample video texture periodically for color updates
  useEffect(() => {
    if (multiVideoMode && videoElements) {
      const updateTargetColors = () => {
        videoElements.forEach((video, index) => {
          if (video) {
            sampleColorFromVideo(video, targetColorRefs.current[index])
          }
        })
      }
      
      const interval = setInterval(updateTargetColors, 50)
      return () => clearInterval(interval)
    } else if (!multiVideoMode && videoTexture && videoElement) {
      const updateTargetColor = () => {
        sampleColorFromVideo(videoElement, targetColorRef.current)
      }
      
      const interval = setInterval(updateTargetColor, 50)
      return () => clearInterval(interval)
    }
  }, [videoTexture, videoElement, multiVideoMode, videoElements])

  useFrame(() => {
    const lerpSpeed = 0.1
    
    if (multiVideoMode) {
      // In multi-video mode, each screen has its own color
      prevColorRefs.current.forEach((prevColor, index) => {
        prevColor.lerp(targetColorRefs.current[index], lerpSpeed)
      })
      
      // Update point lights with respective colors
      if (pointLightRefs.current[0]) pointLightRefs.current[0].color.copy(prevColorRefs.current[0])
      if (pointLightRefs.current[1]) pointLightRefs.current[1].color.copy(prevColorRefs.current[1])
      if (pointLightRefs.current[2]) pointLightRefs.current[2].color.copy(prevColorRefs.current[2])
      
      // Apply intensity to all lights
      const intensity = brightness * 20 * lightIntensity
      pointLightRefs.current.forEach((light) => {
        if (light) light.intensity = intensity
      })
    } else {
      // Single video mode - all lights use the same color
      prevColorRef.current.lerp(targetColorRef.current, lerpSpeed)
      
      if (lightRef.current) {
        lightRef.current.intensity = brightness * 20 * lightIntensity
        lightRef.current.color.copy(prevColorRef.current)
      }
      
      const intensity = brightness * 20 * lightIntensity
      pointLightRefs.current.forEach((light) => {
        if (light) {
          light.intensity = intensity
          light.color.copy(prevColorRef.current)
        }
      })
    }
  })

  const leftTexture = multiVideoMode ? (videoTextures?.[0] || null) : videoTexture
  const centerTexture = multiVideoMode ? (videoTextures?.[1] || null) : videoTexture
  const rightTexture = multiVideoMode ? (videoTextures?.[2] || null) : videoTexture

  return (
    <group>
      {/* Left Screen */}
      <group position={[-(screenWidth + gapSize), 2.5, -6]}>
        {/* Screen face */}
        <mesh ref={leftMeshRef} key="left-screen">
          <planeGeometry args={[screenWidth, screenHeight]} />
          <meshBasicMaterial
            map={leftTexture}
            toneMapped={false}
            key={leftTexture ? 'has-texture' : 'no-texture'}
          />
        </mesh>
        {/* Frame */}
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[screenWidth + 0.2, screenHeight + 0.2, 0.05]} />
          <meshPhysicalMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Center LED Screen */}
      <group position={[0, 2.5, -6]}>
        {/* Screen face */}
        <mesh ref={meshRef} key="center-screen">
          <planeGeometry args={[screenWidth, screenHeight]} />
          <meshBasicMaterial
            map={centerTexture}
            toneMapped={false}
            key={centerTexture ? 'has-texture' : 'no-texture'}
          />
        </mesh>
        {/* Frame */}
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[screenWidth + 0.2, screenHeight + 0.2, 0.05]} />
          <meshPhysicalMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
        </mesh>
      </group>
      
      {/* Right Screen */}
      <group position={[screenWidth + gapSize, 2.5, -6]}>
        {/* Screen face */}
        <mesh ref={rightMeshRef} key="right-screen">
          <planeGeometry args={[screenWidth, screenHeight]} />
          <meshBasicMaterial
            map={rightTexture}
            toneMapped={false}
            key={rightTexture ? 'has-texture' : 'no-texture'}
          />
        </mesh>
        {/* Frame */}
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[screenWidth + 0.2, screenHeight + 0.2, 0.05]} />
          <meshPhysicalMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
        </mesh>
      </group>

      {/* RectAreaLight for environment lighting from the center screen */}
      {videoTexture && (
        <rectAreaLight
          ref={lightRef}
          args={['#ffffff', brightness * 20, screenWidth, screenHeight]}
          position={[0, 2.5, -5.9]}
          width={screenWidth}
          height={screenHeight}
        />
      )}
      
      {/* Additional point lights from the screen for environment illumination with dynamic colors */}
      {videoTexture && (
        <>
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[0] = ref }}
            position={[-3 - screenWidth - gapSize, 2.5, -5.9]}
            intensity={brightness * 10}
            distance={30}
            decay={1.2}
            color="#ffffff"
          />
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[1] = ref }}
            position={[0, 2.5, -5.9]}
            intensity={brightness * 12}
            distance={30}
            decay={1.2}
            color="#ffffff"
          />
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[2] = ref }}
            position={[3 + screenWidth + gapSize, 2.5, -5.9]}
            intensity={brightness * 10}
            distance={30}
            decay={1.2}
            color="#ffffff"
          />
          {/* Additional downward-facing lights to hit chairs and floor */}
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[3] = ref }}
            position={[-3 - screenWidth - gapSize, 4, -5.9]}
            intensity={brightness * 8}
            distance={25}
            decay={1.3}
            color="#ffffff"
          />
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[4] = ref }}
            position={[0, 4, -5.9]}
            intensity={brightness * 10}
            distance={25}
            decay={1.3}
            color="#ffffff"
          />
          <pointLight
            ref={(ref) => { if (ref) pointLightRefs.current[5] = ref }}
            position={[3 + screenWidth + gapSize, 4, -5.9]}
            intensity={brightness * 8}
            distance={25}
            decay={1.3}
            color="#ffffff"
          />
        </>
      )}
    </group>
  )
}
