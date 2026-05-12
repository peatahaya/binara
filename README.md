# Binara

> Fullstack math tutoring management app. Tutors manage students, lessons, and payments; students book sessions and track progress; an AI Tutor solves photographed math problems step by step.

![Status](https://img.shields.io/badge/status-in_development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## ✨ Features

### Tutor Panel
- **Dashboard** with 4 key stats (monthly lessons, revenue, attendance rate, overdue payments)
- **Student CRUD** — contact info, grade level, hourly rate, notes
- **Lesson management** — calendar + list view, status tracking (scheduled / completed / cancelled)
- **Payments** — per-student tracking, statistics, overdue detection

### Student Panel
- Upcoming lessons, history, account balance
- Self-service booking from tutor's availability slots
- Access to learning materials and the AI Tutor

### AI Tutor *(planned — Phase 4)*
- Student uploads a photo of a math problem
- Google Gemini Flash (vision) solves it step by step
- LaTeX formula rendering via KaTeX
- Full session history stored in the database

### Email notifications *(planned — Phase 3)*
- Automated messages to parents after each lesson
- Monthly payment summaries
- Powered by Resend

---

## 🛠️ Tech Stack

| Layer       | Technology                                     |
|-------------|------------------------------------------------|
| Frontend    | Next.js 16 (App Router, Turbopack)             |
| Language    | TypeScript                                     |
| Styling     | Tailwind CSS v4 + shadcn/ui (Nova / Base UI)   |
| Animation   | Framer Motion                                  |
| Backend     | Next.js Server Actions                         |
| Database    | Supabase (PostgreSQL + Row-Level Security)     |
| Auth        | Supabase Auth (email + password)               |
| Storage     | Supabase Storage                               |
| AI          | Google Gemini Flash *(planned)*                |
| Email       | Resend *(planned)*                             |
| Payments    | Stripe + BLIK *(planned)*                      |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Supabase account (free tier is enough)
- npm / yarn / pnpm

### Installation

```bash
git clone https://github.com/peatahaya/binara.git
cd binara
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database setup

In the Supabase SQL Editor, run the scripts from `/supabase/migrations/` in this order: schema → policies → seed.

### Run locally

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

> **Note:** The UI is in Polish — the app targets the Polish tutoring market.

---

## 📁 Project Structure

```
binara/
├── app/
│   ├── (auth)/              # login, register, auth callback
│   ├── tutor/               # tutor panel
│   │   ├── page.tsx         # dashboard
│   │   ├── uczniowie/       # students
│   │   ├── lekcje/          # lessons
│   │   └── platnosci/       # payments
│   └── student/             # student panel
│       ├── layout.tsx       # role check
│       └── page.tsx
├── components/
│   ├── ui/                  # shadcn/ui
│   ├── glass-card.tsx
│   └── site-nav.tsx
├── lib/
│   ├── auth/                # get-profile, helpers
│   └── supabase/            # client + server
└── middleware.ts            # role-based routing guard
```

---

## 🗺️ Roadmap

- [x] **Phase 1** — Role separation (tutor / student), middleware, profiles
- [ ] **Phase 2** — Student panel with live data (dashboard, lessons, payments, booking)
- [ ] **Phase 3** — Email notifications for parents (Resend)
- [ ] **Phase 4** — AI Tutor (Gemini Flash + KaTeX)
- [ ] **Phase 5** — Learning materials (PDFs, public student links)
- [ ] **Phase 6** — Online payments (Stripe + BLIK)
- [ ] **Phase 7** — Monthly PDF reports
- [ ] **Phase 8** — Realtime chat (Supabase Realtime)

---

## 🎨 Design

Black-and-white UI inspired by minimalist aesthetics (X.com, Linear, Vercel) with a signature **aurora rainbow border** — an animated conic-gradient that reveals on hover. The logo: a lowercase `binara` wordmark with neon accents, late-70s computing vibe.

---

## 🔐 Security

- Row-Level Security (RLS) enabled on every table
- Middleware-protected `/tutor/*` and `/student/*` routes
- Role-based redirects after login
- Password-based auth (magic links rejected — Polish email providers' link scanners consume the OTP)

---

## 👤 Author

**Piotrek** — junior Python developer and math tutor based near Toruń, Poland.

- GitHub: [@peatahaya](https://github.com/peatahaya)

---

## 📄 License

MIT
