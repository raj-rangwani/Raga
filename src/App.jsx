import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MusicPlayerProvider } from "./components/MusicPlayerContext"
import MusicPlayer from "./components/MusicPlayer"
import PageTransition from "./components/PageTransition"
import YouTubePlayer from "./components/YouTubePlayer"

import Home         from "./pages/Home"
import Artist       from "./pages/Artist"
import ArtistDetail from "./pages/ArtistDetail"
import Playlist     from "./pages/Playlist"
import About        from "./pages/About"
import MehfilList   from "./pages/MehfilList"
import MehfilRoom   from "./pages/MehfilRoom"

function AnimatedRoutes() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/artists"          element={<Artist />} />
        <Route path="/artist/:artistId" element={<ArtistDetail />} />
        <Route path="/artist-detail"    element={<ArtistDetail />} />
        <Route path="/playlists"        element={<Playlist />} />
        <Route path="/about"            element={<About />} />
        <Route path="/mehfil"           element={<MehfilList />} />
        <Route path="/mehfil/:mehfilId" element={<MehfilRoom />} />
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
        <YouTubePlayer />
      </MusicPlayerProvider>
    </BrowserRouter>
  )
}