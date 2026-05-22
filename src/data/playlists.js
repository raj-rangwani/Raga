// src/data/playlists.js

export const PLAYLISTS = [
  {
    id: "liked",
    title: "Liked Songs",
    subtitle: "Personal Collection",
    description: "The songs that stayed long after the night ended. Each one a chapter.",
    count: 42,
    color: "#c4a882",
    glow: "rgba(196,168,130,0.12)",
    private: true,
    songIds: [
      "hoshwalon-ko-khabar-kya",
      "tum-itna-jo",
      "aaj-jaane-ki-zid",
      "tum-nahin-aaye",
      "ranjish-hi-sahi",
    ],
  },
  {
    id: "midnight-rain",
    title: "Midnight Rain",
    subtitle: "Quiet Nights",
    description: "Soft ghazals for rain, silence and late thoughts. Best heard alone.",
    count: 18,
    color: "#8ba9c4",
    glow: "rgba(139,169,196,0.12)",
    private: false,
    songIds: [
      "jhuki-jhuki",
      "chitthi-na-koi",
      "lag-jaa-gale",
      "dil-dhoondta-hai",
      "tum-nahin-aaye",
    ],
  },
  {
    id: "mehfil-nights",
    title: "Mehfil Nights",
    subtitle: "Classic Mehfils",
    description: "Timeless voices gathered for long poetic evenings. No clock, no hurry.",
    count: 26,
    color: "#b89a6a",
    glow: "rgba(184,154,106,0.12)",
    private: false,
    songIds: [
      "koi-fariyaad",
      "dam-mast-qalandar",
      "ranjish-hi-sahi",
      "aaj-jaane-ki-zid",
      "mere-rashke-qamar",
    ],
  },
  {
    id: "sufi-silence",
    title: "Sufi Silence",
    subtitle: "Spiritual Calm",
    description: "Poetry that feels like prayer and stillness that fills an empty room.",
    count: 14,
    color: "#82b89a",
    glow: "rgba(130,184,154,0.12)",
    private: false,
    songIds: [
      "mere-rashke-qamar",
      "dam-mast-qalandar",
      "lag-jaa-gale",
      "koi-fariyaad",
    ],
  },
]

export const getPlaylistById = (id) => PLAYLISTS.find(p => p.id === id)
