import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/auth/get-profile"
import { GlassCard } from "@/components/glass-card"
import { buttonVariants } from "@/components/ui/button"

export default async function UczenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, profile } = await getProfile()

  if (!user || profile?.role !== "tutor") redirect("/login")

  const supabase = await createClient()
  const { data: student } = await supabase.from("students").select("*").eq("id", id).single()

  if (!student) redirect("/tutor/uczniowie")

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Kontakt do rodzica</p>
          <p className="text-sm">{student.rodzic_email ?? "—"}</p>
          <p className="text-sm text-white/50">{student.rodzic_telefon ?? ""}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-3">Notatka</p>
          <p className="text-sm text-white/60">{student.notatka ?? "Brak notatki."}</p>
        </GlassCard>
      </div>

      <div className="flex gap-3">
        <Link href={`/tutor/uczniowie/${id}/materialy`} className={buttonVariants({ variant: "outline" })}>
          Materiały
        </Link>
      </div>
    </div>
  )
}
