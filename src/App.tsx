import React from 'react'
import Scene from './Scene'
import UIControls from './components/UIControls'
import { Provider } from 'jotai'

const App: React.FC = () => {
  return (
    <Provider>
      <Scene />
      <UIControls />
    </Provider>
  )

export default App
