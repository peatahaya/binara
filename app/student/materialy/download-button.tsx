"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { getSignedUrl } from "@/app/actions/materialy"

export function DownloadButton({ plikUrl }: { plikUrl: string }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const url = await getSignedUrl(plikUrl)
    if (url) window.open(url, "_blank")
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-50 shrink-0"
    >
      <Download className="size-3.5" />
      {loading ? "..." : "Pobierz"}
    </button>
  )
}
