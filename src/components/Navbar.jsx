import { useEffect, useRef, useState } from "react"
import { User } from "lucide-react"
import { Link } from "react-router-dom"
// import { Link } from "react-router-dom"
import { auth } from "../utils/firebase"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"

function Navbar() {

  const [showProfile, setShowProfile] = useState(false)

  const profileRef = useRef()

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false)
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )
    }

  }, [])
useEffect(() => {

  const unsubscribe = onAuthStateChanged(
    auth,
    (currentUser) => {
      setUser(currentUser)
    }
  )

  return () => unsubscribe()

}, [])



  const [user, setUser] = useState(null)
  const handleGoogleLogin = async () => {

  try {

    const provider =
      new GoogleAuthProvider()

    await signInWithPopup(
      auth,
      provider
    )

  } catch (error) {

    console.error(error)

  }

}

const handleLogout = async () => {

  try {

    await signOut(auth)

    setShowProfile(false)

  } catch (error) {

    console.error(error)

  }

}

  return (

    <div
      className="
        w-full

        border-b border-zinc-800

        bg-black/40

        backdrop-blur-lg

        sticky top-0

        z-50
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto

          flex items-center justify-between

          px-8 py-5
        "
      >

        {/* Logo */}
        <h1
          className="
            text-3xl
            font-bold
            tracking-wide
            text-amber-200
          "
          style={{ fontFamily: "Playfair Display" }}
        >
          Raga
        </h1>

        {/* Navigation */}
        <div
          className="
            flex gap-10

            text-zinc-300
            text-lg
          "
          style={{ fontFamily: "Inter" }}
        >

          <Link
            to="/"
            className="
              hover:text-amber-200

              transition-all
              duration-300
            "
          >
            Home
          </Link>

          <Link
            to="/artists"
            className="
              hover:text-amber-200

              transition-all
              duration-300
            "
          >
            Artists
          </Link>

          <Link
  to="/playlists"

  className="
    hover:text-amber-200

    transition-all
    duration-300
  "
>
  Playlists
</Link>

<Link
  to="/about"

  className="
    hover:text-amber-200

    transition-all
    duration-300
  "
>
  About
</Link>

        </div>

        {/* User Section */}
        <div
          ref={profileRef}
          className="relative"
        >

          <button
            onClick={() => {

  if (!user) {
    handleGoogleLogin()
    return
  }

  setShowProfile(!showProfile)

}}

            className="
              flex items-center gap-3

              bg-zinc-900

              px-4 py-2

              rounded-full

              border border-zinc-700

              hover:border-amber-200

              transition-all
              duration-300
            "
          >

            <User size={18} />

            <span
              className="text-sm"
              style={{ fontFamily: "Inter" }}
            >
              {user ? user.displayName : "Login"}
            </span>

          </button>

          {/* Profile Popup */}
          {showProfile && (

            <div
              className="
                absolute right-0 mt-4

                w-72

                bg-zinc-950/95

                border border-zinc-800

                rounded-3xl

                p-6

                shadow-2xl
              "
            >

              <h2
                className="
                  text-2xl
                  text-amber-100
                "
                style={{ fontFamily: "Playfair Display" }}
              >
                {user?.displayName}
              </h2>

              <div
                className="
                  mt-6

                  space-y-4

                  text-zinc-300
                  text-sm
                "
                style={{ fontFamily: "Inter" }}
              >

                <p>
                  <span className="text-zinc-500">
                    Email:
                  </span>{" "}
                 {user?.email}
                </p>

                <p>
                  <span className="text-zinc-500">
                    Phone:
                  </span>{" "}
                  Coming Soon
                </p>

                <p>
                  <span className="text-zinc-500">
                    Preferred Language:
                  </span>{" "}
                  Hindi / Urdu
                </p>

              </div>

              <button
  onClick={handleLogout}
  className="
    mt-6
    w-full
    bg-red-500
    text-white
    py-3
    rounded-2xl
    font-semibold
    hover:bg-red-600
    transition-all
    duration-300
  "
>
  Logout
</button>

            </div>

          )}

        </div>

      </div>

    </div>

  )
}

export default Navbar