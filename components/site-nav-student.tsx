"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { GraduationCap, BookOpen, CreditCard, CalendarCheck, FolderOpen, LogOut, Sparkles } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const links = [
  { href: "/student", label: "Panel", icon: GraduationCap, exact: true },
  { href: "/student/lekcje", label: "Moje lekcje", icon: BookOpen },
  { href: "/student/platnosci", label: "Płatności", icon: CreditCard },
  { href: "/student/umow", label: "Umów lekcję", icon: CalendarCheck },
  { href: "/student/ai-tutor", label: "AI Tutor", icon: Sparkles },
  { href: "/student/materialy", label: "Materiały", icon: FolderOpen },
]

export function SiteNavStudent() {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid oklch(1 0 0 / 0.06)",
      }}
    >
      <Link href="/student" className="text-lg tracking-tight">
        <span style={{ fontFamily: "var(--font-fraunces)", fontWeight: 400 }}>binara</span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1",
                isActive
                  ? "bg-white/8 text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          )
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="ml-2 text-white/50 hover:text-white"
        >
          <LogOut className="size-4" />
          Wyloguj
        </Button>
      </div>
    </nav>
  )
}
