"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addLesson(formData: FormData) {
  const student_id = formData.get("student_id") as string
  const data_start_raw = formData.get("data_start") as string
  const dlugosc_min = formData.get("dlugosc_min") as string
  const temat = formData.get("temat") as string

  if (!student_id || !data_start_raw) return { error: "Uczeń i data są wymagane." }

  const supabase = await createClient()
  const { error } = await supabase.from("lessons").insert({
    student_id,
    data_start: new Date(data_start_raw).toISOString(),
    dlugosc_min: dlugosc_min ? Number(dlugosc_min) : 60,
    status: "zaplanowana",
    temat: temat || null,
  })

  if (error) return { error: "Błąd podczas zapisywania lekcji." }

  revalidatePath("/tutor/lekcje")
  return null
}

export async function saveGrade(lessonId: string, ocena: number) {
  const supabase = await createClient()
  await supabase.from("lessons").update({ ocena }).eq("id", lessonId)
  revalidatePath("/tutor/lekcje")
  return { success: true }
}
