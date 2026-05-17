import { createClient } from "@/lib/supabase/server"
import { LekcjeContent } from "./lekcje-content"

export default async function LekcjePage() {
  const supabase = await createClient()

  const [{ data: lessons }, { data: students }] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, data_start, dlugosc_min, status, temat, ocena, students(imie, nazwisko)")
      .order("data_start", { ascending: true }),
    supabase
      .from("students")
      .select("id, imie, nazwisko")
      .order("nazwisko", { ascending: true }),
  ])

  return <LekcjeContent lessons={lessons ?? []} students={students ?? []} />
}
