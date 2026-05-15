"use server"

import { createClient } from "@/lib/supabase/server"

export async function joinWaitlist(_prev: string | null, formData: FormData): Promise<string> {
  const email = (formData.get("email") as string | null)?.trim() ?? ""

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Podaj poprawny adres email."
  }

  const supabase = await createClient()
  const { error } = await supabase.from("waitlist").insert({ email })

  if (!error) return "Jesteś na liście. Damy znać przed premierą."
  if (error.code === "23505") return "Już jesteś na liście, dzięki!"
  return "Coś poszło nie tak, spróbuj za chwilę."
}
