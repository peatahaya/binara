import { GlassCard } from "@/components/glass-card"
import { WaitlistForm } from "@/components/landing/waitlist-form"
import { AuroraText } from "@/components/landing/aurora-text"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <AuroraText
        className="leading-none tracking-tight mb-4 block"
        style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(80px, 12vw, 200px)" }}
      >
        binara
      </AuroraText>
      <h1 className="max-w-2xl mt-0 mb-4 text-4xl md:text-6xl" style={{ lineHeight: 1.1 }}>
        Prowadź korepetycje,<br />nie Excela.
      </h1>
      <p className="max-w-xl text-white/70 mt-4 mb-8 text-base leading-relaxed">
        Binara to system dla polskich korepetytorów. Umawiaj lekcje, śledź płatności, ucz spokojnie.
        Bez ściągania kasy SMS-ami i bez tabelki z 2019 roku.
      </p>

      <GlassCard aurora className="w-full max-w-sm rounded-2xl" delay={0.2}>
        <WaitlistForm formId="hero" buttonLabel="Dołącz do listy oczekujących" />
        <p className="text-xs text-white/50 text-center mt-3">
          Premiera Q3 2026. Pierwsi 50 korepetytorów dostaje 6 miesięcy za darmo.
        </p>
      </GlassCard>
    </section>
  )
}
