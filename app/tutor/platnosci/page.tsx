import { createClient } from "@/lib/supabase/server"
import { PlatnosciContent } from "./platnosci-content"
import { startOfMonth, endOfMonth } from "date-fns"

export default async function PlatnosciPage() {
  const supabase = await createClient()
  const now = new Date()

  const [{ data: students }, { data: payments }, { data: monthPayments }] = await Promise.all([
    supabase.from("students").select("id, imie, nazwisko").order("nazwisko"),
    supabase.from("payments").select("id, student_id, kwota, data_wplaty, za_okres").order("data_wplaty", { ascending: false }),
    supabase
      .from("payments")
      .select("id, student_id, kwota, data_wplaty, za_okres")
      .gte("data_wplaty", startOfMonth(now).toISOString().split("T")[0])
      .lte("data_wplaty", endOfMonth(now).toISOString().split("T")[0]),
  ])

  return (
    <PlatnosciContent
      students={students ?? []}
      payments={payments ?? []}
      monthPayments={monthPayments ?? []}
    />
  )
}
