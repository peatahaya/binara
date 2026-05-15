# AGENTS.md — Binara

Reguły pracy dla Claude Code i innych agentów AI w tym repo. Czytaj przed każdą sesją.

---

## Projekt

**Binara** — SaaS dla polskich korepetytorów (wcześniej Mathrix, jeszcze wcześniej Matify). Tutor zarządza uczniami, lekcjami, płatnościami. Uczeń bookuje lekcje, widzi historię, saldo, materiały. Planowany AI Tutor (Gemini Vision) rozwiązuje sfotografowane zadania krok po kroku.

Cel: realny SaaS na rynek PL + flagowy projekt portfolio juniora.

UI w całości po polsku. Nazwy plików, folderów i kolumn w bazie też po polsku tam, gdzie dotyczy domeny (`uczniowie/`, `lekcje/`, `platnosci/`, `imie`, `stawka_godzinowa`).

---

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui Nova preset** — oparte o **Base UI**, NIE Radix
- **Framer Motion**
- **Supabase** (Postgres + Auth + Storage + RLS)
- **Server Actions** jako backend (zero osobnego API)
- Lucide ikony, Roboto (latin-ext), date-fns z locale `pl`

Planowane: Gemini Flash (vision), Resend (email), Tpay/Stripe (płatności).

---

## Konwencje kodu (twarde reguły, nie negocjowalne)

1. **Server Components default.** `"use client"` tylko gdy konieczne (interakcja, useState, useEffect, event handlery). Dashboardy, listy, statystyki — zawsze server.
2. **Zarządzanie stanem: tylko `useState`.** BEZ `zustand`, BEZ `redux`, BEZ `jotai`.
3. **Formularze: natywne `<form>` + Server Actions.** BEZ `react-hook-form`, BEZ `zod`, BEZ `formik`. Walidacja w server action prostymi if-ami; błędy zwracaj jako return value i pokazuj przez `useFormState`/`useActionState`.
4. **Maks 150 linii na plik.** Jak puchnie — rozbij na komponenty lub helpery do `lib/`.
5. **Nazewnictwo polskie w domenie**: kolumny DB, nazwy tras, etykiety UI. Angielskie tylko w czystej technice (`getProfile`, `createClient`, typy).
6. **Daty: `date-fns` z `locale: pl`.** Format wyświetlania: `"d MMM, HH:mm"`. NIE używaj `toLocaleString` ani `Intl` ad-hoc.
7. **Wzorzec strony serwerowej**: pobierz dane przez `createClient()` z `@/lib/supabase/server`, użyj `Promise.all` przy wielu zapytaniach, mapuj do widoku w tym samym pliku jeśli logika prosta.
8. **Karty i layout**: używaj `<GlassCard>` z `@/components/glass-card`. Statystyki → grid 1/2/4 kolumn, `delay={i * 0.1}` na stagger animacji.
9. **Status badge**: trzymaj się mapy `statusLabels` + `statusVariants` jak w `app/tutor/page.tsx`. Nowy status (np. `oczekuje_na_potwierdzenie`) dodaj do obu map.
10. **Zawsze sprawdzaj rolę przed renderem** w `/tutor/*` i `/student/*`: `getProfile()` + `redirect("/login")` jeśli rola nie ta lub `student_id` puste.

---

## Schema bazy (Supabase)

```
students         (id, user_id, imie, nazwisko, klasa, stawka_godzinowa, rodzic_email, rodzic_telefon, notatka)
lessons          (id, student_id, data_start timestamptz, dlugosc_min, status, temat, notatki)
payments         (id, student_id, kwota, data_wplaty date, za_okres text, notatka)
availability_slots (dzien_tygodnia, godzina_start, godzina_koniec)
profiles         (id [FK auth.users], role: tutor/student, student_id [FK students], created_at)
```

`status` w `lessons`: `zaplanowana` / `odbyta` / `odwolana`. Decyzja o dodaniu `oczekuje_na_potwierdzenie` zatwierdzona — wprowadzaj gdy ekran umawiania będzie robiony.

**RLS włączone wszędzie.** Polityki: w większości tabel `for all to authenticated using(true) with check(true)`. W `profiles` osobno: select/insert na `auth.uid() = id`.

---

## Struktura repo

```
binara/
├── app/
│   ├── (auth)/            # login, register, auth/callback
│   ├── tutor/             # panel tutora
│   │   ├── page.tsx       # dashboard (4 stat + najbliższe lekcje)
│   │   ├── uczniowie/
│   │   ├── lekcje/
│   │   └── platnosci/
│   └── student/           # panel ucznia
│       ├── layout.tsx     # role check
│       ├── page.tsx       # dashboard ucznia
│       ├── lekcje/        # (do zrobienia)
│       ├── platnosci/     # (do zrobienia)
│       └── umow/          # (do zrobienia)
├── components/
│   ├── ui/                # shadcn/ui (Base UI)
│   ├── glass-card.tsx
│   ├── site-nav.tsx       # nav tutora
│   └── site-nav-student.tsx
├── lib/
│   ├── auth/get-profile.ts
│   └── supabase/{client,server}.ts
└── middleware.ts          # ochrona /tutor/* i /student/*
```

---

## Workflow promptingu (dla agenta i dla Piotrka)

Piotrek pracuje **inkrementalnie**. Zasady:

- **Pytaj, zanim rozbudujesz architekturę.** Jeśli zadanie wymaga nowej tabeli, nowej roli, nowej zależności — zatrzymaj się i zapytaj.
- **Zacznij od listy plików do utworzenia/edycji, czekaj na OK, potem koduj po kolei.**
- **Zatrzymuj się po każdym dużym kroku** ("zrobiłem X, sprawdź zanim ruszę dalej").
- **NIE dodawaj zależności bez pytania.** Każdy nowy npm package = pytanie.
- **NIE refaktoryzuj rzeczy nieobjętych zadaniem.** Jeśli widzisz brzydki kod obok — zostaw, ewentualnie zgłoś na końcu.
- Po refactorze zawsze: `grep` weryfikacyjny + sugeruj `rm -rf .next` + restart dev servera.

---

## Pułapki (znane, NIE powtarzaj błędów)

1. **RLS auto-on w Supabase** — disable z DDL nie działa, trzeba dodać policies.
2. **`current_date` vs `now()`** — `current_date - interval '6 hours'` daje wczorajszy dzień UTC. Do timestamp używaj `now() - interval '6 hours'`.
3. **`payments.za_okres` to etykieta, nie data.** Filtrowanie zawsze po `data_wplaty`.
4. **`<DialogTrigger asChild><Button>` z Base UI sypie.** Fix: `<DialogTrigger className={buttonVariants({...})}>`.
5. **Magic link nie działa z op.pl/onet** — skanery konsumują OTP. Zostajemy przy `signInWithPassword`.
6. **Cache Server Components** — po zmianie SQL: `Ctrl+Shift+R` + restart `npm run dev`.
7. **`student.user_id = NULL` w seedach** — jeśli filtrujesz po `user_id`, trzeba update.
8. **`asChild` w Base UI przecieka do DOM jako atrybut.** ZAWSZE: `<Link href className={cn(buttonVariants({variant, size}), ...)}>` zamiast `<Button asChild><Link>`. shadcn Nova = Base UI, NIE Radix.
9. **Stale chunks Turbopack** — po refactorze: `rm -rf .next` + restart + `Ctrl+Shift+R`.
10. **Grammarly hydration mismatch** — atrybuty `data-new-gr-c-s-check-loaded` to rozszerzenie, nie bug. Wyłącz Grammarly na localhost.
11. **Email confirmation Supabase free** — 2 maile/h. Dla testów: Auth → Add user → Auto Confirm + ręczny insert do `profiles`.
12. **`/register` nie powinien być publicznie dostępny dla uczniów** — uczeń bez `student_id` w `profiles` zobaczy "konto nie połączone z kartoteką". Flow docelowy: tutor wysyła zaproszenie.

---

## Stylistyka UI

- Bazowo czarne tło, biała typografia (jak X.com).
- Sygnatura wizualna: **aurora rainbow border** na `GlassCard` (conic-gradient, hover-only, animacja 8s).
- Logo: wordmark `binara` ZAWSZE małymi literami, akcent neonowy na ostatniej literze (late 70s computing vibe).
- Hierarchia: `<h1>` bez Tailwind size class (global styles), `<h2>` z `mb-4 flex items-center gap-2` + ikona z `opacity-50`.
- Statystyki: `text-5xl font-light` na liczbie, `text-xs uppercase tracking-widest text-white/50` na labelu.
- Pusty stan: `<GlassCard><p className="text-muted-foreground text-sm">Brak ...</p></GlassCard>`.

---

## Roadmap (gdzie jesteśmy)

- [x] **Faza 1** — Podział ról tutor/student, middleware, redirects, profiles
- [ ] **Faza 2** — Panel ucznia z danymi (dashboard, lekcje, płatności, umawianie) ← **TUTAJ**
- [ ] **Faza 3** — Email notyfikacje (Resend) dla rodziców
- [ ] **Faza 4** — AI Tutor (Gemini Vision + KaTeX)
- [ ] **Faza 5** — Materiały (PDF, Supabase Storage)
- [ ] **Faza 6** — Płatności online (Tpay/Stripe + BLIK)
- [ ] **Faza 7** — Raporty PDF
- [ ] **Faza 8** — Realtime chat (Supabase Realtime)

---

## Czego NIE robić

- Nie dodawaj `zustand`, `react-hook-form`, `zod`, `redux`, `tanstack-query`. Server Actions + `useState` wystarczą.
- Nie pisz testów jednostkowych bez prośby.
- Nie twórz `/api/*` route handlerów — Server Actions.
- Nie używaj `useEffect` do fetchowania danych — to robi server component.
- Nie zmieniaj struktury folderów ani plików konfiguracyjnych (`next.config.ts`, `tsconfig.json`, `postcss.config.mjs`) bez zgody.
- Nie commituj — Piotrek robi to ręcznie po review.