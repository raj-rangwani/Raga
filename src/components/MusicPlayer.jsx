// src/components/MusicPlayer.jsx
import { useState, useRef, useEffect } from "react"
import { useMusicPlayer } from "./MusicPlayerContext"
import {
  Play, Pause, SkipBack, SkipForward,
  Heart, Volume2, VolumeX, ChevronDown,
  Shuffle, Repeat, X, Mic2, Tv2
} from "lucide-react"

// ── Vinyl disc ───────────────────────────────────────────────
function VinylDisc({ spinning, size = 220 }) {
  return (
    <div
      className="relative rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size,
        background:
          "conic-gradient(from 0deg, #1c1410 0deg, #2e2018 40deg, #120e0a 80deg, #221a12 120deg, #1c1410 160deg, #2e2018 200deg, #120e0a 240deg, #1c1410 280deg, #221a12 320deg, #1c1410 360deg)",
        boxShadow: "0 0 0 2px #3a2e1e, 0 0 0 5px #1a1008, 0 16px 60px rgba(0,0,0,0.8), 0 0 40px rgba(196,168,130,0.06)",
        animation: spinning ? "vinylSpin 4s linear infinite" : "none",
      }}
    >
      {[0.78, 0.64, 0.52, 0.40].map((r, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${r * 100}%`, height: `${r * 100}%`,
            border: "1px solid rgba(196,168,130,0.08)",
          }}
        />
      ))}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: size * 0.30, height: size * 0.30,
          background: "radial-gradient(circle at 35% 35%, #d4b896, #7a5a30)",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)",
        }}
      >
        <div className="rounded-full bg-black/50" style={{ width: size * 0.06, height: size * 0.06 }} />
      </div>
    </div>
  )
}

// ── Waveform bars ────────────────────────────────────────────
function WaveformBars({ playing }) {
  return (
    <div className="flex items-end gap-[2px] h-3.5">
      {[3, 6, 9, 7, 11, 5, 8, 6, 10, 4, 7, 9, 5, 8, 4].map((h, i) => (
        <div
          key={i}
          className="w-[2px] rounded-full"
          style={{
            height: playing ? `${h * 1.2}px` : "2px",
            background: "#c4a882",
            animation: playing ? `waveBar ${0.5 + (i % 4) * 0.15}s ease-in-out ${i * 0.04}s infinite alternate` : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes waveBar { from { transform: scaleY(0.3) } to { transform: scaleY(1) } }
        @keyframes vinylSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}

// ── Lyrics panel ─────────────────────────────────────────────
function LyricsPanel({ lyrics, elapsed }) {
  const activeIdx = lyrics ? lyrics.reduce((acc, l, i) => l.time <= elapsed ? i : acc, 0) : -1
  const lyricsRef = useRef(null)

  useEffect(() => {
    if (lyricsRef.current && activeIdx >= 0) {
      const el = lyricsRef.current.children[activeIdx]
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [activeIdx])

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-10">
        <Mic2 size={36} style={{ color: "rgba(196,168,130,0.2)" }} />
        <p className="text-zinc-600 text-sm" style={{ fontFamily: "Inter" }}>Lyrics unavailable</p>
      </div>
    )
  }

  return (
    <div ref={lyricsRef} className="overflow-y-auto h-full px-10 py-4 flex flex-col gap-6" style={{ scrollbarWidth: "none" }}>
      {lyrics.map((l, i) => (
        <p
          key={i}
          className="text-center leading-relaxed"
          style={{
            fontFamily: i % 2 === 0 ? "Playfair Display" : "Inter",
            fontSize: i === activeIdx ? "1.4rem" : "1rem",
            color:
              i === activeIdx
                ? "#f0dfc0"
                : Math.abs(i - activeIdx) === 1
                ? "rgba(240,223,192,0.3)"
                : "rgba(255,255,255,0.1)",
            fontWeight: i === activeIdx ? 600 : 400,
            transform: i === activeIdx ? "scale(1.04)" : "scale(1)",
            transition: "all 0.5s ease",
            textShadow: i === activeIdx ? "0 0 30px rgba(196,168,130,0.3)" : "none",
          }}
        >
          {l.line}
        </p>
      ))}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────
export default function MusicPlayer() {
  const {
    currentSong, isPlaying, progress, elapsed, liked,
    songData, totalDuration, formatTime,
    handleNext, handlePrev, seek, toggleLike, setIsPlaying,
    volume, setVolume,          // ← from context, controls actual YT player
    videoVisible, toggleVideo,  // ← from context
  } = useMusicPlayer()

  const [expanded,   setExpanded]   = useState(false)
  const [dismissed,  setDismissed]  = useState(false)
  const [muted,      setMuted]      = useState(false)
  const [prevVol,    setPrevVol]    = useState(80)  // remember vol before mute
  const [shuffle,    setShuffle]    = useState(false)
  const [repeat,     setRepeat]     = useState(false)
  const [activeView, setActiveView] = useState("cover")
  const progressBarRef = useRef(null)
  const touchStartY    = useRef(null)

  useEffect(() => { if (currentSong) setDismissed(false) }, [currentSong])

  const isLiked  = liked.has(currentSong?.title)
  const lyrics   = songData?.lyrics || null
  const hasVideo = !!currentSong?.videoId

  // Mute: set YT volume to 0 but remember previous
  const handleMuteToggle = () => {
    if (muted) {
      setVolume(prevVol)
      setMuted(false)
    } else {
      setPrevVol(volume)
      setVolume(0)
      setMuted(true)
    }
  }

  const handleVolumeChange = (v) => {
    setVolume(v)
    if (v > 0) setMuted(false)
    else setMuted(true)
  }

  const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY }
  const onTouchEnd   = (e) => {
    if (!touchStartY.current) return
    const dy = touchStartY.current - e.changedTouches[0].clientY
    if (Math.abs(dy) > 60) setActiveView(dy > 0 ? "lyrics" : "cover")
    touchStartY.current = null
  }

  const handleProgressClick = (e) => {
    if (!progressBarRef.current) return
    const rect = progressBarRef.current.getBoundingClientRect()
    seek(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)))
  }

  if (!currentSong || dismissed) return null

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          FULL-SCREEN PLAYER
      ═══════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
        style={{
          transform: expanded ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.48s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Background */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(165deg, #110a04 0%, #0d0804 30%, #090808 60%, #07090d 100%)",
        }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }} />
        <div className="absolute pointer-events-none" style={{
          top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "500px",
          background: "radial-gradient(ellipse, rgba(196,168,130,0.07) 0%, transparent 65%)",
          filter: "blur(40px)",
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none" style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
        }} />

        {/* ── Top bar ── */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-14 pb-2 flex-shrink-0">
          <button
            onClick={() => setExpanded(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/5"
          >
            <ChevronDown size={22} className="text-zinc-500" />
          </button>

          <p className="text-[10px] tracking-[0.35em] uppercase text-zinc-600" style={{ fontFamily: "Inter" }}>
            Now Playing
          </p>

          <div className="flex items-center gap-2">
            {hasVideo && (
              <button
                onClick={toggleVideo}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300"
                style={{
                  background: videoVisible ? "rgba(196,168,130,0.18)" : "rgba(255,255,255,0.06)",
                  border: videoVisible ? "1px solid rgba(196,168,130,0.35)" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Tv2 size={14} style={{ color: videoVisible ? "#c4a882" : "rgba(255,255,255,0.45)" }} />
                <span className="text-xs font-medium" style={{ color: videoVisible ? "#c4a882" : "rgba(255,255,255,0.45)", fontFamily: "Inter" }}>
                  {videoVisible ? "Audio" : "Video"}
                </span>
              </button>
            )}
            <button
              onClick={() => setActiveView(v => v === "lyrics" ? "cover" : "lyrics")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-300"
              style={{
                background: activeView === "lyrics" ? "rgba(196,168,130,0.18)" : "rgba(255,255,255,0.06)",
                border: activeView === "lyrics" ? "1px solid rgba(196,168,130,0.35)" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Mic2 size={14} style={{ color: activeView === "lyrics" ? "#c4a882" : "rgba(255,255,255,0.45)" }} />
              <span className="text-xs font-medium" style={{ color: activeView === "lyrics" ? "#c4a882" : "rgba(255,255,255,0.45)", fontFamily: "Inter" }}>
                Lyrics
              </span>
            </button>
          </div>
        </div>

        {/* ── Art / Lyrics ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden px-8">
          <p className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-zinc-700 pointer-events-none" style={{ fontFamily: "Inter", letterSpacing: "0.1em" }}>
            {activeView === "cover" ? "↑ tap Lyrics or swipe up" : "↓ swipe down for cover"}
          </p>

          {/* Cover */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-7"
            style={{
              opacity: activeView === "cover" ? 1 : 0,
              transform: activeView === "cover" ? "translateY(0)" : "translateY(-30px)",
              transition: "all 0.4s ease",
              pointerEvents: activeView === "cover" ? "auto" : "none",
            }}
          >
            <VinylDisc spinning={isPlaying} size={220} />
            <div className="text-center px-6">
              <h2 className="text-3xl text-amber-50 leading-tight mb-2" style={{ fontFamily: "Playfair Display" }}>
                {currentSong.title}
              </h2>
              <p className="text-zinc-500 text-sm" style={{ fontFamily: "Inter" }}>
                {currentSong.artist || "Jagjit Singh"}
              </p>
              {videoVisible && hasVideo && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[11px] text-amber-400/70" style={{ fontFamily: "Inter" }}>Video playing in corner</span>
                </div>
              )}
            </div>
          </div>

          {/* Lyrics */}
          <div
            className="absolute inset-0"
            style={{
              opacity: activeView === "lyrics" ? 1 : 0,
              transform: activeView === "lyrics" ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.4s ease",
              pointerEvents: activeView === "lyrics" ? "auto" : "none",
            }}
          >
            <div className="text-center pt-6 pb-2">
              <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(196,168,130,0.35)", fontFamily: "Inter" }}>
                {currentSong.title}
              </p>
            </div>
            <LyricsPanel lyrics={lyrics} elapsed={elapsed} />
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="relative z-10 flex-shrink-0 px-8 pb-14">
          {/* Song info + like */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex-1 min-w-0">
              {activeView === "lyrics" && (
                <>
                  <p className="text-base text-amber-50 truncate" style={{ fontFamily: "Playfair Display" }}>{currentSong.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5" style={{ fontFamily: "Inter" }}>{currentSong.artist || "Jagjit Singh"}</p>
                </>
              )}
            </div>
            <button onClick={() => toggleLike(currentSong.title)} className="ml-4 flex-shrink-0">
              <Heart size={22} style={{ color: isLiked ? "#e05454" : "rgba(255,255,255,0.25)", fill: isLiked ? "#e05454" : "none", transition: "all 0.25s" }} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div
              ref={progressBarRef}
              className="relative w-full h-1 rounded-full cursor-pointer group"
              style={{ background: "rgba(255,255,255,0.08)" }}
              onClick={handleProgressClick}
            >
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7a5a30, #c4a882)" }} />
              <div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-amber-200 opacity-0 group-hover:opacity-100 -translate-y-1/2 transition-opacity pointer-events-none"
                style={{ left: `${progress}%`, transform: "translateX(-50%) translateY(-50%)" }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-zinc-600" style={{ fontFamily: "Inter" }}>{formatTime(elapsed)}</span>
              <span className="text-[11px] text-zinc-600" style={{ fontFamily: "Inter" }}>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-between mb-7">
            <button
              onClick={() => setShuffle(s => !s)}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
              style={{ color: shuffle ? "#c4a882" : "rgba(255,255,255,0.2)" }}
            >
              <Shuffle size={17} />
            </button>

            <div className="flex items-center gap-7">
              <button onClick={handlePrev} className="text-zinc-400 hover:text-white transition-colors duration-200">
                <SkipBack size={26} />
              </button>
              <button
                onClick={() => setIsPlaying(p => !p)}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #d4b896, #c4a882)", boxShadow: "0 0 30px rgba(196,168,130,0.25)" }}
              >
                {isPlaying
                  ? <Pause size={26} color="#0d0804" />
                  : <Play  size={26} color="#0d0804" style={{ marginLeft: 3 }} />
                }
              </button>
              <button onClick={handleNext} className="text-zinc-400 hover:text-white transition-colors duration-200">
                <SkipForward size={26} />
              </button>
            </div>

            <button
              onClick={() => setRepeat(r => !r)}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
              style={{ color: repeat ? "#c4a882" : "rgba(255,255,255,0.2)" }}
            >
              <Repeat size={17} />
            </button>
          </div>

          {/* Volume — wired to context setVolume → actual YT player */}
          <div className="flex items-center gap-3">
            <button onClick={handleMuteToggle} className="text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0">
              {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <div className="flex-1 relative h-1 rounded-full cursor-pointer" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{ width: `${muted ? 0 : volume}%`, background: "rgba(196,168,130,0.45)" }} />
              <input
                type="range" min={0} max={100} value={muted ? 0 : volume}
                onChange={e => handleVolumeChange(+e.target.value)}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ height: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MINI BAR
      ═══════════════════════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 w-full z-[998]"
        style={{
          transform: expanded ? "translateY(100%)" : "translateY(0)",
          transition: "transform 0.48s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, #110b05, #0e0905, #0a0804)",
          borderTop: "1px solid rgba(196,168,130,0.1)",
        }} />
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{
          background: "linear-gradient(to right, transparent, rgba(196,168,130,0.3), transparent)",
        }} />

        {/* Progress line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="h-full" style={{ width: `${progress}%`, background: "linear-gradient(90deg, rgba(122,90,48,0.6), rgba(196,168,130,0.8))", transition: "width 1s linear" }} />
        </div>

        <div className="relative flex items-center gap-4 px-5 py-3 cursor-pointer" onClick={() => setExpanded(true)}>
          {/* Mini vinyl */}
          <div
            className="w-11 h-11 rounded-full flex-shrink-0 relative"
            style={{
              background: "conic-gradient(from 0deg, #1c1410, #2e2018 90deg, #120e0a 180deg, #221a12 270deg)",
              animation: isPlaying ? "vinylSpin 4s linear infinite" : "none",
              boxShadow: "0 0 0 1px #3a2e1e, 0 0 12px rgba(196,168,130,0.08)",
            }}
          >
            <div className="absolute rounded-full" style={{ width: "36%", height: "36%", top: "32%", left: "32%", background: "radial-gradient(circle, #d4b896, #7a5a30)" }} />
          </div>

          {/* Song info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-200 truncate" style={{ fontFamily: "Playfair Display" }}>{currentSong.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-zinc-600 truncate" style={{ fontFamily: "Inter" }}>{currentSong.artist || "Jagjit Singh"}</p>
              <WaveformBars playing={isPlaying} />
            </div>
          </div>

          {/* Mini controls */}
          <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
            <button onClick={() => toggleLike(currentSong.title)}>
              <Heart size={16} style={{ color: isLiked ? "#e05454" : "rgba(255,255,255,0.2)", fill: isLiked ? "#e05454" : "none", transition: "all 0.2s" }} />
            </button>

            {hasVideo && (
              <button
                onClick={toggleVideo}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: videoVisible ? "rgba(196,168,130,0.2)" : "rgba(255,255,255,0.06)",
                  border: videoVisible ? "1px solid rgba(196,168,130,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  color: videoVisible ? "#c4a882" : "rgba(255,255,255,0.35)",
                }}
              >
                <Tv2 size={13} />
              </button>
            )}

            <button onClick={handlePrev} className="text-zinc-600 hover:text-zinc-300 transition-colors">
              <SkipBack size={16} />
            </button>

            <button
              onClick={() => setIsPlaying(p => !p)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #d4b896, #c4a882)" }}
            >
              {isPlaying
                ? <Pause size={14} color="#0d0804" />
                : <Play  size={14} color="#0d0804" style={{ marginLeft: 1 }} />
              }
            </button>

            <button onClick={handleNext} className="text-zinc-600 hover:text-zinc-300 transition-colors">
              <SkipForward size={16} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setDismissed(true) }}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ml-1"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
