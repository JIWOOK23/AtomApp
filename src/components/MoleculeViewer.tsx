import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import './MoleculeViewer.css'

// Atom definition describing position, color and radius
interface Atom {
  position: [number, number, number]
  color: string
  radius: number
}

// Bond connects two atoms by index
interface Bond {
  start: number
  end: number
}

// Example water molecule geometry
const atoms: Atom[] = [
  { position: [0, 0, 0], color: '#ff6666', radius: 0.4 }, // Oxygen
  { position: [0.95, 0.33, 0], color: '#ffffff', radius: 0.25 }, // Hydrogen 1
  { position: [-0.95, 0.33, 0], color: '#ffffff', radius: 0.25 }, // Hydrogen 2
]

const bonds: Bond[] = [
  { start: 0, end: 1 },
  { start: 0, end: 2 },
]

// Create cylinder oriented between two atoms
const BondCylinder: React.FC<{ start: THREE.Vector3; end: THREE.Vector3 }> = ({
  start,
  end,
}) => {
  const mid = start.clone().add(end).multiplyScalar(0.5)
  const dir = end.clone().sub(start)
  const length = dir.length()
  const orientation = new THREE.Matrix4()
  orientation.lookAt(start, end, new THREE.Vector3(0, 1, 0))
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientation)
  // rotate 90 degrees because cylinder default is aligned on Y axis
  quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)))

  return (
    <mesh position={mid} quaternion={quaternion}>
      <cylinderGeometry args={[0.05, 0.05, length, 16, 1, true]} />
      <meshStandardMaterial color="#33fffe" emissive="#33fffe" wireframe />
    </mesh>
  )
}

// Renders all atoms and bonds
const Molecule: React.FC = () => (
  <group>
    {atoms.map((atom, i) => (
      <mesh key={i} position={atom.position}>
        <sphereGeometry args={[atom.radius, 32, 32]} />
        <meshStandardMaterial color={atom.color} emissive={atom.color} wireframe />
      </mesh>
    ))}
    {bonds.map((bond, i) => (
      <BondCylinder key={i} start={new THREE.Vector3(...atoms[bond.start].position)} end={new THREE.Vector3(...atoms[bond.end].position)} />
    ))}
  </group>
)

// Full viewer with lighting and controls
const MoleculeViewer: React.FC = () => {
  return (
    <div className="molecule-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <Molecule />
        {/* allow mouse/touch rotate & zoom */}
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  )
}

export default MoleculeViewer
