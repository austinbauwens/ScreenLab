import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'

interface PostProcessingProps {
  depthOfFieldFocus?: number
}

export function PostProcessing({ depthOfFieldFocus = 0.5 }: PostProcessingProps) {
  // Set target to the screen position so it stays in focus
  const target = new THREE.Vector3(0, 2.5, -6)

  return (
    <EffectComposer>
      <DepthOfField
        target={target}
        bokehScale={depthOfFieldFocus}
        focalLength={0.02}
      />
    </EffectComposer>
  )
}

