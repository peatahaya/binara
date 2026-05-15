"use client"

import { useActionState } from "react"
import { joinWaitlist } from "@/app/actions/waitlist"

interface WaitlistFormProps {
  formId: string
  buttonLabel?: string
}

export function WaitlistForm({ formId, buttonLabel = "Dołącz do listy oczekujących" }: WaitlistFormProps) {
  const [message, action, pending] = useActionState(joinWaitlist, null)

  const inputId = `${formId}-email`
  const success = message === "Jesteś na liście. Damy znać przed premierą."

  if (success) {
    return (
      <p className="text-sm text-white/80 text-center py-2">{message}</p>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor={inputId} className="sr-only">
        Adres email
      </label>
      <input
        id={inputId}
        name="email"
        type="email"
        required
        placeholder="twoj@email.pl"
        className="rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
      />
      {message && !success && (
        <p className="text-xs text-white/60">{message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-white text-black text-sm font-medium px-4 py-2.5 hover:bg-white/90 disabled:opacity-50 transition-colors"
      >
        {pending ? "Zapisuję..." : buttonLabel}
      </button>
    </form>
  )
}
