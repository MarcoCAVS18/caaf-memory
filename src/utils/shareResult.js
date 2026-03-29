/**
 * shareResult
 *
 * Generates a 1080×1920 story-format image showing the game result
 * and shares it via the Web Share API (if supported) or triggers a download.
 *
 * All drawing uses the Canvas 2D API — no external dependencies.
 */

function padTime(n) { return String(n).padStart(2, '0') }
function formatTime(s) { return `${padTime(Math.floor(s / 60))}:${padTime(s % 60)}` }

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/**
 * @param {{
 *   outcome:         'win' | 'lose',
 *   difficulty:      string,
 *   score:           number,
 *   elapsed:         number,
 *   failedAttempts:  number,
 *   playerName:      string,
 *   difficultyLabel: string,
 *   scoreLabel:      string,
 *   timeLabel:       string,
 *   errorsLabel:     string,
 *   winTitle:        string,
 *   loseTitle:       string,
 * }} params
 */
export async function shareResult({
  outcome,
  score,
  elapsed,
  failedAttempts,
  playerName,
  difficultyLabel,
  scoreLabel,
  timeLabel,
  errorsLabel,
  winTitle,
  loseTitle,
}) {
  const W = 1080
  const H = 1920
  const isWin = outcome === 'win'

  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const c = canvas.getContext('2d')

  // ── Palette ──────────────────────────────────────────────────────────────────
  const BG       = '#0d1410'
  const PRIMARY  = '#bbce96'
  const SECONDARY = '#e9c176'
  const ERROR    = '#e8a09a'
  const TEXT     = '#dce8d6'
  const MUTED    = '#6b8067'
  const CARD_BG  = '#1a261a'
  const ACCENT   = isWin ? SECONDARY : ERROR

  // ── Background ───────────────────────────────────────────────────────────────
  c.fillStyle = BG
  c.fillRect(0, 0, W, H)

  // Soft radial glow behind the icon
  const radial = c.createRadialGradient(W / 2, 500, 0, W / 2, 500, 600)
  radial.addColorStop(0, isWin ? 'rgba(233,193,118,0.09)' : 'rgba(232,160,154,0.07)')
  radial.addColorStop(1, 'rgba(0,0,0,0)')
  c.fillStyle = radial
  c.fillRect(0, 0, W, H)

  // Bottom fade
  const botGrad = c.createLinearGradient(0, 1500, 0, H)
  botGrad.addColorStop(0, 'rgba(0,0,0,0)')
  botGrad.addColorStop(1, 'rgba(0,0,0,0.45)')
  c.fillStyle = botGrad
  c.fillRect(0, 1500, W, H - 1500)

  // ── Header ───────────────────────────────────────────────────────────────────
  c.fillStyle = PRIMARY
  c.font = 'bold 54px system-ui, -apple-system, Arial, sans-serif'
  c.textAlign = 'center'
  c.fillText('CAAF MEMORY', W / 2, 130)

  c.fillStyle = MUTED
  c.font = '26px system-ui, -apple-system, Arial, sans-serif'
  c.fillText('by CAAF', W / 2, 182)

  // Thin separator
  c.strokeStyle = PRIMARY
  c.globalAlpha = 0.22
  c.lineWidth = 1.5
  c.beginPath()
  c.moveTo(W / 2 - 70, 212)
  c.lineTo(W / 2 + 70, 212)
  c.stroke()
  c.globalAlpha = 1

  // ── Outcome icon circle ───────────────────────────────────────────────────────
  const cx = W / 2
  const cy = 490
  const r  = 118

  // Outer glow ring
  c.beginPath()
  c.arc(cx, cy, r + 18, 0, Math.PI * 2)
  c.fillStyle = isWin ? 'rgba(233,193,118,0.06)' : 'rgba(232,160,154,0.05)'
  c.fill()

  // Main circle
  c.beginPath()
  c.arc(cx, cy, r, 0, Math.PI * 2)
  c.fillStyle = isWin ? 'rgba(233,193,118,0.14)' : 'rgba(232,160,154,0.10)'
  c.fill()

  c.strokeStyle = ACCENT
  c.lineWidth = 2.5
  c.globalAlpha = 0.55
  c.beginPath()
  c.arc(cx, cy, r, 0, Math.PI * 2)
  c.stroke()
  c.globalAlpha = 1

  // Icon symbol (star for win, × for lose)
  c.fillStyle = ACCENT
  c.font = 'bold 86px system-ui, -apple-system, Arial, sans-serif'
  c.textBaseline = 'middle'
  c.textAlign = 'center'
  c.fillText(isWin ? '\u2605' : '\u2715', cx, cy + 4)
  c.textBaseline = 'alphabetic'

  // ── Outcome title ─────────────────────────────────────────────────────────────
  const title       = (isWin ? winTitle : loseTitle).toUpperCase()
  const titleParts  = title.split(' ')
  const midIdx      = Math.ceil(titleParts.length / 2)
  const line1       = titleParts.slice(0, midIdx).join(' ')
  const line2       = titleParts.slice(midIdx).join(' ')

  c.textAlign = 'center'
  c.font = 'bold 82px system-ui, -apple-system, Arial, sans-serif'

  if (line2) {
    c.fillStyle = TEXT
    c.fillText(line1, W / 2, 676)
    c.fillStyle = ACCENT
    c.fillText(line2, W / 2, 772)
  } else {
    c.fillStyle = ACCENT
    c.fillText(line1, W / 2, 724)
  }

  // ── Player name ───────────────────────────────────────────────────────────────
  if (playerName) {
    c.fillStyle = MUTED
    c.font = '32px system-ui, -apple-system, Arial, sans-serif'
    c.fillText('@' + playerName, W / 2, 842)
  }

  // ── Stats grid ────────────────────────────────────────────────────────────────
  const CW   = 480
  const CH   = 178
  const GAP  = 20
  const GX   = (W - CW * 2 - GAP) / 2
  const GY   = 912

  const stats = [
    { label: scoreLabel,       value: isWin ? score.toLocaleString() + ' pts' : '—', highlight: isWin },
    { label: timeLabel,        value: formatTime(elapsed),                              highlight: false },
    { label: errorsLabel,      value: String(failedAttempts),                           highlight: false },
    { label: 'Nivel',          value: difficultyLabel,                                  highlight: false },
  ]

  stats.forEach(({ label, value, highlight }, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x   = GX + col * (CW + GAP)
    const y   = GY + row * (CH + GAP)

    // Card background
    roundRect(c, x, y, CW, CH, 22)
    c.fillStyle = highlight ? 'rgba(233,193,118,0.09)' : CARD_BG
    c.fill()

    if (highlight) {
      c.strokeStyle = ACCENT
      c.lineWidth = 1.5
      c.globalAlpha = 0.35
      roundRect(c, x, y, CW, CH, 22)
      c.stroke()
      c.globalAlpha = 1
    }

    // Label
    c.fillStyle = MUTED
    c.font = '24px system-ui, -apple-system, Arial, sans-serif'
    c.textAlign = 'left'
    c.fillText(label.toUpperCase(), x + 32, y + 52)

    // Value
    c.fillStyle = highlight ? ACCENT : PRIMARY
    c.font = 'bold 54px system-ui, -apple-system, Arial, sans-serif'
    c.fillText(value, x + 32, y + CH - 30)
  })

  // ── Tagline ───────────────────────────────────────────────────────────────────
  c.textAlign = 'center'
  c.fillStyle = TEXT
  c.font = 'bold 56px system-ui, -apple-system, Arial, sans-serif'
  c.fillText('CAAF MEMORY', W / 2, 1448)

  c.fillStyle = MUTED
  c.font = '30px system-ui, -apple-system, Arial, sans-serif'
  c.fillText('Cooperativa Agropecuaria de Acopiadores Federados', W / 2, 1512)

  // ── Bottom separator ─────────────────────────────────────────────────────────
  c.strokeStyle = PRIMARY
  c.globalAlpha = 0.14
  c.lineWidth = 1
  c.beginPath()
  c.moveTo(80, 1600)
  c.lineTo(W - 80, 1600)
  c.stroke()
  c.globalAlpha = 1

  // ── Bottom branding ───────────────────────────────────────────────────────────
  c.fillStyle = MUTED
  c.font = '28px system-ui, -apple-system, Arial, sans-serif'
  c.textAlign = 'center'
  c.fillText('CAAF · caaf.coop', W / 2, 1686)

  // ── Export & share ────────────────────────────────────────────────────────────
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) { reject(new Error('Canvas toBlob returned null')); return }

      const file = new File([blob], 'harvest-memory-resultado.png', { type: 'image/png' })

      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'CAAF Memory',
            text: isWin ? winTitle : loseTitle,
          })
        } else {
          // Fallback: trigger download
          const url = URL.createObjectURL(blob)
          const a   = document.createElement('a')
          a.href     = url
          a.download = 'harvest-memory-resultado.png'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
        resolve()
      } catch (err) {
        if (err?.name === 'AbortError') resolve()   // user cancelled — not an error
        else reject(err)
      }
    }, 'image/png')
  })
}
