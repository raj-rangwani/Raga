// src/pages/MehfilList.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import AmbientEffects from "../components/AmbientEffects"
import { MEHFILS } from "../data/mehfils"
import { db } from "../utils/firebase"
import { collection, onSnapshot, doc } from "firebase/firestore"
import { Users, Music2, Radio } from "lucide-react"

// ── Live listener count from Firestore ───────────────────────
function useLiveListeners(mehfilId) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "mehfils", mehfilId, "listeners"),
      snap => setCount(snap.size)
    )
    return () => unsub()
  }, [mehfilId])
  return count
}

// ── Live now playing from Firestore ──────────────────────────
function useLiveNowPlaying(mehfilId) {
  const [song, setSong] = useState(null)
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "mehfils", mehfilId, "state", "currentSong"),
      snap => setSong(snap.exists() ? snap.data() : null)
    )
    return () => unsub()
  }, [mehfilId])
  return song
}

// ── Mehfil card ───────────────────────────────────────────────
function MehfilCard({ mehfil }) {
  const navigate   = useNavigate()
  const listeners  = useLiveListeners(mehfil.id)
  const nowPlaying = useLiveNowPlaying(mehfil.id)
  const Icon       = mehfil.icon

  return (
    <div
      onClick={() => navigate(`/mehfil/${mehfil.id}`)}
      className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:scale-[1.02]"
      style={{
        background: mehfil.cardBg,
        border: `1px solid ${mehfil.color}18`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        minHeight: 280,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 8px 60px ${mehfil.color}20, 0 0 0 1px ${mehfil.color}30`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.4)"
      }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${mehfil.color}10 0%, transparent 60%)` }} />

      {/* Live badge */}
      {listeners > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full z-10"
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Inter" }}>LIVE</span>
        </div>
      )}

      <div className="relative z-10 p-7 flex flex-col h-full" style={{ minHeight: 280 }}>
        {/* Icon + mood */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: mehfil.color + "15", border: `1px solid ${mehfil.color}25` }}>
            <Icon size={22} style={{ color: mehfil.color }} />
          </div>
          <span className="text-[10px] px-3 py-1 rounded-full tracking-wider uppercase"
            style={{
              background: mehfil.color + "12",
              color: mehfil.color + "90",
              border: `1px solid ${mehfil.color}18`,
              fontFamily: "Inter",
            }}>
            {mehfil.mood}
          </span>
        </div>

        <h2 className="text-2xl text-amber-50 mb-1" style={{ fontFamily: "Playfair Display" }}>
          {mehfil.name}
        </h2>
        <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "serif" }}>
          {mehfil.urdu}
        </p>
        <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Inter" }}>
          {mehfil.tagline}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {mehfil.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.07)",
                fontFamily: "Inter",
              }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats + enter */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users size={12} style={{ color: mehfil.color + "70" }} />
              <span className="text-xs" style={{ color: mehfil.color, fontFamily: "Inter" }}>
                {listeners > 0 ? listeners : mehfil.listeners} listening
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Music2 size={12} style={{ color: "rgba(255,255,255,0.2)" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}>
                {mehfil.queueCount} in queue
              </span>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
            style={{ background: mehfil.color, color: "#0a0804", fontFamily: "Inter" }}
          >
            <Radio size={11} />
            Enter
          </div>
        </div>

        {/* Now playing strip */}
        {(nowPlaying?.title || mehfil.nowPlaying) && (
          <div className="mt-3 pt-3 flex items-center gap-2"
            style={{ borderTop: `1px solid ${mehfil.color}12` }}>
            <div className="flex items-end gap-[2px]">
              {[3,6,4,7,5].map((h,i) => (
                <div key={i} className="w-[2px] rounded-full"
                  style={{
                    height: listeners > 0 ? `${h}px` : "2px",
                    background: mehfil.color,
                    transition: "height 0.3s ease",
                    animation: listeners > 0
                      ? `waveBar ${0.5 + i*0.1}s ease-in-out ${i*0.08}s infinite alternate`
                      : "none",
                  }} />
              ))}
            </div>
            <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Inter" }}>
              {nowPlaying?.title && nowPlaying.title !== "Waiting for first request..."
                ? `${nowPlaying.title}${nowPlaying.artist ? ` — ${nowPlaying.artist}` : ""}`
                : mehfil.nowPlaying}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function MehfilList() {
  return (
    <div className="min-h-screen text-white pb-32 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0d0905 0%, #080808 50%, #050810 100%)" }}
    >
      <AmbientEffects glow glowColor="rgba(196,168,130,0.04)" particles particleColor="rgba(196,168,130," />
      <div className="relative z-10">
        <Navbar />
        <div className="px-6 md:px-10 pt-8 mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "rgba(196,168,130,0.5)", fontFamily: "Inter" }}>
            Live Rooms
          </p>
          <h1 className="text-5xl md:text-6xl text-amber-100 tracking-wide mb-4"
            style={{ fontFamily: "Playfair Display" }}>
            Choose Your Mehfil
          </h1>
          <p className="text-zinc-500 text-base leading-loose max-w-2xl" style={{ fontFamily: "Inter" }}>
            Enter a live gathering. Listen together. Send your chitthi and request a song for the ustaad.
          </p>
        </div>
        <div className="px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {MEHFILS.map(mehfil => (
            <MehfilCard key={mehfil.id} mehfil={mehfil} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3) }
          to   { transform: scaleY(1) }
        }
      `}</style>
    </div>
  )
}
