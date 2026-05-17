"use client"

import { useState, useTransition } from "react"
import { Calendar } from "@/components/ui/calendar"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { format, isSameDay, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { addLesson } from "./actions"
import { GradeInput } from "./grade-input"

type Lesson = { id: string; data_start: string; dlugosc_min: number; status: string; temat: string | null; ocena: number | null; students: { imie: string; nazwisko: string } | null }
type Student = { id: string; imie: string; nazwisko: string }

const statusLabels: Record<string, string> = { zaplanowana: "Zaplanowana", odbyta: "Odbyta", odwolana: "Odwołana" }
const statusVariants: Record<string, "default" | "secondary" | "destructive"> = { zaplanowana: "secondary", odbyta: "default", odwolana: "destructive" }

export function LekcjeContent({ lessons, students }: { lessons: Lesson[]; students: Student[] }) {
  const [selected, setSelected] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const dayLessons = lessons.filter((l) => isSameDay(parseISO(l.data_start), selected))

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await addLesson(formData)
      if (result?.error) setError(result.error)
      else setOpen(false)
    })
  }

  const defaultDate = format(selected, "yyyy-MM-dd")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lekcje</h1>
        <Button onClick={() => setOpen(true)}><Plus className="size-4" /> Dodaj lekcję</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle>Nowa lekcja</DialogTitle></DialogHeader>
            <form action={handleSubmit} className="space-y-3 py-2">
              <select name="student_id" required className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50">
                <option value="">Wybierz ucznia…</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.imie} {s.nazwisko}</option>)}
              </select>
              <Input name="data_start" type="datetime-local" defaultValue={`${defaultDate}T09:00`} required />
              <Input name="dlugosc_min" type="number" placeholder="Długość (min)" defaultValue={60} min={15} step={15} />
              <Input name="temat" placeholder="Temat lekcji" />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <DialogFooter>
                <Button type="submit" disabled={pending}>{pending ? "Zapisywanie…" : "Zapisz"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <GlassCard className="lg:w-auto w-full flex justify-center">
          <Calendar locale={pl} mode="single" selected={selected} onSelect={(d) => d && setSelected(d)} />
        </GlassCard>

        <div className="flex-1 space-y-3">
          <h2 className="text-base font-medium text-muted-foreground">
            {format(selected, "EEEE, d MMMM yyyy", { locale: pl })}
          </h2>
          {dayLessons.length === 0 && (
            <GlassCard><p className="text-muted-foreground text-sm">Brak lekcji w wybranym dniu.</p></GlassCard>
          )}
          {dayLessons.map((l, i) => (
            <GlassCard key={l.id} delay={i * 0.05} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{l.students?.imie} {l.students?.nazwisko}</p>
                <p className="text-sm text-muted-foreground">{l.temat ?? "Brak tematu"}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{format(parseISO(l.data_start), "HH:mm")}</p>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  <span className="text-xs text-muted-foreground">{l.dlugosc_min} min</span>
                  <Badge variant={statusVariants[l.status]}>{statusLabels[l.status]}</Badge>
                </div>
                {l.status === "odbyta" && (
                  <div className="mt-2 flex justify-end">
                    <GradeInput lessonId={l.id} currentGrade={l.ocena ?? null} />
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}
