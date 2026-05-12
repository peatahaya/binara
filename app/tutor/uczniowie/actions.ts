"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addStudent(formData: FormData) {
  const imie = formData.get("imie") as string
  const nazwisko = formData.get("nazwisko") as string
  const klasa = formData.get("klasa") as string
  const stawka = formData.get("stawka_godzinowa") as string
  const rodzic_email = formData.get("rodzic_email") as string
  const rodzic_telefon = formData.get("rodzic_telefon") as string
  const notatka = formData.get("notatka") as string

  if (!imie || !nazwisko) return { error: "Imię i nazwisko są wymagane." }

  const supabase = await createClient()
  const { error } = await supabase.from("students").insert({
    imie,
    nazwisko,
    klasa: klasa || null,
    stawka_godzinowa: stawka ? Number(stawka) : null,
    rodzic_email: rodzic_email || null,
    rodzic_telefon: rodzic_telefon || null,
    notatka: notatka || null,
  })

  if (error) return { error: "Błąd podczas zapisywania ucznia." }

  revalidatePath("/tutor/uczniowie")
  return null
}
