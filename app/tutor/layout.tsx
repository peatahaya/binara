import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SiteNav } from "@/components/site-nav"

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav role="tutor" />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  )
}
