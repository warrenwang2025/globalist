import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full relative">
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-background dark:bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72 w-full min-h-screen">
        <div className="md:hidden">
          <Sidebar />
        </div>
        <div className="pt-16 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}