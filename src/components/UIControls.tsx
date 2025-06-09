import React from 'react'
import { useAtom } from 'jotai'
import { Slider, Typography, Stack, Paper } from '@mui/material'
import { currentElectronOrbitAtom } from '../state/atoms'

const UIControls: React.FC = () => {
  const [orbit, setOrbit] = useAtom(currentElectronOrbitAtom)

  const handleChange = (_: Event, value: number | number[]) => {
    setOrbit(Array.isArray(value) ? value[0] : value)
  }

  return (
    <Paper sx={{ position: 'absolute', top: 16, left: 16, p: 2 }}>
      <Stack spacing={2} width={200}>
        <Typography>Electron Orbit: {orbit}</Typography>
        <Slider
          value={orbit}
          min={1}
          max={3}
          step={1}
          onChange={handleChange}
          marks
        />
      </Stack>
    </Paper>
  )
}

export default UIControls
