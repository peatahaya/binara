"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { GraduationCap } from "lucide-react"

export default function RegisterPage() {
  const [imie, setImie] = useState("")
  const [nazwisko, setNazwisko] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.")
      return
    }
    if (password !== password2) {
      setError("Hasła nie są identyczne.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { imie, nazwisko },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already been registered")) {
        setError("Ten email jest już zarejestrowany.")
      } else {
        setError("Wystąpił błąd. Spróbuj ponownie.")
      }
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <GlassCard className="w-full max-w-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <GraduationCap className="size-6 text-primary" />
            <span style={{ fontFamily: "var(--font-fraunces)", fontWeight: 400 }}>binara</span>
          </div>
          <p className="text-lg font-medium mb-2">Sprawdź skrzynkę!</p>
          <p className="text-muted-foreground text-sm mb-2">
            Wysłaliśmy link aktywacyjny na <strong>{email}</strong>.
            Kliknij go, aby aktywować konto.
          </p>
          <p className="text-muted-foreground text-xs">
            Nie widzisz emaila? Sprawdź folder Spam (dotyczy op.pl, onet.pl i innych filtrujących skrzynek).
          </p>
        </GlassCard>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <GlassCard className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="size-6 text-primary" />
          <span className="text-xl font-semibold">
            mathrix
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Imię"
              value={imie}
              onChange={(e) => setImie(e.target.value)}
              required
            />
            <Input
              placeholder="Nazwisko"
              value={nazwisko}
              onChange={(e) => setNazwisko(e.target.value)}
              required
            />
          </div>
          <Input
            type="email"
            placeholder="twoj@email.pl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Hasło (min. 6 znaków)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Powtórz hasło"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Rejestrowanie..." : "Zarejestruj się"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Masz już konto?{" "}
          <a href="/login" className="text-primary underline underline-offset-4">
            Zaloguj się
          </a>
        </p>
      </GlassCard>
    </main>
  )
}
