// src/pages/Home.jsx
import Navbar from "../components/Navbar"
import FloatingArtists from "../components/FloatingArtists"
import AmbientEffects from "../components/AmbientEffects"
import SearchBar from "../components/SearchBar"
import { Quote } from "lucide-react"
import { useState } from "react"
import QuotePopup from "../components/QuotePopup"
import backgroundImage from "../assets/ragabg.png"
import { useNavigate } from "react-router-dom"

function Home() {
  const [showQuote, setShowQuote] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      className="min-h-[100vh] text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/55 z-0" />
      <AmbientEffects particles particleColor="rgba(240,220,180," glow={false} />

      <div className="relative z-10">
        <Navbar />
      </div>

      <div className="relative z-10 px-6 md:px-10 pt-10 pb-32">
        <p
          className="text-xs tracking-[0.35em] uppercase mb-4"
          style={{ color: "rgba(196,168,130,0.6)", fontFamily: "Inter" }}
        >
          Where ghazals live
        </p>

        <h1
          className="text-7xl md:text-8xl text-amber-100 tracking-wide drop-shadow-lg"
          style={{ fontFamily: "Playfair Display" }}
        >
          Raga
        </h1>

        <p
          className="text-zinc-300 text-xl md:text-2xl mt-6 max-w-3xl leading-relaxed font-medium"
          style={{ fontFamily: "Inter" }}
        >
          A home for ghazals, mehfils and timeless voices.
        </p>

        <p
          className="text-zinc-500 text-base md:text-lg mt-5 max-w-2xl leading-loose"
          style={{ fontFamily: "Inter" }}
        >
          Discover original gems, poetic lyrics, forgotten mehfils,
          and songs that feel like rain hitting an old window at midnight.
        </p>

        {/* Search — no onSelect override; SearchBar handles routing correctly */}
        <div className="mt-10 max-w-lg">
          <SearchBar placeholder="Search songs, artists, playlists…" />
        </div>

        <button
          onClick={() => navigate("/mehfil")}
          className="mt-8 px-8 py-4 rounded-full bg-amber-100 text-black font-semibold tracking-wide shadow-[0_0_20px_rgba(251,191,36,0.12)] hover:bg-amber-200 hover:shadow-[0_0_25px_rgba(251,191,36,0.18)] hover:scale-105 transition-all duration-500"
          style={{ fontFamily: "Inter" }}
        >
          Enter The Mehfil
        </button>
      </div>

      <FloatingArtists />

      <button
        onClick={() => setShowQuote(true)}
        className="fixed bottom-24 right-6 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-amber-100 backdrop-blur-xl transition-all duration-500 hover:scale-105 z-40"
        style={{
          background: "rgba(14,10,5,0.88)",
          border: "1px solid rgba(196,168,130,0.2)",
          boxShadow: "0 0 0 1px rgba(196,168,130,0.06), 0 8px 32px rgba(0,0,0,0.4)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background  = "rgba(196,168,130,0.15)"
          e.currentTarget.style.border      = "1px solid rgba(196,168,130,0.45)"
          e.currentTarget.style.boxShadow   = "0 0 20px rgba(196,168,130,0.2)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background  = "rgba(14,10,5,0.88)"
          e.currentTarget.style.border      = "1px solid rgba(196,168,130,0.2)"
          e.currentTarget.style.boxShadow   = "0 0 0 1px rgba(196,168,130,0.06), 0 8px 32px rgba(0,0,0,0.4)"
        }}
      >
        <Quote size={22} />
      </button>

      <QuotePopup show={showQuote} setShow={setShowQuote} />
    </div>
  )
}

export default Home