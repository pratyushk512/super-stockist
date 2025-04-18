
import { MainNav } from "@/components/sales/sales-nav"
import OrderDisplay from "../orderDisplay"
import { Search } from "@/components/admin/search"
import { UserNav } from "@/components/admin/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"


export default async function OrderPage({ params }: { params: Promise<{ orderNo: number }> }) {

  const { orderNo } = await params;
  console.log(orderNo)
  
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
        <OrderDisplay orderNo={orderNo} />
      </div>
    </>
  )
}