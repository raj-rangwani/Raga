// src/components/FloatingArtists.jsx
// Marquee strip of artist name buttons — anchored to bottom of the page container

const artists = [
  "Jagjit Singh",
  "Mehdi Hassan",
  "Nusrat Fateh Ali Khan",
  "Ghulam Ali",
  "Farida Khanum",
  "Abida Parveen",
  "Pankaj Udhas",
  "Talat Aziz",
]

function FloatingArtists() {
  return (
    // KEY FIX: position absolute, bottom of the *page wrapper* (not the inner content div)
    // overflow-hidden on the page wrapper clips the strip cleanly
    <div
      className="absolute bottom-0 left-0 w-full overflow-hidden group"
      style={{
        // Fade edges left + right so it looks cinematic, not cut off
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        paddingBottom: "28px",
        paddingTop: "16px",
        // Subtle gradient above the strip so it blends into the page bg
        background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
      }}
    >
      {/* Marquee track */}
      <div
        className="flex gap-5 whitespace-nowrap group-hover:[animation-play-state:paused]"
        style={{
          animation: "marqueeScroll 32s linear infinite",
          width: "max-content",
        }}
      >
        {/* Triple the artists so there's no visible gap on ultra-wide screens */}
        {[...artists, ...artists, ...artists].map((artist, index) => (
          <button
            key={index}
            className="
              flex-shrink-0
              px-6 py-2.5
              rounded-full
              text-amber-100
              backdrop-blur-xl
              tracking-wide
              font-medium
              text-base
              transition-all
              duration-400
              hover:-translate-y-1
              hover:scale-105
            "
            style={{
              background: "rgba(20,15,8,0.75)",
              border: "1px solid rgba(196,168,130,0.18)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              fontFamily: "Inter",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(196,168,130,0.15)"
              e.currentTarget.style.border = "1px solid rgba(196,168,130,0.45)"
              e.currentTarget.style.boxShadow = "0 0 18px rgba(196,168,130,0.18), 0 2px 12px rgba(0,0,0,0.3)"
              e.currentTarget.style.color = "#f5e6cc"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(20,15,8,0.75)"
              e.currentTarget.style.border = "1px solid rgba(196,168,130,0.18)"
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.3)"
              e.currentTarget.style.color = "#fef3c7"
            }}
          >
            {artist}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}

export default FloatingArtists