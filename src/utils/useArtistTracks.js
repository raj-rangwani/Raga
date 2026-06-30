// src/utils/useArtistTracks.js
// Custom hook — loads artist tracks from YouTube API
// Falls back to static songs.js data if API key is missing or quota hit

import { useState, useEffect } from "react"
import { useSongs } from "../context/DataContext"
import { searchArtistTopTracks, enrichSongsWithYouTube } from "./youtube"

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

export function useArtistTracks(artistId, artistName) {
  const [tracks, setTracks]   = useState([])
  const [localLoading, setLocalLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [source, setSource]   = useState("static") // "static" | "youtube" | "enriched"
  const { getSongsByArtist, loading: dataLoading } = useSongs()

  useEffect(() => {
    if (!artistId || !artistName || dataLoading) return

    let cancelled = false
    setLocalLoading(true)
    setError(null)

    // Always load static songs immediately (instant, no flicker)
    const staticSongs = getSongsByArtist(artistId)
    if (!cancelled) {
      setTracks(staticSongs)
      setSource("static")
    }

    // If no API key, stop here. Rows without videoId are visible but not playable.
    if (!API_KEY || API_KEY === "undefined") {
      setLocalLoading(false)
      return
    }

    // With API key: try two strategies in parallel
    const enrichStatic = enrichSongsWithYouTube(staticSongs)
    const fetchFresh   = searchArtistTopTracks(artistName, 20)

    Promise.allSettled([enrichStatic, fetchFresh]).then(([enrichedResult, freshResult]) => {
      if (cancelled) return

      // Strategy 1: if fresh YouTube results came back, prefer those (more tracks)
      if (freshResult.status === "fulfilled" && freshResult.value?.length > 0) {
        const fresh = freshResult.value
        // Merge with static data to get lyrics info
        const merged = fresh.map(yt => {
          const staticMatch = staticSongs.find(s =>
            s.title.toLowerCase().includes(yt.title.toLowerCase().slice(0, 15)) ||
            yt.title.toLowerCase().includes(s.title.toLowerCase().slice(0, 15))
          )
          return {
            id:           yt.videoId,
            title:        staticMatch?.title || cleanYTTitle(yt.title, artistName),
            artist:       artistName,
            artistId,
            videoId:      yt.videoId,
            thumbnail:    yt.thumbnail,
            duration:     yt.duration,
            durationSec:  yt.durationSec,
            plays:        yt.viewsFormatted,
            year:         yt.publishedAt?.slice(0, 4) || "—",
            album:        staticMatch?.album || "—",
            genre:        staticMatch?.genre || ["Ghazal"],
            lyrics:       staticMatch?.lyrics || [],
            tags:         staticMatch?.tags   || [],
          }
        })
        setTracks(merged)
        setSource("youtube")
        setLocalLoading(false)
        return
      }

      // Strategy 2: use enriched static songs (has videoIds now)
      if (
        enrichedResult.status === "fulfilled" &&
        enrichedResult.value?.some(song => song.videoId)
      ) {
        setTracks(enrichedResult.value)
        setSource("enriched")
        setLocalLoading(false)
        return
      }

      // Both failed — static data already set, just stop loading
      const apiError =
        freshResult.status === "rejected"
          ? freshResult.reason?.message
          : enrichedResult.status === "rejected"
            ? enrichedResult.reason?.message
            : "No playable videos found"

      setError(apiError)
      setSource("static")
      setLocalLoading(false)
    }).catch(err => {
      if (!cancelled) {
        setError(err.message)
        setLocalLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [artistId, artistName, dataLoading, getSongsByArtist])

  return { tracks, loading: dataLoading || localLoading, error, source }
}

// Clean YouTube video title: remove " - Official Video", artist name prefix etc.
export function cleanYTTitle(ytTitle, artistName) {
  return ytTitle
    .replace(new RegExp(`^${artistName}\\s*[-–|]\\s*`, "i"), "")
    .replace(/\s*[-–|]\s*(official|full|video|audio|hd|lyrics?|ghazal).*/i, "")
    .replace(/\s*\(.*?\)\s*/g, "")
    .trim()
}
