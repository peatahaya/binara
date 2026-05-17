import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth/get-profile"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { ProgressChart } from "@/components/progress-chart"
import { format, parseISO } from "date-fns"
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

export default async function UczenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, profile } = await getProfile()

  if (!user || profile?.role !== "tutor") redirect("/login")

  const supabase = await createClient()

  const [
    { data: student },
    { data: lessonsUpcoming },
    { data: lessonsAll },
    { data: payments },
    { data: lessonsWithGrades },
  ] = await Promise.all([
    supabase.from("students").select("*").eq("id", id).single(),
    supabase.from("lessons")
      .select("id, data_start, dlugosc_min, status, temat")
      .eq("student_id", id)
      .in("status", ["zaplanowana", "oczekuje_na_potwierdzenie"])
      .gte("data_start", new Date().toISOString())
      .order("data_start", { ascending: true })
      .limit(3),
    supabase.from("lessons")
      .select("id, data_start, dlugosc_min, status, temat, ocena")
      .eq("student_id", id)
      .eq("status", "odbyta")
      .order("data_start", { ascending: false })
      .limit(10),
    supabase.from("payments")
      .select("id, kwota, data_wplaty, za_okres")
      .eq("student_id", id)
      .order("data_wplaty", { ascending: false })
      .limit(5),
    supabase.from("lessons")
      .select("data_start, ocena, temat")
      .eq("student_id", id)
      .eq("status", "odbyta")
      .not("ocena", "is", null)
      .order("data_start", { ascending: true }),
  ])

  if (!student) redirect("/tutor/uczniowie")

  const stawka = student.stawka_godzinowa ?? 0
  const naleznosc = (lessonsAll ?? []).reduce((acc, l) => acc + (l.dlugosc_min / 60) * stawka, 0)
  const sumaWplat = (payments ?? []).reduce((acc, p) => acc + Number(p.kwota), 0)
  const saldo = sumaWplat - naleznosc

  const chartData = (lessonsWithGrades ?? []).map(l => ({
    date: format(parseISO(l.data_start), "d MMM", { locale: pl }),
    ocena: l.ocena as number,
    temat: l.temat,
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1>{student.imie} {student.nazwisko}</h1>
          <p className="text-white/40 text-sm">
            {student.klasa ? `${student.klasa} · ` : ""}{student.stawka_godzinowa} zł/h
          </p>
        </div>
        <Link href="/tutor/uczniowie" className="text-sm text-white/40 hover:text-white transition-colors">
          ← Uczniowie
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Kontakt do rodzica</p>
          <p className="text-sm">{student.rodzic_email ?? "—"}</p>
          <p className="text-sm text-white/50">{student.rodzic_telefon ?? ""}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Saldo</p>
          <p className={`text-3xl font-light ${saldo >= 0 ? "text-green-400" : "text-red-400"}`}>
            {saldo >= 0 ? "+" : ""}{Math.round(saldo)} zł
          </p>
          <p className="text-xs text-white/30 mt-1">wpłacono {Math.round(sumaWplat)} zł</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Notatka</p>
          <p className="text-sm text-white/60">{student.notatka ?? "Brak notatki."}</p>
        </GlassCard>
      </div>

      {chartData.length > 0 && (
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Postęp ucznia</p>
          <ProgressChart data={chartData} />
        </GlassCard>
      )}

      <div className="space-y-3">
        <h2 className="mb-4 flex items-center gap-2">Najbliższe lekcje</h2>
        {(lessonsUpcoming ?? []).length === 0 ? (
          <GlassCard><p className="text-white/40 text-sm">Brak zaplanowanych lekcji.</p></GlassCard>
        ) : (lessonsUpcoming ?? []).map((lesson, i) => (
          <GlassCard key={lesson.id} delay={i * 0.05}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{lesson.temat ?? "Lekcja"}</p>
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
        <h2 className="mb-4 flex items-center gap-2">Historia lekcji</h2>
        {(lessonsAll ?? []).length === 0 ? (
          <GlassCard><p className="text-white/40 text-sm">Brak odbytych lekcji.</p></GlassCard>
        ) : (lessonsAll ?? []).map((lesson, i) => (
          <GlassCard key={lesson.id} delay={i * 0.05}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{lesson.temat ?? "Lekcja"}</p>
                <p className="text-xs text-white/50 mt-1">
                  {format(parseISO(lesson.data_start), "d MMM yyyy, HH:mm", { locale: pl })}
                  {" · "}{lesson.dlugosc_min} min
                </p>
              </div>
              <div className="flex items-center gap-3">
                {lesson.ocena !== null && (
                  <span className="text-sm font-medium text-blue-400">{lesson.ocena}%</span>
                )}
                <Badge variant={statusVariants[lesson.status]}>{statusLabels[lesson.status]}</Badge>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="mb-4 flex items-center gap-2">Ostatnie wpłaty</h2>
        {(payments ?? []).length === 0 ? (
          <GlassCard><p className="text-white/40 text-sm">Brak wpłat.</p></GlassCard>
        ) : (payments ?? []).map((p, i) => (
          <GlassCard key={p.id} delay={i * 0.05}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{p.za_okres}</p>
                <p className="text-xs text-white/50">
                  {format(parseISO(p.data_wplaty), "d MMM yyyy", { locale: pl })}
                </p>
              </div>
              <p className="text-lg font-light text-green-400">+{p.kwota} zł</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href={`/tutor/uczniowie/${id}/materialy`} className={buttonVariants({ variant: "outline" })}>
          Materiały
        </Link>
      </div>
    </div>
  )
}
