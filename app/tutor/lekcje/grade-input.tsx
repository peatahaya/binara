"use client"

import { useRef, useState, useEffect, useTransition } from "react"
import { saveGrade } from "./actions"

const ITEM_HEIGHT = 36
const VISIBLE_ITEMS = 5

export function GradeInput({ lessonId, currentGrade }: { lessonId: string, currentGrade: number | null }) {
  const values = Array.from({ length: 101 }, (_, i) => i) // 0-100
  const initialIndex = currentGrade ?? 50
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = selectedIndex * ITEM_HEIGHT
    }
  }, [open])

  function handleScroll() {
    if (!listRef.current) return
    const index = Math.round(listRef.current.scrollTop / ITEM_HEIGHT)
    setSelectedIndex(Math.max(0, Math.min(100, index)))
  }

  function handleSave() {
    setOpen(false)
    if (selectedIndex === currentGrade) return
    startTransition(async () => {
      await saveGrade(lessonId, selectedIndex)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/25 transition-colors text-sm text-white/70 hover:text-white"
      >
        {currentGrade !== null ? `${currentGrade}%` : "Oceń"}
        {saved && <span className="text-green-400 text-xs">✓</span>}
      </button>

      {/* Picker overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "oklch(0 0 0 / 0.3)" }}
          onClick={handleSave}
        >
          <div
            className="relative"
            style={{
              background: "oklch(0.15 0 0 / 0.5)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid oklch(1 0 0 / 0.12)",
              borderRadius: "16px",
              padding: "16px",
              width: "160px",
              boxShadow: "0 8px 32px oklch(0 0 0 / 0.4)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-widest text-white/40 text-center mb-3">Ocena</p>

            {/* Drum roll container */}
            <div style={{ position: "relative", height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
              {/* Selection highlight */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
                transform: "translateY(-50%)",
                background: "oklch(1 0 0 / 0.06)",
                borderRadius: "8px",
                pointerEvents: "none",
                zIndex: 1,
              }} />

              {/* Top fade */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: ITEM_HEIGHT * 2,
                background: "linear-gradient(to bottom, oklch(0.11 0 0), transparent)",
                pointerEvents: "none",
                zIndex: 2,
              }} />

              {/* Bottom fade */}
              <div style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: ITEM_HEIGHT * 2,
                background: "linear-gradient(to top, oklch(0.11 0 0), transparent)",
                pointerEvents: "none",
                zIndex: 2,
              }} />

              {/* Scrollable list */}
              <div
                ref={listRef}
                onScroll={handleScroll}
                style={{
                  height: "100%",
                  overflowY: "scroll",
                  scrollSnapType: "y mandatory",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {/* Padding top */}
                <div style={{ height: ITEM_HEIGHT * 2 }} />
                {values.map(v => (
                  <div
                    key={v}
                    onClick={() => {
                      setSelectedIndex(v)
                      listRef.current!.scrollTo({ top: v * ITEM_HEIGHT, behavior: "smooth" })
                    }}
                    style={{
                      height: ITEM_HEIGHT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      scrollSnapAlign: "center",
                      fontSize: v === selectedIndex ? "18px" : "14px",
                      fontWeight: v === selectedIndex ? 600 : 400,
                      color: v === selectedIndex
                        ? "oklch(0.98 0 0)"
                        : `oklch(${0.4 + 0.15 * (1 - Math.abs(v - selectedIndex) / 5)} 0 0)`,
                      transition: "font-size 0.15s ease, color 0.15s ease",
                      cursor: "pointer",
                    }}
                  >
                    {v}%
                  </div>
                ))}
                {/* Padding bottom */}
                <div style={{ height: ITEM_HEIGHT * 2 }} />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={pending}
              style={{
                marginTop: "12px",
                width: "100%",
                background: "oklch(0.98 0 0)",
                color: "oklch(0.08 0 0)",
                border: "none",
                borderRadius: "10px",
                padding: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {pending ? "Zapisuję..." : "Zapisz"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
