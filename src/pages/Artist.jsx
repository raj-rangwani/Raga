// src/pages/Artist.jsx
import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import SearchBar from "../components/SearchBar"
import AmbientEffects, { EqualizerBars } from "../components/AmbientEffects"
import { useMusicPlayer } from "../components/MusicPlayerContext"
import { ARTISTS } from "../data/artists"
import { SONGS, getSongsByArtist } from "../data/songs"
import { Users, Music2, TrendingUp } from "lucide-react"

// ── Artist card ───────────────────────────────────────────────
function ArtistCard({ artist }) {
  const { currentSong, isPlaying } = useMusicPlayer()
  const isActive = currentSong?.artistId === artist.id || currentSong?.artist === artist.name

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group relative overflow-hidden rounded-3xl aspect-[3/4] block"
      style={{
        background: "#111",
        border: `1px solid ${isActive ? artist.color + "40" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.5s ease",
        boxShadow: isActive ? `0 0 30px ${artist.color}20` : "none",
      }}
    >
      <img
        src={artist.image}
        alt={artist.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.45) saturate(0.75)",
          transition: "all 0.7s ease",
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${artist.color}18 0%, transparent 60%)` }}
      />

      {/* Hover: image brightens */}
      <img
        src={artist.image}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100"
        style={{ filter: "brightness(0.65) saturate(0.9)", transition: "all 0.7s ease" }}
      />

      {/* Genres top-right */}
      <div className="absolute top-4 right-4 flex flex-wrap gap-1 justify-end">
        {artist.tags.slice(0, 2).map(tag => (
          <span
            key={tag}
            className="text-[9px] px-2 py-0.5 rounded-full tracking-wider uppercase"
            style={{
              background: "rgba(0,0,0,0.6)",
              color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "Inter",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Now playing indicator */}
      {isActive && isPlaying && (
        <div className="absolute top-4 left-4">
          <EqualizerBars color={artist.color} barCount={4} size="sm" />
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h2
          className="text-2xl text-amber-100 leading-tight mb-1 transition-colors duration-300 group-hover:text-amber-50"
          style={{ fontFamily: "Playfair Display" }}
        >
          {artist.name}
        </h2>
        <p className="text-zinc-500 text-xs mb-2" style={{ fontFamily: "Inter" }}>
          {artist.title}
        </p>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1">
            <Users size={11} style={{ color: artist.color }} />
            <span className="text-[11px]" style={{ color: artist.color, fontFamily: "Inter" }}>
              {artist.followers}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Music2 size={11} style={{ color: artist.color }} />
            <span className="text-[11px]" style={{ color: artist.color, fontFamily: "Inter" }}>
              {artist.totalSongs}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function Artist() {
  const [query, setQuery] = useState("")
  const [activeGenre, setActiveGenre] = useState("All")

  const genres = ["All", "Ghazal", "Qawwali", "Sufi", "Classical", "Film"]

  const filtered = useMemo(() => {
    return ARTISTS.filter(a => {
      const matchesQuery = !query.trim() ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      const matchesGenre = activeGenre === "All" ||
        a.tags.some(t => t.toLowerCase() === activeGenre.toLowerCase())
      return matchesQuery && matchesGenre
    })
  }, [query, activeGenre])

  return (
    <div
      className="min-h-screen text-white pb-32 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0d0905 0%, #080808 50%, #050810 100%)" }}
    >
      <AmbientEffects glow glowColor="rgba(196,168,130,0.04)" particles particleColor="rgba(196,168,130," />

      <div className="relative z-10">
        <Navbar />

        <div className="px-6 md:px-10 pt-8 mb-10">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "rgba(196,168,130,0.5)", fontFamily: "Inter" }}
          >
            Discover
          </p>
          <h1
            className="text-5xl md:text-6xl text-amber-100 tracking-wide mb-4"
            style={{ fontFamily: "Playfair Display" }}
          >
            Voices That Built Mehfils
          </h1>
          <p
            className="text-zinc-500 text-base md:text-lg max-w-2xl leading-loose mb-8"
            style={{ fontFamily: "Inter" }}
          >
            Timeless artists whose voices still echo through midnight chai, old memories and silent nights.
          </p>

          {/* Search */}
          <SearchBar
            placeholder="Search artists, songs, genres…"
            onSelect={(item) => {
              if (item.type === "artist" || item.type === "song") setQuery(item.label)
            }}
            className="max-w-xl"
          />

          {/* Genre filter pills */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {genres.map(g => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className="text-xs px-4 py-2 rounded-full transition-all duration-250"
                style={{
                  background: activeGenre === g ? "rgba(196,168,130,0.15)" : "rgba(255,255,255,0.04)",
                  border: activeGenre === g ? "1px solid rgba(196,168,130,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  color: activeGenre === g ? "#c4a882" : "rgba(255,255,255,0.4)",
                  fontFamily: "Inter",
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Trending badge */}
        <div className="px-6 md:px-10 mb-6 flex items-center gap-2">
          <TrendingUp size={14} style={{ color: "rgba(196,168,130,0.5)" }} />
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}
          >
            {filtered.length} artists
          </span>
        </div>

        {/* Grid */}
        <div className="px-6 md:px-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-zinc-600 text-lg" style={{ fontFamily: "Playfair Display" }}>
                No artists found for "{query}"
              </p>
              <button
                onClick={() => { setQuery(""); setActiveGenre("All") }}
                className="mt-4 text-sm text-zinc-600 hover:text-amber-100 transition-colors underline"
                style={{ fontFamily: "Inter" }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
