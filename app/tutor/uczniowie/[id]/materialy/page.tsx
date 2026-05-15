import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass-card"
import Link from "next/link"
import { MaterialyContent } from "./materialy-content"

export default async function MaterialyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: student }, { data: materialy }] = await Promise.all([
    supabase.from("students").select("imie, nazwisko").eq("id", id).single(),
    supabase.from("materialy").select("*").eq("student_id", id).order("created_at", { ascending: false }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Materiały</h1>
          <p className="text-white/40 text-sm">{student?.imie} {student?.nazwisko}</p>
        </div>
        <Link href={`/tutor/uczniowie/${id}`} className="text-sm text-white/40 hover:text-white transition-colors">
          ← Wróć do ucznia
        </Link>
      </div>
      <MaterialyContent studentId={id} materialy={materialy ?? []} />
    </div>
  )
}
