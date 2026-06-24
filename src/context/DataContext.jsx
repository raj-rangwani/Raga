// src/context/DataContext.jsx
// Provides Firestore artist and song data to the entire app via React Context.

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react"
import { db } from "../utils/firebase"
import { collection, getDocs } from "firebase/firestore"
import { ARTIST_IMAGES } from "../data/artists"

const DataContext = createContext(null)

// ── Image resolver ────────────────────────────────────────────
function resolveImage(imageFile) {
  if (!imageFile) return null
  return ARTIST_IMAGES[imageFile] || null
}

// ── Provider ──────────────────────────────────────────────────
export function DataProvider({ children }) {
  const [artists,  setArtists]  = useState([])
  const [songs,    setSongs]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const [artistsSnap, songsSnap] = await Promise.all([
          getDocs(collection(db, "artists")),
          getDocs(collection(db, "songs"))
        ])
        
        if (cancelled) return

        const artistsData = artistsSnap.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            image: resolveImage(data.imageFile),
          }
        })

        const songsData = songsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        setArtists(artistsData)
        setSongs(songsData)
        setError(null)
      } catch (err) {
        console.error("DataContext: Failed to fetch data from Firestore", err)
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [])

  // ── Derived data ──────────────────────────────────────────
  const featuredArtists = useMemo(
    () => artists.filter(a => a.featured),
    [artists]
  )

  // ── Artist Helper functions ───────────────────────────────
  const getArtistById = useCallback(
    (id) => artists.find(a => a.id === id),
    [artists]
  )

  const getArtistByName = useCallback(
    (name) => artists.find(a => a.name.toLowerCase() === name.toLowerCase()),
    [artists]
  )

  const searchArtists = useCallback(
    (q) => {
      if (!q?.trim()) return []
      const query = q.toLowerCase().trim()
      return artists.filter(a =>
        a.name.toLowerCase().includes(query)    ||
        a.title.toLowerCase().includes(query)   ||
        a.tags.some(t => t.toLowerCase().includes(query)) ||
        (a.urdu && a.urdu.includes(query))
      )
    },
    [artists]
  )

  // ── Song Helper functions ─────────────────────────────────
  const getSongById = useCallback(
    (id) => songs.find(s => s.id === id),
    [songs]
  )

  const getSongsByArtist = useCallback(
    (artistId) => songs.filter(s => s.artistId === artistId),
    [songs]
  )

  const getSongByTitle = useCallback(
    (title) => songs.find(s => s.title.toLowerCase() === title.toLowerCase()),
    [songs]
  )

  const value = useMemo(() => ({
    artists,
    featuredArtists,
    songs,
    loading,
    error,
    getArtistById,
    getArtistByName,
    searchArtists,
    getSongById,
    getSongsByArtist,
    getSongByTitle,
  }), [artists, featuredArtists, songs, loading, error, getArtistById, getArtistByName, searchArtists, getSongById, getSongsByArtist, getSongByTitle])

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

// ── Hooks ─────────────────────────────────────────────────────
export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData() must be used within <DataProvider>")
  return ctx
}

export function useArtists() {
  const { artists, featuredArtists, loading, error, getArtistById, getArtistByName, searchArtists } = useData()
  return { artists, featuredArtists, loading, error, getArtistById, getArtistByName, searchArtists }
}

export function useSongs() {
  const { songs, loading, error, getSongById, getSongsByArtist, getSongByTitle } = useData()
  return { songs, loading, error, getSongById, getSongsByArtist, getSongByTitle }
}
