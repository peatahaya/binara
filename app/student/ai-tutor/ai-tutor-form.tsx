"use client"

import { useActionState, useRef, useState } from "react"
import { solveTask } from "@/app/actions/solve-task"
import { GlassCard } from "@/components/glass-card"
import { Sparkles, Upload, X } from "lucide-react"
import katex from "katex"
import "katex/dist/katex.min.css"

function renderMath(text: string): string {
  text = text.replace(/\$\$([^$]+)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math, { displayMode: true, throwOnError: false })
    } catch { return math }
  })
  text = text.replace(/\$([^$\n]+)\$/g, (_, math) => {
    try {
      return katex.renderToString(math, { displayMode: false, throwOnError: false })
    } catch { return math }
  })
  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  // Nagłówki ## i ###
  text = text.replace(/^### (.+)$/gm, "<h4 style='margin: 1rem 0 0.5rem; font-weight: 500; font-size: 1rem;'>$1</h4>")
  text = text.replace(/^## (.+)$/gm, "<h3 style='margin: 1.2rem 0 0.6rem; font-weight: 500; font-size: 1.1rem;'>$1</h3>")
  // Listy z *
  text = text.replace(/^\* (.+)$/gm, "<li style='margin-left: 1rem; list-style: disc;'>$1</li>")
  // Podwójny newline jako odstęp
  text = text.replace(/\n\n/g, "<br/><br/>")
  return text.replace(/\n/g, "<br/>")
}

export function AiTutorForm() {
  const [state, formAction, pending] = useActionState(solveTask, null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setPreview(URL.createObjectURL(f))
  }

  function clearImage() {
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <GlassCard aurora>
        <form action={formAction} className="space-y-4">

          <div>
            <label className="text-xs uppercase tracking-widest text-white/50 mb-3 block">
              Zdjęcie zadania
            </label>

            <input
              ref={fileRef}
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFile}
              className="sr-only"
            />

            {preview && (
              <div className="relative mb-2">
                <img src={preview} alt="Zadanie" className="rounded-xl w-full max-h-64 object-contain bg-white/5" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            <div
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center border border-white/10 border-dashed rounded-xl p-8 cursor-pointer hover:border-white/30 hover:bg-white/3 transition-all"
            >
              <Upload className="size-8 opacity-30 mb-3" />
              <p className="text-sm text-white/50">
                {preview ? "Kliknij żeby zmienić zdjęcie" : "Kliknij żeby dodać zdjęcie"}
              </p>
              <p className="text-xs text-white/30 mt-1">JPG, PNG, WEBP · max 5MB</p>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-white/50 mb-2 block">
              Dodatkowe pytanie (opcjonalnie)
            </label>
            <input
              type="text"
              name="question"
              placeholder="np. Nie rozumiem kroku 2..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          {state?.error && (
            <p className="text-red-400 text-sm">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-white text-black font-medium py-3 rounded-lg text-sm hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="size-4" />
            {pending ? "Analizuję zadanie..." : "Rozwiąż zadanie"}
          </button>
        </form>
      </GlassCard>

      {state?.solution && (
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-4 opacity-50" />
            <p className="text-xs uppercase tracking-widest text-white/50">Rozwiązanie</p>
          </div>
          <div
            className="text-sm text-white/80 leading-relaxed prose-math"
            dangerouslySetInnerHTML={{ __html: renderMath(state.solution) }}
          />
        </GlassCard>
      )}
    </div>
  )
}
