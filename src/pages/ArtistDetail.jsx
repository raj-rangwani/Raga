// src/pages/ArtistDetail.jsx
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import Navbar from "../components/Navbar"
import AmbientEffects, { SongWave } from "../components/AmbientEffects"
import { useMusicPlayer } from "../components/MusicPlayerContext"
import { useArtists } from "../context/DataContext"
import { useArtistTracks } from "../utils/useArtistTracks"
import {
  Play, Pause, Clock, Heart, Shuffle,
  ChevronLeft, Users, Music2, Award,
  Calendar, Loader2, Wifi, WifiOff
} from "lucide-react"

// ── Artist hero — real photo as background ────────────────────
function ArtistHero({ artist }) {
  return (
    <div className="absolute inset-0">
      {/* Real artist photo */}
      {artist.image && (
        <img
          src={artist.image}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: "brightness(0.45) saturate(0.8)" }}
        />
      )}

      {/* Fallback gradient if no image */}
      {!artist.image && (
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${artist.color}15 0%, #0a0806 50%, #06080d 100%)`,
        }} />
      )}

      {/* Dark gradient overlays so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, rgba(8,6,5,0.92) 0%, rgba(8,6,5,0.5) 50%, rgba(8,6,5,0.2) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(8,6,5,0.1) 0%, rgba(8,6,5,0.4) 55%, rgba(8,6,5,1) 100%)",
        }}
      />

      {/* Subtle color tint from artist accent */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, ${artist.color}12 0%, transparent 60%)`,
        }}
      />
    </div>
  )
}

// ── Song row ──────────────────────────────────────────────────
function SongRow({ song, index, color, onPlay, isCurrent, isPlaying, onLike, isLiked }) {
  const [hovered, setHovered] = useState(false)
  const hasVideo = !!song.videoId

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={hasVideo ? onPlay : undefined}
      className="grid items-center px-4 py-3 rounded-xl transition-all duration-200 group select-none"
      style={{
        gridTemplateColumns: "36px 48px 1fr 70px 70px 55px",
        gap: "0 12px",
        background: isCurrent ? color + "0d" : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        border: isCurrent ? `1px solid ${color}18` : "1px solid transparent",
        cursor: hasVideo ? "pointer" : "default",
      }}
    >
      {/* Index / Play */}
      <div className="flex items-center justify-center">
        {(hovered || isCurrent) && hasVideo ? (
          <button onClick={onPlay}>
            {isCurrent && isPlaying
              ? <Pause size={14} style={{ color }} />
              : <Play  size={14} style={{ color: isCurrent ? color : "rgba(255,255,255,0.75)", marginLeft: 1 }} />
            }
          </button>
        ) : (
          <span className="text-sm" style={{
            color: isCurrent ? color : hasVideo ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
            fontFamily: "Inter",
          }}>
            {index + 1}
          </span>
        )}
      </div>

      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
        style={{ background: color + "10", border: `1px solid ${color}15` }}
      >
        {song.thumbnail ? (
          <img src={song.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <Music2 size={14} style={{ color: color + "60" }} />
        )}
      </div>

      {/* Title + meta */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-sm truncate font-medium" style={{
            color: isCurrent ? color : "rgba(255,255,255,0.85)",
            fontFamily: "Playfair Display",
          }}>
            {song.title}
          </p>
          {isCurrent && <SongWave playing={isPlaying} color={color} />}
          {!hasVideo && (
            <span className="text-[9px] px-1.5 py-0.5 rounded flex-shrink-0" style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.2)",
              fontFamily: "Inter",
            }}>
              No video
            </span>
          )}
        </div>
        <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}>
          {song.album !== "—" ? song.album : song.genre?.[0] || "Ghazal"} · {song.year}
        </p>
      </div>

      {/* Views / Plays */}
      <p className="text-right text-xs" style={{ color: "rgba(255,255,255,0.22)", fontFamily: "Inter" }}>
        {song.plays || "—"}
      </p>

      {/* Genre */}
      <div className="flex justify-center">
        <span className="text-[10px] px-2 py-0.5 rounded-full truncate max-w-full" style={{
          background: color + "10",
          color: color + "99",
          border: `1px solid ${color}15`,
          fontFamily: "Inter",
        }}>
          {song.genre?.[0] || "Ghazal"}
        </span>
      </div>

      {/* Like + duration */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={e => { e.stopPropagation(); onLike(song.id) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          <Heart size={12} style={{
            color: isLiked ? "#e05454" : "rgba(255,255,255,0.25)",
            fill:  isLiked ? "#e05454" : "none",
          }} />
        </button>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.22)", fontFamily: "Inter" }}>
          {song.duration}
        </span>
      </div>
    </div>
  )
}

// ── Loading skeleton row ───────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="grid items-center px-4 py-3 rounded-xl" style={{
      gridTemplateColumns: "36px 48px 1fr 70px 70px 55px",
      gap: "0 12px",
    }}>
      <div className="w-5 h-3 rounded animate-pulse mx-auto" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div className="w-10 h-10 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div>
        <div className="h-3 rounded w-48 animate-pulse mb-2" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="h-2 rounded w-28 animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
      <div className="h-2 rounded w-10 ml-auto animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      <div className="h-5 rounded-full w-14 mx-auto animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
      <div className="h-2 rounded w-8 ml-auto animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function ArtistDetail() {
  const { artistId } = useParams()
  const navigate     = useNavigate()
  const { playSong, currentSong, isPlaying } = useMusicPlayer()

  const { getArtistById, loading: artistLoading } = useArtists()
  const artist = getArtistById(artistId)
  const { tracks, loading, error, source } = useArtistTracks(artistId, artist?.name)

  const [activeTab,  setActiveTab]  = useState("tracks")
  const [likedSongs, setLikedSongs] = useState(new Set())

  if (artistLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#080605" }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-amber-100/50" />
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#080605" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-6xl mb-4" style={{ fontFamily: "Playfair Display", color: "#c4a882" }}>404</p>
          <p className="text-zinc-500 mb-6" style={{ fontFamily: "Inter" }}>Artist not found</p>
          <button onClick={() => navigate("/artists")}
            className="text-sm text-zinc-500 hover:text-zinc-300 underline transition-colors"
            style={{ fontFamily: "Inter" }}>
            ← Back to Artists
          </button>
        </div>
      </div>
    )
  }

  const handlePlay = (song) => {
    if (!song.videoId) return
    playSong(
      {
        title:       song.title,
        artist:      artist.name,
        videoId:     song.videoId,
        thumbnail:   song.thumbnail,
        duration:    song.duration,
        durationSec: song.durationSec,
        lyrics:      song.lyrics || [],   // ← pass lyrics through
      },
      tracks
        .filter(s => s.videoId)
        .map(s => ({
          title: s.title, artist: artist.name,
          videoId: s.videoId, thumbnail: s.thumbnail,
          duration: s.duration, durationSec: s.durationSec,
          lyrics: s.lyrics || [],         // ← also in queue
        }))
    )
  }

  const handlePlayAll = () => {
    const first = tracks.find(s => s.videoId)
    if (first) handlePlay(first)
  }

  const toggleLike = (id) => {
    setLikedSongs(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const isCurrent = (song) => currentSong?.videoId === song.videoId && !!song.videoId

  const sourceBadge = {
    youtube:  { icon: Wifi,    label: "Live from YouTube", color: "#82b89a" },
    enriched: { icon: Wifi,    label: "YouTube matched",   color: "#8ba9c4" },
    static:   { icon: WifiOff, label: "Offline data",      color: "#888"    },
  }[source]

  return (
    <div
      className="min-h-screen text-white pb-32 relative overflow-hidden"
      style={{ background: artist.accentBg || "#080605" }}
    >
      <AmbientEffects glow glowColor={`${artist.color}07`} particles={false} />
      <Navbar />

      {/* ── Hero ──────────────────────────────────── */}
      <div className="relative h-[60vh] min-h-[440px] overflow-hidden">
        <ArtistHero artist={artist} />

        {/* Back button */}
        <div className="absolute top-0 left-0 z-20 px-8 pt-6">
          <button
            onClick={() => navigate("/artists")}
            className="flex items-center gap-2 text-sm transition-colors duration-200 group"
            style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Inter" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.75)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
          >
            <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            All Artists
          </button>
        </div>

        {/* Artist info — bottom left */}
        <div className="absolute bottom-0 left-0 px-8 md:px-10 pb-10 max-w-2xl z-10">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: artist.color, fontFamily: "Inter" }}>
            Artist · {artist.tags.join(", ")}
          </p>
          <h1 className="text-5xl md:text-7xl text-amber-50 leading-tight mb-2" style={{ fontFamily: "Playfair Display" }}>
            {artist.name}
          </h1>
          <p className="text-zinc-500 text-sm mb-3" style={{ fontFamily: "serif" }}>{artist.urdu}</p>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-md" style={{ fontFamily: "Inter" }}>
            {artist.bioShort}
          </p>
          <div className="flex items-center gap-6 mt-5 flex-wrap">
            {[
              { icon: Users,    value: artist.followers,   label: "Followers" },
              { icon: Music2,   value: artist.totalSongs,  label: "Songs"     },
              { icon: Calendar, value: artist.activeYears, label: "Active"    },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon size={12} style={{ color: artist.color + "70" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: artist.color, fontFamily: "Inter" }}>{s.value}</p>
                  <p className="text-[10px] text-zinc-700" style={{ fontFamily: "Inter" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────── */}
      <div className="px-8 md:px-10 py-5 flex items-center gap-3 flex-wrap">
        <button
          onClick={handlePlayAll}
          disabled={loading || !tracks.some(s => s.videoId)}
          className="flex items-center gap-2.5 px-7 py-3 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: artist.color, color: "#0a0804", fontFamily: "Inter" }}
        >
          <Play size={15} style={{ marginLeft: 1 }} />
          {loading ? "Loading…" : "Play All"}
        </button>

        <button
          className="flex items-center gap-2.5 px-5 py-3 rounded-full text-sm transition-all duration-200"
          style={{
            border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.45)",
            fontFamily: "Inter",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Shuffle size={14} />
          Shuffle
        </button>

        {sourceBadge && (
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <sourceBadge.icon size={11} style={{ color: sourceBadge.color }} />
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}>
              {sourceBadge.label}
            </span>
          </div>
        )}
      </div>

      {/* ── Tabs ──────────────────────────────────── */}
      <div className="px-8 md:px-10 flex items-center gap-1 mb-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {["tracks", "albums", "about"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="relative px-4 py-3 text-sm capitalize transition-colors duration-200"
            style={{
              color: activeTab === tab ? "#f5e6cc" : "rgba(255,255,255,0.28)",
              fontFamily: "Inter",
            }}
          >
            {tab}
            {tab === "tracks" && tracks.length > 0 && (
              <span className="ml-1 text-xs opacity-50">({tracks.length})</span>
            )}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: artist.color }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Tracks tab ────────────────────────────── */}
      {activeTab === "tracks" && (
        <div className="px-6 md:px-8 max-w-4xl">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2" style={{
              background: "rgba(196,100,80,0.08)",
              border: "1px solid rgba(196,100,80,0.15)",
              color: "rgba(255,180,160,0.7)",
              fontFamily: "Inter",
            }}>
              <WifiOff size={14} />
              YouTube API error: {error}. Showing offline data.
            </div>
          )}

          <div className="grid px-4 mb-2" style={{
            gridTemplateColumns: "36px 48px 1fr 70px 70px 55px",
            gap: "0 12px",
            color: "rgba(255,255,255,0.18)",
            fontFamily: "Inter",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}>
            <span className="text-center">#</span>
            <span />
            <span>Title</span>
            <span className="text-right">Views</span>
            <span className="text-center">Genre</span>
            <span className="flex items-center justify-end"><Clock size={11} /></span>
          </div>
          <div className="mb-2" style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />

          <div className="flex flex-col gap-0.5">
            {loading && tracks.length === 0
              ? Array(8).fill(0).map((_, i) => <SkeletonRow key={i} />)
              : tracks.map((song, idx) => (
                  <SongRow
                    key={song.id || song.videoId || idx}
                    song={song}
                    index={idx}
                    color={artist.color}
                    onPlay={() => handlePlay(song)}
                    isCurrent={isCurrent(song)}
                    isPlaying={isPlaying}
                    onLike={toggleLike}
                    isLiked={likedSongs.has(song.id)}
                  />
                ))
            }
            {loading && tracks.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-3" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}>
                <Loader2 size={13} className="animate-spin" />
                <span className="text-xs">Finding videos on YouTube…</span>
              </div>
            )}
          </div>

          <p className="mt-5 px-4 text-xs" style={{ color: "rgba(255,255,255,0.1)", fontFamily: "Inter" }}>
            {tracks.length} tracks · Double-click to play
          </p>
        </div>
      )}

      {/* ── Albums tab ────────────────────────────── */}
      {activeTab === "albums" && (
        <div className="px-8 md:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {artist.albums.map((album, i) => (
              <div key={i} className="group cursor-pointer">
                <div
                  className="aspect-square rounded-2xl mb-3 flex items-center justify-center overflow-hidden relative transition-all duration-300 group-hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${artist.color}20 0%, ${artist.color}06 100%)`,
                    border: `1px solid ${artist.color}12`,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "conic-gradient(from 0deg, #1a1a1a, #2a2a2a 90deg, #111 180deg, #222 270deg)",
                      border: "2px solid #2a2a2a",
                    }}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ background: artist.color + "70" }} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"
                    style={{ background: "rgba(0,0,0,0.45)" }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: artist.color }}>
                      <Play size={16} color="#0a0804" style={{ marginLeft: 2 }} />
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.78)", fontFamily: "Playfair Display" }}>
                  {album.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}>
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
          <div>
            <h3 className="text-lg text-amber-100 mb-4" style={{ fontFamily: "Playfair Display" }}>Biography</h3>
            <p className="text-zinc-400 text-sm leading-loose" style={{ fontFamily: "Inter" }}>{artist.bio}</p>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.18)", fontFamily: "Inter" }}>
                Details
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: "Born",   value: artist.born },
                  { label: "Origin", value: artist.origin },
                  { label: "Active", value: artist.activeYears },
                  { label: "Genres", value: artist.tags.join(", ") },
                  ...(artist.died ? [{ label: "Died", value: artist.died }] : []),
                ].map(d => (
                  <div key={d.label} className="flex gap-3">
                    <span className="text-xs text-zinc-600 w-14 flex-shrink-0" style={{ fontFamily: "Inter" }}>{d.label}</span>
                    <span className="text-xs text-zinc-400" style={{ fontFamily: "Inter" }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
            {artist.awards?.length > 0 && (
              <div>
                <h3 className="text-[10px] tracking-widest uppercase mb-3 flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.18)", fontFamily: "Inter" }}>
                  <Award size={10} /> Awards
                </h3>
                {artist.awards.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: artist.color + "50" }} />
                    <p className="text-xs text-zinc-500" style={{ fontFamily: "Inter" }}>{a}</p>
                  </div>
                ))}
              </div>
            )}
            {artist.influences?.length > 0 && (
              <div>
                <h3 className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.18)", fontFamily: "Inter" }}>
                  Influences
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artist.influences.map((inf, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full" style={{
                      background: artist.color + "0e",
                      color: artist.color + "88",
                      border: `1px solid ${artist.color}15`,
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
