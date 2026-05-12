import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass-card"
import { Calendar, Clock, Wallet, AlertCircle, BookOpen } from "lucide-react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

const statusLabels: Record<string, string> = {
  zaplanowana: "Zaplanowana",
  odbyta: "Odbyta",
  odwolana: "Odwołana",
}
const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  zaplanowana: "secondary",
  odbyta: "default",
  odwolana: "destructive",
}

export default async function TutorDashboard() {
  const supabase = await createClient()
  const now = new Date()

  const [{ data: lessonsWeek }, { data: lessonsMonth }, { data: payments }, { data: upcoming }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("id")
        .gte("data_start", startOfWeek(now, { weekStartsOn: 1 }).toISOString())
        .lte("data_start", endOfWeek(now, { weekStartsOn: 1 }).toISOString()),
      supabase
        .from("lessons")
        .select("dlugosc_min, status, student_id, students(stawka_godzinowa)")
        .gte("data_start", startOfMonth(now).toISOString())
        .lte("data_start", endOfMonth(now).toISOString()),
      supabase
        .from("payments")
        .select("kwota"),
      supabase
        .from("lessons")
        .select("id, data_start, dlugosc_min, status, temat, students(imie, nazwisko)")
        .gte("data_start", now.toISOString())
        .eq("status", "zaplanowana")
        .order("data_start", { ascending: true })
        .limit(5),
    ])

  const hoursMonth = (lessonsMonth ?? [])
    .filter((l) => l.status === "odbyta")
    .reduce((sum, l) => sum + l.dlugosc_min / 60, 0)

  const earningsMonth = (lessonsMonth ?? [])
    .filter((l) => l.status === "odbyta")
    .reduce((sum, l) => {
      const stawka = (l.students as { stawka_godzinowa: number } | null)?.stawka_godzinowa ?? 0
      return sum + (l.dlugosc_min / 60) * stawka
    }, 0)

  const totalPaid = (payments ?? []).reduce((sum, p) => sum + Number(p.kwota), 0)
  const totalOwed = (lessonsMonth ?? [])
    .filter((l) => l.status === "odbyta")
    .reduce((sum, l) => {
      const stawka = (l.students as { stawka_godzinowa: number } | null)?.stawka_godzinowa ?? 0
      return sum + (l.dlugosc_min / 60) * stawka
    }, 0)
  const overdue = Math.max(0, totalOwed - totalPaid)

  const stats = [
    { label: "Lekcje w tym tygodniu", value: lessonsWeek?.length ?? 0, icon: Calendar, trend: "zaplanowane i odbyte" },
    { label: "Godziny w miesiącu", value: `${hoursMonth.toFixed(1)} h`, icon: Clock, trend: "tylko odbyte lekcje" },
    { label: "Zarobek w miesiącu", value: `${earningsMonth.toFixed(0)} zł`, icon: Wallet, trend: "na podstawie stawek" },
    { label: "Zaległe wpłaty", value: `${overdue.toFixed(0)} zł`, icon: AlertCircle, trend: "pozostałe do zapłaty" },
  ]

  return (
    <div className="space-y-8" style={{ position: "relative", zIndex: 1 }}>
      <h1>Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.1}>
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs uppercase tracking-widest text-white/50">{s.label}</p>
              <s.icon className="size-5 opacity-30 shrink-0" />
            </div>
            <p className="text-5xl font-light mb-2">{s.value}</p>
            <p className="text-xs text-white/40">{s.trend}</p>
          </GlassCard>
        ))}
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2">
          <BookOpen className="size-5 opacity-50" />
          Najbliższe lekcje
        </h2>
        <div className="space-y-3">
          {upcoming?.length === 0 && (
            <GlassCard><p className="text-muted-foreground text-sm">Brak zaplanowanych lekcji.</p></GlassCard>
          )}
          {upcoming?.map((l, i) => {
            const student = l.students as { imie: string; nazwisko: string } | null
            return (
              <GlassCard key={l.id} delay={i * 0.05} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{student?.imie} {student?.nazwisko}</p>
                  <p className="text-sm text-muted-foreground">{l.temat ?? "Brak tematu"}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{format(parseISO(l.data_start), "d MMM, HH:mm", { locale: pl })}</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{l.dlugosc_min} min</span>
                    <Badge variant={statusVariants[l.status]}>{statusLabels[l.status]}</Badge>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}
