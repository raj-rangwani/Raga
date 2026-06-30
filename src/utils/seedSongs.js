import { db } from "./firebase"
import { doc, setDoc } from "firebase/firestore"
import { ALL_ARTISTS } from "./seedArtists"
import { searchArtistTopTracks } from "./youtube"
import { cleanYTTitle } from "./useArtistTracks"

/**
 * Seeds top 20 songs for all artists into Firestore.
 * Call from browser console:  import('/src/utils/seedSongs.js').then(m => m.seedAllSongs())
 */
export async function seedAllSongs() {
  console.log("🎵 Seeding songs to Firestore... This may take a minute.")
  let totalCount = 0

  for (const artist of ALL_ARTISTS) {
    console.log(`Fetching songs for ${artist.name}...`)
    try {
      const tracks = await searchArtistTopTracks(artist.name, 20)
      
      for (const yt of tracks) {
        const songData = {
          title:        cleanYTTitle(yt.title, artist.name),
          artist:       artist.name,
          artistId:     artist.id,
          videoId:      yt.videoId,
          thumbnail:    yt.thumbnail || null,
          duration:     yt.duration || "0:00",
          durationSec:  yt.durationSec || 0,
          plays:        yt.viewsFormatted || "0",
          year:         yt.publishedAt?.slice(0, 4) || "—",
          album:        "—",
          genre:        ["Ghazal"],
          lyrics:       [],
          tags:         [],
        }

        const docId = `${artist.id}_${yt.videoId}`
        await setDoc(doc(db, "songs", docId), songData)
        totalCount++
      }
      console.log(`  ✓ Saved ${tracks.length} songs for ${artist.name}`)
    } catch (err) {
      console.error(`  ✗ Error fetching/saving for ${artist.name}:`, err)
    }
  }

  console.log(`\n🎵 Done! Seeded ${totalCount} songs in total.`)
  return totalCount
}
