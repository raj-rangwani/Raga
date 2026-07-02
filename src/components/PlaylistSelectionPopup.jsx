import { useState, useEffect } from "react"
import { X, Plus, Check } from "lucide-react"

export default function PlaylistSelectionPopup({ 
  isOpen, 
  onClose, 
  song, 
  playlists, 
  onUpdatePlaylists, 
  onCreatePlaylist 
}) {
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState(new Set())
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (isOpen && song) {
      const initialIds = new Set(
        playlists.filter(pl => pl.songs.some(s => s.title === song.title)).map(pl => pl.id)
      )
      setSelectedPlaylistIds(initialIds)
    }
  }, [isOpen, song, playlists])

  if (!isOpen || !song) return null

  const handleSave = () => {
    let idsToSave = Array.from(selectedPlaylistIds)
    if (isCreating && newPlaylistName.trim()) {
      const newId = onCreatePlaylist(newPlaylistName.trim(), null)
      idsToSave.push(newId)
    }
    onUpdatePlaylists(song, idsToSave)
    handleClose()
  }

  const handleClose = () => {
    setSelectedPlaylistIds(new Set())
    setNewPlaylistName("")
    setIsCreating(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-sm bg-[#110a04] border border-[#c4a882]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(196,168,130,0.1)" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="text-xl text-amber-50" style={{ fontFamily: "Playfair Display" }}>Add to Playlist</h2>
            <p className="text-xs text-zinc-400 mt-1 truncate max-w-[200px]" style={{ fontFamily: "Inter" }}>
              {song.title} - {song.artist}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[40vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {playlists.map(pl => {
            const isSelected = selectedPlaylistIds.has(pl.id);
            
            return (
              <button
                key={pl.id}
                onClick={() => {
                  const next = new Set(selectedPlaylistIds)
                  if (next.has(pl.id)) next.delete(pl.id)
                  else next.add(pl.id)
                  setSelectedPlaylistIds(next)
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl mb-2 transition-all duration-200 text-left`}
                style={{
                  background: isSelected ? "rgba(196,168,130,0.15)" : "transparent",
                  border: isSelected ? "1px solid rgba(196,168,130,0.3)" : "1px solid transparent"
                }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: isSelected ? "#c4a882" : "rgba(255,255,255,0.8)", fontFamily: "Inter" }}>
                    {pl.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5" style={{ fontFamily: "Inter" }}>
                    {pl.songs.length} songs
                  </p>
                </div>
                {isSelected && <Check size={16} color="#c4a882" />}
              </button>
            )
          })}
        </div>

        <div className="px-4 pb-4">
          {!isCreating ? (
            <button
              onClick={() => {
                setIsCreating(true)
                setSelectedPlaylistId(null)
              }}
              className="w-full flex items-center gap-2 p-3 rounded-xl text-zinc-400 hover:text-amber-100 hover:bg-white/5 transition-colors border border-dashed border-zinc-700 hover:border-[#c4a882]/50"
              style={{ fontFamily: "Inter" }}
            >
              <Plus size={16} />
              <span className="text-sm">Create New Playlist</span>
            </button>
          ) : (
            <div className="p-3 bg-black/40 rounded-xl border border-[#c4a882]/30">
              <input
                autoFocus
                type="text"
                placeholder="Playlist name..."
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
                style={{ fontFamily: "Inter" }}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave()
                }}
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isCreating && !newPlaylistName.trim()}
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{ background: "#c4a882", color: "#0a0804", fontFamily: "Inter" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
