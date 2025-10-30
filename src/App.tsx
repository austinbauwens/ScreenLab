import { useState, useEffect } from 'react'
import { useVideoPlayer } from './hooks/useVideoPlayer'
import { Scene } from './components/Scene'
import * as THREE from 'three'

function App() {
  const {
    videoUrl,
    isPlaying,
    currentTime,
    duration,
    brightness,
    depthOfFieldFocus,
    exposure,
    controlsCollapsed,
    videoRef,
    videoRef1,
    videoRef2,
    videoRef3,
    videoUrls,
    multiVideoMode,
    loadVideo,
    togglePlayPause,
    seek,
    setBrightness,
    setDepthOfFieldFocus,
    setExposure,
    toggleControlsCollapsed,
    updateTime,
    toggleMultiVideoMode,
    lightIntensity,
    setLightIntensity,
  } = useVideoPlayer()

  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null)
  const [videoTexture1, setVideoTexture1] = useState<THREE.VideoTexture | null>(null)
  const [videoTexture2, setVideoTexture2] = useState<THREE.VideoTexture | null>(null)
  const [videoTexture3, setVideoTexture3] = useState<THREE.VideoTexture | null>(null)
  const [movementSpeed] = useState(5)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const [videoElement1, setVideoElement1] = useState<HTMLVideoElement | null>(null)
  const [videoElement2, setVideoElement2] = useState<HTMLVideoElement | null>(null)
  const [videoElement3, setVideoElement3] = useState<HTMLVideoElement | null>(null)
  const [focalLength, setFocalLength] = useState(50)

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      const texture = new THREE.VideoTexture(videoRef.current)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.format = THREE.RGBAFormat
      texture.colorSpace = THREE.SRGBColorSpace
      texture.generateMipmaps = false
      texture.anisotropy = 16
      setVideoTexture(texture)
    } else if (!videoUrl) {
      setVideoTexture(null)
    }
  }, [videoUrl, videoRef])

  useEffect(() => {
    if (multiVideoMode) {
      if (videoRef1.current && videoUrls[0]) {
        const texture = new THREE.VideoTexture(videoRef1.current)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBAFormat
        texture.colorSpace = THREE.SRGBColorSpace
        texture.generateMipmaps = false
        texture.anisotropy = 16
        setVideoTexture1(texture)
      } else {
        setVideoTexture1(null)
      }
      
      if (videoRef2.current && videoUrls[1]) {
        const texture = new THREE.VideoTexture(videoRef2.current)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBAFormat
        texture.colorSpace = THREE.SRGBColorSpace
        texture.generateMipmaps = false
        texture.anisotropy = 16
        setVideoTexture2(texture)
      } else {
        setVideoTexture2(null)
      }
      
      if (videoRef3.current && videoUrls[2]) {
        const texture = new THREE.VideoTexture(videoRef3.current)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBAFormat
        texture.colorSpace = THREE.SRGBColorSpace
        texture.generateMipmaps = false
        texture.anisotropy = 16
        setVideoTexture3(texture)
      } else {
        setVideoTexture3(null)
      }
    } else {
      setVideoTexture1(null)
      setVideoTexture2(null)
      setVideoTexture3(null)
    }
  }, [multiVideoMode, videoUrls, videoRef1, videoRef2, videoRef3])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Scene 
          videoTexture={videoTexture} 
          brightness={brightness} 
          movementSpeed={movementSpeed} 
          exposure={exposure} 
          videoElement={videoElement}
          onFocalLengthChange={setFocalLength}
          multiVideoMode={multiVideoMode}
          videoTextures={[videoTexture1, videoTexture2, videoTexture3]}
          videoElements={[videoElement1, videoElement2, videoElement3]}
          lightIntensity={lightIntensity}
        />
      
      {/* Hidden video element */}
      {videoUrl && !multiVideoMode && (
        <video
          ref={(el) => {
            const ref = videoRef
            if (el && ref.current !== el) {
              ;(ref as any).current = el
              setVideoElement(el)
            }
          }}
          src={videoUrl}
          onTimeUpdate={updateTime}
          onLoadedMetadata={updateTime}
          loop
          playsInline
          style={{ display: 'none' }}
        />
      )}
      
      {/* Hidden video elements for multi-video mode */}
      {multiVideoMode && videoUrls[0] && (
        <video
          ref={(el) => {
            const ref = videoRef1
            if (el && ref.current !== el) {
              ;(ref as any).current = el
              setVideoElement1(el)
            }
          }}
          src={videoUrls[0]}
          onTimeUpdate={updateTime}
          onLoadedMetadata={updateTime}
          loop
          playsInline
          style={{ display: 'none' }}
        />
      )}
      {multiVideoMode && videoUrls[1] && (
        <video
          ref={(el) => {
            const ref = videoRef2
            if (el && ref.current !== el) {
              ;(ref as any).current = el
              setVideoElement2(el)
            }
          }}
          src={videoUrls[1]}
          onTimeUpdate={updateTime}
          onLoadedMetadata={updateTime}
          loop
          playsInline
          style={{ display: 'none' }}
        />
      )}
      {multiVideoMode && videoUrls[2] && (
        <video
          ref={(el) => {
            const ref = videoRef3
            if (el && ref.current !== el) {
              ;(ref as any).current = el
              setVideoElement3(el)
            }
          }}
          src={videoUrls[2]}
          onTimeUpdate={updateTime}
          onLoadedMetadata={updateTime}
          loop
          playsInline
          style={{ display: 'none' }}
        />
      )}

      {/* Custom Controls Panel */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(20, 20, 20, 0.9)',
        padding: controlsCollapsed ? '10px' : '20px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '12px',
        minWidth: controlsCollapsed ? 'auto' : '280px',
        transition: 'all 0.3s ease',
      }}>
        {/* Collapse/Expand Button */}
        <button
          onClick={toggleControlsCollapsed}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: controlsCollapsed ? '0' : '15px',
            fontSize: '12px',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {(e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)'}}
          onMouseOut={(e) => {(e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)'}}
        >
          {controlsCollapsed ? '▼' : '▲'} Controls
        </button>

        {!controlsCollapsed && (
          <>
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={toggleMultiVideoMode}
            style={{
              width: '100%',
              padding: '8px',
              background: multiVideoMode ? '#4a9eff' : '#333',
              color: 'white',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            {multiVideoMode ? 'Multi-Video Mode ✓' : 'Single Video Mode'}
          </button>
        </div>
        
        {!multiVideoMode && (
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'video/mp4,video/quicktime'
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) {
                  loadVideo(file)
                }
              }
              input.click()
            }}
            style={{
              width: '100%',
              padding: '8px',
              background: '#333',
              color: 'white',
              border: '1px solid #555',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Load Video
          </button>
        </div>
        )}

        {multiVideoMode && (
          <>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ marginBottom: '5px', fontSize: '11px', opacity: 0.8 }}>Screen 1 (Left):</div>
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'video/mp4,video/quicktime'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      loadVideo(file, 0)
                    }
                  }
                  input.click()
                }}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: videoUrls[0] ? '#2a5a2a' : '#333',
                  color: 'white',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                {videoUrls[0] ? '✓ Loaded' : 'Load Video'}
              </button>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ marginBottom: '5px', fontSize: '11px', opacity: 0.8 }}>Screen 2 (Center):</div>
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'video/mp4,video/quicktime'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      loadVideo(file, 1)
                    }
                  }
                  input.click()
                }}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: videoUrls[1] ? '#2a5a2a' : '#333',
                  color: 'white',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                {videoUrls[1] ? '✓ Loaded' : 'Load Video'}
              </button>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ marginBottom: '5px', fontSize: '11px', opacity: 0.8 }}>Screen 3 (Right):</div>
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'video/mp4,video/quicktime'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      loadVideo(file, 2)
                    }
                  }
                  input.click()
                }}
                style={{
                  width: '100%',
                  padding: '6px',
                  background: videoUrls[2] ? '#2a5a2a' : '#333',
                  color: 'white',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                {videoUrls[2] ? '✓ Loaded' : 'Load Video'}
              </button>
            </div>
          </>
        )}

        {(videoUrl || (multiVideoMode && (videoUrls[0] || videoUrls[1] || videoUrls[2]))) && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <button
                onClick={togglePlayPause}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#4a9eff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ marginBottom: '5px' }}>
                Time: {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
              </div>
              <input
                type="number"
                step={0.1}
                value={currentTime.toFixed(1)}
                onChange={(e) => seek(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ marginBottom: '5px' }}>
                Screen Brightness: {brightness.toFixed(1)}x
              </div>
              <input
                type="number"
                step={0.1}
                value={brightness.toFixed(1)}
                onChange={(e) => setBrightness(parseFloat(e.target.value) || 1.0)}
                style={{ width: '100%', padding: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ marginBottom: '5px' }}>
                Light Intensity: {lightIntensity.toFixed(1)}x
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '5px' }}>
            Depth of Field: {depthOfFieldFocus.toFixed(1)}
          </div>
          <input
            type="number"
            step={0.1}
            value={depthOfFieldFocus.toFixed(1)}
            onChange={(e) => setDepthOfFieldFocus(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', padding: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '5px' }}>
            Exposure: {exposure.toFixed(1)}
          </div>
          <input
            type="number"
            step={0.1}
            value={exposure.toFixed(1)}
            onChange={(e) => setExposure(parseFloat(e.target.value) || 1.0)}
            style={{ width: '100%', padding: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '5px' }}>
            Focal Length: {focalLength.toFixed(0)}mm
          </div>
          <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '5px' }}>
            Use scroll wheel to adjust
          </div>
        </div>
          </>
        )}

        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #444', fontSize: '10px', opacity: 0.7 }}>
          Controls:<br />
          WASD: Move<br />
          Q/E: Up/Down<br />
          Mouse: Look<br />
          Scroll: Focal Length<br />
          Click to lock pointer
        </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App

