import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth/get-profile"
import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass-card"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { UmowForm } from "./umow-form"

const DNI = ["", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"]

export default async function UmowLekcje() {
  const { user, profile } = await getProfile()

  if (!user || profile?.role !== "student" || !profile.student_id) {
    redirect("/login")
  }

  const supabase = await createClient()

  const [{ data: slots }, { data: bookedLessons }] = await Promise.all([
    supabase
      .from("availability_slots")
      .select("id, dzien_tygodnia, godzina_start, godzina_koniec")
      .eq("active", true)
      .order("dzien_tygodnia")
      .order("godzina_start"),
    supabase
      .from("lessons")
      .select("data_start, dlugosc_min")
      .eq("student_id", profile.student_id)
      .in("status", ["zaplanowana", "oczekuje_na_potwierdzenie"])
      .gte("data_start", new Date().toISOString()),
  ])

  const today = new Date()

  const availableDates = (slots ?? []).flatMap((slot) => {
    const dates = []
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const targetDay = slot.dzien_tygodnia === 7 ? 0 : slot.dzien_tygodnia
      if (d.getDay() === targetDay) {
        const [h, m] = (slot.godzina_start as string).split(":").map(Number)
        d.setHours(h, m, 0, 0)
        const isBooked = (bookedLessons ?? []).some(lesson => {
          const lessonStart = new Date(lesson.data_start).getTime()
          const lessonEnd = lessonStart + lesson.dlugosc_min * 60000
          const slotStart = d.getTime()
          const slotEnd = slotStart + 60 * 60000
          return slotStart < lessonEnd && slotEnd > lessonStart
        })
        if (!isBooked) dates.push({
          slot_id: slot.id as string,
          date: d,
          label: `${DNI[slot.dzien_tygodnia]}, ${format(d, "d MMM", { locale: pl })} · ${(slot.godzina_start as string).slice(0, 5)}–${(slot.godzina_koniec as string).slice(0, 5)}`,
          value: d.toISOString(),
        })
      }
    }
    return dates
  }).sort((a, b) => a.date.getTime() - b.date.getTime())

  const slotOptions = availableDates.map(({ slot_id, label, value }) => ({ slot_id, label, value }))

  return (
    <div className="space-y-6">
      <h1>Umów lekcję</h1>

      {slotOptions.length === 0 ? (
        <GlassCard>
          <p className="text-white/40 text-sm">
            Brak dostępnych terminów. Skontaktuj się z korepetytorem.
          </p>
        </GlassCard>
      ) : (
        <UmowForm slots={slotOptions} />
      )}
    </div>
  )
}
