import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import { SelectiveBloom } from '@react-three/postprocessing'
import * as THREE from 'three'

interface PostProcessingProps {
  depthOfFieldFocus?: number
  tiltShiftBlur?: number
}

export function PostProcessing({ depthOfFieldFocus = 14.3, tiltShiftBlur = 5 }: PostProcessingProps) {
  // No post-processing effects
  return (
    <EffectComposer multisampling={0}>
      {/* No effects applied */}
    </EffectComposer>
  )
}

