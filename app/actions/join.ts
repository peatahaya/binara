"use server"

import { createClient } from "@/lib/supabase/server"

export async function joinAsStudent(token: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) return { error: "Wypełnij wszystkie pola." }
  if (password.length < 6) return { error: "Hasło musi mieć co najmniej 6 znaków." }

  // 1. Pobierz zaproszenie po tokenie
  const { data: invitation, error: invErr } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .eq("used", false)
    .single()

  if (invErr || !invitation) {
    console.error("[join] invitations fetch failed:", invErr)
    return { error: "Link jest nieważny lub już został użyty." }
  }

  // Sprawdź czy nie wygasł
  if (new Date(invitation.expires_at) < new Date()) {
    console.error("[join] invitation expired:", invitation.expires_at)
    return { error: "Link wygasł. Poproś korepetytora o nowy." }
  }

  // 2. Utwórz konto w Supabase Auth
  const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password })
  if (authErr || !authData.user) {
    console.error("[join] signUp failed:", authErr)
    if (authErr?.message?.includes("already registered")) {
      return { error: "Ten email jest już zarejestrowany." }
    }
    return { error: "Błąd rejestracji: " + authErr?.message }
  }

  const userId = authData.user.id

  // 3. Wstaw ucznia do tabeli students
  const { data: student, error: studentErr } = await supabase
    .from("students")
    .insert({
      imie: invitation.imie,
      nazwisko: invitation.nazwisko,
      klasa: invitation.klasa,
      stawka_godzinowa: invitation.stawka_godzinowa,
      user_id: invitation.tutor_id,
    })
    .select("id")
    .single()

  if (studentErr || !student) {
    console.error("[join] students insert failed:", studentErr)
    return { error: "Błąd tworzenia profilu ucznia." }
  }

  // 4. Wstaw profil
  const { error: profileErr } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      role: "student",
      student_id: student.id,
    })

  if (profileErr) {
    console.error("[join] profiles insert failed:", profileErr)
    return { error: "Błąd tworzenia profilu." }
  }

  // 5. Oznacz zaproszenie jako użyte
  await supabase
    .from("invitations")
    .update({ used: true })
    .eq("token", token)

  return { success: true as const }
}
