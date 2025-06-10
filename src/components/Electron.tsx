import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { colors } from '../theme'

export interface ElectronProps {
  targetRadius: number
  speed?: number
  size: number
}

const Electron: React.FC<ElectronProps> = ({ targetRadius, speed = 1, size }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const angleRef = useRef(0)
  const radiusRef = useRef(targetRadius)

  useFrame(() => {
    angleRef.current += 0.02 * speed
    radiusRef.current = THREE.MathUtils.lerp(radiusRef.current, targetRadius, 0.05)
    const x = radiusRef.current * Math.cos(angleRef.current)
    const z = radiusRef.current * Math.sin(angleRef.current)
    meshRef.current.position.set(x, 0, z)
  })

  return (
    <Sphere ref={meshRef} args={[size, 16, 16]}>
      <meshStandardMaterial
        color={colors.electron}
        emissive={colors.electron}
        emissiveIntensity={1}
      />
    </Sphere>
  )
}

export default Electron
