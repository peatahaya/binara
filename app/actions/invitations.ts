"use server"

import { createClient } from "@/lib/supabase/server"
import { randomBytes } from "crypto"

export async function createInvitation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Nie jesteś zalogowany." }

  const imie = formData.get("imie") as string
  const nazwisko = formData.get("nazwisko") as string
  const klasa = formData.get("klasa") as string
  const stawka = Number(formData.get("stawka_godzinowa"))

  if (!imie || !nazwisko || !stawka) return { error: "Wypełnij wymagane pola." }

  const token = randomBytes(16).toString("hex")

  const { error } = await supabase.from("invitations").insert({
    token,
    tutor_id: user.id,
    imie,
    nazwisko,
    klasa,
    stawka_godzinowa: stawka,
  })

  if (error) return { error: "Błąd podczas tworzenia zaproszenia." }

  return { token }
}
