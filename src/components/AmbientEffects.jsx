// src/components/AmbientEffects.jsx
// Drop this on any page for living background effects.
// Usage: <AmbientEffects /> anywhere in the layout, absolute positioned.

import { useEffect, useRef, useState } from "react"
import { useMusicPlayer } from "./MusicPlayerContext"

// ── Floating dust particle canvas ────────────────────────────
function DustParticles({ count = 28, color = "rgba(196,168,130," }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialise particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.25 + 0.06),
      alpha: Math.random() * 0.35 + 0.05,
      fadeDir: Math.random() > 0.5 ? 1 : -1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.alpha += p.fadeDir * 0.001
        if (p.alpha > 0.4 || p.alpha < 0.02) p.fadeDir *= -1
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width }
        if (p.x < -5 || p.x > canvas.width + 5) p.x = Math.random() * canvas.width

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `${color}${p.alpha.toFixed(2)})`
        ctx.fill()
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [count, color])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}

// ── Slow breathing glow ───────────────────────────────────────
function BreathingGlow({ color = "rgba(196,168,130,0.05)" }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-10vw",
          background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
          filter: "blur(60px)",
          animation: "breathe 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "40vw",
          height: "40vw",
          bottom: "-10vw",
          right: "-5vw",
          background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
          filter: "blur(50px)",
          animation: "breathe 10s ease-in-out 2s infinite",
        }}
      />
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
      `}</style>
    </div>
  )
}

// ── Ambient equalizer bars (shows when music is playing) ─────
export function EqualizerBars({ color = "#c4a882", barCount = 5, size = "sm" }) {
  const { isPlaying } = useMusicPlayer()
  const heights = [4, 7, 10, 6, 8]
  const dim = size === "sm" ? { w: 2, maxH: 14 } : { w: 3, maxH: 22 }

  return (
    <div className="flex items-end gap-[2px]" style={{ height: dim.maxH + 2 }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="rounded-full flex-shrink-0"
          style={{
            width: dim.w,
            background: color,
            animation: isPlaying
              ? `eqBar${i % 3} ${0.5 + i * 0.1}s ease-in-out ${i * 0.07}s infinite alternate`
              : "none",
            height: isPlaying ? `${heights[i % heights.length]}px` : "2px",
            transition: "height 0.3s ease",
          }}
        />
      ))}
      <style>{`
        @keyframes eqBar0 { from { transform: scaleY(0.3) } to { transform: scaleY(1) } }
        @keyframes eqBar1 { from { transform: scaleY(0.5) } to { transform: scaleY(1) } }
        @keyframes eqBar2 { from { transform: scaleY(0.2) } to { transform: scaleY(0.9) } }
      `}</style>
    </div>
  )
}

// ── Song hover waveform (pass playing={bool}) ─────────────────
export function SongWave({ playing, color = "#c4a882" }) {
  const heights = [3, 6, 10, 7, 11, 5, 9, 6, 10, 4]
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 14 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 2,
            background: color,
            height: playing ? h : 2,
            transition: `height ${0.15 + i * 0.02}s ease`,
            animation: playing ? `songWave ${0.4 + (i % 4) * 0.12}s ${i * 0.04}s ease-in-out infinite alternate` : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes songWave { from { transform: scaleY(0.25) } to { transform: scaleY(1) } }
      `}</style>
    </div>
  )
}

// ── Main export: full ambient layer ──────────────────────────
export default function AmbientEffects({ particleColor, glowColor, particles = true, glow = true }) {
  return (
    <>
      {glow && <BreathingGlow color={glowColor} />}
      {particles && <DustParticles color={particleColor || "rgba(196,168,130,"} />}
    </>
  )
}
