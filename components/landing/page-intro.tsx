"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LETTERS = "binara".split("")

export function PageIntro({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"intro" | "exit" | "done">("intro")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress bar wypełnia się przez 2.2s
    const start = performance.now()
    const duration = 2200
    const raf = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      // ease-out cubic
      setProgress(1 - Math.pow(1 - p, 3))
      if (p < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    const t1 = setTimeout(() => setPhase("exit"), 2400)
    const t2 = setTimeout(() => setPhase("done"), 3400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <>
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {/* Litery wchodzą jedna po drugiej */}
            <div style={{ display: "flex", gap: "0.02em" }}>
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 60, filter: "blur(16px)" }}
                  animate={
                    phase === "intro"
                      ? {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.8,
                            delay: 0.1 + i * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }
                      : {
                          opacity: 0,
                          y: -50,
                          filter: "blur(12px)",
                          scale: 0.95,
                          transition: {
                            duration: 0.6,
                            delay: i * 0.04,
                            ease: [0.76, 0, 0.24, 1],
                          },
                        }
                  }
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontSize: "clamp(64px, 12vw, 160px)",
                    fontWeight: 400,
                    color: "white",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    userSelect: "none",
                    display: "inline-block",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>


            {/* Aurora progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              style={{
                marginTop: "48px",
                width: "200px",
                height: "2px",
                borderRadius: "2px",
                background: "oklch(1 0 0 / 0.06)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg,
                    oklch(0.7 0.3 320),
                    oklch(0.7 0.28 280),
                    oklch(0.75 0.25 220),
                    oklch(0.85 0.22 180),
                    oklch(0.85 0.25 130)
                  )`,
                  borderRadius: "2px",
                  boxShadow: "0 0 12px oklch(0.75 0.25 220 / 0.8)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sekcje strony wchodzą z opóźnieniem jedna po drugiej */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase === "done" ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.01 }}
      >
        {children}
      </motion.div>
    </>
  )
}
