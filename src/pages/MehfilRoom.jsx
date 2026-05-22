import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useMusicPlayer } from "../components/MusicPlayerContext"
import {
  Users, Music, Send, ChevronLeft,
  Play, Pause, SkipForward, Hash, Clock,
  MicVocal, Heart, Volume2
} from "lucide-react"

const MEHFIL_DATA = {
  "shab-e-tarab": {
    name: "Shab-e-Tarab",
    urdu: "شبِ طرب",
    tagline: "Night of ecstasy — where every ghazal is a confession",
    mood: "Soulful",
    color: "#c4a882",
    glow: "rgba(196,168,130,0.15)",
    bg: "radial-gradient(ellipse at 20% 30%, #180e04 0%, #0a0804 100%)",
    initialQueue: [
      { id: 1, song: "Aaj Jaane Ki Zid Na Karo", artist: "Farida Khanum", user: "Raza_M", token: 1, liked: 12 },
      { id: 2, song: "Yeh Dil Yeh Pagal Dil Mera", artist: "Mehdi Hassan", user: "Aisha_K", token: 2, liked: 7 },
      { id: 3, song: "Abhi Na Jao Chhod Kar", artist: "Asha Bhosle", user: "Tariq_B", token: 3, liked: 5 },
    ],
  },
  "dard-ki-raat": {
    name: "Dard Ki Raat",
    urdu: "دردکی رات",
    tagline: "Where grief becomes music and music becomes prayer",
    mood: "Melancholic",
    color: "#8ba9c4",
    glow: "rgba(139,169,196,0.15)",
    bg: "radial-gradient(ellipse at 20% 30%, #040810 0%, #060608 100%)",
    initialQueue: [
      { id: 1, song: "Tum Nahin Aaye", artist: "Mehdi Hassan", user: "Sufi_Soul", token: 1, liked: 9 },
      { id: 2, song: "Dil Dhoondta Hai", artist: "Bhupinder Singh", user: "NightOwl", token: 2, liked: 6 },
    ],
  },
  "josh-e-rang": {
    name: "Josh-e-Rang",
    urdu: "جوشِ رنگ",
    tagline: "Qawwali fire — the room is spinning and no one wants to stop",
    mood: "Ecstatic",
    color: "#c47c5a",
    glow: "rgba(196,124,90,0.15)",
    bg: "radial-gradient(ellipse at 20% 30%, #150602 0%, #090505 100%)",
    initialQueue: [
      { id: 1, song: "Dam Mast Qalandar", artist: "Nusrat Fateh Ali Khan", user: "Faqeer_J", token: 1, liked: 31 },
      { id: 2, song: "Allah Hoo", artist: "Nusrat Fateh Ali Khan", user: "Rang_Baaz", token: 2, liked: 24 },
      { id: 3, song: "Mere Rashke Qamar", artist: "Ustad Nusrat", user: "GulZaar", token: 3, liked: 18 },
      { id: 4, song: "Tumhe Dillagi", artist: "Nusrat & Rahat", user: "Sama_W", token: 4, liked: 11 },
    ],
  },
  "sukoon-ka-darya": {
    name: "Sukoon Ka Darya",
    urdu: "سکون کا دریا",
    tagline: "Soft instruments, softer evenings. No rush, only presence",
    mood: "Serene",
    color: "#82b89a",
    glow: "rgba(130,184,154,0.15)",
    bg: "radial-gradient(ellipse at 20% 30%, #030c06 0%, #050808 100%)",
    initialQueue: [
      { id: 1, song: "Lag Jaa Gale", artist: "Lata Mangeshkar", user: "Chanda_R", token: 1, liked: 14 },
      { id: 2, song: "O Re Piya", artist: "Rahat Fateh Ali Khan", user: "Breeze_S", token: 2, liked: 8 },
    ],
  },
}

const LISTENERS = [
  "Raza_M", "Aisha_K", "Sufi_Soul", "NightOwl", "Faqeer_J",
  "GulZaar", "Tariq_B", "Chanda_R", "Rang_Baaz", "Sama_W",
]

export default function MehfilRoom() {
  const { mehfilId } = useParams()
  const navigate = useNavigate()
  const data = MEHFIL_DATA[mehfilId] || MEHFIL_DATA["shab-e-tarab"]
  const { playSong, currentSong, isPlaying, setIsPlaying } = useMusicPlayer()

  const [queue, setQueue] = useState(data.initialQueue)
  const [nowPlaying, setNowPlaying] = useState(data.initialQueue[0])
  const [mehfilPlaying, setMehfilPlaying] = useState(false)
  const [songInput, setSongInput] = useState("")
  const [artistInput, setArtistInput] = useState("")
  const [myToken, setMyToken] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [progress, setProgress] = useState(37)
  const [activeTab, setActiveTab] = useState("queue")
  const [likedSongs, setLikedSongs] = useState(new Set())

  useEffect(() => {
    if (!mehfilPlaying) return
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { handleMehfilSkip(); return 0 }
        return p + 0.3
      })
    }, 500)
    return () => clearInterval(t)
  }, [mehfilPlaying, queue])

  const handleMehfilSkip = () => {
    setQueue(prev => {
      if (prev.length <= 1) return prev
      const next = prev.slice(1)
      setNowPlaying(next[0])
      setProgress(0)
      return next
    })
  }

  // Play a queue song in the global player
  const handlePlayQueueSong = (item) => {
    const song = { title: item.song, artist: item.artist, duration: "4:30" }
    playSong(song, queue.map(q => ({ title: q.song, artist: q.artist, duration: "4:30" })))
    setNowPlaying(item)
    setMehfilPlaying(true)
  }

  const handleRequest = () => {
    if (!songInput.trim()) return
    const newToken = queue.length + 1
    const newEntry = {
      id: Date.now(),
      song: songInput,
      artist: artistInput || "Unknown Artist",
      user: "You",
      token: newToken,
      liked: 0,
    }
    setQueue(prev => [...prev, newEntry])
    setMyToken(newToken)
    setSubmitted(true)
    setSongInput("")
    setArtistInput("")
  }

  const handleLike = (id) => {
    setLikedSongs(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    setQueue(prev => prev.map(item =>
      item.id === id
        ? { ...item, liked: item.liked + (likedSongs.has(id) ? -1 : 1) }
        : item
    ))
  }

  const totalSec = 272
  const elapsedSec = Math.floor((progress / 100) * totalSec)
  const elMin = Math.floor(elapsedSec / 60)
  const elSec = elapsedSec % 60

  const isGlobalCurrentSong = (item) =>
    currentSong?.title === item.song && currentSong?.artist === item.artist

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden pb-28"
      style={{ background: data.bg || "#080808" }}
    >
      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "700px", height: "350px",
          background: `radial-gradient(ellipse, ${data.glow} 0%, transparent 65%)`,
          filter: "blur(50px)",
        }}
      />

      <Navbar />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-6">
        {/* Back */}
        <button
          onClick={() => navigate("/mehfil")}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors duration-200 mb-8 group"
          style={{ fontFamily: "Inter" }}
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-sm">All Mehfils</span>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: data.color, fontFamily: "Inter" }}>
                {data.mood} · Live
              </span>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: data.color }} />
            </div>
            <h1 className="text-5xl text-amber-50 mb-1" style={{ fontFamily: "Playfair Display" }}>
              {data.name}
            </h1>
            <p className="text-zinc-600 text-sm" style={{ fontFamily: "serif" }}>{data.urdu}</p>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 text-sm mt-2" style={{ fontFamily: "Inter" }}>
            <Users size={14} />
            <span>{LISTENERS.length + queue.length} in mehfil</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* Left: Now Playing + Request */}
          <div className="flex flex-col gap-5">

            {/* Now Playing card */}
            <div
              className="rounded-2xl p-7 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${data.color}20`,
              }}
            >
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 100%, ${data.glow} 0%, transparent 60%)` }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: data.color }} />
                  <span className="text-xs tracking-widest uppercase text-zinc-500" style={{ fontFamily: "Inter" }}>
                    Now Playing
                  </span>
                </div>

                <div className="flex items-start gap-5 mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
                    style={{ background: data.color + "15", border: `1px solid ${data.color}25` }}
                  >
                    <MicVocal size={30} style={{ color: data.color }} />
                    {mehfilPlaying && (
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: data.color }}
                      >
                        <Volume2 size={10} color="#0a0a0a" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl text-amber-100 leading-tight mb-1" style={{ fontFamily: "Playfair Display" }}>
                      {nowPlaying?.song || "—"}
                    </h2>
                    <p className="text-zinc-400 text-sm" style={{ fontFamily: "Inter" }}>{nowPlaying?.artist || "—"}</p>
                    <p className="text-zinc-600 text-xs mt-1" style={{ fontFamily: "Inter" }}>
                      Requested by <span style={{ color: data.color }}>{nowPlaying?.user}</span>
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: data.color }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-zinc-700 text-xs" style={{ fontFamily: "Inter" }}>
                      {elMin}:{String(elSec).padStart(2, "0")}
                    </span>
                    <span className="text-zinc-700 text-xs" style={{ fontFamily: "Inter" }}>4:32</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMehfilPlaying(p => !p)}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{ background: data.color, color: "#0a0a0a" }}
                  >
                    {mehfilPlaying ? <Pause size={17} /> : <Play size={17} />}
                  </button>
                  <button
                    onClick={handleMehfilSkip}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/8"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                  >
                    <SkipForward size={15} />
                  </button>
                  <span className="text-zinc-600 text-xs ml-1" style={{ fontFamily: "Inter" }}>
                    {queue.length} songs remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Request card */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h3 className="text-lg text-amber-100 mb-1" style={{ fontFamily: "Playfair Display" }}>
                Request a Song
              </h3>
              <p className="text-zinc-600 text-sm mb-5" style={{ fontFamily: "Inter" }}>
                Your song joins the queue. The mehfil listens together, one at a time.
              </p>

              {submitted && myToken ? (
                <div
                  className="rounded-xl p-5 text-center"
                  style={{ background: data.color + "10", border: `1px solid ${data.color}20` }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Hash size={16} style={{ color: data.color }} />
                    <span className="text-4xl font-light" style={{ color: data.color, fontFamily: "Playfair Display" }}>
                      {myToken}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm" style={{ fontFamily: "Inter" }}>Your queue token</p>
                  <p className="text-zinc-700 text-xs mt-1" style={{ fontFamily: "Inter" }}>
                    {myToken - 1} songs before yours
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setMyToken(null) }}
                    className="mt-4 text-xs underline text-zinc-600 hover:text-zinc-400 transition-colors"
                    style={{ fontFamily: "Inter" }}
                  >
                    Request another
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Song name..."
                    value={songInput}
                    onChange={e => setSongInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleRequest()}
                    className="w-full rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none transition-colors text-sm"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontFamily: "Inter",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Artist (optional)..."
                    value={artistInput}
                    onChange={e => setArtistInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleRequest()}
                    className="w-full rounded-xl px-4 py-3 text-white placeholder-zinc-700 outline-none transition-colors text-sm"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontFamily: "Inter",
                    }}
                  />
                  <button
                    onClick={handleRequest}
                    disabled={!songInput.trim()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: songInput.trim() ? data.color : "rgba(255,255,255,0.04)",
                      color: songInput.trim() ? "#0a0804" : "rgba(255,255,255,0.25)",
                      fontFamily: "Inter",
                    }}
                  >
                    <Send size={14} />
                    Add to Queue
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Queue / Listeners */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {["queue", "listeners"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-4 text-sm capitalize transition-colors duration-200 relative"
                  style={{ color: activeTab === tab ? data.color : "rgba(255,255,255,0.3)", fontFamily: "Inter" }}
                >
                  {tab === "queue"
                    ? <span className="flex items-center justify-center gap-2"><Music size={13} />Queue <span className="opacity-50 text-xs">({queue.length})</span></span>
                    : <span className="flex items-center justify-center gap-2"><Users size={13} />Listeners</span>
                  }
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-4 right-4 h-px" style={{ background: data.color }} />
                  )}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "520px", scrollbarWidth: "none" }}>
              {activeTab === "queue" ? (
                <div className="p-4 flex flex-col gap-2">
                  {queue.map((item, idx) => {
                    const isActive = isGlobalCurrentSong(item)
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl p-4 transition-all duration-200 group cursor-pointer"
                        style={{
                          background: isActive ? data.color + "10" : idx === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${isActive ? data.color + "25" : idx === 0 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"}`,
                        }}
                        onClick={() => handlePlayQueueSong(item)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Token / play indicator */}
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-medium mt-0.5 transition-all duration-200"
                            style={{
                              background: isActive ? data.color + "25" : idx === 0 ? data.color + "15" : "rgba(255,255,255,0.05)",
                              color: isActive || idx === 0 ? data.color : "rgba(255,255,255,0.25)",
                              fontFamily: "Inter",
                            }}
                          >
                            {isActive ? (
                              isPlaying ? <Pause size={11} /> : <Play size={11} />
                            ) : idx === 0 ? (
                              <Play size={11} />
                            ) : (
                              item.token
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              style={{
                                color: isActive ? data.color : idx === 0 ? "#f0dfc0" : "rgba(255,255,255,0.7)",
                                fontFamily: "Playfair Display",
                              }}
                            >
                              {item.song}
                            </p>
                            <p className="text-zinc-600 text-xs mt-0.5 truncate" style={{ fontFamily: "Inter" }}>
                              {item.artist} · <span style={{ color: data.color + "aa" }}>{item.user}</span>
                            </p>
                          </div>

                          <button
                            onClick={e => { e.stopPropagation(); handleLike(item.id) }}
                            className="flex items-center gap-1 flex-shrink-0"
                            style={{ color: likedSongs.has(item.id) ? data.color : "rgba(255,255,255,0.15)" }}
                          >
                            <Heart size={12} fill={likedSongs.has(item.id) ? data.color : "none"} />
                            <span className="text-xs" style={{ fontFamily: "Inter" }}>{item.liked}</span>
                          </button>
                        </div>

                        {item.user === "You" && myToken && (
                          <div className="mt-2 ml-11">
                            <span
                              className="text-xs px-2 py-0.5 rounded-md"
                              style={{ background: data.color + "15", color: data.color, fontFamily: "Inter" }}
                            >
                              Your request · Token #{item.token}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {queue.length === 0 && (
                    <div className="text-center py-12 text-zinc-700" style={{ fontFamily: "Inter" }}>
                      <Music size={28} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm">Queue is empty. Be the first to request.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-1.5">
                  {LISTENERS.map((name, i) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 py-3 px-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                        style={{ background: data.color + "18", color: data.color, fontFamily: "Inter" }}
                      >
                        {name[0]}
                      </div>
                      <span className="text-zinc-400 text-sm flex-1" style={{ fontFamily: "Inter" }}>{name}</span>
                      {i === 0 && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-md"
                          style={{ background: data.color + "15", color: data.color, fontFamily: "Inter" }}
                        >
                          Host
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-3 py-3 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{ background: data.color + "18", color: data.color, fontFamily: "Inter" }}
                    >
                      Y
                    </div>
                    <span className="text-sm flex-1" style={{ color: data.color, fontFamily: "Inter" }}>You</span>
                  </div>
                </div>
              )}
            </div>

            {activeTab === "queue" && (
              <div
                className="px-5 py-3 border-t text-xs text-zinc-700 flex items-center gap-2"
                style={{ borderColor: "rgba(255,255,255,0.05)", fontFamily: "Inter" }}
              >
                <Clock size={11} />
                Click any song to play · Liked songs move up
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
