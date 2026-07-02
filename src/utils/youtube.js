// src/utils/youtube.js
// YouTube Data API v3 — search songs, get video details
// ─────────────────────────────────────────────────────────────
// SETUP:
//   1. Go to console.cloud.google.com
//   2. Create project → Enable "YouTube Data API v3"
//   3. Credentials → Create API Key
//   4. In your project root create .env:
//        VITE_YOUTUBE_API_KEY=AIza...yourkey...
//   5. Restart dev server (npm run dev)
// ─────────────────────────────────────────────────────────────

const API_KEY  = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = "https://www.googleapis.com/youtube/v3"

// ── In-memory cache so we don't burn quota on re-renders ─────
const cache = new Map()

function cacheKey(...args) { return args.join("|") }

// ── Core fetch wrapper ────────────────────────────────────────
async function ytFetch(endpoint, params) {
  const url = new URL(`${BASE_URL}/${endpoint}`)
  url.searchParams.set("key", API_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const key = url.toString()
  if (cache.has(key)) return cache.get(key)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `YouTube API error ${res.status}`)
  }
  const data = await res.json()
  cache.set(key, data)
  return data
}

// ── Search a single song → returns best matching video ───────
// Returns: { videoId, title, thumbnail, duration, durationSec, channelTitle }
export async function searchSong(songTitle, artistName) {
  const query = `${artistName} ${songTitle} ghazal`

  const searchData = await ytFetch("search", {
    q:          query,
    part:       "snippet",
    type:       "video",
    maxResults: 5,
    // Prefer official / topic channels for better quality
    videoCategoryId: "10", // Music category
    videoEmbeddable: "true",
  })

  if (!searchData.items?.length) return null

  // Pick the best result — prefer videos whose title contains the song name
  const items = searchData.items
  const songLower = songTitle.toLowerCase()
  const artistLower = artistName.toLowerCase()

  const ranked = items
    .map(item => {
      const t = item.snippet.title.toLowerCase()
      const ch = item.snippet.channelTitle.toLowerCase()
      let score = 0
      if (t.includes(songLower))    score += 40
      if (t.includes(artistLower))  score += 30
      if (ch.includes("official"))  score += 20
      if (ch.includes("music"))     score += 10
      if (ch.includes("topic"))     score += 15
      if (t.includes("full"))       score += 5
      if (t.includes("lyrics"))     score += 5
      return { item, score }
    })
    .sort((a, b) => b.score - a.score)

  const best = ranked[0].item
  const videoId = best.id.videoId

  // Get duration via videos.list
  const videoData = await ytFetch("videos", {
    part: "contentDetails,snippet",
    id:   videoId,
  })

  const details    = videoData.items?.[0]
  const iso8601    = details?.contentDetails?.duration || "PT4M0S"
  const durationSec = parseISO8601Duration(iso8601)

  return {
    videoId,
    title:        best.snippet.title,
    channelTitle: best.snippet.channelTitle,
    thumbnail:    best.snippet.thumbnails?.high?.url || best.snippet.thumbnails?.default?.url,
    duration:     formatDuration(durationSec),
    durationSec,
    publishedAt:  best.snippet.publishedAt,
  }
}

// ── Fetch full track list for an artist ──────────────────────
// Returns array of video objects, most popular first
export async function searchArtistTopTracks(artistName, maxResults = 20) {
  const data = await ytFetch("search", {
    q:          `${artistName} ghazal full song`,
    part:       "snippet",
    type:       "video",
    maxResults,
    order:      "relevance",
    videoCategoryId: "10",
  })

  if (!data.items?.length) return []

  // Batch get durations
  const ids = data.items.map(i => i.id.videoId).join(",")
  const videoData = await ytFetch("videos", {
    part: "contentDetails,statistics",
    id:   ids,
  })

  const detailMap = {}
  videoData.items?.forEach(v => { detailMap[v.id] = v })

  return data.items
    .map(item => {
      const vid     = item.id.videoId
      const details = detailMap[vid]
      const iso8601 = details?.contentDetails?.duration || "PT4M0S"
      const sec     = parseISO8601Duration(iso8601)
      const views   = parseInt(details?.statistics?.viewCount || "0")

      return {
        videoId:      vid,
        title:        item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail:    item.snippet.thumbnails?.high?.url,
        duration:     formatDuration(sec),
        durationSec:  sec,
        views,
        viewsFormatted: formatViews(views),
        publishedAt:  item.snippet.publishedAt,
      }
    })
    // Filter out very short (<60s) or very long (>20min) videos
    .filter(v => v.durationSec > 60 && v.durationSec < 1200)
    .sort((a, b) => b.views - a.views)
}

// ── Fetch all songs for a SONGS array from data/songs.js ─────
// Returns the songs array with videoId, thumbnail, durationSec filled in
export async function enrichSongsWithYouTube(songs) {
  const results = await Promise.allSettled(
    songs.map(song => searchSong(song.title, song.artist))
  )
  return songs.map((song, i) => {
    const r = results[i]
    if (r.status === "fulfilled" && r.value) {
      return {
        ...song,
        videoId:      r.value.videoId,
        thumbnail:    r.value.thumbnail,
        durationSec:  r.value.durationSec,
        duration:     r.value.duration,
        ytTitle:      r.value.title,
      }
    }
    return song // return unchanged if search failed
  })
}

// ── Helpers ───────────────────────────────────────────────────
// Parse ISO 8601 duration like "PT5M12S" → seconds
function parseISO8601Duration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const h = parseInt(match[1] || 0)
  const m = parseInt(match[2] || 0)
  const s = parseInt(match[3] || 0)
  return h * 3600 + m * 60 + s
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

function formatViews(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}
