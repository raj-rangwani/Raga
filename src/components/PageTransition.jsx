// src/components/PageTransition.jsx
// Wraps every page with a smooth fade-up entrance animation

import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

export default function PageTransition({ children }) {
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(14px)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
      }}
    >
      {children}
    </div>
  )
}
