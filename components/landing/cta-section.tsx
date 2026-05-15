import { GlassCard } from "@/components/glass-card"
import { WaitlistForm } from "@/components/landing/waitlist-form"

export function CtaSection() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
      <h2 className="mb-3">Bądź wśród pierwszych.</h2>
      <p className="text-white/70 mb-10 max-w-md">
        Premiera Q3 2026. Pierwsi 50 korepetytorów — 6 miesięcy za darmo. Bez karty, bez zobowiązań.
      </p>
      <GlassCard aurora className="w-full max-w-sm rounded-2xl">
        <WaitlistForm formId="footer" buttonLabel="Zapisz się" />
      </GlassCard>
    </section>
  )
}
