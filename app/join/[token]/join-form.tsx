"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { joinAsStudent } from "@/app/actions/join"
import Link from "next/link"

type Props = {
  token: string
}

export function JoinForm({ token }: Props) {
  const [state, formAction, pending] = useActionState(
    joinAsStudent.bind(null, token),
    null
  )

  if (state?.success === true) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-white/70">
          Konto utworzone! Możesz się teraz zalogować.
        </p>
        <Link
          href="/login"
          className="block text-sm text-primary underline underline-offset-4"
        >
          Przejdź do logowania →
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <Input type="email" name="email" placeholder="twoj@email.pl" required autoFocus />
      <Input type="password" name="password" placeholder="min. 6 znaków" required />
      {state && "error" in state && state.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Tworzenie konta…" : "Utwórz konto"}
      </Button>
    </form>
  )
}
