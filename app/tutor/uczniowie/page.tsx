import { createClient } from "@/lib/supabase/server"
import { UczniowieContent } from "./uczniowie-content"

export default async function UczniowiePage() {
  const supabase = await createClient()
  const { data: students, error } = await supabase
    .from("students")
    .select("id, imie, nazwisko, klasa, stawka_godzinowa, rodzic_email, rodzic_telefon")
    .order("nazwisko", { ascending: true })

  // DEBUG - logi w terminalu VS Code
  console.log("=== DEBUG /tutor/uczniowie ===")
  console.log("Students data:", students)
  console.log("Students count:", students?.length)
  console.log("Error:", error)
  console.log("===============================")

  return <UczniowieContent students={students ?? []} />
}