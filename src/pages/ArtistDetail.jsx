import Navbar from "../components/Navbar"
import { useState } from "react"
import { Play, Pause, Clock, Heart, Shuffle, MoreHorizontal } from "lucide-react"
import { useMusicPlayer } from "../components/MusicPlayerContext"
import jagjit from "../assets/artists/jagjit2.jpg"

const songs = [
  { title: "Hoshwalon Ko Khabar Kya",  duration: "5:12", plays: "2.4M", year: "1988" },
  { title: "Tum Itna Jo Muskura Rahe Ho", duration: "4:26", plays: "3.1M", year: "1981" },
  { title: "Jhuki Jhuki Si Nazar",       duration: "5:01", plays: "1.8M", year: "1990" },
  { title: "Chitthi Na Koi Sandesh",     duration: "6:40", plays: "4.2M", year: "1999" },
  { title: "Koi Fariyaad",               duration: "8:09", plays: "5.7M", year: "2003" },
]

const albums = [
  { title: "Sajda",        year: "1991", tracks: 8 },
  { title: "The Latest",   year: "1998", tracks: 10 },
  { title: "Marasim",      year: "1981", tracks: 9 },
]

export default function ArtistDetail() {
  const { playSong, currentSong, isPlaying, toggleLike, liked } = useMusicPlayer()
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [activeTab, setActiveTab] = useState("tracks") // "tracks" | "albums" | "about"

  const handlePlay = (song) => {
    playSong(
      { title: song.title, artist: "Jagjit Singh", duration: song.duration },
      songs.map(s => ({ title: s.title, artist: "Jagjit Singh", duration: s.duration }))
    )
  }

  const isCurrentSong = (title) => currentSong?.title === title

  return (
    <div
      className="min-h-screen text-white pb-32"
      style={{ background: "#080605" }}
    >
      <Navbar />

      {/* ── Hero ──────────────────────────────────────── */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={jagjit}
          alt="Jagjit Singh"
          className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          style={{ filter: "brightness(0.35) saturate(0.8)" }}
        />

        {/* Multi-layer gradient overlay for that cinematic feel */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(8,6,5,0) 0%, rgba(8,6,5,0.3) 50%, rgba(8,6,5,1) 100%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(8,6,5,0.6) 0%, transparent 60%)"
        }} />

        {/* Content */}
        <div className="absolute bottom-0 left-0 px-10 pb-10 max-w-2xl">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "#c4a882", fontFamily: "Inter" }}
          >
            Artist
          </p>
          <h1
            className="text-7xl text-amber-50 leading-none mb-4"
            style={{ fontFamily: "Playfair Display" }}
          >
            Jagjit Singh
          </h1>
          <p
            className="text-zinc-400 text-base leading-relaxed max-w-lg"
            style={{ fontFamily: "Inter" }}
          >
            The King of Ghazals. A voice that turned poetry into prayer
            and gave a generation its midnight companion.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            {[
              { label: "Monthly Listeners", value: "4.2M" },
              { label: "Followers", value: "8.9M" },
              { label: "Ghazals", value: "500+" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-amber-100 text-lg font-medium" style={{ fontFamily: "Playfair Display" }}>
                  {s.value}
                </p>
                <p className="text-zinc-600 text-xs" style={{ fontFamily: "Inter" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Action buttons ────────────────────────────── */}
      <div className="px-10 py-7 flex items-center gap-4">
        <button
          onClick={() => handlePlay(songs[0])}
          className="flex items-center gap-2.5 px-7 py-3 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ background: "#c4a882", color: "#0a0804", fontFamily: "Inter" }}
        >
          <Play size={16} style={{ marginLeft: 2 }} />
          Play All
        </button>

        <button
          className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm transition-all duration-300 hover:bg-white/5"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "Inter",
          }}
        >
          <Shuffle size={15} />
          Shuffle
        </button>

        <button
          className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm transition-all duration-300 hover:bg-white/5"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "Inter",
          }}
        >
          <Heart size={15} />
          Follow
        </button>
      </div>

      {/* ── Tabs ──────────────────────────────────────── */}
      <div
        className="px-10 flex items-center gap-1 mb-8 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {["tracks", "albums", "about"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-4 py-3 text-sm capitalize transition-colors duration-200"
            style={{
              color: activeTab === tab ? "#f5e6cc" : "rgba(255,255,255,0.35)",
              fontFamily: "Inter",
            }}
          >
            {tab}
            {activeTab === tab && (
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: "#c4a882" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Tracks ────────────────────────────────────── */}
      {activeTab === "tracks" && (
        <div className="px-6 max-w-4xl">

          {/* Column headers */}
          <div
            className="grid px-4 mb-3 text-xs tracking-widest uppercase"
            style={{
              gridTemplateColumns: "32px 1fr 80px 80px 50px",
              color: "rgba(255,255,255,0.2)",
              fontFamily: "Inter",
              gap: "0 16px",
            }}
          >
            <span>#</span>
            <span>Title</span>
            <span className="text-right">Plays</span>
            <span className="text-center">Year</span>
            <span className="text-right flex items-center justify-end gap-1">
              <Clock size={12} />
            </span>
          </div>

          <div
            className="mb-2 w-full"
            style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}
          />

          {/* Song rows */}
          <div className="flex flex-col gap-1">
            {songs.map((song, idx) => {
              const isCurrent = isCurrentSong(song.title)
              const isHovered = hoveredIdx === idx
              const isLiked = liked.has(song.title)

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onDoubleClick={() => handlePlay(song)}
                  className="group relative grid items-center px-4 py-3 rounded-xl transition-all duration-200"
                  style={{
                    gridTemplateColumns: "32px 1fr 80px 80px 50px",
                    gap: "0 16px",
                    background: isCurrent
                      ? "rgba(196,168,130,0.08)"
                      : isHovered
                      ? "rgba(255,255,255,0.04)"
                      : "transparent",
                    border: isCurrent
                      ? "1px solid rgba(196,168,130,0.15)"
                      : "1px solid transparent",
                  }}
                >
                  {/* Index / play icon */}
                  <div className="flex items-center justify-center">
                    {isHovered || isCurrent ? (
                      <button
                        onClick={() => handlePlay(song)}
                        className="transition-transform duration-150 hover:scale-110"
                      >
                        {isCurrent && isPlaying
                          ? <Pause size={15} style={{ color: "#c4a882" }} />
                          : <Play size={15} style={{ color: isCurrent ? "#c4a882" : "rgba(255,255,255,0.8)", marginLeft: 1 }} />
                        }
                      </button>
                    ) : (
                      <span
                        className="text-sm"
                        style={{
                          color: isCurrent ? "#c4a882" : "rgba(255,255,255,0.25)",
                          fontFamily: "Inter",
                        }}
                      >
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Title + artist */}
                  <div className="min-w-0">
                    <p
                      className="text-sm truncate font-medium"
                      style={{
                        color: isCurrent ? "#c4a882" : "rgba(255,255,255,0.88)",
                        fontFamily: "Playfair Display",
                      }}
                    >
                      {song.title}
                    </p>
                    <p
                      className="text-xs truncate mt-0.5"
                      style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Inter" }}
                    >
                      Jagjit Singh
                    </p>
                  </div>

                  {/* Plays */}
                  <p
                    className="text-right text-sm"
                    style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}
                  >
                    {song.plays}
                  </p>

                  {/* Year */}
                  <p
                    className="text-center text-sm"
                    style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}
                  >
                    {song.year}
                  </p>

                  {/* Duration + like */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(song.title) }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Heart
                        size={14}
                        style={{
                          color: isLiked ? "#e05454" : "rgba(255,255,255,0.3)",
                          fill: isLiked ? "#e05454" : "none",
                        }}
                      />
                    </button>
                    <span
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}
                    >
                      {song.duration}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Albums ────────────────────────────────────── */}
      {activeTab === "albums" && (
        <div className="px-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album, i) => (
              <div
                key={i}
                className="group cursor-pointer"
                style={{ fontFamily: "Inter" }}
              >
                <div
                  className="aspect-square rounded-2xl mb-3 flex items-center justify-center relative overflow-hidden"
                  style={{ background: `hsl(${30 + i * 20}, 20%, ${10 + i * 3}%)`, border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="w-16 h-16 rounded-full"
                    style={{ background: "conic-gradient(from 0deg, #1a1a1a, #2a2a2a 90deg, #111 180deg, #222 270deg)", border: "2px solid #333" }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Play size={18} color="#0a0804" style={{ marginLeft: 2 }} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-200 font-medium" style={{ fontFamily: "Playfair Display" }}>
                  {album.title}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {album.year} · {album.tracks} tracks
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── About ─────────────────────────────────────── */}
      {activeTab === "about" && (
        <div className="px-10 max-w-2xl">
          <p
            className="text-zinc-400 text-base leading-loose"
            style={{ fontFamily: "Inter" }}
          >
            Jagjit Singh (8 February 1941 – 10 October 2011), known as the "King of Ghazals," transformed the ghazal from
            a niche classical form into a widely accessible genre. Born in Ganganagar, Rajasthan, his voice carried the
            weight of Urdu poetry to millions who had never read a sher in their lives.
          </p>
          <p
            className="text-zinc-500 text-base leading-loose mt-5"
            style={{ fontFamily: "Inter" }}
          >
            With his wife Chitra Singh, he revolutionized the recording of ghazals in the 1980s, stripping away
            elaborate orchestration to let the poetry breathe. Albums like <em className="text-zinc-400">Unforgettables</em> and <em className="text-zinc-400">Sajda</em> remain
            benchmarks of the form. His voice — unhurried, intimate, as if singing only for you — never aged.
          </p>
        </div>
      )}
    </div>
  )
}
