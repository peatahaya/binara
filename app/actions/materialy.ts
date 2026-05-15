"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadMaterial(studentId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Brak autoryzacji." }

  const file = formData.get("plik") as File
  const nazwa = formData.get("nazwa") as string
  const opis = formData.get("opis") as string

  if (!file || file.size === 0) return { error: "Wybierz plik." }
  if (!nazwa) return { error: "Podaj nazwę materiału." }
  if (file.size > 20 * 1024 * 1024) return { error: "Plik za duży (max 20MB)." }

  const ext = file.name.split(".").pop()
  const path = `${user.id}/${studentId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("materialy")
    .upload(path, file)

  if (uploadError) return { error: "Błąd uploadu: " + uploadError.message }

  const { error: dbError } = await supabase.from("materialy").insert({
    student_id: studentId,
    nazwa,
    opis: opis || null,
    plik_url: path,
    plik_nazwa: file.name,
    rozmiar_kb: Math.round(file.size / 1024),
  })

  if (dbError) return { error: "Błąd zapisu: " + dbError.message }

  revalidatePath(`/tutor/uczniowie/${studentId}/materialy`)
  return { success: true }
}

export async function deleteMaterial(materialId: string, studentId: string, plikUrl: string) {
  const supabase = await createClient()

  await supabase.storage.from("materialy").remove([plikUrl])
  await supabase.from("materialy").delete().eq("id", materialId)

  revalidatePath(`/tutor/uczniowie/${studentId}/materialy`)
  return { success: true }
}

export async function getSignedUrl(plikUrl: string) {
  const supabase = await createClient()
  const { data } = await supabase.storage
    .from("materialy")
    .createSignedUrl(plikUrl, 3600)
  return data?.signedUrl ?? null
}
