import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BohrAtom from './components/BohrAtom'
import ParticleSystem from './components/ParticleSystem'

const Scene: React.FC = () => (
  <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <BohrAtom
      orbitCount={3}
      electronsPerOrbit={[2, 8, 1]}
      nucleusRadius={0.5}
      electronRadius={0.1}
    />
    <ParticleSystem particleRadius={0.05} />
    <OrbitControls />
  </Canvas>
)

export default Scene
