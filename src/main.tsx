import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BeatsPlayer from './BeatsPlayer.tsx'

// Two pages, one bundle entry: /lab is the sound-audition lab, everything else is the
// radio player (the server's SPA fallback serves index.html for both; vite dev does the
// same). Lazy so the lab's chunk — including the whole Strudel graph — only downloads
// when someone actually opens it.
const SoundLab = lazy(() => import('./lab/SoundLab.tsx'))
const isLab = window.location.pathname === '/lab'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isLab ? (
      <Suspense fallback={null}>
        <SoundLab />
      </Suspense>
    ) : (
      <BeatsPlayer />
    )}
  </StrictMode>,
)
