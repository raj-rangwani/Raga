import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { Users, Music, Moon, Flame, Wind, CloudRain } from "lucide-react"

const mehfils = [
  {
    id: "shab-e-tarab",
    name: "Shab-e-Tarab",
    urdu: "شبِ طرب",
    tagline: "Night of ecstasy — where every ghazal is a confession",
    mood: "Soulful",
    icon: Moon,
    color: "#c4a882",
    glow: "rgba(196,168,130,0.18)",
    cardBg: "linear-gradient(135deg, #1a1008 0%, #0e0b06 100%)",
    listeners: 34,
    queue: 7,
    nowPlaying: "Aaj Jaane Ki Zid Na Karo — Farida Khanum",
    tags: ["Ghazal", "Klassik", "Slow"],
  },
  {
    id: "dard-ki-raat",
    name: "Dard Ki Raat",
    urdu: "دردکی رات",
    tagline: "Where grief becomes music and music becomes prayer",
    mood: "Melancholic",
    icon: CloudRain,
    color: "#8ba9c4",
    glow: "rgba(139,169,196,0.15)",
    cardBg: "linear-gradient(135deg, #0b0f18 0%, #080a10 100%)",
    listeners: 21,
    queue: 4,
    nowPlaying: "Tum Nahin Aaye — Mehdi Hassan",
    tags: ["Dard", "Tanha", "Raat"],
  },
  {
    id: "josh-e-rang",
    name: "Josh-e-Rang",
    urdu: "جوشِ رنگ",
    tagline: "Qawwali fire — the room is spinning and no one wants to stop",
    mood: "Ecstatic",
    icon: Flame,
    color: "#c47c5a",
    glow: "rgba(196,124,90,0.15)",
    cardBg: "linear-gradient(135deg, #1a0a04 0%, #100604 100%)",
    listeners: 58,
    queue: 12,
    nowPlaying: "Dam Mast Qalandar — Nusrat Fateh Ali Khan",
    tags: ["Qawwali", "Sufi", "Junoon"],
  },
  {
    id: "sukoon-ka-darya",
    name: "Sukoon Ka Darya",
    urdu: "سکون کا دریا",
    tagline: "Soft instruments, softer evenings. No rush, only presence",
    mood: "Serene",
    icon: Wind,
    color: "#82b89a",
    glow: "rgba(130,184,154,0.15)",
    cardBg: "linear-gradient(135deg, #071009 0%, #060908 100%)",
    listeners: 17,
    queue: 3,
    nowPlaying: "Lag Jaa Gale — Lata Mangeshkar",
    tags: ["Nazm", "Instrumental", "Soothing"],
  },
]

export default function MehfilList() {
  const navigate = useNavigate()
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 20% 50%, #1a0f05 0%, #0a0a0a 50%, #050810 100%)",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Navbar />

      <div className="relative z-10 px-8 pt-8 pb-16 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <p
            className="text-zinc-500 text-sm tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: "Inter" }}
          >
            Choose Your Gathering
          </p>
          <h1
            className="text-6xl text-amber-100 leading-tight"
            style={{ fontFamily: "Playfair Display" }}
          >
            Mehfils
          </h1>
          <p
            className="text-zinc-400 mt-4 text-lg max-w-xl leading-relaxed"
            style={{ fontFamily: "Inter" }}
          >
            Each mehfil has its own soul. Enter, request a song, take your place in the queue — and let the music wash over you.
          </p>
        </div>

        {/* Mehfil Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mehfils.map((m) => {
            const Icon = m.icon
            const isHovered = hoveredId === m.id
            return (
              <div
                key={m.id}
                onMouseEnter={() => setHoveredId(m.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/mehfil/${m.id}`)}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{
                  border: `1px solid ${isHovered ? m.color + "40" : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.4s ease",
                  transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                  boxShadow: isHovered ? `0 20px 60px ${m.glow}` : "none",
                  background: m.cardBg,
                }}
              >
                {/* Background glow blob */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at 10% 50%, ${m.glow} 0%, transparent 60%)`,
                  }}
                />

                <div className="relative z-10 p-7">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: m.color + "20", border: `1px solid ${m.color}30` }}
                      >
                        <Icon size={18} style={{ color: m.color }} />
                      </div>
                      <div>
                        <span
                          className="text-xs tracking-widest uppercase"
                          style={{ color: m.color, fontFamily: "Inter" }}
                        >
                          {m.mood}
                        </span>
                      </div>
                    </div>
                    {/* Urdu name */}
                    <span
                      className="text-zinc-600 text-lg"
                      style={{ fontFamily: "serif" }}
                    >
                      {m.urdu}
                    </span>
                  </div>

                  {/* Name & tagline */}
                  <h2
                    className="text-3xl text-amber-50 mb-2"
                    style={{ fontFamily: "Playfair Display" }}
                  >
                    {m.name}
                  </h2>
                  <p
                    className="text-zinc-400 text-sm leading-relaxed mb-6"
                    style={{ fontFamily: "Inter" }}
                  >
                    {m.tagline}
                  </p>

                  {/* Now playing */}
                  <div
                    className="rounded-xl px-4 py-3 mb-5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: m.color }}
                      />
                      <span className="text-zinc-500 text-xs tracking-wider uppercase" style={{ fontFamily: "Inter" }}>
                        Now Playing
                      </span>
                    </div>
                    <p className="text-zinc-300 text-sm" style={{ fontFamily: "Inter" }}>
                      {m.nowPlaying}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          background: m.color + "15",
                          color: m.color,
                          border: `1px solid ${m.color}25`,
                          fontFamily: "Inter",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom stats + CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-zinc-500" />
                        <span className="text-zinc-400 text-sm" style={{ fontFamily: "Inter" }}>
                          {m.listeners} listening
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Music size={14} className="text-zinc-500" />
                        <span className="text-zinc-400 text-sm" style={{ fontFamily: "Inter" }}>
                          {m.queue} in queue
                        </span>
                      </div>
                    </div>

                    <button
                      className="text-sm px-5 py-2 rounded-full font-medium transition-all duration-300"
                      style={{
                        background: isHovered ? m.color : "transparent",
                        color: isHovered ? "#0a0a0a" : m.color,
                        border: `1px solid ${m.color}`,
                        fontFamily: "Inter",
                      }}
                    >
                      Enter
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
