import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth/get-profile"
import { SiteNavStudent } from "@/components/site-nav-student"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getProfile()

  if (!user || profile?.role !== "student") redirect("/login")

  if (!profile.student_id) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteNavStudent />
        <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
          <div className="rounded-md bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 text-sm text-yellow-400">
            Twoje konto nie jest połączone z kartoteką ucznia, skontaktuj się z korepetytorem.
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavStudent />
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
