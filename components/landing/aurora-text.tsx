"use client"

import { useEffect, useRef } from "react"

interface AuroraTextProps {
  children: string
  className?: string
  style?: React.CSSProperties
}

export function AuroraText({ children, className, style }: AuroraTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const glow = glowRef.current
    if (!el) return
    let frame: number
    let start: number
    const animate = (ts: number) => {
      if (!start) start = ts
      const deg = ((ts - start) / 6000) * 360
      const gradient = `conic-gradient(
        from ${deg}deg at 50% 50%,
        oklch(0.7 0.3 320) 0deg,
        oklch(0.7 0.28 280) 60deg,
        oklch(0.75 0.25 220) 120deg,
        oklch(0.85 0.22 180) 180deg,
        oklch(0.85 0.25 130) 240deg,
        oklch(0.8 0.25 60) 300deg,
        oklch(0.7 0.3 320) 360deg
      )`
      el.style.backgroundImage = gradient
      if (glow) glow.style.backgroundImage = gradient
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Plasma glow za tekstem */}
      <span
        ref={glowRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: "-20px",
          filter: "blur(40px)",
          opacity: 0.4,
          pointerEvents: "none",
          borderRadius: "50%",
        }}
      />
      {/* Właściwy tekst z gradientem */}
      <span
        ref={ref}
        className={className}
        style={{
          ...style,
          display: "inline-block",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          userSelect: "none",
          cursor: "default",
          position: "relative",
        }}
      >
        {children}
      </span>
    </div>
  )
}
