"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getProfile } from "@/lib/auth/get-profile"
import { notifyTutorNewLesson } from "./notify"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

export async function bookLesson(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const { profile } = await getProfile()

  if (!profile?.student_id) return { error: "Brak profilu ucznia." }

  const data_start = formData.get("data_start") as string
  const dlugosc_min = Number(formData.get("dlugosc_min") ?? 60)
  const temat = formData.get("temat") as string

  if (!data_start) return { error: "Wybierz termin." }

  const startDate = new Date(data_start)
  const endDate = new Date(startDate.getTime() + dlugosc_min * 60000)

  const { data: conflict } = await supabase
    .from("lessons")
    .select("id")
    .eq("student_id", profile.student_id)
    .in("status", ["zaplanowana", "oczekuje_na_potwierdzenie"])
    .gte("data_start", startDate.toISOString())
    .lt("data_start", endDate.toISOString())
    .single()

  if (conflict) return { error: "Ten termin jest już zajęty." }

  const { error } = await supabase.from("lessons").insert({
    student_id: profile.student_id,
    data_start: startDate.toISOString(),
    dlugosc_min,
    status: "oczekuje_na_potwierdzenie",
    temat: temat || null,
  })

  if (error) return { error: "Błąd podczas rezerwacji: " + error.message }

  const { data: student } = await supabase
    .from("students")
    .select("imie, nazwisko")
    .eq("id", profile.student_id)
    .single()

  const studentName = student ? `${student.imie} ${student.nazwisko}` : "Uczeń"
  const dateFormatted = format(startDate, "d MMM yyyy, HH:mm", { locale: pl })

  await notifyTutorNewLesson({
    studentName,
    date: dateFormatted,
    dlugosc_min,
    temat: temat || null,
  })

  revalidatePath("/student")
  revalidatePath("/student/lekcje")
  return { success: true }
}
