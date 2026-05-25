// src/pages/ArtistDetail.jsx
// Dynamic — reads artist id from URL param /artist/:artistId
// Images loaded from src/assets/artists/<id>.jpg (your local files)

import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import Navbar from "../components/Navbar"
import AmbientEffects, { SongWave } from "../components/AmbientEffects"
import { useMusicPlayer } from "../components/MusicPlayerContext"
import { getArtistById } from "../data/artists"
import { getSongsByArtist } from "../data/songs"
import {
  Play, Pause, Clock, Heart, Shuffle,
  ChevronLeft, Users, Music2, Award, Calendar
} from "lucide-react"

// ── Graceful image loader — tries local asset, falls back to placeholder ──
function ArtistHeroImage({ artistId, name, color }) {
  return (
    <div className="absolute inset-0">
      {/* 
        IMPORTANT: replace the src below with your actual import or
        a dynamic require when you have local images ready.
        
        Pattern to use once you add images:
          import jagjitImg from "../assets/artists/jagjit-singh.jpg"
          Then pass it as a prop from Artist.jsx
        
        For now we render a rich gradient placeholder that still looks premium.
      */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${color}18 0%, #0a0806 50%, #06080d 100%)`,
        }}
      />
      {/* Decorative vinyl art as placeholder */}
      <div
        className="absolute"
        style={{
          right: "5%", top: "50%", transform: "translateY(-50%)",
          width: "380px", height: "380px",
          background: "conic-gradient(from 0deg, #1c1410 0deg, #2e2018 40deg, #120e0a 80deg, #221a12 120deg, #1c1410 160deg, #2e2018 200deg, #120e0a 240deg, #1c1410 280deg, #221a12 320deg, #1c1410 360deg)",
          borderRadius: "50%",
          boxShadow: `0 0 0 2px #3a2e1e, 0 0 80px ${color}20`,
          opacity: 0.35,
        }}
      >
        {/* Grooves */}
        {[0.78, 0.62, 0.46, 0.32].map((r, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: `${r * 100}%`, height: `${r * 100}%`,
            top: `${(1 - r) * 50}%`, left: `${(1 - r) * 50}%`,
            border: `1px solid ${color}15`,
          }} />
        ))}
        <div
          className="absolute rounded-full"
          style={{
            width: "28%", height: "28%", top: "36%", left: "36%",
            background: `radial-gradient(circle, ${color}, ${color}60)`,
          }}
        />
      </div>
    </div>
  )
}

// ── Song row ──────────────────────────────────────────────────
function SongRow({ song, index, color, onPlay, isCurrentSong, isPlaying, onLike, isLiked }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={onPlay}
      className="grid items-center px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer select-none"
      style={{
        gridTemplateColumns: "36px 1fr 80px 70px 60px",
        gap: "0 16px",
        background: isCurrentSong ? color + "0d" : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        border: isCurrentSong ? `1px solid ${color}18` : "1px solid transparent",
      }}
    >
      {/* Index / play */}
      <div className="flex items-center justify-center h-full">
        {hovered || isCurrentSong ? (
          <button onClick={onPlay} className="transition-transform duration-150 hover:scale-110">
            {isCurrentSong && isPlaying
              ? <Pause size={15} style={{ color }} />
              : <Play  size={15} style={{ color: isCurrentSong ? color : "rgba(255,255,255,0.75)", marginLeft: 1 }} />
            }
          </button>
        ) : (
          <span className="text-sm" style={{
            color: isCurrentSong ? color : "rgba(255,255,255,0.2)",
            fontFamily: "Inter",
          }}>
            {index + 1}
          </span>
        )}
      </div>

      {/* Title + artist + wave */}
      <div className="min-w-0 flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-sm truncate font-medium" style={{
            color: isCurrentSong ? color : "rgba(255,255,255,0.85)",
            fontFamily: "Playfair Display",
          }}>
            {song.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "Inter" }}>
              {song.album} · {song.year}
            </p>
          </div>
        </div>
        {isCurrentSong && (
          <SongWave playing={isPlaying} color={color} />
        )}
      </div>

      {/* Plays */}
      <p className="text-right text-xs" style={{ color: "rgba(255,255,255,0.22)", fontFamily: "Inter" }}>
        {song.plays}
      </p>

      {/* Genre tag */}
      <div className="flex justify-center">
        <span className="text-[10px] px-2 py-0.5 rounded-full truncate" style={{
          background: color + "12",
          color: color + "aa",
          border: `1px solid ${color}18`,
          fontFamily: "Inter",
        }}>
          {song.genre?.[0] || "Ghazal"}
        </span>
      </div>

      {/* Duration + like */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={e => { e.stopPropagation(); onLike(song.id) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Heart size={13} style={{
            color: isLiked ? "#e05454" : "rgba(255,255,255,0.25)",
            fill: isLiked ? "#e05454" : "none",
          }} />
        </button>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}>
          {song.duration}
        </span>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function ArtistDetail() {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const { playSong, currentSong, isPlaying, toggleLike, liked } = useMusicPlayer()

  const artist = getArtistById(artistId)
  const songs  = getSongsByArtist(artistId)

  // 404 — artist not found
  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#080605" }}>
        <Navbar />
        <div className="text-center mt-20">
          <p className="text-6xl mb-4" style={{ fontFamily: "Playfair Display", color: "#c4a882" }}>404</p>
          <p className="text-zinc-500 mb-8" style={{ fontFamily: "Inter" }}>Artist not found</p>
          <button onClick={() => navigate("/artists")} className="text-zinc-400 hover:text-white underline transition-colors" style={{ fontFamily: "Inter" }}>
            ← Back to Artists
          </button>
        </div>
      </div>
    )
  }

  const [activeTab, setActiveTab] = useState("tracks")
  const [localLiked, setLocalLiked] = useState(new Set())

  const handlePlay = (song) => {
    playSong(
      { title: song.title, artist: artist.name, duration: song.duration },
      songs.map(s => ({ title: s.title, artist: artist.name, duration: s.duration }))
    )
  }

  const handlePlayAll = () => { if (songs.length > 0) handlePlay(songs[0]) }

  const handleLike = (songId) => {
    setLocalLiked(prev => {
      const next = new Set(prev)
      next.has(songId) ? next.delete(songId) : next.add(songId)
      return next
    })
  }

  const isCurrentSong = (song) => currentSong?.title === song.title

  return (
    <div
      className="min-h-screen text-white pb-32 relative overflow-hidden"
      style={{ background: artist.accentBg || "#080605" }}
    >
      <AmbientEffects glow glowColor={`${artist.color}08`} particles={false} />

      <Navbar />

      {/* ── Hero ──────────────────────────────────── */}
      <div className="relative h-[58vh] min-h-[420px] overflow-hidden">
        <ArtistHeroImage artistId={artist.id} name={artist.name} color={artist.color} />

        {/* Gradient blends */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(8,6,5,0.1) 0%, rgba(8,6,5,0.5) 55%, rgba(8,6,5,1) 100%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(8,6,5,0.85) 0%, transparent 55%)",
        }} />

        {/* Back button */}
        <div className="absolute top-0 left-0 z-20 px-8 pt-6">
          <button
            onClick={() => navigate("/artists")}
            className="flex items-center gap-2 transition-colors duration-200 group"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "Inter" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm">All Artists</span>
          </button>
        </div>

        {/* Artist info */}
        <div className="absolute bottom-0 left-0 px-8 md:px-10 pb-10 max-w-2xl z-10">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: artist.color, fontFamily: "Inter" }}>
            Artist · {artist.tags.join(", ")}
          </p>
          <h1
            className="text-5xl md:text-7xl text-amber-50 leading-tight mb-3"
            style={{ fontFamily: "Playfair Display" }}
          >
            {artist.name}
          </h1>
          <p className="text-zinc-500 text-sm mb-1" style={{ fontFamily: "serif" }}>{artist.urdu}</p>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mt-3" style={{ fontFamily: "Inter" }}>
            {artist.bioShort}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-5 flex-wrap">
            {[
              { icon: Users,    value: artist.followers,      label: "Followers"   },
              { icon: Music2,   value: artist.totalSongs,     label: "Songs"       },
              { icon: Calendar, value: artist.activeYears,    label: "Active"      },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon size={13} style={{ color: artist.color + "80" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: artist.color, fontFamily: "Inter" }}>
                    {s.value}
                  </p>
                  <p className="text-[10px] text-zinc-600" style={{ fontFamily: "Inter" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Action bar ────────────────────────────── */}
      <div className="px-8 md:px-10 py-6 flex items-center gap-3 flex-wrap">
        <button
          onClick={handlePlayAll}
          className="flex items-center gap-2.5 px-7 py-3 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ background: artist.color, color: "#0a0804", fontFamily: "Inter" }}
        >
          <Play size={15} style={{ marginLeft: 1 }} />
          Play All
        </button>
        <button
          className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm transition-all duration-200"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Inter",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Shuffle size={14} />
          Shuffle
        </button>
        <button
          className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm transition-all duration-200"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Inter",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Heart size={14} />
          Follow
        </button>
      </div>

      {/* ── Tabs ──────────────────────────────────── */}
      <div className="px-8 md:px-10 flex items-center gap-1 mb-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {["tracks", "albums", "about"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-4 py-3 text-sm capitalize transition-colors duration-200"
            style={{
              color: activeTab === tab ? "#f5e6cc" : "rgba(255,255,255,0.3)",
              fontFamily: "Inter",
            }}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: artist.color }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Tracks tab ────────────────────────────── */}
      {activeTab === "tracks" && (
        <div className="px-6 md:px-8 max-w-4xl">
          {songs.length === 0 ? (
            <div className="text-center py-16">
              <Music2 size={32} className="mx-auto mb-3 opacity-20" style={{ color: artist.color }} />
              <p className="text-zinc-600 text-sm" style={{ fontFamily: "Inter" }}>
                No songs found for this artist.
              </p>
              <p className="text-zinc-700 text-xs mt-1" style={{ fontFamily: "Inter" }}>
                Add songs in src/data/songs.js with artistId: "{artist.id}"
              </p>
            </div>
          ) : (
            <>
              {/* Column headers */}
              <div
                className="grid px-4 mb-2"
                style={{
                  gridTemplateColumns: "36px 1fr 80px 70px 60px",
                  gap: "0 16px",
                  color: "rgba(255,255,255,0.18)",
                  fontFamily: "Inter",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                <span className="text-center">#</span>
                <span>Title</span>
                <span className="text-right">Plays</span>
                <span className="text-center">Genre</span>
                <span className="flex items-center justify-end"><Clock size={11} /></span>
              </div>

              <div className="w-full mb-2" style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />

              <div className="flex flex-col gap-0.5">
                {songs.map((song, idx) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    index={idx}
                    color={artist.color}
                    onPlay={() => handlePlay(song)}
                    isCurrentSong={isCurrentSong(song)}
                    isPlaying={isPlaying}
                    onLike={handleLike}
                    isLiked={localLiked.has(song.id)}
                  />
                ))}
              </div>

              <p className="mt-6 px-4 text-xs" style={{ color: "rgba(255,255,255,0.12)", fontFamily: "Inter" }}>
                {songs.length} tracks · Double-click to play · Hover to reveal controls
              </p>
            </>
          )}
        </div>
      )}

      {/* ── Albums tab ────────────────────────────── */}
      {activeTab === "albums" && (
        <div className="px-8 md:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {artist.albums.map((album, i) => (
              <div key={i} className="group cursor-pointer">
                <div
                  className="aspect-square rounded-2xl mb-3 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${artist.color}20 0%, ${artist.color}06 100%)`,
                    border: `1px solid ${artist.color}15`,
                    boxShadow: `0 8px 30px rgba(0,0,0,0.3)`,
                  }}
                >
                  {/* Vinyl inside album art */}
                  <div
                    className="w-16 h-16 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, #1a1a1a, #2a2a2a 90deg, #111 180deg, #222 270deg)",
                      border: "2px solid #333",
                    }}
                  >
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full" style={{ background: artist.color + "80" }} />
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: artist.color }}>
                      <Play size={17} color="#0a0804" style={{ marginLeft: 2 }} />
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Playfair Display" }}>
                  {album.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "Inter" }}>
                  {album.year} · {album.tracks} tracks
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── About tab ─────────────────────────────── */}
      {activeTab === "about" && (
        <div className="px-8 md:px-10 max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Bio */}
          <div>
            <h3 className="text-lg text-amber-100 mb-4" style={{ fontFamily: "Playfair Display" }}>Biography</h3>
            <p className="text-zinc-400 text-sm leading-loose" style={{ fontFamily: "Inter" }}>
              {artist.bio}
            </p>
          </div>

          {/* Metadata */}
          <div className="space-y-6">
            {/* Born / Died */}
            <div>
              <h3 className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}>
                Details
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: "Born",         value: artist.born },
                  { label: "Origin",       value: artist.origin },
                  { label: "Active",       value: artist.activeYears },
                  { label: "Genres",       value: artist.tags.join(", ") },
                  ...(artist.died ? [{ label: "Died", value: artist.died }] : []),
                ].map(d => (
                  <div key={d.label} className="flex gap-3">
                    <span className="text-xs text-zinc-600 w-16 flex-shrink-0 pt-0.5" style={{ fontFamily: "Inter" }}>
                      {d.label}
                    </span>
                    <span className="text-xs text-zinc-400 flex-1" style={{ fontFamily: "Inter" }}>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards */}
            {artist.awards?.length > 0 && (
              <div>
                <h3 className="text-xs tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}>
                  <Award size={11} />
                  Awards
                </h3>
                <div className="flex flex-col gap-2">
                  {artist.awards.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: artist.color + "60" }} />
                      <p className="text-xs text-zinc-500" style={{ fontFamily: "Inter" }}>{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Influences */}
            {artist.influences?.length > 0 && (
              <div>
                <h3 className="text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}>
                  Influences
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artist.influences.map((inf, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full" style={{
                      background: artist.color + "10",
                      color: artist.color + "99",
                      border: `1px solid ${artist.color}18`,
                      fontFamily: "Inter",
                    }}>
                      {inf}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
