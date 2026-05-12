"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addPayment(formData: FormData) {
  const student_id = formData.get("student_id") as string
  const kwota = formData.get("kwota") as string
  const data_wplaty = formData.get("data_wplaty") as string
  const za_okres = formData.get("za_okres") as string
  const notatka = formData.get("notatka") as string

  if (!student_id || !kwota) return { error: "Uczeń i kwota są wymagane." }

  const supabase = await createClient()
  const { error } = await supabase.from("payments").insert({
    student_id,
    kwota: Number(kwota),
    data_wplaty: data_wplaty || new Date().toISOString().split("T")[0],
    za_okres: za_okres || null,
    notatka: notatka || null,
  })

  if (error) return { error: "Błąd podczas zapisywania wpłaty." }

  revalidatePath("/tutor/platnosci")
  return null
}
