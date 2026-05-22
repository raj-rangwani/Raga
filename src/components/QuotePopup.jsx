// src/components/QuotePopup.jsx
import { X, Quote } from "lucide-react"
import { useState, useEffect } from "react"

const quotes = [
  {
    shayari: "Main chup raha toh aur ghalat fehmiyan badhi,\nwoh bhi suna hai usne jo maine kaha nahi.",
    poet: "Bashir Badr",
    lang: "Urdu/Hindi",
  },
  {
    shayari: "Kabhi kisi ko mukammal jahaan nahi milta,\nkahin zameen toh kahin aasmaan nahi milta.",
    poet: "Nida Fazli",
    lang: "Hindi",
  },
  {
    shayari: "Bahut udaas hai koi tere jaane se,\nho sake toh laut aa kisi bahaane se.",
    poet: "Unknown Mehfil Poet",
    lang: "Hindi",
  },
  {
    shayari: "Ek mohabbat kaafi hai,\nbaaki umr izzat se guzar jaati hai.",
    poet: "Anonymous",
    lang: "Hindi",
  },
  {
    shayari: "Tumhare baad kisi ko dil mein basaya nahi,\nhumne iss chhote se ghar ko kiraye par nahi diya.",
    poet: "Qateel Shifai",
    lang: "Hindi",
  },
  {
    shayari: "Raat bhar jaagta hoon ek aise shakhs ki khaatir,\njisko din ke ujale mein bhi meri yaad nahi aati.",
    poet: "Underrated Urdu Poet",
    lang: "Hindi",
  },
  {
    shayari: "Ranjish hi sahi, dil hi dukhane ke liye aa,\naa phir se mujhe chhod ke jaane ke liye aa.",
    poet: "Ahmad Faraz",
    lang: "Urdu",
  },
  {
    shayari: "Hum tere shehar mein aaye hain musafir ki tarah,\nkoi baat nahi gar ghar nahi mila humko.",
    poet: "Faiz Ahmed Faiz",
    lang: "Urdu",
  },
]

function QuotePopup({ show, setShow }) {
  const [quote, setQuote] = useState(null)
  const [visible, setVisible] = useState(false)

  // Pick a new random quote each time it opens + animate in
  useEffect(() => {
    if (show) {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)])
      // tiny delay so the CSS transition fires
      setTimeout(() => setVisible(true), 20)
    } else {
      setVisible(false)
    }
  }, [show])

  if (!show || !quote) return null

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => setShow(false), 280)
  }

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.28s ease",
      }}
    >
      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-xl"
        style={{
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.28s ease",
        }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: "0 0 80px rgba(196,168,130,0.08), 0 40px 80px rgba(0,0,0,0.5)",
          }}
        />

        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #1a1208 0%, #0e0c08 50%, #0a0a0c 100%)",
            border: "1px solid rgba(196,168,130,0.15)",
          }}
        >
          {/* Ambient top glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(196,168,130,0.08) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <div className="relative z-10 p-8 md:p-10">
            {/* Header row */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(196,168,130,0.12)", border: "1px solid rgba(196,168,130,0.2)" }}
                >
                  <Quote size={14} style={{ color: "#c4a882" }} />
                </div>
                <div>
                  <p
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: "rgba(196,168,130,0.6)", fontFamily: "Inter" }}
                  >
                    Shayari of the Moment
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.35)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(196,168,130,0.1)"
                  e.currentTarget.style.color = "#c4a882"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                  e.currentTarget.style.color = "rgba(255,255,255,0.35)"
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Decorative quote mark */}
            <div
              className="text-7xl leading-none mb-2 select-none"
              style={{
                color: "rgba(196,168,130,0.08)",
                fontFamily: "Playfair Display",
                lineHeight: 1,
              }}
            >
              "
            </div>

            {/* Shayari */}
            <h2
              className="text-2xl md:text-3xl leading-relaxed whitespace-pre-line text-zinc-200"
              style={{ fontFamily: "Playfair Display", lineHeight: "1.75" }}
            >
              {quote.shayari}
            </h2>

            {/* Divider */}
            <div
              className="my-8 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(196,168,130,0.2), transparent)" }}
            />

            {/* Poet + language */}
            <div className="flex items-center justify-between">
              <p
                className="text-base"
                style={{ color: "rgba(196,168,130,0.8)", fontFamily: "Inter", fontStyle: "italic" }}
              >
                — {quote.poet}
              </p>
              <span
                className="text-[10px] px-2.5 py-1 rounded-full tracking-widest uppercase"
                style={{
                  background: "rgba(196,168,130,0.08)",
                  border: "1px solid rgba(196,168,130,0.15)",
                  color: "rgba(196,168,130,0.5)",
                  fontFamily: "Inter",
                }}
              >
                {quote.lang}
              </span>
            </div>

            {/* Next quote hint */}
            <p
              className="mt-5 text-xs text-center"
              style={{ color: "rgba(255,255,255,0.12)", fontFamily: "Inter" }}
            >
              Click anywhere outside to close · Opens a new shayari each time
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuotePopup