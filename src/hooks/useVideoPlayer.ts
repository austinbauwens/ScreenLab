import { useState, useCallback, useRef } from 'react'
import React from 'react'

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
    multiVideoMode: boolean
    videoUrls: [string | null, string | null, string | null]
    videoFiles: [File | null, File | null, File | null]
    videoRefs: [React.MutableRefObject<HTMLVideoElement | null>, React.MutableRefObject<HTMLVideoElement | null>, React.MutableRefObject<HTMLVideoElement | null>]
    lightIntensity: number
}

export const useVideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const videoRef3 = useRef<HTMLVideoElement>(null)

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
    multiVideoMode: false,
    videoUrls: [null, null, null],
    videoFiles: [null, null, null],
    videoRefs: [videoRef1, videoRef2, videoRef3],
    lightIntensity: 1.0,
  })

  const loadVideo = useCallback((file: File, index?: number) => {
    const url = URL.createObjectURL(file)
    if (index !== undefined && state.multiVideoMode) {
      const newUrls = [...state.videoUrls] as [string | null, string | null, string | null]
      const newFiles = [...state.videoFiles] as [File | null, File | null, File | null]
      newUrls[index] = url
      newFiles[index] = file
      setState(prev => ({ ...prev, videoUrls: newUrls, videoFiles: newFiles }))
    } else {
      setState(prev => ({ ...prev, videoFile: file, videoUrl: url }))
    }
  }, [state.multiVideoMode, state.videoUrls, state.videoFiles])

  const play = useCallback(() => {
    if (state.multiVideoMode) {
      videoRef1.current?.play()
      videoRef2.current?.play()
      videoRef3.current?.play()
    } else {
      videoRef.current?.play()
    }
    setState(prev => ({ ...prev, isPlaying: true }))
  }, [state.multiVideoMode])

  const pause = useCallback(() => {
    if (state.multiVideoMode) {
      videoRef1.current?.pause()
      videoRef2.current?.pause()
      videoRef3.current?.pause()
    } else {
      videoRef.current?.pause()
    }
    setState(prev => ({ ...prev, isPlaying: false }))
  }, [state.multiVideoMode])

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [state.isPlaying, state.multiVideoMode, play, pause])

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
    const video = state.multiVideoMode ? videoRef1.current : videoRef.current
    if (video) {
      setState(prev => ({ ...prev, currentTime: video.currentTime, duration: video.duration }))
    }
  }, [state.multiVideoMode])

  const toggleMultiVideoMode = useCallback(() => {
    const newMode = !state.multiVideoMode
    setState(prev => ({ ...prev, multiVideoMode: newMode, videoUrls: [null, null, null], videoFiles: [null, null, null] }))
  }, [state.multiVideoMode])

  const setLightIntensity = useCallback((lightIntensity: number) => {
    setState(prev => ({ ...prev, lightIntensity }))
  }, [])

  return {
    ...state,
    videoRef,
    videoRef1,
    videoRef2,
    videoRef3,
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
    toggleMultiVideoMode,
    setLightIntensity,
  }
}

