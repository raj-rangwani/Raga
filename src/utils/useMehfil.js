// src/utils/useMehfil.js
import { useState, useEffect, useCallback, useRef } from "react"
import { db } from "./firebase"
import {
  collection, doc, setDoc, addDoc, deleteDoc,
  onSnapshot, getDoc, getDocs, updateDoc,
  serverTimestamp, Timestamp,
} from "firebase/firestore"

export function useMehfil(mehfilId, userName) {
  const [currentSong, setCurrentSong] = useState(null)
  const [queue,       setQueue]       = useState([])
  const [listeners,   setListeners]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)

  const userId         = useRef(`${userName}_${Date.now()}`)
  const listenerDocRef = useRef(null)

  // ── Join ─────────────────────────────────────────────────────
  const joinMehfil = useCallback(async () => {
    if (!mehfilId || !userName) return
    try {
      const lRef = doc(db, "mehfils", mehfilId, "listeners", userId.current)
      await setDoc(lRef, { name: userName, joinedAt: serverTimestamp() })
      listenerDocRef.current = lRef

      // Only create the currentSong doc if it doesn't exist at all
      const songRef = doc(db, "mehfils", mehfilId, "state", "currentSong")
      const snap    = await getDoc(songRef)
      if (!snap.exists()) {
        await setDoc(songRef, {
          title:       "Waiting for first request...",
          artist:      "",
          videoId:     null,
          thumbnail:   null,
          requestedBy: null,
          startedAt:   serverTimestamp(),
          elapsedSec:  0,
        })
      }
    } catch (e) {
      setError(e.message)
      console.error("joinMehfil:", e)
    }
  }, [mehfilId, userName])

  // ── Leave ────────────────────────────────────────────────────
  const leaveMehfil = useCallback(async () => {
    try {
      if (listenerDocRef.current) {
        await deleteDoc(listenerDocRef.current)
      }
      // After leaving, check if room is now empty → pause if so
      const listenersSnap = await getDocs(
        collection(db, "mehfils", mehfilId, "listeners")
      )
      if (listenersSnap.empty) {
        // Room is empty — save current elapsed position and mark paused
        const songRef = doc(db, "mehfils", mehfilId, "state", "currentSong")
        const songSnap = await getDoc(songRef)
        if (songSnap.exists() && songSnap.data()?.videoId) {
          const data = songSnap.data()
          const startedAt = data.startedAt?.toDate?.() || new Date()
          const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000)
          await updateDoc(songRef, {
            paused:     true,
            elapsedSec: elapsed,  // save position so next joiner can seek to it
          })
        }
      }
    } catch (e) {
      console.error("leaveMehfil:", e)
    }
  }, [mehfilId])

  // ── Play a specific song now ──────────────────────────────────
  const playNextSong = useCallback(async (videoId, title, artist, queueItemId, requestedBy, thumbnail) => {
    try {
      await setDoc(doc(db, "mehfils", mehfilId, "state", "currentSong"), {
        videoId:     videoId     || null,
        title:       title       || "",
        artist:      artist      || "",
        thumbnail:   thumbnail   || null,
        requestedBy: requestedBy || userName,
        startedAt:   serverTimestamp(),
        elapsedSec:  0,           // always starts from 0 for a new song
        paused:      false,
      })
      if (queueItemId) {
        await deleteDoc(doc(db, "mehfils", mehfilId, "queue", queueItemId))
      }
    } catch (e) {
      console.error("playNextSong:", e)
    }
  }, [mehfilId, userName])

  // ── Send chitthi ─────────────────────────────────────────────
  const sendChitthi = useCallback(async (songName, artistName, videoId = null, thumbnail = null) => {
    if (!mehfilId || !songName?.trim()) return
    try {
      const songRef = doc(db, "mehfils", mehfilId, "state", "currentSong")
      const snap    = await getDoc(songRef)
      const cur     = snap.exists() ? snap.data() : null
      const nothingPlaying = !cur || !cur.videoId

      if (videoId && nothingPlaying) {
        await setDoc(songRef, {
          videoId,
          title:       songName.trim(),
          artist:      artistName?.trim() || "",
          thumbnail:   thumbnail || null,
          requestedBy: userName,
          startedAt:   serverTimestamp(),
          elapsedSec:  0,
          paused:      false,
        })
        return
      }

      await addDoc(collection(db, "mehfils", mehfilId, "queue"), {
        songName:    songName.trim(),
        artist:      artistName?.trim() || "",
        requestedBy: userName,
        videoId:     videoId   || null,
        thumbnail:   thumbnail || null,
        votes:       1,
        timestamp:   serverTimestamp(),
      })
    } catch (e) {
      console.error("sendChitthi:", e)
      setError(e.message)
    }
  }, [mehfilId, userName])

  // ── Vote ─────────────────────────────────────────────────────
  const voteForSong = useCallback(async (queueItemId, currentVotes) => {
    try {
      await updateDoc(doc(db, "mehfils", mehfilId, "queue", queueItemId), {
        votes: (currentVotes || 1) + 1,
      })
    } catch (e) {
      console.error("voteForSong:", e)
    }
  }, [mehfilId])

  // ── Pick highest-voted from queue ─────────────────────────────
  const playRandomFromQueue = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, "mehfils", mehfilId, "queue"))
      if (snap.empty) {
        await setDoc(doc(db, "mehfils", mehfilId, "state", "currentSong"), {
          title:       "Waiting for next request...",
          artist:      "",
          videoId:     null,
          thumbnail:   null,
          requestedBy: null,
          startedAt:   serverTimestamp(),
          elapsedSec:  0,
          paused:      false,
        })
        return false
      }

      const items     = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const withVideo = items.filter(i => i.videoId)
      const pool      = withVideo.length > 0 ? withVideo : items
      const maxVotes  = Math.max(...pool.map(i => i.votes || 1))
      const top       = pool.filter(i => (i.votes || 1) === maxVotes)
      const pick      = top[Math.floor(Math.random() * top.length)]

      await playNextSong(
        pick.videoId || null,
        pick.songName,
        pick.artist    || "",
        pick.id,
        pick.requestedBy,
        pick.thumbnail || null,
      )
      return true
    } catch (e) {
      console.error("playRandomFromQueue:", e)
      return false
    }
  }, [mehfilId, playNextSong])

  // ── Resume a paused room when first listener joins ────────────
  const resumeIfPaused = useCallback(async () => {
    try {
      const songRef  = doc(db, "mehfils", mehfilId, "state", "currentSong")
      const songSnap = await getDoc(songRef)
      if (!songSnap.exists()) return

      const data = songSnap.data()
      // If the room was paused because it was empty, resume it
      if (data.paused && data.videoId) {
        await updateDoc(songRef, {
          paused:    false,
          // Reset startedAt so new joiners can calculate correct offset:
          // they'll seek to elapsedSec position on the resumed song
          startedAt: serverTimestamp(),
          // Keep elapsedSec so MehfilPlayer can seek to it
        })
      }
    } catch (e) {
      console.error("resumeIfPaused:", e)
    }
  }, [mehfilId])

  // ── Realtime subscriptions ────────────────────────────────────
  useEffect(() => {
    if (!mehfilId) return

    const unsubSong = onSnapshot(
      doc(db, "mehfils", mehfilId, "state", "currentSong"),
      snap => {
        setCurrentSong(snap.exists() ? { id: snap.id, ...snap.data() } : null)
        setLoading(false)
      },
      e => { setError(e.message); setLoading(false) }
    )

    const unsubQueue = onSnapshot(
      collection(db, "mehfils", mehfilId, "queue"),
      snap => {
        const items = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.votes || 1) - (a.votes || 1))
        setQueue(items)
      }
    )

    const unsubListeners = onSnapshot(
      collection(db, "mehfils", mehfilId, "listeners"),
      snap => setListeners(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )

    return () => { unsubSong(); unsubQueue(); unsubListeners() }
  }, [mehfilId])

  // Auto-leave on tab close
  useEffect(() => {
    const handler = () => leaveMehfil()
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [leaveMehfil])

  return {
    currentSong,
    queue,
    listeners,
    loading,
    error,
    joinMehfil,
    leaveMehfil,
    sendChitthi,
    voteForSong,
    playNextSong,
    playRandomFromQueue,
    resumeIfPaused,
    userId: userId.current,
  }
}