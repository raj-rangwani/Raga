import { useEffect, useRef, useState } from "react"
import { User } from "lucide-react"
import { Link } from "react-router-dom"

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

  // Temporary User Data
  const user = {
    name: "Raga Listener",
    email: "ragafan@gmail.com",
    phone: "+91 9876543210",
    language: "Urdu / Hindi"
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
            onClick={() =>
              setShowProfile(!showProfile)
            }

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
              {user.name}
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
                {user.name}
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
                  {user.email}
                </p>

                <p>
                  <span className="text-zinc-500">
                    Phone:
                  </span>{" "}
                  {user.phone}
                </p>

                <p>
                  <span className="text-zinc-500">
                    Preferred Language:
                  </span>{" "}
                  {user.language}
                </p>

              </div>

              <button
                className="
                  mt-6

                  w-full

                  bg-amber-100

                  text-black

                  py-3

                  rounded-2xl

                  font-semibold

                  hover:bg-amber-200

                  transition-all
                  duration-300
                "
              >
                View Profile
              </button>

            </div>

          )}

        </div>

      </div>

    </div>

  )
}

export default Navbar