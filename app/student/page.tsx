import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth/get-profile"
import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass-card"
import { Calendar, History, Wallet, CalendarCheck } from "lucide-react"

const cards = [
  { label: "Najbliższe lekcje", icon: Calendar },
  { label: "Historia", icon: History },
  { label: "Saldo", icon: Wallet },
  { label: "Umów lekcję", icon: CalendarCheck },
]

export default async function StudentDashboard() {
  const { user, profile } = await getProfile()

  if (!user || profile?.role !== "student" || !profile.student_id) {
    redirect("/login")
  }

  const supabase = await createClient()
  const { data: student } = await supabase
    .from("students")
    .select("imie")
    .eq("id", profile.student_id)
    .single()

  return (
    <div className="space-y-8" style={{ position: "relative", zIndex: 1 }}>
      <h1>Cześć, {student?.imie ?? ""}!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, icon: Icon }, i) => (
          <GlassCard key={label} delay={i * 0.1}>
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
              <Icon className="size-5 opacity-30 shrink-0" />
            </div>
            <p className="text-sm text-white/40">Wkrótce</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
