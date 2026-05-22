import { useState } from "react"
import Navbar from "../components/Navbar"
import { useMusicPlayer } from "../components/MusicPlayerContext"
import {
  Play, Pause, Clock, Heart, Shuffle,
  Music2, ChevronRight, Lock
} from "lucide-react"

// ─── Data ─────────────────────────────────────────────────────
const PLAYLISTS = [
  {
    id: "liked",
    title: "Liked Songs",
    subtitle: "Personal Collection",
    description: "The songs that stayed long after the night ended. Each one a chapter.",
    count: 42,
    color: "#c4a882",
    glow: "rgba(196,168,130,0.12)",
    private: true,
    songs: [
      { title: "Hoshwalon Ko Khabar Kya", artist: "Jagjit Singh", duration: "5:12", year: "1988", plays: "2.4M" },
      { title: "Tum Itna Jo Muskura Rahe Ho", artist: "Jagjit Singh", duration: "4:26", year: "1981", plays: "3.1M" },
      { title: "Aaj Jaane Ki Zid Na Karo", artist: "Farida Khanum", duration: "4:48", year: "1977", plays: "5.8M" },
      { title: "Tum Nahin Aaye", artist: "Mehdi Hassan", duration: "5:33", year: "1972", plays: "1.9M" },
      { title: "Ranjish Hi Sahi", artist: "Mehdi Hassan", duration: "6:20", year: "1974", plays: "4.1M" },
    ],
  },
  {
    id: "midnight-rain",
    title: "Midnight Rain",
    subtitle: "Quiet Nights",
    description: "Soft ghazals for rain, silence and late thoughts. Best heard alone.",
    count: 18,
    color: "#8ba9c4",
    glow: "rgba(139,169,196,0.12)",
    private: false,
    songs: [
      { title: "Jhuki Jhuki Si Nazar", artist: "Jagjit Singh", duration: "5:01", year: "1990", plays: "1.8M" },
      { title: "Chitthi Na Koi Sandesh", artist: "Jagjit Singh", duration: "6:40", year: "1999", plays: "4.2M" },
      { title: "Lag Jaa Gale", artist: "Lata Mangeshkar", duration: "3:55", year: "1964", plays: "9.1M" },
      { title: "Yeh Jo Halka Halka Suroor Hai", artist: "Nusrat Fateh Ali Khan", duration: "7:12", year: "1986", plays: "3.3M" },
      { title: "Dil Dhoondta Hai", artist: "Bhupinder Singh", duration: "5:44", year: "1975", plays: "2.2M" },
    ],
  },
  {
    id: "mehfil-nights",
    title: "Mehfil Nights",
    subtitle: "Classic Mehfils",
    description: "Timeless voices gathered for long poetic evenings. No clock, no hurry.",
    count: 26,
    color: "#b89a6a",
    glow: "rgba(184,154,106,0.12)",
    private: false,
    songs: [
      { title: "Koi Fariyaad", artist: "Jagjit Singh", duration: "8:09", year: "2003", plays: "5.7M" },
      { title: "Dam Mast Qalandar", artist: "Nusrat Fateh Ali Khan", duration: "9:30", year: "1987", plays: "12.4M" },
      { title: "Yeh Dil Yeh Pagal Dil Mera", artist: "Mehdi Hassan", duration: "5:55", year: "1969", plays: "2.9M" },
      { title: "Allah Hoo", artist: "Nusrat Fateh Ali Khan", duration: "8:44", year: "1990", plays: "8.7M" },
      { title: "Abhi Na Jao Chhod Kar", artist: "Asha Bhosle", duration: "3:40", year: "1960", plays: "7.2M" },
    ],
  },
  {
    id: "sufi-silence",
    title: "Sufi Silence",
    subtitle: "Spiritual Calm",
    description: "Poetry that feels like prayer and stillness that fills an empty room.",
    count: 14,
    color: "#82b89a",
    glow: "rgba(130,184,154,0.12)",
    private: false,
    songs: [
      { title: "Mere Rashke Qamar", artist: "Nusrat Fateh Ali Khan", duration: "6:15", year: "1986", plays: "6.8M" },
      { title: "O Re Piya", artist: "Rahat Fateh Ali Khan", duration: "5:28", year: "2007", plays: "4.5M" },
      { title: "Mast Qalandar", artist: "Abida Parveen", duration: "11:20", year: "1988", plays: "3.1M" },
      { title: "Tu Jhoom", artist: "Abida Parveen", duration: "5:02", year: "2022", plays: "2.7M" },
    ],
  },
]

// ─── Song row ─────────────────────────────────────────────────
function SongRow({ song, index, color, onPlay, isCurrentSong, isPlaying }) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={onPlay}
      className="grid items-center px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer"
      style={{
        gridTemplateColumns: "32px 1fr 80px 70px 50px",
        gap: "0 16px",
        background: isCurrentSong
          ? color + "0e"
          : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        border: isCurrentSong ? `1px solid ${color}18` : "1px solid transparent",
      }}
    >
      {/* Index / play */}
      <div className="flex items-center justify-center">
        {hovered || isCurrentSong ? (
          <button onClick={onPlay}>
            {isCurrentSong && isPlaying
              ? <Pause size={14} style={{ color }} />
              : <Play size={14} style={{ color: isCurrentSong ? color : "rgba(255,255,255,0.7)", marginLeft: 1 }} />
            }
          </button>
        ) : (
          <span style={{ color: isCurrentSong ? color : "rgba(255,255,255,0.2)", fontFamily: "Inter", fontSize: "0.8rem" }}>
            {index + 1}
          </span>
        )}
      </div>

      {/* Title + artist */}
      <div className="min-w-0">
        <p
          className="text-sm truncate font-medium"
          style={{ color: isCurrentSong ? color : "rgba(255,255,255,0.85)", fontFamily: "Playfair Display" }}
        >
          {song.title}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "Inter" }}>
          {song.artist}
        </p>
      </div>

      {/* Plays */}
      <p className="text-right text-xs" style={{ color: "rgba(255,255,255,0.22)", fontFamily: "Inter" }}>
        {song.plays}
      </p>

      {/* Year */}
      <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.22)", fontFamily: "Inter" }}>
        {song.year}
      </p>

      {/* Duration + like */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Heart
            size={13}
            style={{ color: liked ? "#e05454" : "rgba(255,255,255,0.25)", fill: liked ? "#e05454" : "none" }}
          />
        </button>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}>
          {song.duration}
        </span>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function Playlist() {
  const { playSong, currentSong, isPlaying } = useMusicPlayer()
  const [activeId, setActiveId] = useState("liked")

  const active = PLAYLISTS.find(p => p.id === activeId) || PLAYLISTS[0]

  const handlePlaySong = (song, playlist) => {
    playSong(
      { title: song.title, artist: song.artist, duration: song.duration },
      playlist.songs.map(s => ({ title: s.title, artist: s.artist, duration: s.duration }))
    )
  }

  const handlePlayAll = () => {
    if (active.songs.length > 0) handlePlaySong(active.songs[0], active)
  }

  return (
    <div
      className="min-h-screen text-white pb-32 relative overflow-hidden"
      style={{ background: "#080605" }}
    >
      {/* Page-level ambient glow */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 0% 0%, ${active.glow} 0%, transparent 70%)`,
          filter: "blur(60px)",
          transition: "background 0.6s ease",
        }}
      />

      <Navbar />

      <div className="relative z-10 px-10 pt-10 pb-6">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "rgba(196,168,130,0.5)", fontFamily: "Inter" }}
        >
          Your Library
        </p>
        <h1
          className="text-6xl text-amber-100 mb-3"
          style={{ fontFamily: "Playfair Display" }}
        >
          Playlists
        </h1>
        <p
          className="text-zinc-500 text-base max-w-xl leading-relaxed"
          style={{ fontFamily: "Inter" }}
        >
          Curated for silence, longing and evenings that refuse to end.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0 px-10 pt-2">

        {/* ── Left sidebar: playlist list ── */}
        <div className="flex flex-col gap-2 pr-8 border-r border-white/5">
          {PLAYLISTS.map(pl => (
            <button
              key={pl.id}
              onClick={() => setActiveId(pl.id)}
              className="text-left flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-250 group"
              style={{
                background: activeId === pl.id ? pl.color + "0d" : "transparent",
                border: `1px solid ${activeId === pl.id ? pl.color + "25" : "transparent"}`,
              }}
            >
              {/* Color swatch */}
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${pl.color}30, ${pl.color}10)`,
                  border: `1px solid ${pl.color}20`,
                }}
              >
                <Music2 size={18} style={{ color: pl.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate transition-colors duration-200"
                  style={{
                    color: activeId === pl.id ? pl.color : "rgba(255,255,255,0.75)",
                    fontFamily: "Playfair Display",
                  }}
                >
                  {pl.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}>
                    {pl.subtitle}
                  </p>
                  {pl.private && <Lock size={10} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}>
                  {pl.count}
                </span>
                <ChevronRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ color: activeId === pl.id ? pl.color : "rgba(255,255,255,0.15)" }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* ── Right: active playlist detail ── */}
        <div className="pl-8">
          {/* Playlist header */}
          <div className="flex items-end gap-8 mb-8">
            {/* Art */}
            <div
              className="w-44 h-44 rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${active.color}22, ${active.color}08)`,
                border: `1px solid ${active.color}20`,
                boxShadow: `0 20px 60px ${active.glow}`,
              }}
            >
              {/* Decorative concentric rings */}
              {[0.85, 0.65, 0.45].map((r, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${r * 100}%`, height: `${r * 100}%`,
                    border: `1px solid ${active.color}${i === 0 ? "15" : i === 1 ? "10" : "08"}`,
                  }}
                />
              ))}
              <Music2 size={42} style={{ color: active.color, opacity: 0.6 }} />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-xs tracking-[0.25em] uppercase mb-2"
                style={{ color: active.color, fontFamily: "Inter" }}
              >
                {active.subtitle} {active.private && "· Private"}
              </p>
              <h2
                className="text-5xl text-amber-50 leading-tight mb-3"
                style={{ fontFamily: "Playfair Display" }}
              >
                {active.title}
              </h2>
              <p
                className="text-zinc-500 text-sm leading-relaxed mb-5 max-w-md"
                style={{ fontFamily: "Inter" }}
              >
                {active.description}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayAll}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ background: active.color, color: "#0a0804", fontFamily: "Inter" }}
                >
                  <Play size={15} style={{ marginLeft: 1 }} />
                  Play All
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all duration-300 hover:bg-white/5"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "Inter",
                  }}
                >
                  <Shuffle size={14} />
                  Shuffle
                </button>
                <span className="text-zinc-700 text-xs ml-2" style={{ fontFamily: "Inter" }}>
                  {active.songs.length} tracks shown
                </span>
              </div>
            </div>
          </div>

          {/* Song list */}
          <div>
            {/* Column headers */}
            <div
              className="grid px-4 mb-2 text-[10px] tracking-[0.2em] uppercase"
              style={{
                gridTemplateColumns: "32px 1fr 80px 70px 50px",
                gap: "0 16px",
                color: "rgba(255,255,255,0.18)",
                fontFamily: "Inter",
              }}
            >
              <span className="text-center">#</span>
              <span>Title</span>
              <span className="text-right">Plays</span>
              <span className="text-center">Year</span>
              <span className="flex items-center justify-end gap-1"><Clock size={11} /></span>
            </div>

            <div className="w-full mb-3" style={{ height: "1px", background: "rgba(255,255,255,0.04)" }} />

            <div className="flex flex-col gap-0.5">
              {active.songs.map((song, idx) => (
                <SongRow
                  key={song.title}
                  song={song}
                  index={idx}
                  color={active.color}
                  onPlay={() => handlePlaySong(song, active)}
                  isCurrentSong={currentSong?.title === song.title}
                  isPlaying={isPlaying}
                />
              ))}
            </div>

            {/* Footer count */}
            <div
              className="mt-8 px-4 text-xs"
              style={{ color: "rgba(255,255,255,0.15)", fontFamily: "Inter" }}
            >
              Showing {active.songs.length} of {active.count} songs
              <span className="ml-2 opacity-60">· Double-click to play</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
