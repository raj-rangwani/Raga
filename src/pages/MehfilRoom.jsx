// src/pages/MehfilRoom.jsx
import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMehfilById } from "../data/mehfils"
import { useMehfil } from "../utils/useMehfil"
import { useMusicPlayer } from "../components/MusicPlayerContext"
import MehfilPlayer from "../components/MehfilPlayer"
import {
  ArrowLeft, Users, Music2, Send, ThumbsUp,
  Play, Pause, SkipForward, Radio, Search,
  Loader2, Crown, Sparkles, X
} from "lucide-react"
import { searchSong } from "../utils/youtube"

const REACTIONS = ["🔥", "💛", "😭", "✨", "🙏", "❤️"]

function FloatingEmoji({ emoji, left }) {
  return (
    <div className="pointer-events-none select-none fixed text-3xl"
      style={{ bottom: 110, left: `${left}%`, zIndex: 9999, animation: "mehfilFloat 2.2s ease-out forwards" }}>
      {emoji}
    </div>
  )
}

function Tasveer({ color }) {
  return (
    <div className="flex items-center justify-center gap-3 my-1" aria-hidden="true">
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to right, transparent, ${color}40)` }} />
      <Sparkles size={11} style={{ color: color + "60" }} />
      <div className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(to left, transparent, ${color}40)` }} />
    </div>
  )
}

function MehfilVinyl({ spinning, size = 200, color }) {
  return (
    <div className="relative rounded-full flex items-center justify-center"
      style={{
        width: size, height: size,
        background: "conic-gradient(from 0deg,#1c1410 0deg,#2e2018 40deg,#120e0a 80deg,#221a12 120deg,#1c1410 160deg,#2e2018 200deg,#120e0a 240deg,#1c1410 280deg,#221a12 320deg,#1c1410 360deg)",
        boxShadow: `0 0 0 2px #3a2e1e,0 0 0 5px #1a1008,0 18px 60px rgba(0,0,0,0.85),0 0 60px ${color}1a`,
        animation: spinning ? "mehfilVinyl 5s linear infinite" : "none",
        flexShrink: 0,
      }}
    >
      {[0.78,0.64,0.52,0.40].map((r,i) => (
        <div key={i} className="absolute rounded-full"
          style={{ width:`${r*100}%`,height:`${r*100}%`,border:"1px solid rgba(196,168,130,0.06)" }} />
      ))}
      <div className="absolute rounded-full flex items-center justify-center"
        style={{
          width: size*0.30, height: size*0.30,
          background:`radial-gradient(circle at 35% 35%,${color}dd,${color}50)`,
          boxShadow:"inset 0 2px 6px rgba(0,0,0,0.5)",
        }}>
        <div className="rounded-full bg-black/60" style={{ width:size*0.07,height:size*0.07 }} />
      </div>
    </div>
  )
}

function WaveBars({ playing, color, count = 14 }) {
  const heights = [3,7,11,6,13,5,10,7,12,4,9,6,8,5]
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 18 }}>
      {Array.from({length: count}).map((_,i) => (
        <div key={i} className="rounded-full" style={{
          width: 2.5,
          height: playing ? `${heights[i%heights.length]}px` : "2px",
          background: color,
          transition: "height 0.2s ease",
          animation: playing ? `mehfilWave ${0.5+(i%4)*0.13}s ${i*0.05}s ease-in-out infinite alternate` : "none",
        }} />
      ))}
    </div>
  )
}

function ChitthiPanel({ onRequest, accentColor, onClose }) {
  const [query,   setQuery]   = useState("")
  const [artist,  setArtist]  = useState("")
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const r = await searchSong(query.trim(), artist.trim() || query.trim())
      r ? setResult(r) : setError("Not found — try a different title.")
    } catch { setError("Search failed. Check YouTube API key.") }
    finally   { setLoading(false) }
  }

  const submit = () => {
    if (!result) return
    onRequest(result.title, artist.trim() || "", result.videoId, result.thumbnail)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center"
      style={{ background:"rgba(0,0,0,0.72)", backdropFilter:"blur(14px)" }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-[28px] p-6 pb-9 relative"
        style={{
          background:"linear-gradient(165deg,#1c1309 0%,#120d07 55%,#0c0a08 100%)",
          border:"1px solid rgba(196,168,130,0.14)",
          borderBottom:"none",
          boxShadow:"0 -20px 60px rgba(0,0,0,0.6)",
        }}
        onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-20 pointer-events-none"
          style={{ background:`radial-gradient(ellipse,${accentColor}10 0%,transparent 70%)`,filter:"blur(20px)" }} />
        <div className="w-10 h-1 rounded-full bg-white/10 mx-auto mb-5 relative z-10" />
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div>
            <p className="text-[10px] tracking-[0.32em] uppercase mb-1"
              style={{ color:accentColor+"80",fontFamily:"Inter" }}>Send a Chitthi</p>
            <p className="text-sm" style={{ color:"rgba(255,255,255,0.35)",fontFamily:"Playfair Display",fontStyle:"italic" }}>
              "ek geet, sabke liye"
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ color:"rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.04)" }}>
            <X size={15} />
          </button>
        </div>
        <div className="flex gap-2 mb-3 relative z-10">
          <input autoFocus value={query} onChange={e=>setQuery(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&search()}
            placeholder="Song title..."
            className="flex-1 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none"
            style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",fontFamily:"Inter" }}
          />
          <input value={artist} onChange={e=>setArtist(e.target.value)}
            placeholder="Artist"
            className="w-32 rounded-2xl px-3 py-3 text-sm text-white placeholder-zinc-600 outline-none"
            style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",fontFamily:"Inter" }}
          />
          <button onClick={search} disabled={loading||!query.trim()}
            className="w-12 rounded-2xl flex items-center justify-center disabled:opacity-40 flex-shrink-0"
            style={{ background:accentColor+"1f",border:`1px solid ${accentColor}40`,color:accentColor }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </div>
        {error && <p className="text-xs text-red-400/70 mb-3 relative z-10" style={{fontFamily:"Inter"}}>{error}</p>}
        {result && (
          <div className="flex items-center gap-3 p-3 rounded-2xl mb-3 relative z-10"
            style={{ background:accentColor+"12",border:`1px solid ${accentColor}25` }}>
            {result.thumbnail && <img src={result.thumbnail} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" alt="" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-100 truncate" style={{fontFamily:"Playfair Display"}}>{result.title}</p>
              <p className="text-xs text-zinc-500 mt-0.5" style={{fontFamily:"Inter"}}>{result.channelTitle} · {result.duration}</p>
            </div>
            <button onClick={submit}
              className="px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 flex-shrink-0 transition-all"
              style={{ background:accentColor,color:"#0a0804",fontFamily:"Inter" }}>
              Request
            </button>
          </div>
        )}
        {!result && !loading && query.trim() && (
          <button onClick={()=>{onRequest(query.trim(),artist.trim(),null,null);onClose()}}
            className="w-full py-3 rounded-2xl text-sm hover:opacity-80 relative z-10"
            style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",
                     color:"rgba(255,255,255,0.4)",fontFamily:"Inter" }}>
            Request without searching (no video)
          </button>
        )}
      </div>
    </div>
  )
}

function QueueRow({ item, onVote, onPlayNow, isHost, accentColor, index }) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl group transition-all hover:bg-white/[0.03]"
      style={{ border:"1px solid rgba(255,255,255,0.045)" }}>
      <span className="text-[11px] w-4 text-center flex-shrink-0"
        style={{ color:"rgba(255,255,255,0.18)",fontFamily:"Inter" }}>{index+1}</span>
      {item.thumbnail
        ? <img src={item.thumbnail} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" alt="" />
        : <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:accentColor+"12" }}>
            <Music2 size={15} style={{ color:accentColor+"70" }} />
          </div>
      }
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ color:"rgba(255,255,255,0.82)",fontFamily:"Playfair Display" }}>{item.songName}</p>
        <p className="text-[11px] truncate mt-0.5" style={{ color:"rgba(255,255,255,0.25)",fontFamily:"Inter" }}>
          {item.artist?`${item.artist} · `:""} by {item.requestedBy}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {isHost && item.videoId && (
          <button onClick={()=>onPlayNow(item)}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background:accentColor+"22",color:accentColor }} title="Play now">
            <Play size={11} />
          </button>
        )}
        <button onClick={()=>onVote(item.id,item.votes)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:scale-105 transition-all"
          style={{ background:accentColor+"12",border:`1px solid ${accentColor}22` }}>
          <ThumbsUp size={10} style={{ color:accentColor }} />
          <span className="text-[11px]" style={{ color:accentColor,fontFamily:"Inter" }}>{item.votes||1}</span>
        </button>
      </div>
    </div>
  )
}

function NameGate({ mehfil, onEnter }) {
  const [name, setName] = useState(localStorage.getItem("raga_username") || "")
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background:mehfil.bg||"#080605" }}>
      <div className="absolute pointer-events-none"
        style={{ top:"-15%",left:"50%",transform:"translateX(-50%)",width:"70vw",height:"60vh",
                 background:`radial-gradient(ellipse,${mehfil.color}10 0%,transparent 70%)`,filter:"blur(50px)" }} />
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background:mehfil.color+"18",border:`1px solid ${mehfil.color}28`,boxShadow:`0 0 40px ${mehfil.color}15` }}>
            <mehfil.icon size={28} style={{ color:mehfil.color }} />
          </div>
          <p className="text-[11px] tracking-[0.35em] uppercase mb-3"
            style={{ color:mehfil.color+"75",fontFamily:"Inter" }}>You are entering</p>
          <h2 className="text-4xl text-amber-50 mb-2 leading-tight" style={{ fontFamily:"Playfair Display" }}>{mehfil.name}</h2>
          <p className="text-zinc-500 text-base mb-3" style={{ fontFamily:"serif" }}>{mehfil.urdu}</p>
          <Tasveer color={mehfil.color} />
          <p className="text-zinc-600 text-sm mt-3 leading-relaxed max-w-xs mx-auto italic" style={{ fontFamily:"Playfair Display" }}>
            {mehfil.tagline}
          </p>
        </div>
        <div className="rounded-[24px] p-6" style={{ background:"rgba(255,255,255,0.035)",border:"1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-sm text-zinc-400 mb-4 text-center" style={{ fontFamily:"Inter" }}>What should we call you?</p>
          <input autoFocus value={name} onChange={e=>setName(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&name.trim()&&onEnter(name.trim())}
            placeholder="Your name..."
            className="w-full rounded-2xl px-4 py-3 text-white placeholder-zinc-600 outline-none mb-3 text-center"
            style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
                     fontFamily:"Playfair Display",fontSize:"1.05rem" }}
          />
          <button onClick={()=>name.trim()&&onEnter(name.trim())} disabled={!name.trim()}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
            style={{ background:mehfil.color,color:"#0a0804",fontFamily:"Inter",boxShadow:`0 8px 30px ${mehfil.color}25` }}>
            Enter the Mehfil
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Calculate how many seconds into the song we currently are ─
function calcSeekOffset(currentSong) {
  if (!currentSong?.startedAt || !currentSong?.videoId) return 0
  if (currentSong.paused) return currentSong.elapsedSec || 0

  // startedAt is a Firestore Timestamp
  const startMs = currentSong.startedAt?.toDate?.()?.getTime?.()
                  ?? currentSong.startedAt?.seconds * 1000
                  ?? Date.now()
  const baseElapsed = currentSong.elapsedSec || 0
  const elapsed = baseElapsed + Math.floor((Date.now() - startMs) / 1000)
  return Math.max(0, elapsed)
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function MehfilRoom() {
  const { mehfilId } = useParams()
  const navigate     = useNavigate()
  const mehfil       = getMehfilById(mehfilId)

  const { setIsPlaying: pausePersonal, currentSong: personalSong } = useMusicPlayer()
  useEffect(() => { if (personalSong) pausePersonal(false) }, [])

  const [userName,    setUserName]    = useState(localStorage.getItem("raga_username") || "")
  const [joined,      setJoined]      = useState(false)
  const [isPlayingLocal, setIsPlayingLocal] = useState(false)
  const [showChitthi, setShowChitthi] = useState(false)
  const [showQueue,   setShowQueue]   = useState(false)
  const [floats,      setFloats]      = useState([])

  const mehfilPlayerRef = useRef(null)
  const isHost = userName.toLowerCase() === "host"
  const accentColor = mehfil?.color || "#c4a882"

  const {
    currentSong, queue, listeners, loading, error,
    joinMehfil, leaveMehfil, sendChitthi,
    voteForSong, playNextSong, playRandomFromQueue,
    resumeIfPaused, userId,
  } = useMehfil(joined ? mehfilId : null, userName)

  const handleEnter = (name) => {
    localStorage.setItem("raga_username", name)
    setUserName(name)
    setJoined(true)
  }

  useEffect(() => {
    if (!joined) return
    joinMehfil().then(() => {
      // After joining, resume the room if it was paused due to being empty
      resumeIfPaused()
    })
    return () => { leaveMehfil() }
  }, [joined])

  // Keep local playing state in sync with Firestore paused flag
  useEffect(() => {
    if (!currentSong) return
    if (currentSong.videoId) {
      setIsPlayingLocal(!currentSong.paused)
    } else {
      setIsPlayingLocal(false)
    }
  }, [currentSong?.videoId, currentSong?.paused])

  const togglePlay = () => {
    const p = mehfilPlayerRef.current
    if (!p) return
    if (isPlayingLocal) { try { p.pauseVideo() } catch {} ; setIsPlayingLocal(false) }
    else                { try { p.playVideo()  } catch {} ; setIsPlayingLocal(true)  }
  }

  const handleSkip = async () => {
    setIsPlayingLocal(false)
    await playRandomFromQueue()
  }

  const handleEnded = useCallback(async () => {
    setIsPlayingLocal(false)
    await playRandomFromQueue()
  }, [playRandomFromQueue])

  const handleReady = useCallback((player) => {
    mehfilPlayerRef.current = player
  }, [])

  const handleQueuePlay = (item) => {
    playNextSong(item.videoId, item.songName, item.artist, item.id, item.requestedBy, item.thumbnail)
  }

  const fireReaction = (emoji) => {
    const id   = Date.now()
    const left = 15 + Math.random() * 70
    setFloats(f => [...f, { emoji, id, left }])
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 2400)
  }

  // Calculate seek offset for joining mid-song
  const seekOffset = currentSong ? calcSeekOffset(currentSong) : 0

  if (!mehfil) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#080605" }}>
      <p className="text-zinc-500" style={{ fontFamily:"Inter" }}>Mehfil not found.</p>
    </div>
  )

  if (!joined) return <NameGate mehfil={mehfil} onEnter={handleEnter} />

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden"
      style={{ background:mehfil.bg||"#080605" }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ background:`radial-gradient(ellipse at 50% -10%,${accentColor}12 0%,transparent 55%)` }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
               backgroundSize:"200px 200px" }} />

      {/* Hidden audio — seekTo and paused are the key new props */}
      {currentSong?.videoId && (
        <MehfilPlayer
          videoId={currentSong.videoId}
          seekTo={seekOffset}
          paused={currentSong.paused || false}
          onEnded={handleEnded}
          onReady={handleReady}
        />
      )}

      {floats.map(f => <FloatingEmoji key={f.id} emoji={f.emoji} left={f.left} />)}

      {showChitthi && (
        <ChitthiPanel
          accentColor={accentColor}
          onClose={() => setShowChitthi(false)}
          onRequest={(songName, artist, videoId, thumbnail) => sendChitthi(songName, artist, videoId, thumbnail)}
        />
      )}

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-5 py-4"
        style={{ background:"rgba(8,5,4,0.55)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${accentColor}14` }}>
        <button onClick={() => { leaveMehfil(); navigate("/mehfil") }}
          className="flex items-center gap-2 transition-colors"
          style={{ color:"rgba(255,255,255,0.35)",fontFamily:"Inter",fontSize:14 }}
          onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.7)"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.35)"}>
          <ArrowLeft size={17} />
          Leave
        </button>
        <div className="text-center">
          <h1 className="text-lg text-amber-100 leading-tight" style={{ fontFamily:"Playfair Display" }}>{mehfil.name}</h1>
          <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color:accentColor+"70",fontFamily:"Inter" }}>{mehfil.mood}</p>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full"
          style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#ef4444" }} />
          <Users size={12} style={{ color:accentColor+"80" }} />
          <span className="text-xs tabular-nums" style={{ color:accentColor,fontFamily:"Inter" }}>{listeners.length}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto pb-48 relative z-10" style={{ scrollbarWidth:"none" }}>
        <div className="max-w-lg mx-auto px-5 pt-8">

          {error && (
            <div className="mb-5 px-4 py-3 rounded-2xl text-sm text-red-400/70"
              style={{ background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.12)",fontFamily:"Inter" }}>
              {error}
            </div>
          )}

          {loading
            ? <div className="flex justify-center py-24">
                <Loader2 size={28} className="animate-spin" style={{ color:accentColor+"50" }} />
              </div>
            : <>
                {/* NOW PLAYING */}
                <div className="flex flex-col items-center pt-2 pb-8">
                  <p className="text-[10px] tracking-[0.35em] uppercase mb-6"
                    style={{ color:"rgba(255,255,255,0.18)",fontFamily:"Inter" }}>
                    {currentSong?.videoId ? "Now playing in the mehfil" : "The mehfil awaits"}
                  </p>

                  {currentSong?.videoId ? (
                    <>
                      <div className="relative mb-7">
                        {currentSong.thumbnail
                          ? <div className="relative">
                              <img src={currentSong.thumbnail} alt={currentSong.title}
                                className="w-56 h-56 rounded-[28px] object-cover"
                                style={{ boxShadow:`0 24px 70px ${accentColor}20,0 0 0 1px ${accentColor}1a` }}
                              />
                              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 rounded-tl-xl"
                                style={{ borderColor:accentColor+"50" }} />
                              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 rounded-br-xl"
                                style={{ borderColor:accentColor+"50" }} />
                            </div>
                          : <MehfilVinyl spinning={isPlayingLocal} size={208} color={accentColor} />
                        }
                        {isPlayingLocal && (
                          <div className="absolute inset-0 rounded-[28px] pointer-events-none"
                            style={{ boxShadow:`0 0 50px ${accentColor}35`,animation:"mehfilPulse 2.5s ease-in-out infinite" }} />
                        )}
                      </div>

                      <div className="text-center mb-3 px-4">
                        <h2 className="text-[1.7rem] text-amber-50 leading-snug mb-1.5"
                          style={{ fontFamily:"Playfair Display" }}>{currentSong.title}</h2>
                        <p className="text-sm text-zinc-500" style={{ fontFamily:"Inter" }}>{currentSong.artist}</p>
                        {currentSong.requestedBy && (
                          <p className="text-[11px] mt-2" style={{ color:accentColor+"80",fontFamily:"Inter",letterSpacing:"0.05em" }}>
                            requested by {currentSong.requestedBy}
                          </p>
                        )}
                      </div>

                      <Tasveer color={accentColor} />

                      <div className="my-4">
                        <WaveBars playing={isPlayingLocal} color={accentColor} />
                      </div>

                      {/* Host controls only */}
                      {isHost ? (
                        <div className="flex items-center gap-5 mt-2">
                          <button onClick={togglePlay}
                            className="w-[68px] h-[68px] rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                            style={{ background:`linear-gradient(135deg,${accentColor}dd,${accentColor})`,boxShadow:`0 0 35px ${accentColor}40` }}>
                            {isPlayingLocal
                              ? <Pause size={27} color="#0a0804" />
                              : <Play  size={27} color="#0a0804" style={{ marginLeft:2 }} />
                            }
                          </button>
                          <button onClick={handleSkip}
                            className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                            style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.45)" }}>
                            <SkipForward size={20} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-[12px] mt-1"
                          style={{ color:"rgba(255,255,255,0.3)",fontFamily:"Playfair Display",fontStyle:"italic" }}>
                          {isPlayingLocal ? "playing for everyone, right now" : "paused by the host"}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center py-8 gap-5">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center"
                        style={{ background:accentColor+"0d",border:`1px solid ${accentColor}1a` }}>
                        <Radio size={34} style={{ color:accentColor+"45" }} />
                      </div>
                      <div className="text-center px-8">
                        <p className="text-zinc-500 text-base mb-2" style={{ fontFamily:"Playfair Display",fontStyle:"italic" }}>
                          "khaali mehfil, sirf intezaar..."
                        </p>
                        <p className="text-zinc-700 text-xs" style={{ fontFamily:"Inter" }}>
                          Send a chitthi below to start the music
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* LISTENERS */}
                {listeners.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[10px] tracking-[0.3em] uppercase mb-3"
                      style={{ color:"rgba(255,255,255,0.18)",fontFamily:"Inter" }}>In this mehfil</p>
                    <div className="flex flex-wrap gap-2">
                      {listeners.map(l => (
                        <span key={l.id} className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full"
                          style={{
                            background: l.id===userId ? accentColor+"18" : "rgba(255,255,255,0.04)",
                            border:`1px solid ${l.id===userId ? accentColor+"30" : "rgba(255,255,255,0.06)"}`,
                            color: l.id===userId ? accentColor : "rgba(255,255,255,0.35)",
                            fontFamily:"Inter",
                          }}>
                          {l.name?.toLowerCase()==="host"&&<Crown size={10}/>}
                          {l.name}{l.id===userId&&" (you)"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* QUEUE */}
                <div className="mb-4">
                  <button onClick={() => setShowQueue(v=>!v)}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-[20px] transition-all"
                    style={{ background:"rgba(255,255,255,0.035)",border:"1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-2.5">
                      <Music2 size={15} style={{ color:accentColor+"80" }} />
                      <span className="text-sm" style={{ color:"rgba(255,255,255,0.55)",fontFamily:"Inter" }}>Up next</span>
                      {queue.length>0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background:accentColor+"20",color:accentColor,fontFamily:"Inter" }}>
                          {queue.length}
                        </span>
                      )}
                    </div>
                    <span style={{ color:"rgba(255,255,255,0.2)",fontSize:11,fontFamily:"Inter" }}>
                      {showQueue?"hide":"show"}
                    </span>
                  </button>
                  {showQueue && (
                    <div className="space-y-1.5 mt-2">
                      {queue.length===0
                        ? <p className="text-center text-zinc-700 text-sm py-6 italic" style={{ fontFamily:"Playfair Display" }}>
                            no requests yet — be the first
                          </p>
                        : queue.map((item,i) => (
                            <QueueRow key={item.id} item={item} index={i}
                              onVote={voteForSong} onPlayNow={handleQueuePlay}
                              isHost={isHost} accentColor={accentColor} />
                          ))
                      }
                    </div>
                  )}
                </div>
              </>
          }
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40"
        style={{ background:"linear-gradient(to top,rgba(5,3,2,0.92),rgba(5,3,2,0.75))",
                 backdropFilter:"blur(24px)",borderTop:`1px solid ${accentColor}14` }}>
        <div className="max-w-lg mx-auto px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-1">
              {REACTIONS.map(emoji => (
                <button key={emoji} onClick={()=>fireReaction(emoji)}
                  className="text-xl w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 active:scale-90 transition-all">
                  {emoji}
                </button>
              ))}
            </div>
            <button onClick={()=>setShowChitthi(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-105 flex-shrink-0 transition-all"
              style={{ background:`linear-gradient(135deg,${accentColor}ee,${accentColor})`,
                       color:"#0a0804",fontFamily:"Inter",boxShadow:`0 6px 24px ${accentColor}35` }}>
              <Send size={14} />
              Chitthi
            </button>
          </div>
          <p className="text-center text-[10px] mt-2.5" style={{ color:"rgba(255,255,255,0.18)",fontFamily:"Inter" }}>
            you are <span style={{ color:isHost?accentColor:"rgba(255,255,255,0.35)" }}>{userName}</span>
            {isHost&&<span style={{ color:accentColor }}> · host</span>}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes mehfilFloat  { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-170px) scale(1.3)} }
        @keyframes mehfilVinyl  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes mehfilWave   { from{transform:scaleY(0.25)} to{transform:scaleY(1)} }
        @keyframes mehfilPulse  { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
    </div>
  )
}