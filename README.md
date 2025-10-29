# Event Player - Photorealistic 3D Video Player

A photorealistic web application for testing video within event setups. Features realistic lighting, 3D models, and dynamic color matching from video content.

## Features

- 🎥 **Video Playback**: Load and play MP4/MOV video files
- 🎨 **Dynamic Lighting**: Screen colors dynamically illuminate the environment
- 🎮 **Free-Flight Camera**: WASD movement with Q/E for vertical control
- 🎭 **Realistic Event Setup**: Stage, seating, and LED screen with bump-mapped materials
- ⚙️ **Real-Time Controls**: Adjust brightness, exposure, depth of field, and more

## Controls

- **WASD**: Move camera horizontally
- **Q/E**: Move camera up/down
- **Mouse**: Look around (click to lock pointer)

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/Oct29thEventPlayer.git
cd Oct29thEventPlayer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Usage

1. Click "Load Video" to select an MP4 or MOV file from your computer
2. Use the controls panel to adjust:
   - Screen brightness (affects environment lighting)
   - Exposure (overall scene brightness)
   - Depth of field
3. Fly around using WASD + Q/E controls to view from different angles

## Tech Stack

- **React** + **TypeScript**
- **Three.js** - 3D rendering
- **React Three Fiber** - React wrapper for Three.js
- **@react-three/drei** - Useful helpers
- **@react-three/postprocessing** - Post-processing effects
- **Vite** - Build tool

## License

MIT

## Acknowledgments

Built for testing and visualizing video content in realistic event environments.