import { useState, useCallback, useRef } from 'react'

export interface VideoPlayerState {
  videoFile: File | null
  videoUrl: string | null
  isPlaying: boolean
  currentTime: number
  duration: number
  brightness: number
  saturation: number
  contrast: number
    gamma: number
    depthOfFieldFocus: number
    exposure: number
    controlsCollapsed: boolean
    tiltShiftBlur: number
}

export const useVideoPlayer = () => {
  const [state, setState] = useState<VideoPlayerState>({
    videoFile: null,
    videoUrl: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    brightness: 0.1,
    saturation: 1.0,
    contrast: 1.0,
    gamma: 1.0,
    depthOfFieldFocus: 14.3,
    exposure: 1.0,
    controlsCollapsed: false,
    tiltShiftBlur: 5,
  })

  const videoRef = useRef<HTMLVideoElement>(null)

  const loadVideo = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    setState(prev => ({ ...prev, videoFile: file, videoUrl: url }))
  }, [])

  const play = useCallback(() => {
    videoRef.current?.play()
    setState(prev => ({ ...prev, isPlaying: true }))
  }, [])

  const pause = useCallback(() => {
    videoRef.current?.pause()
    setState(prev => ({ ...prev, isPlaying: false }))
  }, [])

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [state.isPlaying, play, pause])

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setState(prev => ({ ...prev, currentTime: time }))
    }
  }, [])

  const setBrightness = useCallback((brightness: number) => {
    setState(prev => ({ ...prev, brightness }))
  }, [])

  const setSaturation = useCallback((saturation: number) => {
    setState(prev => ({ ...prev, saturation }))
  }, [])

  const setContrast = useCallback((contrast: number) => {
    setState(prev => ({ ...prev, contrast }))
  }, [])

  const setGamma = useCallback((gamma: number) => {
    setState(prev => ({ ...prev, gamma }))
  }, [])

  const setDepthOfFieldFocus = useCallback((depthOfFieldFocus: number) => {
    setState(prev => ({ ...prev, depthOfFieldFocus }))
  }, [])

  const setExposure = useCallback((exposure: number) => {
    setState(prev => ({ ...prev, exposure }))
  }, [])

  const toggleControlsCollapsed = useCallback(() => {
    setState(prev => ({ ...prev, controlsCollapsed: !prev.controlsCollapsed }))
  }, [])

  const setTiltShiftBlur = useCallback((tiltShiftBlur: number) => {
    setState(prev => ({ ...prev, tiltShiftBlur }))
  }, [])

  const updateTime = useCallback(() => {
    const video = videoRef.current
    if (video) {
      setState(prev => ({ ...prev, currentTime: video.currentTime, duration: video.duration }))
    }
  }, [])

  return {
    ...state,
    videoRef,
    loadVideo,
    play,
    pause,
    togglePlayPause,
    seek,
    setBrightness,
    setSaturation,
    setContrast,
    setGamma,
    setDepthOfFieldFocus,
    setExposure,
    toggleControlsCollapsed,
    setTiltShiftBlur,
    updateTime,
  }
}

