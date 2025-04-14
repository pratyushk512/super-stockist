
import { MainNav } from "@/components/admin/main-nav"
import ViewInvoice from "../view-invoice"
import { Search } from "@/components/admin/search"
import { UserNav } from "@/components/admin/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"


export default async function InvoicePage({ params }: { params: Promise<{ invoiceNo: string }> }) {

  const { invoiceNo } = await params;
  console.log(invoiceNo)
  
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
      <div className="container mx-auto p-4">
        <ViewInvoice invoiceNo={invoiceNo} />
      </div>
    </>
  )
}