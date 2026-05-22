import Navbar from "../components/Navbar"
import aboutBg from "../assets/aboutbg.png"

function About() {

  return (

    <div
      className="
        min-h-screen

        text-white

        bg-cover
        bg-center
        bg-no-repeat

        relative
        overflow-hidden
      "

      style={{
        backgroundImage: `url(${aboutBg})`
      }}
    >

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65"></div>

      <Navbar />

      {/* Main Content */}
      <div
        className="
          relative z-10

          max-w-5xl
          mx-auto

          px-10
          py-20
        "
      >

        {/* Heading */}
        <div className="text-center">

          <h1
            className="
              text-5xl

              text-amber-100

              tracking-wide
            "
            style={{ fontFamily: "Playfair Display" }}
          >
            About Raga
          </h1>

          {/* Underline */}
          <div
            className="
              w-40
              h-[2px]

              bg-gradient-to-r
              from-transparent
              via-amber-100
              to-transparent

              mx-auto
              mt-5
            "
          ></div>

        </div>

        {/* Paragraph */}
        <div
          className="
            mt-14

            text-center

            space-y-6

            text-zinc-300
            text-lg

            leading-loose

            max-w-3xl
            mx-auto
          "
          style={{ fontFamily: "Inter" }}
        >

          <p>
            Raga was created for people who still
            listen to music slowly —
            for listeners who search beyond algorithms,
            remixes and trending playlists.
          </p>

          <p>
            This project is an attempt to build
            a digital mehfil for timeless ghazals,
            forgotten poetry and voices
            that deserve to be discovered again.
          </p>

          <p>
            My name is Raj Rangwani,
            and Raga reflects my love for music,
            lyrics and the quiet atmosphere
            that only old songs can create.
          </p>

        </div>

        {/* Social Buttons */}
        <div
          className="
            mt-24

            flex flex-wrap
            justify-center

            gap-6
          "
        >

          {/* Instagram */}
          <a
            href="#"

            className="
              group

              px-8 py-4

              rounded-full

              border border-zinc-700

              bg-black/40

              backdrop-blur-xl

              text-zinc-300

              hover:text-pink-300
              hover:border-pink-400

              hover:shadow-[0_0_25px_rgba(236,72,153,0.25)]

              hover:-translate-y-1

              transition-all
              duration-500
            "
            style={{ fontFamily: "Inter" }}
          >
            Instagram
          </a>

          {/* LinkedIn */}
          <a
            href="#"

            className="
              group

              px-8 py-4

              rounded-full

              border border-zinc-700

              bg-black/40

              backdrop-blur-xl

              text-zinc-300

              hover:text-blue-300
              hover:border-blue-400

              hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]

              hover:-translate-y-1

              transition-all
              duration-500
            "
            style={{ fontFamily: "Inter" }}
          >
            LinkedIn
          </a>

          {/* GitHub */}
          <a
            href="#"

            className="
              group

              px-8 py-4

              rounded-full

              border border-zinc-700

              bg-black/40

              backdrop-blur-xl

              text-zinc-300

              hover:text-amber-100
              hover:border-amber-200

              hover:shadow-[0_0_25px_rgba(251,191,36,0.25)]

              hover:-translate-y-1

              transition-all
              duration-500
            "
            style={{ fontFamily: "Inter" }}
          >
            GitHub
          </a>

        </div>

      </div>

    </div>

  )
}

export default About