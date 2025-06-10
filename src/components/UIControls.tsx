import React, { useEffect } from 'react'
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
  Button,
} from '@mui/material'
import { colors } from '../theme'
import {
  currentElectronOrbitAtom,
  orbitCountAtom,
  electronConfigAtom,
  particleCountAtom,
  forceMagnitudeAtom,
  simulationSpeedAtom,
  particleTypeAtom,
  particleDataAtom,
} from '../state/atoms'

const UIControls: React.FC = () => {
  const [orbit, setOrbit] = useAtom(currentElectronOrbitAtom)
  const [orbitCount, setOrbitCount] = useAtom(orbitCountAtom)
  const [electronConfig, setElectronConfig] = useAtom(electronConfigAtom)
  const [particleCount, setParticleCount] = useAtom(particleCountAtom)
  const [force, setForce] = useAtom(forceMagnitudeAtom)
  const [speed, setSpeed] = useAtom(simulationSpeedAtom)
  const [type, setType] = useAtom(particleTypeAtom)
  const [particleData] = useAtom(particleDataAtom)

  const handleOrbit = (_: Event, value: number | number[]) => {
    setOrbit(Array.isArray(value) ? value[0] : value)
  }

  const handleOrbitCount = (_: Event, value: number | number[]) => {
    const count = Array.isArray(value) ? value[0] : value
    setOrbitCount(count)
  }

  const handleElectronCount =
    (index: number) => (_: Event, value: number | number[]) => {
      const newCount = Array.isArray(value) ? value[0] : value
      setElectronConfig((prev) => {
        const next = [...prev]
        next[index] = newCount
        return next
      })
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

  useEffect(() => {
    setElectronConfig((prev) => {
      const updated = prev.slice(0, orbitCount)
      while (updated.length < orbitCount) {
        updated.push(0)
      }
      return updated
    })
  }, [orbitCount, setElectronConfig])

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(particleData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'particle-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        p: 2,
        backgroundColor: 'rgba(0,0,30,0.6)',
        color: colors.electron,
      }}
    >
      <Stack spacing={2} width={240}>
        <Typography>Active Orbit: {orbit}</Typography>
        <Slider
          value={orbit}
          min={1}
          max={orbitCount}
          step={1}
          onChange={handleOrbit}
          marks
        />

        <Typography>Orbit Count: {orbitCount}</Typography>
        <Slider
          value={orbitCount}
          min={1}
          max={3}
          step={1}
          onChange={handleOrbitCount}
          marks
        />

        {Array.from({ length: orbitCount }).map((_, i) => (
          <React.Fragment key={i}>
            <Typography>
              Electrons Orbit {i + 1}: {electronConfig[i]}
            </Typography>
            <Slider
              value={electronConfig[i]}
              min={0}
              max={10}
              step={1}
              onChange={handleElectronCount(i)}
            />
          </React.Fragment>
        ))}

        <Typography>Particle Count: {particleCount}</Typography>
        <Slider
          value={particleCount}
          min={10}
          max={100}
          step={1}
          onChange={handleParticleCount}
        />

        <Typography>Force Magnitude: {force}</Typography>
        <Slider
          value={force}
          min={0}
          max={10}
          step={0.1}
          onChange={handleForce}
        />

        <Typography>Simulation Speed: {speed}</Typography>
        <Slider
          value={speed}
          min={0.1}
          max={5}
          step={0.1}
          onChange={handleSpeed}
        />

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

        <Button variant="contained" onClick={handleExport}>
          Export Data
        </Button>
      </Stack>
    </Paper>
  )
}

export default UIControls
