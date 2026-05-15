import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth/get-profile"
import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass-card"
import { format, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { FileText } from "lucide-react"
import { DownloadButton } from "./download-button"

export default async function StudentMaterialy() {
  const { user, profile } = await getProfile()

  if (!user || profile?.role !== "student" || !profile.student_id) {
    redirect("/login")
  }

  const supabase = await createClient()
  const { data: materialy } = await supabase
    .from("materialy")
    .select("*")
    .eq("student_id", profile.student_id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <h1>Materiały</h1>

      {(materialy ?? []).length === 0 ? (
        <GlassCard>
          <p className="text-white/40 text-sm">Brak materiałów. Korepetytor jeszcze nic nie dodał.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {(materialy ?? []).map((m, i) => (
            <GlassCard key={m.id} delay={i * 0.05}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <FileText className="size-5 opacity-30 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.nazwa}</p>
                    {m.opis && <p className="text-sm text-white/50 mt-0.5">{m.opis}</p>}
                    <p className="text-xs text-white/30 mt-1">
                      {m.plik_nazwa}{m.rozmiar_kb ? ` · ${m.rozmiar_kb} KB` : ""} · {format(parseISO(m.created_at), "d MMM yyyy", { locale: pl })}
                    </p>
                  </div>
                </div>
                <DownloadButton plikUrl={m.plik_url} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
