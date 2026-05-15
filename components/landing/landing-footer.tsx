import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Lewa kolumna */}
        <div className="flex flex-col gap-2">
          <span className="text-xl font-light tracking-tight">
            binar<span className="text-violet-400">a</span>
          </span>
          <p className="text-sm text-white/50">SaaS dla korepetytorów</p>
          <p className="text-sm text-white/40">Made in Toruń 🇵🇱</p>
        </div>

        {/* Prawa kolumna — dwie sub-kolumny */}
        <div className="md:col-span-2 grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Produkt</p>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Funkcje</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cennik</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Kontakt</p>
            <ul className="flex flex-col gap-2 text-sm text-white/60">
              <li>
                <a href="mailto:kontakt@binara.app" className="hover:text-white transition-colors">
                  kontakt@binara.app
                </a>
              </li>
              <li>
                <Link href="https://github.com/peatahaya" className="hover:text-white transition-colors">
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
        <span>© 2026 Piotrek. Wszystkie prawa zastrzeżone.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white/70 transition-colors">Polityka prywatności</a>
          <a href="#" className="hover:text-white/70 transition-colors">Regulamin</a>
        </div>
      </div>
    </footer>
  )
}
