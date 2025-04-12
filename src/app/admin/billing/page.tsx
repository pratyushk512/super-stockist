import { MainNav } from "@/components/admin/main-nav"
import { InvoiceTable } from "./invoice-table"
import { Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/admin/user-nav"

export default function InvoiceDashboard() {
  return (
    <>
    <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Invoice Management</h1>
      <InvoiceTable />
    </div>
    </>
  )
}
