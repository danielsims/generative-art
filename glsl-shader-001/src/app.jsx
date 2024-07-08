import React from 'react'
import AbstractFluidGradientShader from './AbstractFluidGradientShader'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow:'hidden' }}>
      <AbstractFluidGradientShader />
    </div>
  )
}