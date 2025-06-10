import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BohrAtom from './components/BohrAtom'
import ParticleSystem from './components/ParticleSystem'
import { useAtomValue } from 'jotai'
import { orbitCountAtom, electronConfigAtom } from './state/atoms'

const Scene: React.FC = () => {
  const orbitCount = useAtomValue(orbitCountAtom)
  const electronConfig = useAtomValue(electronConfigAtom)

  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <BohrAtom
        orbitCount={orbitCount}
        electronsPerOrbit={electronConfig}
        nucleusRadius={0.5}
        electronRadius={0.1}
      />
      <ParticleSystem particleRadius={0.05} />
      <OrbitControls />
    </Canvas>
  )
}

export default Scene
