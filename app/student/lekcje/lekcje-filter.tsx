"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const filtry = [
  { label: "Wszystkie", value: "wszystkie" },
  { label: "Zaplanowane", value: "zaplanowana" },
  { label: "Odbyte", value: "odbyta" },
  { label: "Odwołane", value: "odwolana" },
]

export function LekcjeFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const aktywny = searchParams.get("status") ?? "wszystkie"

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "wszystkie") {
      params.delete("status")
    } else {
      params.set("status", value)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {filtry.map((f) => (
        <button
          key={f.value}
          onClick={() => handleClick(f.value)}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs uppercase tracking-widest transition-colors border",
            aktywny === f.value
              ? "bg-white text-black border-white"
              : "bg-transparent text-white/50 border-white/20 hover:border-white/40 hover:text-white/80"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
