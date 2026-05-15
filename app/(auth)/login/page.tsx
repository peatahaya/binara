"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { GraduationCap } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const urlError = searchParams.get("error")
  const confirmed = searchParams.get("confirmed")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setLoading(false)
      if (error.message.includes("Email not confirmed")) {
        setError("Email nie został zweryfikowany. Sprawdź skrzynkę i kliknij link aktywacyjny.")
      } else {
        setError("Nieprawidłowy email lub hasło.")
      }
      return
    }

    const userId = signInData.user?.id
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    setLoading(false)

    if (!profile) {
      await supabase.auth.signOut()
      setError("Twoje konto nie ma przypisanej roli, skontaktuj się z korepetytorem.")
      return
    }

    if (profile.role === "student") {
      router.push("/student")
    } else {
      router.push("/tutor")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <GlassCard className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="size-6 text-primary" />
          <span style={{ fontFamily: "var(--font-fraunces)", fontWeight: 400 }}>binara</span>
        </div>

        {urlError === "verification_failed" && (
          <div className="mb-4 rounded-md bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 text-sm text-yellow-400">
            Link weryfikacyjny wygasł. Zarejestruj się ponownie.
          </div>
        )}
        {confirmed === "true" && (
          <div className="mb-4 rounded-md bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-400">
            Email zweryfikowany! Możesz się zalogować.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="twoj@email.pl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Nie masz konta?{" "}
          <a href="/register" className="text-primary underline underline-offset-4">
            Zarejestruj się
          </a>
        </p>
      </GlassCard>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
