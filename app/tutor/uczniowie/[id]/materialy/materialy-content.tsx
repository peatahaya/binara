"use client"

import { useRef, useState, useTransition } from "react"
import { GlassCard } from "@/components/glass-card"
import { uploadMaterial, deleteMaterial, getSignedUrl } from "@/app/actions/materialy"
import { format, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { Plus, Download, Trash2, FileText } from "lucide-react"

type Material = {
  id: string
  nazwa: string
  opis: string | null
  plik_nazwa: string
  plik_url: string
  rozmiar_kb: number | null
  created_at: string
}

interface Props {
  studentId: string
  materialy: Material[]
}

export function MaterialyContent({ studentId, materialy }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await uploadMaterial(studentId, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        formRef.current?.reset()
        setShowForm(false)
      }
    })
  }

  async function handleDownload(plikUrl: string) {
    const url = await getSignedUrl(plikUrl)
    if (url) window.open(url, "_blank")
  }

  function handleDelete(id: string, plikUrl: string) {
    startTransition(async () => {
      await deleteMaterial(id, studentId, plikUrl)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/30 transition-colors"
        >
          <Plus className="size-4" />
          {showForm ? "Anuluj" : "Dodaj materiał"}
        </button>
      </div>

      {showForm && (
        <GlassCard aurora>
          <form ref={formRef} onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-white/50 mb-2 block">Nazwa</label>
              <input
                type="text"
                name="nazwa"
                placeholder="Nazwa materiału"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-white/50 mb-2 block">Opis (opcjonalnie)</label>
              <input
                type="text"
                name="opis"
                placeholder="Opis materiału"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-white/50 mb-2 block">Plik</label>
              <input
                type="file"
                name="plik"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                required
                className="w-full text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white file:text-sm hover:file:bg-white/20 file:cursor-pointer"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-white text-black font-medium py-3 rounded-lg text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Przesyłam..." : "Dodaj materiał"}
            </button>
          </form>
        </GlassCard>
      )}

      {materialy.length === 0 ? (
        <GlassCard>
          <p className="text-white/40 text-sm">Brak materiałów. Dodaj pierwszy plik powyżej.</p>
        </GlassCard>
      ) : (
        materialy.map((m, i) => (
          <GlassCard key={m.id} delay={i * 0.05}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <FileText className="size-5 opacity-30 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-medium truncate">{m.nazwa}</p>
                  {m.opis && <p className="text-sm text-white/50 mt-0.5">{m.opis}</p>}
                  <p className="text-xs text-white/30 mt-1">
                    {m.plik_nazwa}{m.rozmiar_kb ? ` · ${m.rozmiar_kb} KB` : ""} · {format(parseISO(m.created_at), "d MMM yyyy", { locale: pl })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownload(m.plik_url)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/30 transition-colors"
                >
                  <Download className="size-3.5" />
                  Pobierz
                </button>
                <button
                  onClick={() => handleDelete(m.id, m.plik_url)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/40 hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="size-3.5" />
                  Usuń
                </button>
              </div>
            </div>
          </GlassCard>
        ))
      )}
    </div>
  )
}
