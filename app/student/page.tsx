import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth/get-profile"
import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns"
import { pl } from "date-fns/locale"

const statusLabels: Record<string, string> = {
  zaplanowana: "Zaplanowana",
  odbyta: "Odbyta",
  odwolana: "Odwołana",
  oczekuje_na_potwierdzenie: "Oczekuje na potwierdzenie",
}
const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  zaplanowana: "secondary",
  odbyta: "default",
  odwolana: "destructive",
  oczekuje_na_potwierdzenie: "secondary",
}

export default async function StudentDashboard() {
  const { user, profile } = await getProfile()

  if (!user || profile?.role !== "student" || !profile.student_id) {
    redirect("/login")
  }

  const supabase = await createClient()
  const now = new Date()

  const [
    { data: student },
    { data: lessonsUpcoming },
    { data: payments },
    { data: lessonsThisMonth },
  ] = await Promise.all([
    supabase.from("students").select("imie, stawka_godzinowa").eq("id", profile.student_id).single(),
    supabase.from("lessons").select("id, data_start, dlugosc_min, status, temat")
      .eq("student_id", profile.student_id).in("status", ["zaplanowana", "oczekuje_na_potwierdzenie"])
      .gte("data_start", now.toISOString()).order("data_start", { ascending: true }).limit(3),
    supabase.from("payments").select("kwota, data_wplaty, za_okres")
      .eq("student_id", profile.student_id).order("data_wplaty", { ascending: false }).limit(5),
    supabase.from("lessons").select("dlugosc_min")
      .eq("student_id", profile.student_id).eq("status", "odbyta")
      .gte("data_start", startOfMonth(now).toISOString())
      .lte("data_start", endOfMonth(now).toISOString()),
  ])

  const stawka = student?.stawka_godzinowa ?? 0
  const zarobek = (lessonsThisMonth ?? []).reduce((acc, l) => acc + (l.dlugosc_min / 60) * stawka, 0)
  const sumaWplat = (payments ?? []).reduce((acc, p) => acc + Number(p.kwota), 0)
  const saldo = sumaWplat - zarobek

  const weekStart = startOfWeek(now, { locale: pl })
  const weekEnd = endOfWeek(now, { locale: pl })
  const lessonsThisWeek = (lessonsUpcoming ?? []).filter(l => {
    const d = parseISO(l.data_start)
    return d >= weekStart && d <= weekEnd
  }).length

  const nextLesson = lessonsUpcoming?.[0]

  return (
    <div className="space-y-8">
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontWeight: 400 }}>Cześć, {student?.imie ?? ""}!</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard delay={0}>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Lekcje w tym tygodniu</p>
          <p className="text-5xl font-light">{lessonsThisWeek}</p>
        </GlassCard>
        <GlassCard delay={0.1}>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Następna lekcja</p>
          <p className="text-lg font-light">
            {nextLesson ? format(parseISO(nextLesson.data_start), "d MMM, HH:mm", { locale: pl }) : "Brak"}
          </p>
        </GlassCard>
        <GlassCard delay={0.2}>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Saldo</p>
          <p className={`text-5xl font-light ${saldo >= 0 ? "text-green-400" : "text-red-400"}`}>
            {saldo >= 0 ? "+" : ""}{Math.round(saldo)} zł
          </p>
        </GlassCard>
        <GlassCard delay={0.3}>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Wpłacono łącznie</p>
          <p className="text-5xl font-light">{Math.round(sumaWplat)} zł</p>
        </GlassCard>
      </div>

      <div className="space-y-3">
        <h2 className="mb-4 flex items-center gap-2">Najbliższe lekcje</h2>
        {(lessonsUpcoming ?? []).length === 0 ? (
          <GlassCard><p className="text-white/40 text-sm">Brak zaplanowanych lekcji.</p></GlassCard>
        ) : (lessonsUpcoming ?? []).map((lesson, i) => (
          <GlassCard key={lesson.id} delay={i * 0.1}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{lesson.temat ?? "Lekcja"}</p>
                <p className="text-xs text-white/50 mt-1">
                  {format(parseISO(lesson.data_start), "d MMM yyyy, HH:mm", { locale: pl })}
                  {" · "}{lesson.dlugosc_min} min
                </p>
              </div>
              <Badge variant={statusVariants[lesson.status]}>{statusLabels[lesson.status]}</Badge>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="mb-4 flex items-center gap-2">Ostatnie wpłaty</h2>
        {(payments ?? []).length === 0 ? (
          <GlassCard><p className="text-white/40 text-sm">Brak wpłat.</p></GlassCard>
        ) : (payments ?? []).map((p, i) => (
          <GlassCard key={i} delay={i * 0.05}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{p.za_okres}</p>
                <p className="text-xs text-white/50">{format(parseISO(p.data_wplaty), "d MMM yyyy", { locale: pl })}</p>
              </div>
              <p className="text-lg font-light">+{p.kwota} zł</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
