import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

interface CameraControlsProps {
  exposure?: number
}

export function CameraControls({ exposure = 1.0 }: CameraControlsProps) {
  const { gl, camera } = useThree()

  useEffect(() => {
    gl.shadowMap.enabled = true
    gl.toneMapping = 0 // No tone mapping
    gl.outputEncoding = 3001 // sRGBEncoding
    gl.setClearColor(0x000000, 1) // Pure black background
  }, [gl])

  useEffect(() => {
    // Apply exposure to the renderer
    gl.toneMappingExposure = exposure
  }, [gl, exposure])

  return (
    <>
      {/* Only screen lights should illuminate the scene */}
    </>
  )
}

