import React, { useEffect, useMemo, useRef } from 'react'
import { Instances, Instance } from '@react-three/drei'
import { InstancedRigidBodies, Physics } from '@react-three/rapier'
import { Vector3Tuple, Object3D } from 'three'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  particleCountAtom,
  particleTypeAtom,
  simulationSpeedAtom,
  forceMagnitudeAtom,
  particleDataAtom,
  ParticleData,
} from '../state/atoms'
import { useFrame } from '@react-three/fiber'

export interface ParticleSystemProps {
  particleCount?: number
  particleRadius: number
  particleType?: 'electron' | 'proton' | 'neutral'
  useWorker?: boolean
}

const colorMap = {
  electron: 'skyblue',
  proton: 'red',
  neutral: 'gray',
} as const

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particleCount,
  particleRadius,
  particleType,
  useWorker = false,
}) => {
  const count = particleCount ?? useAtomValue(particleCountAtom)
  const type = particleType ?? useAtomValue(particleTypeAtom)
  const speed = useAtomValue(simulationSpeedAtom)
  const forceMag = useAtomValue(forceMagnitudeAtom)
  const setParticleData = useSetAtom(particleDataAtom)

  const positions = useMemo<Vector3Tuple[]>(
    () =>
      Array.from({ length: count }).map(() => [
        (Math.random() - 0.5) * 5,
        Math.random() * 5 + 2,
        (Math.random() - 0.5) * 5,
      ]),
    [count],
  )

  const instances = useMemo(
    () =>
      positions.map((p, index) => ({
        key: index,
        position: p as Vector3Tuple,
        rotation: [0, 0, 0] as Vector3Tuple,
      })),
    [positions],
  )

  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new Object3D(), [])
  const workerRef = useRef<Worker>()

  useEffect(() => {
    if (!useWorker) return
    workerRef.current = new Worker(new URL('../worker/physicsWorker.ts', import.meta.url), { type: 'module' })
    workerRef.current.postMessage({ type: 'init', particleCount: count, radius: particleRadius })
    const worker = workerRef.current
    worker.onmessage = (e: MessageEvent<{ type: 'update'; positions: Float32Array }>) => {
      const arr = e.data.positions
      if (!ref.current) return
      for (let i = 0; i < count; i++) {
        dummy.position.set(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2])
        dummy.updateMatrix()
        ref.current.setMatrixAt(i, dummy.matrix)
      }
      ref.current.instanceMatrix.needsUpdate = true
    }
    const id = setInterval(() => worker.postMessage({ type: 'step' }), 16)
    return () => {
      clearInterval(id)
      worker.terminate()
    }
  }, [useWorker, count, particleRadius])

  useFrame(() => {
    if (!ref.current || useWorker) return
    const particles: ParticleData[] = []
    for (let i = 0; i < count; i++) {
      ref.current.getMatrixAt(i, dummy.matrix)
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale)
      particles.push({
        position: [dummy.position.x, dummy.position.y, dummy.position.z],
        velocity: [0, 0, 0],
      })
    }
    setParticleData(particles)
  })

  if (useWorker) {
    return (
      <Instances limit={count} ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[particleRadius, 16, 16]} />
        <meshStandardMaterial color={colorMap[type]} />
        {instances.map((_, i) => (
          <Instance key={i} />
        ))}
      </Instances>
    )
  }

  return (
    <Physics gravity={[0, -9.81 * forceMag, 0]} timeStep={1 / 60 * speed}>
      <InstancedRigidBodies instances={instances} colliders="ball">
        <Instances limit={count} ref={ref} castShadow receiveShadow>
          <sphereGeometry args={[particleRadius, 16, 16]} />
          <meshStandardMaterial color={colorMap[type]} />
          {instances.map((_, i) => (
            <Instance key={i} />
          ))}
        </Instances>
      </InstancedRigidBodies>
    </Physics>
  )
}

export default ParticleSystem
