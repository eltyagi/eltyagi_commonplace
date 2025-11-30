import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Buffer } from 'buffer'
import { HEADER_HEIGHT_COLLAPSED, HEADER_HEIGHT_EXPANDED } from './constants/layout'

// Polyfill Buffer for gray-matter
window.Buffer = Buffer

// Expose shared layout constants as CSS variables so CSS/JS stay in sync
const root = document.documentElement
root.style.setProperty('--header-height-expanded', `${HEADER_HEIGHT_EXPANDED}px`)
root.style.setProperty('--header-height-collapsed', `${HEADER_HEIGHT_COLLAPSED}px`)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

