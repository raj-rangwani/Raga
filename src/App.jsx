// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { MusicPlayerProvider } from "./components/MusicPlayerContext"
import MusicPlayer from "./components/MusicPlayer"
import PageTransition from "./components/PageTransition"

import Home from "./pages/Home"
import Artist from "./pages/Artist"
import Playlist from "./pages/Playlist"
import ArtistDetail from "./pages/ArtistDetail"
import About from "./pages/About"
import MehfilList from "./pages/MehfilList"
import MehfilRoom from "./pages/MehfilRoom"

function AnimatedRoutes() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/artists"          element={<Artist />} />
        <Route path="/artist-detail"    element={<ArtistDetail />} />
        <Route path="/playlists"        element={<Playlist />} />
        <Route path="/about"            element={<About />} />
        <Route path="/mehfil"           element={<MehfilList />} />
        <Route path="/mehfil/:mehfilId" element={<MehfilRoom />} />
      </Routes>
    </PageTransition>
  )
}

function App() {
  return (
    <BrowserRouter>
      <MusicPlayerProvider>
        <AnimatedRoutes />
        {/* Global player — always mounted, shows only when song is active */}
        <MusicPlayer />
      </MusicPlayerProvider>
    </BrowserRouter>
  )
}

export default App
