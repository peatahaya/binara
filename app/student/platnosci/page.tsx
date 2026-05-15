import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth/get-profile"
import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass-card"
import { format, parseISO } from "date-fns"
import { pl } from "date-fns/locale"

export default async function StudentPlatnosci() {
  const { user, profile } = await getProfile()

  if (!user || profile?.role !== "student" || !profile.student_id) {
    redirect("/login")
  }

  const supabase = await createClient()

  const [{ data: payments }, { data: student }, { data: odbyte }] = await Promise.all([
    supabase
      .from("payments")
      .select("id, kwota, data_wplaty, za_okres, notatka")
      .eq("student_id", profile.student_id)
      .order("data_wplaty", { ascending: false }),
    supabase
      .from("students")
      .select("stawka_godzinowa")
      .eq("id", profile.student_id)
      .single(),
    supabase
      .from("lessons")
      .select("dlugosc_min")
      .eq("student_id", profile.student_id)
      .eq("status", "odbyta"),
  ])

  const stawka = student?.stawka_godzinowa ?? 0
  const naleznosc = (odbyte ?? []).reduce((sum, l) => sum + (l.dlugosc_min / 60) * stawka, 0)
  const sumaWplat = (payments ?? []).reduce((sum, p) => sum + Number(p.kwota), 0)
  const saldo = sumaWplat - naleznosc

  return (
    <div className="space-y-6">
      <h1>Płatności</h1>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Saldo</p>
          <p className={`text-4xl font-light ${saldo >= 0 ? "text-green-400" : "text-red-400"}`}>
            {saldo >= 0 ? "+" : ""}{Math.round(saldo)} zł
          </p>
          <p className="text-xs text-white/40 mt-2">
            {saldo >= 0 ? "Nadpłata" : "Do zapłaty"}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Wpłacono łącznie</p>
          <p className="text-4xl font-light">{Math.round(sumaWplat)} zł</p>
          <p className="text-xs text-white/40 mt-2">wszystkie wpłaty</p>
        </GlassCard>
      </div>

      <div className="space-y-3">
        <h2 className="mb-4 flex items-center gap-2">Historia wpłat</h2>
        {(payments ?? []).length === 0 ? (
          <GlassCard>
            <p className="text-white/40 text-sm">Brak wpłat.</p>
          </GlassCard>
        ) : (
          (payments ?? []).map((p, i) => (
            <GlassCard key={p.id} delay={i * 0.05}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{p.za_okres}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {format(parseISO(p.data_wplaty), "d MMM yyyy", { locale: pl })}
                  </p>
                  {p.notatka && <p className="text-xs text-white/40 mt-1">{p.notatka}</p>}
                </div>
                <p className="text-xl font-light text-green-400">+{p.kwota} zł</p>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}
