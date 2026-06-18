// src/components/MusicPlayerContext.jsx
import { createContext, useContext, useState, useRef, useCallback } from "react"
import { SONGS } from "../data/songs"

const MusicPlayerContext = createContext(null)
export const useMusicPlayer = () => useContext(MusicPlayerContext)

function getLyrics(title) {
  if (!title) return []
  const match = SONGS.find(s =>
    s.title.toLowerCase() === title.toLowerCase() ||
    title.toLowerCase().includes(s.title.toLowerCase().slice(0, 12))
  )
  return match?.lyrics || []
}

export function MusicPlayerProvider({ children }) {
  const [currentSong,  setCurrentSong]   = useState(null)
  const [isPlaying,    setIsPlayingState] = useState(false)
  const [elapsed,      setElapsed]        = useState(0)
  const [progress,     setProgress]       = useState(0)
  const [liked,        setLiked]          = useState(new Set())
  const [queue,        setQueue]          = useState([])
  const [queueIndex,   setQueueIndex]     = useState(0)
  const [volume,       setVolumeState]    = useState(80)
  const [videoVisible, setVideoVisible]   = useState(false)

  // Single YT player instance — registered by YouTubePlayer.jsx on onReady
  const ytPlayerRef   = useRef(null)
  const tickRef       = useRef(null)
  const handleNextRef = useRef(null)
  const isPlayingRef  = useRef(false)

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
      isPlayingRef.current = false
      setIsPlayingState(false)
      stopTick()
      handleNextRef.current?.()
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

  const toggleLike = useCallback((title) => {
    setLiked(prev => {
      const next = new Set(prev)
      next.has(title) ? next.delete(title) : next.add(title)
      return next
    })
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
      liked, queue, songData, totalDuration,
      volume, videoVisible,
      formatTime,
      ytPlayerRef,
      playSong, togglePlay, handleNext, handlePrev,
      seek, toggleLike, setIsPlaying, setVolume,
      toggleVideo, setVideoVisible,
      onYTStateChange,
    }}>
      {children}
    </MusicPlayerContext.Provider>
  )
}