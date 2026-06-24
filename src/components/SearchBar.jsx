// src/components/SearchBar.jsx
import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X, Music2, User, ListMusic, TrendingUp } from "lucide-react"
import { getSuggestions } from "../utils/search"
import { useMusicPlayer } from "./MusicPlayerContext"
import { useData } from "../context/DataContext"
import { searchSong } from "../utils/youtube"

const TYPE_CONFIG = {
  artist:   { icon: User,      color: "#c4a882", label: "Artist"   },
  song:     { icon: Music2,    color: "#8ba9c4", label: "Song"     },
  playlist: { icon: ListMusic, color: "#82b89a", label: "Playlist" },
}

const HOT_SEARCHES = [
  "Jagjit Singh", "Mehdi Hassan", "Nusrat", "Ghazal", "Qawwali", "Ranjish Hi Sahi"
]

export default function SearchBar({
  placeholder = "Search artists, songs, playlists…",
  onSelect,
  autoFocus = false,
  className = "",
}) {
  const [query,       setQuery]       = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [focused,     setFocused]     = useState(false)
  const [activeIdx,   setActiveIdx]   = useState(-1)
  const [loadingId,   setLoadingId]   = useState(null) // song id being fetched

  const inputRef     = useRef(null)
  const containerRef = useRef(null)
  const navigate     = useNavigate()
  const { playSong } = useMusicPlayer()
  const { artists, songs } = useData()

  // Debounced suggestions
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); setActiveIdx(-1); return }
    const t = setTimeout(() => {
      setSuggestions(getSuggestions(query, artists, songs))
      setActiveIdx(-1)
    }, 120)
    return () => clearTimeout(t)
  }, [query, artists, songs])

  // Click outside closes dropdown
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setFocused(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = useCallback(async (item) => {
    setQuery(item.label)
    setFocused(false)
    setSuggestions([])

    // If caller provided custom handler, use it
    if (onSelect) { onSelect(item); return }

    if (item.type === "artist") {
      // Navigate to the specific artist detail page
      navigate(`/artist/${item.id}`)
    } else if (item.type === "playlist") {
      navigate("/playlists")
    } else if (item.type === "song") {
      // Search YouTube for the song and play it directly
      setLoadingId(item.id)
      try {
        const result = await searchSong(item.label, item.sub)
        if (result?.videoId) {
          playSong({
            title:       item.label,
            artist:      item.sub,
            videoId:     result.videoId,
            thumbnail:   result.thumbnail  || null,
            duration:    result.duration   || null,
            durationSec: result.durationSec || null,
          })
        }
      } catch (e) {
        console.warn("SearchBar: YouTube fetch failed", e)
      } finally {
        setLoadingId(null)
      }
    }
  }, [navigate, onSelect, playSong])

  const handleHotSearch = (term) => {
    setQuery(term)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    const items = suggestions
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, items.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)) }
    else if (e.key === "Enter") {
      if (activeIdx >= 0 && items[activeIdx]) handleSelect(items[activeIdx])
      else if (items[0]) handleSelect(items[0])
    } else if (e.key === "Escape") {
      setFocused(false)
      inputRef.current?.blur()
    }
  }

  const showDropdown = focused && (suggestions.length > 0 || query.length === 0)

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className="relative flex items-center transition-all duration-300"
        style={{
          background:   focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
          border:       focused ? "1px solid rgba(196,168,130,0.35)" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: showDropdown ? "16px 16px 0 0" : "16px",
          boxShadow:    focused ? "0 0 0 3px rgba(196,168,130,0.06)" : "none",
        }}
      >
        <Search
          size={16}
          className="absolute left-4 transition-colors duration-200"
          style={{ color: focused ? "#c4a882" : "rgba(255,255,255,0.25)" }}
        />
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent py-3.5 pl-10 pr-10 text-sm text-white placeholder-zinc-600 outline-none"
          style={{ fontFamily: "Inter" }}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setSuggestions([]); inputRef.current?.focus() }}
            className="absolute right-3 text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute left-0 right-0 z-[200] overflow-hidden"
          style={{
            background:   "linear-gradient(to bottom, #110c06, #0d0908)",
            border:       "1px solid rgba(196,168,130,0.15)",
            borderTop:    "none",
            borderRadius: "0 0 16px 16px",
            boxShadow:    "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          {suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((item, i) => {
                const cfg  = TYPE_CONFIG[item.type]
                const Icon = cfg.icon
                const isLoading = loadingId === item.id
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    disabled={!!loadingId}
                    className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 text-left"
                    style={{ background: i === activeIdx ? "rgba(196,168,130,0.07)" : "transparent" }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: cfg.color + "18" }}
                    >
                      {isLoading
                        ? <div className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin" style={{ borderColor: cfg.color }} />
                        : <Icon size={14} style={{ color: cfg.color }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Playfair Display" }}>
                        {highlightMatch(item.label, query)}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "Inter" }}>
                        {item.type === "song" ? `${item.sub} · tap to play` : item.sub}
                      </p>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: cfg.color + "15", color: cfg.color, fontFamily: "Inter" }}
                    >
                      {cfg.label}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            /* Hot searches when input is empty */
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={12} style={{ color: "rgba(196,168,130,0.5)" }} />
                <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}>
                  Trending
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {HOT_SEARCHES.map(term => (
                  <button
                    key={term}
                    onClick={() => handleHotSearch(term)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border:     "1px solid rgba(255,255,255,0.08)",
                      color:      "rgba(255,255,255,0.5)",
                      fontFamily: "Inter",
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function highlightMatch(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: "#c4a882", fontWeight: 600 }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}