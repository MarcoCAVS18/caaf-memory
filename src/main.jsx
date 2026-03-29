import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'

// Apply saved theme before first paint to avoid flash
;(function () {
  const saved = localStorage.getItem('caaf_theme') || 'dark'
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = saved === 'dark' || (saved === 'system' && prefersDark)
  document.documentElement.classList.toggle('light', !isDark)
  document.documentElement.classList.toggle('dark', isDark)
})()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
