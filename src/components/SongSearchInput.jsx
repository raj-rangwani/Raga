// src/components/SongSearchInput.jsx
// Chitthi song search — local SONGS first, then YouTube suggestions

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Music2, User, X, Loader2 } from "lucide-react"

// ── Fuzzy match local songs ───────────────────────────────────
function searchLocalSongs(songs, query) {
  if (!query.trim() || !songs.length) return []
  const q = query.toLowerCase()
  return songs
    .filter(s =>
      s?.title?.toLowerCase().includes(q) ||
      s?.artist?.toLowerCase().includes(q) ||
      s?.album?.toLowerCase().includes(q) ||
      s?.tags?.some(t => t?.toLowerCase().includes(q))
    )
    .slice(0, 5)
    .map(s => ({
      type:      "local",
      songName:  s.title,
      artist:    s.artist,
      videoId:   s.videoId   || null,
      thumbnail: s.thumbnail || null,
      genre:     s.genre?.[0] || "Ghazal",
      id:        s.id,
    }))
}

// ── YouTube search ────────────────────────────────────────────
const YT_SEARCH_KEY = import.meta.env?.VITE_YOUTUBE_API_KEY
const ytCache = new Map()

async function searchYouTube(query) {
  if (!YT_SEARCH_KEY || !query.trim()) return []
  const cacheKey = `yt_${query}`
  if (ytCache.has(cacheKey)) return ytCache.get(cacheKey)
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search")
    url.searchParams.set("key",             YT_SEARCH_KEY)
    url.searchParams.set("q",               `${query} ghazal`)
    url.searchParams.set("part",            "snippet")
    url.searchParams.set("type",            "video")
    url.searchParams.set("maxResults",      "5")
    url.searchParams.set("videoCategoryId", "10")
    url.searchParams.set("videoEmbeddable", "true")
    const res  = await fetch(url.toString())
    if (!res.ok) return []
    const data = await res.json()
    const results = (data.items || []).map(item => ({
      type:      "youtube",
      songName:  cleanTitle(item.snippet.title),
      artist:    item.snippet.channelTitle,
      videoId:   item.id.videoId,
      thumbnail: item.snippet.thumbnails?.default?.url,
      id:        item.id.videoId,
    }))
    ytCache.set(cacheKey, results)
    return results
  } catch { return [] }
}

function cleanTitle(title) {
  return title
    .replace(/\s*[-–|]\s*(official|full|video|audio|hd|lyrics?|ghazal|song).*/i, "")
    .replace(/\s*\(.*?\)\s*/g, "")
    .replace(/\s*\[.*?\]\s*/g, "")
    .trim()
}

// ── Main component ────────────────────────────────────────────
export default function SongSearchInput({ color, onSelect, placeholder }) {
  const [songs,        setSongs]        = useState([])   // loaded lazily
  const [query,        setQuery]        = useState("")
  const [localResults, setLocalResults] = useState([])
  const [ytResults,    setYtResults]    = useState([])
  const [loadingYt,    setLoadingYt]    = useState(false)
  const [open,         setOpen]         = useState(false)
  const [activeIdx,    setActiveIdx]    = useState(-1)
  const [selectedSong, setSelectedSong] = useState(null)

  const inputRef     = useRef(null)
  const containerRef = useRef(null)
  const ytTimerRef   = useRef(null)

  // ── Lazy-load songs so a broken import never crashes the page ─
  useEffect(() => {
    import("../data/songs")
      .then(mod => {
        const raw = mod?.SONGS ?? mod?.default ?? []
        setSongs(Array.isArray(raw) ? raw : [])
      })
      .catch(() => setSongs([]))
  }, [])

  // ── Click outside ────────────────────────────────────────────
  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ── Search on query change ───────────────────────────────────
  useEffect(() => {
    if (!query.trim()) {
      setLocalResults([]); setYtResults([]); setOpen(false); setActiveIdx(-1)
      return
    }
    setLocalResults(searchLocalSongs(songs, query))
    setOpen(true)
    setActiveIdx(-1)

    clearTimeout(ytTimerRef.current)
    ytTimerRef.current = setTimeout(async () => {
      setLoadingYt(true)
      setYtResults(await searchYouTube(query))
      setLoadingYt(false)
    }, 400)
    return () => clearTimeout(ytTimerRef.current)
  }, [query, songs])

  const allResults = [
    ...localResults,
    ...ytResults.filter(yt => !localResults.some(l => l.videoId && l.videoId === yt.videoId)),
  ]

  const handleSelect = useCallback((item) => {
    setSelectedSong(item)
    setQuery(item.songName)
    setOpen(false)
    onSelect?.(item)
  }, [onSelect])

  const handleClear = () => {
    setQuery(""); setSelectedSong(null); setLocalResults([]); setYtResults([])
    onSelect?.(null); inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (!open || !allResults.length) return
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, allResults.length - 1)) }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)) }
    if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); handleSelect(allResults[activeIdx]) }
    if (e.key === "Escape")    { setOpen(false); inputRef.current?.blur() }
  }

  const showDropdown = open && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex items-center relative transition-all duration-300"
        style={{
          background:   "rgba(255,255,255,0.06)",
          border:       `1px solid ${showDropdown ? color + "50" : color + "25"}`,
          borderRadius: showDropdown ? "12px 12px 0 0" : "12px",
          boxShadow:    showDropdown ? `0 0 0 3px ${color}10` : "none",
        }}
      >
        <Search size={14} className="absolute left-3.5 flex-shrink-0" style={{ color: color + "70" }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setSelectedSong(null) }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Search for a song or ghazal..."}
          className="w-full bg-transparent py-3 pl-9 pr-8 text-sm text-white placeholder-zinc-600 outline-none"
          style={{ fontFamily: "Playfair Display" }}
        />
        {query && (
          <button onClick={handleClear} className="absolute right-3" style={{ color: "rgba(255,255,255,0.2)" }}>
            <X size={13} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 z-50"
          style={{
            background:     "linear-gradient(to bottom, #14100a, #100d08)",
            border:         `1px solid ${color}25`,
            borderTop:      "none",
            borderRadius:   "0 0 12px 12px",
            boxShadow:      "0 16px 40px rgba(0,0,0,0.7)",
            maxHeight:      "280px",
            overflowY:      "auto",
            scrollbarWidth: "none",
          }}
        >
          {localResults.length > 0 && (
            <>
              <div className="px-3 pt-2.5 pb-1">
                <p className="text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}>
                  From Library
                </p>
              </div>
              {localResults.map((item, i) => (
                <ResultRow key={item.id} item={item} color={color}
                  isActive={activeIdx === i} onSelect={() => handleSelect(item)} />
              ))}
            </>
          )}

          {(ytResults.length > 0 || loadingYt) && (
            <>
              <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#ff4444", fontFamily: "Inter" }}>YT</span>
                <p className="text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Inter" }}>YouTube</p>
                {loadingYt && <Loader2 size={9} className="animate-spin ml-1"
                  style={{ color: "rgba(255,255,255,0.2)" }} />}
              </div>
              {ytResults
                .filter(yt => !localResults.some(l => l.videoId && l.videoId === yt.videoId))
                .map((item, i) => (
                  <ResultRow key={item.id} item={item} color={color}
                    isActive={activeIdx === localResults.length + i}
                    onSelect={() => handleSelect(item)} />
                ))}
            </>
          )}

          {!loadingYt && allResults.length === 0 && (
            <div className="px-4 py-6 text-center">
              <Music2 size={20} className="mx-auto mb-2" style={{ color: "rgba(255,255,255,0.1)" }} />
              <p className="text-xs text-zinc-700" style={{ fontFamily: "Inter" }}>No songs found</p>
              <p className="text-[11px] text-zinc-800 mt-1" style={{ fontFamily: "Inter" }}>
                You can still type the name manually
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ResultRow({ item, color, isActive, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100"
      style={{ background: isActive ? color + "12" : "transparent" }}
      onMouseEnter={e => e.currentTarget.style.background = color + "0d"}
      onMouseLeave={e => e.currentTarget.style.background = isActive ? color + "12" : "transparent"}
    >
      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
        style={{ background: color + "15", border: `1px solid ${color}18` }}>
        {item.thumbnail
          ? <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
          : <Music2 size={13} style={{ color: color + "80" }} />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm truncate"
          style={{ color: "rgba(255,255,255,0.88)", fontFamily: "Playfair Display" }}>
          {item.songName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <User size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
          <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "Inter" }}>
            {item.artist}
          </p>
          {item.genre && (
            <>
              <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
              <p className="text-[11px]" style={{ color: color + "60", fontFamily: "Inter" }}>{item.genre}</p>
            </>
          )}
        </div>
      </div>

      <span className="text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 uppercase tracking-wider"
        style={{
          background: item.type === "youtube" ? "rgba(255,60,60,0.12)" : color + "12",
          color:      item.type === "youtube" ? "#ff6060" : color + "90",
          fontFamily: "Inter",
        }}>
        {item.type === "youtube" ? "YT" : "✓"}
      </span>
    </button>
  )
}
