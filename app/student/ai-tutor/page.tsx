import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth/get-profile"
import { Sparkles } from "lucide-react"
import { AiTutorForm } from "./ai-tutor-form"

export default async function AiTutorPage() {
  const { user, profile } = await getProfile()
  if (!user || profile?.role !== "student") redirect("/login")

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="size-5 opacity-50" />
          <h1>AI Tutor</h1>
        </div>
        <p className="text-sm text-white/40">
          Zrób zdjęcie zadania — AI rozwiąże je krok po kroku.
        </p>
      </div>
      <AiTutorForm />
    </div>
  )
}
