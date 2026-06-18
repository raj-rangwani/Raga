// src/components/MehfilPlayer.jsx
// Isolated YT player for mehfil rooms.
// KEY BEHAVIOUR:
//   - When videoId changes → load new song from scratch (startSeconds=0)
//   - When same videoId but seekTo changes → seek without reloading
//   - Respects paused flag from Firestore
//   - Calls onReady(playerInstance) and onEnded()

import { useEffect, useRef, useState } from "react"

let counter = 0

export default function MehfilPlayer({ videoId, seekTo = 0, paused = false, onEnded, onReady }) {
  const containerRef = useRef(null)
  const playerRef    = useRef(null)
  const divId        = useRef(`mehfil-yt-${++counter}`)
  const onEndedRef   = useRef(onEnded)
  const onReadyRef   = useRef(onReady)
  const loadedId     = useRef(null)      // track which videoId is currently loaded
  const didSeek      = useRef(false)     // has initial seek been done for this song
  const [ytReady, setYtReady] = useState(!!window.YT?.Player)

  useEffect(() => { onEndedRef.current = onEnded }, [onEnded])
  useEffect(() => { onReadyRef.current = onReady  }, [onReady])

  // ── Load YT API once ──────────────────────────────────────────
  useEffect(() => {
    if (window.YT?.Player) { setYtReady(true); return }
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const poll = setInterval(() => {
        if (window.YT?.Player) { setYtReady(true); clearInterval(poll) }
      }, 100)
      return () => clearInterval(poll)
    }
    const tag = document.createElement("script")
    tag.src   = "https://www.youtube.com/iframe_api"
    tag.async = true
    document.head.appendChild(tag)
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { prev?.(); setYtReady(true) }
  }, [])

  // ── Create player once on mount ───────────────────────────────
  useEffect(() => {
    if (!ytReady) return

    if (containerRef.current) {
      containerRef.current.innerHTML = ""
      const el = document.createElement("div")
      el.id    = divId.current
      containerRef.current.appendChild(el)
    }

    playerRef.current = new window.YT.Player(divId.current, {
      height: "1", width: "1",
      playerVars: {
        autoplay: 0, controls: 0, mute: 0,
        disablekb: 1, fs: 0, modestbranding: 1,
        rel: 0, playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady(e) {
          try { e.target.unMute(); e.target.setVolume(90) } catch {}
          onReadyRef.current?.(e.target)
          // If a videoId is already set, load it now
          if (loadedId.current) {
            e.target.loadVideoById({ videoId: loadedId.current, startSeconds: seekTo || 0 })
            didSeek.current = true
          }
        },
        onStateChange(e) {
          if (e.data === window.YT?.PlayerState?.ENDED) onEndedRef.current?.()
        },
        onError() { onEndedRef.current?.() },
      },
    })

    return () => {
      try { playerRef.current?.destroy() } catch {}
      playerRef.current = null
    }
  // Only run once on mount / ytReady
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytReady])

  // ── React to videoId changes ──────────────────────────────────
  useEffect(() => {
    if (!videoId || !ytReady) return

    if (loadedId.current === videoId) {
      // Same song — don't reload, just handle seek/pause below
      return
    }

    // New song — load it
    loadedId.current = videoId
    didSeek.current  = false

    const p = playerRef.current
    if (!p?.loadVideoById) return   // player not ready yet — onReady handles it

    const startAt = seekTo || 0
    p.loadVideoById({ videoId, startSeconds: startAt })
    didSeek.current = true
  }, [videoId, ytReady])

  // ── React to seekTo changes (join mid-song) ───────────────────
  useEffect(() => {
    if (!videoId || !ytReady) return
    if (didSeek.current) return     // already seeked for this song load
    const p = playerRef.current
    if (!p?.seekTo) return
    if (seekTo > 2) {               // only seek if meaningfully into the song
      p.seekTo(seekTo, true)
      didSeek.current = true
    }
  }, [seekTo, videoId, ytReady])

  // ── React to paused flag ──────────────────────────────────────
  useEffect(() => {
    const p = playerRef.current
    if (!p) return
    try {
      if (paused) p.pauseVideo?.()
      else        p.playVideo?.()
    } catch {}
  }, [paused])

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed", width: 1, height: 1,
        bottom: 0, left: 0, overflow: "hidden",
        opacity: 0, pointerEvents: "none", zIndex: -1,
      }}
    />
  )
}