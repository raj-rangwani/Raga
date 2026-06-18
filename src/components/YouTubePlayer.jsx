// src/components/YouTubePlayer.jsx
// SINGLE instance — never unmounts after first mount.
// Switches tracks via loadVideoById() — no remount, no double audio, no white screen.

import { useEffect, useRef, useState } from "react"
import { useMusicPlayer } from "./MusicPlayerContext"

export default function YouTubePlayer() {
  const {
    currentSong,
    isPlaying,
    handleNext,
    ytPlayerRef,
    videoVisible,
    setVideoVisible,
    setIsPlaying,
    onYTStateChange,
    volume,
  } = useMusicPlayer()

  const containerRef  = useRef(null)
  const loadedVideoId = useRef(null)
  const [ytReady, setYtReady] = useState(!!window.YT?.Player)

  // ── Load YouTube IFrame API once ────────────────────────────
  useEffect(() => {
    if (window.YT?.Player) { setYtReady(true); return }

    // If script already added by another component, just poll
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const poll = setInterval(() => {
        if (window.YT?.Player) { setYtReady(true); clearInterval(poll) }
      }, 100)
      return () => clearInterval(poll)
    }

    const tag    = document.createElement("script")
    tag.src      = "https://www.youtube.com/iframe_api"
    tag.async    = true
    document.head.appendChild(tag)

    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { prev?.(); setYtReady(true) }
  }, [])

  // ── Create the player ONCE when API is ready ─────────────────
  // Never destroy it. Use loadVideoById for all track switches.
  useEffect(() => {
    if (!ytReady) return
    if (ytPlayerRef.current) return  // already created

    const div   = document.createElement("div")
    div.id      = "yt-main-player"
    containerRef.current?.appendChild(div)

    ytPlayerRef.current = new window.YT.Player("yt-main-player", {
      height: "100%",
      width:  "100%",
      playerVars: {
        autoplay:       0,
        controls:       0,
        mute:           0,
        rel:            0,
        modestbranding: 1,
        playsinline:    1,
        origin:         window.location.origin,
      },
      events: {
        onReady(e) {
          e.target.setVolume(volume ?? 80)
          // If a song was queued before player was ready, load it now
          if (currentSong?.videoId && loadedVideoId.current !== currentSong.videoId) {
            loadedVideoId.current = currentSong.videoId
            e.target.loadVideoById({ videoId: currentSong.videoId, startSeconds: 0 })
          }
        },
        onStateChange(e) {
          onYTStateChange(e.data)
        },
        onError(e) {
          console.warn("YT player error:", e.data)
          handleNext()
        },
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytReady])

  // ── Switch track when videoId changes — NO remount ───────────
  useEffect(() => {
    if (!currentSong?.videoId) return
    if (loadedVideoId.current === currentSong.videoId) return
    if (!ytPlayerRef.current) return

    loadedVideoId.current = currentSong.videoId

    // Stop current audio FIRST to prevent overlap
    try { ytPlayerRef.current.stopVideo?.() } catch {}

    // Small delay so stopVideo settles before loading new video
    setTimeout(() => {
      try {
        ytPlayerRef.current?.loadVideoById?.({
          videoId:      currentSong.videoId,
          startSeconds: 0,
        })
        ytPlayerRef.current?.setVolume?.(volume ?? 80)
      } catch (err) {
        console.error("loadVideoById error:", err)
      }
    }, 80)
  }, [currentSong?.videoId])

  // ── Volume sync ───────────────────────────────────────────────
  useEffect(() => {
    try { ytPlayerRef.current?.setVolume?.(volume) } catch {}
  }, [volume])

  // The container is always in the DOM — only visibility changes
  return (
    <div
      style={{
        position:   "fixed",
        top:        videoVisible ? 0        : "-9999px",
        left:       videoVisible ? 0        : "-9999px",
        width:      videoVisible ? "100vw"  : "1px",
        height:     videoVisible ? "100vh"  : "1px",
        zIndex:     videoVisible ? 10000    : -1,
        opacity:    videoVisible ? 1        : 0,
        background: "#000",
        transition: "opacity 0.35s ease",
        pointerEvents: videoVisible ? "auto" : "none",
      }}
    >
      {/* Overlay controls — only shown when video is visible */}
      {videoVisible && (
        <>
          <button
            onClick={() => setVideoVisible(false)}
            style={{
              position: "absolute", top: 20, right: 20, zIndex: 10001,
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(0,0,0,0.75)",
              border: "1px solid rgba(196,168,130,0.35)",
              color: "#c4a882", fontSize: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", backdropFilter: "blur(8px)",
            }}
          >✕</button>
          <div style={{
            position: "absolute", top: 20, left: 20, zIndex: 10001,
            padding: "8px 16px", borderRadius: 100,
            background: "rgba(0,0,0,0.65)",
            border: "1px solid rgba(196,168,130,0.2)",
            backdropFilter: "blur(10px)",
          }}>
            <p style={{ color: "#f0dfc0", fontFamily: "Playfair Display, serif", fontSize: 14, margin: 0 }}>
              {currentSong?.title}
            </p>
            <p style={{ color: "rgba(196,168,130,0.6)", fontFamily: "Inter, sans-serif", fontSize: 11, margin: "2px 0 0" }}>
              {currentSong?.artist}
            </p>
          </div>
        </>
      )}

      {/* Player container — always mounted */}
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}