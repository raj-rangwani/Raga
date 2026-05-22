// src/utils/search.js
// Fuzzy search engine for Raga — searches artists, songs, playlists

import { ARTISTS } from "../data/artists"
import { SONGS } from "../data/songs"
import { PLAYLISTS } from "../data/playlists"

// ── Fuzzy score: how well does query match target string ──────
function fuzzyScore(query, target) {
  if (!query || !target) return 0
  const q = query.toLowerCase().trim()
  const t = target.toLowerCase()

  // Exact match
  if (t === q) return 100
  // Starts with
  if (t.startsWith(q)) return 90
  // Contains whole word
  if (t.includes(` ${q}`) || t.includes(q)) return 75
  // All chars of query appear in order in target (fuzzy)
  let qi = 0
  let score = 0
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) { qi++; score++ }
  }
  if (qi < q.length) return 0 // not all chars matched
  return Math.floor((score / t.length) * 50)
}

function bestScore(query, fields) {
  return Math.max(...fields.map(f => fuzzyScore(query, f || "")))
}

// ── Main search function ──────────────────────────────────────
export function search(query, { limit = 10 } = {}) {
  if (!query || query.trim().length < 1) return { artists: [], songs: [], playlists: [] }
  const q = query.trim()

  const artists = ARTISTS
    .map(a => ({
      ...a,
      _score: bestScore(q, [a.name, a.title, ...(a.tags || [])]),
      _type: "artist",
    }))
    .filter(a => a._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)

  const songs = SONGS
    .map(s => ({
      ...s,
      _score: bestScore(q, [s.title, s.artist, s.album, ...(s.tags || []), ...(s.genre || [])]),
      _type: "song",
    }))
    .filter(s => s._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)

  const playlists = PLAYLISTS
    .map(p => ({
      ...p,
      _score: bestScore(q, [p.title, p.subtitle, p.description]),
      _type: "playlist",
    }))
    .filter(p => p._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)

  return { artists, songs, playlists }
}

// ── Quick top-5 suggestions for dropdown ─────────────────────
export function getSuggestions(query) {
  if (!query || query.trim().length < 1) return []
  const { artists, songs, playlists } = search(query, { limit: 3 })

  const results = [
    ...artists.map(a => ({ type: "artist", label: a.name, sub: a.title, id: a.id, score: a._score })),
    ...songs.map(s => ({ type: "song", label: s.title, sub: s.artist, id: s.id, score: s._score })),
    ...playlists.map(p => ({ type: "playlist", label: p.title, sub: p.subtitle, id: p.id, score: p._score })),
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  return results
}
