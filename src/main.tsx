import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BeatsPlayer from './BeatsPlayer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BeatsPlayer />
  </StrictMode>,
)
