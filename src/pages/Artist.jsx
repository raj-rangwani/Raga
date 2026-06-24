// src/pages/Artist.jsx
// Shows 8 featured artist cards by default.
// When user types in search → featured cards hide, matching cards appear.
// Clears search → featured cards return.

import { useState, useMemo, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import AmbientEffects, { EqualizerBars } from "../components/AmbientEffects"
import { useMusicPlayer } from "../components/MusicPlayerContext"
import { useArtists } from "../context/DataContext"
import { Users, Music2, Search, X, TrendingUp } from "lucide-react"

// ── Genre pills ───────────────────────────────────────────────
const GENRES = ["All", "Ghazal", "Qawwali", "Sufi", "Classical", "Bollywood", "Folk", "Poet"]

// ── Single artist card ────────────────────────────────────────
function ArtistCard({ artist, isNew = false }) {
  const { currentSong, isPlaying } = useMusicPlayer()
  const isActive = currentSong?.artist === artist.name
  const hasImage = !!artist.image

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group relative overflow-hidden rounded-3xl block"
      style={{
        aspectRatio: "3/4",
        background: hasImage ? "#111" : artist.accentBg || "#111",
        border: `1px solid ${isActive ? artist.color + "50" : "rgba(255,255,255,0.07)"}`,
        transition: "all 0.5s ease",
        boxShadow: isActive ? `0 0 30px ${artist.color}25` : "none",
        animation: isNew ? "cardFadeIn 0.4s ease both" : "none",
      }}
    >
      {/* ── Image or vinyl placeholder ── */}
      {hasImage ? (
        <>
          <img
            src={artist.image}
            alt={artist.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.42) saturate(0.75)", transition: "all 0.7s ease" }}
          />
          {/* Brighter image on hover */}
          <img
            src={artist.image}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100"
            style={{ filter: "brightness(0.62) saturate(0.9)", transition: "all 0.7s ease" }}
          />
        </>
      ) : (
        /* Vinyl disc placeholder for non-featured artists */
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              width: "65%", height: "65%",
              background: "conic-gradient(from 0deg, #1c1410 0deg, #2e2018 40deg, #120e0a 80deg, #221a12 120deg, #1c1410 160deg, #2e2018 200deg, #120e0a 240deg, #1c1410 280deg, #221a12 320deg, #1c1410 360deg)",
              boxShadow: `0 0 60px ${artist.color}20`,
            }}
          >
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <div className="rounded-full" style={{
                width: "28%", height: "28%",
                background: `radial-gradient(circle, ${artist.color}, ${artist.color}60)`,
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${artist.color}20 0%, transparent 60%)` }}
      />

      {/* Genre tags */}
      <div className="absolute top-4 right-4 flex flex-wrap gap-1 justify-end">
        {artist.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full tracking-wider uppercase" style={{
            background: "rgba(0,0,0,0.6)",
            color: "rgba(255,255,255,0.38)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "Inter",
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Equalizer on active artist */}
      {isActive && isPlaying && (
        <div className="absolute top-4 left-4">
          <EqualizerBars color={artist.color} barCount={4} size="sm" />
        </div>
      )}

      {/* Search-only badge */}
      {!artist.featured && (
        <div className="absolute top-4 left-4" style={{
          background: "rgba(0,0,0,0.65)",
          border: `1px solid ${artist.color}30`,
          borderRadius: "999px",
          padding: "2px 8px",
        }}>
          <span className="text-[9px] uppercase tracking-widest" style={{ color: artist.color + "99", fontFamily: "Inter" }}>
            Artist
          </span>
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h2
          className="text-xl md:text-2xl text-amber-100 leading-tight mb-0.5 transition-colors duration-300 group-hover:text-amber-50"
          style={{ fontFamily: "Playfair Display" }}
        >
          {artist.name}
        </h2>
        <p className="text-zinc-500 text-xs mb-2" style={{ fontFamily: "Inter" }}>
          {artist.title}
        </p>
        {/* Hover stats */}
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <div className="flex items-center gap-1">
            <Users size={11} style={{ color: artist.color }} />
            <span className="text-[11px]" style={{ color: artist.color, fontFamily: "Inter" }}>{artist.followers}</span>
          </div>
          <div className="flex items-center gap-1">
            <Music2 size={11} style={{ color: artist.color }} />
            <span className="text-[11px]" style={{ color: artist.color, fontFamily: "Inter" }}>{artist.totalSongs}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function Artist() {
  const [query,       setQuery]       = useState("")
  const [activeGenre, setActiveGenre] = useState("All")
  const [isFocused,   setIsFocused]   = useState(false)
  const inputRef = useRef(null)

  const { artists, featuredArtists, searchArtists, loading } = useArtists()

  const isSearching = query.trim().length > 0

  // Which artists to show
  const displayed = useMemo(() => {
    if (!isSearching) {
      // No search — show featured 8 filtered by genre only
      return featuredArtists.filter(a =>
        activeGenre === "All" || a.tags.some(t => t.toLowerCase() === activeGenre.toLowerCase())
      )
    }
    // Searching — search ALL artists, apply genre filter
    const results = searchArtists(query)
    return activeGenre === "All"
      ? results
      : results.filter(a => a.tags.some(t => t.toLowerCase() === activeGenre.toLowerCase()))
  }, [query, activeGenre, isSearching, featuredArtists, searchArtists])

  const clearSearch = () => { setQuery(""); inputRef.current?.focus() }

  return (
    <div
      className="min-h-screen text-white pb-32 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0d0905 0%, #080808 50%, #050810 100%)" }}
    >
      <AmbientEffects glow glowColor="rgba(196,168,130,0.04)" particles particleColor="rgba(196,168,130," />

      <div className="relative z-10">
        <Navbar />

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-2 border-amber-100/20 border-t-amber-100/80 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Header ── */}
        <div className="px-6 md:px-10 pt-8 mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(196,168,130,0.5)", fontFamily: "Inter" }}>
            Discover
          </p>
          <h1 className="text-5xl md:text-6xl text-amber-100 tracking-wide mb-4" style={{ fontFamily: "Playfair Display" }}>
            Voices That Built Mehfils
          </h1>
          <p className="text-zinc-500 text-base max-w-xl leading-loose mb-8" style={{ fontFamily: "Inter" }}>
            Eight timeless artists — always here. Search to discover more voices from the tradition.
          </p>

          {/* ── Search bar ── */}
          <div className="max-w-xl relative">
            <div
              className="flex items-center transition-all duration-300"
              style={{
                background: isFocused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                border: isFocused ? "1px solid rgba(196,168,130,0.4)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: query ? "16px 16px 0 0" : "16px",
                boxShadow: isFocused ? "0 0 0 3px rgba(196,168,130,0.06)" : "none",
              }}
            >
              <Search
                size={16}
                className="absolute left-4 transition-colors duration-200"
                style={{ color: isFocused ? "#c4a882" : "rgba(255,255,255,0.25)" }}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search all artists — Begum Akhtar, Hariharan, Iqbal Bano…"
                className="w-full bg-transparent py-3.5 pl-10 pr-10 text-sm text-white placeholder-zinc-600 outline-none"
                style={{ fontFamily: "Inter" }}
              />
              {query && (
                <button onClick={clearSearch} className="absolute right-3 text-zinc-600 hover:text-zinc-300 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Dropdown hint when typing */}
            {isSearching && (
              <div
                className="absolute left-0 right-0 px-4 py-2.5 text-xs z-10"
                style={{
                  background: "linear-gradient(to bottom, #110c06, #0d0908)",
                  border: "1px solid rgba(196,168,130,0.12)",
                  borderTop: "none",
                  borderRadius: "0 0 16px 16px",
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "Inter",
                }}
              >
                {displayed.length > 0
                  ? `${displayed.length} artist${displayed.length > 1 ? "s" : ""} found — click a card to explore`
                  : "No artists match your search"
                }
              </div>
            )}
          </div>

          {/* ── Genre filter pills ── */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {GENRES.map(g => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className="text-xs px-4 py-2 rounded-full transition-all duration-200"
                style={{
                  background: activeGenre === g ? "rgba(196,168,130,0.15)" : "rgba(255,255,255,0.04)",
                  border: activeGenre === g ? "1px solid rgba(196,168,130,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  color: activeGenre === g ? "#c4a882" : "rgba(255,255,255,0.38)",
                  fontFamily: "Inter",
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* ── Section label ── */}
        <div className="px-6 md:px-10 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSearching ? (
              <>
                <Search size={13} style={{ color: "rgba(196,168,130,0.5)" }} />
                <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}>
                  Search Results
                </span>
              </>
            ) : (
              <>
                <TrendingUp size={13} style={{ color: "rgba(196,168,130,0.5)" }} />
                <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}>
                  Featured Artists
                </span>
              </>
            )}
          </div>
          <span className="text-xs text-zinc-700" style={{ fontFamily: "Inter" }}>
            {isSearching
              ? `${artists.length} total artists in library`
              : "Search to discover 12 more"
            }
          </span>
        </div>

        {/* ── Artist grid ── */}
        <div className="px-6 md:px-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayed.map((artist, i) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              isNew={isSearching}
            />
          ))}

          {/* Empty state */}
          {displayed.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-zinc-600 text-lg mb-2" style={{ fontFamily: "Playfair Display" }}>
                No artists found
              </p>
              <p className="text-zinc-700 text-sm" style={{ fontFamily: "Inter" }}>
                Try "Begum Akhtar", "Iqbal Bano", "Rahat", or a genre like "Qawwali"
              </p>
              <button
                onClick={clearSearch}
                className="mt-5 text-sm text-zinc-600 hover:text-amber-100 transition-colors underline"
                style={{ fontFamily: "Inter" }}
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* ── Hint when not searching ── */}
        {!isSearching && (
          <div className="px-6 md:px-10 mt-10 text-center">
            <p className="text-zinc-700 text-sm" style={{ fontFamily: "Inter" }}>
              Also in the library:
              {[" Begum Akhtar", " Iqbal Bano", " Rahat Fateh Ali Khan", " Lata Mangeshkar", " Hariharan", " Malika Pukhraj"].map((name, i) => (
                <button
                  key={name}
                  onClick={() => setQuery(name.trim())}
                  className="text-zinc-600 hover:text-amber-100 transition-colors ml-1"
                  style={{ fontFamily: "Inter", textDecoration: "underline" }}
                >
                  {name}{i < 5 ? "," : ""}
                </button>
              ))}
              {" and more — search to find them"}
            </p>
          </div>
        )}
        </>
        )}
      </div>

      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  )
}
