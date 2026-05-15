"use client"

import { useTransition } from "react"
import { confirmLesson, rejectLesson } from "@/app/actions/lessons"
import { Check, X } from "lucide-react"

export function PendingActions({ lessonId }: { lessonId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex gap-2">
      <button
        onClick={() => startTransition(() => confirmLesson(lessonId))}
        disabled={pending}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm disabled:opacity-50"
      >
        <Check className="size-4" /> Potwierdź
      </button>
      <button
        onClick={() => startTransition(() => rejectLesson(lessonId))}
        disabled={pending}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50"
      >
        <X className="size-4" /> Odrzuć
      </button>
    </div>
  )
}
