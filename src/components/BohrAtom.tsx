import React from 'react'
import { GroupProps } from '@react-three/fiber'
import { Sphere, Torus } from '@react-three/drei'
import { useAtom } from 'jotai'
import { currentElectronOrbitAtom } from '../state/atoms'
import Electron from './Electron'

export interface BohrAtomProps extends GroupProps {
  orbitCount: number
  electronsPerOrbit: number[]
  nucleusRadius: number
  electronRadius: number
}

const BohrAtom: React.FC<BohrAtomProps> = ({
  orbitCount,
  electronsPerOrbit,
  nucleusRadius,
  electronRadius,
  ...groupProps
}) => {
  const [currentOrbit] = useAtom(currentElectronOrbitAtom)
  const maxOrbits = Math.min(orbitCount, 3)
  const radii = [1.5, 2.5, 3.5]

  return (
    <group {...groupProps}>
      <Sphere args={[nucleusRadius, 32, 32]}>
        <meshStandardMaterial color="orange" />
      </Sphere>
      {Array.from({ length: maxOrbits }).map((_, index) => {
        const orbitRadius = radii[index]
        const electronCount = electronsPerOrbit[index] ?? 0
        return (
          <group key={`orbit-${index}`}> 
          <group key={`orbit-${index}`}>  
            <Torus args={[orbitRadius, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="gray" />
            </Torus>
            {Array.from({ length: electronCount }).map((__, eIndex) => {
              const angle = (eIndex / electronCount) * Math.PI * 2
              const x = orbitRadius * Math.cos(angle)
              const z = orbitRadius * Math.sin(angle)
              return (
                <Sphere
                  key={`electron-${index}-${eIndex}`}
                  args={[electronRadius, 16, 16]}
                  position={[x, 0, z]}
                >
                  <meshStandardMaterial color="skyblue" />
                </Sphere>
              )
            })}
          </group>
        )
      })}
      {currentOrbit > 0 && currentOrbit <= radii.length && (
        <Electron targetRadius={radii[currentOrbit - 1]} size={electronRadius} />
      )}
    </group>
  )
}

export default BohrAtom
