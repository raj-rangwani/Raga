// src/components/MusicPlayerContext.jsx
import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react"
import { useSongs } from "../context/DataContext"
import PlaylistSelectionPopup from "./PlaylistSelectionPopup"

const INITIAL_PLAYLISTS = [
  {
    id: "liked",
    title: "Liked Songs",
    subtitle: "Personal Collection",
    description: "The songs that stayed long after the night ended. Each one a chapter.",
    count: 0,
    color: "#c4a882",
    glow: "rgba(196,168,130,0.12)",
    private: true,
    songs: [],
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
      { title: "Jhuki Jhuki Si Nazar",       artist: "Jagjit Singh",        duration: "5:01", year: "1990", plays: "1.8M" },
      { title: "Chitthi Na Koi Sandesh",     artist: "Jagjit Singh",        duration: "6:40", year: "1999", plays: "4.2M" },
      { title: "Lag Jaa Gale",               artist: "Lata Mangeshkar",     duration: "3:55", year: "1964", plays: "9.1M" },
      { title: "Yeh Jo Halka Halka Suroor Hai", artist: "Nusrat Fateh Ali Khan", duration: "7:12", year: "1986", plays: "3.3M" },
      { title: "Dil Dhoondta Hai",           artist: "Bhupinder Singh",     duration: "5:44", year: "1975", plays: "2.2M" },
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
      { title: "Koi Fariyaad",              artist: "Jagjit Singh",          duration: "8:09", year: "2003", plays: "5.7M" },
      { title: "Dam Mast Qalandar",         artist: "Nusrat Fateh Ali Khan", duration: "9:30", year: "1987", plays: "12.4M" },
      { title: "Yeh Dil Yeh Pagal Dil Mera", artist: "Mehdi Hassan",        duration: "5:55", year: "1969", plays: "2.9M" },
      { title: "Allah Hoo",                 artist: "Nusrat Fateh Ali Khan", duration: "8:44", year: "1990", plays: "8.7M" },
      { title: "Abhi Na Jao Chhod Kar",    artist: "Asha Bhosle",           duration: "3:40", year: "1960", plays: "7.2M" },
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
      { title: "Mere Rashke Qamar",  artist: "Nusrat Fateh Ali Khan", duration: "6:15", year: "1986", plays: "6.8M" },
      { title: "O Re Piya",         artist: "Rahat Fateh Ali Khan",   duration: "5:28", year: "2007", plays: "4.5M" },
      { title: "Mast Qalandar",     artist: "Abida Parveen",          duration: "11:20", year: "1988", plays: "3.1M" },
      { title: "Tu Jhoom",          artist: "Abida Parveen",          duration: "5:02", year: "2022", plays: "2.7M" },
    ],
  },
]

const MusicPlayerContext = createContext(null)
export const useMusicPlayer = () => useContext(MusicPlayerContext)

export function MusicPlayerProvider({ children }) {
  const { songs } = useSongs()

  function getLyrics(title) {
    if (!title || !songs) return []
    const match = songs.find(s =>
      s.title.toLowerCase() === title.toLowerCase() ||
      title.toLowerCase().includes(s.title.toLowerCase().slice(0, 12))
    )
    return match?.lyrics || []
  }

  const [currentSong,  setCurrentSong]    = useState(null)
  const [isPlaying,    setIsPlayingState] = useState(false)
  const [elapsed,      setElapsed]        = useState(0)
  const [progress,     setProgress]       = useState(0)
  const [playlists,    setPlaylists]      = useState(() => {
    try {
      const saved = localStorage.getItem("raga_playlists")
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn("Failed to load playlists", e)
    }
    return INITIAL_PLAYLISTS
  })
  const [queue,        setQueue]          = useState([])
  const [queueIndex,   setQueueIndex]     = useState(0)
  const [volume,       setVolumeState]    = useState(80)
  const [videoVisible, setVideoVisible]   = useState(false)
  const [repeat,       setRepeatState]    = useState(false)

  // Single YT player instance — registered by YouTubePlayer.jsx on onReady
  const ytPlayerRef   = useRef(null)
  const tickRef       = useRef(null)
  const handleNextRef = useRef(null)
  const isPlayingRef  = useRef(false)
  const repeatRef     = useRef(false)

  // ── Persistence ──────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem("raga_playlists", JSON.stringify(playlists))
    } catch (e) {
      console.warn("Failed to save playlists", e)
    }
  }, [playlists])

  // ── Tick ─────────────────────────────────────────────────────
  function startTick() {
    stopTick()
    tickRef.current = setInterval(() => {
      try {
        const t = ytPlayerRef.current?.getCurrentTime?.() ?? 0
        const d = ytPlayerRef.current?.getDuration?.()    ?? 1
        setElapsed(Math.floor(t))
        setProgress(d > 0 ? (t / d) * 100 : 0)
      } catch {}
    }, 1000)
  }
  function stopTick() { clearInterval(tickRef.current) }

  // ── Called by YouTubePlayer onStateChange ─────────────────────
  const onYTStateChange = useCallback((ytState) => {
    const S = { PLAYING: 1, PAUSED: 2, ENDED: 0, BUFFERING: 3, CUED: 5 }
    if (ytState === S.PLAYING) {
      isPlayingRef.current = true
      setIsPlayingState(true)
      startTick()
    }
    if (ytState === S.PAUSED) {
      isPlayingRef.current = false
      setIsPlayingState(false)
      stopTick()
    }
    if (ytState === S.ENDED) {
      if (repeatRef.current) {
        try {
          ytPlayerRef.current?.seekTo?.(0, true)
          ytPlayerRef.current?.playVideo?.()
        } catch {}
      } else {
        isPlayingRef.current = false
        setIsPlayingState(false)
        stopTick()
        handleNextRef.current?.()
      }
    }
  }, [])

  // ── Volume ────────────────────────────────────────────────────
  const setVolume = useCallback((v) => {
    setVolumeState(v)
    try { ytPlayerRef.current?.setVolume?.(v) } catch {}
  }, [])

  // ── playSong — sets state; YouTubePlayer's useEffect does the switch ──
  // song MUST have videoId. queue items also need videoId (pre-fetched by caller).
  const playSong = useCallback((song, newQueue = null) => {
    if (!song?.videoId) {
      console.warn("playSong: no videoId — aborting", song)
      return
    }

    setCurrentSong(song)
    setElapsed(0)
    setProgress(0)
    // isPlaying will flip to true via onYTStateChange → PLAYING event

    if (newQueue?.length) {
      // Only keep queue items that have a real videoId
      // Callers (Playlist, ArtistDetail) are responsible for pre-fetching all IDs
      const filtered = newQueue.filter(s => s?.videoId)
      setQueue(filtered)
      const idx = filtered.findIndex(s => s.videoId === song.videoId)
      setQueueIndex(idx >= 0 ? idx : 0)
    }
  }, [])

  // ── setIsPlaying — ONLY way for UI to pause/play ──────────────
  const setIsPlaying = useCallback((vOrFn) => {
    try {
      const next = typeof vOrFn === "function" ? vOrFn(isPlayingRef.current) : vOrFn
      if (next) ytPlayerRef.current?.playVideo?.()
      else      ytPlayerRef.current?.pauseVideo?.()
    } catch {}
  }, [])

  const togglePlay = useCallback(() => setIsPlaying(p => !p), [setIsPlaying])
  const toggleVideo = useCallback(() => setVideoVisible(v => !v), [])
  const setRepeat = useCallback((vOrFn) => {
    const next = typeof vOrFn === "function" ? vOrFn(repeatRef.current) : vOrFn
    repeatRef.current = next
    setRepeatState(next)
  }, [])

  // ── Next / Prev ───────────────────────────────────────────────
  // Uses functional setQueue/setQueueIndex to always read latest state —
  // avoids stale closure issues in onYTStateChange → ENDED path
  const handleNext = useCallback(() => {
    setQueue(q => {
      if (!q.length) return q
      setQueueIndex(qi => {
        const nextIdx = (qi + 1) % q.length
        const nextSong = q[nextIdx]
        if (nextSong?.videoId) {
          // Update currentSong directly — don't call playSong to avoid queue reset
          setCurrentSong(nextSong)
          setElapsed(0)
          setProgress(0)
          // YouTubePlayer's useEffect on currentSong.videoId will fire loadVideoById
        }
        return nextIdx
      })
      return q
    })
  }, [])
  handleNextRef.current = handleNext

  const handlePrev = useCallback(() => {
    // If more than 3 seconds in, restart current song
    try {
      const t = ytPlayerRef.current?.getCurrentTime?.() ?? 0
      if (t > 3) { ytPlayerRef.current?.seekTo?.(0, true); return }
    } catch {}

    setQueue(q => {
      if (!q.length) return q
      setQueueIndex(qi => {
        const prevIdx = (qi - 1 + q.length) % q.length
        const prevSong = q[prevIdx]
        if (prevSong?.videoId) {
          setCurrentSong(prevSong)
          setElapsed(0)
          setProgress(0)
        }
        return prevIdx
      })
      return q
    })
  }, [])

  const seek = useCallback((pct) => {
    try {
      const d = ytPlayerRef.current?.getDuration?.() ?? 0
      if (d > 0) {
        const t = (pct / 100) * d
        ytPlayerRef.current?.seekTo?.(t, true)
        setElapsed(Math.floor(t))
        setProgress(pct)
      }
    } catch {}
  }, [])

  const [popupState, setPopupState] = useState({ isOpen: false, song: null })

  const openPlaylistPopup = useCallback((song) => {
    setPopupState({ isOpen: true, song })
  }, [])

  const closePlaylistPopup = useCallback(() => {
    setPopupState({ isOpen: false, song: null })
  }, [])

  const updateSongPlaylists = useCallback((song, playlistIds) => {
    setPlaylists(prev => prev.map(pl => {
      const hasSong = pl.songs.some(s => s.title === song.title)
      const shouldHaveSong = playlistIds.includes(pl.id)
      
      if (shouldHaveSong && !hasSong) {
        return { ...pl, songs: [...pl.songs, song], count: pl.songs.length + 1 }
      } else if (!shouldHaveSong && hasSong) {
        return { ...pl, songs: pl.songs.filter(s => s.title !== song.title), count: pl.songs.length - 1 }
      }
      return pl
    }))
  }, [])

  const createPlaylist = useCallback((name, song = null) => {
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
    const newPlaylist = {
      id,
      title: name,
      subtitle: "Custom Playlist",
      description: "A new playlist created by you.",
      count: song ? 1 : 0,
      color: "#e0e0e0",
      glow: "rgba(224,224,224,0.12)",
      private: true,
      songs: song ? [song] : [],
    }
    setPlaylists(prev => [...prev, newPlaylist])
    return id
  }, [])

  const formatTime = (s) => {
    const m = Math.floor((s || 0) / 60)
    return `${m}:${String((s || 0) % 60).padStart(2, "0")}`
  }

  const totalDuration = currentSong?.durationSec || 0
  const songData = currentSong ? { lyrics: getLyrics(currentSong.title) } : null

  return (
    <MusicPlayerContext.Provider value={{
      currentSong, isPlaying, progress, elapsed,
      playlists, queue, songData, totalDuration,
      volume, videoVisible,
      formatTime,
      ytPlayerRef,
      playSong, togglePlay, handleNext, handlePrev,
      seek, openPlaylistPopup, setIsPlaying, setVolume,
      toggleVideo, setVideoVisible, repeat, setRepeat,
      onYTStateChange,
    }}>
      {children}
      <PlaylistSelectionPopup
        isOpen={popupState.isOpen}
        onClose={closePlaylistPopup}
        song={popupState.song}
        playlists={playlists}
        onUpdatePlaylists={updateSongPlaylists}
        onCreatePlaylist={createPlaylist}
      />
    </MusicPlayerContext.Provider>
  )
}