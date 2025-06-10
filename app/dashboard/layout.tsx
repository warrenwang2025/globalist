import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-50 dark:bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72 w-full">
        {children}
      </main>
    </div>
  )
}