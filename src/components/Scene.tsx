import { Canvas } from '@react-three/fiber'
import { CameraControls } from './Lighting'
import { AudienceSeating } from './AudienceSeating'
import { LEDScreen } from './LEDScreen'
import { Stage } from './Stage'
import { RoomEnvironment } from './RoomEnvironment'
import { PostProcessing } from './PostProcessing'
import { FPSControls } from './FPSControls'
import * as THREE from 'three'

interface SceneProps {
  videoTexture: THREE.VideoTexture | null
  brightness: number
  movementSpeed: number
  depthOfFieldFocus: number
  exposure: number
  videoElement?: HTMLVideoElement | null
}

export function Scene({ videoTexture, brightness, movementSpeed, depthOfFieldFocus, exposure, videoElement }: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.5, 3], fov: 75 }}
      gl={{ antialias: false, alpha: false }}
      onCreated={({ scene, camera, gl }) => {
        scene.fog = null
        camera.lookAt(0, 0.8, -4)
        gl.toneMappingExposure = exposure
      }}
      dpr={1}
    >
      <CameraControls exposure={exposure} key={exposure} />
      <FPSControls speed={movementSpeed} />
      <AudienceSeating />
      <LEDScreen videoTexture={videoTexture} brightness={brightness} videoElement={videoElement} />
      <Stage />
      <RoomEnvironment />
      <PostProcessing depthOfFieldFocus={depthOfFieldFocus} />
    </Canvas>
  )
}

