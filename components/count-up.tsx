"use client"

import { useEffect, useRef, useState } from "react"

export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value])

  return <>{display}{suffix}</>
}
