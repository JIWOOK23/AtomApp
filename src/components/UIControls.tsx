import React from 'react'
import { useAtom } from 'jotai'
import {
  Slider,
  Typography,
  Stack,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  currentElectronOrbitAtom,
  particleCountAtom,
  forceMagnitudeAtom,
  simulationSpeedAtom,
  particleTypeAtom,
} from '../state/atoms'

const UIControls: React.FC = () => {
  const [orbit, setOrbit] = useAtom(currentElectronOrbitAtom)
  const [particleCount, setParticleCount] = useAtom(particleCountAtom)
  const [force, setForce] = useAtom(forceMagnitudeAtom)
  const [speed, setSpeed] = useAtom(simulationSpeedAtom)
  const [type, setType] = useAtom(particleTypeAtom)

  const handleOrbit = (_: Event, value: number | number[]) => {
    setOrbit(Array.isArray(value) ? value[0] : value)
  }

  const handleParticleCount = (_: Event, value: number | number[]) => {
    setParticleCount(Array.isArray(value) ? value[0] : value)
  }

  const handleForce = (_: Event, value: number | number[]) => {
    setForce(Array.isArray(value) ? value[0] : value)
  }

  const handleSpeed = (_: Event, value: number | number[]) => {
    setSpeed(Array.isArray(value) ? value[0] : value)
  }

  return (
    <Paper sx={{ position: 'absolute', top: 16, left: 16, p: 2 }}>
      <Stack spacing={2} width={220}>
        <Typography>Electron Orbit: {orbit}</Typography>
        <Slider value={orbit} min={1} max={3} step={1} onChange={handleOrbit} marks />

        <Typography>Particle Count: {particleCount}</Typography>
        <Slider value={particleCount} min={10} max={100} step={1} onChange={handleParticleCount} />

        <Typography>Force Magnitude: {force}</Typography>
        <Slider value={force} min={0} max={10} step={0.1} onChange={handleForce} />

        <Typography>Simulation Speed: {speed}</Typography>
        <Slider value={speed} min={0.1} max={5} step={0.1} onChange={handleSpeed} />

        <FormControl fullWidth>
          <InputLabel id="type-label">Particle</InputLabel>
          <Select
            labelId="type-label"
            value={type}
            label="Particle"
            onChange={(e) => setType(e.target.value as any)}
          >
            <MenuItem value="electron">Electron</MenuItem>
            <MenuItem value="proton">Proton</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  )
}

export default UIControls
