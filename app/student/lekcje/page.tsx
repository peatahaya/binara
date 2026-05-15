import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth/get-profile"
import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { LekcjeFilter } from "./lekcje-filter"

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

export default async function StudentLekcje({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { user, profile } = await getProfile()

  if (!user || profile?.role !== "student" || !profile.student_id) {
    redirect("/login")
  }

  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("lessons")
    .select("id, data_start, dlugosc_min, status, temat, notatki")
    .eq("student_id", profile.student_id)
    .order("data_start", { ascending: false })

  if (status && status !== "wszystkie") {
    query = query.eq("status", status)
  }

  const { data: lessons } = await query

  return (
    <div className="space-y-6">
      <h1>Moje lekcje</h1>

      <LekcjeFilter />

      <div className="space-y-3">
        {(lessons ?? []).length === 0 ? (
          <GlassCard>
            <p className="text-white/40 text-sm">Brak lekcji.</p>
          </GlassCard>
        ) : (
          (lessons ?? []).map((lesson, i) => (
            <GlassCard key={lesson.id} delay={i * 0.05}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{lesson.temat ?? "Lekcja"}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {format(parseISO(lesson.data_start), "d MMM yyyy, HH:mm", { locale: pl })}
                    {" · "}{lesson.dlugosc_min} min
                  </p>
                  {lesson.notatki && (
                    <p className="text-xs text-white/40 mt-2">{lesson.notatki}</p>
                  )}
                </div>
                <Badge variant={statusVariants[lesson.status]}>
                  {statusLabels[lesson.status]}
                </Badge>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}
