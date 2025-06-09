import { atom } from 'jotai'

export const currentElectronOrbitAtom = atom<number>(1)
export const electronCountAtom = atom<number>(1)

export interface ParticleData {
  position: [number, number, number]
  velocity: [number, number, number]
}

export const particleCountAtom = atom<number>(50)
export const particleTypeAtom = atom<'electron' | 'proton' | 'neutral'>('electron')
export const forceMagnitudeAtom = atom<number>(1)
export const simulationSpeedAtom = atom<number>(1)
export const particleDataAtom = atom<ParticleData[]>([])
