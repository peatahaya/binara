const steps = [
  {
    n: "01",
    title: "Dodajesz uczniów.",
    body: "Imię, klasa, stawka, kontakt do rodzica. 30 sekund na ucznia.",
  },
  {
    n: "02",
    title: "Umawiasz lekcje.",
    body: "Ty albo uczeń — z Twojej listy slotów. Statusy aktualizują się automatycznie.",
  },
  {
    n: "03",
    title: "Widzisz wszystko na jednym ekranie.",
    body: "Lekcje w tygodniu, zarobek w miesiącu, zaległe wpłaty. Bez liczenia ręcznie.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <h2 className="mb-16 text-center">Trzy kroki do spokoju.</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map(({ n, title, body }) => (
          <div key={n} className="flex flex-col">
            <span className="text-6xl font-light text-white/20 mb-4 leading-none">{n}</span>
            <p className="text-lg font-medium mb-2">{title}</p>
            <p className="text-sm text-white/60">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
