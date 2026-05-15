"use client"

import { useState } from "react"
import { useActionState } from "react"
import { GlassCard } from "@/components/glass-card"
import { bookLesson } from "@/app/actions/book-lesson"
import { cn } from "@/lib/utils"

type SlotOption = { slot_id: string; label: string; value: string }
interface Props { slots: SlotOption[] }

const opcje = [45, 60, 90, 120]

export function UmowForm({ slots }: Props) {
  const [state, formAction] = useActionState(bookLesson, null)
  const [selected, setSelected] = useState<string>("")
  const [dlugosc, setDlugosc] = useState(60)

  return (
    <GlassCard className="max-w-lg">
      <form action={formAction} className="space-y-6">

        <div>
          <label className="text-xs uppercase tracking-widest text-white/50 mb-3 block">
            Wybierz termin
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1 custom-scroll">
            {slots.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => setSelected(slot.value)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border transition-all duration-200",
                  selected === slot.value
                    ? "border-white/40 bg-white/8 text-white"
                    : "border-white/8 bg-white/3 text-white/60 hover:border-white/20 hover:text-white/90 hover:bg-white/5"
                )}
              >
                <span className="text-sm font-medium">{slot.label}</span>
              </button>
            ))}
          </div>
          <input type="hidden" name="data_start" value={selected} />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-white/50 mb-3 block">
            Czas trwania
          </label>
          <div className="flex gap-2">
            {opcje.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setDlugosc(o)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm border transition-all",
                  dlugosc === o
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/8 text-white/50 hover:border-white/20 hover:text-white/80"
                )}
              >
                {o} min
              </button>
            ))}
          </div>
          <input type="hidden" name="dlugosc_min" value={dlugosc} />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-white/50 mb-3 block">
            Temat (opcjonalnie)
          </label>
          <input
            type="text"
            name="temat"
            placeholder="np. Trygonometria, pochodne..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
          />
        </div>

        {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}

        {state?.success ? (
          <div className="text-center py-4">
            <p className="text-white/70 text-sm mb-3">Lekcja została umówiona!</p>
            <a href="/student/lekcje" className="text-sm underline text-white/50 hover:text-white">
              Zobacz moje lekcje →
            </a>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-white text-black font-medium py-3 rounded-lg text-sm hover:bg-white/90 transition-colors"
          >
            Umów lekcję
          </button>
        )}

      </form>
    </GlassCard>
  )
}
