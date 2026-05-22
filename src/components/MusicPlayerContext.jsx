import { createContext, useContext, useState, useRef, useEffect } from "react"

const MusicPlayerContext = createContext(null)

export const useMusicPlayer = () => useContext(MusicPlayerContext)

const SONGS_DB = {
  "Hoshwalon Ko Khabar Kya": {
    artist: "Jagjit Singh",
    duration: 312,
    lyrics: [
      { time: 0, line: "होशवालों को खबर क्या" },
      { time: 6, line: "बेखुदी क्या चीज़ है" },
      { time: 12, line: "इश्क कीजे फिर समझिये" },
      { time: 18, line: "ज़िंदगी क्या चीज़ है" },
      { time: 26, line: "Hoshwalon ko khabar kya" },
      { time: 32, line: "bekhudi kya cheez hai" },
      { time: 38, line: "Ishq keeje phir samajhiye" },
      { time: 44, line: "zindagi kya cheez hai" },
      { time: 56, line: "दिल की बातें दिल ही जाने" },
      { time: 62, line: "न कोई समझे न जाने" },
      { time: 68, line: "जो भी है बस इसी लम्हे में है" },
      { time: 80, line: "ज़िंदगी क्या चीज़ है" },
    ],
  },
  "Tum Itna Jo Muskura Rahe Ho": {
    artist: "Jagjit Singh",
    duration: 266,
    lyrics: [
      { time: 0, line: "तुम इतना जो मुस्कुरा रहे हो" },
      { time: 7, line: "क्या ग़म है जिसको छुपा रहे हो" },
      { time: 14, line: "Tum itna jo muskura rahe ho" },
      { time: 21, line: "kya gham hai jisko chupa rahe ho" },
      { time: 30, line: "आँखों में नमी, हँसी लबों पर" },
      { time: 37, line: "क्या हाल है, क्या दिखा रहे हो" },
      { time: 50, line: "बीती हुई ज़िंदगी के पन्ने" },
      { time: 57, line: "फिर से क्यों याद कर रहे हो" },
    ],
  },
  "Jhuki Jhuki Si Nazar": {
    artist: "Jagjit Singh",
    duration: 301,
    lyrics: [
      { time: 0, line: "झुकी झुकी सी नज़र" },
      { time: 6, line: "बेकरार है कि नहीं" },
      { time: 12, line: "Jhuki jhuki si nazar" },
      { time: 18, line: "bekarar hai ki nahin" },
      { time: 26, line: "दिल में कोई बात है" },
      { time: 32, line: "जो ज़ुबाँ पे आ नहीं सकी" },
      { time: 40, line: "आज उनसे मिलके" },
      { time: 46, line: "दिल को चैन आ गया" },
    ],
  },
  "Chitthi Na Koi Sandesh": {
    artist: "Jagjit Singh",
    duration: 400,
    lyrics: [
      { time: 0, line: "चिट्ठी न कोई संदेश" },
      { time: 7, line: "जाने वो कौन सा देश" },
      { time: 14, line: "जहाँ तुम चले गए" },
      { time: 21, line: "Chitthi na koi sandesh" },
      { time: 28, line: "jaane woh kaun sa desh" },
      { time: 35, line: "jahan tum chale gaye" },
      { time: 46, line: "पास रहके भी तुम कितने दूर थे" },
      { time: 54, line: "जाने क्यों दिल के अरमाँ अधूरे रहे" },
    ],
  },
  "Koi Fariyaad": {
    artist: "Jagjit Singh",
    duration: 489,
    lyrics: [
      { time: 0, line: "कोई फ़रियाद तेरे दिल में दबी हो जैसे" },
      { time: 8, line: "एक आँसू जो रुका हो कभी रोई हो जैसे" },
      { time: 18, line: "Koi fariyad tere dil mein dabi ho jaise" },
      { time: 26, line: "ek aansu jo ruka ho kabhi roi ho jaise" },
      { time: 38, line: "तेरी आँखों में मुझे डूबना अच्छा लगता है" },
      { time: 46, line: "तेरे होठों पे मुझे मरना अच्छा लगता है" },
      { time: 58, line: "Teri aankhon mein mujhe doobna achha lagta hai" },
    ],
  },
}

export function MusicPlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [liked, setLiked] = useState(new Set())
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(0)
  const intervalRef = useRef(null)

  const songData = currentSong ? (SONGS_DB[currentSong.title] || null) : null
  const totalDuration = songData?.duration || (currentSong?.duration
    ? (parseInt(currentSong.duration?.split(":")[0]) * 60 + parseInt(currentSong.duration?.split(":")[1]))
    : 240)

  useEffect(() => {
    if (isPlaying && currentSong) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          if (e >= totalDuration) {
            handleNext()
            return 0
          }
          return e + 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, currentSong, totalDuration])

  useEffect(() => {
    setProgress(totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0)
  }, [elapsed, totalDuration])

  const playSong = (song, newQueue = null) => {
    setCurrentSong(song)
    setIsPlaying(true)
    setElapsed(0)
    setProgress(0)
    if (newQueue) {
      setQueue(newQueue)
      setQueueIndex(newQueue.findIndex(s => s.title === song.title) || 0)
    }
  }

  const handleNext = () => {
    if (queue.length > 0) {
      const nextIdx = (queueIndex + 1) % queue.length
      setQueueIndex(nextIdx)
      setCurrentSong(queue[nextIdx])
      setElapsed(0)
    }
  }

  const handlePrev = () => {
    if (elapsed > 3) { setElapsed(0); return }
    if (queue.length > 0) {
      const prevIdx = (queueIndex - 1 + queue.length) % queue.length
      setQueueIndex(prevIdx)
      setCurrentSong(queue[prevIdx])
      setElapsed(0)
    }
  }

  const seek = (pct) => {
    const newElapsed = Math.floor((pct / 100) * totalDuration)
    setElapsed(newElapsed)
  }

  const toggleLike = (title) => {
    setLiked(prev => {
      const next = new Set(prev)
      next.has(title) ? next.delete(title) : next.add(title)
      return next
    })
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, "0")}`
  }

  return (
    <MusicPlayerContext.Provider value={{
      currentSong, isPlaying, progress, elapsed, liked, queue,
      songData, totalDuration, formatTime,
      playSong, handleNext, handlePrev, seek,
      toggleLike, setIsPlaying,
    }}>
      {children}
    </MusicPlayerContext.Provider>
  )
}
