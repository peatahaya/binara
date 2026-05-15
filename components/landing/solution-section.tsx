import Image from "next/image"
import { Users, Wallet, CalendarCheck, Sparkles } from "lucide-react"
import { GlassCard } from "@/components/glass-card"

const features = [
  {
    icon: Users,
    title: "Uczniowie i lekcje w jednym miejscu.",
    body: "Karty uczniów, kalendarz, status każdej lekcji (zaplanowana / odbyta / odwołana). Bez przełączania między aplikacjami.",
  },
  {
    icon: Wallet,
    title: "Płatności same się liczą.",
    body: "Saldo per uczeń, zaległe wpłaty, historia. Widzisz od razu kto i ile.",
  },
  {
    icon: CalendarCheck,
    title: "Uczeń umawia się sam.",
    body: "Wystawiasz swoje sloty, uczeń wybiera termin, Ty zatwierdzasz. Koniec z SMS-owym ping-pongiem.",
  },
  {
    icon: Sparkles,
    title: "AI Tutor 24/7",
    badge: "Wkrótce",
    body: "Uczeń fotografuje zadanie, dostaje rozwiązanie krok po kroku. Mniej pytań w nocy do Ciebie.",
  },
]

export function SolutionSection() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <h2 className="mb-12 text-center">Jedna apka. Cały Twój biznes.</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {features.map(({ icon: Icon, title, badge, body }, i) => (
          <GlassCard key={title} delay={i * 0.1}>
            <Icon className="size-8 opacity-50 mb-4" />
            <p className="text-lg font-medium mb-2">
              {title}
              {badge && (
                <span className="ml-2 text-xs font-normal text-white/40 border border-white/20 rounded-full px-2 py-0.5">
                  {badge}
                </span>
              )}
            </p>
            <p className="text-sm text-white/60">{body}</p>
          </GlassCard>
        ))}
      </div>

      <div className="max-w-5xl mx-auto rounded-2xl border border-white/10 overflow-hidden p-2">
        <Image
          src="/landing-dashboard-v2.png"
          alt="Dashboard tutora w Binarze"
          width={1280}
          height={720}
          loading="eager"
          className="rounded-xl w-full"
        />
        <p className="text-xs text-white/40 text-center mt-3 mb-1">
          Dashboard tutora — Twój zarobek, godziny i zaległe wpłaty w czasie rzeczywistym.
        </p>
      </div>
    </section>
  )
}
