"use client"

import { useState, useTransition } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Mail, Phone, Plus } from "lucide-react"
import { addStudent } from "./actions"

type Student = {
  id: string
  imie: string
  nazwisko: string
  klasa: string | null
  stawka_godzinowa: number | null
  rodzic_email: string | null
  rodzic_telefon: string | null
}

export function UczniowieContent({ students }: { students: Student[] }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await addStudent(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setOpen(false)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Uczniowie</h1>
        <Button onClick={() => setOpen(true)}><Plus className="size-4" /> Dodaj ucznia</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nowy uczeń</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="grid grid-cols-2 gap-3 py-2">
              <Input name="imie" placeholder="Imię" required />
              <Input name="nazwisko" placeholder="Nazwisko" required />
              <Input name="klasa" placeholder="Klasa (np. 3LO)" />
              <Input name="stawka_godzinowa" type="number" placeholder="Stawka zł/h" />
              <Input name="rodzic_email" type="email" placeholder="E-mail rodzica" className="col-span-2" />
              <Input name="rodzic_telefon" placeholder="Telefon rodzica" className="col-span-2" />
              <Input name="notatka" placeholder="Notatka" className="col-span-2" />
              {error && <p className="col-span-2 text-destructive text-sm">{error}</p>}
              <DialogFooter className="col-span-2">
                <Button type="submit" disabled={pending}>
                  {pending ? "Zapisywanie…" : "Zapisz"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {students.length === 0 && (
        <GlassCard><p className="text-muted-foreground text-sm">Brak uczniów. Dodaj pierwszego!</p></GlassCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((s, i) => (
          <GlassCard key={s.id} delay={i * 0.05} clickable>
            <p className="font-semibold text-lg">{s.imie} {s.nazwisko}</p>
            {s.klasa && <p className="text-sm text-muted-foreground mt-0.5">{s.klasa}</p>}
            {s.stawka_godzinowa && (
              <p className="text-primary font-medium mt-2">{s.stawka_godzinowa} zł/h</p>
            )}
            <div className="flex flex-col gap-1 mt-3">
              {s.rodzic_email && (
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Mail className="size-3" /> {s.rodzic_email}
                </span>
              )}
              {s.rodzic_telefon && (
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Phone className="size-3" /> {s.rodzic_telefon}
                </span>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
