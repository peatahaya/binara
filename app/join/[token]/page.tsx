import { createClient } from "@/lib/supabase/server"
import { GlassCard } from "@/components/glass-card"
import { GraduationCap } from "lucide-react"
import { JoinForm } from "./join-form"

type Props = {
  params: Promise<{ token: string }>
}

export default async function JoinPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  const { data: invitation } = await supabase
    .from("invitations")
    .select("imie, expires_at")
    .eq("token", token)
    .single()

  const expired = invitation && new Date(invitation.expires_at) < new Date()

  if (!invitation || expired) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="w-full max-w-sm text-center">
          <p className="font-semibold mb-2">Link nieważny lub już użyty.</p>
          <p className="text-sm text-white/50">Poproś korepetytora o nowe zaproszenie.</p>
        </GlassCard>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <GlassCard className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="size-6 text-primary" />
          <span style={{ fontFamily: "var(--font-fraunces)", fontWeight: 400 }}>binara</span>
        </div>

        <h2 className="text-xl font-semibold mb-1">Cześć, {invitation.imie}!</h2>
        <p className="text-sm text-white/50 mb-6">
          Twój korepetytor zaprosił Cię do Binarny. Utwórz konto żeby zacząć.
        </p>

        <JoinForm token={token} />
      </GlassCard>
    </main>
  )
}
