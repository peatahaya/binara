"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { GraduationCap, BookOpen, Users, CreditCard, CalendarCheck, LogOut } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const tutorLinks = [
  { href: "/tutor", label: "Dashboard", icon: GraduationCap },
  { href: "/tutor/uczniowie", label: "Uczniowie", icon: Users },
  { href: "/tutor/lekcje", label: "Lekcje", icon: BookOpen },
  { href: "/tutor/platnosci", label: "Płatności", icon: CreditCard },
]

const studentLinks = [
  { href: "/student", label: "Dashboard", icon: GraduationCap },
  { href: "/student/umow", label: "Umów lekcję", icon: CalendarCheck },
]

interface SiteNavProps {
  role: "tutor" | "student"
}

export function SiteNav({ role }: SiteNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const links = role === "tutor" ? tutorLinks : studentLinks

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
      <Link href={role === "tutor" ? "/tutor" : "/student"} className="text-lg tracking-tight">
        <span className="font-bold">mathrix</span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
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
