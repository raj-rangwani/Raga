// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MusicPlayerProvider } from "./components/MusicPlayerContext"
import MusicPlayer from "./components/MusicPlayer"
import PageTransition from "./components/PageTransition"

import Home        from "./pages/Home"
import Artist      from "./pages/Artist"
import ArtistDetail from "./pages/ArtistDetail"
import Playlist    from "./pages/Playlist"
import About       from "./pages/About"
import MehfilList  from "./pages/MehfilList"
import MehfilRoom  from "./pages/MehfilRoom"

function AnimatedRoutes() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/artists"            element={<Artist />} />

        {/* ── DYNAMIC ARTIST ROUTE ──────────────────────────────
            Old: /artist-detail  (static, one page for everyone)
            New: /artist/:artistId  (dynamic, unique URL per artist)

            Examples:
              /artist/jagjit-singh
              /artist/mehdi-hassan
              /artist/nusrat-fateh-ali-khan

            The artistId maps to ARTISTS[n].id in src/data/artists.js
        ─────────────────────────────────────────────────────── */}
        <Route path="/artist/:artistId"   element={<ArtistDetail />} />

        {/* Keep old route as redirect for backward compatibility */}
        <Route path="/artist-detail"      element={<ArtistDetail />} />

        <Route path="/playlists"          element={<Playlist />} />
        <Route path="/about"              element={<About />} />
        <Route path="/mehfil"             element={<MehfilList />} />
        <Route path="/mehfil/:mehfilId"   element={<MehfilRoom />} />
      </Routes>
    </PageTransition>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MusicPlayerProvider>
        <AnimatedRoutes />
        <MusicPlayer />
      </MusicPlayerProvider>
    </BrowserRouter>
  )
}
