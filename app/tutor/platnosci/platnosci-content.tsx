"use client"

import { useState, useTransition } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Wallet } from "lucide-react"
import { format, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { addPayment } from "./actions"

type Student = { id: string; imie: string; nazwisko: string }
type Payment = { id: string; student_id: string; kwota: number; data_wplaty: string; za_okres: string | null }
type StudentStats = { student: Student; sumaMiesiąc: number; ostatnia: string | null }

export function PlatnosciContent({
  students,
  payments,
  monthPayments,
}: {
  students: Student[]
  payments: Payment[]
  monthPayments: Payment[]
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const sumaMiesiąc = monthPayments.reduce((s, p) => s + Number(p.kwota), 0)
  const srednia = students.length > 0 ? sumaMiesiąc / students.length : 0

  const statsPerStudent: StudentStats[] = students.map((s) => {
    const mine = monthPayments.filter((p) => p.student_id === s.id)
    const allMine = payments.filter((p) => p.student_id === s.id)
    const sorted = allMine.sort((a, b) => b.data_wplaty.localeCompare(a.data_wplaty))
    return {
      student: s,
      sumaMiesiąc: mine.reduce((sum, p) => sum + Number(p.kwota), 0),
      ostatnia: sorted[0]?.data_wplaty ?? null,
    }
  })

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await addPayment(formData)
      if (result?.error) setError(result.error)
      else setOpen(false)
    })
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Płatności</h1>
        <Button onClick={() => setOpen(true)}><Plus className="size-4" /> Dodaj wpłatę</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle>Nowa wpłata</DialogTitle></DialogHeader>
            <form action={handleSubmit} className="space-y-3 py-2">
              <select name="student_id" required className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50">
                <option value="">Wybierz ucznia…</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.imie} {s.nazwisko}</option>)}
              </select>
              <Input name="kwota" type="number" placeholder="Kwota (zł)" min={1} step={0.01} required />
              <Input name="data_wplaty" type="date" defaultValue={today} />
              <Input name="za_okres" placeholder="Za okres (np. kwiecień 2026)" />
              <Input name="notatka" placeholder="Notatka" />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <DialogFooter>
                <Button type="submit" disabled={pending}>{pending ? "Zapisywanie…" : "Zapisz"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-white/10">
                <th className="text-left py-2 pr-4 font-medium">Uczeń</th>
                <th className="text-right py-2 px-4 font-medium">Suma (ten miesiąc)</th>
                <th className="text-right py-2 pl-4 font-medium">Ostatnia wpłata</th>
              </tr>
            </thead>
            <tbody>
              {statsPerStudent.map((row) => (
                <tr key={row.student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 font-medium">{row.student.imie} {row.student.nazwisko}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={row.sumaMiesiąc > 0 ? "text-primary font-semibold" : "text-muted-foreground"}>
                      {row.sumaMiesiąc > 0 ? `${row.sumaMiesiąc} zł` : "—"}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-right text-muted-foreground">
                    {row.ostatnia ? format(parseISO(row.ostatnia), "d MMM yyyy", { locale: pl }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Wallet, label: "Suma wpłat (ten miesiąc)", value: `${sumaMiesiąc.toFixed(0)} zł` },
          { icon: Wallet, label: "Średnia wpłata na ucznia", value: `${srednia.toFixed(0)} zł` },
          { icon: Wallet, label: "Liczba wpłat (ten miesiąc)", value: monthPayments.length },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.1}>
            <s.icon className="size-5 text-primary mb-3" />
            <p className="text-2xl font-bold mb-1">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
