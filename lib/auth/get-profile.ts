import { createClient } from "@/lib/supabase/server"

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, profile: null }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, student_id")
    .eq("id", user.id)
    .single()

  return { user, profile }
}
