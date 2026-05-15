import { Calculator, AlertCircle, Shuffle } from "lucide-react"
import { GlassCard } from "@/components/glass-card"

const problems = [
  {
    icon: Calculator,
    title: "Tracisz godziny tygodniowo na rozliczenia.",
    body: 'Excel, kalkulator, "ile było lekcji w marcu", SMS do mamy Kacpra. Co miesiąc to samo.',
  },
  {
    icon: AlertCircle,
    title: "Rodzice zapominają zapłacić.",
    body: 'Musisz pisać "przypomnienie", czujesz się jak windykator, a chciałeś tylko uczyć.',
  },
  {
    icon: Shuffle,
    title: "Każdy uczeń to inny chaos.",
    body: "Notatki w zeszycie, plan w głowie, materiały w Drive, harmonogram w kalendarzu telefonu. Nic nie jest w jednym miejscu.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <h2 className="mb-12 text-center">Znasz to?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {problems.map(({ icon: Icon, title, body }, i) => (
          <GlassCard key={title} delay={i * 0.1}>
            <Icon className="size-8 opacity-50 mb-4" />
            <p className="text-lg font-medium mb-2">{title}</p>
            <p className="text-sm text-white/60">{body}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
