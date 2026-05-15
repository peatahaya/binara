"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserPlus, Copy } from "lucide-react"
import { createInvitation } from "@/app/actions/invitations"

export function InviteDialog() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<"form" | "success">("form")
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleOpen(val: boolean) {
    setOpen(val)
    if (!val) {
      setState("form")
      setToken(null)
      setError(null)
    }
  }

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createInvitation(formData)
      if ("error" in result && result.error) {
        setError(result.error)
      } else if ("token" in result && result.token) {
        setToken(result.token)
        setState("success")
      }
    })
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <UserPlus className="size-4" /> Zaproś ucznia
      </Button>
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Zaproś ucznia</DialogTitle>
          </DialogHeader>

          {state === "form" ? (
            <form action={handleSubmit} className="grid grid-cols-2 gap-3 py-2">
              <Input name="imie" placeholder="Imię" required />
              <Input name="nazwisko" placeholder="Nazwisko" required />
              <Input name="klasa" placeholder="Klasa (np. 3LO)" className="col-span-2" />
              <Input
                name="stawka_godzinowa"
                type="number"
                placeholder="Stawka zł/h"
                defaultValue={80}
                required
                className="col-span-2"
              />
              {error && <p className="col-span-2 text-destructive text-sm">{error}</p>}
              <div className="col-span-2 flex justify-end">
                <Button type="submit" disabled={pending}>
                  {pending ? "Generowanie…" : "Generuj link"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="py-2 space-y-3">
              {(() => {
                const inviteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/join/${token}`
                return (
                  <>
                    <p className="text-sm">Link dla ucznia:</p>
                    <code className="block break-all rounded bg-white/5 px-3 py-2 text-xs">
                      {inviteUrl}
                    </code>
                    <Button
                      className="w-full transition-colors hover:bg-white/90"
                      onClick={() => {
                        navigator.clipboard.writeText(inviteUrl)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                    >
                      <Copy className="size-4" /> {copied ? "Link skopiowany ✓" : "Kopiuj link"}
                    </Button>
                    <p className="text-xs text-white/40">
                      Link wygasa za 7 dni. Jednorazowy.
                    </p>
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
