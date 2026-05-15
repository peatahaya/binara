"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function confirmLesson(lessonId: string) {
  const supabase = await createClient()
  await supabase.from("lessons")
    .update({ status: "zaplanowana" })
    .eq("id", lessonId)
  revalidatePath("/tutor")
  return { success: true }
}

export async function rejectLesson(lessonId: string) {
  const supabase = await createClient()
  await supabase.from("lessons")
    .update({ status: "odwolana" })
    .eq("id", lessonId)
  revalidatePath("/tutor")
  return { success: true }
}
