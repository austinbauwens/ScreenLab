import * as THREE from 'three'

export function createBumpMap(size: number = 256, scale: number = 0.1): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  // Create a subtle noise pattern
  const imageData = ctx.createImageData(size, size)
  const data = imageData.data
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * scale
    const value = 128 + noise * 255
    data[i] = value     // R
    data[i + 1] = value // G
    data[i + 2] = value // B
    data[i + 3] = 255   // A
  }
  
  ctx.putImageData(imageData, 0, 0)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  texture.needsUpdate = true
  
  return texture
}

export function createWoodBumpMap(size: number = 256): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  // Create wood grain pattern
  const imageData = ctx.createImageData(size, size)
  const data = imageData.data
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      
      // Wood grain pattern
      const grain = Math.sin(x * 0.1) * 0.3 + Math.sin(y * 0.05) * 0.2
      const noise = (Math.random() - 0.5) * 0.1
      const value = 128 + (grain + noise) * 100
      
      data[i] = value     // R
      data[i + 1] = value // G
      data[i + 2] = value // B
      data[i + 3] = 255   // A
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(8, 8)
  texture.needsUpdate = true
  
  return texture
}

export function createFabricBumpMap(size: number = 256): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  // Create fabric weave pattern
  const imageData = ctx.createImageData(size, size)
  const data = imageData.data
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      
      // Fabric weave pattern
      const weaveX = Math.sin(x * 0.2) * 0.2
      const weaveY = Math.sin(y * 0.2) * 0.2
      const weave = weaveX * weaveY
      const noise = (Math.random() - 0.5) * 0.05
      const value = 128 + (weave + noise) * 50
      
      data[i] = value     // R
      data[i + 1] = value // G
      data[i + 2] = value // B
      data[i + 3] = 255   // A
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(6, 6)
  texture.needsUpdate = true
  
  return texture
}


